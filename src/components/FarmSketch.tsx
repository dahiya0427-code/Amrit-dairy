import Image from 'next/image'

/**
 * Hand-drawn style farm: thin-line hills, barn, trees and fence with pencil
 * sketches of our own cows standing in it (the Mr Dairy "etched farm" look).
 */
const cows = [
  { src: '/images/sketch/gir.png', style: { left: '3%', height: '62%' }, flip: false },
  { src: '/images/sketch/sahiwal.png', style: { left: '24%', height: '50%' }, flip: true },
  { src: '/images/sketch/tharparkar.png', style: { right: '20%', height: '66%' }, flip: false },
  { src: '/images/sketch/rathi.png', style: { right: '2%', height: '46%' }, flip: true },
]

export function FarmSketch({ className = '', count = 4 }: { className?: string; count?: number }) {
  return (
    <div className={`pointer-events-none ${/\babsolute\b/.test(className) ? '' : 'relative'} ${className}`} aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full text-taupe" viewBox="0 0 1200 260" preserveAspectRatio="xMidYMax slice" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {/* far hills */}
        <path d="M0 150 C 140 110, 260 120, 380 140 S 620 100, 760 120 S 1000 150, 1200 112" strokeWidth="1.2" opacity="0.55" />
        <path d="M0 176 C 180 150, 330 170, 500 160 S 820 140, 980 158 S 1120 168, 1200 150" strokeWidth="1.2" opacity="0.7" />
        {/* barn */}
        <g strokeWidth="1.4" opacity="0.8">
          <path d="M640 164 V 104 L 690 74 L 740 104 V 164" />
          <path d="M630 110 L 690 70 L 750 110" />
          <path d="M672 164 V 128 H 708 V 164" />
          <path d="M672 128 L 708 164 M 708 128 L 672 164" />
          <path d="M680 96 H 700 V 112 H 680 Z" />
        </g>
        {/* silo */}
        <g strokeWidth="1.3" opacity="0.7">
          <path d="M752 164 V 96 A 14 14 0 0 1 780 96 V 164" />
          <path d="M752 116 H 780 M 752 136 H 780" />
        </g>
        {/* trees */}
        <g strokeWidth="1.3" opacity="0.75">
          <path d="M470 168 V 128" />
          <path d="M470 132 C 440 132, 436 100, 456 94 C 452 74, 488 70, 490 90 C 510 92, 508 128, 470 132 Z" />
          <path d="M1060 162 V 116" />
          <path d="M1060 120 C 1030 120, 1028 86, 1048 80 C 1046 58, 1082 56, 1082 76 C 1104 80, 1100 118, 1060 120 Z" />
          <path d="M560 166 V 140" />
          <path d="M560 144 C 542 144, 540 124, 552 120 C 552 106, 574 106, 572 120 C 584 124, 580 144, 560 144 Z" />
        </g>
        {/* fence */}
        <g strokeWidth="1.2" opacity="0.7">
          <path d="M800 186 H 1000 M 800 172 H 1000" />
          {[800, 840, 880, 920, 960, 1000].map((x) => <path key={x} d={`M${x} 164 V 196`} />)}
        </g>
        {/* birds */}
        <g strokeWidth="1.2" opacity="0.6">
          <path d="M300 60 q 8 -8 16 0 q 8 -8 16 0" />
          <path d="M340 42 q 6 -6 12 0 q 6 -6 12 0" />
          <path d="M900 50 q 7 -7 14 0 q 7 -7 14 0" />
        </g>
        {/* ground */}
        <path d="M0 238 C 220 226, 420 244, 640 234 S 1000 226, 1200 236" strokeWidth="1.4" />
        <path d="M60 250 h 40 M 300 252 h 60 M 700 250 h 50 M 980 252 h 70" strokeWidth="1" opacity="0.6" />
      </svg>
      {cows.slice(0, count).map((c) => (
        <div key={c.src} className="absolute bottom-[4%] aspect-square" style={c.style}>
          <Image src={c.src} alt="" fill sizes="(max-width: 768px) 30vw, 260px" className={`object-contain object-bottom ${c.flip ? '-scale-x-100' : ''}`} />
        </div>
      ))}
    </div>
  )
}
