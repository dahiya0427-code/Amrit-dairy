import Image from 'next/image'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import { localePath } from '@/i18n/config'
import { getDictionary } from '@/i18n'
import { CartButton } from './CartButton'
import { LanguageToggle } from './LanguageToggle'
import { LogoMark } from './Logo'
import { MobileMenu } from './MobileMenu'
import { Ticker } from './Ticker'

type TickerItem = { id: number; text: string; link?: string | null }

/** Clean white header: logo left, menu centre, language + cart right. */
export function Header({ locale, ticker }: { locale: Locale; ticker: TickerItem[] }) {
  const t = getDictionary(locale)
  const href = (p: string) => localePath(locale, p)

  const links = [
    { label: t.nav.shop, href: '/shop' },
    { label: t.nav.ghee, href: '/shop/ghee' },
    { label: t.nav.dairy, href: '/shop/dairy' },
    { label: t.nav.achar, href: '/shop/achar' },
    { label: t.nav.desiCows, href: '/desi-cows' },
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
    {
      title: t.nav.farmStory,
      links: [...t.mega.big, { label: t.nav.about, href: '/about' }],
    },
    {
      title: t.nav.contact,
      links: [
        { label: t.nav.blog, href: '/blog' },
        { label: t.nav.news, href: '/news' },
        { label: t.nav.contact, href: '/contact' },
      ],
    },
  ]

  const navLink = 'rounded-full px-3 py-2 text-[15px] font-semibold text-leaf-900 transition hover:bg-mint'

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-[80] focus:rounded-full focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-ink">
        {t.nav.skipToContent}
      </a>
      <Ticker items={ticker} />
      <div className="container-x flex h-[68px] items-center justify-between gap-3 md:h-20">
        <div className="flex items-center gap-1">
          <span className="lg:hidden">
            <MobileMenu groups={menuGroups} buttonClassName="text-leaf-900 hover:bg-mint" />
          </span>
          <Link href={href('/')} className="flex items-center gap-2.5" aria-label="Amrit Dairy home">
            <LogoMark size={44} />
            <span className="flex flex-col leading-none">
              <span className="font-serif text-2xl font-extrabold tracking-tight text-leaf-900 md:text-[28px]">Amrit Dairy</span>
              <span className="font-hand text-sm text-gold-700">हर घर अमृत</span>
            </span>
          </Link>
        </div>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}><Link href={href(l.href)} className={navLink}>{l.label}</Link></li>
            ))}
            {/* Farm Story mega menu (opens on hover or keyboard focus) */}
            <li className="group/mega relative">
              <Link href={href('/farm-story')} className={`${navLink} inline-flex items-center gap-1`} aria-haspopup="true">
                {t.nav.farmStory} <span aria-hidden="true" className="text-xs">▾</span>
              </Link>
              <div className="invisible absolute left-1/2 top-full z-50 w-[760px] -translate-x-1/2 pt-4 opacity-0 transition duration-200 group-focus-within/mega:visible group-focus-within/mega:opacity-100 group-hover/mega:visible group-hover/mega:opacity-100">
                <div className="relative grid grid-cols-[1.2fr_1fr_0.9fr] gap-6 overflow-hidden rounded-3xl border border-line bg-white p-7 text-ink shadow-float">
                  <div className="relative z-10">
                    <p className="eyebrow mb-3">{t.mega.title}</p>
                    <ul className="space-y-2">
                      {t.mega.big.map((l) => (
                        <li key={l.href}>
                          <Link href={href(l.href)} className="font-serif text-2xl font-bold text-leaf-900 underline-offset-4 hover:text-leaf-600 hover:underline">{l.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <ul className="relative z-10 grid content-start gap-2 pt-7 text-[15px]">
                    {t.mega.small.map((l) => (
                      <li key={l.href}>
                        <Link href={href(l.href)} className="text-forest-800 underline-offset-4 hover:text-leaf-600 hover:underline">{l.label}</Link>
                      </li>
                    ))}
                  </ul>
                  <div className="relative z-10 min-h-52 overflow-hidden rounded-2xl bg-forest-900">
                    <Image src="/images/cat-cow.jpg" alt="" fill sizes="240px" className="object-cover" />
                  </div>
                  <svg className="pointer-events-none absolute inset-x-0 bottom-0 h-16 w-full" viewBox="0 0 760 64" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M0 40 C 180 10, 320 60, 520 34 S 700 20, 760 36 V64 H0 Z" fill="#eaf1e4" />
                  </svg>
                </div>
              </div>
            </li>
            <li><Link href={href('/contact')} className={navLink}>{t.nav.contact}</Link></li>
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden sm:block"><LanguageToggle className="border-leaf-900/30 text-leaf-900 hover:bg-mint" /></span>
          <CartButton />
        </div>
      </div>
    </header>
  )
}
