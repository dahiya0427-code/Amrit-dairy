import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ReviewsBlock } from '@/components/Reviews'
import { Breadcrumbs, PageHero } from '@/components/ui'
import { getDictionary } from '@/i18n'
import { isLocale } from '@/i18n/config'
import { getProducts, getTestimonials } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  return buildMetadata({ locale, path: '/reviews', title: t.reviews.pageTitle, description: t.reviews.pageIntro })
}

/** All approved customer reviews, plus a form to write one. */
export default async function ReviewsPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  const [reviews, products] = await Promise.all([getTestimonials(locale), getProducts(locale)])
  return (
    <>
      <PageHero title={t.reviews.pageTitle} intro={t.reviews.pageIntro} eyebrow={t.reviews.eyebrow} />
      <Breadcrumbs locale={locale} items={[{ name: t.reviews.pageTitle, path: '/reviews' }]} />
      <ReviewsBlock reviews={reviews} locale={locale} showProduct stacked products={products.map((p) => ({ id: p.id, title: p.title }))} />
    </>
  )
}
