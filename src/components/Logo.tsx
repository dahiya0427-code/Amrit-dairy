/** Amrit Dairy mark: gold drop/kalash + serif wordmark (Doc 03 §1). */
export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="23" fill="#24401D" stroke="#E7A93A" strokeWidth="2" />
      <path d="M24 9c5 7 9 11.5 9 17a9 9 0 0 1-18 0c0-5.5 4-10 9-17Z" fill="#E7A93A" />
      <path d="M19.5 27.5a4.5 4.5 0 0 0 4.5 4.5" stroke="#FFFDF7" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M13 38h22" stroke="#E7A93A" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function Logo({ light = false, size = 40 }: { light?: boolean; size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={size} />
      <span className="flex flex-col leading-none">
        <span className={`font-serif text-2xl font-semibold tracking-tight ${light ? 'text-gold-500' : 'text-forest-900'}`}>Amrit</span>
        <span className={`text-[10px] font-semibold tracking-[0.3em] ${light ? 'text-cream/80' : 'text-gold-700'}`}>DAIRY · अमृत</span>
      </span>
    </span>
  )
}
