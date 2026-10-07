'use client'

import { useState } from 'react'
import { useI18n } from './I18nProvider'
import { Icon } from './Icon'

/** "Write a review": star picker and a short form. Reviews wait for approval in the admin. */
export function ReviewForm({ productId, products }: { productId?: number; products?: { id: number; title: string }[] }) {
  const { t, locale } = useI18n()
  const r = t.reviews
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [hover, setHover] = useState(0)
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const v = (k: string) => String(fd.get(k) ?? '').trim()
    setState('sending')
    setError('')
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale,
          website: v('website'),
          rating,
          name: v('name'),
          locality: v('locality'),
          phone: v('phone'),
          quote: v('quote'),
          productId: productId ?? (v('productId') ? Number(v('productId')) : null),
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error || r.error)
      setState('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : r.error)
      setState('idle')
    }
  }

  if (state === 'done') {
    return (
      <p role="status" className="mt-6 flex items-center gap-2 rounded-2xl border border-gold-500/50 bg-gold-500/10 p-4 font-semibold text-[#6b3d1f]">
        <Icon name="check" size={18} /> {r.thanks}
      </p>
    )
  }
  if (!open) {
    return (
      <button type="button" className="btn btn-outline mt-6" onClick={() => setOpen(true)}>
        <Icon name="star" size={18} /> {r.write}
      </button>
    )
  }
  const shown = hover || rating
  return (
    <form onSubmit={onSubmit} className="mt-6 max-w-2xl space-y-4 rounded-2xl bg-malai p-5 md:p-6">
      <div>
        <h3 className="font-serif text-2xl text-[#6b3d1f]">{r.formTitle}</h3>
        <p className="text-sm text-muted">{r.formText}</p>
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <fieldset>
        <legend className="label">{r.yourRating}</legend>
        <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={r.stars(n)}
              aria-pressed={rating === n}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              className={`transition hover:scale-110 ${n <= shown ? 'text-gold-500' : 'text-line'}`}
            >
              <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.6l2.9 6 6.5.8-4.8 4.5 1.2 6.5L12 17.3l-5.8 3.1 1.2-6.5L2.6 9.4l6.5-.8L12 2.6z" /></svg>
            </button>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="rv-name">{r.name}<span className="text-error" aria-hidden="true"> *</span></label>
          <input className="input" id="rv-name" name="name" required minLength={2} maxLength={60} autoComplete="name" />
        </div>
        <div>
          <label className="label" htmlFor="rv-locality">{r.city}</label>
          <input className="input" id="rv-locality" name="locality" maxLength={60} />
        </div>
      </div>
      {products && products.length > 0 && !productId && (
        <div>
          <label className="label" htmlFor="rv-product">{r.product}</label>
          <select className="input" id="rv-product" name="productId" defaultValue="">
            <option value="">{r.general}</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label className="label" htmlFor="rv-quote">{r.review}<span className="text-error" aria-hidden="true"> *</span></label>
        <textarea className="input min-h-28" id="rv-quote" name="quote" required minLength={10} maxLength={1000} placeholder={r.reviewPlaceholder} />
      </div>
      <div>
        <label className="label" htmlFor="rv-phone">{r.phone}</label>
        <input className="input" id="rv-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" pattern="^(\+?91[\s-]?)?[6-9][0-9]{4}[\s-]?[0-9]{5}$" />
      </div>
      {error && <p role="alert" className="text-sm font-medium text-error">{error}</p>}
      <button type="submit" className="btn btn-gold" disabled={state === 'sending'}>{state === 'sending' ? r.sending : r.send}</button>
    </form>
  )
}
