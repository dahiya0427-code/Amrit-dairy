'use client'

import { useCart } from './CartProvider'
import { useI18n } from './I18nProvider'
import { Icon } from './Icon'

export function CartButton() {
  const { t } = useI18n()
  const { count, setOpen, ready } = useCart()
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="relative inline-flex h-11 items-center gap-2 rounded-full bg-gold-500 px-4 font-semibold text-ink hover:bg-gold-600"
      aria-label={`${t.nav.cart} (${count})`}
    >
      <Icon name="cart" />
      <span className="hidden sm:inline">{t.nav.cart}</span>
      {ready && count > 0 && (
        <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-clay px-1 text-xs font-bold text-white">{count}</span>
      )}
    </button>
  )
}
