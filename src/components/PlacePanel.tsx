import { useEffect, useState, useRef } from 'react'
import { countryById } from '../data'
import { formatKm, money } from '../format'
import { useSat } from '../store'
import type { Place } from '../types'
import { Photo } from './Photo'
import { Stitch } from './Mark'

function Stars({ value }: { value: number }) {
  return (
    <span className="stars" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} viewBox="0 0 20 20" className={n <= Math.round(value) ? 'is-on' : ''}>
          <path d="M10 1.8 12.4 7l5.6.5-4.2 3.6 1.3 5.4L10 13.8 4.9 16.5 6.2 11 2 7.5 7.6 7z" />
        </svg>
      ))}
    </span>
  )
}

export function PlacePanel({
  place,
  km,
  onRoad,
  routed,
  onClose,
}: {
  place: Place
  km: number
  onRoad: boolean
  routed: boolean
  onClose: () => void
}) {
  const dragStart = useRef<number | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => { dialog.current?.showModal() }, [])
  const { user, orders, placeOrder } = useSat()
  const [productId, setProductId] = useState(place.products[0]?.id ?? '')
  const [qty, setQty] = useState(1)
  const [sent, setSent] = useState(false)
  const currency = countryById(place.country).currency
  const product = place.products.find((item) => item.id === productId) ?? place.products[0]
  const latest = orders.find((order) => order.placeId === place.id && order.travelerId === user?.id)

  useEffect(() => {
    setProductId(place.products[0]?.id ?? '')
    setQty(1)
    setSent(false)
  }, [place.id, place.products])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!product) return null
  const total = product.price * qty
  const traveler = user?.role === 'traveler' ? user : null

  return (
    <dialog ref={dialog} className="sheet glass place-dialog" aria-label={place.name} onCancel={onClose}>
      <div className="sheet-cover" onPointerDown={event => { dragStart.current = event.clientY }} onPointerUp={event => { if (dragStart.current !== null && event.clientY - dragStart.current > 70) onClose(); dragStart.current = null }}>
        <span className="detail-grabber" aria-hidden="true"/>
        <Photo src={place.cover} alt="" />
        <button type="button" className="close" onClick={onClose}>
          Close
        </button>
        <div className="sheet-title">
          <h2>{place.name}</h2>
          <p>
            {place.village}, {place.region}
          </p>
        </div>
      </div>
      <div className="sheet-body">
        <div className="rating-row">
          {place.reviews > 0 ? (
            <>
              <strong>{place.rating.toFixed(1)}</strong>
              <Stars value={place.rating} />
              <span>{place.reviews} notes</span>
            </>
          ) : (
            <span>New on Sat</span>
          )}
          <span className="away">
            {routed ? (onRoad ? `On the way · ${formatKm(km)} off the line` : `${formatKm(km)} off this road`) : `${formatKm(km)} from you`}
          </span>
        </div>
        <p className="story">{place.story}</p>
        <Stitch line="rgba(30,40,48,0.25)" />
        <h3>From the place</h3>
        <div className="products">
          {place.products.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.id === product.id ? 'product is-picked' : 'product'}
              onClick={() => {
                setProductId(item.id)
                setSent(false)
              }}
            >
              <span className="product-photo">
                <Photo src={item.image} alt="" />
              </span>
              <span>
                <strong>{item.name}</strong>
                <em>{item.detail}</em>
              </span>
              <b>{money(currency, item.price)}</b>
            </button>
          ))}
        </div>
        <h3>Notes from the road</h3>
        {place.comments.length === 0 && <p className="muted">No notes yet. You could be the first to stop.</p>}
        <ul className="comments">
          {place.comments.map((comment) => (
            <li key={comment.id} className="comment">
              <div>
                <strong>{comment.author}</strong>
                <Stars value={comment.stars} />
              </div>
              <p>{comment.text}</p>
            </li>
          ))}
        </ul>
        {latest && (
          <p className="latest">
            Your last request · {latest.productName} · {latest.status}
          </p>
        )}
      </div>
      <footer className="order-bar">
        {traveler ? (
          <>
            <div className="stepper">
              <button type="button" onClick={() => setQty((n) => Math.max(1, n - 1))} aria-label="Less">
                −
              </button>
              <strong>{qty}</strong>
              <button type="button" onClick={() => setQty((n) => Math.min(12, n + 1))} aria-label="More">
                +
              </button>
              <span>
                {qty} {product.unit}
              </span>
            </div>
            {sent ? (
              <p className="sent">Request saved on this device.</p>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  placeOrder({
                    place,
                    traveler,
                    productName: product.name,
                    qty,
                    unit: product.unit,
                    total,
                  })
                  setSent(true)
                }}
              >
                Request · {money(currency, total)}
              </button>
            )}
          </>
        ) : (
          <p className="muted">Create a traveler profile in the Sat menu to send a request.</p>
        )}
      </footer>
    </dialog>
  )
}
