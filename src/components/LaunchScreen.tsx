import { useEffect, useRef, useState, type ReactNode } from 'react'
import { SatMark } from './Mark'
import './LaunchScreen.css'

export function LaunchScreen({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(true)
  const content = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Keep the map loading behind the reveal, without accepting hidden input.
    if (content.current) content.current.inert = visible
  }, [visible])

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timeout = window.setTimeout(() => setVisible(false), reducedMotion ? 150 : 1800)
    return () => window.clearTimeout(timeout)
  }, [])

  return (
    <>
      <div ref={content} className="launch-content" aria-hidden={visible || undefined}>
        {children}
      </div>
      {visible && (
        <div className="launch-screen" role="status" aria-label="Opening Sat">
          <div className="launch-logo" aria-hidden="true">
            <SatMark size={120} />
          </div>
        </div>
      )}
    </>
  )
}
