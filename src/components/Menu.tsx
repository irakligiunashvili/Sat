import { useState } from 'react'
import { countryById } from '../data'
import { useSat } from '../store'
import type { Role } from '../types'
import { SatMark } from './Mark'

export function Menu({
  onJoin,
  onRequests,
  onDesk,
  onMap,
}: {
  onJoin?: (role: Role) => void
  onRequests?: () => void
  onDesk?: () => void
  onMap?: () => void
}) {
  const { user, places, logout } = useSat()
  const [open, setOpen] = useState(false)
  const country = countryById(user?.country ?? 'ge')
  const place = places.find((item) => item.id === user?.placeId)

  function close() {
    setOpen(false)
  }

  return (
    <>
      <button type="button" className="menu-btn glass" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <i />
        <i />
        <i />
      </button>
      {open && (
        <>
          <button type="button" className="menu-backdrop" aria-label="Close menu" onClick={close} />
          <div className="menu-panel">
            <div className="menu-logo">
              <SatMark ink="#1e2830" size={34} />
            </div>
            {user ? (
              <div className="menu-profile">
                <strong>{user.name}</strong>
                <span>{user.role === 'host' ? 'Host' : 'Traveler'} · {country.name}</span>
                <span>{place ? place.name : user.email}</span>
              </div>
            ) : (
              <p className="muted menu-lead">How are you using Sat?</p>
            )}
            {!user && onJoin && (
              <>
                <button
                  type="button"
                  className="menu-item"
                  onClick={() => {
                    close()
                    onJoin('traveler')
                  }}
                >
                  Travel the road
                </button>
                <button
                  type="button"
                  className="menu-item"
                  onClick={() => {
                    close()
                    onJoin('host')
                  }}
                >
                  Host a place
                </button>
              </>
            )}
            {user?.role === 'traveler' && onRequests && (
              <button
                type="button"
                className="menu-item"
                onClick={() => {
                  close()
                  onRequests()
                }}
              >
                Requests
              </button>
            )}
            {user?.role === 'host' && onDesk && (
              <button
                type="button"
                className="menu-item"
                onClick={() => {
                  close()
                  onDesk()
                }}
              >
                Your desk
              </button>
            )}
            {onMap && (
              <button
                type="button"
                className="menu-item"
                onClick={() => {
                  close()
                  onMap()
                }}
              >
                Map
              </button>
            )}
            {user && (
              <button
                type="button"
                className="menu-item danger"
                onClick={() => {
                  close()
                  logout()
                }}
              >
                Sign out
              </button>
            )}
          </div>
        </>
      )}
    </>
  )
}
