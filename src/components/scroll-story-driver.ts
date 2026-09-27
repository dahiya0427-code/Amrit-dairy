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

const HOLD = 0.08 // share at each end of a scene's scroll where nothing moves
const SMOOTH = 0.35 // light easing of the scroll position per frame (1 = none)
const IDLE_MS = 130 // a pause this long after scrolling counts as "stopped"
const SNAP_MIN_MS = 450 // snap glide duration range (Mr Dairy's moves take ~0.7-0.9 s)
const SNAP_MAX_MS = 850
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
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
  const turn = section.querySelector<HTMLCanvasElement>('[data-jar-turn]')
  const ctx = turn?.getContext('2d') ?? null
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
  const lastY: number[] = []

  // Scenes and the jar are moved by scroll, not by CSS transitions. The
  // first-paint position classes stay until we can really measure the page:
  // a page loaded while hidden (a background tab, a collapsed panel) has no
  // size yet, and positions worked out from that would stack every scene.
  let taken = false
  const takeOver = () => {
    if (taken) return
    taken = true
    scenes.forEach((el) => {
      el.style.transition = 'none'
      el.style.willChange = 'transform' // own GPU layer: sliding it needs no repaint
      el.classList.remove('translate-y-0', 'translate-y-full', '-translate-y-full')
    })
    if (jar) jar.style.transition = 'none'
  }

  // Swap the still photo for the turntable once it has loaded.
  const showTurntable = () => {
    if (!turn || !spriteImg || spriteReady || reduced) return
    if (!ctx) return
    // Canvas at the frame's own resolution: each scroll step copies one small
    // frame instead of repainting a patch of the big sprite sheet.
    turn.width = Math.round(spriteImg.naturalWidth / COLS)
    turn.height = Math.round(spriteImg.naturalHeight / ROWS)
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
  /** Story position 0..n-1 from the scroll, or null while the page has no size. */
  const target = (): number | null => {
    const { rect, total } = geometry()
    if (!(total > 0) || !(window.innerHeight > 0)) return null
    const pos = clamp(-rect.top / total) * (n - 1)
    return Number.isFinite(pos) ? pos : null
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
    takeOver()
    const k = Math.max(0, Math.min(n - 2, Math.floor(pos)))
    const e = ease(clamp((pos - k - HOLD) / (1 - 2 * HOLD)))
    scenes.forEach((el, i) => {
      const y = i < k ? -100 : i > k + 1 ? 100 : i === k ? -e * 100 : (1 - e) * 100
      if (lastY[i] === y) return // only touch scenes that actually move
      lastY[i] = y
      el.style.transform = `translate3d(0, ${y.toFixed(3)}%, 0)`
      // off-screen scenes are hidden so the browser doesn't keep them in its layers
      el.style.visibility = Math.abs(y) >= 100 ? 'hidden' : 'visible'
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
        const fw = turn.width
        const fh = turn.height
        ctx?.clearRect(0, 0, fw, fh)
        ctx?.drawImage(spriteImg as HTMLImageElement, (f % COLS) * fw, Math.floor(f / COLS) * fh, fw, fh, 0, 0, fw, fh)
      }
    }
  }

  function tick() {
    frame = 0
    const t = target()
    if (t === null) return // not laid out yet; the resize observer tries again
    if (current < 0 || reduced || snapping || !Number.isFinite(current)) current = t
    else current += (t - current) * SMOOTH
    if (Math.abs(t - current) < 0.0005) current = t
    draw(current)
    if (current !== t) frame = requestAnimationFrame(tick)
  }
  function queue() {
    if (!frame) frame = requestAnimationFrame(tick)
  }

  // ── Snapping (Mr Dairy style): when scrolling stops between two scenes, the
  // page glides on to a whole scene so the jar always settles in its place.
  let snapFrame = 0
  let snapping = false
  let idle = 0
  let prevScrollY = window.scrollY
  let dir = 0
  const sceneY = (k: number) => {
    const { top, total } = geometry()
    return Math.round(top + (k / (n - 1)) * total)
  }
  function stopSnap() {
    if (snapFrame) cancelAnimationFrame(snapFrame)
    snapFrame = 0
    snapping = false
  }
  function glideTo(y: number) {
    stopSnap()
    const from = window.scrollY
    const dist = y - from
    if (Math.abs(dist) < 2) return
    if (reduced) {
      window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior })
      return
    }
    const seg = geometry().total / (n - 1)
    const dur = Math.min(SNAP_MAX_MS, Math.max(SNAP_MIN_MS, (Math.abs(dist) / seg) * SNAP_MAX_MS))
    const t0 = performance.now()
    snapping = true
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / dur)
      window.scrollTo({ top: from + dist * easeInOut(t), behavior: 'instant' as ScrollBehavior })
      if (t < 1) snapFrame = requestAnimationFrame(step)
      else stopSnap()
    }
    snapFrame = requestAnimationFrame(step)
  }
  function snapIfBetween() {
    if (snapping) return
    const { rect, total } = geometry()
    if (!(total > 0)) return
    const pos = (-rect.top / total) * (n - 1)
    if (pos <= 0.001 || pos >= n - 1 - 0.001) return // before the story, on its last scene or past it
    const k = Math.floor(pos)
    const frac = pos - k
    if (frac < 0.004 || frac > 0.996) return
    // go on in the direction of travel once the move has visibly started, else settle back
    const next = dir > 0 ? (frac > 0.1 ? k + 1 : k) : dir < 0 ? (frac < 0.9 ? k : k + 1) : Math.round(pos)
    glideTo(sceneY(next))
  }
  const onScroll = () => {
    const y = window.scrollY
    if (y !== prevScrollY) dir = y > prevScrollY ? 1 : -1
    prevScrollY = y
    queue()
    if (!snapping) {
      window.clearTimeout(idle)
      idle = window.setTimeout(snapIfBetween, IDLE_MS)
    }
  }
  // the reader takes over again the moment they scroll, touch or use the keys
  const interrupt = () => {
    if (snapping) stopSnap()
  }

  const onDot = (e: Event) => {
    const d = (e.target as HTMLElement).closest<HTMLElement>('[data-dot]')
    if (d) glideTo(sceneY(Number(d.dataset.dot)))
  }
  const onMq = () => {
    list = poses()
    queue()
  }

  const first = target()
  if (first !== null) {
    current = first
    draw(current)
  }
  // Also re-measure when the story itself changes size (e.g. a hidden page becomes visible).
  const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(queue) : null
  ro?.observe(section)
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('wheel', interrupt, { passive: true })
  window.addEventListener('touchstart', interrupt, { passive: true })
  window.addEventListener('keydown', interrupt)
  window.addEventListener('resize', queue)
  document.addEventListener('visibilitychange', queue)
  section.addEventListener('click', onDot)
  mq.addEventListener('change', onMq)
  return () => {
    cancelAnimationFrame(frame)
    stopSnap()
    window.clearTimeout(idle)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('wheel', interrupt)
    window.removeEventListener('touchstart', interrupt)
    window.removeEventListener('keydown', interrupt)
    window.removeEventListener('resize', queue)
    document.removeEventListener('visibilitychange', queue)
    ro?.disconnect()
    section.removeEventListener('click', onDot)
    mq.removeEventListener('change', onMq)
    spriteImg?.removeEventListener('load', showTurntable)
  }
}
