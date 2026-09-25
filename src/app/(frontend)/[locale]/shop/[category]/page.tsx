import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ShopView } from '@/components/ShopView'
import { isLocale } from '@/i18n/config'
import { mediaUrl } from '@/lib/media'
import { getCategories, getCategory, getProducts, getSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

// Filter chips use the URL query (?type=…), so the listing renders per request.
export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ locale: string; category: string }>; searchParams: Promise<{ type?: string }> }

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale, category } = await params
  const { type } = await searchParams
  if (!isLocale(locale)) return {}
  const c = await getCategory(category, locale)
  if (!c) return {}
  return buildMetadata({
    locale,
    path: `/shop/${c.slug}`,
    title: c.meta?.title || c.title,
    description: c.meta?.description || c.intro,
    image: mediaUrl(c.image, 'card'),
    noIndex: Boolean(type),
  })
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { locale, category } = await params
  if (!isLocale(locale)) notFound()
  const { type } = await searchParams
  const active = await getCategory(category, locale)
  if (!active) notFound()
  const fulfilment = type === 'local' || type === 'ship' ? type : undefined
  const [categories, products, settings] = await Promise.all([
    getCategories(locale),
    getProducts(locale, { categoryId: active.id, fulfilment }),
    getSettings(locale),
  ])
  return <ShopView locale={locale} categories={categories} products={products} active={active} type={fulfilment} whatsapp={settings.ordersPhone} />
}
