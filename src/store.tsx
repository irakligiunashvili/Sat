import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  buildPlace,
  buildWelcomeOrders,
  countryById,
  demoHost,
  demoTraveler,
  places as seedPlaces,
  seedOrders,
} from './data'
import { uid } from './format'
import type { CategoryId, Order, OrderStatus, Place, Role, User } from './types'

const KEY = 'sat.v1'

type Snapshot = {
  user: User | null
  orders: Order[]
  customPlaces: Place[]
}

type RegisterInput = {
  role: Role
  name: string
  email: string
  country: string
  categories: CategoryId[]
  placeName?: string
  areaId?: string
}

type OrderInput = {
  place: Place
  traveler: User
  productName: string
  qty: number
  unit: string
  total: number
}

type Store = {
  user: User | null
  places: Place[]
  orders: Order[]
  register: (input: RegisterInput) => void
  enterDemo: (role: Role) => void
  logout: () => void
  placeOrder: (input: OrderInput) => void
  decide: (orderId: string, status: OrderStatus) => void
}

const SatContext = createContext<Store | null>(null)

function load(): Snapshot {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { user: null, orders: seedOrders, customPlaces: [] }
    const data = JSON.parse(raw) as Partial<Snapshot>
    return {
      user: data.user ?? null,
      orders: Array.isArray(data.orders) ? data.orders : seedOrders,
      customPlaces: Array.isArray(data.customPlaces) ? data.customPlaces : [],
    }
  } catch {
    return { user: null, orders: seedOrders, customPlaces: [] }
  }
}

export function SatProvider({ children }: { children: ReactNode }) {
  const [snap, setSnap] = useState<Snapshot>(load)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(snap))
  }, [snap])

  const places = useMemo(
    () => [...seedPlaces, ...snap.customPlaces],
    [snap.customPlaces],
  )

  const api = useMemo<Store>(() => {
    return {
      user: snap.user,
      places,
      orders: snap.orders,
      register: (input) => {
        const id = uid(input.role === 'host' ? 'host' : 'traveler')
        if (input.role === 'host' && input.placeName && input.areaId) {
          const place = buildPlace({
            hostId: id,
            hostName: input.name.trim(),
            placeName: input.placeName,
            country: input.country,
            areaId: input.areaId,
            categories: input.categories,
          })
          const welcome = buildWelcomeOrders(place, countryById(input.country).currency)
          setSnap((prev) => ({
            user: {
              id,
              role: 'host',
              name: input.name.trim(),
              email: input.email.trim(),
              country: input.country,
              categories: input.categories,
              placeId: place.id,
            },
            orders: [...welcome, ...prev.orders],
            customPlaces: [...prev.customPlaces, place],
          }))
          return
        }
        setSnap((prev) => ({
          ...prev,
          user: {
            id,
            role: 'traveler',
            name: input.name.trim(),
            email: input.email.trim(),
            country: input.country,
            categories: input.categories,
          },
        }))
      },
      enterDemo: (role) => {
        setSnap((prev) => ({
          ...prev,
          user: role === 'host' ? demoHost : demoTraveler,
        }))
      },
      logout: () => setSnap((prev) => ({ ...prev, user: null })),
      placeOrder: ({ place, traveler, productName, qty, unit, total }) => {
        const order: Order = {
          id: uid('ord'),
          placeId: place.id,
          hostId: place.hostId,
          travelerId: traveler.id,
          travelerName: traveler.name,
          productName,
          qty,
          unit,
          total,
          currency: countryById(place.country).currency,
          status: 'pending',
          createdAt: Date.now(),
        }
        setSnap((prev) => ({ ...prev, orders: [order, ...prev.orders] }))
      },
      decide: (orderId, status) => {
        setSnap((prev) => ({
          ...prev,
          orders: prev.orders.map((order) =>
            order.id === orderId ? { ...order, status } : order,
          ),
        }))
      },
    }
  }, [places, snap])

  return <SatContext.Provider value={api}>{children}</SatContext.Provider>
}

export function useSat() {
  const ctx = useContext(SatContext)
  if (!ctx) throw new Error('Sat is missing its provider')
  return ctx
}
