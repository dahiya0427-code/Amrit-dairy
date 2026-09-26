import Image from 'next/image'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import { localePath } from '@/i18n/config'
import { getDictionary } from '@/i18n'
import { CartButton } from './CartButton'
import { LanguageToggle } from './LanguageToggle'
import { LogoMark, Wordmark } from './Logo'
import { MobileMenu } from './MobileMenu'
import { Ticker } from './Ticker'

type TickerItem = { id: number; text: string; link?: string | null }

/** Premium header: menu left, centred wordmark, language + cart right. */
export function Header({ locale, ticker }: { locale: Locale; ticker: TickerItem[] }) {
  const t = getDictionary(locale)
  const href = (p: string) => localePath(locale, p)

  const left = [
    { label: t.nav.shop, href: '/shop' },
    { label: t.nav.ghee, href: '/shop/ghee' },
    { label: t.nav.dairy, href: '/shop/dairy' },
    { label: t.nav.achar, href: '/shop/achar' },
  ]
  const right = [
    { label: t.nav.desiCows, href: '/desi-cows' },
    { label: t.nav.journal, href: '/blog' },
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

  const navLink = 'whitespace-nowrap px-2 py-2 text-[12px] font-medium uppercase tracking-[0.12em] xl:text-[13px] text-cream transition hover:text-gold-700 xl:px-3'

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-coal/90 backdrop-blur">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-[80] focus:rounded-full focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-ink">
        {t.nav.skipToContent}
      </a>
      <Ticker items={ticker} />
      <div className="container-x grid h-[72px] grid-cols-[1fr_auto_1fr] items-center gap-3 md:h-[88px]">
        <nav aria-label="Main" className="flex items-center">
          <span className="lg:hidden"><MobileMenu groups={menuGroups} buttonClassName="text-cream hover:bg-latte" /></span>
          <ul className="hidden items-center lg:flex">
            {left.map((l) => (
              <li key={l.href}><Link href={href(l.href)} className={navLink}>{l.label}</Link></li>
            ))}
          </ul>
        </nav>

        <Link href={href('/')} className="flex items-center gap-3" aria-label="Amrit Dairy home">
          <span className="hidden sm:block"><LogoMark size={46} /></span>
          <Wordmark />
        </Link>

        <div className="flex items-center justify-end gap-1">
          <ul className="hidden items-center lg:flex">
            {/* Our Story mega menu (opens on hover or keyboard focus) */}
            <li className="group/mega relative">
              <Link href={href('/farm-story')} className={`${navLink} inline-flex items-center gap-1`} aria-haspopup="true">
                {t.nav.farmStory} <span aria-hidden="true" className="text-[10px]">▾</span>
              </Link>
              <div className="invisible absolute right-0 top-full z-50 w-[720px] pt-5 opacity-0 transition duration-200 group-focus-within/mega:visible group-focus-within/mega:opacity-100 group-hover/mega:visible group-hover/mega:opacity-100">
                <div className="grid grid-cols-[1.2fr_1fr_0.9fr] gap-6 overflow-hidden border border-line bg-char p-8 text-cream shadow-float">
                  <div>
                    <p className="eyebrow mb-4">{t.mega.title}</p>
                    <ul className="space-y-2">
                      {t.mega.big.map((l) => (
                        <li key={l.href}>
                          <Link href={href(l.href)} className="font-serif text-2xl font-semibold text-cream hover:text-gold-700">{l.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <ul className="grid content-start gap-2.5 pt-8 text-sm uppercase tracking-[0.12em]">
                    {t.mega.small.map((l) => (
                      <li key={l.href}><Link href={href(l.href)} className="text-cocoa hover:text-gold-700">{l.label}</Link></li>
                    ))}
                  </ul>
                  <div className="relative min-h-52 overflow-hidden bg-gold-500">
                    <Image src="/images/cat-cow.jpg" alt="" fill sizes="240px" className="object-cover" />
                  </div>
                </div>
              </div>
            </li>
            {right.map((l) => (
              <li key={l.href}><Link href={href(l.href)} className={navLink}>{l.label}</Link></li>
            ))}
          </ul>
          <span className="hidden sm:block"><LanguageToggle className="border-cream/30 text-cream hover:bg-latte" /></span>
          <CartButton />
        </div>
      </div>
    </header>
  )
}
