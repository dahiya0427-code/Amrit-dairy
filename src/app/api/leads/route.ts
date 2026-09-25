import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getPayloadClient } from '@/lib/payload'
import { clientIp, rateLimit } from '@/lib/ratelimit'

const schema = z.object({
  type: z.enum(['contact', 'bulk', 'subscription', 'cow', 'notify', 'waitlist']),
  name: z.string().trim().max(100).optional(),
  phone: z.string().trim().regex(/^(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/).optional().or(z.literal('')),
  email: z.string().trim().email().max(120).optional().or(z.literal('')),
  pincode: z.string().trim().regex(/^[1-9][0-9]{5}$/).optional().or(z.literal('')),
  product: z.string().trim().max(200).optional(),
  quantity: z.string().trim().max(60).optional(),
  message: z.string().trim().max(3000).optional(),
  website: z.string().optional(), // honeypot
  locale: z.enum(['en', 'hi']).optional(),
  sourcePage: z.string().max(200).optional(),
})

const labels: Record<string, string> = {
  contact: 'Contact form',
  bulk: 'Bulk order request',
  subscription: 'Milk subscription request',
  cow: 'Cow buy/sell enquiry',
  notify: 'Notify-me request',
  waitlist: 'Area waitlist',
}

const esc = (v: unknown) => String(v ?? '').replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)

export async function POST(req: Request) {
  if (!rateLimit(`lead:${clientIp(req)}`, 6)) return NextResponse.json({ error: 'Too many requests. Please try again in a minute.' }, { status: 429 })
  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Please check the phone number, email and pincode.' }, { status: 400 })
  const { website, ...data } = parsed.data
  if (website) return NextResponse.json({ ok: true }) // bot
  if (!data.phone && !data.email) return NextResponse.json({ error: 'Please add a phone number or email.' }, { status: 400 })

  const payload = await getPayloadClient()
  const lead = await payload.create({
    collection: 'leads',
    data: { ...data, email: data.email || undefined, phone: data.phone || undefined, pincode: data.pincode || undefined },
  })

  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  const to = process.env.ORDER_NOTIFY_EMAIL || settings.email
  const rows = Object.entries(data)
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#5A554D">${esc(k)}</td><td style="padding:4px 0;white-space:pre-wrap">${esc(v)}</td></tr>`)
    .join('')
  try {
    await payload.sendEmail({ to, subject: `${labels[data.type]} · ${data.name || data.phone || data.email}`, html: `<h2>${labels[data.type]}</h2><table>${rows}</table><p>Lead #${lead.id}</p>` })
  } catch (err) {
    payload.logger.error({ err }, 'Lead email failed')
  }
  return NextResponse.json({ ok: true })
}
