/**
 * Drives the home-page scroll story (Mr Dairy style) straight on the DOM, so
 * the same code runs on the site and in the static preview.
 *
 * - The jar follows the scroll continuously: it holds still while a scene is
 *   on screen, then glides to its pose in the next scene.
 * - With a mouse wheel or trackpad, one scroll step moves to the next scene
 *   (smooth scroll), like a full-page slider. Touch keeps native scrolling.
 * - Everything reads data-* attributes rendered by ScrollStory.tsx.
 */
type Pose = { x: number; y: number; s: number; r: number; o: number }

const HOLD = 0.4 // share of each scene where the jar stays put
const LOCK_MS = 900

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
const mix = (a: number, b: number, t: number) => a + (b - a) * t

export function attachStoryDriver(section: HTMLElement): () => void {
  const scenes = Array.from(section.querySelectorAll<HTMLElement>('[data-scene]'))
  const n = scenes.length
  const jar = section.querySelector<HTMLElement>('[data-jar]')
  const reveals = Array.from(section.querySelectorAll<HTMLElement>('[data-reveal]'))
  const draws = Array.from(section.querySelectorAll<SVGElement>('[data-draw]'))
  const dots = Array.from(section.querySelectorAll<HTMLElement>('[data-dot]'))
  const hint = section.querySelector<HTMLElement>('[data-hint]')
  const mq = window.matchMedia('(max-width: 767px)')
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const poses = (): Pose[] => (jar ? JSON.parse(jar.dataset[mq.matches ? 'mobile' : 'desktop'] || '[]') : [])
  let list = poses()
  let active = -1
  let frame = 0
  let lockUntil = 0
  let lastWheel = 0

  const geometry = () => {
    const rect = section.getBoundingClientRect()
    const total = section.offsetHeight - window.innerHeight
    const top = rect.top + window.scrollY
    return { rect, total, top, seg: total / n }
  }

  function setActive(a: number) {
    if (a === active) return
    active = a
    scenes.forEach((el, i) => {
      const on = i === a
      el.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-none', 'opacity-0', '-translate-y-6', 'translate-y-6')
      if (on) {
        el.classList.add('opacity-100', 'translate-y-0')
        el.removeAttribute('inert')
        el.setAttribute('aria-hidden', 'false')
      } else {
        el.classList.add('pointer-events-none', 'opacity-0', a > i ? '-translate-y-6' : 'translate-y-6')
        el.setAttribute('inert', '')
        el.setAttribute('aria-hidden', 'true')
      }
    })
    reveals.forEach((el) => {
      const on = Number(el.dataset.reveal) === a
      if (el.hasAttribute('data-o')) el.style.opacity = on ? '1' : '0'
      if (el.dataset.on) el.style.transform = on ? el.dataset.on : el.dataset.off || ''
      if (el.dataset.clsOn) {
        el.classList.toggle(el.dataset.clsOn, on)
        if (el.dataset.clsOff) el.classList.toggle(el.dataset.clsOff, !on)
      }
    })
    draws.forEach((el) => el.setAttribute('stroke-dashoffset', Number(el.dataset.draw) === a ? '0' : '1'))
    dots.forEach((d) => {
      const on = Number(d.dataset.dot) === a
      d.setAttribute('aria-current', String(on))
      d.classList.toggle('h-8', on)
      d.classList.toggle('bg-gold-500', on)
      d.classList.toggle('h-2.5', !on)
      d.classList.toggle('bg-ink/20', !on)
    })
    if (hint) {
      hint.classList.toggle('opacity-100', a === 0)
      hint.classList.toggle('opacity-0', a !== 0)
    }
  }

  function render() {
    frame = 0
    const { rect, total } = geometry()
    const pos = Math.min(n - 0.0001, Math.max(0, (-rect.top / total) * n))
    const i = Math.floor(pos)
    const f = pos - i
    const t = i < n - 1 && f > HOLD ? ease((f - HOLD) / (1 - HOLD)) : 0
    setActive(t > 0.5 ? i + 1 : i)
    if (jar && list.length) {
      const a = list[i]
      const b = list[Math.min(i + 1, n - 1)]
      const mobile = mq.matches
      const x = mobile ? 0 : mix(a.x, b.x, t)
      const y = mix(a.y, b.y, t)
      const s = mix(a.s, b.s, t)
      const r = mix(a.r, b.r, t)
      // fade out/in around a hidden pose (the products scene)
      const o = a.o && b.o ? 1 : mix(a.o, b.o, Math.min(1, t * 1.6))
      jar.style.transform = `translate(calc(-50% + ${x}vw), calc(-50% + ${y}%)) scale(${s}) rotate(${r}deg)`
      jar.style.opacity = String(o)
    }
  }
  const queue = () => {
    if (!frame) frame = requestAnimationFrame(render)
  }

  /** Scroll so scene k sits in its "hold" zone. */
  function goTo(k: number) {
    const { top, seg } = geometry()
    window.scrollTo({ top: top + seg * k + seg * 0.15, behavior: reduced ? 'auto' : 'smooth' })
  }

  function onWheel(e: WheelEvent) {
    if (reduced || e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return
    const { rect, total, top } = geometry()
    const pinned = rect.top < window.innerHeight * 0.5 && rect.bottom >= window.innerHeight - 2
    if (!pinned) return
    const pos = (-rect.top / total) * n
    const cur = Math.min(n - 1, Math.max(0, Math.round(pos - 0.15)))
    const dir = e.deltaY > 0 ? 1 : -1
    const next = cur + dir
    if (next < 0) return // let the page scroll up past the story
    e.preventDefault()
    // One step per gesture: wait for the glide to finish, and ignore the small
    // trailing events a trackpad keeps sending (inertia) until it goes quiet.
    const now = performance.now()
    const quiet = now - lastWheel > 180
    lastWheel = now
    if (now < lockUntil || (!quiet && Math.abs(e.deltaY) < 40)) return
    lockUntil = now + LOCK_MS
    if (next >= n) window.scrollTo({ top: top + total + 4, behavior: 'smooth' })
    else goTo(next)
  }

  const onDot = (e: Event) => {
    const d = (e.target as HTMLElement).closest<HTMLElement>('[data-dot]')
    if (d) goTo(Number(d.dataset.dot))
  }
  const onMq = () => {
    list = poses()
    queue()
  }

  render()
  window.addEventListener('scroll', queue, { passive: true })
  window.addEventListener('resize', queue)
  window.addEventListener('wheel', onWheel, { passive: false })
  section.addEventListener('click', onDot)
  mq.addEventListener('change', onMq)
  return () => {
    cancelAnimationFrame(frame)
    window.removeEventListener('scroll', queue)
    window.removeEventListener('resize', queue)
    window.removeEventListener('wheel', onWheel)
    section.removeEventListener('click', onDot)
    mq.removeEventListener('change', onMq)
  }
}
