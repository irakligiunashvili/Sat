import { useState } from 'react'
import { areas, countries } from '../data'
import { useSat } from '../store'
import { categories, type CategoryId, type Role } from '../types'
import { CategoryIcon } from './Icons'
import { SatMark } from './Mark'

export function Join({ role, onBack }: { role: Role; onBack: () => void }) {
  const { register } = useSat()
  const [step, setStep] = useState(0)
  const [country, setCountry] = useState('ge')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [placeName, setPlaceName] = useState('')
  const [areaId, setAreaId] = useState('')
  const [picked, setPicked] = useState<CategoryId[]>([])
  const [error, setError] = useState('')

  const regionChoices = areas[country] ?? []
  const host = role === 'host'

  function toggle(id: CategoryId) {
    setPicked((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  function nextFromCountry() {
    setError('')
    setAreaId('')
    setStep(1)
  }

  function nextFromName() {
    if (name.trim().length < 2) {
      setError('Tell us what to call you.')
      return
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Add an email so the desk can find you.')
      return
    }
    setError('')
    setStep(2)
  }

  function finish() {
    if (!picked.length) {
      setError(host ? 'Choose at least one thing you offer.' : 'Choose at least one thing you slow down for.')
      return
    }
    if (host && placeName.trim().length < 2) {
      setError('Give the place a name.')
      return
    }
    if (host && !areaId) {
      setError('Choose the area, so travelers can pass nearby.')
      return
    }
    register({
      role,
      name,
      email,
      country,
      categories: picked,
      placeName: host ? placeName : undefined,
      areaId: host ? areaId : undefined,
    })
  }

  return (
    <main className="home home-cover">
      <div className="home-bg" />
      <div className="home-veil home-veil-strong" />
      <section className="join glass">
        <header className="join-head">
          <button type="button" className="text-btn" onClick={step === 0 ? onBack : () => { setError(''); setStep((s) => s - 1) }}>
            Back
          </button>
          <SatMark ink="#1e2830" size={28} />
          <span className="role-pill">{host ? 'Host' : 'Traveler'}</span>
        </header>

        <ol className="dots" aria-label="Progress">
          {[0, 1, 2].map((n) => (
            <li key={n} className={n === step ? 'is-on' : n < step ? 'is-done' : ''} />
          ))}
        </ol>

        {step === 0 && (
          <div className="join-step">
            <h2>Where should Sat open?</h2>
            <p className="lede">The map, the money, and the places all follow the country.</p>
            <div className="country-grid">
              {countries.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={country === item.id ? 'country is-on' : 'country'}
                  onClick={() => setCountry(item.id)}
                  aria-pressed={country === item.id}
                >
                  <strong>{item.name}</strong>
                  <span>{item.start.label}</span>
                </button>
              ))}
            </div>
            <button type="button" className="btn btn-primary" onClick={nextFromCountry}>
              Continue
            </button>
          </div>
        )}

        {step === 1 && (
          <form
            className="join-step"
            onSubmit={(event) => {
              event.preventDefault()
              nextFromName()
            }}
          >
            <h2>{host ? 'What should travelers call you?' : 'What should hosts call you?'}</h2>
            <p className="lede">A name on the order, and an email kept on this device.</p>
            <label className="field">
              <span>Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Nino" />
            </label>
            <label className="field">
              <span>Email</span>
              <input value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" inputMode="email" placeholder="nino@example.com" />
            </label>
            {error && <p className="error">{error}</p>}
            <button className="btn btn-primary" type="submit">
              Continue
            </button>
          </form>
        )}

        {step === 2 && host && (
          <form
            className="join-step"
            onSubmit={(event) => {
              event.preventDefault()
              finish()
            }}
          >
            <h2>Name the place</h2>
            <p className="lede">Travelers will see this when their road comes close.</p>
            <label className="field">
              <span>Place</span>
              <input value={placeName} onChange={(e) => setPlaceName(e.target.value)} placeholder="The walnut cellar" />
            </label>
            <p className="field-label">Area</p>
            <div className="chip-row">
              {regionChoices.map((area) => (
                <button
                  key={area.id}
                  type="button"
                  className={areaId === area.id ? 'chip is-on' : 'chip'}
                  onClick={() => setAreaId(area.id)}
                  aria-pressed={areaId === area.id}
                >
                  {area.name}
                </button>
              ))}
            </div>
            <p className="field-label">What leaves your hands?</p>
            <div className="chip-row">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={picked.includes(cat.id) ? 'chip is-on' : 'chip'}
                  onClick={() => toggle(cat.id)}
                  aria-pressed={picked.includes(cat.id)}
                >
                  <CategoryIcon id={cat.id} />
                  {cat.label}
                </button>
              ))}
            </div>
            {error && <p className="error">{error}</p>}
            <button className="btn btn-primary" type="submit">
              Open my desk
            </button>
          </form>
        )}

        {step === 2 && !host && (
          <form
            className="join-step"
            onSubmit={(event) => {
              event.preventDefault()
              finish()
            }}
          >
            <h2>What do you slow down for?</h2>
            <p className="lede">Sat will keep these closest when a place is on your way.</p>
            <div className="chip-row">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={picked.includes(cat.id) ? 'chip is-on' : 'chip'}
                  onClick={() => toggle(cat.id)}
                  aria-pressed={picked.includes(cat.id)}
                >
                  <CategoryIcon id={cat.id} />
                  {cat.label}
                </button>
              ))}
            </div>
            {error && <p className="error">{error}</p>}
            <button className="btn btn-primary" type="submit">
              Open the map
            </button>
          </form>
        )}
      </section>
    </main>
  )
}
