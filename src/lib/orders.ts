import 'server-only'
import crypto from 'crypto'
import type { Payload } from 'payload'
import type { Coupon, Order, Product, SiteSetting } from '@/payload-types'
import { formatINR } from './format'
import { applyOffers } from './offers'
import { SITE_URL, whatsappLink } from './site'

export type CartLine = { productId: number; sku: string; qty: number }

export type PricedLine = { product: Product; sku: string; variant: string; qty: number; unitPrice: number; lineTotal: number }

export type AppliedCoupon = { code: string; description: string | null; discount: number; freeDelivery: boolean }

export type PricedCart = {
  lines: PricedLine[]
  subtotal: number
  discount: number
  coupon: AppliedCoupon | null
  deliveryFee: number
  total: number
  deliveryType: 'local' | 'ship'
}

/** Why a coupon was refused; the site shows a translated message for each. */
export type CouponReason = 'not_found' | 'not_started' | 'expired' | 'used_up' | 'already_used' | 'min_order' | 'no_items'

export class CheckoutError extends Error {
  constructor(
    public code: 'empty' | 'unavailable' | 'not_serviceable' | 'invalid' | 'coupon',
    message: string,
    public reason?: CouponReason,
    public min?: number,
  ) {
    super(message)
  }
}

const couponError = (reason: CouponReason, message: string, min?: number) => new CheckoutError('coupon', message, reason, min)

/** Offers that are switched on (dates are checked when they are applied). */
export async function activeOffers(payload: Payload) {
  return (await payload.find({ collection: 'offers', where: { active: { equals: true } }, limit: 200, depth: 0, locale: 'en', pagination: false })).docs
}

const lastTen = (phone: string) => phone.replace(/\D/g, '').slice(-10)

/** Orders that count as a use of a code: not cancelled, and paid unless it was a WhatsApp order. */
async function couponUses(payload: Payload, code: string, phone?: string) {
  const and: Record<string, unknown>[] = [
    { couponCode: { equals: code } },
    { status: { not_in: ['cancelled', 'refunded'] } },
    { or: [{ paymentStatus: { equals: 'paid' } }, { paymentMethod: { equals: 'whatsapp' } }] },
  ]
  if (phone) and.push({ phone: { contains: lastTen(phone) } })
  return (await payload.count({ collection: 'orders', where: { and } as never })).totalDocs
}

/** Finds a code and checks its dates and usage limits. */
export async function findCoupon(payload: Payload, rawCode: string, phone?: string, locale: 'en' | 'hi' = 'en'): Promise<Coupon> {
  const code = rawCode.trim().toUpperCase().replace(/\s+/g, '')
  if (!code) throw couponError('not_found', 'Enter a coupon code')
  const { docs } = await payload.find({ collection: 'coupons', where: { code: { equals: code } }, limit: 1, depth: 0, locale })
  const c = docs[0]
  const now = new Date()
  if (!c || !c.active) throw couponError('not_found', 'This coupon code is not valid')
  if (c.startsAt && new Date(c.startsAt) > now) throw couponError('not_started', 'This coupon is not active yet')
  if (c.endsAt && new Date(c.endsAt) <= now) throw couponError('expired', 'This coupon has expired')
  if (c.usageLimit && (await couponUses(payload, c.code)) >= c.usageLimit) throw couponError('used_up', 'This coupon has been fully used')
  if (phone && c.perCustomerLimit && (await couponUses(payload, c.code, phone)) >= c.perCustomerLimit) {
    throw couponError('already_used', 'You have already used this coupon')
  }
  return c
}

const idOf = (v: unknown) => (typeof v === 'object' && v !== null ? (v as { id: number }).id : (v as number))

/** Works out a coupon's discount on the priced lines (whole rupees). */
export function couponDiscount(c: Coupon, lines: PricedLine[], subtotal: number): AppliedCoupon {
  if (c.minOrder && subtotal < c.minOrder) throw couponError('min_order', `Add items worth ${formatINR(c.minOrder)} to use this coupon`, c.minOrder)
  const matches = (p: Product) =>
    c.appliesTo === 'products'
      ? (c.products ?? []).some((x) => idOf(x) === p.id)
      : c.appliesTo === 'categories'
        ? (c.categories ?? []).some((x) => idOf(x) === idOf(p.category))
        : true
  const eligible = lines.filter((l) => matches(l.product)).reduce((n, l) => n + l.lineTotal, 0)
  if (!eligible) throw couponError('no_items', 'This coupon does not apply to the items in your cart')
  let discount = 0
  if (c.type === 'percent') discount = Math.round((eligible * (c.value ?? 0)) / 100)
  if (c.type === 'flat') discount = c.value ?? 0
  if (c.maxDiscount && c.type === 'percent') discount = Math.min(discount, c.maxDiscount)
  // always leave at least ₹1 to pay
  discount = Math.max(0, Math.min(discount, eligible, subtotal - 1))
  return { code: c.code, description: c.description ?? null, discount, freeDelivery: c.type === 'free_delivery' }
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
export async function priceCart(
  payload: Payload,
  items: CartLine[],
  pincode: string,
  settings: SiteSetting,
  opts: { couponCode?: string; phone?: string; locale?: 'en' | 'hi'; /** coupon preview: don't block on the delivery area yet */ preview?: boolean } = {},
): Promise<PricedCart> {
  if (!items.length) throw new CheckoutError('empty', 'Cart is empty')
  if (items.length > 30) throw new CheckoutError('invalid', 'Too many items')

  const ids = [...new Set(items.map((i) => i.productId))]
  const found = await payload.find({ collection: 'products', where: { id: { in: ids } }, limit: ids.length, depth: 0, locale: 'en' })
  const offers = await activeOffers(payload)
  const docs = found.docs.map((d) => applyOffers(d, offers))

  const lines: PricedCart['lines'] = []
  for (const item of items) {
    const qty = Math.floor(Number(item.qty))
    if (!Number.isFinite(qty) || qty < 1 || qty > 20) throw new CheckoutError('invalid', 'Invalid quantity')
    const product = docs.find((d) => d.id === item.productId)
    const variant = product?.variants?.find((v) => v.sku === item.sku)
    if (!product || !variant || product.status !== 'active' || variant.onDemand || variant.inStock === false || !variant.price || variant.price <= 0) {
      throw new CheckoutError('unavailable', `${product?.title ?? 'A product'} is not available right now`)
    }
    if (typeof variant.stock === 'number' && qty > variant.stock) {
      throw new CheckoutError('unavailable', variant.stock > 0 ? `Only ${variant.stock} left of ${product.title} (${variant.label})` : `${product.title} is sold out`)
    }
    lines.push({ product, sku: variant.sku, variant: variant.label, qty, unitPrice: variant.price, lineTotal: variant.price * qty })
  }

  const hasFresh = lines.some((l) => l.product.fulfilment === 'local')
  const live = await livePincodes(payload)
  const isLocal = live.has(pincode)
  if (hasFresh && !isLocal && !opts.preview) {
    throw new CheckoutError('not_serviceable', 'Fresh products are not delivered to this pincode yet')
  }

  const subtotal = lines.reduce((n, l) => n + l.lineTotal, 0)
  const coupon = opts.couponCode ? couponDiscount(await findCoupon(payload, opts.couponCode, opts.phone, opts.locale), lines, subtotal) : null
  const discount = coupon?.discount ?? 0
  const threshold = settings.freeDeliveryThreshold ?? 0
  const fee = isLocal ? (settings.localDeliveryFee ?? 0) : (settings.shippingFee ?? 0)
  const deliveryFee = coupon?.freeDelivery || (threshold && subtotal >= threshold) ? 0 : fee
  return { lines, subtotal, discount, coupon, deliveryFee, total: subtotal - discount + deliveryFee, deliveryType: isLocal ? 'local' : 'ship' }
}

export const newOrderNumber = () => `AD${Date.now().toString().slice(-7)}${crypto.randomInt(10, 99)}`
export const newAccessToken = () => crypto.randomBytes(18).toString('base64url')

export function orderWhatsappText(order: Pick<Order, 'orderNumber' | 'items' | 'total' | 'customer' | 'discount' | 'couponCode'>) {
  const items = (order.items ?? []).map((i) => `• ${i.title} (${i.variant}) × ${i.quantity}`).join('\n')
  const coupon = order.discount ? `\nCoupon ${order.couponCode}: −${formatINR(order.discount)}` : ''
  return `Hi Amrit Dairy, I placed order ${order.orderNumber}.\n${items}${coupon}\nTotal: ${formatINR(order.total)}\nName: ${order.customer.name}\nPincode: ${order.customer.pincode}\nPlease share UPI details to pay.`
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
    <div style="background:#2B1B10;color:#C9A24A;padding:16px 20px;border-radius:16px 16px 0 0;font:600 22px Georgia,serif">Amrit Dairy · अमृत डेयरी</div>
    <div style="background:#fff;padding:20px;border-radius:0 0 16px 16px;border:1px solid #E6DCC6">
      <h1 style="font:600 20px Georgia,serif;color:#2B1B10;margin:0 0 8px">${esc(heading)}</h1>
      <p style="margin:0 0 16px">Order <strong>${order.orderNumber}</strong></p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">${rows}
        ${order.discount ? `<tr><td style="padding:6px 0;border-top:1px solid #E6DCC6">Coupon ${esc(order.couponCode)}</td><td style="padding:6px 0;border-top:1px solid #E6DCC6;text-align:right">− ${formatINR(order.discount)}</td></tr>` : ''}
        <tr><td style="padding:6px 0;border-top:1px solid #E6DCC6">Delivery</td><td style="padding:6px 0;border-top:1px solid #E6DCC6;text-align:right">${order.deliveryFee ? formatINR(order.deliveryFee) : 'Free'}</td></tr>
        <tr><td style="padding:6px 0;font-weight:700">Total</td><td style="padding:6px 0;text-align:right;font-weight:700">${formatINR(order.total)}</td></tr>
      </table>
      <p style="font-size:14px;margin:16px 0 0">Deliver to: ${esc(order.customer.name)}, ${esc(order.customer.address)}, ${esc(order.customer.city)} ${esc(order.customer.pincode)} · ${esc(order.customer.phone)}</p>
      <p style="margin:20px 0 0"><a href="${orderUrl(order)}" style="background:#C9A24A;color:#1E1C19;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:700">View your order</a></p>
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
