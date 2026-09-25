import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Icon } from '@/components/Icon'
import { ProductCard } from '@/components/ProductCard'
import { RichText } from '@/components/RichText'
import { Breadcrumbs, CheckList, FAQ, PageHero, SectionHeading } from '@/components/ui'
import { getDictionary } from '@/i18n'
import { isLocale, localePath } from '@/i18n/config'
import type { Department, Product } from '@/payload-types'
import { mediaUrl } from '@/lib/media'
import { getFacility, getSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { whatsappLink } from '@/lib/site'

// Rendered on first visit, then cached (ISR) and refreshed when content changes.
export async function generateStaticParams() {
  return []
}

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const f = await getFacility(slug, locale)
  if (!f) return {}
  return buildMetadata({ locale, path: `/facilities/${f.slug}`, title: f.meta?.title || f.title, description: f.meta?.description || f.summary, image: mediaUrl(f.image, 'card') })
}

export default async function FacilityPage({ params }: Props) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const f = await getFacility(slug, locale)
  if (!f) notFound()
  const t = getDictionary(locale)
  const settings = await getSettings(locale)
  const dept = typeof f.department === 'object' ? (f.department as Department) : null
  const products = (f.relatedProducts ?? []).filter((p): p is Product => typeof p === 'object')

  return (
    <>
      <PageHero title={f.title} intro={f.summary} eyebrow={t.facilities.title} />
      <Breadcrumbs locale={locale} items={[{ name: t.facilities.title, path: '/facilities' }, { name: f.title, path: `/facilities/${f.slug}` }]} />

      <section className="container-x grid gap-10 py-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {mediaUrl(f.image, 'hero') && (
            <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded-3xl bg-malai">
              <Image src={mediaUrl(f.image, 'hero') as string} alt={f.title} fill priority sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover" />
            </div>
          )}
          <RichText data={f.description} />
        </div>
        <aside className="space-y-4">
          {f.specs && f.specs.length > 0 && (
            <div className="card p-5">
              <h2 className="mb-3 text-xl">{t.facilities.specs}</h2>
              <dl className="space-y-2">
                {f.specs.map((s) => (
                  <div key={s.id} className="flex justify-between gap-3 border-b border-line pb-2 last:border-0">
                    <dt className="text-muted">{s.label}</dt>
                    <dd className="font-semibold">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          {dept && (
            <Link href={localePath(locale, `/departments/${dept.slug}`)} className="card flex items-center gap-3 p-5 hover:shadow-lift">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-forest-900 text-gold-500"><Icon name={dept.icon ?? 'leaf'} /></span>
              <span>
                <span className="block text-sm text-muted">{t.facilities.managedBy}</span>
                <span className="block font-semibold text-forest-900">{dept.title}</span>
              </span>
            </Link>
          )}
        </aside>
      </section>

      {f.steps && f.steps.length > 0 && (
        <section className="bg-malai/60 py-12">
          <div className="container-x">
            <SectionHeading title={t.facilities.steps} />
            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {f.steps.map((s, i) => (
                <li key={s.id ?? i} className="rounded-2xl bg-cream p-5 shadow-card">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-forest-900 font-serif font-semibold text-gold-500">{i + 1}</span>
                  <span className="mt-3 block font-semibold text-forest-900">{s.title}</span>
                  {s.text && <span className="mt-1 block text-muted">{s.text}</span>}
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {f.hygiene && f.hygiene.length > 0 && (
        <section className="container-x py-12">
          <SectionHeading title={t.facilities.hygiene} />
          <CheckList items={f.hygiene.map((h) => h.text)} />
        </section>
      )}

      {products.length > 0 && (
        <section className="container-x py-10">
          <SectionHeading title={t.facilities.madeHere} />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:gap-5">
            {products.map((p) => <ProductCard key={p.id} product={p} locale={locale} />)}
          </div>
        </section>
      )}

      {f.faqs && f.faqs.length > 0 && <FAQ locale={locale} faqs={f.faqs} />}

      <section className="container-x pb-6">
        <div className="flex flex-col items-start justify-between gap-4 rounded-3xl bg-mint p-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl">{t.facilities.visitTitle}</h2>
            <p className="text-muted">{t.facilities.visitText}</p>
          </div>
          <a href={whatsappLink(settings.ordersPhone, `Hi Amrit Dairy, I would like to visit the ${f.title}.`)} target="_blank" rel="noopener" className="btn btn-primary">
            <Icon name="whatsapp" /> {t.common.whatsappUs}
          </a>
        </div>
      </section>
    </>
  )
}
