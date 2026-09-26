import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Icon } from '@/components/Icon'
import { LeadForm } from '@/components/LeadForm'
import { ProductCard } from '@/components/ProductCard'
import { Breadcrumbs, FAQ, SectionHeading } from '@/components/ui'
import { getDictionary } from '@/i18n'
import { isLocale } from '@/i18n/config'
import { getProducts, getServiceArea } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

// Rendered on first visit, then cached (ISR) and refreshed when content changes.
export async function generateStaticParams() {
  return []
}

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const a = await getServiceArea(slug, locale)
  if (!a) return {}
  const t = getDictionary(locale)
  return buildMetadata({ locale, path: `/delivery/${a.slug}`, title: a.meta?.title || t.delivery.areaTitle(`${a.name}, ${a.city}`), description: a.meta?.description || a.intro })
}

export default async function AreaPage({ params }: Props) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const area = await getServiceArea(slug, locale)
  if (!area) notFound()
  const t = getDictionary(locale)
  const products = (await getProducts(locale)).filter((p) => p.status === 'active').slice(0, 8)
  const live = area.status === 'live'

  return (
    <>
      <Breadcrumbs locale={locale} items={[{ name: t.delivery.title, path: '/delivery' }, { name: area.name, path: `/delivery/${area.slug}` }]} />
      <section className="container-x py-8">
        <h1 className="text-4xl md:text-5xl">{t.delivery.areaTitle(`${area.name}, ${area.city}`)}</h1>
        <p className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold ${live ? 'bg-latte text-success' : 'bg-butter text-gold-700'}`}>
          <Icon name={live ? 'check' : 'calendar'} /> {live ? t.delivery.live : t.delivery.comingSoon}
          {area.slot ? ` · ${area.slot}` : ''}
        </p>
        {area.intro && <p className="mt-4 max-w-3xl text-lg text-muted">{area.intro}</p>}
        {area.landmarks && area.landmarks.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-2 text-xl">{t.delivery.landmarks}</h2>
            <ul className="flex flex-wrap gap-2">
              {area.landmarks.map((l) => <li key={l.id} className="rounded-full border border-line bg-char px-3 py-1 text-sm">{l.name}</li>)}
            </ul>
          </div>
        )}
      </section>
      {live ? (
        products.length > 0 && (
          <section className="container-x py-8">
            <SectionHeading title={t.delivery.productsHere} />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:gap-5">
              {products.map((p) => <ProductCard key={p.id} product={p} locale={locale} />)}
            </div>
          </section>
        )
      ) : (
        <section className="container-x py-8">
          <div className="max-w-xl rounded-lg bg-malai p-6">
            <h2 className="text-2xl">{t.delivery.waitlistTitle}</h2>
            <p className="mb-4 mt-2 text-muted">{t.delivery.waitlistText}</p>
            <LeadForm type="waitlist" compact />
          </div>
        </section>
      )}
      {area.faqs && area.faqs.length > 0 && <FAQ locale={locale} faqs={area.faqs} />}
    </>
  )
}
