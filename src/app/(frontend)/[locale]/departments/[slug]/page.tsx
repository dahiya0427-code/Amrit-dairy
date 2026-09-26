import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Icon } from '@/components/Icon'
import { ProductCard } from '@/components/ProductCard'
import { RichText } from '@/components/RichText'
import { Breadcrumbs, CheckList, FAQ, PageHero, SectionHeading } from '@/components/ui'
import { getDictionary } from '@/i18n'
import { isLocale, localePath } from '@/i18n/config'
import type { Product } from '@/payload-types'
import { getDepartment, getFacilities } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

// Rendered on first visit, then cached (ISR) and refreshed when content changes.
export async function generateStaticParams() {
  return []
}

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const d = await getDepartment(slug, locale)
  if (!d) return {}
  return buildMetadata({ locale, path: `/departments/${d.slug}`, title: d.meta?.title || d.title, description: d.meta?.description || d.summary })
}

export default async function DepartmentPage({ params }: Props) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const d = await getDepartment(slug, locale)
  if (!d) notFound()
  const t = getDictionary(locale)
  const facilities = await getFacilities(locale, d.id)
  const products = (d.relatedProducts ?? []).filter((p): p is Product => typeof p === 'object')

  return (
    <>
      <PageHero title={d.title} intro={d.summary} eyebrow={t.departments.title} />
      <Breadcrumbs locale={locale} items={[{ name: t.departments.title, path: '/departments' }, { name: d.title, path: `/departments/${d.slug}` }]} />
      <section className="container-x grid gap-10 py-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RichText data={d.description} />
          {d.responsibilities && d.responsibilities.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-4 text-3xl">{t.departments.what}</h2>
              <CheckList items={d.responsibilities.map((r) => r.text)} />
            </div>
          )}
        </div>
        {d.head?.name && (
          <aside className="card h-fit p-6">
            <p className="eyebrow">{t.departments.head}</p>
            <p className="mt-2 font-serif text-xl font-semibold text-cream">{d.head.name}</p>
            {d.head.role && <p className="text-muted">{d.head.role}</p>}
          </aside>
        )}
      </section>

      {d.standards && d.standards.length > 0 && (
        <section className="bg-malai/60 py-12">
          <div className="container-x">
            <SectionHeading title={t.departments.standards} />
            <ul className="grid gap-4 md:grid-cols-2">
              {d.standards.map((s) => (
                <li key={s.id} className="flex gap-4 rounded-2xl bg-char p-5 shadow-card">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-latte text-caramel"><Icon name="shield" /></span>
                  <span>
                    <span className="block font-semibold text-cream">{s.title}</span>
                    {s.text && <span className="mt-1 block text-muted">{s.text}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {facilities.length > 0 && (
        <section className="container-x py-12">
          <SectionHeading title={t.departments.facilities} />
          <ul className="grid gap-4 md:grid-cols-3">
            {facilities.map((f) => (
              <li key={f.id}>
                <Link href={localePath(locale, `/facilities/${f.slug}`)} className="card block h-full p-5 hover:shadow-lift">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-walnut text-gold-500"><Icon name={f.icon ?? 'leaf'} /></span>
                  <span className="mt-3 block font-semibold text-cream">{f.title}</span>
                  <span className="mt-1 block text-sm text-muted">{f.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {products.length > 0 && (
        <section className="container-x py-10">
          <SectionHeading title={t.departments.products} />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:gap-5">
            {products.map((p) => <ProductCard key={p.id} product={p} locale={locale} />)}
          </div>
        </section>
      )}

      {d.faqs && d.faqs.length > 0 && <FAQ locale={locale} faqs={d.faqs} />}
    </>
  )
}
