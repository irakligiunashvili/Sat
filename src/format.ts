export function money(currency: string, amount: number) {
  const n = Number.isInteger(amount) ? String(amount) : amount.toFixed(2)
  if (currency === '€' || currency === '₾' || currency === '₺') return `${currency}${n}`
  return `${n} ${currency}`
}

export function ago(ts: number) {
  const mins = Math.max(0, Math.round((Date.now() - ts) / 60000))
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours} h ago`
  const days = Math.round(hours / 24)
  return `${days} d ago`
}

export function formatKm(km: number) {
  if (!Number.isFinite(km)) return ''
  if (km < 1) return `${Math.max(40, Math.round(km * 1000))} m`
  if (km < 10) return `${km.toFixed(1)} km`
  return `${Math.round(km)} km`
}

export function formatDuration(seconds: number) {
  const mins = Math.round(seconds / 60)
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  const rem = mins % 60
  return rem ? `${h} h ${rem} min` : `${h} h`
}

export function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-3)}`
}
