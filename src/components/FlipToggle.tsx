'use client'

import { useState } from 'react'
import { Icon } from './Icon'

/** Touch screens have no hover: this button flips the card instead. */
export function FlipToggle({ label }: { label: string }) {
  const [on, setOn] = useState(false)
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={label}
      onClick={(e) => {
        const card = (e.currentTarget as HTMLElement).closest('.group')
        card?.classList.toggle('is-flipped')
        setOn((v) => !v)
      }}
      className="absolute bottom-2 right-2 z-10 grid h-9 w-9 place-items-center rounded-full bg-char/90 text-cream shadow-card [@media(hover:hover)]:hidden"
    >
      <Icon name={on ? 'close' : 'plus'} size={18} />
    </button>
  )
}
