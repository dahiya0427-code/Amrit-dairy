'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { useI18n } from './I18nProvider'
import { Icon } from './Icon'
import { attachStoryDriver } from './scroll-story-driver'

/**
 * Scroll story (Mr Dairy style): full-screen scenes slide up one after another
 * while the ghee jar stays pinned in the middle and turns as each scene changes.
 * Rendered in its first-scene state; scroll-story-driver.ts does the motion
 * (the same driver runs in the static preview).
 */
type Breed = { name: string; image: string | null; origin?: string | null }
type Item = { title: string; price: string | null; image: string; href: string }

const SCENES = 7
const stepIcons = ['milk', 'pot', 'churn', 'drop', 'flame']
const pointIcons = ['cow', 'churn', 'shield', 'jar', 'sparkle', 'check']
const nutrientMarks = ['A', 'D', 'E', 'K', 'Ω3', '♥']

/** Jar pose per scene: x in vw (desktop only), y in % of the jar box, scale, opacity. */
const jarDesktop = [
  { x: 0, y: 0, s: 1, r: 0, o: 1 },
  { x: 0, y: 6, s: 0.72, r: 0, o: 1 },
  { x: 0, y: 6, s: 0.62, r: 0, o: 1 },
  { x: 0, y: 0, s: 0.52, r: 0, o: 1 },
  { x: 0, y: 28, s: 0.58, r: 0, o: 1 },
  { x: 0, y: 0, s: 0.52, r: 0, o: 1 },
  { x: 24, y: 0, s: 0.92, r: 0, o: 1 },
]
const jarMobile = [
  { x: 0, y: 14, s: 0.72, r: 0, o: 1 },
  { x: 0, y: 4, s: 0.64, r: 0, o: 1 },
  { x: 0, y: 0, s: 0.46, r: 0, o: 1 },
  { x: 0, y: 0, s: 0.36, r: 0, o: 1 },
  { x: 0, y: 40, s: 0.5, r: 0, o: 1 },
  { x: 0, y: 0, s: 0.36, r: 0, o: 1 },
  { x: 0, y: 30, s: 0.72, r: 0, o: 1 },
]

/** Points evenly spaced on a circle, as % positions inside a square box. */
function ring(n: number, radius: number, start = -90) {
  return Array.from({ length: n }, (_, i) => {
    const a = ((start + (360 / n) * i) * Math.PI) / 180
    return { left: `${50 + radius * Math.cos(a)}%`, top: `${50 + radius * Math.sin(a)}%` }
  })
}

/** Space under the sticky header, shared by every scene and the jar layer. */
const pad = 'pt-[116px] md:pt-[136px]'

export function ScrollStory({ jar, turntable, breeds, items, centre, shopHref, whatsappHref }: { jar: string; turntable: string; breeds: Breed[]; items: Item[]; centre: Item; shopHref: string; whatsappHref: string }) {
  const { t } = useI18n()
  const s = t.scroll
  const root = useRef<HTMLElement>(null)

  useEffect(() => (root.current ? attachStoryDriver(root.current) : undefined), [])

  const scene = (i: number) => ({
    'data-scene': i,
    inert: i !== 0,
    'aria-hidden': i !== 0,
    className: `absolute inset-0 overflow-hidden transition-transform duration-[900ms] ease-[cubic-bezier(0.7,0,0.3,1)] motion-reduce:transition-none ${i === 0 ? 'translate-y-0' : 'translate-y-full'}`,
  })
  const inner = `container-x relative h-full ${pad}`
  const title = 'font-serif text-3xl leading-[0.95] md:text-5xl lg:text-6xl'
  const benefitPos = ring(6, 40)
  const nutrientPos = ring(6, 40)
  const j = jarDesktop[0]
  const columns = [items[0], items[1], centre, items[2], items[3]].filter(Boolean)

  return (
    <section ref={root} data-story aria-label={s.label} className="relative -mt-[113px] bg-coal md:-mt-[129px]" style={{ height: `${SCENES * 100}svh` }}>
      <a href="#after-story" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-30 focus:rounded-full focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-ink">
        {s.skip}
      </a>
      <div className="sticky top-0 h-svh overflow-hidden bg-char">
        {/* 1 · Pure Bilona Ghee: big bold farm drawing (scripts/farm-hero.py), Mr Dairy layout:
            title on the left with its sub-line, the jar in the middle, the welcome text top right */}
        <div {...scene(0)}>
          {/* phones: the whole drawing, uncropped, just above the bottom bar; larger screens: fills the lower part */}
          <div className="absolute inset-x-0 bottom-[calc(62px+env(safe-area-inset-bottom))] aspect-[2400/1000] md:bottom-0 md:aspect-auto md:h-[72%]" aria-hidden="true">
            <Image src="/images/sketch/farm-hero.png" alt="" fill priority sizes="100vw" className="object-contain object-bottom md:object-cover" />
          </div>
          <div className={inner}>
            <div className="grid content-start gap-5 pt-4 md:grid-cols-[1fr_minmax(0,22vw)_1fr] md:gap-8 md:pt-[6vh]">
              <div className="md:pl-[6%] [text-shadow:0_0_14px_#fff,0_0_6px_#fff,0_0_2px_#fff]">
                <h1 className={`${title} !text-[#6b3d1f] !text-4xl leading-[0.92] md:!text-6xl lg:!text-7xl`}>{s.s1.title}</h1>
                <p className="mt-3 font-serif text-lg font-bold uppercase tracking-[0.06em] text-gold-700 md:mt-4 md:text-xl">{s.s1.eyebrow}</p>
              </div>
              <div className="hidden md:block" />
              <p className="max-w-md text-base leading-relaxed tracking-[0.04em] text-ink/80 [text-shadow:0_0_10px_#fff,0_0_4px_#fff] md:pt-2 md:text-lg lg:text-xl">{s.s1.text}</p>
            </div>
          </div>
        </div>

        {/* 2 · What is A2: a dark stage with the jar in a spotlight, A1 vs A2 on the
            left and the desi breeds in arched gold frames on the right */}
        <div {...scene(1)}>
          <div className="absolute inset-0 overflow-hidden bg-ink" aria-hidden="true">
            {/* spotlight from above onto the jar, and a warm pool of light under it */}
            <div className="absolute left-1/2 top-0 h-full w-[70vw] max-w-[760px] -translate-x-1/2 bg-[radial-gradient(ellipse_50%_75%_at_50%_0%,rgba(201,162,74,0.22),transparent_70%)]" />
            <div className="absolute left-1/2 top-[64%] aspect-square w-[90vw] max-w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,162,74,0.34)_0%,rgba(201,162,74,0.1)_42%,transparent_68%)]" />
            <div className="absolute left-1/2 top-[64%] hidden aspect-square w-[52vh] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold-500/25 md:block" />
            <div className="absolute left-1/2 top-[64%] hidden aspect-square w-[64vh] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-gold-500/15 md:block" />
            <span className="absolute -bottom-[8vh] left-1/2 -translate-x-1/2 select-none font-serif text-[52vh] font-bold leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(201,162,74,0.12)]">A2</span>
            <svg className="absolute inset-x-0 bottom-0 h-14 w-full text-gold-500/45 md:h-20" viewBox="0 0 1200 60" preserveAspectRatio="none" fill="none" stroke="currentColor">
              {Array.from({ length: 140 }, (_, k) => {
                const x = k * 8.6 + (k % 3) * 3
                const h = 14 + ((k * 37) % 42)
                return <path key={k} d={`M${x} 60 q ${k % 2 ? 4 : -4} -${h / 2} ${k % 2 ? 2 : -2} -${h}`} strokeWidth="1" vectorEffect="non-scaling-stroke" />
              })}
            </svg>
          </div>
          <div className={inner}>
            <div className="relative h-full">
              <div className="mx-auto max-w-3xl pt-3 text-center md:pt-6">
                <p className="inline-flex items-center gap-3 font-serif text-xs font-bold uppercase tracking-[0.3em] text-gold-500 md:text-sm">
                  <span className="h-px w-8 bg-gold-500/70" aria-hidden="true" />
                  {s.s2.kicker}
                  <span className="h-px w-8 bg-gold-500/70" aria-hidden="true" />
                </p>
                <h2 className={`${title} mt-3 !text-snow`}>
                  {s.s2.title.split('A2').map((part, k, all) => (
                    <span key={k}>
                      {part}
                      {k < all.length - 1 && <span className="text-gold-500">A2</span>}
                    </span>
                  ))}
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm text-snow/75 md:text-lg">{s.s2.text}</p>
              </div>

              {/* A1 vs A2 */}
              <div
                data-reveal={1}
                data-o
                data-on="none"
                data-off="translateX(-40px)"
                className="absolute inset-x-0 top-[23%] opacity-0 transition duration-700 md:inset-x-auto md:left-0 md:top-[36%] md:w-[30%] lg:left-[2%] lg:w-[26%]"
                style={{ transform: 'translateX(-40px)', transitionDelay: '0.45s' }}
              >
                <p className="hidden font-serif text-sm font-bold uppercase tracking-[0.25em] text-gold-500 md:block">{s.s2.vs}</p>
                <div className="grid grid-cols-2 gap-2 md:mt-3 md:grid-cols-1 md:gap-3">
                  <div className="flex items-center gap-2 rounded-2xl border border-snow/10 bg-snow/[0.04] p-2.5 md:gap-4 md:p-4">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-snow/25 text-snow/50 md:h-11 md:w-11">
                      <Icon name="close" size={16} />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-serif text-sm font-bold uppercase leading-tight text-snow/55 line-through decoration-gold-500/60 md:text-xl">{s.s2.a1.label}</span>
                      <span className="block text-[11px] leading-snug text-snow/45 md:text-sm">{s.s2.a1.who}<span className="hidden md:inline"> · {s.s2.a1.note}</span></span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl border border-gold-500/60 bg-gradient-to-br from-gold-500/25 to-gold-500/5 p-2.5 shadow-[0_0_40px_-12px_rgba(201,162,74,0.7)] md:gap-4 md:p-4">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold-500 text-ink md:h-11 md:w-11">
                      <Icon name="check" size={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-serif text-sm font-bold uppercase leading-tight text-gold-500 md:text-xl">{s.s2.a2.label}</span>
                      <span className="block text-[11px] leading-snug text-snow/85 md:text-sm">{s.s2.a2.who}<span className="hidden md:inline"> · {s.s2.a2.note}</span></span>
                    </span>
                  </div>
                </div>
              </div>

              {/* desi breeds in arched gold frames */}
              <div className="absolute inset-x-0 bottom-[10%] md:inset-x-auto md:bottom-auto md:right-0 md:top-[29%] md:w-[30%] lg:right-[2%] lg:w-[25%]">
                <p className="hidden text-right font-serif text-sm font-bold uppercase tracking-[0.25em] text-gold-500 md:block">{s.s2.breedsLabel}</p>
                <ul className="grid grid-cols-4 gap-2 md:mt-3 md:grid-cols-2 md:gap-3">
                  {breeds.slice(0, 4).map((b, i) => (
                    <li
                      key={b.name}
                      data-reveal={1}
                      data-o
                      data-on="none"
                      data-off="translateY(40px)"
                      className="group opacity-0 transition duration-700"
                      style={{ transform: 'translateY(40px)', transitionDelay: `${0.35 + 0.1 * i}s` }}
                    >
                      <span className="block rounded-t-full rounded-b-2xl bg-gradient-to-b from-[#f3dc9a] via-gold-500 to-gold-700 p-[2px] shadow-[0_18px_30px_-16px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover:-translate-y-1">
                        <span className="relative block aspect-[3/4] overflow-hidden rounded-t-full md:aspect-[5/6] rounded-b-[14px] bg-char">
                          {b.image && <Image src={b.image} alt="" fill sizes="(min-width: 768px) 14vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />}
                          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/70 to-transparent px-1 pb-1.5 pt-6 text-center md:pb-2.5">
                            <span className="block font-serif text-[11px] font-bold uppercase tracking-[0.06em] text-snow md:text-base">{b.name}</span>
                          </span>
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 3 · The Bilona way: dark title band and a pipe diagram into the jar */}
        <div {...scene(2)}>
          <div className="absolute inset-x-0 top-0 h-[30%] bg-ink md:h-[34%]" aria-hidden="true" />
          <div className={inner}>
            <div className="relative h-full">
              <h2 className={`${title} pt-6 text-center !text-snow`}>{s.s3.title}</h2>
              <svg className="absolute inset-0 hidden h-full w-full text-gold-500 md:block" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
                {['M150 300 H 330 V 360 H 440', 'M150 470 H 330 V 360', 'M850 250 H 670 V 360 H 560', 'M850 380 H 670', 'M850 510 H 670 V 360'].map((d, i) => (
                  <path key={d} data-draw={2} d={d} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray="1" strokeDashoffset={1} style={{ transition: `stroke-dashoffset 1.1s ease ${0.5 + 0.15 * i}s` }} />
                ))}
              </svg>
              <ol className="absolute inset-x-0 bottom-[12%] grid grid-cols-5 gap-1 md:inset-0 md:block">
                {s.s3.steps.map((step, i) => {
                  const pos = [
                    { left: '15%', top: '50%' },
                    { left: '15%', top: '78%' },
                    { left: '85%', top: '42%' },
                    { left: '85%', top: '63%' },
                    { left: '85%', top: '85%' },
                  ][i]
                  return (
                    <li key={step} className="flex flex-col items-center text-center md:absolute md:left-[var(--l)] md:top-[var(--t)] md:w-40 md:-translate-x-1/2 md:-translate-y-1/2" style={{ '--l': pos.left, '--t': pos.top } as React.CSSProperties}>
                      <span className="relative grid h-11 w-11 place-items-center rounded-full border border-gold-500 bg-char text-gold-700 shadow-card md:h-16 md:w-16">
                        <Icon name={stepIcons[i]} size={24} />
                        <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-gold-500 text-[10px] font-bold text-ink md:h-6 md:w-6 md:text-xs">{i + 1}</span>
                      </span>
                      <span className="mt-2 text-[11px] font-semibold leading-tight md:text-base">{step}</span>
                    </li>
                  )
                })}
              </ol>
            </div>
          </div>
        </div>

        {/* 4 · Why families love Amrit: soft gold glow, points around */}
        <div {...scene(3)}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,#f1e3c3_0%,rgb(241_227_195/0.35)_28%,rgb(255_255_255/0)_55%)]" aria-hidden="true" />
          <div className={inner}>
            <div className="relative h-full">
              <h2 className={`${title} pt-6 text-center`}>{s.s4.title}</h2>
              <div className="absolute left-1/2 top-[55%] aspect-square w-[min(84vw,62svh)] -translate-x-1/2 -translate-y-1/2">
                <div className="absolute inset-[10%] rounded-full border border-gold-500/50" aria-hidden="true" />
                <ul>
                  {s.s4.points.map((p, i) => (
                    <li key={p} data-reveal={3} data-o className="absolute flex w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center opacity-0 transition duration-500 md:w-36" style={{ ...benefitPos[i], transitionDelay: `${0.5 + 0.08 * i}s` }}>
                      <span className="grid h-11 w-11 place-items-center rounded-full border border-gold-500 bg-char text-gold-700 shadow-card md:h-14 md:w-14">
                        <Icon name={pointIcons[i]} size={24} />
                      </span>
                      <span className="mt-1.5 text-[11px] font-semibold leading-tight md:text-sm">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 5 · Products: tinted columns, the jar becomes the middle product */}
        <div {...scene(4)}>
          <div className="absolute inset-0 grid grid-cols-5" aria-hidden="true">
            {columns.map((_, i) => <span key={i} className={i % 2 ? 'bg-smoke' : 'bg-cocoa'} />)}
          </div>
          <p className="absolute right-1 top-1/2 hidden -translate-y-1/2 font-serif text-4xl font-bold uppercase tracking-[0.3em] text-gold-700 [writing-mode:vertical-rl] md:block" aria-hidden="true">
            {s.s5.label}
          </p>
          <h2 className="sr-only">{s.s5.title}</h2>
          <ul className={`absolute inset-0 grid grid-cols-5 ${pad}`}>
            {columns.map((item, i) => (
              <li key={item.href + i} className="relative">
                <Link href={item.href} className="group absolute inset-0 flex flex-col items-center px-1 pt-6 text-center md:pt-10">
                  <span className="font-serif text-xs font-bold uppercase leading-tight md:text-lg">{item.title}</span>
                  {item.price && <span className="mt-1 text-xs font-bold text-gold-700 md:text-base">{item.price}</span>}
                  {i !== 2 && (
                    <span data-reveal={4} data-on="none" data-off="translateY(60px)" className="absolute inset-x-1 bottom-[12%] h-[22svh] transition duration-700 md:bottom-[6%] md:h-[34svh]" style={{ transform: 'translateY(60px)', transitionDelay: `${0.45 + 0.08 * i}s` }}>
                      <Image src={item.image} alt="" fill sizes="(max-width: 768px) 20vw, 200px" className="object-contain object-bottom drop-shadow-xl transition duration-500 group-hover:-translate-y-2" />
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 6 · Goodness in every spoon: nutrient bubbles */}
        <div {...scene(5)}>
          <div className={inner}>
            <div className="relative h-full">
              <h2 className={`${title} pt-6 text-center`}>{s.s6.title}</h2>
              <div className="absolute left-1/2 top-[55%] aspect-square w-[min(84vw,62svh)] -translate-x-1/2 -translate-y-1/2">
                <ul>
                  {s.s6.points.map((p, i) => (
                    <li key={p} data-reveal={5} data-o data-on="translate(-50%, -50%) scale(1)" data-off="translate(-50%, -50%) scale(0.4)" className="absolute flex w-20 flex-col items-center text-center opacity-0 transition duration-500 md:w-28" style={{ ...nutrientPos[i], transform: 'translate(-50%, -50%) scale(0.4)', transitionDelay: `${0.5 + 0.07 * i}s` }}>
                      <span className="grid h-12 w-12 place-items-center rounded-full bg-gold-500 font-serif text-lg font-bold text-ink shadow-card md:h-16 md:w-16 md:text-2xl">{nutrientMarks[i]}</span>
                      <span className="mt-1.5 text-[11px] font-semibold leading-tight md:text-sm">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 7 · Bring Amrit home */}
        <div {...scene(6)}>
          <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-smoke md:block" aria-hidden="true" />
          <div className={inner}>
            <div className="flex h-full max-w-md flex-col pt-6 md:justify-center md:pt-0 lg:max-w-xl">
              <h2 className={title}>{s.s7.title}</h2>
              <p className="mt-4 text-lg text-muted">{s.s7.text}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={shopHref} className="btn btn-gold !px-8">{s.s7.cta} <Icon name="arrow" size={18} /></Link>
                <a href={whatsappHref} target="_blank" rel="noopener" className="btn btn-outline !px-8"><Icon name="whatsapp" size={18} /> {s.s7.cta2}</a>
              </div>
            </div>
          </div>
        </div>

        {/* The pinned jar: stays put while scenes slide, turns on each change */}
        <div className={`pointer-events-none absolute inset-0 z-10 ${pad}`} aria-hidden="true">
          <div className="container-x relative h-full">
            <div className="absolute left-1/2 top-[55%] h-[44svh] w-[min(58vw,340px)] md:h-[58svh]">
              <div
                data-jar
                data-desktop={JSON.stringify(jarDesktop)}
                data-mobile={JSON.stringify(jarMobile)}
                className="h-full w-full transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(0.7,0,0.3,1)] will-change-transform motion-reduce:transition-none"
                style={{ transform: `translate(calc(-50% + ${j.x}vw), calc(-50% + ${j.y}%)) scale(${j.s})`, opacity: j.o }}
              >
                {/* soft floor shadow: a fixed blurred ellipse (a filter on the turning jar would repaint every frame) */}
                <div className="absolute bottom-[-2%] left-1/2 h-[7%] w-[70%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(60_35_10/0.35),rgb(60_35_10/0))]" />
                <div className="animate-float-wide relative h-full w-full will-change-transform">
                  <Image data-jar-still src={jar} alt="" fill priority sizes="340px" className="object-contain transition-opacity duration-300" />
                  {/* real 360° turntable of the jar, drawn frame by frame once loaded (see scripts/jar-turntable.py) */}
                  <canvas data-jar-turn className="absolute left-1/2 top-1/2 aspect-[351/560] h-full -translate-x-1/2 -translate-y-1/2 opacity-0" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img data-jar-sprite src={turntable} alt="" hidden />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scene dots */}
        <ol className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-2.5 md:flex" aria-label={s.label}>
          {Array.from({ length: SCENES }, (_, i) => (
            <li key={i}>
              <button type="button" data-dot={i} aria-label={t.story.slideLabel(i + 1, SCENES)} aria-current={i === 0} className={`block w-2.5 rounded-full transition-all ${i === 0 ? 'h-8 bg-gold-500' : 'h-2.5 bg-ink/20 hover:bg-ink/50'}`} />
            </li>
          ))}
        </ol>
        <p data-hint className="absolute bottom-5 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center text-xs font-semibold uppercase tracking-[0.2em] text-muted opacity-100 transition-opacity md:flex" aria-hidden="true">
          {s.hint}
          <span className="mt-1 h-8 w-px animate-pulse bg-gold-500" />
        </p>
      </div>
      <span id="after-story" className="absolute bottom-0" />
    </section>
  )
}
