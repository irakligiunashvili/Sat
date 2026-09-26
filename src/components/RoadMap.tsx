import { useEffect, useMemo } from 'react'
import { MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import { categorySvg } from './Icons'
import { countryById } from '../data'
import type { CategoryId, LatLng, Place } from '../types'
import { categories } from '../types'

export type MapPlace = {
  place: Place
  onRoad: boolean
}

const youIcon = L.divIcon({
  className: 'sat-pin-wrap',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  html: '<div class="you-dot"></div>',
})

const riderIcon = L.divIcon({
  className: 'sat-pin-wrap',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  html: '<div class="rider-dot"></div>',
})

function esc(value: string) {
  return value.replace(/[&<>"']/g, (ch) => {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }
    return map[ch] ?? ch
  })
}

function tintOf(id: CategoryId) {
  return categories.find((cat) => cat.id === id)?.tint ?? '#1e2830'
}

function pinIcon(active: boolean, dim: boolean, category: CategoryId, tint: string, name: string) {
  return L.divIcon({
    className: 'sat-pin-wrap',
    iconSize: [58, 58],
    iconAnchor: [29, 29],
    html: `<div class="pin${active ? ' is-active' : ''}${dim ? ' is-dim' : ''}" style="--tint:${tint}">
      <span class="pin-glass">${categorySvg(category)}</span>
      ${active ? `<em>${esc(name)}</em>` : ''}
    </div>`,
  })
}

function Fit({ signature, route, fallback, zoom }: { signature: string; route: LatLng[]; fallback: LatLng; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    const wide = window.innerWidth >= 980
    if (route.length > 1) {
      const bounds = L.latLngBounds(route.map((point) => [point.lat, point.lng] as [number, number]))
      map.fitBounds(bounds, {
        paddingTopLeft: L.point(wide ? 400 : 28, wide ? 86 : 140),
        paddingBottomRight: L.point(wide ? 80 : 28, wide ? 48 : 170),
        maxZoom: 12,
        animate: true,
      })
    } else {
      map.setView([fallback.lat, fallback.lng], zoom)
    }
    // `fallback` is read with `signature`, so a live GPS stream does not reframe the map.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, map, route, zoom])
  return null
}

function Follow({ rider }: { rider: LatLng | null }) {
  const map = useMap()
  useEffect(() => {
    if (!rider) return
    map.panTo([rider.lat, rider.lng], { animate: true, duration: 0.25 })
  }, [rider, map])
  return null
}

function Zoom() {
  const map = useMap()
  useEffect(() => {
    const control = L.control.zoom({ position: 'bottomright' })
    control.addTo(map)
    return () => {
      control.remove()
    }
  }, [map])
  return null
}

function PlaceMarker({
  place,
  active,
  dim,
  onSelect,
}: {
  place: Place
  active: boolean
  dim: boolean
  onSelect: (id: string) => void
}) {
  const icon = useMemo(
    () => pinIcon(active, dim, place.categories[0], tintOf(place.categories[0]), place.name),
    [active, dim, place.categories, place.name],
  )
  return (
    <Marker
      position={[place.lat, place.lng]}
      icon={icon}
      zIndexOffset={active ? 900 : dim ? 100 : 400}
      title={place.name}
      eventHandlers={{ click: () => onSelect(place.id) }}
    />
  )
}

export function RoadMap({
  countryId,
  here,
  rider,
  route,
  places,
  activeId,
  onSelect,
  signature,
}: {
  countryId: string
  here: LatLng
  rider: LatLng | null
  route: LatLng[]
  places: MapPlace[]
  activeId: string | null
  onSelect: (id: string) => void
  signature: string
}) {
  const country = countryById(countryId)
  const line = route.map((point) => [point.lat, point.lng] as [number, number])

  return (
    <MapContainer
      center={[country.start.lat, country.start.lng]}
      zoom={country.zoom}
      minZoom={4}
      maxZoom={17}
      zoomControl={false}
      className="sat-map"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Zoom />
      <Follow rider={rider} />
      <Fit signature={signature} route={route} fallback={here} zoom={country.zoom} />
      {line.length > 1 && (
        <>
          <Polyline positions={line} pathOptions={{ color: '#ffffff', weight: 11, opacity: 0.92 }} />
          <Polyline positions={line} pathOptions={{ color: '#e25b45', weight: 4.5, opacity: 0.95 }} />
        </>
      )}
      {places.map((row) => (
        <PlaceMarker
          key={row.place.id}
          place={row.place}
          active={row.place.id === activeId}
          dim={route.length > 1 && !row.onRoad}
          onSelect={onSelect}
        />
      ))}
      {!rider && <Marker position={[here.lat, here.lng]} icon={youIcon} zIndexOffset={1000} title="You" />}
      {rider && <Marker position={[rider.lat, rider.lng]} icon={riderIcon} zIndexOffset={1100} title="Along the road" />}
    </MapContainer>
  )
}
