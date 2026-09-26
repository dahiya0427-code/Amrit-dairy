'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { formatINR } from '@/lib/format'
import { whatsappLink } from '@/lib/site'
import { useCart } from './CartProvider'
import { useI18n } from './I18nProvider'
import { Icon } from './Icon'
import { LeadForm } from './LeadForm'
import { PincodeChecker } from './PincodeChecker'
import { QtyStepper } from './QtyStepper'

export type BuyBoxVariant = {
  label: string
  sku: string
  price: number | null
  mrp: number | null
  unitPriceLabel: string | null
  weightGrams: number | null
  onDemand: boolean
  available: boolean
}

type Props = {
  productId: number
  slug: string
  title: string
  image: string | null
  status: 'active' | 'coming_soon' | 'out_of_stock'
  fulfilment: 'local' | 'ship'
  subscribable: boolean
  variants: BuyBoxVariant[]
  whatsapp: string
}

export function ProductBuyBox(p: Props) {
  const { t, href } = useI18n()
  const cart = useCart()
  const router = useRouter()
  const firstAvailable = Math.max(0, p.variants.findIndex((v) => v.available))
  const [idx, setIdx] = useState(firstAvailable)
  const [qty, setQty] = useState(1)
  const actionsRef = useRef<HTMLDivElement>(null)
  const [showBar, setShowBar] = useState(false)

  // Show the bottom buy bar once the main buttons have scrolled out of view.
  useEffect(() => {
    const el = actionsRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setShowBar(!entry.isIntersecting && entry.boundingClientRect.top < 0))
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const v = p.variants[idx]
  const buyable = p.status === 'active' && v?.available && !v.onDemand && (v.price ?? 0) > 0

  const addToCart = () => {
    if (!buyable || !v) return
    cart.add(
      { productId: p.productId, slug: p.slug, title: p.title, variantLabel: v.label, sku: v.sku, price: v.price as number, image: p.image, fulfilment: p.fulfilment },
      qty,
    )
  }

  const discount = v?.mrp && v.price && v.mrp > v.price ? Math.round(((v.mrp - v.price) / v.mrp) * 100) : 0

  return (
    <div className="space-y-5">
      {p.status === 'active' && v?.price ? (
        <div>
          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-3xl font-bold tabular-nums text-ink">{formatINR(v.price)}</span>
            {discount > 0 && (
              <>
                <span className="text-lg text-muted line-through">{t.common.mrp} {formatINR(v.mrp)}</span>
                <span className="font-semibold text-clay">{discount}% {t.common.off}</span>
              </>
            )}
          </p>
          <p className="text-sm text-muted">
            {t.common.inclTaxes}
            {v.unitPriceLabel ? ` · ${v.unitPriceLabel}` : ''}
          </p>
        </div>
      ) : (
        <p className="inline-flex rounded-full bg-butter px-4 py-2 font-semibold text-gold-700">
          {p.status === 'out_of_stock' ? t.common.outOfStock : t.common.comingSoon}
        </p>
      )}

      {p.variants.length > 1 && (
        <fieldset>
          <legend className="label">{t.product.variant}</legend>
          <div className="grid grid-cols-2 gap-3">
            {p.variants.map((variant, i) => {
              const per100 = variant.price && variant.weightGrams ? Math.round((variant.price / variant.weightGrams) * 100) : null
              const selected = i === idx
              return (
                <button
                  key={variant.sku}
                  type="button"
                  onClick={() => setIdx(i)}
                  aria-pressed={selected}
                  className={`relative flex min-h-24 flex-col items-center justify-center rounded-2xl border-2 px-3 py-3 text-center transition ${
                    selected ? 'border-forest-900 bg-mint shadow-lift' : 'border-line bg-white hover:border-forest-900'
                  }`}
                >
                  {i === 0 && p.status === 'active' && !variant.onDemand && (
                    <span className="absolute -top-2.5 rounded-full bg-forest-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-cream">{t.common.bestseller}</span>
                  )}
                  <span className="text-sm font-bold text-ink">{variant.label}</span>
                  {variant.onDemand ? (
                    <span className="mt-1 text-sm font-semibold text-gold-700">{t.common.onDemand}</span>
                  ) : variant.price && p.status === 'active' ? (
                    <>
                      <span className="mt-1 text-lg font-bold tabular-nums text-forest-900">{formatINR(variant.price)}</span>
                      {per100 && <span className="text-xs text-muted">({formatINR(per100)} {t.pdp.perUnit})</span>}
                    </>
                  ) : null}
                </button>
              )
            })}
          </div>
        </fieldset>
      )}

      {p.status !== 'active' ? (
        <div className="rounded-2xl bg-malai p-5">
          <p className="mb-3 font-semibold">{t.product.comingSoonText}</p>
          <LeadForm type="notify" product={p.title} compact submitLabel={t.common.notifyMe} />
        </div>
      ) : v?.onDemand ? (
        <div className="rounded-2xl bg-malai p-5">
          <p className="mb-3 font-semibold">{t.product.onDemandText}</p>
          <LeadForm type="bulk" product={`${p.title} – ${v.label}`} compact submitLabel={t.common.requestBulk} />
        </div>
      ) : (
        <>
          <div ref={actionsRef} className="flex flex-wrap items-center gap-3">
            <QtyStepper value={qty} onChange={(q) => setQty(Math.max(1, q))} />
            <button type="button" className="btn btn-gold flex-1" onClick={addToCart} disabled={!buyable}>
              <Icon name="cart" /> {t.common.addToCart}
            </button>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="btn btn-primary flex-1"
              disabled={!buyable}
              onClick={() => {
                addToCart()
                cart.setOpen(false)
                router.push(href('/checkout'))
              }}
            >
              {t.common.buyNow}
            </button>
            <a
              className="btn btn-outline flex-1"
              href={whatsappLink(p.whatsapp, `Hi Amrit Dairy, I want to order ${p.title} (${v?.label}) × ${qty}`)}
              target="_blank"
              rel="noopener"
            >
              <Icon name="whatsapp" /> {t.common.orderOnWhatsapp}
            </a>
          </div>
        </>
      )}

      <div>
        <p className="label">{t.pincode.label}</p>
        <PincodeChecker fulfilment={p.fulfilment} compact />
      </div>

      {p.subscribable && (
        <p className="rounded-xl bg-mint px-4 py-3 text-sm">
          {t.product.subscribeHint}{' '}
          <Link href={href('/subscribe')} className="font-semibold text-leaf-600 underline underline-offset-4">{t.product.subscribeLink}</Link>
        </p>
      )}

      {/* Sticky buy bar (Doc 05 §5.3): appears after the main buttons scroll away */}
      {buyable && v?.price && (
        <div
          className={`fixed inset-x-0 bottom-[58px] z-30 border-t border-line bg-cream/95 backdrop-blur transition-transform duration-300 md:bottom-0 ${
            showBar ? 'translate-y-0' : 'pointer-events-none translate-y-[150%]'
          }`}
        >
          <div className="container-x flex items-center gap-3 py-2">
            {p.image && (
              <span className="relative hidden h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-malai sm:block">
                <Image src={p.image} alt="" fill sizes="48px" className="object-contain" />
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold sm:text-base">{p.title}</span>
              <span className="block text-sm tabular-nums"><strong>{formatINR(v.price)}</strong> <span className="text-muted">· {v.label}</span></span>
            </span>
            <button type="button" className="btn btn-gold !min-h-11 shrink-0 sm:!px-10" onClick={addToCart}>
              {t.common.addToCart}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
