import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getPayloadClient } from '@/lib/payload'
import { markOrderPaid } from '@/lib/orders'
import { verifyPaymentSignature } from '@/lib/razorpay'

const schema = z.object({
  orderNumber: z.string().max(40),
  token: z.string().max(80),
  razorpay_order_id: z.string().max(80),
  razorpay_payment_id: z.string().max(80),
  razorpay_signature: z.string().max(200),
})

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  const d = parsed.data

  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'orders', where: { orderNumber: { equals: d.orderNumber } }, limit: 1, depth: 0 })
  const order = docs[0]
  if (!order || order.accessToken !== d.token || order.razorpay?.orderId !== d.razorpay_order_id) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }
  if (!verifyPaymentSignature(d.razorpay_order_id, d.razorpay_payment_id, d.razorpay_signature)) {
    await payload.update({ collection: 'orders', id: order.id, data: { paymentStatus: 'failed' } })
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
  }
  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  await markOrderPaid(payload, order.id, d.razorpay_payment_id, settings)
  return NextResponse.json({ ok: true })
}
