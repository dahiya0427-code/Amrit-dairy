import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Icon } from '@/components/Icon'
import { getDictionary } from '@/i18n'
import { isLocale, localePath } from '@/i18n/config'
import { formatINR } from '@/lib/format'
import { orderWhatsappText } from '@/lib/orders'
import { getPayloadClient } from '@/lib/payload'
import { getSettings } from '@/lib/queries'
import { whatsappLink } from '@/lib/site'

type Props = { params: Promise<{ locale: string; number: string }>; searchParams: Promise<{ t?: string }> }

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { robots: { index: false, follow: false } }

export default async function OrderPage({ params, searchParams }: Props) {
  const { locale, number } = await params
  const { t: token } = await searchParams
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)

  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'orders', where: { orderNumber: { equals: number } }, limit: 1, depth: 0 })
  const order = docs[0]
  // Orders are private: the page needs the secret token from the confirmation link.
  if (!order || !token || order.accessToken !== token) {
    return (
      <section className="container-x py-20 text-center">
        <h1 className="text-3xl">{t.order.notFound}</h1>
        <Link href={localePath(locale, '/contact')} className="btn btn-primary mt-6">{t.nav.contact}</Link>
      </section>
    )
  }
  const settings = await getSettings(locale)
  const paid = order.paymentStatus === 'paid'

  return (
    <section className="container-x max-w-3xl py-12">
      <div className="rounded-lg bg-malai p-6 text-center md:p-10">
        <span className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${paid ? 'bg-success' : 'bg-gold-500'} text-white`}>
          <Icon name={paid ? 'check' : 'whatsapp'} size={32} />
        </span>
        <h1 className="mt-4 text-3xl md:text-4xl">{paid ? t.order.paidTitle : t.order.pendingTitle}</h1>
        <p className="mt-2 text-muted">{paid ? t.order.paidText : t.order.pendingText}</p>
        <p className="mt-4 text-lg">
          {t.order.number}: <strong className="tabular-nums">{order.orderNumber}</strong>
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          {!paid && (
            <a href={whatsappLink(settings.ordersPhone, orderWhatsappText(order))} target="_blank" rel="noopener" className="btn btn-whatsapp">
              <Icon name="whatsapp" /> {t.order.payOnWhatsapp}
            </a>
          )}
          <Link href={localePath(locale, '/shop')} className="btn btn-outline">{t.cart.continue}</Link>
        </div>
      </div>

      <h2 className="mb-3 mt-10 text-2xl">{t.order.items}</h2>
      <ul className="divide-y divide-line rounded-2xl border border-line bg-char">
        {(order.items ?? []).map((i) => (
          <li key={i.id} className="flex justify-between gap-4 p-4">
            <span>
              <span className="block font-semibold">{i.title}</span>
              <span className="text-sm text-muted">{i.variant} × {i.quantity}</span>
            </span>
            <span className="font-semibold tabular-nums">{formatINR(i.lineTotal)}</span>
          </li>
        ))}
        <li className="flex justify-between p-4 text-sm">
          <span>{t.cart.delivery}</span>
          <span className="tabular-nums">{order.deliveryFee ? formatINR(order.deliveryFee) : t.checkout.freeDelivery}</span>
        </li>
        <li className="flex justify-between p-4 text-lg font-bold">
          <span>{t.cart.total}</span>
          <span className="tabular-nums">{formatINR(order.total)}</span>
        </li>
      </ul>
    </section>
  )
}
