import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { markOrderPaid } from '@/lib/orders'
import { verifyWebhookSignature } from '@/lib/razorpay'

/** Backup confirmation if the customer closes the tab before the browser verifies. */
export async function POST(req: Request) {
  const raw = await req.text()
  const signature = req.headers.get('x-razorpay-signature') || ''
  if (!verifyWebhookSignature(raw, signature)) return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })

  const event = JSON.parse(raw) as {
    event: string
    payload?: { payment?: { entity?: { id: string; order_id: string } } }
  }
  const payment = event.payload?.payment?.entity
  if ((event.event === 'payment.captured' || event.event === 'order.paid') && payment?.order_id) {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({ collection: 'orders', where: { 'razorpay.orderId': { equals: payment.order_id } }, limit: 1, depth: 0 })
    if (docs[0]) {
      const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
      await markOrderPaid(payload, docs[0].id, payment.id, settings)
    }
  }
  return NextResponse.json({ ok: true })
}
