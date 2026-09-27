/**
 * Scroll-triggered entrance effects, driven straight on the DOM so the same
 * code runs on the site and in the static preview:
 * - [data-count] numbers count up from 0 to their value (keeps any prefix like "~");
 * - [data-reveal-group] containers get "is-in" and CSS plays their staggered entrance;
 * - everything else in <main> gets an automatic entrance that suits it:
 *   headings rise word by word, text fades up, pictures wipe in from a blur,
 *   cards rise one after another.
 * Classes are only added by this script, so without JavaScript (or with
 * reduced motion) everything simply shows as it is.
 */
const DURATION = 1400
const SKIP = '[data-story], [data-reveal-group], .cow-marquee, .slider-track, [data-thumbs], [role="dialog"], header, nav, form, details'

function countUp(el: HTMLElement) {
  const text = el.dataset.count || el.textContent || ''
  const m = text.match(/^(\D*)(\d+)(.*)$/)
  if (!m) return
  const [, pre, num, post] = m
  const end = Number(num)
  const start = performance.now()
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / DURATION)
    el.textContent = `${pre}${Math.round(end * (1 - Math.pow(1 - t, 3)))}${post}`
    if (t < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

/** Wrap each word of a plain-text heading so the words can rise one by one. */
function splitWords(h: HTMLElement) {
  if (h.children.length || !h.textContent?.trim()) return false
  const words = h.textContent.trim().split(/\s+/)
  h.textContent = ''
  words.forEach((w, i) => {
    const outer = document.createElement('span')
    outer.className = 'rv-w'
    const inner = document.createElement('span')
    inner.textContent = w
    inner.style.setProperty('--w', String(i))
    outer.appendChild(inner)
    h.appendChild(outer)
    if (i < words.length - 1) h.appendChild(document.createTextNode(' '))
  })
  return true
}

/** Stagger index of an element among its similar siblings (0..5). */
function order(el: Element) {
  const parent = el.parentElement
  if (!parent) return 0
  return Math.min(5, Array.prototype.indexOf.call(parent.children, el))
}

function tag(el: HTMLElement, kind: string, delay = 0) {
  if (el.dataset.rv || el.closest(SKIP)) return false
  // elements placed with a transform (centred badges, positioned bubbles) would jump: leave them
  if (kind !== 'img' && getComputedStyle(el).transform !== 'none') return false
  el.dataset.rv = kind
  el.classList.add('rv', `rv-${kind}`)
  el.style.setProperty('--rv-d', `${delay}s`)
  return true
}

export function attachReveal(root: ParentNode = document): () => void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return () => {}
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
  const targets: HTMLElement[] = []
  // a clipped picture never "intersects", so its (unclipped) container is watched instead
  const watchFor = new WeakMap<Element, HTMLElement>()
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        io.unobserve(e.target)
        const el = watchFor.get(e.target) ?? (e.target as HTMLElement)
        if (el.hasAttribute('data-count')) countUp(el)
        else el.classList.add(el.hasAttribute('data-reveal-group') ? 'is-in' : 'rv-in')
      }
    },
    { threshold: 0.18, rootMargin: '0px 0px -6% 0px' },
  )

  // Counters and hand-made groups (farm story)
  root.querySelectorAll<HTMLElement>('[data-count]:not([data-rv])').forEach((el) => {
    el.dataset.rv = 'count'
    if (!el.dataset.count) el.dataset.count = el.textContent || ''
    el.textContent = (el.dataset.count.match(/^\D*/)?.[0] ?? '') + '0'
    targets.push(el)
  })
  root.querySelectorAll<HTMLElement>('[data-reveal-group]:not([data-rv])').forEach((el) => {
    el.dataset.rv = 'group'
    el.classList.add('reveal-armed')
    targets.push(el)
  })

  // Automatic entrances for the rest of the page content
  const main = (root as Element).querySelector?.('main') ?? document.querySelector('main')
  if (main) {
    main.querySelectorAll<HTMLElement>('h1, h2, h3').forEach((h) => {
      if (tag(h, 'head')) {
        splitWords(h)
        targets.push(h)
      }
    })
    main.querySelectorAll<HTMLElement>('p, blockquote, dl').forEach((p) => {
      if (p.closest('li, a, .rv-card') || !p.textContent?.trim()) return
      if (tag(p, 'text', 0.12)) targets.push(p)
    })
    // cards: list items in grids and product cards
    main.querySelectorAll<HTMLElement>('ul > li, ol > li, article').forEach((li) => {
      const grid = li.parentElement
      if (li.tagName === 'LI' && !(grid && /\bgrid\b|\bflex\b/.test(grid.className))) return
      if (li.closest('.rv-card') || li.querySelector('.rv-card')) return
      if (li.getBoundingClientRect().height < 40) return // chips and small pills stay put
      if (tag(li, 'card', order(li) * 0.09)) targets.push(li)
    })
    // pictures that are not inside a card
    main.querySelectorAll<HTMLImageElement>('img').forEach((img) => {
      const box = img.parentElement as HTMLElement | null
      if (!box || box.closest('.rv-card, [data-rv="head"]')) return
      if (box.getBoundingClientRect().width < 120) return
      if (tag(box, 'img', 0.05)) targets.push(box)
    })
  }

  targets.forEach((el) => {
    if (el.dataset.rv === 'img' && el.parentElement) {
      watchFor.set(el.parentElement, el)
      io.observe(el.parentElement)
    } else io.observe(el)
  })
  return () => io.disconnect()
}
