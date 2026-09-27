/**
 * Scroll-triggered effects, driven straight on the DOM so the same code runs
 * on the site and in the static preview:
 * - [data-count] numbers count up from 0 to their value (keeps any prefix like "~");
 * - [data-reveal-group] containers get "is-in" when they scroll into view, and
 *   CSS in globals.css plays their staggered entrance.
 * Without JavaScript, or with reduced motion, everything simply shows as is.
 */
const DURATION = 1400

function countUp(el: HTMLElement) {
  const text = el.dataset.count || el.textContent || ''
  const m = text.match(/^(\D*)(\d+)(.*)$/)
  if (!m) return
  const [, pre, num, post] = m
  const end = Number(num)
  const start = performance.now()
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / DURATION)
    const eased = 1 - Math.pow(1 - t, 3)
    el.textContent = `${pre}${Math.round(end * eased)}${post}`
    if (t < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

export function attachReveal(root: ParentNode = document): () => void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return () => {}
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
  const counters = Array.from(root.querySelectorAll<HTMLElement>('[data-count]'))
  const groups = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal-group]'))
  counters.forEach((el) => {
    if (!el.dataset.count) el.dataset.count = el.textContent || ''
    el.textContent = (el.dataset.count.match(/^\D*/)?.[0] ?? '') + '0'
  })
  groups.forEach((g) => g.classList.add('reveal-armed'))
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        const el = e.target as HTMLElement
        io.unobserve(el)
        if (el.hasAttribute('data-count')) countUp(el)
        else el.classList.add('is-in')
      }
    },
    { threshold: 0.3 },
  )
  counters.forEach((el) => io.observe(el))
  groups.forEach((el) => io.observe(el))
  return () => io.disconnect()
}
