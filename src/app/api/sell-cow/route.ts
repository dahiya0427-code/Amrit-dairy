import { NextResponse } from 'next/server'
import { z } from 'zod'
import type { CowOffer } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload'
import { clientIp, rateLimit } from '@/lib/ratelimit'
import { SITE_URL, telLink, whatsappLink } from '@/lib/site'
import { formatINR } from '@/lib/format'
import { CALF, LABELS, MAX_PHOTOS, MAX_VIDEOS, MILKING_STATUS, TRANSPORT, VACCINES, YES_NO_UNKNOWN } from '@/lib/cow-offer'
import { isComplete, readFileRange, removeAbandonedUploads } from '@/lib/cow-offer-server'
import { teamEmails } from '@/lib/notify'

const phone = z.string().trim().regex(/^(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/)
const text = (max: number) => z.string().trim().max(max).optional().or(z.literal(''))
const num = (min: number, max: number) => z.number().min(min).max(max).optional().nullable()

const schema = z.object({
  locale: z.enum(['en', 'hi']).default('en'),
  website: z.string().optional(), // honeypot
  consent: z.literal(true),
  uploads: z.array(z.string().regex(/^[a-z0-9-]{16,64}$/i)).max(MAX_PHOTOS + MAX_VIDEOS).default([]),
  seller: z.object({
    name: z.string().trim().min(2).max(100),
    phone,
    whatsapp: phone.optional().or(z.literal('')),
    email: z.string().trim().email().max(120).optional().or(z.literal('')),
    village: z.string().trim().min(2).max(100),
    district: text(80),
    state: text(80),
    pincode: z.string().trim().regex(/^[1-9][0-9]{5}$/).optional().or(z.literal('')),
  }),
  cow: z.object({
    breed: z.string().trim().min(2).max(60),
    breedOther: text(60),
    ageYears: num(0, 30),
    calvings: num(0, 20),
    milkingStatus: z.enum(MILKING_STATUS),
    milkPerDay: num(0, 80),
    lastCalving: text(40),
    pregnant: z.enum(YES_NO_UNKNOWN).optional(),
    pregnantMonths: num(1, 10),
    calf: z.enum(CALF).optional(),
    colour: text(60),
    tagNumber: text(60),
    papers: z.enum(YES_NO_UNKNOWN).optional(),
  }),
  health: z.object({
    vaccinations: z.array(z.enum(VACCINES)).max(VACCINES.length).default([]),
    dewormed: z.enum(YES_NO_UNKNOWN).optional(),
    notes: text(1500),
  }),
  sale: z.object({
    expectedPrice: num(0, 10_000_000),
    negotiable: z.boolean().default(false),
    availableFrom: text(40),
    transport: z.enum(TRANSPORT).optional(),
    reason: text(800),
  }),
  notes: text(2000),
})

const esc = (v: unknown) => String(v ?? '').replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)
const ATTACH_LIMIT = 18 * 1024 * 1024 // stay under the email size limit

function emailHtml(offer: CowOffer, photos: number, videos: number) {
  const s = offer.seller
  const c = offer.cow
  const h = offer.health
  const sale = offer.sale
  const yn = (v?: string | null) => (v ? LABELS.yesNo[v as keyof typeof LABELS.yesNo] : '')
  const rows: [string, unknown][] = [
    ['Seller', s.name],
    ['Phone', s.phone],
    ['WhatsApp', s.whatsapp],
    ['Email', s.email],
    ['Place', [s.village, s.district, s.state, s.pincode].filter(Boolean).join(', ')],
    ['Breed', c.breed === 'other' ? c.breedOther || 'Other' : c.breed],
    ['Age', c.ageYears != null ? `${c.ageYears} years` : ''],
    ['Calvings', c.calvings],
    ['Milking', c.milkingStatus ? LABELS.milkingStatus[c.milkingStatus] : ''],
    ['Milk per day', c.milkPerDay != null ? `${c.milkPerDay} litres` : ''],
    ['Last calving', c.lastCalving],
    ['Pregnant', [yn(c.pregnant), c.pregnantMonths ? `${c.pregnantMonths} months` : ''].filter(Boolean).join(', ')],
    ['Calf with her', c.calf ? LABELS.calf[c.calf] : ''],
    ['Colour', c.colour],
    ['Ear tag / ID', c.tagNumber],
    ['Papers', yn(c.papers)],
    ['Vaccinations', (h?.vaccinations ?? []).map((v) => LABELS.vaccines[v]).join(', ')],
    ['Dewormed', yn(h?.dewormed)],
    ['Health notes', h?.notes],
    ['Expected price', sale?.expectedPrice ? `${formatINR(sale.expectedPrice)}${sale.negotiable ? ' (negotiable)' : ''}` : ''],
    ['Available from', sale?.availableFrom],
    ['Transport', sale?.transport ? LABELS.transport[sale.transport] : ''],
    ['Reason for selling', sale?.reason],
    ['Other notes', offer.notes],
  ]
  const table = rows
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `<tr><td style="padding:6px 14px 6px 0;color:#5A554D;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:6px 0;white-space:pre-wrap">${esc(v)}</td></tr>`)
    .join('')
  const adminUrl = `${SITE_URL}/admin/collections/cow-offers/${offer.id}`
  const btn = (href: string, label: string, bg: string) =>
    `<a href="${esc(href)}" style="display:inline-block;margin:0 8px 8px 0;background:${bg};color:#fff;padding:10px 16px;border-radius:999px;text-decoration:none;font-weight:700">${label}</a>`
  return `<!doctype html><html><body style="margin:0;background:#FFFDF7;font-family:Arial,sans-serif;color:#1E1C19">
  <div style="max-width:620px;margin:0 auto;padding:24px">
    <div style="background:#2B1B10;color:#C9A24A;padding:16px 20px;border-radius:16px 16px 0 0;font:600 22px Georgia,serif">🐄 New cow offered for sale</div>
    <div style="background:#fff;padding:20px;border-radius:0 0 16px 16px;border:1px solid #E6DCC6">
      <p style="margin:0 0 14px">${esc(s.name)} from ${esc(s.village)} wants to sell a <strong>${esc(c.breed === 'other' ? c.breedOther || 'cow' : c.breed)}</strong> cow.</p>
      <p style="margin:0 0 14px">${btn(telLink(s.phone), `📞 Call ${esc(s.phone)}`, '#2B1B10')}${btn(whatsappLink(s.whatsapp || s.phone, `Namaste ${s.name} ji, Amrit Dairy se baat kar rahe hain, aapki gaay ke baare mein.`), 'WhatsApp', '#1f9d55')}${btn(adminUrl, 'Open in admin', '#C9A24A')}</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">${table}</table>
      <p style="margin:16px 0 0;font-size:14px">📷 ${photos} photo${photos === 1 ? '' : 's'} attached · 🎥 ${videos} video${videos === 1 ? '' : 's'}${videos ? ` (watch them in the admin: <a href="${esc(adminUrl)}">open offer</a>)` : ''}</p>
    </div>
  </div></body></html>`
}

/** Saves a "Sell your cow" offer with its photos/videos and emails the team. */
export async function POST(req: Request) {
  if (!rateLimit(`sell-cow:${clientIp(req)}`, 3)) return NextResponse.json({ error: 'Too many requests. Please try again in a minute.' }, { status: 429 })
  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Please check the highlighted details.', issues: parsed.error.issues.map((i) => i.path.join('.')) }, { status: 400 })
  const { website, uploads, locale, seller, cow, health, sale, notes } = parsed.data
  const data = { seller, cow, health, sale, notes }
  if (website) return NextResponse.json({ ok: true }) // bot

  const payload = await getPayloadClient()

  // the uploads must exist, be complete, and not belong to another offer
  const files = uploads.length
    ? (await payload.find({ collection: 'cow-offer-files', where: { uploadId: { in: uploads } }, limit: uploads.length, depth: 0, overrideAccess: true })).docs
    : []
  for (const f of files) {
    if (f.offer || !(await isComplete(payload, f))) return NextResponse.json({ error: 'A photo or video did not finish uploading. Please try again.' }, { status: 400 })
  }
  if (files.length !== uploads.length) return NextResponse.json({ error: 'A photo or video did not finish uploading. Please try again.' }, { status: 400 })
  if (files.filter((f) => f.kind === 'photo').length > MAX_PHOTOS || files.filter((f) => f.kind === 'video').length > MAX_VIDEOS) {
    return NextResponse.json({ error: 'Too many files.' }, { status: 400 })
  }

  const blank = (v?: string | null) => v || undefined
  const offer = await payload.create({
    collection: 'cow-offers',
    overrideAccess: true,
    data: {
      locale,
      seller: { ...data.seller, whatsapp: blank(data.seller.whatsapp), email: blank(data.seller.email), pincode: blank(data.seller.pincode) },
      cow: data.cow,
      health: data.health,
      sale: data.sale,
      notes: data.notes || undefined,
    },
  })
  for (const f of files) await payload.update({ collection: 'cow-offer-files', id: f.id, data: { offer: offer.id }, overrideAccess: true })

  // email the team, with the photos attached
  try {
    const photos = files.filter((f) => f.kind === 'photo')
    const attachments: { filename: string; content: Buffer }[] = []
    let total = 0
    for (const [i, f] of photos.entries()) {
      if (total + f.size > ATTACH_LIMIT) break
      attachments.push({ filename: `cow-photo-${i + 1}.${f.mimeType.split('/')[1] === 'jpeg' ? 'jpg' : f.mimeType.split('/')[1]}`, content: await readFileRange(payload, f) })
      total += f.size
    }
    const to = await teamEmails(payload)
    if (to.length) {
      await payload.sendEmail({
        to,
        replyTo: data.seller.email || undefined,
        subject: `Cow for sale · ${offer.title}${data.sale.expectedPrice ? ` · ${formatINR(data.sale.expectedPrice)}` : ''}`,
        html: emailHtml(offer, photos.length, files.length - photos.length),
        attachments,
      })
    }
  } catch (err) {
    payload.logger.error({ err }, 'Cow offer email failed')
  }

  removeAbandonedUploads(payload).catch(() => {})
  return NextResponse.json({ ok: true, id: offer.id })
}
