export const categories = [
  { id: 'wine', label: 'Wine', tint: '#8d3a3a' },
  { id: 'vegetables', label: 'Vegetables', tint: '#3f7d4e' },
  { id: 'fruit', label: 'Fruit', tint: '#d4782f' },
  { id: 'cheese', label: 'Cheese', tint: '#c4922a' },
  { id: 'bread', label: 'Bread', tint: '#b56a3c' },
  { id: 'honey', label: 'Honey', tint: '#d9a20b' },
  { id: 'preserves', label: 'Preserves', tint: '#b44b3c' },
  { id: 'herbs', label: 'Herbs', tint: '#6e8f4e' },
] as const

export type CategoryId = (typeof categories)[number]['id']
export type Role = 'host' | 'traveler'

export type Product = {
  id: string
  name: string
  detail: string
  price: number
  unit: string
  category: CategoryId
  image: string
}

export type Comment = {
  id: string
  author: string
  text: string
  stars: number
}

export type Place = {
  easySetupComplete?: boolean
  id: string
  hostId: string
  hostName: string
  name: string
  village: string
  region: string
  country: string
  lat: number
  lng: number
  cover: string
  rating: number
  reviews: number
  categories: CategoryId[]
  story: string
  products: Product[]
  comments: Comment[]
}

export type OrderStatus = 'pending' | 'accepted' | 'declined'

export type Order = {
  customerLocation?: LatLng
  demoLocation?: boolean
  id: string
  placeId: string
  hostId: string
  travelerId: string
  travelerName: string
  productName: string
  qty: number
  unit: string
  total: number
  currency: string
  status: OrderStatus
  createdAt: number
}

export type User = {
  id: string
  role: Role
  name: string
  email: string
  country: string
  categories: CategoryId[]
  placeId?: string
}

export type LatLng = { lat: number; lng: number }

export type Destination = {
  stopIds?: string[]
  label: string
  detail: string
  lat: number
  lng: number
  placeId?: string
}
