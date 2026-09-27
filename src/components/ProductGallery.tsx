'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useI18n } from './I18nProvider'
import { Icon } from './Icon'

export type GallerySlide = { key: string; thumb: React.ReactNode; node: React.ReactNode }

/** Picture slider with arrows, swipe (scroll-snap) and a thumbnail rail. */
export function ProductGallery({ slides }: { slides: GallerySlide[] }) {
  const { t } = useI18n()
  const track = useRef<HTMLDivElement>(null)
  const rail = useRef<HTMLUListElement>(null)
  const [index, setIndex] = useState(0)

  const go = useCallback((i: number) => {
    const el = track.current
    if (!el) return
    const next = (i + slides.length) % slides.length
    el.scrollTo({ left: next * el.clientWidth })
    setIndex(next)
  }, [slides.length])

  useEffect(() => {
    const el = track.current
    if (!el) return
    const onScroll = () => setIndex(Math.round(el.scrollLeft / el.clientWidth))
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  // Keep the open picture's thumbnail in view inside the rail (without moving the page).
  useEffect(() => {
    const r = rail.current
    const li = r?.children[index] as HTMLElement | undefined
    if (!r || !li) return
    if (r.scrollHeight > r.clientHeight) r.scrollTo({ top: li.offsetTop - r.clientHeight / 2 + li.offsetHeight / 2, behavior: 'smooth' })
    else r.scrollTo({ left: li.offsetLeft - r.clientWidth / 2 + li.offsetWidth / 2, behavior: 'smooth' })
  }, [index])

  if (!slides.length) return null

  return (
    <div className="flex flex-col-reverse gap-3 lg:flex-row">
      {slides.length > 1 && (
        <ul ref={rail} data-thumbs className="no-scrollbar relative flex gap-2 overflow-x-auto p-1 lg:max-h-[560px] lg:w-[88px] lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden" aria-label={t.story.slideLabel(index + 1, slides.length)}>
          {slides.map((s, i) => (
            <li key={s.key} className="shrink-0">
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={t.story.slideLabel(i + 1, slides.length)}
                aria-current={i === index}
                data-active={i === index}
                className="relative block h-16 w-16 overflow-hidden rounded-xl bg-paper ring-1 ring-line transition hover:ring-gold-500 data-[active=true]:ring-[3px] data-[active=true]:ring-gold-500 lg:h-20 lg:w-20"
              >
                {s.thumb}
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="relative min-w-0 flex-1">
        <div ref={track} className="slider-track rounded-lg" tabIndex={0} aria-roledescription="carousel">
          {slides.map((s, i) => (
            <div key={s.key} role="group" aria-roledescription="slide" aria-label={t.story.slideLabel(i + 1, slides.length)} aria-hidden={i !== index}>
              {s.node}
            </div>
          ))}
        </div>
        {slides.length > 1 && (
          <>
            <button type="button" onClick={() => go(index - 1)} aria-label={t.story.prev} className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-gold-700 text-ink shadow-lift hover:bg-gold-500">
              <Icon name="arrow" className="rotate-180" />
            </button>
            <button type="button" onClick={() => go(index + 1)} aria-label={t.story.next} className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-char text-cream shadow-lift hover:bg-char">
              <Icon name="arrow" />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5" aria-hidden="true">
              {slides.map((s, i) => (
                <span key={s.key} className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-ink' : 'w-1.5 bg-ink/25'}`} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
