import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip, useMap } from 'react-leaflet'
import { fetchRoute, haversine, straightLine } from '../geo'
import type { LatLng, Order, Place } from '../types'

function FitRoute({ line }: { line: LatLng[] }) {
  const map = useMap()
  useEffect(() => { map.fitBounds(line.map(p => [p.lat, p.lng]), { padding: [28, 28], maxZoom: 14 }) }, [map, line])
  return null
}

export function OrderArrival({ order, place, onDone }: { order: Order; place?: Place; onDone: () => void }) {
  const [route, setRoute] = useState<{ line: LatLng[]; meters: number; seconds: number; approximate: boolean } | null>(null)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    if (!place || !order.customerLocation) return
    let cancelled = false
    const start = order.customerLocation
    const km = haversine(start, place)
    const fallback = { line: straightLine(start, place), meters: km * 1000, seconds: km / 30 * 3600, approximate: true }
    void fetchRoute(start, place).then(result => {
      if (!cancelled) setRoute(result ? { ...result, approximate: false } : fallback)
    }).catch(() => { if (!cancelled) setRoute(fallback) })
    return () => { cancelled = true }
  }, [order.customerLocation, place])
  useEffect(() => {
    if (!route || !order.demoLocation || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const started = performance.now()
    const timer = window.setInterval(() => setProgress(Math.min((performance.now() - started) / 20000, 1)), 100)
    return () => window.clearInterval(timer)
  }, [route, order.demoLocation])
  const index = route ? progress * (route.line.length - 1) : 0
  const a = route?.line[Math.floor(index)]
  const b = route?.line[Math.min(Math.floor(index) + 1, route.line.length - 1)]
  const point = a && b ? { lat: a.lat + (b.lat - a.lat) * (index % 1), lng: a.lng + (b.lng - a.lng) * (index % 1) } : null
  return <section className="easy-card glass arrival-tracking">
    <p className="arrival-banner">Order accepted</p>
    <h1>{route ? 'About ' + Math.max(1, Math.ceil(route.seconds / 60)) + ' min away' : order.customerLocation ? 'Finding their route…' : 'Arrival time unavailable'}</h1>
    <p>{order.travelerName}</p>
    {route && place && point && <>
      <p>{(route.meters / 1000).toFixed(1)} km {route.approximate ? 'straight-line distance · rough estimate' : 'by road · estimated driving time'}</p>
      <div className="arrival-map" aria-label="Customer route to your shop">
        <MapContainer center={[place.lat, place.lng]} zoom={13} zoomControl={false} dragging={false} scrollWheelZoom={false} doubleClickZoom={false} touchZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
          <FitRoute line={route.line} />
          <Polyline positions={route.line.map(p => [p.lat, p.lng])} pathOptions={{ color: '#334b3c', weight: 5, dashArray: route.approximate ? '8 8' : undefined }} />
          <CircleMarker center={[place.lat, place.lng]} radius={10} pathOptions={{ color: '#fff', fillColor: '#334b3c', fillOpacity: 1 }}><Tooltip permanent>Your shop</Tooltip></CircleMarker>
          <CircleMarker center={[point.lat, point.lng]} radius={8} pathOptions={{ color: '#fff', fillColor: '#267bdb', fillOpacity: 1 }}><Tooltip>Customer</Tooltip></CircleMarker>
        </MapContainer>
      </div>
    </>}
    <p className="muted">{order.demoLocation ? 'Simulated journey · initial arrival estimate.' : 'Based on the customer’s shared location. No location means no arrival estimate.'}</p>
    <button type="button" className="btn btn-primary" onClick={onDone}>Back to orders</button>
  </section>
}
