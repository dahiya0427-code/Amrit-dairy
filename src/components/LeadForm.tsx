'use client'

import { useState } from 'react'
import { useI18n } from './I18nProvider'

type LeadType = 'contact' | 'bulk' | 'subscription' | 'cow' | 'notify' | 'waitlist'
type Field = 'name' | 'phone' | 'email' | 'pincode' | 'message' | 'quantity' | 'subject' | 'frequency' | 'startDate' | 'buySell' | 'breed'

const FIELDS: Record<LeadType, Field[]> = {
  contact: ['name', 'phone', 'email', 'subject', 'message'],
  bulk: ['name', 'phone', 'email', 'pincode', 'quantity', 'message'],
  subscription: ['name', 'phone', 'pincode', 'quantity', 'frequency', 'startDate', 'message'],
  cow: ['name', 'phone', 'buySell', 'breed', 'pincode', 'message'],
  notify: ['phone', 'email', 'pincode'],
  waitlist: ['name', 'phone', 'pincode'],
}

export function LeadForm({ type, product, compact = false, submitLabel }: { type: LeadType; product?: string; compact?: boolean; submitLabel?: string }) {
  const { t, locale } = useI18n()
  const f = t.forms
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')
  const fields = FIELDS[type]

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const data = Object.fromEntries(form.entries()) as Record<string, string>
    const extra = [
      data.subject && `${f.subject}: ${f.subjects[data.subject] ?? data.subject}`,
      data.frequency && `${f.frequency}: ${f.frequencies[data.frequency] ?? data.frequency}`,
      data.startDate && `${f.startDate}: ${data.startDate}`,
      data.buySell && `${f.buySell}: ${data.buySell === 'sell' ? f.sell : f.buy}`,
      data.breed && `${f.breed}: ${data.breed}`,
    ].filter(Boolean)
    setState('sending')
    setError('')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: type === 'contact' && data.subject && data.subject !== 'contact' ? data.subject : type,
          name: data.name,
          phone: data.phone,
          email: data.email,
          pincode: data.pincode,
          quantity: data.quantity,
          product,
          message: [data.message, ...extra].filter(Boolean).join('\n'),
          website: data.website, // honeypot
          locale,
          sourcePage: window.location.pathname,
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error || f.error)
      setState('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : f.error)
      setState('error')
    }
  }

  if (state === 'done') {
    return (
      <p role="status" className="rounded-2xl bg-latte p-5 font-semibold text-cream">
        {type === 'notify' || type === 'waitlist' ? f.notifySuccess : f.success}
      </p>
    )
  }

  const grid = compact ? 'grid gap-3' : 'grid gap-4 sm:grid-cols-2'
  const id = (n: string) => `${type}-${n}`
  const req = <span className="text-error" aria-hidden="true"> *</span>

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate={false}>
      <div className={grid}>
        {fields.includes('name') && (
          <div>
            <label className="label" htmlFor={id('name')}>{f.name}{req}</label>
            <input className="input" id={id('name')} name="name" required autoComplete="name" maxLength={100} />
          </div>
        )}
        {fields.includes('phone') && (
          <div>
            <label className="label" htmlFor={id('phone')}>{f.phone}{req}</label>
            <input className="input" id={id('phone')} name="phone" type="tel" required autoComplete="tel" inputMode="tel" pattern="^(\+?91[\s-]?)?[6-9][0-9]{4}[\s-]?[0-9]{5}$" placeholder="98XXXXXXXX" />
          </div>
        )}
        {fields.includes('email') && (
          <div>
            <label className="label" htmlFor={id('email')}>{f.email}{type === 'contact' ? req : null}</label>
            <input className="input" id={id('email')} name="email" type="email" autoComplete="email" required={type === 'contact'} />
          </div>
        )}
        {fields.includes('pincode') && (
          <div>
            <label className="label" htmlFor={id('pincode')}>{f.pincode}{type === 'waitlist' ? req : null}</label>
            <input className="input" id={id('pincode')} name="pincode" inputMode="numeric" pattern="[1-9][0-9]{5}" maxLength={6} autoComplete="postal-code" required={type === 'waitlist'} />
          </div>
        )}
        {fields.includes('subject') && (
          <div>
            <label className="label" htmlFor={id('subject')}>{f.subject}</label>
            <select className="input" id={id('subject')} name="subject" defaultValue="contact">
              {Object.entries(f.subjects).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
        )}
        {fields.includes('buySell') && (
          <fieldset>
            <legend className="label">{f.buySell}</legend>
            <div className="flex gap-4 pt-2">
              <label className="flex items-center gap-2"><input type="radio" name="buySell" value="buy" defaultChecked className="h-5 w-5 accent-walnut" /> {f.buy}</label>
              <label className="flex items-center gap-2"><input type="radio" name="buySell" value="sell" className="h-5 w-5 accent-walnut" /> {f.sell}</label>
            </div>
          </fieldset>
        )}
        {fields.includes('breed') && (
          <div>
            <label className="label" htmlFor={id('breed')}>{f.breed}</label>
            <input className="input" id={id('breed')} name="breed" maxLength={60} />
          </div>
        )}
        {fields.includes('quantity') && (
          <div>
            <label className="label" htmlFor={id('quantity')}>{f.quantity}</label>
            <input className="input" id={id('quantity')} name="quantity" maxLength={60} placeholder={type === 'subscription' ? '1 L' : '10 kg'} />
          </div>
        )}
        {fields.includes('frequency') && (
          <div>
            <label className="label" htmlFor={id('frequency')}>{f.frequency}</label>
            <select className="input" id={id('frequency')} name="frequency" defaultValue="daily">
              {Object.entries(f.frequencies).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
        )}
        {fields.includes('startDate') && (
          <div>
            <label className="label" htmlFor={id('startDate')}>{f.startDate}</label>
            <input className="input" id={id('startDate')} name="startDate" type="date" />
          </div>
        )}
      </div>
      {fields.includes('message') && (
        <div>
          <label className="label" htmlFor={id('message')}>{f.message}</label>
          <textarea className="input min-h-28" id={id('message')} name="message" maxLength={2000} />
        </div>
      )}
      {/* Honeypot: hidden from people, bots fill it in. */}
      <div className="hidden" aria-hidden="true">
        <label>Website <input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      {type !== 'notify' && type !== 'waitlist' && (
        <label className="flex items-start gap-2 text-sm text-muted">
          <input type="checkbox" required className="mt-1 h-4 w-4 accent-walnut" /> {f.consent}
        </label>
      )}
      {state === 'error' && <p role="alert" className="font-medium text-error">{error}</p>}
      <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={state === 'sending'}>
        {state === 'sending' ? f.sending : submitLabel ?? f.send}
      </button>
    </form>
  )
}
