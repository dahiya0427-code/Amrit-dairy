/**
 * Illustrated "morning on the farm" pieces: sky decorations, rolling hills and
 * desi cows (with humps). Pure SVG; motion is CSS and turns off for reduced motion.
 */

/** Desi cow facing left: hump, dewlap, curved horns. `patch` adds Gir-style spots. */
export function Cow({ color = '#9a4f2a', patch = '#f6efdd', grazing = false }: { color?: string; patch?: string; grazing?: boolean }) {
  return (
    <g>
      {/* legs */}
      <g fill={color}>
        <rect x="36" y="46" width="6" height="22" rx="2.5" />
        <rect x="47" y="47" width="6" height="21" rx="2.5" />
        <rect x="80" y="46" width="6" height="22" rx="2.5" />
        <rect x="91" y="45" width="6" height="23" rx="2.5" />
      </g>
      {/* tail */}
      <path d="M103 30c6 6 6 18 3 26" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="106" cy="57" r="3" fill="#3b2415" />
      {/* body + hump */}
      <rect x="30" y="22" width="76" height="30" rx="15" fill={color} />
      <ellipse cx="44" cy="21" rx="10" ry="8" fill={color} />
      <ellipse cx="62" cy="36" rx="12" ry="8" fill={patch} opacity="0.9" />
      <ellipse cx="88" cy="30" rx="7" ry="5" fill={patch} opacity="0.9" />
      {/* dewlap */}
      <path d="M30 34c-2 10 2 18 10 18l2-14Z" fill={color} />
      {/* head (dips when grazing) */}
      <g className={grazing ? 'animate-graze' : undefined}>
        <path d="M34 26 L18 34 L20 46 L34 40 Z" fill={color} />
        <ellipse cx="15" cy="42" rx="8" ry="10" fill={color} transform="rotate(-20 15 42)" />
        <ellipse cx="11" cy="49" rx="5" ry="4" fill="#e9b9a0" />
        <path d="M22 30c-6-2-10-8-8-13M24 30c2-6 0-11-4-13" stroke="#e8dcc0" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M26 33 l9 -5 l-2 7 Z" fill="#7a3d20" />
        <circle cx="16" cy="38" r="1.6" fill="#1e1c19" />
      </g>
    </g>
  )
}

export function Sun({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <circle cx="100" cy="100" r="96" fill="#f5b83d" opacity="0.18" className="animate-sun" />
      <circle cx="100" cy="100" r="70" fill="#f5b83d" opacity="0.35" className="animate-sun" />
      <circle cx="100" cy="100" r="46" fill="#f5b83d" />
    </svg>
  )
}

export function Cloud({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 60" className={className} aria-hidden="true">
      <path d="M20 50h118a18 18 0 0 0-6-35 26 26 0 0 0-48-6A20 20 0 0 0 50 22a16 16 0 0 0-30 28Z" fill="#fff" opacity="0.9" />
    </svg>
  )
}

export function Birds({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 40" className={className} aria-hidden="true">
      <g fill="none" stroke="#1f3a1a" strokeWidth="2.2" strokeLinecap="round">
        <path d="M10 20q7-8 14 0q7-8 14 0" />
        <path d="M52 10q5-6 10 0q5-6 10 0" />
        <path d="M84 24q5-6 10 0q5-6 10 0" />
      </g>
    </svg>
  )
}

function Tree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-3" y="0" width="6" height="26" rx="2" fill="#6b4a33" />
      <circle cx="0" cy="-6" r="18" fill="#3f7f34" />
      <circle cx="-12" cy="4" r="12" fill="#4a8c3c" />
      <circle cx="12" cy="3" r="13" fill="#4a8c3c" />
    </g>
  )
}

/** Three rolling hills with trees, a small hut and grazing cows. Sits at the bottom of a section. */
export function FarmHills({ className = '', cows = true, ground = '#3f7f34' }: { className?: string; cows?: boolean; ground?: string }) {
  return (
    <svg viewBox="0 0 1440 300" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden="true">
      <path d="M0 150 C 220 70, 420 120, 640 90 S 1080 40, 1440 110 V300 H0 Z" fill="#a8d27a" />
      <Tree x={1180} y={70} s={0.9} />
      <Tree x={1240} y={78} s={0.7} />
      <g transform="translate(250 88)">
        <path d="M0 26 L22 6 L44 26 Z" fill="#a4452a" />
        <rect x="6" y="26" width="32" height="24" fill="#f6efdd" />
        <rect x="18" y="34" width="9" height="16" fill="#6b4a33" />
      </g>
      <path d="M0 210 C 260 140, 520 200, 760 160 S 1200 120, 1440 180 V300 H0 Z" fill="#74b152" />
      <Tree x={120} y={150} s={1.1} />
      <Tree x={1360} y={140} />
      {cows && (
        <>
          <g transform="translate(520 132) scale(1.05)"><Cow grazing /></g>
          <g transform="translate(900 118) scale(0.85)"><Cow color="#b5652f" /></g>
          <g transform="translate(1030 124) scale(0.7) translate(120 0) scale(-1 1)"><Cow color="#f1ece2" patch="#c8bda8" grazing /></g>
        </>
      )}
      <path d="M0 262 C 300 220, 600 270, 900 238 S 1300 222, 1440 250 V300 H0 Z" fill={ground} />
    </svg>
  )
}
