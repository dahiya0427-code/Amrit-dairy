import Image from 'next/image'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n'
import type { Product } from '@/payload-types'
import { Icon } from './Icon'

/**
 * Designed story slides for the product picture slider, styled like studio
 * product photography: a softly lit wall with window light, a table the
 * product stands on with a real contact shadow, elegant serif titles. Text
 * comes from the CMS and dictionaries, so slides stay bilingual. Sizes use
 * container units (cqw), so the same slide also renders as its own thumbnail.
 */
type Props = { product: Product; image: string | null; cutout?: string | null; back?: string | null; locale: Locale; fssai?: string | null }

type Wall = 'walnut' | 'sand' | 'peach'
const walls: Record<Wall, { wall: string; table: string; text: string; sub: string }> = {
  walnut: {
    wall: 'bg-[radial-gradient(ellipse_at_28%_18%,#c9ad8e_0%,#9c7d5f_38%,#6e553f_78%,#5a4432_100%)]',
    table: 'bg-[linear-gradient(180deg,#e9dfcf_0%,#d6c7b1_55%,#c6b59c_100%)]',
    text: 'text-[#fbf5ea]',
    sub: 'text-[#f1e6d4]/85',
  },
  sand: {
    wall: 'bg-[radial-gradient(ellipse_at_30%_18%,#f3e9da_0%,#e3d3bd_45%,#cdb899_100%)]',
    table: 'bg-[linear-gradient(180deg,#fbf8f2_0%,#efe7da_60%,#e2d6c4_100%)]',
    text: 'text-[#3a2616]',
    sub: 'text-[#5a4432]',
  },
  peach: {
    wall: 'bg-[radial-gradient(ellipse_at_65%_20%,#fff1dd_0%,#f7d9b3_40%,#e9b98a_85%,#d9a172_100%)]',
    table: 'bg-[linear-gradient(180deg,#f6e3cc_0%,#e8cda9_60%,#d9b88f_100%)]',
    text: 'text-[#5b2412]',
    sub: 'text-[#7a3a1e]',
  },
}

/** Studio set: wall with window light, a table top with an edge, then the content. */
function Studio({ wall, table = 22, children }: { wall: Wall; table?: number; children: React.ReactNode }) {
  const w = walls[wall]
  return (
    <div className={`@container relative aspect-square w-full overflow-hidden rounded-lg ${w.wall}`}>
      {/* window light falling across the wall */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(118deg,transparent_18%,rgb(255_244_222/0.28)_30%,transparent_42%,transparent_52%,rgb(255_244_222/0.18)_62%,transparent_74%)]" aria-hidden="true" />
      {/* table top */}
      <div className={`absolute inset-x-0 bottom-0 ${w.table}`} style={{ height: `${table}%` }} aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-[0.5cqw] bg-white/60" />
        <div className="absolute inset-x-0 top-[0.5cqw] h-[3cqw] bg-[linear-gradient(180deg,rgb(60_35_10/0.16),transparent)]" />
      </div>
      <div className="absolute inset-0">{children}</div>
    </div>
  )
}

/** A product standing on the table: soft contact shadow plus a faint table reflection. */
function OnTable({ src, className, alt = '', photo = false }: { src: string | null | undefined; className: string; alt?: string; photo?: boolean }) {
  if (!src) return null
  return (
    <div className={`absolute ${className}`}>
      <div className="absolute -bottom-[1.2cqw] left-1/2 h-[3.5cqw] w-[92%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(40_22_8/0.45),rgb(40_22_8/0))]" aria-hidden="true" />
      <div className={`relative h-full w-full ${photo ? 'overflow-hidden rounded-[2cqw] bg-white shadow-[0_2cqw_4cqw_rgb(40_22_8/0.25)]' : ''}`}>
        <Image src={src} alt={alt} fill sizes="(max-width: 1024px) 60vw, 30vw" className={photo ? 'object-contain p-[4%]' : 'object-contain object-bottom'} />
      </div>
    </div>
  )
}

const kicker = 'font-[family-name:var(--font-elegant)] text-[3.6cqw] font-medium tracking-[0.04em]'
const big = 'font-[family-name:var(--font-elegant)] text-[8.4cqw] font-semibold uppercase leading-[0.98] tracking-[0.02em]'
const heading = 'font-[family-name:var(--font-elegant)] text-[6.4cqw] font-semibold uppercase leading-[1.05] tracking-[0.02em]'

/** Hand-painted clay matka with a rope-wrapped wooden churner (bilona). */
function Matka() {
  return (
    <svg viewBox="0 0 300 360" className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="mk-body" cx="38%" cy="38%" r="75%">
          <stop offset="0" stopColor="#e8844a" />
          <stop offset="0.45" stopColor="#c8612f" />
          <stop offset="0.8" stopColor="#9a4320" />
          <stop offset="1" stopColor="#7a3417" />
        </radialGradient>
        <linearGradient id="mk-wood" x1="0" x2="1">
          <stop offset="0" stopColor="#6d4323" />
          <stop offset="0.35" stopColor="#b98252" />
          <stop offset="0.6" stopColor="#a06a3c" />
          <stop offset="1" stopColor="#5c381c" />
        </linearGradient>
        <pattern id="mk-rope" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <rect width="10" height="10" fill="#c9a36a" />
          <rect width="4" height="10" fill="#9e7a45" />
        </pattern>
      </defs>
      {/* churner behind the pot */}
      <rect x="136" y="0" width="28" height="210" rx="6" fill="url(#mk-wood)" />
      <rect x="130" y="40" width="40" height="22" rx="8" fill="url(#mk-rope)" />
      <rect x="130" y="70" width="40" height="18" rx="8" fill="url(#mk-rope)" />
      <rect x="112" y="118" width="76" height="12" rx="4" fill="url(#mk-wood)" />
      {/* pot */}
      <path d="M78 150 C 20 175, 10 270, 60 320 C 100 356, 200 356, 240 320 C 290 270, 280 175, 222 150 Z" fill="url(#mk-body)" />
      <path d="M92 150 C 60 175, 52 250, 80 300" stroke="#f3a472" strokeWidth="6" fill="none" opacity="0.5" strokeLinecap="round" />
      {/* rim and neck */}
      <ellipse cx="150" cy="150" rx="80" ry="18" fill="#9a4320" />
      <ellipse cx="150" cy="146" rx="80" ry="16" fill="#c8612f" />
      <ellipse cx="150" cy="146" rx="62" ry="10" fill="#4a1d0b" />
      <rect x="143" y="120" width="14" height="30" fill="url(#mk-wood)" />
      {/* painted bands and rope */}
      <path d="M40 222 C 110 246, 190 246, 262 222" stroke="#f0c24f" strokeWidth="4" fill="none" />
      <path d="M48 250 l10 -10 l10 10 l10 -10 l10 10 l10 -10 l10 10 l10 -10 l10 10 l10 -10 l10 10 l10 -10 l10 10 l10 -10 l10 10 l10 -10 l10 10 l10 -10 l10 10 l10 -10 l10 10" stroke="#f0c24f" strokeWidth="3" fill="none" />
      <path d="M22 196 C 110 226, 190 226, 280 196 L 282 212 C 190 242, 110 242, 20 212 Z" fill="url(#mk-rope)" />
    </svg>
  )
}

/** Generic plastic tub for "regular ghee". */
function PlasticTub() {
  return (
    <svg viewBox="0 0 200 230" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="tub-body" x1="0" x2="1">
          <stop offset="0" stopColor="#e9b312" />
          <stop offset="0.25" stopColor="#ffd84a" />
          <stop offset="0.55" stopColor="#f7c928" />
          <stop offset="1" stopColor="#d99e08" />
        </linearGradient>
        <linearGradient id="tub-lid" x1="0" x2="1">
          <stop offset="0" stopColor="#e8c44a" />
          <stop offset="0.4" stopColor="#fbe27a" />
          <stop offset="1" stopColor="#d9ae2c" />
        </linearGradient>
      </defs>
      <rect x="22" y="44" width="156" height="182" rx="18" fill="url(#tub-body)" />
      <rect x="40" y="56" width="10" height="150" rx="5" fill="#fff6c6" opacity="0.55" />
      <rect x="14" y="14" width="172" height="40" rx="10" fill="url(#tub-lid)" />
      <rect x="14" y="44" width="172" height="10" fill="#c99a1e" opacity="0.5" />
    </svg>
  )
}

const stepIcons = ['cow', 'milk', 'pot', 'churn', 'flame', 'drop', 'jar', 'box']
const testedIcons = ['cow', 'shield', 'lab']
const benefitIcons = ['sparkle', 'flame', 'cow', 'drop', 'leaf', 'shield']

export function storySlides({ product, image, cutout, back, locale, fssai }: Props): { key: string; label: string; node: React.ReactNode }[] {
  const s = getDictionary(locale).story
  const hero = cutout ?? image
  const photo = !cutout
  const out: { key: string; label: string; node: React.ReactNode }[] = []
  const kinds = [...(product.storySlides ?? [])]
  // Extra slides where we have the material for them.
  if (back && kinds.includes('compare')) kinds.splice(kinds.indexOf('compare') + 1, 0, 'tested' as never)
  if ((product.benefits?.length ?? 0) >= 3) kinds.splice(Math.min(kinds.length, 4), 0, 'benefits' as never)

  for (const kind of kinds as string[]) {
    if (kind === 'bilona') {
      const w = walls.peach
      out.push({
        key: kind,
        label: s.bilonaTitle,
        node: (
          <Studio wall="peach" table={20}>
            <div className="absolute -bottom-[2cqw] -left-[6cqw] h-[78cqw] w-[66cqw]"><Matka /></div>
            <div className="absolute right-[6cqw] top-[7cqw] w-[52cqw] text-right">
              <p className={`${kicker} ${w.sub}`}>{s.bilonaKicker}</p>
              <p className={`${big} mt-[1cqw] ${w.text}`}>{s.bilonaBig}</p>
              <p className={`mt-[2.5cqw] text-[2.9cqw] leading-snug ${w.sub}`}>{s.bilonaSub}</p>
            </div>
            <OnTable src={hero} photo={photo} className="bottom-[9cqw] right-[7cqw] h-[44cqw] w-[30cqw]" />
          </Studio>
        ),
      })
    }
    if (kind === 'compare' && product.comparison?.length) {
      const w = walls.walnut
      out.push({
        key: kind,
        label: s.compareTitle,
        node: (
          <Studio wall="walnut" table={18}>
            <div className="absolute inset-x-0 top-[6cqw] text-center">
              <p className={`${kicker} ${w.sub}`}>{s.compareKicker}</p>
              <p className={`${big} ${w.text}`}>{s.compareBig}</p>
            </div>
            <div className="absolute bottom-[4cqw] left-1/2 top-[27cqw] border-l-[0.5cqw] border-dashed border-white/80" aria-hidden="true" />
            <div className="absolute left-[5cqw] right-[53cqw] top-[27cqw] text-right">
              <p className={`flex items-center justify-end gap-[1.5cqw] text-[4.4cqw] font-semibold ${w.text}`}>
                <span className="grid h-[4.6cqw] w-[4.6cqw] place-items-center rounded-[1cqw] bg-[#1d9b4f] text-white"><Icon name="check" size={14} className="h-[70%] w-[70%]" /></span>
                {s.compareOurs}
              </p>
              <ul className={`mt-[1.5cqw] space-y-[0.8cqw] text-[2.6cqw] leading-snug ${w.sub}`}>
                {product.comparison.map((c) => <li key={c.id}>{c.ours}</li>)}
              </ul>
            </div>
            <div className="absolute left-[53cqw] right-[5cqw] top-[27cqw]">
              <p className={`flex items-center gap-[1.5cqw] text-[4.4cqw] font-semibold ${w.text}`}>
                {s.compareRegular}
                <span className="grid h-[4.6cqw] w-[4.6cqw] place-items-center rounded-[1cqw] bg-[#d6332a] text-white"><Icon name="close" size={14} className="h-[70%] w-[70%]" /></span>
              </p>
              <ul className={`mt-[1.5cqw] space-y-[0.8cqw] text-[2.6cqw] leading-snug ${w.sub}`}>
                {product.comparison.map((c) => <li key={c.id}>{c.regular}</li>)}
              </ul>
            </div>
            <OnTable src={hero} photo={photo} className="bottom-[6cqw] left-[12cqw] h-[36cqw] w-[25cqw]" />
            <div className="absolute bottom-[6cqw] right-[14cqw] h-[27cqw] w-[23cqw]">
              <div className="absolute -bottom-[1.2cqw] left-1/2 h-[3.5cqw] w-[92%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(40_22_8/0.4),rgb(40_22_8/0))]" aria-hidden="true" />
              <PlasticTub />
            </div>
          </Studio>
        ),
      })
    }
    if (kind === 'tested' && back) {
      const w = walls.walnut
      out.push({
        key: kind,
        label: s.testedTitle,
        node: (
          <Studio wall="walnut" table={20}>
            <p className={`absolute inset-x-[6cqw] top-[6cqw] text-center ${heading} ${w.text}`}>{s.testedTitle}</p>
            <ul className="absolute inset-x-[8cqw] top-[21cqw] grid grid-cols-3 gap-[2cqw] text-center">
              {s.testedPoints.map((pt, i) => (
                <li key={pt} className={`flex flex-col items-center ${w.sub}`}>
                  <span className="grid h-[8cqw] w-[8cqw] place-items-center rounded-full border-[0.35cqw] border-white/70 text-white">
                    <Icon name={testedIcons[i] ?? 'check'} size={22} className="h-[55%] w-[55%]" />
                  </span>
                  <span className="mt-[1.2cqw] text-[2.6cqw] leading-tight">{pt}</span>
                </li>
              ))}
            </ul>
            <OnTable src={hero} photo={photo} className="bottom-[8cqw] left-[12cqw] h-[44cqw] w-[30cqw]" />
            <OnTable src={back} className="bottom-[8cqw] right-[12cqw] h-[44cqw] w-[30cqw]" />
            <p className="absolute inset-x-0 bottom-[2.5cqw] text-center text-[2.4cqw] font-medium text-[#5a4432]">{s.testedNote}</p>
          </Studio>
        ),
      })
    }
    if (kind === 'process' && product.process?.length) {
      const w = walls.walnut
      out.push({
        key: kind,
        label: s.processTitle,
        node: (
          <Studio wall="walnut" table={24}>
            <div className="absolute inset-x-0 top-[6cqw] text-center">
              <p className={`${kicker} ${w.sub}`}>{s.processKicker}</p>
              <p className={`${big} ${w.text}`}>{s.processTitle}</p>
            </div>
            <ol className="absolute inset-x-[5cqw] top-[27cqw] grid grid-cols-3 gap-x-[2cqw] gap-y-[3cqw]">
              {product.process.slice(0, 6).map((step, i) => (
                <li key={step.id ?? i} className="flex flex-col items-center text-center">
                  <span className="relative grid h-[9cqw] w-[9cqw] place-items-center rounded-full border-[0.35cqw] border-white/70 text-white">
                    <Icon name={stepIcons[i] ?? 'leaf'} size={22} className="h-[55%] w-[55%]" />
                    <span className="absolute -right-[1cqw] -top-[1cqw] grid h-[3.8cqw] w-[3.8cqw] place-items-center rounded-full bg-[#f0c24f] text-[2.1cqw] font-bold text-[#3a2616]">{i + 1}</span>
                  </span>
                  <span className={`mt-[1cqw] text-[2.5cqw] font-medium leading-tight ${w.sub}`}>{step.title}</span>
                </li>
              ))}
            </ol>
            <OnTable src={hero} photo={photo} className="bottom-[8cqw] left-1/2 h-[34cqw] w-[23cqw] -translate-x-1/2" />
          </Studio>
        ),
      })
    }
    if (kind === 'benefits' && product.benefits?.length) {
      const w = walls.sand
      const list = product.benefits.slice(0, 6)
      out.push({
        key: kind,
        label: s.benefitsTitle,
        node: (
          <Studio wall="sand" table={26}>
            <div className="absolute left-1/2 top-[10cqw] h-[80cqw] w-[80cqw] -translate-x-1/2 rounded-full bg-white/35" aria-hidden="true" />
            <p className={`absolute inset-x-0 top-[5cqw] text-center ${heading} ${w.text}`}>{s.benefitsTitle}</p>
            <ul className="absolute inset-0">
              {list.map((b, i) => {
                const a = Math.PI * (1.08 + (0.84 * i) / Math.max(1, list.length - 1))
                const left = 50 + 33 * Math.cos(a)
                const top = 50 + 30 * Math.sin(a)
                return (
                  <li key={b.id ?? i} className={`absolute flex w-[25cqw] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center ${w.sub}`} style={{ left: `${left}%`, top: `${top}%` }}>
                    <span className="grid h-[8cqw] w-[8cqw] place-items-center rounded-full text-[#6e553f]">
                      <Icon name={benefitIcons[i] ?? 'sparkle'} size={26} className="h-[70%] w-[70%]" />
                    </span>
                    <span className="mt-[0.5cqw] text-[2.6cqw] font-medium leading-tight">{b.text}</span>
                  </li>
                )
              })}
            </ul>
            <OnTable src={hero} photo={photo} className="bottom-[10cqw] left-1/2 h-[42cqw] w-[28cqw] -translate-x-1/2" />
          </Studio>
        ),
      })
    }
    if (kind === 'uses' && product.usage?.length) {
      const w = walls.sand
      const uses = product.usage.slice(0, 6)
      const half = Math.ceil(uses.length / 2)
      const chip = 'rounded-full bg-white/80 px-[2.4cqw] py-[1.4cqw] text-center text-[2.6cqw] font-medium leading-tight text-[#3a2616] shadow-[0_0.6cqw_1.8cqw_rgb(60_35_10/0.15)]'
      out.push({
        key: kind,
        label: s.usesTitle,
        node: (
          <Studio wall="sand" table={24}>
            <p className={`absolute inset-x-[6cqw] top-[6cqw] text-center ${heading} ${w.text}`}>{s.usesTitle}</p>
            <ul className="absolute left-[5cqw] top-[28cqw] flex w-[30cqw] flex-col gap-[2.6cqw]">{uses.slice(0, half).map((u) => <li key={u.id} className={chip}>{u.text}</li>)}</ul>
            <ul className="absolute right-[5cqw] top-[28cqw] flex w-[30cqw] flex-col gap-[2.6cqw]">{uses.slice(half).map((u) => <li key={u.id} className={chip}>{u.text}</li>)}</ul>
            <OnTable src={hero} photo={photo} className="bottom-[9cqw] left-1/2 h-[48cqw] w-[30cqw] -translate-x-1/2" />
          </Studio>
        ),
      })
    }
    if (kind === 'source') {
      const w = walls.walnut
      out.push({
        key: kind,
        label: s.sourceTitle,
        node: (
          <Studio wall="walnut" table={24}>
            {/* a framed farm photo hanging on the wall */}
            <div className="absolute left-[7cqw] top-[8cqw] h-[34cqw] w-[44cqw] rotate-[-2deg] rounded-[1cqw] bg-[#f6efe2] p-[1.6cqw] shadow-[0_2cqw_4cqw_rgb(20_10_4/0.35)]">
              <div className="relative h-full w-full overflow-hidden rounded-[0.6cqw]">
                <Image src="/images/cat-cow.jpg" alt="" fill sizes="300px" className="object-cover" />
              </div>
            </div>
            <div className="absolute right-[6cqw] top-[8cqw] w-[40cqw]">
              <p className={`${kicker} ${w.sub}`}>{s.sourceKicker}</p>
              <p className={`${heading} ${w.text}`}>{s.sourceTitle}</p>
              <ul className={`mt-[2cqw] space-y-[1.2cqw] text-[2.8cqw] leading-snug ${w.sub}`}>
                {s.sourcePoints.map((p) => (
                  <li key={p} className="flex items-start gap-[1.2cqw]"><Icon name="check" className="mt-[0.3cqw] h-[2.8cqw] w-[2.8cqw] shrink-0 text-[#f0c24f]" size={14} /> {p}</li>
                ))}
              </ul>
              {fssai && <p className={`mt-[2cqw] inline-block rounded-full border-[0.3cqw] border-white/60 px-[2cqw] py-[0.6cqw] text-[2.3cqw] ${w.sub}`}>{s.sourceFssai} {fssai}</p>}
            </div>
            <OnTable src={hero} photo={photo} className="bottom-[9cqw] left-[17cqw] h-[40cqw] w-[27cqw]" />
          </Studio>
        ),
      })
    }
  }
  return out
}
