/**
 * Drives the home-page scroll story (Mr Dairy style) straight on the DOM, so
 * the same code runs on the site and in the static preview.
 *
 * Everything follows the normal page scroll (nothing is forced): the scroll
 * position is eased a little for a smooth, natural feel, and
 * - scenes slide up as you scroll: each one holds for a moment, then the next
 *   slides in from below exactly as far as you have scrolled;
 * - the pinned jar glides between its poses and turns a full 360° on every
 *   scene change, using a real turntable of the jar (jar-turn.webp: the label
 *   photos wrapped round the jar at 48 angles), so every side really shows.
 * Everything reads data-* attributes rendered by ScrollStory.tsx.
 */
type Pose = { x: number; y: number; s: number; r: number; o: number }

const HOLD = 0.2 // share at each end of a scene's scroll where nothing moves
const SMOOTH = 0.14 // easing of the scroll position per frame (1 = none)
const FRAMES = 48
const COLS = 8
const ROWS = 6

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const mix = (a: number, b: number, t: number) => a + (b - a) * t

export function attachStoryDriver(section: HTMLElement): () => void {
  const scenes = Array.from(section.querySelectorAll<HTMLElement>('[data-scene]'))
  const n = scenes.length
  const jar = section.querySelector<HTMLElement>('[data-jar]')
  const still = section.querySelector<HTMLElement>('[data-jar-still]')
  const turn = section.querySelector<HTMLElement>('[data-jar-turn]')
  const spriteImg = section.querySelector<HTMLImageElement>('[data-jar-sprite]')
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
  let current = -1
  let spriteReady = false
  let lastFrame = -1

  // Scenes and the jar are moved by scroll from now on, not by CSS transitions.
  // (drop the first-paint position classes: Tailwind's translate-* would add to our transform)
  scenes.forEach((el) => {
    el.style.transition = 'none'
    el.classList.remove('translate-y-0', 'translate-y-full', '-translate-y-full')
  })
  if (jar) jar.style.transition = 'none'

  // Swap the still photo for the turntable once it has loaded.
  const showTurntable = () => {
    if (!turn || !spriteImg || spriteReady || reduced) return
    turn.style.backgroundImage = `url("${spriteImg.currentSrc || spriteImg.src}")`
    turn.style.backgroundSize = `${COLS * 100}% ${ROWS * 100}%`
    turn.style.opacity = '1'
    if (still) still.style.opacity = '0'
    spriteReady = true
    lastFrame = -1
    queue()
  }
  if (spriteImg) {
    if (spriteImg.complete && spriteImg.naturalWidth) showTurntable()
    else spriteImg.addEventListener('load', showTurntable, { once: true })
  }

  const geometry = () => {
    const rect = section.getBoundingClientRect()
    const total = section.offsetHeight - window.innerHeight
    return { rect, total, top: rect.top + window.scrollY }
  }
  const target = () => {
    const { rect, total } = geometry()
    return clamp(-rect.top / total) * (n - 1)
  }

  function setActive(a: number) {
    if (a === active) return
    active = a
    scenes.forEach((el, i) => {
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
  }

  function draw(pos: number) {
    const k = Math.min(n - 2, Math.floor(pos))
    const e = ease(clamp((pos - k - HOLD) / (1 - 2 * HOLD)))
    scenes.forEach((el, i) => {
      const y = i < k ? -100 : i > k + 1 ? 100 : i === k ? -e * 100 : (1 - e) * 100
      el.style.transform = `translate3d(0, ${y}%, 0)`
    })
    setActive(e > 0.5 ? k + 1 : k)
    if (jar && list.length) {
      const a = list[k]
      const b = list[k + 1] ?? a
      const x = mq.matches ? 0 : mix(a.x, b.x, e)
      jar.style.transform = `translate(calc(-50% + ${x}vw), calc(-50% + ${mix(a.y, b.y, e)}%)) scale(${mix(a.s, b.s, e)})`
      jar.style.opacity = String(mix(a.o, b.o, e))
    }
    if (turn && spriteReady) {
      // one full turn per scene change
      const f = Math.round((k + e) * FRAMES) % FRAMES
      if (f !== lastFrame) {
        lastFrame = f
        turn.style.backgroundPosition = `${((f % COLS) / (COLS - 1)) * 100}% ${(Math.floor(f / COLS) / (ROWS - 1)) * 100}%`
      }
    }
  }

  function tick() {
    frame = 0
    const t = target()
    if (current < 0 || reduced) current = t
    else current += (t - current) * SMOOTH
    if (Math.abs(t - current) < 0.0005) current = t
    draw(current)
    if (current !== t) frame = requestAnimationFrame(tick)
  }
  function queue() {
    if (!frame) frame = requestAnimationFrame(tick)
  }

  const onDot = (e: Event) => {
    const d = (e.target as HTMLElement).closest<HTMLElement>('[data-dot]')
    if (!d) return
    const { top, total } = geometry()
    window.scrollTo({ top: Math.round(top + (Number(d.dataset.dot) / (n - 1)) * total), behavior: reduced ? 'auto' : 'smooth' })
  }
  const onMq = () => {
    list = poses()
    queue()
  }

  current = target()
  draw(current)
  window.addEventListener('scroll', queue, { passive: true })
  window.addEventListener('resize', queue)
  section.addEventListener('click', onDot)
  mq.addEventListener('change', onMq)
  return () => {
    cancelAnimationFrame(frame)
    window.removeEventListener('scroll', queue)
    window.removeEventListener('resize', queue)
    section.removeEventListener('click', onDot)
    mq.removeEventListener('change', onMq)
    spriteImg?.removeEventListener('load', showTurntable)
  }
}
