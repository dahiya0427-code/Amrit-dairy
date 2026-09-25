'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
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
          <div className="flex flex-wrap gap-2">
            {p.variants.map((variant, i) => (
              <button
                key={variant.sku}
                type="button"
                onClick={() => setIdx(i)}
                aria-pressed={i === idx}
                className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                  i === idx ? 'border-forest-900 bg-forest-900 text-cream' : 'border-line bg-white text-ink hover:border-forest-900'
                }`}
              >
                {variant.label}
                {variant.onDemand && <span className="ml-1 font-normal opacity-80">· {t.common.onDemand}</span>}
              </button>
            ))}
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
          <div className="flex flex-wrap items-center gap-3">
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

      {/* Sticky mobile buy bar (Doc 05 §5.3) */}
      {buyable && v?.price && (
        <div className="fixed inset-x-0 bottom-[58px] z-30 flex items-center gap-3 border-t border-line bg-cream px-4 py-2 md:hidden">
          <span className="font-bold tabular-nums">{formatINR(v.price)}</span>
          <button type="button" className="btn btn-gold !min-h-11 flex-1" onClick={addToCart}>
            {t.common.addToCart}
          </button>
        </div>
      )}
    </div>
  )
}
