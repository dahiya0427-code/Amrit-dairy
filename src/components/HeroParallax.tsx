'use client'

import { useEffect, useRef } from 'react'

/**
 * Moves each `[data-depth]` layer a little with the mouse and page scroll so the
 * floating bottles feel 3D. Skipped for people who prefer reduced motion.
 */
export function HeroParallax({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const layers = Array.from(root.querySelectorAll<HTMLElement>('[data-depth]'))
    let mx = 0
    let my = 0
    let frame = 0
    const apply = () => {
      frame = 0
      const scroll = Math.min(window.scrollY, 600)
      for (const el of layers) {
        const d = Number(el.dataset.depth) || 0
        el.style.transform = `translate3d(${mx * d * 18}px, ${my * d * 14 - scroll * d * 0.18}px, 0)`
      }
    }
    const queue = () => { if (!frame) frame = requestAnimationFrame(apply) }
    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect()
      mx = ((e.clientX - r.left) / r.width - 0.5) * 2
      my = ((e.clientY - r.top) / r.height - 0.5) * 2
      queue()
    }
    const onLeave = () => { mx = 0; my = 0; queue() }
    root.addEventListener('pointermove', onMove)
    root.addEventListener('pointerleave', onLeave)
    window.addEventListener('scroll', queue, { passive: true })
    return () => {
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('scroll', queue)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return <div ref={ref} className={className}>{children}</div>
}
