'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { formatINR } from '@/lib/format'
import { useI18n } from './I18nProvider'
import { Icon } from './Icon'

export type AdoptPlan = { id: number; name: string; price: number; period: 'month' | 'year' | 'once'; tagline: string | null; perks: string[]; highlight: boolean }
export type AdoptCow = { name: string; photo: string | null }

/** Plan cards, a cow picker and the sign-up form for /adopt-a-cow (sends to /api/adopt). */
export function AdoptForm({ plans, cows }: { plans: AdoptPlan[]; cows: AdoptCow[] }) {
  const { t, locale } = useI18n()
  const a = t.adopt
  const [planId, setPlanId] = useState<number | null>(plans.find((p) => p.highlight)?.id ?? plans[0]?.id ?? null)
  const [cow, setCow] = useState('')
  const [gift, setGift] = useState(false)
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState('')
  const formRef = useRef<HTMLDivElement>(null)
  const per = (p: AdoptPlan) => (p.period === 'month' ? a.perMonth : p.period === 'year' ? a.perYear : a.once)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const v = (k: string) => String(fd.get(k) ?? '').trim()
    setState('sending')
    setError('')
    try {
      const res = await fetch('/api/adopt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale,
          website: v('website'),
          consent: fd.get('consent') === 'on',
          name: v('name'),
          phone: v('phone'),
          email: v('email'),
          city: v('city'),
          planId,
          cow,
          isGift: gift,
          giftFor: v('giftFor'),
          occasion: v('occasion'),
          message: v('message'),
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error || a.error)
      setState('done')
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } catch (err) {
      setError(err instanceof Error ? err.message : a.error)
      setState('idle')
    }
  }

  return (
    <>
      {/* plans */}
      <section id="plans" className="container-x scroll-mt-28 py-12">
        <h2 className="text-center text-3xl md:text-5xl">{a.plansTitle}</h2>
        <ul className="mx-auto mt-8 grid max-w-5xl gap-5 md:grid-cols-3">
          {plans.map((p) => {
            const on = p.id === planId
            return (
              <li key={p.id}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    setPlanId(p.id)
                    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                  className={`relative flex h-full w-full flex-col rounded-[24px] border-2 p-6 text-left transition hover:-translate-y-1 ${p.highlight ? 'bg-ink text-snow' : 'bg-snow text-ink'} ${on ? 'border-gold-500 shadow-[0_0_0_4px_rgba(201,162,74,0.25),0_20px_40px_-20px_rgba(43,27,16,0.6)]' : 'border-line'}`}
                >
                  {p.highlight && <span className="absolute -top-3 left-6 rounded-full bg-gold-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink">{a.mostLoved}</span>}
                  <span className={`font-serif text-2xl font-bold uppercase ${p.highlight ? 'text-gold-500' : 'text-[#6b3d1f]'}`}>{p.name}</span>
                  {p.tagline && <span className={`mt-1 text-sm ${p.highlight ? 'text-snow/75' : 'text-muted'}`}>{p.tagline}</span>}
                  <span className="mt-4 flex items-baseline gap-1">
                    <span className="font-serif text-4xl font-bold">{formatINR(p.price)}</span>
                    <span className={`text-sm ${p.highlight ? 'text-snow/70' : 'text-muted'}`}>{per(p)}</span>
                  </span>
                  <ul className="mt-5 flex-1 space-y-2 text-sm">
                    {p.perks.map((perk) => (
                      <li key={perk} className="flex gap-2">
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold-500 text-ink"><Icon name="check" size={12} /></span>
                        {perk}
                      </li>
                    ))}
                  </ul>
                  <span className={`mt-6 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 font-bold ${on ? 'bg-gold-500 text-ink' : p.highlight ? 'border border-gold-500 text-gold-500' : 'border border-ink/30'}`}>
                    {on && <Icon name="check" size={16} />} {on ? a.chosen : a.choose}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      {/* form */}
      <section className="container-x pb-12">
        <div ref={formRef} className="mx-auto max-w-4xl scroll-mt-28">
          {state === 'done' ? (
            <div role="status" className="rounded-[28px] border border-gold-500/50 bg-gold-500/10 p-8 text-center md:p-12">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold-500 text-ink"><Icon name="check" size={32} /></span>
              <h2 className="mt-4 text-3xl text-[#6b3d1f]">{a.doneTitle}</h2>
              <p className="mx-auto mt-2 max-w-lg text-lg text-muted">{a.doneText}</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6 rounded-[28px] bg-malai p-5 md:p-8">
              <div>
                <h2 className="text-3xl text-[#6b3d1f]">{a.formTitle}</h2>
                <p className="mt-1 text-muted">{a.formText}</p>
              </div>
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

              <fieldset>
                <legend className="label">{a.plan}<span className="text-error" aria-hidden="true"> *</span></legend>
                <div className="flex flex-wrap gap-2">
                  {plans.map((p) => (
                    <label key={p.id} className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line bg-snow px-4 py-2 text-sm font-semibold has-[:checked]:border-gold-500 has-[:checked]:bg-gold-500/20">
                      <input type="radio" name="plan" value={p.id} checked={p.id === planId} onChange={() => setPlanId(p.id)} required className="accent-[#6b3d1f]" />
                      {p.name} · {formatINR(p.price)} {per(p)}
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="label">{a.cow}</legend>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                  {[{ name: '', photo: null } as AdoptCow, ...cows].map((c) => (
                    <label key={c.name || 'any'} className="group cursor-pointer text-center">
                      <input type="radio" name="cow" value={c.name} checked={cow === c.name} onChange={() => setCow(c.name)} className="peer sr-only" />
                      <span className="relative block aspect-square overflow-hidden rounded-t-full rounded-b-2xl border-2 border-line bg-snow transition peer-checked:border-gold-500 peer-checked:shadow-[0_0_0_3px_rgba(201,162,74,0.3)] peer-focus-visible:outline peer-focus-visible:outline-2">
                        {c.photo ? <Image src={c.photo} alt="" fill sizes="120px" className="object-cover" /> : <span className="grid h-full place-items-center text-gold-700"><Icon name="sparkle" size={28} /></span>}
                      </span>
                      <span className="mt-1 block text-xs font-bold uppercase tracking-wide text-ink">{c.name || a.anyCow}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="ad-name">{a.name}<span className="text-error" aria-hidden="true"> *</span></label>
                  <input className="input" id="ad-name" name="name" required minLength={2} maxLength={100} autoComplete="name" />
                </div>
                <div>
                  <label className="label" htmlFor="ad-phone">{a.phone}<span className="text-error" aria-hidden="true"> *</span></label>
                  <input className="input" id="ad-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required pattern="^(\+?91[\s-]?)?[6-9][0-9]{4}[\s-]?[0-9]{5}$" />
                </div>
                <div>
                  <label className="label" htmlFor="ad-email">{a.email}</label>
                  <input className="input" id="ad-email" name="email" type="email" autoComplete="email" />
                </div>
                <div>
                  <label className="label" htmlFor="ad-city">{a.city}</label>
                  <input className="input" id="ad-city" name="city" maxLength={80} autoComplete="address-level2" />
                </div>
              </div>

              <label className="flex items-center gap-2 font-semibold">
                <input type="checkbox" checked={gift} onChange={(e) => setGift(e.target.checked)} className="h-4 w-4 accent-[#6b3d1f]" /> 🎁 {a.gift}
              </label>
              {gift && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="ad-giftFor">{a.giftFor}</label>
                    <input className="input" id="ad-giftFor" name="giftFor" maxLength={100} />
                  </div>
                  <div>
                    <label className="label" htmlFor="ad-occasion">{a.occasion}</label>
                    <input className="input" id="ad-occasion" name="occasion" maxLength={100} placeholder={a.occasionPlaceholder} />
                  </div>
                </div>
              )}
              <div>
                <label className="label" htmlFor="ad-message">{a.message}</label>
                <textarea className="input min-h-20" id="ad-message" name="message" maxLength={1500} />
              </div>
              <label className="flex items-start gap-2 text-sm">
                <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 accent-[#6b3d1f]" />
                <span>{a.consent}</span>
              </label>
              {error && <p role="alert" className="rounded-xl bg-char p-3 text-sm font-medium text-error">{error}</p>}
              <button type="submit" className="btn btn-gold !px-10 text-lg" disabled={state === 'sending' || !planId}>
                <Icon name="cow" size={20} /> {state === 'sending' ? a.sending : a.send}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
