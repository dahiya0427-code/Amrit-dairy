import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getPayloadClient } from '@/lib/payload'
import { clientIp, rateLimit } from '@/lib/ratelimit'
import { SITE_URL } from '@/lib/site'
import { teamEmailHtml, teamEmails } from '@/lib/notify'

const schema = z.object({
  locale: z.enum(['en', 'hi']).default('en'),
  website: z.string().optional(), // honeypot
  rating: z.number().int().min(1).max(5),
  name: z.string().trim().min(2).max(60),
  locality: z.string().trim().max(60).optional().or(z.literal('')),
  phone: z.string().trim().regex(/^(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/).optional().or(z.literal('')),
  quote: z.string().trim().min(10).max(1000),
  productId: z.number().int().positive().optional().nullable(),
})

/** A customer review from the site. Saved unapproved; the team approves it in the admin. */
export async function POST(req: Request) {
  if (!rateLimit(`review:${clientIp(req)}`, 3)) return NextResponse.json({ error: 'Too many requests. Please try again in a minute.' }, { status: 429 })
  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Please check your rating, name and review.' }, { status: 400 })
  const { website, locale, phone, productId, ...data } = parsed.data
  if (website) return NextResponse.json({ ok: true }) // bot

  const payload = await getPayloadClient()
  const product = productId ? await payload.findByID({ collection: 'products', id: productId, depth: 0, locale }).catch(() => null) : null
  // a verified buyer: the phone matches an order that went through
  const lastTen = phone ? phone.replace(/\D/g, '').slice(-10) : ''
  const verified = lastTen
    ? (await payload.count({ collection: 'orders', overrideAccess: true, where: { and: [{ phone: { contains: lastTen } }, { status: { not_in: ['cancelled', 'pending'] } }] } })).totalDocs > 0
    : false

  const review = await payload.create({
    collection: 'testimonials',
    locale,
    overrideAccess: true,
    data: { ...data, locality: data.locality || undefined, phone: phone || undefined, product: product?.id, approved: false, verified, source: 'website' },
  })

  try {
    const to = await teamEmails(payload)
    if (to.length) {
      await payload.sendEmail({
        to,
        subject: `New ${data.rating}★ review from ${data.name}${product ? ` · ${product.title}` : ''}`,
        html: teamEmailHtml({
          heading: '⭐ New customer review',
          intro: `${data.name} left a ${'★'.repeat(data.rating)}${'☆'.repeat(5 - data.rating)} review. It is <strong>not shown</strong> on the website until you approve it.`,
          buttons: [{ href: `${SITE_URL}/admin/collections/testimonials/${review.id}`, label: 'Review & approve', color: '#C9A24A' }],
          rows: [
            ['Name', data.name],
            ['City', data.locality],
            ['Phone', phone],
            ['Verified buyer', verified ? 'Yes (phone matches an order)' : 'No'],
            ['Product', product?.title ?? 'General'],
            ['Rating', `${data.rating} / 5`],
            ['Review', data.quote],
          ],
        }),
      })
    }
  } catch (err) {
    payload.logger.error({ err }, 'Review email failed')
  }
  return NextResponse.json({ ok: true })
}
