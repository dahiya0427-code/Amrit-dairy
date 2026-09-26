'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useI18n } from './I18nProvider'
import { Icon } from './Icon'

type Item = { id: number; text: string; link?: string | null }

/** Announcement bar (Doc 05 §5.15): pausable marquee, static for reduced motion. */
export function Ticker({ items }: { items: Item[] }) {
  const { t, href } = useI18n()
  const [paused, setPaused] = useState(false)
  if (!items.length) return null

  const renderItems = (hidden: boolean) =>
    items.map((item) => (
      <span key={`${hidden ? 'b' : 'a'}-${item.id}`} className="inline-flex items-center gap-3 px-5" aria-hidden={hidden || undefined}>
        <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
        {item.link ? (
          <Link href={item.link.startsWith('/') ? href(item.link) : item.link} tabIndex={hidden ? -1 : undefined} className="hover:underline">
            {item.text}
          </Link>
        ) : (
          <span>{item.text}</span>
        )}
      </span>
    ))

  return (
    <div className={`bg-gold-500 text-ink ${paused ? 'ticker-paused' : ''}`}>
      <div className="container-x flex h-9 items-center gap-2 text-sm">
        <div className="ticker-track relative flex-1 overflow-hidden" role="region" aria-label="Announcements">
          <div className="animate-ticker flex w-max whitespace-nowrap motion-reduce:w-auto">
            {renderItems(false)}
            <span className="contents motion-reduce:hidden">{renderItems(true)}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full hover:bg-white/10 motion-reduce:hidden"
          aria-label={paused ? t.ticker.play : t.ticker.pause}
          aria-pressed={paused}
        >
          <Icon name={paused ? 'play' : 'pause'} size={14} />
        </button>
      </div>
    </div>
  )
}
