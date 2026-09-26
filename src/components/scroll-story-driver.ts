/**
 * Drives the home-page scroll story (Mr Dairy style) straight on the DOM, so
 * the same code runs on the site and in the static preview.
 *
 * - Scenes are full-screen pages: the current one slides up and out while the
 *   next slides in from below. The jar stays pinned on top, glides to its pose
 *   for the new scene and turns around once as the pages change.
 * - With a mouse wheel or trackpad, one scroll step moves one scene (a smooth
 *   scroll to that scene), like a full-page slider. Touch keeps native
 *   scrolling and changes scene half way through each scene's scroll length.
 * - Everything reads data-* attributes rendered by ScrollStory.tsx.
 */
type Pose = { x: number; y: number; s: number; r: number; o: number }

const LOCK_MS = 1000
const TURN_MS = 900

export function attachStoryDriver(section: HTMLElement): () => void {
  const scenes = Array.from(section.querySelectorAll<HTMLElement>('[data-scene]'))
  const n = scenes.length
  const jar = section.querySelector<HTMLElement>('[data-jar]')
  const turn = section.querySelector<HTMLElement>('[data-jar-turn]')
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

  function placeJar() {
    if (!jar || !list.length || active < 0) return
    const p = list[active]
    const x = mq.matches ? 0 : p.x
    jar.style.transform = `translate(calc(-50% + ${x}vw), calc(-50% + ${p.y}%)) scale(${p.s}) rotate(${p.r}deg)`
    jar.style.opacity = String(p.o)
  }

  function spin() {
    if (!turn || reduced || typeof turn.animate !== 'function') return
    turn.animate(
      [
        { transform: 'rotateY(0deg)' },
        { transform: 'rotateY(180deg) scale(0.96)', offset: 0.5 },
        { transform: 'rotateY(360deg)' },
      ],
      { duration: TURN_MS, easing: 'cubic-bezier(0.7, 0, 0.3, 1)' },
    )
  }

  function setActive(a: number) {
    if (a === active) return
    const first = active === -1
    active = a
    scenes.forEach((el, i) => {
      el.classList.remove('translate-y-0', '-translate-y-full', 'translate-y-full')
      el.classList.add(i === a ? 'translate-y-0' : i < a ? '-translate-y-full' : 'translate-y-full')
      if (i === a) {
        el.removeAttribute('inert')
        el.setAttribute('aria-hidden', 'false')
      } else {
        el.setAttribute('inert', '')
        el.setAttribute('aria-hidden', 'true')
      }
    })
    reveals.forEach((el) => {
      const on = Number(el.dataset.reveal) === a
      if (el.hasAttribute('data-o')) el.style.opacity = on ? '1' : '0'
      if (el.dataset.on) el.style.transform = on ? el.dataset.on : el.dataset.off || ''
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
    placeJar()
    if (!first) spin()
  }

  function render() {
    frame = 0
    const { rect, total } = geometry()
    const pos = Math.max(0, (-rect.top / total) * n)
    setActive(Math.min(n - 1, Math.floor(pos + 0.5)))
  }
  const queue = () => {
    if (!frame) frame = requestAnimationFrame(render)
  }

  /** Scroll to the start of scene k. */
  function goTo(k: number) {
    const { top, seg } = geometry()
    window.scrollTo({ top: Math.round(top + seg * k), behavior: reduced ? 'auto' : 'smooth' })
  }

  function onWheel(e: WheelEvent) {
    if (reduced || e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return
    const { rect, total, top } = geometry()
    const inside = rect.top < window.innerHeight * 0.5 && rect.bottom >= window.innerHeight - 2
    if (!inside) return
    const cur = Math.min(n - 1, Math.max(0, Math.round((-rect.top / total) * n)))
    const next = cur + (e.deltaY > 0 ? 1 : -1)
    if (next < 0) return // let the page scroll up past the story
    e.preventDefault()
    // One step per gesture: wait for the slide to finish, and ignore the small
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
    placeJar()
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
