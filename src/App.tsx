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
  const prevRole = useRef(user?.role)

  useEffect(() => {
    if (prevRole.current !== 'host' && user?.role === 'host') setDesk(true)
    if (!user) setDesk(false)
    else setRole(null)
    prevRole.current = user?.role
  }, [user])

  if (user?.role === 'host' && desk) return <HostDesk onMap={() => setDesk(false)} />
  return (
    <>
      <Traveler onJoin={setRole} onDesk={() => setDesk(true)} />
      {role && (!user || (role === 'host' && user.role === 'traveler')) && <Join role={role} onBack={() => setRole(null)} />}
    </>
  )
}
