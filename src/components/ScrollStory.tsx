'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FarmSketch } from './FarmSketch'
import { useI18n } from './I18nProvider'
import { Icon } from './Icon'

/**
 * Scroll story (Mr Dairy style): the ghee jar stays pinned in the middle of
 * the screen while seven scenes change around it as you scroll.
 */
type Breed = { name: string; image: string | null }
type Item = { title: string; price: string | null; image: string; href: string }

const SCENES = 7
const stepIcons = ['milk', 'pot', 'churn', 'drop', 'flame']
const pointIcons = ['cow', 'churn', 'shield', 'jar', 'sparkle', 'check']
const nutrientMarks = ['A', 'D', 'E', 'K', 'Ω3', '♥']

/** Jar position per scene: x in vw (desktop only), y in %, scale, rotation, opacity. */
const jarDesktop = [
  { x: 0, y: 0, s: 1, r: 0, o: 1 },
  { x: 0, y: 0, s: 0.78, r: 0, o: 1 },
  { x: 0, y: 0, s: 0.6, r: 0, o: 1 },
  { x: 0, y: 0, s: 0.52, r: 0, o: 1 },
  { x: 0, y: 20, s: 0.45, r: 0, o: 0 },
  { x: 0, y: 0, s: 0.52, r: 0, o: 1 },
  { x: 26, y: 0, s: 0.95, r: 0, o: 1 },
]
const jarMobile = [
  { x: 0, y: 30, s: 0.62, r: 0, o: 1 },
  { x: 0, y: 0, s: 0.5, r: 0, o: 1 },
  { x: 0, y: 0, s: 0.46, r: 0, o: 1 },
  { x: 0, y: 0, s: 0.36, r: 0, o: 1 },
  { x: 0, y: 20, s: 0.4, r: 0, o: 0 },
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

export function ScrollStory({ jar, breeds, items, shopHref, whatsappHref }: { jar: string; breeds: Breed[]; items: Item[]; shopHref: string; whatsappHref: string }) {
  const { t } = useI18n()
  const s = t.scroll
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const onMq = () => setMobile(mq.matches)
    onMq()
    mq.addEventListener('change', onMq)
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const el = root.current
        if (!el) return
        const total = el.offsetHeight - window.innerHeight
        const progress = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / total))
        setActive(Math.min(SCENES - 1, Math.floor(progress * SCENES)))
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      mq.removeEventListener('change', onMq)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const goTo = useCallback((i: number) => {
    const el = root.current
    if (!el) return
    const total = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: el.offsetTop + (total / SCENES) * i + 2, behavior: 'smooth' })
  }, [])

  const j = (mobile ? jarMobile : jarDesktop)[active]
  const scene = (i: number) => ({
    'data-scene': i,
    inert: active !== i,
    'aria-hidden': active !== i,
    className: `absolute inset-0 transition-all duration-700 ease-out ${active === i ? 'opacity-100 translate-y-0' : `pointer-events-none opacity-0 ${active > i ? '-translate-y-6' : 'translate-y-6'}`}`,
  })
  const title = 'font-serif text-3xl leading-[0.95] md:text-5xl lg:text-6xl'
  const benefitPos = ring(6, mobile ? 36 : 40)
  const nutrientPos = ring(6, mobile ? 41 : 40)

  return (
    <section ref={root} data-story aria-label={s.label} className="relative bg-coal" style={{ height: `${SCENES * 90}svh` }}>
      <a href="#after-story" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-30 focus:rounded-full focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-ink">
        {s.skip}
      </a>
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* soft studio light */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,#f3e6c9_0%,rgb(243_230_201/0)_60%)]" aria-hidden="true" />

        <div className="container-x relative h-full pt-[116px] md:pt-[136px]">
          <div className="relative h-full">
            {/* 1 · Pure Bilona Ghee: etched farm */}
            <div {...scene(0)}>
              <FarmSketch className="absolute inset-x-[-16px] bottom-0 h-[30%] sm:inset-x-[-32px] md:h-[46%]" />
              <div className="grid h-full content-start gap-6 pt-6 md:grid-cols-[1fr_auto_1fr] md:pt-16">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold-700">{s.s1.eyebrow}</p>
                  <h1 className={`${title} mt-3 md:!text-7xl lg:!text-8xl`}>{s.s1.title}</h1>
                </div>
                <div className="hidden w-[min(30vw,340px)] md:block" />
                <p className="max-w-sm text-lg text-muted md:justify-self-end">{s.s1.text}</p>
              </div>
            </div>

            {/* 2 · What is A2: breed portraits around the jar */}
            <div {...scene(1)}>
              <div className="mx-auto max-w-2xl pt-4 text-center md:pt-2">
                <h2 className={title}>{s.s2.title}</h2>
                <p className="mt-3 text-lg text-muted">{s.s2.text}</p>
              </div>
              <ul className="absolute inset-x-0 bottom-[12%] grid grid-cols-4 gap-2 md:bottom-auto md:top-[42%] md:flex md:justify-between">
                {breeds.slice(0, 4).map((b, i) => (
                  <li key={b.name} className={`flex flex-col items-center text-center ${i === 1 ? 'md:mr-auto md:ml-[8%] md:mt-24' : ''} ${i === 2 ? 'md:ml-auto md:mr-[8%] md:mt-24' : ''}`}>
                    <span className="relative block h-16 w-16 overflow-hidden rounded-full bg-paper ring-2 ring-gold-500 ring-offset-2 ring-offset-coal md:h-28 md:w-28">
                      {b.image && <Image src={b.image} alt="" fill sizes="112px" className="object-contain" />}
                    </span>
                    <span className="mt-2 font-serif text-sm font-semibold md:text-lg">{b.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3 · The Bilona way: a pipe diagram into the jar */}
            <div {...scene(2)}>
              <h2 className={`${title} pt-4 text-center md:pt-2`}>{s.s3.title}</h2>
              <svg className="absolute inset-0 hidden h-full w-full text-gold-500 md:block" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
                {[
                  'M150 260 H 330 V 330 H 440',
                  'M150 440 H 330 V 330',
                  'M850 220 H 670 V 330 H 560',
                  'M850 350 H 670',
                  'M850 480 H 670 V 330',
                ].map((d, i) => (
                  <path key={d} data-draw={2} d={d} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray="1" strokeDashoffset={active === 2 ? 0 : 1} style={{ transition: `stroke-dashoffset 1.1s ease ${0.15 * i}s` }} />
                ))}
              </svg>
              <ol className="absolute inset-x-0 bottom-[12%] grid grid-cols-5 gap-1 md:inset-0 md:block">
                {s.s3.steps.map((step, i) => {
                  const pos = [
                    { left: '15%', top: '43%' },
                    { left: '15%', top: '73%' },
                    { left: '85%', top: '37%' },
                    { left: '85%', top: '58%' },
                    { left: '85%', top: '80%' },
                  ][i]
                  return (
                    <li key={step} className="flex flex-col items-center text-center md:absolute md:w-40 md:-translate-x-1/2 md:-translate-y-1/2" style={mobile ? undefined : pos}>
                      <span className="relative grid h-11 w-11 place-items-center rounded-full border border-gold-500 bg-char text-gold-700 shadow-card md:h-16 md:w-16">
                        <Icon name={stepIcons[i]} size={mobile ? 20 : 28} />
                        <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-gold-500 text-[10px] font-bold text-ink md:h-6 md:w-6 md:text-xs">{i + 1}</span>
                      </span>
                      <span className="mt-2 text-[11px] font-semibold leading-tight md:text-base">{step}</span>
                    </li>
                  )
                })}
              </ol>
            </div>

            {/* 4 · Why families love Amrit: benefits on a ring */}
            <div {...scene(3)}>
              <h2 className={`${title} pt-4 text-center md:pt-2`}>{s.s4.title}</h2>
              <div className="absolute left-1/2 top-[55%] aspect-square w-[min(84vw,62svh)] -translate-x-1/2 -translate-y-1/2">
                <div data-reveal={3} data-cls-on="scale-100" data-cls-off="scale-50" className={`absolute inset-[22%] rounded-full bg-cocoa transition duration-700 ${active === 3 ? 'scale-100' : 'scale-50'}`} aria-hidden="true" />
                <div className="absolute inset-[10%] rounded-full border border-gold-500/50" aria-hidden="true" />
                <ul>
                  {s.s4.points.map((p, i) => (
                    <li key={p} data-reveal={3} data-o className="absolute flex w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center transition duration-500 md:w-36" style={{ ...benefitPos[i], transitionDelay: `${0.08 * i}s`, opacity: active === 3 ? 1 : 0 }}>
                      <span className="grid h-11 w-11 place-items-center rounded-full border border-gold-500 bg-char text-gold-700 shadow-card md:h-14 md:w-14">
                        <Icon name={pointIcons[i]} size={mobile ? 20 : 26} />
                      </span>
                      <span className="mt-1.5 text-[11px] font-semibold leading-tight md:text-sm">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 5 · Products: the jar joins the range */}
            <div {...scene(4)}>
              <h2 className={`${title} pt-4 text-center md:pt-2`}>{s.s5.title}</h2>
              <ul className="mx-auto mt-6 grid max-w-5xl grid-cols-2 gap-3 md:mt-12 md:grid-cols-4 md:gap-6">
                {items.map((item, i) => (
                  <li key={item.href} data-reveal={4} data-on="none" data-off="translateY(40px)" className="transition duration-700" style={{ transitionDelay: `${0.1 * i}s`, transform: active === 4 ? 'none' : 'translateY(40px)' }}>
                    <Link href={item.href} className="group flex flex-col items-center rounded-3xl border border-line bg-char p-3 text-center shadow-card transition hover:shadow-lift md:p-5">
                      <span className="relative block h-24 w-full md:h-52">
                        <Image src={item.image} alt="" fill sizes="(max-width: 768px) 40vw, 220px" className="object-contain drop-shadow-xl transition duration-500 group-hover:-translate-y-1" />
                      </span>
                      <span className="mt-2 font-serif text-sm font-semibold leading-tight md:text-lg">{item.title}</span>
                      {item.price && <span className="text-sm font-bold text-gold-700">{item.price}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 6 · Every spoon has: nutrient bubbles */}
            <div {...scene(5)}>
              <h2 className={`${title} pt-4 text-center md:pt-2`}>{s.s6.title}</h2>
              <div className="absolute left-1/2 top-[55%] aspect-square w-[min(84vw,62svh)] -translate-x-1/2 -translate-y-1/2">
                <ul>
                  {s.s6.points.map((p, i) => (
                    <li key={p} data-reveal={5} data-o data-on="translate(-50%, -50%) scale(1)" data-off="translate(-50%, -50%) scale(0.4)" className="absolute flex w-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center transition duration-500 md:w-28" style={{ ...nutrientPos[i], transitionDelay: `${0.07 * i}s`, transform: `translate(-50%, -50%) scale(${active === 5 ? 1 : 0.4})`, opacity: active === 5 ? 1 : 0 }}>
                      <span className="grid h-12 w-12 place-items-center rounded-full bg-gold-500 font-serif text-lg font-bold text-ink shadow-card md:h-16 md:w-16 md:text-2xl">{nutrientMarks[i]}</span>
                      <span className="mt-1.5 text-[11px] font-semibold leading-tight md:text-sm">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 7 · Bring Amrit home */}
            <div {...scene(6)}>
              <div className="flex h-full max-w-md flex-col pt-4 md:justify-center md:pt-0 lg:max-w-xl">
                <h2 className={title}>{s.s7.title}</h2>
                <p className="mt-4 text-lg text-muted">{s.s7.text}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href={shopHref} className="btn btn-gold !px-8">{s.s7.cta} <Icon name="arrow" size={18} /></Link>
                  <a href={whatsappHref} target="_blank" rel="noopener" className="btn btn-outline !px-8"><Icon name="whatsapp" size={18} /> {s.s7.cta2}</a>
                </div>
              </div>
            </div>

            {/* The pinned jar */}
            <div className="pointer-events-none absolute left-1/2 top-[55%] h-[44svh] w-[min(58vw,340px)] md:h-[58svh]" aria-hidden="true">
              <div
                data-jar
                data-desktop={JSON.stringify(jarDesktop)}
                data-mobile={JSON.stringify(jarMobile)}
                className="h-full w-full transition-all duration-[900ms] ease-[cubic-bezier(0.2,0.7,0.2,1)]"
                style={{ transform: `translate(calc(-50% + ${mobile ? 0 : j.x}vw), calc(-50% + ${j.y}%)) scale(${j.s}) rotate(${j.r}deg)`, opacity: j.o }}
              >
                <div className="animate-float-wide relative h-full w-full">
                  <Image src={jar} alt="" fill sizes="340px" className="object-contain drop-shadow-[0_30px_35px_rgb(60_35_10/0.3)]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scene dots */}
        <ol className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-2.5 md:flex" aria-label={s.label}>
          {Array.from({ length: SCENES }, (_, i) => (
            <li key={i}>
              <button type="button" data-dot={i} onClick={() => goTo(i)} aria-label={t.story.slideLabel(i + 1, SCENES)} aria-current={active === i} className={`block w-2.5 rounded-full transition-all ${active === i ? 'h-8 bg-gold-500' : 'h-2.5 bg-ink/20 hover:bg-ink/50'}`} />
            </li>
          ))}
        </ol>
        <p data-hint className={`absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center md:flex text-xs font-semibold uppercase tracking-[0.2em] text-muted transition-opacity ${active === 0 ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true">
          {s.hint}
          <span className="mt-1 h-8 w-px animate-pulse bg-gold-500" />
        </p>
      </div>
      <span id="after-story" className="absolute bottom-0" />
    </section>
  )
}
