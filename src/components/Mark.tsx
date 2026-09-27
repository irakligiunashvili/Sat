export function SatMark({ size = 86 }: { ink?: string; size?: number }) {
  return <span className="sat-original-mark" style={{width:size*2.3,height:size*1.5}}><img src="/brand/sat-original.png" alt="Sat" style={{top:-size*0.5}} /></span>
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
