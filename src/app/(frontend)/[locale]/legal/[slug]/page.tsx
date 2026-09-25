import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RichText } from '@/components/RichText'
import { Breadcrumbs } from '@/components/ui'
import { getDictionary } from '@/i18n'
import { isLocale } from '@/i18n/config'
import { formatDate } from '@/lib/format'
import { getLegalPage } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

// Rendered on first visit, then cached (ISR) and refreshed when content changes.
export async function generateStaticParams() {
  return []
}

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const page = await getLegalPage(slug, locale)
  if (!page) return {}
  return buildMetadata({ locale, path: `/legal/${page.slug}`, title: page.title })
}

export default async function LegalPage({ params }: Props) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const page = await getLegalPage(slug, locale)
  if (!page) notFound()
  const t = getDictionary(locale)
  return (
    <>
      <Breadcrumbs locale={locale} items={[{ name: page.title, path: `/legal/${page.slug}` }]} />
      <article className="container-x max-w-3xl py-8">
        <h1 className="text-4xl md:text-5xl">{page.title}</h1>
        <p className="mt-3 text-sm text-muted">{t.common.updated}: {formatDate(page.effectiveDate, locale)}</p>
        <RichText data={page.content} className="mt-8" />
      </article>
    </>
  )
}
