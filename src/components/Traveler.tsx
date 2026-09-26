import { useEffect, useMemo, useRef, useState, type PointerEvent, type TouchEvent, type WheelEvent } from 'react'
import { countryById, journeys } from '../data'
import { formatDuration, formatKm, money } from '../format'
import { CLOSE_KM, distanceToRoute, downsample, fetchRoute, haversine, ON_THE_WAY_KM, searchPlaces, straightLine } from '../geo'
import { readHere, watchHere } from '../locate'
import { useSat } from '../store'
import { categories, type CategoryId, type Destination, type LatLng, type Role } from '../types'
import { CategoryIcon } from './Icons'
import { Menu } from './Menu'
import { Photo } from './Photo'
import { PlacePanel } from './PlacePanel'
import { RoadMap } from './RoadMap'

type Notice = { id: string; placeId: string; km: number }
type RouteMeta = { km: number; seconds: number; approx: boolean }

export function Traveler({ onJoin, onDesk }: { onJoin: (role: Role) => void; onDesk: () => void }) {
  const { user, places, orders } = useSat()
  const country = countryById(user?.country ?? 'ge')
  const [here, setHere] = useState<LatLng>(country.start)
  const [live, setLive] = useState(false)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [remote, setRemote] = useState<Destination[]>([])
  const [dest, setDest] = useState<Destination | null>(null)
  const [route, setRoute] = useState<LatLng[]>([])
  const [meta, setMeta] = useState<RouteMeta | null>(null)
  const [routing, setRouting] = useState(false)
  const [riding, setRiding] = useState(false)
  const [rider, setRider] = useState<LatLng | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [picked, setPicked] = useState<CategoryId[]>(user?.categories ?? [])
  const [notices, setNotices] = useState<Notice[]>([])
  const [requestsOpen, setRequestsOpen] = useState(false)
  const [askNotify, setAskNotify] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const timer = useRef<number | null>(null)
  const grabY = useRef(0)
  const grabMoved = useRef(false)
  const touchY = useRef(0)
  const seen = useRef(new Set<string>())

  useEffect(() => {
    setHere(country.start)
    setLive(false)
    setRoute([])
    setDest(null)
    setMeta(null)
    setQuery('')
    setRider(null)
    let cancel = false
    void readHere().then((next) => {
      if (cancel || !next) return
      if (haversine(next, country.start) < 450) {
        setHere(next)
        setLive(true)
      }
    })
    return () => {
      cancel = true
    }
  }, [country.id, country.start])

  useEffect(() => {
    if (!live) return
    let stop = () => {}
    let cancelled = false
    void watchHere((point) => setHere(point)).then((clear) => {
      if (cancelled) clear()
      else stop = clear
    })
    return () => {
      cancelled = true
      stop()
    }
  }, [live])

  useEffect(() => {
    const q = query.trim()
    if (q.length < 3) {
      setRemote([])
      return
    }
    const handle = window.setTimeout(() => {
      searchPlaces(q, country.id).then(setRemote).catch(() => setRemote([]))
    }, 350)
    return () => window.clearTimeout(handle)
  }, [query, country.id])

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [])

  const filter = picked.length ? picked : categories.map((cat) => cat.id)
  const inCountry = useMemo(
    () => places.filter((place) => place.country === country.id && place.categories.some((cat) => filter.includes(cat))),
    [places, country.id, filter],
  )

  const mapped = useMemo(() => {
    return inCountry.map((place) => {
      if (route.length < 2) {
        return { place, km: haversine(here, place), along: 0, onRoad: true }
      }
      const hit = distanceToRoute(place, route)
      return { place, km: hit.km, along: hit.along, onRoad: hit.km <= ON_THE_WAY_KM }
    })
  }, [inCountry, route, here])

  const list = useMemo(() => {
    if (route.length < 2) return [...mapped].sort((a, b) => a.km - b.km)
    const along = mapped.filter((row) => row.onRoad).sort((a, b) => a.along - b.along)
    if (along.length) return along
    return [...mapped].sort((a, b) => a.km - b.km).slice(0, 3)
  }, [mapped, route.length])

  useEffect(() => {
    const point = rider ?? (live ? here : null)
    if (!point) return
    if (rider && route[0] && haversine(point, route[0]) < 0.8) return
    const progress = rider && route.length > 1 ? distanceToRoute(point, route).along : null
    for (const row of mapped) {
      const near = haversine(point, row.place)
      const passing =
        progress !== null && row.onRoad && row.km <= CLOSE_KM && Math.abs(row.along - progress) < 0.045
      if (!passing && near > CLOSE_KM) continue
      if (seen.current.has(row.place.id)) continue
      if (route.length > 1 && !row.onRoad) continue
      seen.current.add(row.place.id)
      setNotices((prev) => [{ id: `${row.place.id}-${Date.now()}`, placeId: row.place.id, km: near }, ...prev].slice(0, 2))
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        new Notification('A place is close', { body: `${row.place.name} · ${row.place.village}` })
      }
      break
    }
  }, [rider, here, live, mapped, route])

  const q = query.trim().toLowerCase()
  const journeyHits = journeys
    .filter((item) => item.country === country.id)
    .filter((item) => !q || item.label.toLowerCase().includes(q) || item.detail.toLowerCase().includes(q))
    .slice(0, 6)
  const placeHits = q
    ? inCountry
        .filter((place) => place.name.toLowerCase().includes(q) || place.village.toLowerCase().includes(q))
        .slice(0, 4)
    : []
  const active = mapped.find((row) => row.place.id === activeId) ?? null
  const mine = user ? orders.filter((order) => order.travelerId === user.id) : []
  const quietRoad = route.length > 1 && !mapped.some((row) => row.onRoad)

  function stopRide() {
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = null
    setRiding(false)
    setRider(null)
  }

  function startRide() {
    if (route.length < 2) return
    if (timer.current) window.clearTimeout(timer.current)
    seen.current.clear()
    setNotices([])
    const samples = downsample(route, 84)
    let index = 0
    setRiding(true)
    setRider(samples[0])
    const tick = () => {
      index += 1
      if (index >= samples.length) {
        setRider(samples[samples.length - 1])
        setRiding(false)
        timer.current = null
        return
      }
      setRider(samples[index])
      timer.current = window.setTimeout(tick, 140)
    }
    timer.current = window.setTimeout(tick, 140)
    setSheetOpen(false)
  }

  async function go(next: Destination) {
    setDest(next)
    setQuery(next.label)
    setOpen(false)
    setRouting(true)
    stopRide()
    seen.current.clear()
    setNotices([])
    if (typeof Notification !== 'undefined' && Notification.permission === 'default' && localStorage.getItem('sat-notify') !== 'no') {
      setAskNotify(true)
    }
    try {
      const found = await fetchRoute(here, next)
      if (found) {
        setRoute(found.line)
        setMeta({ km: found.meters / 1000, seconds: found.seconds, approx: false })
      } else {
        const km = haversine(here, next)
        setRoute(straightLine(here, next))
        setMeta({ km, seconds: (km / 55) * 3600, approx: true })
      }
    } catch {
      const km = haversine(here, next)
      setRoute(straightLine(here, next))
      setMeta({ km, seconds: (km / 55) * 3600, approx: true })
    } finally {
      setRouting(false)
    }
    if (next.placeId) setActiveId(next.placeId)
  }

  function toggle(id: CategoryId) {
    setPicked((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  function onGrabDown(event: PointerEvent<HTMLDivElement>) {
    grabY.current = event.clientY
    grabMoved.current = false
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      /* a drag still resolves on pointerup */
    }
  }

  function onGrabMove(event: PointerEvent<HTMLDivElement>) {
    if (Math.abs(event.clientY - grabY.current) > 8) grabMoved.current = true
  }

  function onGrabUp(event: PointerEvent<HTMLDivElement>) {
    const dy = event.clientY - grabY.current
    if (dy > 28) setSheetOpen(false)
    else if (dy < -28) setSheetOpen(true)
    else if (!grabMoved.current) setSheetOpen((open) => !open)
  }

  return (
    <div className={`traveler${active ? ' has-sheet' : ''}${sheetOpen ? ' is-list-open' : ''}`}>
      <div className="map-full">
        <RoadMap
          countryId={country.id}
          here={here}
          rider={rider}
          route={route}
          places={mapped}
          activeId={activeId}
          onSelect={setActiveId}
          signature={`${dest?.label ?? 'home'}:${route.length}:${country.id}:${live ? 'live' : 'map'}`}
        />
      </div>

      <header className="topbar">
        <Menu onJoin={onJoin} onRequests={user ? () => setRequestsOpen(true) : undefined} onDesk={user?.role === 'host' ? onDesk : undefined} />
        <form
          className="search glass"
          onSubmit={(event) => {
            event.preventDefault()
            const first = placeHits[0]
            if (first) {
              void go({ label: first.name, detail: first.village, lat: first.lat, lng: first.lng, placeId: first.id })
              return
            }
            const journey = journeyHits[0]
            if (journey) void go(journey)
            else if (remote[0]) void go(remote[0])
          }}
        >
          <label className="sr" htmlFor="direction">
            Where are you heading?
          </label>
          <input
            id="direction"
            value={query}
            placeholder="Where are you heading?"
            autoComplete="off"
            onChange={(event) => {
              setQuery(event.target.value)
              setOpen(true)
            }}
            onClick={() => setOpen(true)}
            onFocus={() => setOpen(true)}
            onBlur={() => window.setTimeout(() => setOpen(false), 180)}
          />
          {dest && (
            <button
              type="button"
              className="text-btn"
              onClick={() => {
                stopRide()
                setDest(null)
                setRoute([])
                setMeta(null)
                setQuery('')
              }}
            >
              Clear
            </button>
          )}
          {open && (
            <div className="suggest glass">
              {journeyHits.map((item) => (
                <button type="button" key={`${item.label}-${item.lat}`} onMouseDown={() => void go(item)}>
                  <strong>{item.label}</strong>
                  <span>{item.detail}</span>
                </button>
              ))}
              {placeHits.map((place) => (
                <button
                  type="button"
                  key={place.id}
                  onMouseDown={() =>
                    void go({ label: place.name, detail: place.village, lat: place.lat, lng: place.lng, placeId: place.id })
                  }
                >
                  <strong>{place.name}</strong>
                  <span>Place · {place.village}</span>
                </button>
              ))}
              {remote.map((item) => (
                <button type="button" key={`${item.lat}-${item.lng}`} onMouseDown={() => void go(item)}>
                  <strong>{item.label}</strong>
                  <span>{item.detail}</span>
                </button>
              ))}
              {q && !journeyHits.length && !placeHits.length && !remote.length && <p className="muted">Nothing under that name yet.</p>}
            </div>
          )}
        </form>
      </header>

      <div className="cats">
        <button type="button" className={!picked.length || picked.length === categories.length ? 'cat is-on' : 'cat'} onClick={() => setPicked([])}>
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={picked.includes(cat.id) ? 'cat is-on' : 'cat'}
            onClick={() => toggle(cat.id)}
          >
            <CategoryIcon id={cat.id} />
            {cat.label}
          </button>
        ))}
      </div>

      <aside className="rail glass">
        <div
          className="rail-top"
          onPointerDown={onGrabDown}
          onPointerMove={onGrabMove}
          onPointerUp={onGrabUp}
          onClick={() => {
            if (grabMoved.current) {
              grabMoved.current = false
              return
            }
            setSheetOpen((open) => !open)
          }}
        >
        <div className="rail-grab" />
        <div className="rail-head">
          <div>
            <h2>{route.length > 1 ? 'On this road' : `In ${country.name}`}</h2>
            <p>
              {routing && 'Drawing the road…'}
              {!routing && meta && (
                <>
                  {dest?.label} · {formatKm(meta.km)} · {formatDuration(meta.seconds)}
                  {meta.approx ? ' · direct line' : ''}
                </>
              )}
              {!routing && !meta && (live ? 'Using where you are.' : `Starting in ${country.start.label}.`)}
            </p>
          </div>
          {route.length > 1 && !routing && (
            <button type="button" className={riding ? 'go-btn is-on' : 'go-btn'} onPointerDown={(event) => event.stopPropagation()} onClick={riding ? stopRide : startRide}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M3.8 10.8 20.2 3.6l-7.2 16.4-2.1-6.7-7.1-2.5z" />
              </svg>
              {riding ? 'End' : 'Start'}
            </button>
          )}
        </div>
        </div>
        {quietRoad && <p className="muted rail-note">Nothing sits on this line. The nearest places are still listed.</p>}
        <div
          className="rail-list"
          onWheel={(event: WheelEvent<HTMLDivElement>) => {
            if (!sheetOpen && event.deltaY > 0) setSheetOpen(true)
          }}
          onTouchStart={(event: TouchEvent<HTMLDivElement>) => {
            touchY.current = event.touches[0].clientY
          }}
          onTouchMove={(event: TouchEvent<HTMLDivElement>) => {
            const dy = event.touches[0].clientY - touchY.current
            if (!sheetOpen && dy < -18) setSheetOpen(true)
          }}
        >
          {list.map((row) => (
            <button
              key={row.place.id}
              type="button"
              className={row.place.id === activeId ? 'place-card is-on' : 'place-card'}
              onClick={() => setActiveId(row.place.id)}
            >
              <span className="card-photo">
                <Photo src={row.place.cover} alt="" />
              </span>
              <span>
                <strong>{row.place.name}</strong>
                <em>
                  {row.place.village} · {row.place.categories[0]}
                </em>
                <small>
                  {route.length > 1
                    ? row.onRoad
                      ? `On the way · ${formatKm(row.km)}`
                      : `A little off · ${formatKm(row.km)}`
                    : formatKm(row.km)}
                </small>
              </span>
              <b>{row.place.reviews ? row.place.rating.toFixed(1) : 'New'}</b>
            </button>
          ))}
        </div>
      </aside>

      <div className="notices">
        {askNotify && (
          <div className="ask glass">
            <p>Sat can tap you when a place is close.</p>
            <div>
              <button
                type="button"
                className="btn btn-primary btn-small"
                onClick={() => {
                  Notification.requestPermission().finally(() => {
                    localStorage.setItem('sat-notify', 'asked')
                    setAskNotify(false)
                  })
                }}
              >
                Allow
              </button>
              <button
                type="button"
                className="text-btn"
                onClick={() => {
                  localStorage.setItem('sat-notify', 'no')
                  setAskNotify(false)
                }}
              >
                Not now
              </button>
            </div>
          </div>
        )}
        {notices.map((notice) => {
          const place = places.find((item) => item.id === notice.placeId)
          if (!place) return null
          return (
            <button
              key={notice.id}
              type="button"
              className="notice glass"
              onClick={() => {
                setActiveId(place.id)
                setNotices((prev) => prev.filter((item) => item.id !== notice.id))
              }}
            >
              <span className="card-photo">
                <Photo src={place.cover} alt="" />
              </span>
              <span>
                <strong>Close to you</strong>
                <em>
                  {place.name} · {formatKm(notice.km)}
                </em>
              </span>
            </button>
          )
        })}
      </div>

      {requestsOpen && (
        <aside className="requests glass">
          <header>
            <h2>Your requests</h2>
            <button type="button" className="text-btn" onClick={() => setRequestsOpen(false)}>
              Close
            </button>
          </header>
          {mine.length === 0 && <p className="muted">When you ask a host for something, it will wait here.</p>}
          <ul>
            {mine.map((order) => (
              <li key={order.id}>
                <strong>
                  {order.qty} × {order.productName}
                </strong>
                <span>
                  {money(order.currency, order.total)} · {order.status}
                </span>
              </li>
            ))}
          </ul>
        </aside>
      )}

      {active && (
        <PlacePanel
          place={active.place}
          km={active.km}
          onRoad={active.onRoad}
          routed={route.length > 1}
          onClose={() => setActiveId(null)}
        />
      )}
    </div>
  )
}
