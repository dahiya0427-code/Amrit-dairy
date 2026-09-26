'use client'

import { useCallback, useEffect, useState } from 'react'
import { useI18n } from './I18nProvider'
import { Icon } from './Icon'

/**
 * Full-width banner slider (Rosier-style): cross-fades between slides,
 * auto-advances every 6.5 s, pauses on hover/focus and for reduced motion.
 */
export function HeroCarousel({ slides }: { slides: React.ReactNode[] }) {
  const { t } = useI18n()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const go = useCallback((i: number) => setIndex((i + slides.length) % slides.length), [slides.length])

  useEffect(() => {
    if (paused || slides.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), 6500)
    return () => window.clearInterval(id)
  }, [paused, slides.length])

  return (
    <section
      className="relative overflow-hidden bg-espresso"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="grid">
        {slides.map((slide, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription="slide"
            aria-label={t.story.slideLabel(i + 1, slides.length)}
            aria-hidden={i !== index}
            className={`col-start-1 row-start-1 transition-opacity duration-700 ${i === index ? 'z-10 opacity-100' : 'pointer-events-none opacity-0'}`}
          >
            {slide}
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <>
          <button type="button" onClick={() => go(index - 1)} aria-label={t.story.prev} className="absolute left-3 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-caramel text-cream shadow-lift transition hover:bg-gold-700 md:grid">
            <Icon name="arrow" className="rotate-180" />
          </button>
          <button type="button" onClick={() => go(index + 1)} aria-label={t.story.next} className="absolute right-3 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-cream text-walnut shadow-lift transition hover:bg-white md:grid">
            <Icon name="arrow" />
          </button>
          <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={t.story.slideLabel(i + 1, slides.length)}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all ${i === index ? 'w-8 bg-gold-500' : 'w-2 bg-cream/50 hover:bg-cream'}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
