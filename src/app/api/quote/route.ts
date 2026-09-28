import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getPayloadClient } from '@/lib/payload'
import { CheckoutError, priceCart } from '@/lib/orders'
import { clientIp, rateLimit } from '@/lib/ratelimit'

const schema = z.object({
  code: z.string().trim().max(30).optional(),
  locale: z.enum(['en', 'hi']).default('en'),
  pincode: z.string().trim().regex(/^[1-9][0-9]{5}$/).optional().or(z.literal('')),
  phone: z.string().trim().max(20).optional(),
  items: z.array(z.object({ productId: z.number().int().positive(), sku: z.string().min(1).max(80), qty: z.number().int().min(1).max(20) })).min(1).max(30),
})

/** Prices the cart with live offers and, if given, a coupon code. Nothing is saved. */
export async function POST(req: Request) {
  if (!rateLimit(`quote:${clientIp(req)}`, 30)) return NextResponse.json({ error: 'Too many attempts. Please wait a minute.', reason: 'rate' }, { status: 429 })
  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request', reason: 'not_found' }, { status: 400 })
  const { code, locale, pincode, phone, items } = parsed.data

  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  try {
    const priced = await priceCart(payload, items, pincode || '000000', settings, { couponCode: code || undefined, phone: phone || undefined, locale, preview: true })
    return NextResponse.json({
      prices: Object.fromEntries(priced.lines.map((l) => [l.sku, l.unitPrice])),
      subtotal: priced.subtotal,
      coupon: priced.coupon && { code: priced.coupon.code, description: priced.coupon.description, discount: priced.coupon.discount, freeDelivery: priced.coupon.freeDelivery },
    })
  } catch (err) {
    if (err instanceof CheckoutError) return NextResponse.json({ error: err.message, code: err.code, reason: err.reason, min: err.min }, { status: 422 })
    payload.logger.error({ err }, 'Quote failed')
    return NextResponse.json({ error: 'Could not check the price', reason: 'error' }, { status: 500 })
  }
}
