import { countryById } from './data'
import { formatKm, money } from './format'
import { distanceToRoute, haversine, ON_THE_WAY_KM } from './geo'
import { categories, type CategoryId, type LatLng, type Order, type Place } from './types'

export type AskReply = {
  text: string
  places: { id: string; name: string }[]
}

type Row = { place: Place; km: number; onRoad: boolean }

const categoryWords: Record<CategoryId, string[]> = {
  wine: ['wine', 'wines'],
  vegetables: ['vegetable', 'vegetables'],
  fruit: ['fruit', 'fruits'],
  cheese: ['cheese'],
  bread: ['bread'],
  honey: ['honey'],
  preserves: ['preserve', 'preserves', 'jam'],
  herbs: ['herb', 'herbs'],
}

function norm(value: string) {
  return value
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function has(q: string, phrases: string[]) {
  const parts = new Set(q.split(' '))
  return phrases.some((phrase) => (phrase.includes(' ') ? q.includes(phrase) : parts.has(phrase)))
}

function mentions(q: string, label: string) {
  const name = norm(label)
  if (name.length > 2 && q.includes(name)) return true
  const skip = new Set(['the', 'and', 'for', 'with', 'from', 'this', 'that', 'near', 'your'])
  const words = name.split(' ').filter((word) => word.length > 2 && !skip.has(word))
  const parts = q.split(' ')
  return words.some((word) => parts.some((part) => part.length > 2 && (word.startsWith(part) || part.startsWith(word))))
}

function rowsOf(places: Place[], here: LatLng, route: LatLng[]): Row[] {
  return places.map((place) => {
    if (route.length < 2) return { place, km: haversine(here, place), onRoad: true }
    const hit = distanceToRoute(place, route)
    return { place, km: hit.km, onRoad: hit.km <= ON_THE_WAY_KM }
  })
}

function byDistance(list: Row[], routed: boolean) {
  return [...list].sort((a, b) => {
    if (routed && a.onRoad !== b.onRoad) return a.onRoad ? -1 : 1
    return a.km - b.km
  })
}

function away(row: Row, routed: boolean) {
  if (!routed) return `${formatKm(row.km)} away`
  return row.onRoad ? `on the way, ${formatKm(row.km)} off the line` : `${formatKm(row.km)} off this road`
}

function goods(place: Place) {
  const currency = countryById(place.country).currency
  return place.products
    .slice(0, 3)
    .map((item) => `${item.name} at ${money(currency, item.price)} a ${item.unit}`)
    .join(', ')
}

function about(row: Row, routed: boolean) {
  const { place } = row
  const rating = place.reviews ? `${place.rating.toFixed(1)} from ${place.reviews} notes` : 'new on Sat'
  return `${place.name} in ${place.village} is kept by ${place.hostName}. ${goods(place)}. It is ${away(row, routed)}, ${rating}.`
}

function pins(list: Row[]) {
  const seen = new Set<string>()
  const out: AskReply['places'] = []
  for (const row of list) {
    if (seen.has(row.place.id)) continue
    seen.add(row.place.id)
    out.push({ id: row.place.id, name: row.place.name })
    if (out.length === 3) break
  }
  return out
}

function listText(intro: string, list: Row[], routed: boolean) {
  const lines = list
    .slice(0, 3)
    .map((row) => `${row.place.name} in ${row.place.village} — ${goods(row.place)}. ${away(row, routed)}.`)
  return `${intro}\n${lines.join('\n')}`
}

export function answerAsk(input: {
  question: string
  places: Place[]
  here: LatLng
  route: LatLng[]
  dest?: string
  focusId?: string | null
  orders: Order[]
  signedIn: boolean
}): AskReply {
  const q = norm(input.question)
  const routed = input.route.length > 1
  const catalog = byDistance(rowsOf(input.places, input.here, input.route), routed)
  const focus = catalog.find((row) => row.place.id === input.focusId) ?? null

  if (!q) return { text: 'Ask about a place, a price, or what is on your road.', places: [] }

  if (has(q, ['hello', 'hi', 'hey'])) {
    return { text: 'Hello. Ask where to stop, what something costs, or what is on your road.', places: [] }
  }

  if (has(q, ['help', 'what can you'])) {
    return {
      text: 'I can point you to a place, tell you a price, say what is on this road, or check a request you already sent.',
      places: [],
    }
  }

  const category = categories.find((cat) => has(q, categoryWords[cat.id])) ?? null
  const productHits = catalog.filter((row) => row.place.products.some((item) => mentions(q, item.name)))
  const placeHits = catalog.filter(
    (row) => mentions(q, row.place.name) || mentions(q, row.place.hostName) || mentions(q, row.place.village),
  )

  const priceAsk = has(q, ['how much', 'price', 'cost', 'costs'])
  const orderAsk = has(q, ['my order', 'my request', 'my requests', 'status'])
  const howAsk = has(q, ['how do i', 'how to', 'how does', 'pay'])
  const nearAsk = has(q, ['near', 'nearby', 'close', 'on the way', 'on this road', 'on the road', 'along', 'around'])
  const bestAsk = has(q, ['best', 'highest', 'top rated', 'rating'])
  const cheapAsk = has(q, ['cheap', 'cheapest', 'lowest'])
  const aboutFocus = Boolean(focus) && has(q, ['this place', 'this one', 'they sell', 'do they', 'the host', 'who runs', 'who keeps'])

  if (orderAsk) {
    if (!input.signedIn) {
      return { text: 'Choose Travel in the menu first. Then a request you send will show up here.', places: [] }
    }
    if (!input.orders.length) {
      return { text: 'You have not sent a request yet. Open a place, pick something, and ask the host.', places: [] }
    }
    const lines = input.orders.slice(0, 4).map((order) => {
      const place = catalog.find((row) => row.place.id === order.placeId)
      const where = place ? place.place.name : 'a host'
      return `${order.qty} × ${order.productName} from ${where} is ${order.status}.`
    })
    return { text: lines.join('\n'), places: pins(catalog.filter((row) => input.orders.some((order) => order.placeId === row.place.id))) }
  }

  if (howAsk && !priceAsk && !category && productHits.length === 0 && placeHits.length === 0) {
    return {
      text: 'Open a place, choose what you want, and send a request. The host accepts or declines it. You settle when you stop by. Sat does not take the payment.',
      places: [],
    }
  }

  if (aboutFocus && focus && !priceAsk && placeHits.length === 0) {
    return { text: `${about(focus, routed)} ${focus.place.story}`, places: pins([focus]) }
  }

  if (!focus && has(q, ['this place', 'they sell', 'do they', 'the host'])) {
    return { text: 'Open a place on the map, then ask again and I will talk about that one.', places: [] }
  }

  if (cheapAsk) {
    const pool = catalog.filter((row) => !category || row.place.categories.includes(category.id))
    const offers = pool.flatMap((row) =>
      row.place.products
        .filter((item) => !category || item.category === category.id)
        .map((item) => ({ row, item })),
    )
    offers.sort((a, b) => a.item.price - b.item.price)
    const best = offers[0]
    if (!best) return { text: 'Nothing in that category is on the map here yet.', places: [] }
    const currency = countryById(best.row.place.country).currency
    return {
      text: `The lowest I see is ${best.item.name} at ${money(currency, best.item.price)} a ${best.item.unit}, from ${best.row.place.name} in ${best.row.place.village}.`,
      places: pins([best.row]),
    }
  }

  if (bestAsk && !priceAsk) {
    const pool = catalog.filter((row) => row.place.reviews > 0 && (!category || row.place.categories.includes(category.id)))
    pool.sort((a, b) => b.place.rating - a.place.rating || a.km - b.km)
    const top = pool[0]
    if (!top) return { text: 'No notes from the road yet for that.', places: [] }
    return { text: about(top, routed), places: pins([top]) }
  }

  if (priceAsk || (productHits.length > 0 && !category)) {
    if (priceAsk && category && productHits.length === 0) {
      const pool = catalog.filter((row) => row.place.categories.includes(category.id))
      if (!pool.length) return { text: `No ${category.label.toLowerCase()} on the map in this country yet.`, places: [] }
      return { text: listText(`${category.label} you can ask for:`, pool, routed), places: pins(pool) }
    }
    if (productHits.length === 0 && focus && priceAsk) {
      return { text: `${focus.place.name} has ${goods(focus.place)}.`, places: pins([focus]) }
    }
    const named = productHits.flatMap((row) =>
      row.place.products.filter((item) => mentions(q, item.name)).map((item) => ({ row, item })),
    )
    if (named.length) {
      const lines = named.slice(0, 3).map(({ row, item }) => {
        const currency = countryById(row.place.country).currency
        return `${item.name} is ${money(currency, item.price)} a ${item.unit} at ${row.place.name} in ${row.place.village}.`
      })
      const uniqueRows = named.map((item) => item.row)
      return { text: lines.join('\n'), places: pins(uniqueRows) }
    }
    if (placeHits[0]) return { text: about(placeHits[0], routed), places: pins(placeHits) }
    return { text: 'I cannot find that on the map. Try a place name, or something like wine, honey, or bread.', places: [] }
  }

  if (placeHits.length === 1) {
    return { text: `${about(placeHits[0], routed)} ${placeHits[0].place.story}`, places: pins(placeHits) }
  }
  if (placeHits.length > 1) {
    return { text: listText('A few places match:', placeHits, routed), places: pins(placeHits) }
  }

  if (category || nearAsk) {
    const pool = category ? catalog.filter((row) => row.place.categories.includes(category.id)) : catalog
    const onRoad = routed ? pool.filter((row) => row.onRoad) : pool
    const shown = onRoad.length ? onRoad : pool
    if (!shown.length) {
      return {
        text: category ? `No ${category.label.toLowerCase()} on the map here yet.` : 'The map is empty for this country.',
        places: [],
      }
    }
    const where = input.dest && routed ? ` on the way to ${input.dest}` : routed ? ' on this road' : ' near you'
    const intro = category ? `${category.label}${where}:` : `Places${where}:`
    return { text: listText(intro, shown, routed), places: pins(shown) }
  }

  if (focus) return { text: about(focus, routed), places: pins([focus]) }

  return {
    text: 'Try a place, a price, or what is nearby. “Where is the honey?” and “How much is Saperavi?” both work.',
    places: [],
  }
}
