import Image from 'next/image'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import { localePath } from '@/i18n/config'
import { getDictionary } from '@/i18n'
import { CartButton } from './CartButton'
import { Icon } from './Icon'
import { LanguageToggle } from './LanguageToggle'
import { LogoMark } from './Logo'
import { MobileMenu } from './MobileMenu'
import { Ticker } from './Ticker'

type TickerItem = { id: number; text: string; link?: string | null }

/** Signature rounded green pill bar with the centred brand badge (Doc 03 §5.1). */
export function Header({ locale, ticker }: { locale: Locale; ticker: TickerItem[] }) {
  const t = getDictionary(locale)
  const href = (p: string) => localePath(locale, p)

  const left = [
    { label: t.nav.shop, href: '/shop', icon: 'shop' },
    { label: t.nav.ghee, href: '/products/desi-cow-golden-ghee', icon: 'ghee' },
    { label: t.nav.desiCows, href: '/desi-cows', icon: 'cow' },
  ]
  const right = [
    { label: t.nav.farmStory, href: '/farm-story', icon: 'leaf' },
    { label: t.nav.contact, href: '/contact', icon: 'phone' },
  ]

  const menuGroups = [
    {
      title: t.nav.shop,
      links: [
        { label: t.shop.filterAll, href: '/shop' },
        { label: t.nav.ghee, href: '/products/desi-cow-golden-ghee' },
        { label: t.nav.subscribe, href: '/subscribe' },
        { label: t.nav.bulk, href: '/bulk-orders' },
        { label: t.nav.delivery, href: '/delivery' },
      ],
    },
    {
      title: t.nav.farmStory,
      links: [
        { label: t.nav.farmStory, href: '/farm-story' },
        { label: t.nav.desiCows, href: '/desi-cows' },
        { label: t.nav.departments, href: '/departments' },
        { label: t.nav.facilities, href: '/facilities' },
        { label: t.nav.about, href: '/about' },
      ],
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

  return (
    <header className="sticky top-0 z-50">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-[80] focus:rounded-full focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-ink">
        {t.nav.skipToContent}
      </a>
      <Ticker items={ticker} />
      <div className="bg-forest-950 pb-2 pt-2 shadow-lift">
        <div className="container-x">
          <nav
            aria-label="Main"
            className="relative flex h-16 items-center justify-between rounded-full border border-gold-500/40 bg-forest-900 pl-1 pr-2 text-cream md:h-[72px] md:pl-3"
          >
            <div className="flex items-center gap-1">
              <MobileMenu groups={menuGroups} />
              <ul className="hidden items-center gap-1 lg:flex">
                {left.map((l) => (
                  <li key={l.href}>
                    <Link href={href(l.href)} className="flex flex-col items-center rounded-2xl px-3 py-1 text-xs font-semibold hover:bg-white/10">
                      <Icon name={l.icon} className="text-gold-500" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href={href('/')}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:top-[42%]"
              aria-label="Amrit Dairy home"
            >
              <span className="flex items-center gap-2 rounded-full md:block md:rounded-full md:border-4 md:border-gold-500 md:bg-forest-900 md:p-1 md:shadow-float">
                <span className="md:hidden"><LogoMark size={40} /></span>
                <span className="hidden md:block"><LogoMark size={64} /></span>
                <span className="font-serif text-xl font-semibold text-gold-500 md:hidden">Amrit</span>
              </span>
            </Link>

            <div className="flex items-center gap-1.5">
              <ul className="hidden items-center gap-1 lg:flex">
                {/* Farm Story mega menu (opens on hover or keyboard focus) */}
                <li className="group/mega relative">
                  <Link href={href('/farm-story')} className="flex flex-col items-center rounded-2xl px-3 py-1 text-xs font-semibold hover:bg-white/10" aria-haspopup="true">
                    <Icon name="leaf" className="text-gold-500" />
                    <span className="flex items-center gap-0.5">{t.nav.farmStory} <span aria-hidden="true">▾</span></span>
                  </Link>
                  <div className="invisible absolute right-[-120px] top-full z-50 w-[760px] pt-4 opacity-0 transition duration-200 group-focus-within/mega:visible group-focus-within/mega:opacity-100 group-hover/mega:visible group-hover/mega:opacity-100">
                    <div className="relative grid grid-cols-[1.2fr_1fr_0.9fr] gap-6 overflow-hidden rounded-3xl bg-cream p-7 text-ink shadow-float">
                      <div className="relative z-10">
                        <p className="eyebrow mb-3">{t.mega.title}</p>
                        <ul className="space-y-2">
                          {t.mega.big.map((l) => (
                            <li key={l.href}>
                              <Link href={href(l.href)} className="font-serif text-2xl font-semibold text-forest-900 hover:text-leaf-600 hover:underline underline-offset-4">{l.label}</Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <ul className="relative z-10 grid content-start gap-2 pt-7 text-[15px]">
                        {t.mega.small.map((l) => (
                          <li key={l.href}>
                            <Link href={href(l.href)} className="text-forest-800 hover:text-leaf-600 hover:underline underline-offset-4">{l.label}</Link>
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
                {right.filter((l) => l.href !== '/farm-story').map((l) => (
                  <li key={l.href}>
                    <Link href={href(l.href)} className="flex flex-col items-center rounded-2xl px-3 py-1 text-xs font-semibold hover:bg-white/10">
                      <Icon name={l.icon} className="text-gold-500" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <span className="hidden sm:block"><LanguageToggle className="text-cream" /></span>
              <CartButton />
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
