/** Amrit Dairy mark: gold drop/kalash in a walnut roundel, with a serif wordmark. */
export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="23" fill="#FFC62B" stroke="#FFC62B" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="19.5" fill="none" stroke="#140F0B" strokeWidth="0.6" opacity="0.5" />
      <path d="M24 10c4.6 6.4 8.2 10.6 8.2 15.6a8.2 8.2 0 0 1-16.4 0c0-5 3.6-9.2 8.2-15.6Z" fill="#140F0B" />
      <path d="M19.8 26.8a4.2 4.2 0 0 0 4.2 4.2" stroke="#FFC62B" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M15 37.5h18" stroke="#140F0B" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function Wordmark({ light = false, className = '' }: { light?: boolean; className?: string }) {
  return (
    <span className={`flex flex-col items-center leading-none ${className}`}>
      <span className={`font-serif text-[28px] font-semibold tracking-[0.28em] ${light ? 'text-cream' : 'text-cream'}`}>AMRIT</span>
      <span className={`mt-1 text-[9px] font-medium tracking-[0.42em] ${light ? 'text-gold-500' : 'text-gold-700'}`}>DAIRY · SONIPAT</span>
    </span>
  )
}

export function Logo({ light = false, size = 40 }: { light?: boolean; size?: number }) {
  return (
    <span className="inline-flex items-center gap-3">
      <LogoMark size={size} />
      <Wordmark light={light} className="items-start" />
    </span>
  )
}
