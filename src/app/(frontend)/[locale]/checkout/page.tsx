import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CheckoutForm } from '@/components/CheckoutForm'
import { getDictionary } from '@/i18n'
import { isLocale } from '@/i18n/config'
import { getServiceAreas, getSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return buildMetadata({ locale, path: '/checkout', title: getDictionary(locale).checkout.title, noIndex: true })
}

export default async function CheckoutPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const [settings, areas] = await Promise.all([getSettings(locale), getServiceAreas(locale)])
  const livePincodes = [...new Set(areas.filter((a) => a.status === 'live').flatMap((a) => a.pincodes.split(',').map((p) => p.trim())))]
  return (
    <CheckoutForm
      whatsapp={settings.ordersPhone}
      onlinePayments={Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)}
      livePincodes={livePincodes}
      fees={{ threshold: settings.freeDeliveryThreshold ?? 0, local: settings.localDeliveryFee ?? 0, ship: settings.shippingFee ?? 0 }}
    />
  )
}
