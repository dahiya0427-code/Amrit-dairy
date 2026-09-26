'use client'

import Image from 'next/image'
import Link from 'next/link'
import { formatINR } from '@/lib/format'
import { whatsappLink } from '@/lib/site'
import { cartWhatsappText, FreeDeliveryBar } from './CartDrawer'
import { useCart } from './CartProvider'
import { useI18n } from './I18nProvider'
import { QtyStepper } from './QtyStepper'

export function CartPageView({ whatsapp, freeThreshold }: { whatsapp: string; freeThreshold: number }) {
  const { t, href } = useI18n()
  const cart = useCart()

  return (
    <section className="container-x py-10">
      <h1 className="mb-6 text-4xl">{t.cart.title}</h1>
      {!cart.ready ? (
        <p>{t.common.loading}</p>
      ) : cart.items.length === 0 ? (
        <div className="rounded-lg bg-malai p-10 text-center">
          <p className="text-lg">{t.cart.empty}</p>
          <Link href={href('/shop')} className="btn btn-gold mt-4">{t.cart.emptyCta}</Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <ul className="divide-y divide-line rounded-lg border border-line bg-white lg:col-span-2">
            {cart.items.map((item) => (
              <li key={item.sku} className="flex gap-4 p-4">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-malai">
                  {item.image && <Image src={item.image} alt="" fill sizes="96px" className="object-contain" />}
                </div>
                <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <Link href={href(`/products/${item.slug}`)} className="font-semibold hover:underline">{item.title}</Link>
                    <p className="text-sm text-muted">{item.variantLabel} · {formatINR(item.price)}</p>
                    <button type="button" className="mt-1 text-sm text-error underline" onClick={() => cart.remove(item.sku)}>{t.common.remove}</button>
                  </div>
                  <div className="flex items-center gap-4">
                    <QtyStepper value={item.qty} onChange={(q) => cart.setQty(item.sku, q)} size="sm" />
                    <span className="w-20 text-right font-semibold tabular-nums">{formatINR(item.price * item.qty)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <aside className="h-fit space-y-4 rounded-lg bg-malai p-6">
            <FreeDeliveryBar subtotal={cart.subtotal} threshold={freeThreshold} />
            {cart.items.some((i) => i.fulfilment === 'local') && <p className="text-sm text-muted">{t.cart.splitNote}</p>}
            <div className="flex justify-between text-lg font-semibold">
              <span>{t.cart.subtotal}</span>
              <span className="tabular-nums">{formatINR(cart.subtotal)}</span>
            </div>
            <p className="text-sm text-muted">{t.cart.delivery}: {t.cart.deliveryAtCheckout}</p>
            <Link href={href('/checkout')} className="btn btn-gold w-full">{t.cart.checkout}</Link>
            <a className="block text-center text-sm font-medium text-caramel underline underline-offset-4" href={whatsappLink(whatsapp, cartWhatsappText(cart.items, 'Hi Amrit Dairy, I want to order:'))} target="_blank" rel="noopener">
              {t.cart.orWhatsapp}
            </a>
            <Link href={href('/shop')} className="block text-center text-sm underline">{t.cart.continue}</Link>
          </aside>
        </div>
      )}
    </section>
  )
}
