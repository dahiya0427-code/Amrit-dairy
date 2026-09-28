'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { formatINR } from '@/lib/format'
import { whatsappLink } from '@/lib/site'
import { cartWhatsappText } from './CartDrawer'
import { useCart } from './CartProvider'
import { useI18n } from './I18nProvider'
import { Icon } from './Icon'

type Fees = { threshold: number; local: number; ship: number }
type AppliedCoupon = { code: string; description: string | null; discount: number; freeDelivery: boolean }
type QuoteError = { error?: string; code?: string; reason?: string; min?: number }

type RazorpayResponse = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }
type RazorpayCtor = new (opts: Record<string, unknown>) => { open: () => void; on: (e: string, cb: () => void) => void }

function loadRazorpay(): Promise<RazorpayCtor> {
  const w = window as unknown as { Razorpay?: RazorpayCtor }
  if (w.Razorpay) return Promise.resolve(w.Razorpay)
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => (w.Razorpay ? resolve(w.Razorpay) : reject(new Error('Razorpay unavailable')))
    s.onerror = () => reject(new Error('Razorpay unavailable'))
    document.body.appendChild(s)
  })
}

export function CheckoutForm({ whatsapp, onlinePayments, livePincodes, fees }: { whatsapp: string; onlinePayments: boolean; livePincodes: string[]; fees: Fees }) {
  const { t, href, locale } = useI18n()
  const c = t.checkout
  const cart = useCart()
  const router = useRouter()
  const [pincode, setPincode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const cc = c.coupon
  const formRef = useRef<HTMLFormElement>(null)
  const [couponInput, setCouponInput] = useState('')
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null)
  const [couponMsg, setCouponMsg] = useState('')
  const [checking, setChecking] = useState(false)
  const [repriced, setRepriced] = useState(false)
  const lineKey = cart.items.map((i) => `${i.sku}:${i.qty}`).join(',')

  const couponText = (d: QuoteError) => {
    if (d.reason === 'min_order' && d.min) return cc.errors.min_order(formatINR(d.min))
    const msg = cc.errors[d.reason as Exclude<keyof typeof cc.errors, 'min_order'>]
    return typeof msg === 'string' ? msg : cc.errors.error
  }

  /** Server price for the cart (live offers) and, with a code, the coupon discount. */
  async function quote(code?: string) {
    const phone = (formRef.current?.elements.namedItem('phone') as HTMLInputElement | null)?.value
    const res = await fetch('/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        locale,
        pincode: /^[1-9][0-9]{5}$/.test(pincode) ? pincode : '',
        phone,
        items: cart.items.map((i) => ({ productId: i.productId, sku: i.sku, qty: i.qty })),
      }),
    })
    return { ok: res.ok, data: await res.json() }
  }

  // Refresh prices when the page opens or the cart changes, and re-check an applied coupon.
  useEffect(() => {
    if (!cart.ready || !cart.items.length) return
    let live = true
    quote(coupon?.code)
      .then(({ ok, data }) => {
        if (!live) return
        if (ok) {
          if (cart.items.some((i) => data.prices[i.sku] && data.prices[i.sku] !== i.price)) {
            cart.reprice(data.prices)
            setRepriced(true)
          }
          if (coupon) setCoupon(data.coupon ?? null)
        } else if (data.code === 'coupon') {
          setCoupon(null)
          setCouponMsg(couponText(data))
        }
      })
      .catch(() => {})
    return () => {
      live = false
    }
    // runs for a new cart only (sku × qty); the coupon and helpers are read at that moment
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.ready, lineKey])

  async function applyCoupon() {
    const code = couponInput.trim()
    if (!code) return
    setChecking(true)
    setCouponMsg('')
    try {
      const { ok, data } = await quote(code)
      if (ok && data.coupon) {
        setCoupon(data.coupon)
        if (cart.items.some((i) => data.prices[i.sku] && data.prices[i.sku] !== i.price)) cart.reprice(data.prices)
      } else setCouponMsg(couponText(data))
    } catch {
      setCouponMsg(cc.errors.error)
    }
    setChecking(false)
  }

  useEffect(() => {
    try {
      const saved = localStorage.getItem('amrit-pincode')
      if (saved) setPincode(saved)
    } catch { /* ignore */ }
  }, [])

  const isLocal = livePincodes.includes(pincode)
  const hasFresh = cart.items.some((i) => i.fulfilment === 'local')
  const freshBlocked = hasFresh && /^[1-9][0-9]{5}$/.test(pincode) && !isLocal
  const discount = coupon?.discount ?? 0
  const fee = coupon?.freeDelivery || (fees.threshold && cart.subtotal >= fees.threshold) ? 0 : isLocal ? fees.local : fees.ship
  const total = cart.subtotal - discount + fee

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (freshBlocked) return
    setBusy(true)
    setError('')
    const f = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale,
          couponCode: coupon?.code,
          items: cart.items.map((i) => ({ productId: i.productId, sku: i.sku, qty: i.qty })),
          customer: {
            name: f.name,
            phone: f.phone,
            email: f.email,
            address: f.address,
            landmark: f.landmark,
            city: f.city,
            state: f.state,
            pincode: f.pincode,
            notes: f.notes,
          },
        }),
      })
      const data = await res.json()
      if (!res.ok && data.code === 'coupon') {
        setCoupon(null)
        setCouponMsg(couponText(data))
        throw new Error(couponText(data))
      }
      if (!res.ok) throw new Error(data.error || c.errorGeneric)

      const done = () => {
        cart.clear()
        router.push(`${href(`/order/${data.orderNumber}`)}?t=${data.token}`)
      }

      if (data.mode !== 'razorpay') return done()

      const Razorpay = await loadRazorpay()
      const rzp = new Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: 'INR',
        order_id: data.razorpayOrderId,
        name: 'Amrit Dairy',
        description: `Order ${data.orderNumber}`,
        prefill: { name: data.customer.name, email: data.customer.email, contact: data.customer.phone },
        notes: { orderNumber: data.orderNumber },
        theme: { color: '#2B1B10' },
        handler: async (resp: RazorpayResponse) => {
          const v = await fetch('/api/checkout/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderNumber: data.orderNumber, token: data.token, ...resp }),
          })
          if (v.ok) done()
          else {
            setError(c.paymentFailed)
            setBusy(false)
          }
        },
        modal: { ondismiss: () => setBusy(false) },
      })
      rzp.on('payment.failed', () => setError(c.paymentFailed))
      rzp.open()
    } catch (err) {
      setError(err instanceof Error ? err.message : c.errorGeneric)
      setBusy(false)
    }
  }

  if (cart.ready && cart.items.length === 0) {
    return (
      <section className="container-x py-16 text-center">
        <h1 className="text-4xl">{c.title}</h1>
        <p className="mt-4 text-lg">{c.emptyCart}</p>
        <Link href={href('/shop')} className="btn btn-gold mt-6">{t.cart.emptyCta}</Link>
      </section>
    )
  }

  const field = (name: string, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label className="label" htmlFor={`co-${name}`}>
        {label}
        {props.required && <span className="text-error" aria-hidden="true"> *</span>}
      </label>
      <input className="input" id={`co-${name}`} name={name} {...props} />
    </div>
  )

  return (
    <section className="container-x py-10">
      <h1 className="mb-6 text-4xl">{c.title}</h1>
      <form ref={formRef} onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-5">
        <div className="space-y-5 lg:col-span-3">
          <fieldset className="space-y-4 rounded-lg border border-line bg-char p-5 md:p-6">
            <legend className="px-2 font-serif text-xl font-semibold text-cream">1 · {c.contact}</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              {field('name', c.name, { required: true, autoComplete: 'name', maxLength: 100 })}
              {field('phone', c.phone, { required: true, type: 'tel', inputMode: 'tel', autoComplete: 'tel', pattern: '^(\\+?91[\\s-]?)?[6-9][0-9]{4}[\\s-]?[0-9]{5}$' })}
            </div>
            {field('email', c.email, { type: 'email', autoComplete: 'email' })}
            {field('address', c.address, { required: true, autoComplete: 'street-address', minLength: 5, maxLength: 400 })}
            {field('landmark', c.landmark, { maxLength: 150 })}
            <div className="grid gap-4 sm:grid-cols-3">
              {field('pincode', c.pincode, {
                required: true,
                inputMode: 'numeric',
                pattern: '[1-9][0-9]{5}',
                maxLength: 6,
                autoComplete: 'postal-code',
                value: pincode,
                onChange: (e) => setPincode(e.target.value.replace(/\D/g, '')),
              })}
              {field('city', c.city, { required: true, autoComplete: 'address-level2', defaultValue: 'Sonipat' })}
              {field('state', c.state, { required: true, autoComplete: 'address-level1', defaultValue: 'Haryana' })}
            </div>
            {/^[1-9][0-9]{5}$/.test(pincode) && (
              <p aria-live="polite" className={`text-sm font-semibold ${freshBlocked ? 'text-error' : 'text-success'}`}>
                {freshBlocked ? t.pincode.notLive : isLocal ? `✓ ${t.delivery.live}` : `📦 ${t.pincode.ships}`}
              </p>
            )}
            <div>
              <label className="label" htmlFor="co-notes">{c.notes}</label>
              <textarea className="input min-h-20" id="co-notes" name="notes" maxLength={500} />
            </div>
          </fieldset>

          <div className={`rounded-2xl p-4 text-sm ${onlinePayments ? 'bg-latte' : 'bg-butter'}`}>
            <p className="flex items-start gap-2"><Icon name="shield" className="shrink-0 text-caramel" /> {onlinePayments ? c.secure : c.whatsappMode}</p>
          </div>
        </div>

        <aside className="h-fit space-y-4 rounded-lg bg-malai p-5 md:p-6 lg:sticky lg:top-40 lg:col-span-2">
          <h2 className="text-2xl">{c.summary}</h2>
          <ul className="space-y-3">
            {cart.items.map((i) => (
              <li key={i.sku} className="flex items-center gap-3">
                <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-paper">
                  {i.image && <Image src={i.image} alt="" fill sizes="56px" className="object-contain" />}
                </span>
                <span className="flex-1 text-sm">
                  <span className="block font-semibold">{i.title}</span>
                  <span className="text-muted">{i.variantLabel} × {i.qty}</span>
                </span>
                <span className="font-semibold tabular-nums">{formatINR(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-line pt-3">
            {coupon ? (
              <div className="flex items-start justify-between gap-3 rounded-xl border border-gold-500/60 bg-gold-500/10 p-3 text-sm">
                <p>
                  <span className="flex items-center gap-1.5 font-bold text-cream"><Icon name="check" size={16} /> {cc.applied(coupon.code)}</span>
                  <span className="block text-muted">{coupon.description || (coupon.freeDelivery ? cc.freeDelivery : cc.save(formatINR(coupon.discount)))}</span>
                </p>
                <button
                  type="button"
                  className="shrink-0 text-sm font-semibold underline underline-offset-4 hover:text-gold-700"
                  onClick={() => {
                    setCoupon(null)
                    setCouponInput('')
                  }}
                >
                  {cc.remove}
                </button>
              </div>
            ) : (
              <div>
                <label className="label" htmlFor="co-coupon">{cc.label}</label>
                <div className="flex gap-2">
                  <input
                    id="co-coupon"
                    className="input min-w-0 flex-1 uppercase"
                    value={couponInput}
                    maxLength={30}
                    autoComplete="off"
                    placeholder={cc.placeholder}
                    onChange={(e) => setCouponInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        applyCoupon()
                      }
                    }}
                  />
                  <button type="button" className="btn btn-outline shrink-0 !px-5" disabled={checking || !couponInput.trim()} onClick={applyCoupon}>
                    {checking ? cc.checking : cc.apply}
                  </button>
                </div>
                {couponMsg && <p role="alert" className="mt-1.5 text-sm font-medium text-error">{couponMsg}</p>}
              </div>
            )}
          </div>
          <dl className="space-y-1 border-t border-line pt-3 text-sm">
            <div className="flex justify-between"><dt>{t.cart.subtotal}</dt><dd className="tabular-nums">{formatINR(cart.subtotal)}</dd></div>
            {discount > 0 && coupon && (
              <div className="flex justify-between font-semibold text-success"><dt>{cc.discount} ({coupon.code})</dt><dd className="tabular-nums">− {formatINR(discount)}</dd></div>
            )}
            <div className="flex justify-between"><dt>{t.cart.delivery}</dt><dd className="tabular-nums">{fee === 0 ? c.freeDelivery : formatINR(fee)}</dd></div>
            <div className="flex justify-between border-t border-line pt-2 text-lg font-bold"><dt>{t.cart.total}</dt><dd className="tabular-nums">{formatINR(total)}</dd></div>
            <p className="text-xs text-muted">{t.common.inclTaxes}</p>
            {repriced && <p className="text-xs font-medium text-gold-700">{c.pricesUpdated}</p>}
          </dl>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" required className="mt-1 h-4 w-4 accent-walnut" />
            <span>
              {c.consent}{' '}
              <Link href={href('/legal/terms-of-service')} className="underline" target="_blank">↗</Link>
            </span>
          </label>
          {error && <p role="alert" className="rounded-xl bg-char p-3 text-sm font-medium text-error">{error}</p>}
          <button type="submit" className="btn btn-gold w-full text-lg" disabled={busy || !cart.ready || freshBlocked}>
            {busy ? c.processing : onlinePayments ? c.pay(formatINR(total)) : c.placeOrder}
          </button>
          <a className="block text-center text-sm font-medium text-caramel underline underline-offset-4" href={whatsappLink(whatsapp, cartWhatsappText(cart.items, 'Hi Amrit Dairy, I want to order:'))} target="_blank" rel="noopener">
            {t.cart.orWhatsapp}
          </a>
        </aside>
      </form>
    </section>
  )
}
