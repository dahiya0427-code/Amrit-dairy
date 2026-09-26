import 'server-only'
import crypto from 'crypto'
import type { Payload } from 'payload'
import type { Order, Product, SiteSetting } from '@/payload-types'
import { formatINR } from './format'
import { SITE_URL, whatsappLink } from './site'

export type CartLine = { productId: number; sku: string; qty: number }

export type PricedCart = {
  lines: { product: Product; sku: string; variant: string; qty: number; unitPrice: number; lineTotal: number }[]
  subtotal: number
  deliveryFee: number
  total: number
  deliveryType: 'local' | 'ship'
}

export class CheckoutError extends Error {
  constructor(public code: 'empty' | 'unavailable' | 'not_serviceable' | 'invalid', message: string) {
    super(message)
  }
}

/** Live service-area pincodes, from the Delivery areas collection. */
export async function livePincodes(payload: Payload): Promise<Set<string>> {
  const areas = await payload.find({ collection: 'service-areas', limit: 200, depth: 0, where: { status: { equals: 'live' } } })
  return new Set(areas.docs.flatMap((a) => a.pincodes.split(',').map((p) => p.trim())).filter(Boolean))
}

/**
 * Re-prices the cart from the database. Client prices are never trusted, and
 * inactive, on-demand or ₹0 variants are rejected.
 */
export async function priceCart(payload: Payload, items: CartLine[], pincode: string, settings: SiteSetting): Promise<PricedCart> {
  if (!items.length) throw new CheckoutError('empty', 'Cart is empty')
  if (items.length > 30) throw new CheckoutError('invalid', 'Too many items')

  const ids = [...new Set(items.map((i) => i.productId))]
  const { docs } = await payload.find({ collection: 'products', where: { id: { in: ids } }, limit: ids.length, depth: 0, locale: 'en' })

  const lines: PricedCart['lines'] = []
  for (const item of items) {
    const qty = Math.floor(Number(item.qty))
    if (!Number.isFinite(qty) || qty < 1 || qty > 20) throw new CheckoutError('invalid', 'Invalid quantity')
    const product = docs.find((d) => d.id === item.productId)
    const variant = product?.variants?.find((v) => v.sku === item.sku)
    if (!product || !variant || product.status !== 'active' || variant.onDemand || variant.inStock === false || !variant.price || variant.price <= 0) {
      throw new CheckoutError('unavailable', `${product?.title ?? 'A product'} is not available right now`)
    }
    lines.push({ product, sku: variant.sku, variant: variant.label, qty, unitPrice: variant.price, lineTotal: variant.price * qty })
  }

  const hasFresh = lines.some((l) => l.product.fulfilment === 'local')
  const live = await livePincodes(payload)
  const isLocal = live.has(pincode)
  if (hasFresh && !isLocal) {
    throw new CheckoutError('not_serviceable', 'Fresh products are not delivered to this pincode yet')
  }

  const subtotal = lines.reduce((n, l) => n + l.lineTotal, 0)
  const threshold = settings.freeDeliveryThreshold ?? 0
  const fee = isLocal ? (settings.localDeliveryFee ?? 0) : (settings.shippingFee ?? 0)
  const deliveryFee = threshold && subtotal >= threshold ? 0 : fee
  return { lines, subtotal, deliveryFee, total: subtotal + deliveryFee, deliveryType: isLocal ? 'local' : 'ship' }
}

export const newOrderNumber = () => `AD${Date.now().toString().slice(-7)}${crypto.randomInt(10, 99)}`
export const newAccessToken = () => crypto.randomBytes(18).toString('base64url')

export function orderWhatsappText(order: Pick<Order, 'orderNumber' | 'items' | 'total' | 'customer'>) {
  const items = (order.items ?? []).map((i) => `• ${i.title} (${i.variant}) × ${i.quantity}`).join('\n')
  return `Hi Amrit Dairy, I placed order ${order.orderNumber}.\n${items}\nTotal: ${formatINR(order.total)}\nName: ${order.customer.name}\nPincode: ${order.customer.pincode}\nPlease share UPI details to pay.`
}

export const orderUrl = (o: Pick<Order, 'orderNumber' | 'accessToken' | 'locale'>) =>
  `${SITE_URL}${o.locale === 'hi' ? '/hi' : ''}/order/${o.orderNumber}?t=${o.accessToken}`

const esc = (v: unknown) =>
  String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string)

function orderEmailHtml(order: Order, heading: string) {
  const rows = (order.items ?? [])
    .map((i) => `<tr><td style="padding:6px 0">${esc(i.title)} <span style="color:#5A554D">(${esc(i.variant)})</span> × ${i.quantity}</td><td style="padding:6px 0;text-align:right">${formatINR(i.lineTotal)}</td></tr>`)
    .join('')
  return `<!doctype html><html><body style="margin:0;background:#FFFDF7;font-family:Arial,sans-serif;color:#1E1C19">
  <div style="max-width:560px;margin:0 auto;padding:24px">
    <div style="background:#4A2E1C;color:#C8962E;padding:16px 20px;border-radius:16px 16px 0 0;font:600 22px Georgia,serif">Amrit Dairy · अमृत डेयरी</div>
    <div style="background:#fff;padding:20px;border-radius:0 0 16px 16px;border:1px solid #E6DCC6">
      <h1 style="font:600 20px Georgia,serif;color:#4A2E1C;margin:0 0 8px">${esc(heading)}</h1>
      <p style="margin:0 0 16px">Order <strong>${order.orderNumber}</strong></p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">${rows}
        <tr><td style="padding:6px 0;border-top:1px solid #E6DCC6">Delivery</td><td style="padding:6px 0;border-top:1px solid #E6DCC6;text-align:right">${order.deliveryFee ? formatINR(order.deliveryFee) : 'Free'}</td></tr>
        <tr><td style="padding:6px 0;font-weight:700">Total</td><td style="padding:6px 0;text-align:right;font-weight:700">${formatINR(order.total)}</td></tr>
      </table>
      <p style="font-size:14px;margin:16px 0 0">Deliver to: ${esc(order.customer.name)}, ${esc(order.customer.address)}, ${esc(order.customer.city)} ${esc(order.customer.pincode)} · ${esc(order.customer.phone)}</p>
      <p style="margin:20px 0 0"><a href="${orderUrl(order)}" style="background:#C8962E;color:#1E1C19;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:700">View your order</a></p>
      <p style="font-size:13px;color:#5A554D;margin:20px 0 0">Questions? WhatsApp us: ${whatsappLink('+91 77000 04877')}</p>
    </div>
  </div></body></html>`
}

/** Customer + staff emails via Resend (or console when email isn't configured). */
export async function sendOrderEmails(payload: Payload, order: Order, settings: SiteSetting) {
  const heading = order.paymentStatus === 'paid' ? 'Your order is confirmed ✅' : 'We received your order'
  const staff = process.env.ORDER_NOTIFY_EMAIL || settings.email
  const jobs: Promise<unknown>[] = []
  if (order.customer.email) {
    jobs.push(payload.sendEmail({ to: order.customer.email, subject: `Amrit Dairy order ${order.orderNumber}`, html: orderEmailHtml(order, heading) }))
  }
  if (staff) {
    jobs.push(
      payload.sendEmail({
        to: staff,
        subject: `New order ${order.orderNumber} · ${formatINR(order.total)} · ${order.paymentStatus}`,
        html: orderEmailHtml(order, `New ${order.paymentStatus} order from ${order.customer.name}`),
      }),
    )
  }
  const results = await Promise.allSettled(jobs)
  results.forEach((r) => r.status === 'rejected' && payload.logger.error({ err: r.reason }, 'Order email failed'))
}

/** Idempotent: marks an order paid once, then sends emails. */
export async function markOrderPaid(payload: Payload, orderId: number, paymentId: string, settings: SiteSetting) {
  const order = await payload.findByID({ collection: 'orders', id: orderId, depth: 0 })
  if (order.paymentStatus === 'paid') return order
  const updated = await payload.update({
    collection: 'orders',
    id: orderId,
    data: { paymentStatus: 'paid', status: 'confirmed', razorpay: { ...order.razorpay, paymentId } },
  })
  await sendOrderEmails(payload, updated, settings)
  return updated
}
