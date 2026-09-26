import { useSat } from '../store'
import type { Role } from '../types'
import { SatMark, Stitch } from './Mark'

export function Welcome({ onChoose }: { onChoose: (role: Role) => void }) {
  const { enterDemo } = useSat()

  return (
    <main className="home">
      <div className="home-bg" />
      <div className="home-veil" />
      <section className="home-card">
        <div className="glass-icon">
          <div className="glass-icon-shine" />
          <SatMark size={78} />
          <Stitch />
        </div>
        <h1>Sat</h1>
        <p className="tag">Closer to home.</p>

        <div className="role-grid">
          <button className="role-card glass" onClick={() => onChoose('host')}>
            <span className="role-kicker">For the village</span>
            <strong>Host a place</strong>
            <span>Grow it, make it, and leave it where the road can find it.</span>
          </button>
          <button className="role-card glass" onClick={() => onChoose('traveler')}>
            <span className="role-kicker">For the road</span>
            <strong>Travel the road</strong>
            <span>See who is pouring, baking, and picking along your way.</span>
          </button>
        </div>

        <p className="home-foot">People. Places. Home.</p>
        <div className="preview-row">
          <button type="button" onClick={() => enterDemo('traveler')}>
            Preview a traveler’s map
          </button>
          <span aria-hidden="true">·</span>
          <button type="button" onClick={() => enterDemo('host')}>
            Preview Nino’s desk
          </button>
        </div>
      </section>
    </main>
  )
}
