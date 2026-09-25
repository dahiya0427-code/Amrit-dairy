import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CartPageView } from '@/components/CartPageView'
import { getDictionary } from '@/i18n'
import { isLocale } from '@/i18n/config'
import { getSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return buildMetadata({ locale, path: '/cart', title: getDictionary(locale).cart.title, noIndex: true })
}

export default async function CartPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const settings = await getSettings(locale)
  return <CartPageView whatsapp={settings.ordersPhone} freeThreshold={settings.freeDeliveryThreshold ?? 0} />
}
