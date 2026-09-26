import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import { localePath } from '@/i18n/config'
import { getDictionary } from '@/i18n'
import type { Category, LegalPage, ServiceArea, SiteSetting } from '@/payload-types'
import { telLink, whatsappLink } from '@/lib/site'
import { FarmSketch } from './FarmSketch'
import { Icon } from './Icon'
import { BrandLogo } from './Logo'

export function Footer({
  locale,
  settings,
  categories,
  areas,
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

  const heading = 'mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold-700'
  const link = 'hover:text-gold-700 hover:underline underline-offset-4'

  return (
    <footer className="bg-espresso text-cream/85">
      <FarmSketch className="h-28 bg-char md:h-40" count={4} />
      <div className="pb-24 md:pb-0">
      <div className="border-b border-cream/15">
        <div className="container-x flex flex-col items-center py-12 text-center">
          <BrandLogo height={110} className="h-24 w-auto md:h-28" />
          <p className="mt-4 max-w-xl font-serif text-2xl italic text-cream">{t.footer.tagline}</p>
          <span className="mt-5 h-px w-24 bg-gold-500/60" aria-hidden="true" />
        </div>
      </div>
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h2 className={heading}>Amrit Dairy</h2>
          <p className="text-sm leading-relaxed">{t.footer.about}</p>
          <p className="mt-3 text-sm">{settings.address}</p>
          {socials.length > 0 && (
            <ul className="mt-4 flex gap-2">
              {socials.map((s) => (
                <li key={s.name}>
                  <a href={s.url as string} target="_blank" rel="noopener" className="grid h-10 w-10 place-items-center rounded-full border border-cream/30 hover:border-gold-500" aria-label={s.name}>
                    <Icon name={s.name} size={18} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className={heading}>{t.footer.shop}</h2>
          <ul className="space-y-2 text-sm">
            <li><Link className={link} href={href('/shop')}>{t.shop.filterAll}</Link></li>
            {categories.map((c) => (
              <li key={c.id}><Link className={link} href={href(`/shop/${c.slug}`)}>{c.title}</Link></li>
            ))}
            <li><Link className={link} href={href('/subscribe')}>{t.nav.subscribe}</Link></li>
            <li><Link className={link} href={href('/bulk-orders')}>{t.nav.bulk}</Link></li>
          </ul>
        </div>

        <div>
          <h2 className={heading}>{t.footer.farm}</h2>
          <ul className="space-y-2 text-sm">
            <li><Link className={link} href={href('/farm-story')}>{t.nav.farmStory}</Link></li>
            <li><Link className={link} href={href('/desi-cows')}>{t.nav.desiCows}</Link></li>
            <li><Link className={link} href={href('/departments')}>{t.nav.departments}</Link></li>
            <li><Link className={link} href={href('/facilities')}>{t.nav.facilities}</Link></li>
            <li><Link className={link} href={href('/about')}>{t.nav.about}</Link></li>
            <li><Link className={link} href={href('/blog')}>{t.nav.blog}</Link></li>
            <li><Link className={link} href={href('/news')}>{t.nav.news}</Link></li>
            <li><Link className={link} href={href('/delivery')}>{t.nav.delivery}</Link></li>
            <li><Link className={link} href={href('/contact')}>{t.nav.contact}</Link></li>
          </ul>
        </div>

        <div>
          <h2 className={heading}>{t.footer.contact}</h2>
          <ul className="space-y-2 text-sm">
            <li>
              {t.footer.ordersWhatsapp}:{' '}
              <a className={link} href={whatsappLink(settings.ordersPhone)} target="_blank" rel="noopener">{settings.ordersPhone}</a>
            </li>
            <li>{t.footer.cowEnquiry}: <a className={link} href={telLink(settings.cowPhone)}>{settings.cowPhone}</a></li>
            <li><a className={link} href={`mailto:${settings.email}`}>{settings.email}</a></li>
          </ul>
          <h2 className={`${heading} mt-6`}>{t.footer.registered}</h2>
          <ul className="space-y-1 text-sm">
            {settings.gstin && <li>GSTIN: {settings.gstin}</li>}
            {settings.fssai && <li>FSSAI Lic. No.: {settings.fssai}</li>}
            {settings.udyam && <li>Udyam Reg. No.: {settings.udyam}</li>}
          </ul>
        </div>
      </div>

      {areas.length > 0 && (
        <div className="border-t border-cream/15">
          <div className="container-x flex flex-wrap items-center gap-x-4 gap-y-2 py-4 text-sm">
            <span className="font-semibold text-gold-700">{t.footer.areas}:</span>
            {areas.map((a) => (
              <Link key={a.id} className={link} href={href(`/delivery/${a.slug}`)}>{a.name}, {a.city}</Link>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-cream/15">
        <div className="container-x flex flex-col gap-3 py-5 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {t.footer.rights}</p>
          <ul className="flex flex-wrap gap-x-4 gap-y-1" aria-label={t.footer.legal}>
            {legal.map((l) => (
              <li key={l.id}><Link className={link} href={href(`/legal/${l.slug}`)}>{l.title}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      </div>
    </footer>
  )
}
