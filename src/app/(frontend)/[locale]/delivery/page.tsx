import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Icon } from '@/components/Icon'
import { LeadForm } from '@/components/LeadForm'
import { PincodeChecker } from '@/components/PincodeChecker'
import { Badge, Breadcrumbs, PageHero } from '@/components/ui'
import { getDictionary } from '@/i18n'
import { isLocale, localePath } from '@/i18n/config'
import { getServiceAreas } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  return buildMetadata({ locale, path: '/delivery', title: t.delivery.title, description: t.delivery.intro })
}

export default async function DeliveryPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  const areas = await getServiceAreas(locale)
  return (
    <>
      <PageHero title={t.delivery.title} intro={t.delivery.intro} />
      <Breadcrumbs locale={locale} items={[{ name: t.delivery.title, path: '/delivery' }]} />
      <section className="container-x grid gap-8 py-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-2xl">{t.pincode.label}</h2>
          <PincodeChecker />
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {areas.map((a) => (
              <li key={a.id}>
                <Link href={localePath(locale, `/delivery/${a.slug}`)} className="card flex items-center justify-between gap-3 p-4 hover:shadow-lift">
                  <span className="flex items-center gap-2 font-semibold text-forest-900"><Icon name="map" className="text-leaf-600" /> {a.name}, {a.city}</span>
                  <Badge tone={a.status === 'live' ? 'ship' : 'soon'}>{a.status === 'live' ? t.delivery.live : t.delivery.comingSoon}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl bg-malai p-6">
          <h2 className="text-2xl">{t.delivery.waitlistTitle}</h2>
          <p className="mb-4 mt-2 text-muted">{t.delivery.waitlistText}</p>
          <LeadForm type="waitlist" compact />
        </div>
      </section>
    </>
  )
}
