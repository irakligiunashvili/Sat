import { useMemo, useState } from 'react'
import { countryById } from '../data'
import { ago, money } from '../format'
import { useSat } from '../store'
import type { Order } from '../types'
import { Menu } from './Menu'
import { Photo } from './Photo'
import { Stitch } from './Mark'

function unitLabel(qty: number, unit: string) {
  if (qty === 1 || unit.endsWith('s')) return unit
  return `${unit}s`
}

function EasyOrders({
  orders,
  onDecide,
  onDetails,
}: {
  orders: Order[]
  onDecide: (orderId: string, status: 'accepted' | 'declined') => void
  onDetails: () => void
}) {
  const order = orders[0]

  return (
    <main className="easy-screen">
      <div className="home-bg" />
      <div className="home-veil home-veil-strong" />
      <header className="easy-top">
        <button type="button" className="btn btn-primary" onClick={onDetails}>
          Details mode
        </button>
      </header>
      {order ? (
        <section className="easy-card glass" key={order.id}>
          <p className="role-kicker">New order</p>
          <p className="easy-qty">{order.qty}</p>
          <p className="easy-unit">{unitLabel(order.qty, order.unit)}</p>
          <h1>{order.productName}</h1>
          <p className="easy-who">{order.travelerName}</p>
          {orders.length > 1 && <p className="muted easy-more">{orders.length - 1} more waiting</p>}
          <div className="easy-actions">
            <button type="button" className="btn btn-decline" onClick={() => onDecide(order.id, 'declined')}>
              Decline
            </button>
            <button type="button" className="btn btn-sage" onClick={() => onDecide(order.id, 'accepted')}>
              Accept
            </button>
          </div>
        </section>
      ) : (
        <section className="easy-card glass">
          <p className="role-kicker">New orders</p>
          <h1>You’re clear</h1>
          <p className="muted">New orders will show up here.</p>
        </section>
      )}
    </main>
  )
}

export function HostDesk({ onMap }: { onMap: () => void }) {
  const { user, places, orders, decide } = useSat()
  const [note, setNote] = useState('')
  const [easy, setEasy] = useState(false)
  const place = places.find((item) => item.id === user?.placeId)
  const country = countryById(user?.country ?? place?.country ?? 'ge')

  const mine = useMemo(
    () => orders.filter((order) => order.hostId === user?.id).sort((a, b) => b.createdAt - a.createdAt),
    [orders, user?.id],
  )
  const pending = mine.filter((order) => order.status === 'pending')
  const accepted = mine.filter((order) => order.status === 'accepted')
  const sold = accepted.reduce((sum, order) => sum + order.qty, 0)
  const revenue = accepted.reduce((sum, order) => sum + order.total, 0)

  const byProduct = useMemo(() => {
    const bucket = new Map<string, { qty: number; total: number; unit: string }>()
    for (const order of accepted) {
      const row = bucket.get(order.productName) ?? { qty: 0, total: 0, unit: order.unit }
      row.qty += order.qty
      row.total += order.total
      bucket.set(order.productName, row)
    }
    return [...bucket.entries()].sort((a, b) => b[1].qty - a[1].qty)
  }, [accepted])

  const week = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date()
      day.setHours(0, 0, 0, 0)
      day.setDate(day.getDate() - (6 - index))
      const next = new Date(day)
      next.setDate(day.getDate() + 1)
      const qty = accepted
        .filter((order) => order.createdAt >= day.getTime() && order.createdAt < next.getTime())
        .reduce((sum, order) => sum + order.qty, 0)
      return {
        label: day.toLocaleDateString(undefined, { weekday: 'narrow' }),
        qty,
        today: index === 6,
      }
    })
  }, [accepted])
  const peak = Math.max(1, ...week.map((day) => day.qty))

  if (!user) return null

  if (easy) {
    return <EasyOrders orders={pending} onDecide={decide} onDetails={() => setEasy(false)} />
  }

  return (
    <main className="desk-screen">
      <div className="home-bg" />
      <div className="home-veil home-veil-strong" />
      <div className="desk">
        <header className="desk-top">
          <Menu onMap={onMap} />
          <button type="button" className="btn btn-primary" onClick={() => setEasy(true)}>
            Easy mode
          </button>
        </header>

        <section className="hero">
          <Photo src={place?.cover ?? ''} alt="" />
          <div>
            <p className="role-kicker">Host desk</p>
            <h1>{place?.name ?? 'Your place'}</h1>
            <p>
              {place ? `${place.village}, ${place.region}` : country.name} · {country.name}
            </p>
          </div>
        </section>

        <section className="stat-grid">
          <article className="stat glass">
            <span>Sold through Sat</span>
            <strong>{sold}</strong>
            <em>{sold === 1 ? 'thing' : 'things'} this season</em>
          </article>
          <article className="stat glass">
            <span>Taken in</span>
            <strong>{money(country.currency, revenue)}</strong>
            <em>from accepted orders</em>
          </article>
          <article className="stat glass">
            <span>Waiting</span>
            <strong>{pending.length}</strong>
            <em>{pending.length === 1 ? 'request on the desk' : 'requests on the desk'}</em>
          </article>
          <article className="stat glass">
            <span>Notes</span>
            <strong>{place && place.reviews > 0 ? place.rating.toFixed(1) : '—'}</strong>
            <em>{place?.reviews ? `${place.reviews} from the road` : 'No notes yet'}</em>
          </article>
        </section>

        <section className="glass panel">
          <header className="panel-head">
            <h2>This week</h2>
            <Stitch line="rgba(30,40,48,0.28)" />
          </header>
          <div className="chart" aria-hidden="true">
            {week.map((day, index) => (
              <div key={index} className={day.today ? 'bar is-today' : 'bar'}>
                <b>{day.qty || ''}</b>
                <span style={{ height: `${day.qty === 0 ? 8 : Math.max(16, (day.qty / peak) * 100)}%` }} />
                <em>{day.label}</em>
              </div>
            ))}
          </div>
          {sold === 0 && <p className="muted">The week is still quiet. Accepted orders will stand up here.</p>}
        </section>

        <section className="split">
          <div className="glass panel">
            <header className="panel-head">
              <h2>On the desk</h2>
              {note && <p className="flash">{note}</p>}
            </header>
            {pending.length === 0 && <p className="muted">You’re clear. New travelers will show up here.</p>}
            <ul className="order-list">
              {pending.map((order) => (
                <li key={order.id} className="order-card">
                  <div>
                    <strong>{order.travelerName}</strong>
                    <span>
                      {order.qty} × {order.productName}
                    </span>
                    <em>
                      {money(order.currency, order.total)} · {ago(order.createdAt)}
                    </em>
                  </div>
                  <div className="order-actions">
                    <button
                      type="button"
                      className="btn btn-quiet"
                      onClick={() => {
                        decide(order.id, 'declined')
                        setNote(`Declined ${order.travelerName}.`)
                      }}
                    >
                      Decline
                    </button>
                    <button
                      type="button"
                      className="btn btn-sage"
                      onClick={() => {
                        decide(order.id, 'accepted')
                        setNote(`Accepted. ${order.travelerName} can stop by.`)
                      }}
                    >
                      Accept
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {mine.some((order) => order.status !== 'pending') && <h3>Earlier</h3>}
            <ul className="history">
              {mine
                .filter((order) => order.status !== 'pending')
                .slice(0, 6)
                .map((order) => (
                  <li key={order.id}>
                    <span>
                      {order.travelerName} · {order.qty} × {order.productName}
                    </span>
                    <em className={order.status}>{order.status}</em>
                  </li>
                ))}
            </ul>
          </div>

          <div className="glass panel">
            <header className="panel-head">
              <h2>The shelf</h2>
            </header>
            <ul className="shelf">
              {(place?.products ?? []).map((item) => {
                const row = byProduct.find(([name]) => name === item.name)
                return (
                  <li key={item.id}>
                    <span className="card-photo">
                      <Photo src={item.image} alt="" />
                    </span>
                    <span>
                      <strong>{item.name}</strong>
                      <em>
                        {money(country.currency, item.price)} / {item.unit}
                      </em>
                    </span>
                    <b>{row ? `${row[1].qty} sold` : '—'}</b>
                  </li>
                )
              })}
            </ul>
            {byProduct.length > 0 && (
              <p className="muted shelf-note">
                {byProduct.map(([name, row]) => `${row.qty} ${name}`).join(' · ')}
              </p>
            )}
          </div>
        </section>
        <p className="home-foot dark">People. Places. Home.</p>
      </div>
    </main>
  )
}
