import { useEffect, useRef, useState } from 'react'
import { HostDesk } from './components/HostDesk'
import { Join } from './components/Join'
import { Traveler } from './components/Traveler'
import { useSat } from './store'
import type { Role } from './types'

export function App() {
  const { user } = useSat()
  const [role, setRole] = useState<Role | null>(null)
  const [desk, setDesk] = useState(false)
  const prevId = useRef(user?.id)

  useEffect(() => {
    if (!prevId.current && user?.role === 'host') setDesk(true)
    if (!user) setDesk(false)
    prevId.current = user?.id
  }, [user])

  if (user?.role === 'host' && desk) return <HostDesk onMap={() => setDesk(false)} />
  return (
    <>
      <Traveler onJoin={setRole} onDesk={() => setDesk(true)} />
      {role && !user && <Join role={role} onBack={() => setRole(null)} />}
    </>
  )
}
