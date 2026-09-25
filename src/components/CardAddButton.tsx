'use client'

import Link from 'next/link'
import { useCart, type CartItem } from './CartProvider'
import { useI18n } from './I18nProvider'
import { QtyStepper } from './QtyStepper'

type Props = { item: Omit<CartItem, 'qty'> | null; slug: string; mode: 'add' | 'options' | 'notify' }

export function CardAddButton({ item, slug, mode }: Props) {
  const { t, href } = useI18n()
  const cart = useCart()
  if (mode !== 'add' || !item) {
    return (
      <Link href={href(`/products/${slug}`)} className="btn btn-outline w-full !min-h-11 text-sm">
        {mode === 'notify' ? t.common.notifyMe : t.common.shopNow}
      </Link>
    )
  }
  const inCart = cart.items.find((i) => i.sku === item.sku)
  if (inCart) {
    return (
      <div className="flex justify-center">
        <QtyStepper size="sm" value={inCart.qty} onChange={(q) => cart.setQty(item.sku, q)} />
      </div>
    )
  }
  return (
    <button type="button" className="btn btn-gold w-full !min-h-11 text-sm" onClick={() => cart.add(item)}>
      {t.common.addToCart}
    </button>
  )
}
