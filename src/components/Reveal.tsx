'use client'

import { useEffect } from 'react'
import { attachReveal } from './reveal-driver'

/** Turns on the count-up and staggered entrance effects for the current page. */
export function Reveal() {
  useEffect(() => attachReveal(document), [])
  return null
}
