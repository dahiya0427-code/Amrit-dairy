import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getPayloadClient } from '@/lib/payload'
import { CheckoutError, newAccessToken, newOrderNumber, priceCart, sendOrderEmails } from '@/lib/orders'
import { createRazorpayOrder, razorpayEnabled } from '@/lib/razorpay'
import { clientIp, rateLimit } from '@/lib/ratelimit'

const schema = z.object({
  locale: z.enum(['en', 'hi']).default('en'),
  couponCode: z.string().trim().max(30).optional(),
  items: z.array(z.object({ productId: z.number().int().positive(), sku: z.string().min(1).max(80), qty: z.number().int().min(1).max(20) })).min(1).max(30),
  customer: z.object({
    name: z.string().trim().min(2).max(100),
    phone: z.string().trim().regex(/^(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/),
    email: z.union([z.string().trim().email().max(120), z.literal('')]).optional(),
    address: z.string().trim().min(5).max(400),
    landmark: z.string().trim().max(150).optional(),
    city: z.string().trim().min(2).max(80),
    state: z.string().trim().min(2).max(80),
    pincode: z.string().trim().regex(/^[1-9][0-9]{5}$/),
    notes: z.string().trim().max(500).optional(),
  }),
})

export async function POST(req: Request) {
  if (!rateLimit(`checkout:${clientIp(req)}`, 10)) return NextResponse.json({ error: 'Too many attempts. Please wait a minute.' }, { status: 429 })

  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Please check your details.', issues: parsed.error.issues.map((i) => i.path.join('.')) }, { status: 400 })
  const { items, customer, locale, couponCode } = parsed.data

  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })

  try {
    const priced = await priceCart(payload, items, customer.pincode, settings, { couponCode: couponCode || undefined, phone: customer.phone, locale })
    const orderNumber = newOrderNumber()
    const accessToken = newAccessToken()
    const online = razorpayEnabled()

    const order = await payload.create({
      collection: 'orders',
      data: {
        orderNumber,
        accessToken,
        locale,
        status: 'pending',
        paymentStatus: 'unpaid',
        paymentMethod: online ? 'razorpay' : 'whatsapp',
        deliveryType: priced.deliveryType,
        items: priced.lines.map((l) => ({
          product: l.product.id,
          title: l.product.title,
          variant: l.variant,
          sku: l.sku,
          quantity: l.qty,
          unitPrice: l.unitPrice,
          lineTotal: l.lineTotal,
        })),
        subtotal: priced.subtotal,
        discount: priced.discount,
        couponCode: priced.coupon?.code,
        deliveryFee: priced.deliveryFee,
        total: priced.total,
        customer: { ...customer, email: customer.email || undefined },
      },
    })

    if (!online) {
      await sendOrderEmails(payload, order, settings)
      return NextResponse.json({ mode: 'whatsapp', orderNumber, token: accessToken })
    }

    const rzp = await createRazorpayOrder(priced.total, orderNumber, { orderNumber, phone: customer.phone })
    await payload.update({ collection: 'orders', id: order.id, data: { razorpay: { orderId: rzp.id } } })
    return NextResponse.json({
      mode: 'razorpay',
      orderNumber,
      token: accessToken,
      keyId: process.env.RAZORPAY_KEY_ID,
      razorpayOrderId: rzp.id,
      amount: rzp.amount,
      customer: { name: customer.name, email: customer.email, phone: customer.phone },
    })
  } catch (err) {
    if (err instanceof CheckoutError) return NextResponse.json({ error: err.message, code: err.code, reason: err.reason, min: err.min }, { status: 422 })
    payload.logger.error({ err }, 'Checkout failed')
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
