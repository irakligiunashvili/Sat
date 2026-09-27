import { useState } from 'react'
import { createPortal } from 'react-dom'
import { countryById } from '../data'
import { resetDemo, useSat } from '../store'
import type { Role } from '../types'
import { SatMark } from './Mark'

export function Menu({
  onJoin,
  onRequests,
  onDesk,
  onMap,
  inline = false,
}: {
  onJoin?: (role: Role) => void
  onRequests?: () => void
  onDesk?: () => void
  onMap?: () => void
  inline?: boolean
}) {
  const { user, places, logout } = useSat()
  const [open, setOpen] = useState(false)
  const [resetError, setResetError] = useState('')
  const country = countryById(user?.country ?? 'md')
  const place = places.find((item) => item.id === user?.placeId)

  function close() {
    setOpen(false)
  }

  return (
    <>
      <button type="button" className={inline ? "menu-inline" : "menu-btn glass"} aria-label="Menu" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        {inline ? 'Account & menu' : <SatMark size={21} />}
      </button>
      {open && createPortal(
        <>
          <button type="button" className="menu-backdrop" aria-label="Close menu" onClick={close} />
          <div className="menu-panel">
            <button type="button" className="text-btn" onClick={close}>Close menu</button>
            <p className="demo-label">Saved on this device</p>
            <div className="menu-logo">
              <SatMark ink="#1e2830" size={34} />
            </div>
            {user ? (
              <div className="menu-profile">
                <strong>{user.name}</strong>
                <span>{user.role === 'host' ? 'Host' : 'Traveler'} · {country.name}</span>
                <span>{place ? place.name : 'Traveler'}</span>
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
                  Sell
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
            <details className="demo-tools">
              <summary>Demo tools</summary>
              <p>Clear your profile, added products and orders on this device. Restart with the original sample data and empty forms.</p>
              <button type="button" className="menu-item danger" onClick={() => {
                try { resetDemo() } catch { setResetError('Could not clear saved data. Please try again.') }
              }}>Reset demo</button>
              {resetError && <p className="error" role="alert">{resetError}</p>}
            </details>
          </div>
        </>, document.body
      )}
    </>
  )
}
