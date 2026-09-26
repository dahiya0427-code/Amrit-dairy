'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { useCart } from './CartProvider'
import { useI18n } from './I18nProvider'
import { Icon } from './Icon'
import { QtyStepper } from './QtyStepper'
import { formatINR } from '@/lib/format'
import { whatsappLink } from '@/lib/site'

export function cartWhatsappText(items: { title: string; variantLabel: string; qty: number }[], intro: string) {
  return `${intro}\n${items.map((i) => `• ${i.title} (${i.variantLabel}) × ${i.qty}`).join('\n')}`
}

export function FreeDeliveryBar({ subtotal, threshold }: { subtotal: number; threshold: number }) {
  const { t } = useI18n()
  if (!threshold) return null
  const pct = Math.min(100, Math.round((subtotal / threshold) * 100))
  return (
    <div className="rounded-xl bg-latte p-3 text-sm">
      <p className="font-medium text-cream">
        {subtotal >= threshold ? t.cart.freeDeliveryDone : t.cart.freeDeliveryNudge(formatINR(threshold - subtotal))}
      </p>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-char" aria-hidden="true">
        <div className="h-full rounded-full bg-caramel transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export function CartDrawer({ whatsapp, freeThreshold }: { whatsapp: string; freeThreshold: number }) {
  const { t, href } = useI18n()
  const cart = useCart()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!cart.open) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && cart.setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [cart.open, cart])

  if (!cart.open) return null

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-labelledby="cart-title">
      <button type="button" className="absolute inset-0 bg-ink/40" aria-label={t.nav.close} onClick={() => cart.setOpen(false)} />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-char shadow-float">
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 id="cart-title" className="text-2xl">{t.cart.title}</h2>
          <button ref={closeRef} type="button" className="grid h-11 w-11 place-items-center rounded-full hover:bg-malai" onClick={() => cart.setOpen(false)} aria-label={t.nav.close}>
            <Icon name="close" />
          </button>
        </header>

        {cart.items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <Icon name="cart" size={48} className="text-gold-700" />
            <p className="text-lg">{t.cart.empty}</p>
            <Link href={href('/shop')} className="btn btn-gold" onClick={() => cart.setOpen(false)}>{t.cart.emptyCta}</Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {cart.items.map((item) => (
                <li key={item.sku} className="flex gap-3">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-paper">
                    {item.image && <Image src={item.image} alt="" fill sizes="80px" className="object-contain" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link href={href(`/products/${item.slug}`)} className="font-semibold leading-snug hover:underline" onClick={() => cart.setOpen(false)}>{item.title}</Link>
                    <p className="text-sm text-muted">{item.variantLabel}</p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <QtyStepper size="sm" value={item.qty} onChange={(q) => cart.setQty(item.sku, q)} />
                      <span className="font-semibold tabular-nums">{formatINR(item.price * item.qty)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <footer className="space-y-3 border-t border-line px-5 py-4">
              <FreeDeliveryBar subtotal={cart.subtotal} threshold={freeThreshold} />
              <div className="flex justify-between text-lg font-semibold">
                <span>{t.cart.subtotal}</span>
                <span className="tabular-nums">{formatINR(cart.subtotal)}</span>
              </div>
              <p className="text-sm text-muted">{t.cart.delivery}: {t.cart.deliveryAtCheckout}</p>
              <Link href={href('/checkout')} className="btn btn-gold w-full" onClick={() => cart.setOpen(false)}>{t.cart.checkout}</Link>
              <a
                className="block text-center text-sm font-medium text-caramel underline underline-offset-4"
                href={whatsappLink(whatsapp, cartWhatsappText(cart.items, 'Hi Amrit Dairy, I want to order:'))}
                target="_blank"
                rel="noopener"
              >
                {t.cart.orWhatsapp}
              </a>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
