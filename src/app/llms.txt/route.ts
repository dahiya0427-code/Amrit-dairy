import { getPayloadClient } from '@/lib/payload'
import { SITE_URL } from '@/lib/site'
import { formatINR } from '@/lib/format'
import { minPrice } from '@/lib/product'

// Generated per request (cached by the CDN below) so builds never need the database.
export const dynamic = 'force-dynamic'

/** llms.txt: a plain summary for AI answer engines (Doc 04 §6.5). */
export async function GET() {
  const payload = await getPayloadClient()
  const [settings, products, areas, posts] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings', depth: 0 }),
    payload.find({ collection: 'products', limit: 100, depth: 0, sort: 'order' }),
    payload.find({ collection: 'service-areas', limit: 100, depth: 0 }),
    payload.find({ collection: 'posts', limit: 50, depth: 0, sort: '-publishedAt' }),
  ])
  const live = areas.docs.filter((a) => a.status === 'live').map((a) => a.name).join(', ')

  const body = `# Amrit Dairy (अमृत डेयरी), Sonipat

> Farm-owned desi cow dairy in Sonipat, Haryana, India. About 250 desi cows (Gir, Sahiwal, Tharparkar, Rathi, Kankrej) on its own farm near Anup Sports Village, Rajhbhaya, Garhi Brahmnan, Sonipat 131001. Sells hand-churned Bilona ghee, fresh desi cow milk, matka dahi, paneer, Rajasthani achar, honey and mustard oil online. Slogan: "Our cows are our own." / "हर घर अमृत, हर घर शुद्धता".

## Key facts
- Fresh delivery areas (Sonipat): ${live}
- Ships across India: ghee, achar, honey, mustard oil
- Orders / WhatsApp: ${settings.ordersPhone} · Cow buy/sell enquiry: ${settings.cowPhone} · Email: ${settings.email}
- GSTIN: ${settings.gstin} · FSSAI Lic. No.: ${settings.fssai} · Udyam: ${settings.udyam}
- English site: ${SITE_URL}/ · Hindi site: ${SITE_URL}/hi

## Products
${products.docs
  .map((p) => {
    const price = minPrice(p)
    return `- [${p.title}](${SITE_URL}/products/${p.slug}): ${price ? `from ${formatINR(price)}` : p.status === 'coming_soon' ? 'coming soon' : 'out of stock'}${p.shortDescription ? `. ${p.shortDescription}` : ''}`
  })
  .join('\n')}

## Pages
- [Farm story](${SITE_URL}/farm-story)
- [Desi cow breeds](${SITE_URL}/desi-cows)
- [About & facts](${SITE_URL}/about)
- [Delivery areas](${SITE_URL}/delivery)
- [Contact](${SITE_URL}/contact)

## Articles
${posts.docs.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.excerpt}`).join('\n')}
`
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } })
}
