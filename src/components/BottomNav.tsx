'use client'

import Link from 'next/link'
import { useCart } from './CartProvider'
import { useI18n } from './I18nProvider'
import { Icon } from './Icon'
import { whatsappLink } from '@/lib/site'

/** App-like sticky bottom bar on mobile (Doc 05 §4.2). */
export function BottomNav({ whatsapp }: { whatsapp: string }) {
  const { t, href } = useI18n()
  const { count, setOpen, ready } = useCart()
  const item = 'flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-semibold'
  return (
    <nav aria-label="Quick actions" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-char/95 backdrop-blur md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex">
        <Link href={href('/')} className={item}><Icon name="home" />{t.bottomNav.home}</Link>
        <Link href={href('/shop')} className={item}><Icon name="shop" />{t.bottomNav.shop}</Link>
        <a href={whatsappLink(whatsapp, 'Hi Amrit Dairy!')} target="_blank" rel="noopener" className={`${item} text-caramel`}><Icon name="whatsapp" />{t.bottomNav.whatsapp}</a>
        <button type="button" onClick={() => setOpen(true)} className={`${item} relative`}>
          <Icon name="cart" />
          {t.bottomNav.cart}
          {ready && count > 0 && <span className="absolute right-[28%] top-1 grid h-4 min-w-4 place-items-center rounded-full bg-clay px-1 text-[10px] text-white">{count}</span>}
        </button>
        <Link href={href('/contact')} className={item}><Icon name="phone" />{t.bottomNav.contact}</Link>
      </div>
    </nav>
  )
}
