'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useI18n } from './I18nProvider'
import { Icon } from './Icon'

export type GallerySlide = { key: string; thumb: React.ReactNode; node: React.ReactNode }

/** Picture slider with arrows, swipe (scroll-snap) and a thumbnail rail. */
export function ProductGallery({ slides }: { slides: GallerySlide[] }) {
  const { t } = useI18n()
  const track = useRef<HTMLDivElement>(null)
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

  if (!slides.length) return null

  return (
    <div className="flex flex-col-reverse gap-3 lg:flex-row">
      {slides.length > 1 && (
        <ul className="flex gap-2 overflow-x-auto pb-1 lg:max-h-[560px] lg:w-20 lg:flex-col lg:overflow-y-auto lg:pb-0" aria-label={t.story.slideLabel(index + 1, slides.length)}>
          {slides.map((s, i) => (
            <li key={s.key} className="shrink-0">
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={t.story.slideLabel(i + 1, slides.length)}
                aria-current={i === index}
                className={`relative block h-16 w-16 overflow-hidden rounded-xl border-2 bg-paper transition lg:h-20 lg:w-20 ${
                  i === index ? 'border-cream' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
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
            <button type="button" onClick={() => go(index - 1)} aria-label={t.story.prev} className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-gold-700 text-cream shadow-lift hover:bg-walnut">
              <Icon name="arrow" className="rotate-180" />
            </button>
            <button type="button" onClick={() => go(index + 1)} aria-label={t.story.next} className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-char text-cream shadow-lift hover:bg-char">
              <Icon name="arrow" />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5" aria-hidden="true">
              {slides.map((s, i) => (
                <span key={s.key} className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-walnut' : 'w-1.5 bg-walnut/30'}`} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
