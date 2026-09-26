export function SatMark({ ink = '#fff', size = 86 }: { ink?: string; size?: number }) {
  return (
    <div className="sat-mark" style={{ color: ink, fontSize: size }}>
      <span>S</span>
      <svg className="sat-house" viewBox="0 0 70 78" aria-hidden="true">
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M35 2 L68 34 H60 V74 H10 V34 H2 Z M18 42 h10 v9 h-10 z M42 42 h10 v9 h-10 z M18 56 h10 v9 h-10 z M42 56 h10 v9 h-10 z"
        />
      </svg>
      <span>t</span>
    </div>
  )
}

export function Stitch({ line = 'rgba(255,255,255,0.8)' }: { line?: string }) {
  return (
    <svg className="stitch" viewBox="0 0 220 36" aria-hidden="true">
      <path d="M6 18 H52" stroke={line} strokeWidth="1.6" strokeLinecap="round" />
      <rect x="58" y="8" width="7" height="7" rx="1" fill="#a3b56d" />
      <rect x="67" y="15" width="7" height="7" rx="1" fill="#a3b56d" />
      <rect x="58" y="22" width="7" height="7" rx="1" fill="#a3b56d" />
      <rect x="98" y="4" width="8" height="8" rx="1.2" fill="#e25b45" />
      <rect x="88" y="14" width="8" height="8" rx="1.2" fill="#e25b45" />
      <rect x="98" y="14" width="8" height="8" rx="1.2" fill="#e25b45" />
      <rect x="108" y="14" width="8" height="8" rx="1.2" fill="#e25b45" />
      <rect x="98" y="24" width="8" height="8" rx="1.2" fill="#e25b45" />
      <rect x="146" y="8" width="7" height="7" rx="1" fill="#a3b56d" />
      <rect x="137" y="15" width="7" height="7" rx="1" fill="#a3b56d" />
      <rect x="146" y="22" width="7" height="7" rx="1" fill="#a3b56d" />
      <path d="M168 18 H214" stroke={line} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
