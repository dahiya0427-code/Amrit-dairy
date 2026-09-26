import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import { localePath } from '@/i18n/config'
import { getDictionary } from '@/i18n'
import { CartButton } from './CartButton'
import { Icon } from './Icon'
import { LanguageToggle } from './LanguageToggle'
import { BrandLogo } from './Logo'
import { MobileMenu } from './MobileMenu'
import { Ticker } from './Ticker'

type TickerItem = { id: number; text: string; link?: string | null }

/** Clean header: logo left, icon-and-label links right (Mr Dairy style). */
export function Header({ locale, ticker }: { locale: Locale; ticker: TickerItem[] }) {
  const t = getDictionary(locale)
  const href = (p: string) => localePath(locale, p)

  const nav = [
    { label: t.nav.shop, href: '/shop', icon: 'shop' },
    { label: t.nav.ghee, href: '/shop/ghee', icon: 'ghee' },
    { label: t.nav.dairy, href: '/shop/dairy', icon: 'milk' },
    { label: t.nav.achar, href: '/shop/achar', icon: 'jar' },
    { label: t.nav.farmStory, href: '/farm-story', icon: 'cow' },
    { label: t.nav.journal, href: '/blog', icon: 'leaf' },
  ]

  const menuGroups = [
    {
      title: t.nav.shop,
      links: [
        { label: t.shop.filterAll, href: '/shop' },
        { label: t.nav.ghee, href: '/shop/ghee' },
        { label: t.nav.dairy, href: '/shop/dairy' },
        { label: t.nav.achar, href: '/shop/achar' },
        { label: t.nav.subscribe, href: '/subscribe' },
        { label: t.nav.bulk, href: '/bulk-orders' },
        { label: t.nav.delivery, href: '/delivery' },
      ],
    },
    { title: t.nav.farmStory, links: [...t.mega.big, { label: t.nav.about, href: '/about' }] },
    {
      title: t.nav.contact,
      links: [
        { label: t.nav.blog, href: '/blog' },
        { label: t.nav.news, href: '/news' },
        { label: t.nav.contact, href: '/contact' },
      ],
    },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-char/95 backdrop-blur">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-[80] focus:rounded-full focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-ink">
        {t.nav.skipToContent}
      </a>
      <Ticker items={ticker} />
      <div className="container-x flex h-[76px] items-center justify-between gap-4 md:h-[92px]">
        <Link href={href('/')} className="flex shrink-0 items-center" aria-label="Amrit Dairy home">
          <BrandLogo height={80} priority className="h-14 w-auto md:h-[76px]" />
        </Link>

        <nav aria-label="Main" className="flex items-center gap-1">
          <ul className="hidden items-center lg:flex">
            {nav.map((l) => (
              <li key={l.href}>
                <Link href={href(l.href)} className="group flex w-[78px] flex-col items-center gap-1 rounded-xl px-1 py-2 text-center text-ink transition hover:bg-smoke xl:w-[88px]">
                  <Icon name={l.icon} size={22} className="text-gold-700 transition group-hover:-translate-y-0.5" />
                  <span className="text-[10.5px] font-semibold uppercase leading-tight tracking-[0.1em]">{l.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <span className="mx-1 hidden h-10 w-px bg-line lg:block" aria-hidden="true" />
          <span className="hidden sm:block"><LanguageToggle className="border-line text-ink hover:bg-smoke" /></span>
          <CartButton />
          <span className="lg:hidden"><MobileMenu groups={menuGroups} buttonClassName="text-ink hover:bg-smoke" /></span>
        </nav>
      </div>
    </header>
  )
}
