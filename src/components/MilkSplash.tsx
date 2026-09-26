/**
 * Animated milk splash (crown + flying droplets) that bursts each time the
 * floating milk bottle dips. Pure SVG + CSS, so it costs no JavaScript.
 * Keep `duration`/`delay` equal to the bottle's float animation to stay in sync.
 */
const drops = [
  { x: 38, y: 60, dx: '-38px', dy: '-70px', r: 5, d: 0 },
  { x: 50, y: 58, dx: '-14px', dy: '-96px', r: 4, d: 0.05 },
  { x: 62, y: 58, dx: '16px', dy: '-104px', r: 5.5, d: 0.02 },
  { x: 74, y: 60, dx: '42px', dy: '-78px', r: 4, d: 0.08 },
  { x: 30, y: 64, dx: '-56px', dy: '-40px', r: 3.5, d: 0.1 },
  { x: 82, y: 64, dx: '58px', dy: '-44px', r: 3.5, d: 0.04 },
  { x: 56, y: 58, dx: '2px', dy: '-120px', r: 3, d: 0.12 },
]

export function MilkSplash({ duration = '5s', delay = '0s', className = '' }: { duration?: string; delay?: string; className?: string }) {
  const timing = { animationDuration: duration, animationDelay: delay }
  return (
    <div className={`pointer-events-none ${className}`} aria-hidden="true">
      <svg viewBox="0 0 112 80" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id="milk-shade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#efe6d2" />
          </linearGradient>
        </defs>
        {/* Pool of milk the bottle lands in */}
        <ellipse cx="56" cy="70" rx="52" ry="9" fill="url(#milk-shade)" opacity="0.95" />
        {/* Crown splash */}
        <g className="milk-crown" style={timing}>
          <path
            d="M10 70 C 14 56, 20 50, 22 38 C 24 50, 28 54, 32 56 C 34 42, 38 34, 40 22 C 42 36, 46 44, 50 50 C 52 36, 54 26, 56 12 C 58 26, 60 36, 62 50 C 66 44, 70 36, 72 22 C 74 34, 78 42, 80 56 C 84 54, 88 50, 90 38 C 92 50, 98 56, 102 70 Z"
            fill="url(#milk-shade)"
          />
          <circle cx="22" cy="34" r="3.5" fill="#fff" />
          <circle cx="40" cy="18" r="4" fill="#fff" />
          <circle cx="56" cy="8" r="4.5" fill="#fff" />
          <circle cx="72" cy="18" r="4" fill="#fff" />
          <circle cx="90" cy="34" r="3.5" fill="#fff" />
        </g>
        {/* Droplets flying out and falling back */}
        {drops.map((d, i) => (
          <circle
            key={i}
            className="milk-drop"
            cx={d.x}
            cy={d.y}
            r={d.r}
            fill="#fff"
            style={{ ...timing, animationDelay: `calc(${delay} + ${d.d}s)`, ['--dx' as string]: d.dx, ['--dy' as string]: d.dy }}
          />
        ))}
      </svg>
    </div>
  )
}
