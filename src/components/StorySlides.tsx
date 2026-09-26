import Image from 'next/image'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n'
import type { Product } from '@/payload-types'
import { Icon } from './Icon'

/**
 * Designed "infographic" slides for the product picture slider (like printed
 * story cards). Text comes from the CMS, so they stay bilingual and editable.
 * Sizes use container units (cqw) so a slide looks the same at any width.
 */
type Props = { product: Product; image: string | null; cutout?: string | null; locale: Locale; fssai?: string | null }

const stepIcons = ['cow', 'milk', 'pot', 'churn', 'flame', 'drop', 'jar', 'box']

/** Floating product: the transparent cutout if there is one, else the packshot on a round plate. */
function FloatingPack({ image, cutout, className = '' }: { image: string | null; cutout?: string | null; className?: string }) {
  const src = cutout ?? image
  if (!src) return null
  return (
    <div className={`pointer-events-none relative ${className}`}>
      <div className={`animate-float relative h-full w-full ${cutout ? '' : 'overflow-hidden rounded-full bg-malai shadow-float'}`}>
        <Image src={src} alt="" fill sizes="240px" className={cutout ? 'object-contain drop-shadow-2xl' : 'object-contain p-[12%]'} />
      </div>
      <div className="animate-float-shadow mx-auto -mt-[2cqw] h-[2.5cqw] w-2/3 rounded-full bg-ink/40 blur-md" />
    </div>
  )
}

function Frame({ tone, children }: { tone: 'warm' | 'forest' | 'cream'; children: React.ReactNode }) {
  const bg = {
    warm: 'bg-[radial-gradient(circle_at_30%_20%,#fbebc7,#e8c27a_55%,#b77b2c)] text-ink',
    forest: 'bg-[radial-gradient(circle_at_70%_10%,#6b4526,#3b2415_60%,#1a0f08)] text-cream',
    cream: 'bg-[linear-gradient(160deg,#fffdf7,#f6efdd)] text-ink',
  }[tone]
  return (
    <div className={`@container relative aspect-square w-full overflow-hidden rounded-lg ${bg}`}>
      <div className="absolute inset-0 flex flex-col px-[9%] pb-[6%] pt-[7%]">{children}</div>
    </div>
  )
}

const title = 'text-center font-serif text-[7.5cqw] font-semibold leading-[1.05]'

/** Line drawing of a clay matka with a wooden bilona churner. */
function BilonaArt() {
  return (
    <svg viewBox="0 0 200 220" className="h-full w-full" aria-hidden="true">
      <g fill="none" stroke="#6b3f14" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M100 8v120" />
        <path d="M78 30h44" />
        <path d="M86 18c-10 8-10 22 0 28M114 18c10 8 10 22 0 28" stroke="#8a5a00" strokeWidth="3" />
      </g>
      <path d="M40 120h120l-8 56c-3 22-22 36-52 36s-49-14-52-36l-8-56Z" fill="#a4452a" />
      <path d="M34 112h132a6 6 0 0 1 0 12H34a6 6 0 0 1 0-12Z" fill="#8a3a22" />
      <path d="M52 160c16 8 80 8 96 0" stroke="#e7a93a" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M56 176c14 6 74 6 88 0" stroke="#fbebc7" strokeWidth="3" fill="none" strokeDasharray="6 8" strokeLinecap="round" />
    </svg>
  )
}

export function storySlides({ product, image, cutout, locale, fssai }: Props): { key: string; label: string; node: React.ReactNode }[] {
  const s = getDictionary(locale).story
  const out: { key: string; label: string; node: React.ReactNode }[] = []

  for (const kind of product.storySlides ?? []) {
    if (kind === 'bilona') {
      out.push({
        key: kind,
        label: s.bilonaTitle,
        node: (
          <Frame tone="warm">
            <p className={`${title} text-espresso`}>{s.bilonaTitle}</p>
            <p className="mx-auto mt-[2cqw] max-w-[85%] text-center text-[3.4cqw] leading-snug text-ink/80">{s.bilonaSub}</p>
            <div className="mt-auto flex items-end justify-center gap-[6%]">
              <div className="h-[42cqw] w-[36cqw]"><BilonaArt /></div>
              <FloatingPack image={image} cutout={cutout} className="h-[40cqw] w-[30cqw]" />
            </div>
          </Frame>
        ),
      })
    }
    if (kind === 'process' && product.process?.length) {
      out.push({
        key: kind,
        label: s.processTitle,
        node: (
          <Frame tone="forest">
            <p className={`${title} text-gold-500`}>{s.processTitle}</p>
            <ol className="mt-[5cqw] grid grid-cols-3 gap-x-[2cqw] gap-y-[4cqw]">
              {product.process.slice(0, 6).map((step, i) => (
                <li key={step.id ?? i} className="flex flex-col items-center text-center">
                  <span className="relative grid h-[11cqw] w-[11cqw] place-items-center rounded-full border-2 border-gold-500/70 text-gold-500">
                    <Icon name={stepIcons[i] ?? 'leaf'} size={24} />
                    <span className="absolute -right-[1cqw] -top-[1cqw] grid h-[4.5cqw] w-[4.5cqw] place-items-center rounded-full bg-gold-500 text-[2.6cqw] font-bold text-ink">{i + 1}</span>
                  </span>
                  <span className="mt-[1.5cqw] text-[3cqw] font-semibold leading-tight">{step.title}</span>
                </li>
              ))}
            </ol>
            <FloatingPack image={image} cutout={cutout} className="mx-auto mt-auto h-[24cqw] w-[20cqw]" />
          </Frame>
        ),
      })
    }
    if (kind === 'compare' && product.comparison?.length) {
      out.push({
        key: kind,
        label: s.compareTitle,
        node: (
          <Frame tone="cream">
            <p className={`${title} text-walnut`}>{s.compareTitle}</p>
            <div className="mt-[4cqw] grid flex-1 grid-cols-2 gap-[3cqw]">
              <div className="rounded-[3cqw] bg-walnut p-[3.5cqw] text-cream">
                <p className="flex items-center gap-[1.5cqw] font-serif text-[4.6cqw] font-semibold text-gold-500">
                  <span className="grid h-[4.5cqw] w-[4.5cqw] place-items-center rounded-full bg-success text-white"><Icon name="check" size={12} /></span>
                  {s.compareOurs}
                </p>
                <ul className="mt-[2.5cqw] space-y-[1.8cqw] text-[3cqw] leading-snug">
                  {product.comparison.map((c) => <li key={c.id}>{c.ours}</li>)}
                </ul>
              </div>
              <div className="rounded-[3cqw] border-2 border-dashed border-line bg-white/70 p-[3.5cqw] text-muted">
                <p className="flex items-center gap-[1.5cqw] font-serif text-[4.6cqw] font-semibold">
                  <span className="grid h-[4.5cqw] w-[4.5cqw] place-items-center rounded-full bg-error text-white"><Icon name="close" size={12} /></span>
                  {s.compareRegular}
                </p>
                <ul className="mt-[2.5cqw] space-y-[1.8cqw] text-[3cqw] leading-snug">
                  {product.comparison.map((c) => <li key={c.id}>{c.regular}</li>)}
                </ul>
              </div>
            </div>
          </Frame>
        ),
      })
    }
    if (kind === 'uses' && product.usage?.length) {
      const uses = product.usage.slice(0, 6)
      const half = Math.ceil(uses.length / 2)
      const chip = 'rounded-[2.5cqw] bg-cream/90 px-[2.5cqw] py-[1.8cqw] text-center text-[3cqw] font-semibold leading-tight text-walnut shadow-card'
      out.push({
        key: kind,
        label: s.usesTitle,
        node: (
          <Frame tone="warm">
            <p className={`${title} text-espresso`}>{s.usesTitle}</p>
            <div className="mt-auto grid grid-cols-[1fr_auto_1fr] items-center gap-[3cqw]">
              <ul className="flex flex-col gap-[3cqw]">{uses.slice(0, half).map((u) => <li key={u.id} className={chip}>{u.text}</li>)}</ul>
              <FloatingPack image={image} cutout={cutout} className="h-[46cqw] w-[26cqw]" />
              <ul className="flex flex-col gap-[3cqw]">{uses.slice(half).map((u) => <li key={u.id} className={chip}>{u.text}</li>)}</ul>
            </div>
          </Frame>
        ),
      })
    }
    if (kind === 'source') {
      out.push({
        key: kind,
        label: s.sourceTitle,
        node: (
          <Frame tone="forest">
            <p className="font-serif text-[7.5cqw] font-semibold leading-[1.05] text-gold-500">{s.sourceTitle}</p>
            <ul className="mt-[3cqw] space-y-[1.8cqw] text-[3.6cqw]">
              {s.sourcePoints.map((p) => (
                <li key={p} className="flex items-center gap-[2cqw]"><Icon name="check" className="shrink-0 text-gold-500" /> {p}</li>
              ))}
            </ul>
            {fssai && (
              <p className="mt-[3cqw] self-start rounded-full border border-gold-500/60 px-[3cqw] py-[1cqw] text-[2.8cqw]">
                {s.sourceFssai} {fssai}
              </p>
            )}
            <div className="mt-auto flex items-end justify-between gap-[3cqw]">
              <div className="relative h-[34cqw] w-[46cqw] overflow-hidden rounded-[4cqw]">
                <Image src="/images/cat-cow.jpg" alt="" fill sizes="300px" className="object-cover" />
              </div>
              <FloatingPack image={image} cutout={cutout} className="h-[36cqw] w-[26cqw]" />
            </div>
          </Frame>
        ),
      })
    }
  }
  return out
}
