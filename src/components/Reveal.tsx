'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { attachReveal } from './reveal-driver'

/** Turns on the scroll entrance effects for every page (re-runs after navigation). */
export function Reveal() {
  const pathname = usePathname()
  useEffect(() => {
    let detach = () => {}
    // wait a frame so the new page's content is in the DOM
    const id = requestAnimationFrame(() => (detach = attachReveal(document)))
    return () => {
      cancelAnimationFrame(id)
      detach()
    }
  }, [pathname])
  return null
}
