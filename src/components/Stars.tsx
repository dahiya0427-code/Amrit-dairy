/** Five stars filled to `value` (supports halves), e.g. 4.6 → four and a bit. */
export function Stars({ value, size = 16, className = '' }: { value: number; size?: number; className?: string }) {
  const row = (fill: string) => (
    <span className="flex w-max shrink-0" style={{ gap: size * 0.12 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={fill} aria-hidden="true">
          <path d="M12 2.6l2.9 6 6.5.8-4.8 4.5 1.2 6.5L12 17.3l-5.8 3.1 1.2-6.5L2.6 9.4l6.5-.8L12 2.6z" />
        </svg>
      ))}
    </span>
  )
  const pct = Math.max(0, Math.min(100, (value / 5) * 100))
  return (
    <span className={`relative inline-flex ${className}`} role="img" aria-label={`${value} / 5`}>
      <span className="text-line">{row('currentColor')}</span>
      <span className="absolute inset-y-0 left-0 overflow-hidden text-gold-500" style={{ width: `${pct}%` }}>{row('currentColor')}</span>
    </span>
  )
}
