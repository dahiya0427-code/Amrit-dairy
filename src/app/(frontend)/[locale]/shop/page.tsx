import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ShopView } from '@/components/ShopView'
import { getDictionary } from '@/i18n'
import { isLocale } from '@/i18n/config'
import { getCategories, getProducts, getSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

// Filter chips use the URL query (?type=…), so the listing renders per request.
export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ type?: string }> }

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params
  const { type } = await searchParams
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  return buildMetadata({ locale, path: '/shop', title: t.shop.title, description: t.shop.intro, noIndex: Boolean(type) })
}

export default async function ShopPage({ params, searchParams }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const { type } = await searchParams
  const fulfilment = type === 'local' || type === 'ship' ? type : undefined
  const [categories, products, settings] = await Promise.all([getCategories(locale), getProducts(locale, { fulfilment }), getSettings(locale)])
  return <ShopView locale={locale} categories={categories} products={products} type={fulfilment} whatsapp={settings.ordersPhone} />
}
