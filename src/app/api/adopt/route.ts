import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getPayloadClient } from '@/lib/payload'
import { clientIp, rateLimit } from '@/lib/ratelimit'
import { SITE_URL, telLink, whatsappLink } from '@/lib/site'
import { formatINR } from '@/lib/format'
import { teamEmailHtml, teamEmails } from '@/lib/notify'

const schema = z.object({
  locale: z.enum(['en', 'hi']).default('en'),
  website: z.string().optional(), // honeypot
  consent: z.literal(true),
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(/^(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/),
  email: z.string().trim().email().max(120).optional().or(z.literal('')),
  city: z.string().trim().max(80).optional().or(z.literal('')),
  planId: z.number().int().positive(),
  cow: z.string().trim().max(60).optional().or(z.literal('')),
  isGift: z.boolean().default(false),
  giftFor: z.string().trim().max(100).optional().or(z.literal('')),
  occasion: z.string().trim().max(100).optional().or(z.literal('')),
  message: z.string().trim().max(1500).optional().or(z.literal('')),
})

const period = { month: '/ month', year: '/ year', once: 'one time' } as const

/** Adopt-a-cow sign-up: saved for the team (Admin → Farm → Cow adoptions) and emailed to them. */
export async function POST(req: Request) {
  if (!rateLimit(`adopt:${clientIp(req)}`, 3)) return NextResponse.json({ error: 'Too many requests. Please try again in a minute.' }, { status: 429 })
  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Please check your name, phone number and plan.' }, { status: 400 })
  const { website, locale, planId, name, phone, email, city, cow, isGift, giftFor, occasion, message } = parsed.data
  const data = { name, phone, email, city, cow, isGift, giftFor, occasion, message }
  if (website) return NextResponse.json({ ok: true }) // bot

  const payload = await getPayloadClient()
  const plan = await payload.findByID({ collection: 'adoption-plans', id: planId, depth: 0, locale: 'en' }).catch(() => null)
  if (!plan || !plan.active) return NextResponse.json({ error: 'Please choose a plan.' }, { status: 400 })
  const planText = `${plan.name} · ${formatINR(plan.price)} ${period[plan.period]}`

  const adoption = await payload.create({
    collection: 'adoptions',
    overrideAccess: true,
    data: {
      ...data,
      email: data.email || undefined,
      locale,
      plan: plan.id,
      planSnapshot: planText,
      cow: data.cow || 'Any cow',
    },
  })

  try {
    const to = await teamEmails(payload)
    if (to.length) {
      await payload.sendEmail({
        to,
        replyTo: data.email || undefined,
        subject: `Cow adoption · ${data.name} · ${planText}`,
        html: teamEmailHtml({
          heading: '🐄 New cow adoption',
          intro: `${data.name}${data.city ? ` from ${data.city}` : ''} wants to adopt a cow on the <strong>${planText}</strong> plan. Send them payment details and their cow’s first photo.`,
          buttons: [
            { href: telLink(data.phone), label: `📞 Call ${data.phone}` },
            { href: whatsappLink(data.phone, `Namaste ${data.name} ji, thank you for choosing gau seva with Amrit Dairy!`), label: 'WhatsApp', color: '#1f9d55' },
            { href: `${SITE_URL}/admin/collections/adoptions/${adoption.id}`, label: 'Open in admin', color: '#C9A24A' },
          ],
          rows: [
            ['Name', data.name],
            ['Phone', data.phone],
            ['Email', data.email],
            ['City', data.city],
            ['Plan', planText],
            ['Cow', data.cow || 'Any cow'],
            ['Gift', data.isGift ? `Yes${data.giftFor ? `, for ${data.giftFor}` : ''}${data.occasion ? ` (${data.occasion})` : ''}` : 'No'],
            ['Message', data.message],
          ],
        }),
      })
    }
  } catch (err) {
    payload.logger.error({ err }, 'Adoption email failed')
  }
  return NextResponse.json({ ok: true })
}
