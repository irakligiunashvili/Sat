import type { LatLng } from './types'

const R = 6371

export function haversine(a: LatLng, b: LatLng) {
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const la1 = (a.lat * Math.PI) / 180
  const la2 = (b.lat * Math.PI) / 180
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)))
}

function toXY(p: LatLng, origin: LatLng) {
  const lat0 = (origin.lat * Math.PI) / 180
  return {
    x: ((p.lng - origin.lng) * Math.PI) / 180 * Math.cos(lat0) * R,
    y: ((p.lat - origin.lat) * Math.PI) / 180 * R,
  }
}

function segmentT(p: LatLng, a: LatLng, b: LatLng) {
  const P = toXY(p, a)
  const B = toXY(b, a)
  const ab2 = B.x * B.x + B.y * B.y
  if (ab2 === 0) return 0
  return Math.max(0, Math.min(1, (P.x * B.x + P.y * B.y) / ab2))
}

export function distanceToRoute(p: LatLng, line: LatLng[]) {
  if (line.length === 0) return { km: Infinity, along: 0 }
  if (line.length === 1) return { km: haversine(p, line[0]), along: 0 }

  const segLens = line.slice(0, -1).map((a, i) => haversine(a, line[i + 1]))
  const total = segLens.reduce((sum, n) => sum + n, 0)
  let best = Infinity
  let bestAlong = 0
  let walked = 0

  for (let i = 0; i < line.length - 1; i++) {
    const len = segLens[i]
    const t = segmentT(p, line[i], line[i + 1])
    const point =
      len === 0
        ? line[i]
        : {
            lat: line[i].lat + (line[i + 1].lat - line[i].lat) * t,
            lng: line[i].lng + (line[i + 1].lng - line[i].lng) * t,
          }
    const d = haversine(p, point)
    if (d < best) {
      best = d
      bestAlong = total === 0 ? 0 : (walked + t * len) / total
    }
    walked += len
  }

  return { km: best, along: bestAlong }
}

export function downsample(line: LatLng[], max = 400): LatLng[] {
  if (line.length <= max) return line
  const step = (line.length - 1) / (max - 1)
  return Array.from({ length: max }, (_, i) => line[Math.round(i * step)])
}

export function straightLine(a: LatLng, b: LatLng, steps = 40): LatLng[] {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps
    return {
      lat: a.lat + (b.lat - a.lat) * t,
      lng: a.lng + (b.lng - a.lng) * t,
    }
  })
}

export const ON_THE_WAY_KM = 15
export const CLOSE_KM = 4

type OsrmResponse = {
  routes?: {
    distance: number
    duration: number
    geometry: { coordinates: [number, number][] }
  }[]
}

const osrmBase = import.meta.env.DEV ? '/osrm' : 'https://router.project-osrm.org'
const nominatimBase = import.meta.env.DEV ? '/nominatim' : 'https://nominatim.openstreetmap.org'

export async function fetchRoute(from: LatLng, to: LatLng, via: LatLng[] = []) {
  const coordinates = [from, ...via, to].map(p => `${p.lng},${p.lat}`).join(';')
  const url = `${osrmBase}/route/v1/driving/${coordinates}?overview=full&geometries=geojson`
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
  if (!res.ok) return null
  const data = (await res.json()) as OsrmResponse
  const route = data.routes?.[0]
  if (!route?.geometry?.coordinates?.length) return null
  const line = downsample(
    route.geometry.coordinates.map(([lng, lat]) => ({ lat, lng })),
    500,
  )
  return { line, meters: route.distance, seconds: route.duration }
}

type NominatimRow = { display_name: string; lat: string; lon: string }

export async function searchPlaces(q: string, country: string) {
  const url = `${nominatimBase}/search?format=jsonv2&limit=5&countrycodes=${country}&q=${encodeURIComponent(q)}`
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
  if (!res.ok) return []
  const data = (await res.json()) as NominatimRow[]
  return data
    .map((row) => ({
      label: row.display_name.split(',')[0]?.trim() || row.display_name,
      detail: row.display_name,
      lat: Number(row.lat),
      lng: Number(row.lon),
    }))
    .filter((row) => Number.isFinite(row.lat) && Number.isFinite(row.lng))
}
