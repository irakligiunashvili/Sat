import { useState, useEffect, useRef } from 'react'
import { useSat } from '../store'
import type { Role } from '../types'
import { SatMark } from './Mark'

export function Join({ role, onBack }: { role: Role; onBack: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => { dialog.current?.showModal() }, [])
  const { register, user } = useSat()
  const [name, setName] = useState(user?.name ?? '')
  const [error, setError] = useState('')
  const host = role === 'host'

  function start() {
    if (!name.trim()) { setError('Tell us your name to get started.'); return }
    register({
      role, name: name.trim(), email: '', country: 'md',
      categories: host ? ['wine'] : [],
      ...(host ? { placeName: name.trim() + '’s place', areaId: 'orhei' } : {}),
    })
  }

  return (
    <dialog ref={dialog} className="farmer-welcome" aria-label={host ? 'Your place on Sat' : 'Explore with Sat'} onCancel={onBack}>
      <header className="farmer-welcome-head">
        <button type="button" className="text-btn" onClick={onBack}>Back</button>
        <SatMark size={44} />
      </header>
      <section className="farmer-welcome-body">
        <p>Welcome to Sat</p>
        <h1>What’s your name?</h1>
        <p>{host ? 'Let’s get your place ready.' : 'Let’s find your next countryside adventure.'}</p>
        <label className="sr" htmlFor="welcome-name">Your name</label>
        <input id="welcome-name" value={name} onChange={event => { setName(event.target.value); setError('') }}
          autoComplete="given-name" placeholder="Your name" enterKeyHint="go" maxLength={80}
          onKeyDown={event => { if (event.key === 'Enter') start() }} />
        {error && <p className="error" role="alert">{error}</p>}
      </section>
      <footer className="farmer-welcome-footer">
        <button type="button" className="btn btn-primary" onClick={start}>{host ? 'Open my place' : 'Let’s explore'}</button>
        <p>{host ? 'Your place in Orhei. Saved on this phone.' : 'Your profile is saved on this phone.'}</p>
      </footer>
    </dialog>
  )
}
