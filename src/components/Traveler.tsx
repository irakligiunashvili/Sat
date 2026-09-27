import { useEffect, useMemo, useRef, useState, type PointerEvent, type TouchEvent, type WheelEvent } from 'react'
import { countryById, journeys } from '../data'
import { formatDuration, formatKm, money } from '../format'
import { CLOSE_KM, distanceToRoute, downsample, fetchRoute, haversine, ON_THE_WAY_KM, searchPlaces, straightLine } from '../geo'
import { readHere, watchHere } from '../locate'
import { useSat } from '../store'
import { categories, type CategoryId, type Destination, type LatLng, type Role } from '../types'
import { Ask } from './Ask'
import { CategoryIcon } from './Icons'
import { Menu } from './Menu'
import { Photo } from './Photo'
import { PlacePanel } from './PlacePanel'
import { RoadMap } from './RoadMap'

type Notice = { id: string; placeId: string; km: number }
type RouteMeta = { km: number; seconds: number; approx: boolean }

export function Traveler({ onJoin, onDesk }: { onJoin: (role: Role) => void; onDesk: () => void }) {
  const { user, places, orders } = useSat()
  const country = countryById(user?.country ?? 'md')
  const [here, setHere] = useState<LatLng>(country.start)
  const [live, setLive] = useState(false)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const searchInput = useRef<HTMLInputElement>(null)
  const [searchBounds, setSearchBounds] = useState({ top: 120, height: 320 })

  useEffect(() => {
    if (!open) return
    const viewport = window.visualViewport
    const update = () => {
      const bottom = searchInput.current?.closest('header')?.getBoundingClientRect().bottom ?? 110
      const top = bottom + 10
      const visibleBottom = (viewport?.height ?? window.innerHeight) + (viewport?.offsetTop ?? 0)
      setSearchBounds({ top, height: Math.max(0, visibleBottom - top - 16) })
    }
    update()
    viewport?.addEventListener('resize', update)
    viewport?.addEventListener('scroll', update)
    window.addEventListener('resize', update)
    return () => {
      viewport?.removeEventListener('resize', update)
      viewport?.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [open])
  const [remote, setRemote] = useState<Destination[]>([])
  const [searching, setSearching] = useState(false)
  const [searchMessage, setSearchMessage] = useState('')
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
  const routeRequest = useRef(0)
  const searchRequest = useRef(0)
  const [locationNote, setLocationNote] = useState('')
  const timer = useRef<number | null>(null)
  const grabY = useRef(0)
  const grabMoved = useRef(false)
  const touchY = useRef(0)
  const seen = useRef(new Set<string>())

  useEffect(() => {
    routeRequest.current += 1
    searchRequest.current += 1
    setSearching(false)
    setRemote([])
    setSearchMessage('')
    setRouting(false)
    stopRide()
    setActiveId(null)
    setHere(country.start)
    setLive(false)
    setRoute([])
    setDest(null)
    setMeta(null)
    setQuery('')
    setRider(null)

  }, [country.id, country.start])

  useEffect(() => {
    if (!live) return
    let stop = () => {}
    let cancelled = false
    void watchHere((point) => setHere(point)).then((clear) => {
      if (cancelled) clear()
      else stop = clear
    }).catch(() => setLive(false))
    return () => {
      cancelled = true
      stop()
    }
  }, [live])


  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [])

  useEffect(() => { setPicked(user?.categories ?? []) }, [user?.id])

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
    if (dest?.stopIds?.length) {
      const planned = dest.stopIds.flatMap(id => mapped.filter(row => row.place.id === id))
      return [...planned, ...mapped.filter(row => row.onRoad && !dest.stopIds!.includes(row.place.id)).sort((a,b) => a.along - b.along)]
    }
    const along = mapped.filter((row) => row.onRoad).sort((a, b) => a.along - b.along)
    return along
  }, [mapped, route.length, dest])

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
      // Nearby discoveries are shown in-app, including on iOS.
      break
    }
  }, [rider, here, live, mapped, route])

  const q = query.trim().toLowerCase()
  const journeyHits = journeys
    .filter((item) => item.country === country.id)
    .filter((item) => !q || item.label.toLowerCase().includes(q) || item.detail.toLowerCase().includes(q))
    .slice(0, 12)
  const placeHits = q
    ? inCountry
        .filter((place) => place.name.toLowerCase().includes(q))
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

  async function go(next: Destination, openDetails = true) {
    searchRequest.current += 1
    setSearching(false)
    setSearchMessage('')
    searchInput.current?.blur()
    const request = ++routeRequest.current
    setDest(next)
    setQuery(next.label)
    setOpen(false)
    setRouting(true)
    setRoute([])
    setMeta(null)
    setSheetOpen(false)
    setPicked([])
    setActiveId(null)
    stopRide()
    seen.current.clear()
    setNotices([])

    const planned = (next.stopIds ?? []).map(id => places.find(p => p.id === id)).filter((p): p is NonNullable<typeof p> => !!p)
    const via = planned.slice(0, -1)
    const checkpoints = [here, ...via, next]
    const fallbackLine = () => checkpoints.slice(1).flatMap((point, i) => straightLine(checkpoints[i], point))
    const fallbackKm = () => checkpoints.slice(1).reduce((sum, point, i) => sum + haversine(checkpoints[i], point), 0)
    try {
      const found = await fetchRoute(here, next, via)
      if (request !== routeRequest.current) return
      if (found) {
        setRoute(found.line)
        setMeta({ km: found.meters / 1000, seconds: found.seconds, approx: false })
      } else {
        const km = fallbackKm()
        setRoute(fallbackLine())
        setMeta({ km, seconds: (km / 55) * 3600, approx: true })
      }
    } catch {
      if (request !== routeRequest.current) return
      const km = fallbackKm()
      setRoute(fallbackLine())
      setMeta({ km, seconds: (km / 55) * 3600, approx: true })
    } finally {
      if (request === routeRequest.current) setRouting(false)
    }
    if (request === routeRequest.current && next.placeId && openDetails) setActiveId(next.placeId)
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

  }

  return (
    <div className={`traveler${open ? ' is-searching' : ''}${active ? ' has-sheet' : ''}${sheetOpen ? ' is-list-open' : ''}`}>
      <div className="map-full">
        <RoadMap
          countryId={country.id}
          here={here}
          rider={rider}
          route={route}
          places={mapped}
          activeId={activeId ?? dest?.placeId ?? null}
          onSelect={(id) => {
            const place = places.find((item) => item.id === id)
            if (place) void go({ label: place.name, detail: place.village, lat: place.lat, lng: place.lng, placeId: place.id }, false)
          }}
          signature={`${dest?.label ?? 'home'}:${route.length}:${country.id}:${live ? 'live' : 'map'}`}
        />
      </div>

      <header className="topbar">
        <form
          className="search glass"
          onSubmit={async (event) => {
            event.preventDefault()
            const first = placeHits.find(place => place.name.toLowerCase() === q)
            if (first) {
              void go({ label: first.name, detail: first.village, lat: first.lat, lng: first.lng, placeId: first.id })
              return
            }
            const journey = journeyHits.find(item => item.label.toLowerCase() === q)
            if (journey) void go(journey)
            else if (query.trim().length >= 3) {
              setOpen(true)
              setRemote([])
              setSearching(true)
              setSearchMessage('')
              const search = query.trim()
              const request = ++searchRequest.current
              try {
                const results = await searchPlaces(search, country.id)
                if (request !== searchRequest.current) return
                setRemote(results)
                if (!results.length) setSearchMessage('No destinations found. Try another town or village.')
              } catch {
                if (request === searchRequest.current) setSearchMessage('Could not search places. Check your connection and try again.')
              } finally {
                if (request === searchRequest.current) setSearching(false)
              }
            }
          }}
        >
          <label className="sr" htmlFor="direction">
            Where are you heading?
          </label>
          <input
            ref={searchInput}
            id="direction"
            onKeyDown={event => { if (event.key === 'Escape') { setOpen(false); searchInput.current?.blur() } }}
            value={query}
            placeholder="Search places"
            autoComplete="off"
            enterKeyHint="search"
            onChange={(event) => {
              searchRequest.current += 1
              setRemote([])
              setSearching(false)
              setSearchMessage('')
              setQuery(event.target.value)
              setOpen(true)
            }}
            onClick={() => setOpen(true)}
            onFocus={() => setOpen(true)}
            onBlur={() => window.setTimeout(() => setOpen(false), 180)}
          />
          <button type="submit" className="text-btn search-submit" aria-label={searching ? 'Searching…' : 'Search'} disabled={searching || query.trim().length < 3} onMouseDown={event => event.preventDefault()}>
            {searching ? '…' : <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>}
          </button>
          {dest && (
            <button
              type="button"
              className="text-btn search-clear"
              aria-label="Clear route"
              onClick={() => {
                routeRequest.current += 1
                setRouting(false)
                stopRide()
                setDest(null)
                setRoute([])
                setMeta(null)
                setQuery('')
                searchRequest.current += 1
                setRemote([])
                setSearching(false)
                setSearchMessage('')
                setOpen(false)
              }}
            >
              <span aria-hidden="true">×</span>
            </button>
          )}
          {open && (
            <div className="suggest glass" aria-label="Search suggestions" style={{ top: searchBounds.top, maxHeight: searchBounds.height }}>
              {searching && <p className="muted" role="status">Searching towns and villages…</p>}
              {searchMessage && <p className="muted" role="status">{searchMessage}</p>}
              {remote.map((item) => (
                <button type="button" key={`${item.lat}-${item.lng}`} onMouseDown={event => event.preventDefault()} onClick={() => void go(item)}>
                  <strong>{item.label}</strong>
                  <span>Destination · {item.detail}</span>
                </button>
              ))}
              {journeyHits.map((item) => (
                <button type="button" key={`${item.label}-${item.lat}`} onMouseDown={event => event.preventDefault()} onClick={() => void go(item)}>
                  <strong>{item.label}</strong>
                  <span>{item.detail}</span>
                </button>
              ))}
              {placeHits.map((place) => (
                <button
                  type="button"
                  key={place.id}
                  onMouseDown={event => event.preventDefault()} onClick={() =>
                    void go({ label: place.name, detail: place.village, lat: place.lat, lng: place.lng, placeId: place.id })
                  }
                >
                  <strong>{place.name}</strong>
                  <span>Place · {place.village}</span>
                </button>
              ))}
              {q && !searching && !searchMessage && !remote.length && <p className="muted">Press Search to find a town or village and products along the way.</p>}
            </div>
          )}
        </form>
        <button type="button" className="sell-entry" onClick={() => user?.role === 'host' ? onDesk() : onJoin('host')}>
          {user?.role === 'host' ? 'My shop' : 'Sell'}
        </button>
      </header>

      <div className="cats" aria-label="Filter places">
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

      <button className="locate-button glass" aria-label="Locate me" onClick={async () => { setLocationNote('Finding your location…'); const point = await readHere(); if (point && haversine(point,country.start)<450) { setHere(point); setLive(true); setLocationNote(''); } else setLocationNote('Showing the selected area. Location is unavailable or outside this country.'); }}>⌖</button>
      {locationNote && <p className="location-note" role="status">{locationNote}</p>}
      <aside className={`rail glass${!dest ? ' has-demo-routes' : ''}`}>
        <div
          className="rail-top"
          role="button"
          tabIndex={0}
          aria-label={sheetOpen ? 'Collapse places' : 'Expand places'}
          aria-expanded={sheetOpen}
          onKeyDown={event => { if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); setSheetOpen(value => !value) } }}
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
            <h2>{dest?.placeId ? 'Directions' : route.length > 1 ? 'Products on the way' : `In ${country.name}`}</h2>
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
            <button type="button" className={riding ? 'go-btn is-on' : 'go-btn'} onPointerDown={(event) => event.stopPropagation()} onPointerUp={event => event.stopPropagation()} onClick={event => { event.stopPropagation(); riding ? stopRide() : startRide() }}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M3.8 10.8 20.2 3.6l-7.2 16.4-2.1-6.7-7.1-2.5z" />
              </svg>
              {riding ? 'End preview' : 'Preview'}
            </button>
          )}
        </div>
        {!sheetOpen && <p className="rail-pull-hint">Pull up to explore ↑</p>}
        </div>
        {dest && <p className="route-demo-note">From {live ? 'your location' : country.start.label}{dest.placeId && <> · <button type="button" className="text-btn" onClick={() => setActiveId(dest.placeId!)}>View seller</button></>}</p>}
        {!dest && <div className="demo-routes" aria-label="Suggested routes">{journeys.filter(j => j.country === country.id && j.stopIds).map(j => <button key={j.label} onClick={() => void go(j)}><strong>{j.label}</strong><span>{j.stopIds!.length} stops · road trip</span></button>)}</div>}
        {dest?.stopIds && <p className="route-demo-note">Road itinerary · {dest.stopIds.length} planned stops · check access locally</p>}
        {quietRoad && <p className="muted rail-note">No matching sellers near this route. Try another category or destination.</p>}
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
          {list.length === 0 && !quietRoad && <p className="muted">No places match these filters. Try All.</p>}
          {list.map((row) => {
            const product = route.length > 1 ? row.place.products.find(item => filter.includes(item.category)) : undefined
            return (
            <button
              key={row.place.id}
              type="button"
              className={row.place.id === activeId ? 'place-card is-on' : 'place-card'}
              onClick={() => setActiveId(row.place.id)}
            >
              <span className="card-photo">
                <Photo src={product?.image ?? row.place.cover} alt="" />
              </span>
              <span>
                <strong>{product?.name ?? row.place.name}</strong>
                <em>
                  {row.place.village} · {product ? row.place.name : row.place.categories[0]}
                </em>
                <small>
                  {route.length > 1
                    ? row.onRoad
                      ? `${formatKm(row.km)} from ${meta?.approx ? 'direct line' : 'route'}`
                      : `A little off · ${formatKm(row.km)}`
                    : formatKm(row.km)}
                </small>
              </span>
              <b>{product ? <>{money(country.currency, product.price)}<small> / {product.unit}</small></> : row.place.reviews ? row.place.rating.toFixed(1) : 'New'}</b>
            </button>
          )})}
        </div>
        <div className="rail-account">
          <Menu inline onJoin={onJoin} onRequests={user ? () => setRequestsOpen(true) : undefined} onDesk={user?.role === 'host' ? onDesk : undefined} />
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

      <Ask
        places={places.filter((place) => place.country === country.id)}
        here={here}
        route={route}
        dest={dest?.label}
        focusId={activeId}
        orders={user?.role === 'traveler' ? mine : []}
        signedIn={user?.role === 'traveler'}
        onOpenPlace={setActiveId}
      />

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
