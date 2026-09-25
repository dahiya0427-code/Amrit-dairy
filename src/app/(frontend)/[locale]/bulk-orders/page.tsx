import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LeadForm } from '@/components/LeadForm'
import { Breadcrumbs, PageHero } from '@/components/ui'
import { getDictionary } from '@/i18n'
import { isLocale } from '@/i18n/config'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  return buildMetadata({ locale, path: '/bulk-orders', title: t.bulk.title, description: t.bulk.intro })
}

export default async function BulkPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  return (
    <>
      <PageHero title={t.bulk.title} intro={t.bulk.intro} />
      <Breadcrumbs locale={locale} items={[{ name: t.bulk.title, path: '/bulk-orders' }]} />
      <section className="container-x max-w-3xl py-10">
        <div className="rounded-3xl border border-line bg-white p-6">
          <LeadForm type="bulk" submitLabel={t.common.requestBulk} />
        </div>
      </section>
    </>
  )
}
