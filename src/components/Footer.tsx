import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import { localePath } from '@/i18n/config'
import { getDictionary } from '@/i18n'
import type { Category, LegalPage, ServiceArea, SiteSetting } from '@/payload-types'
import { telLink, whatsappLink } from '@/lib/site'
import { Icon } from './Icon'
import { BrandLogo } from './Logo'

/**
 * Clean footer (Mr Dairy style): big phone numbers on the left, a short list
 * of links on the right, then licences, address and the logo, and a visible
 * credit for the agency that built the site.
 */
export function Footer({
  locale,
  settings,
  legal,
}: {
  locale: Locale
  settings: SiteSetting
  categories: Category[]
  areas: ServiceArea[]
  legal: LegalPage[]
}) {
  const t = getDictionary(locale)
  const href = (p: string) => localePath(locale, p)
  const socials = [
    { name: 'facebook', url: settings.facebook },
    { name: 'instagram', url: settings.instagram },
    { name: 'youtube', url: settings.youtube },
  ].filter((s) => s.url)

  const links = [
    { label: t.nav.shop, href: '/shop' },
    { label: t.nav.farmStory, href: '/farm-story' },
    { label: t.adopt.nav, href: '/adopt-a-cow' },
    { label: t.nav.sellCow, href: '/desi-cows#sell-cow' },
    { label: t.reviews.pageTitle, href: '/reviews' },
    ...legal.map((l) => ({ label: l.title, href: `/legal/${l.slug}` })),
    { label: t.nav.contact, href: '/contact' },
  ]
  const phones = [settings.ordersPhone, settings.cowPhone].filter((p, i, a): p is string => Boolean(p) && a.indexOf(p) === i)

  return (
    <footer className="border-t border-line bg-char text-ink">
      <div className="container-x pb-4 md:pb-8">
        <div className="grid gap-10 border-b-2 border-ink/80 pb-10 pt-10 md:grid-cols-[1fr_auto] md:pt-14">
          {/* Order line: big numbers */}
          <div>
            <p className="font-serif text-2xl font-bold uppercase tracking-[0.02em] md:text-4xl">{t.footer.orderTitle}</p>
            <ul className="mt-2 space-y-1">
              {phones.map((p) => (
                <li key={p}>
                  <a href={whatsappLink(p)} target="_blank" rel="noopener" className="font-serif text-3xl font-bold tracking-[0.08em] text-[#6b3d1f] hover:text-gold-700 md:text-5xl">
                    {p}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {settings.email && (
                <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-2 text-base font-medium hover:text-gold-700">
                  <Icon name="mail" size={20} /> {settings.email}
                </a>
              )}
              {socials.map((s) => (
                <a key={s.name} href={s.url as string} target="_blank" rel="noopener" aria-label={s.name} className="grid h-11 w-11 place-items-center rounded-xl bg-[#6b3d1f] text-white hover:bg-gold-500 hover:text-ink">
                  <Icon name={s.name} size={22} />
                </a>
              ))}
              {phones[0] && (
                <a href={telLink(phones[0])} className="grid h-11 w-11 place-items-center rounded-xl bg-[#6b3d1f] text-white hover:bg-gold-500 hover:text-ink" aria-label={t.common.callUs}>
                  <Icon name="phone" size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Short list of links */}
          <nav aria-label={t.footer.legal}>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-1 md:text-right">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={href(l.href)} className="text-sm font-bold uppercase tracking-[0.06em] hover:text-gold-700">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Licences, address, logo */}
        <div className="flex flex-col gap-6 py-8 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2 text-sm text-muted">
            <p className="flex flex-wrap gap-2">
              {settings.fssai && <span className="rounded-md border border-line px-2.5 py-1 font-semibold text-ink">FSSAI {settings.fssai}</span>}
              {settings.gstin && <span className="rounded-md border border-line px-2.5 py-1">GSTIN {settings.gstin}</span>}
            </p>
            {settings.address && <p>{settings.address}</p>}
            <p>© {new Date().getFullYear()} {t.footer.rights}</p>
          </div>
          <Link href={href('/')} aria-label="Amrit Dairy home" className="shrink-0">
            <BrandLogo height={110} className="h-24 w-auto md:h-28" />
          </Link>
        </div>
      </div>

      {/* Credit for the designer: her name in shimmering gold with twinkling sparkles */}
      <div className="relative overflow-hidden bg-[#2b1b10] text-center text-[#f6eee0]">
        <span className="credit-glow" aria-hidden="true" />
        <p className="container-x relative flex flex-wrap items-center justify-center gap-x-2 gap-y-1 py-4 pb-24 text-sm md:pb-4 md:text-base">
          <span className="opacity-80">{t.footer.madeBy}</span>
          <span className="credit-name">
            <span className="credit-spark credit-spark-a" aria-hidden="true">✦</span>
            <span className="credit-text">Nancy</span>
            <span className="credit-spark credit-spark-b" aria-hidden="true">✦</span>
          </span>
        </p>
      </div>
    </footer>
  )
}
