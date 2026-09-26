import { Capacitor } from '@capacitor/core'
import { Geolocation } from '@capacitor/geolocation'
import type { LatLng } from './types'

export async function readHere(): Promise<LatLng | null> {
  try {
    if (Capacitor.isNativePlatform()) {
      const perm = await Geolocation.requestPermissions()
      if (perm.location === 'denied') return null
      const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 8000 })
      return { lat: pos.coords.latitude, lng: pos.coords.longitude }
    }
  } catch {
    return null
  }

  if (!navigator.geolocation) return null
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 20000 },
    )
  })
}

export async function watchHere(onMove: (point: LatLng) => void): Promise<() => void> {
  if (Capacitor.isNativePlatform()) {
    const id = await Geolocation.watchPosition({ enableHighAccuracy: true }, (pos) => {
      if (!pos) return
      onMove({ lat: pos.coords.latitude, lng: pos.coords.longitude })
    })
    return () => {
      void Geolocation.clearWatch({ id })
    }
  }

  const id = navigator.geolocation.watchPosition((pos) => {
    onMove({ lat: pos.coords.latitude, lng: pos.coords.longitude })
  })
  return () => navigator.geolocation.clearWatch(id)
}
