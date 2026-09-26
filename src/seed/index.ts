/**
 * Seeds the database with Amrit Dairy's catalogue and starter content in
 * English and Hindi.
 *
 *   pnpm seed                  # only runs on an empty database
 *   SEED_FORCE=1 pnpm seed     # wipes seeded collections and seeds again
 */
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload, type CollectionSlug } from 'payload'
import config from '@payload-config'
import { categories, products } from './data/products'
import { breeds } from './data/breeds'
import { departments, facilities, deptBody, facBody } from './data/farm'
import { areas, faqs, legal, posts, ticker } from './data/content'
import { categoryExtras, extraFor } from './data/extras'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const MEDIA_DIR = path.resolve(dirname, '../../seed-media')

const payload = await getPayload({ config })
const log = (msg: string) => payload.logger.info(`[seed] ${msg}`)

const existing = await payload.count({ collection: 'products' })
if (existing.totalDocs > 0 && !process.env.SEED_FORCE) {
  log('Products already exist. Set SEED_FORCE=1 to wipe and re-seed.')
  process.exit(0)
}

if (process.env.SEED_FORCE) {
  const wipe: CollectionSlug[] = ['products', 'categories', 'breeds', 'facilities', 'departments', 'posts', 'ticker', 'faqs', 'legal-pages', 'service-areas', 'media']
  for (const collection of wipe) {
    await payload.delete({ collection, where: { id: { exists: true } } })
  }
  log('Wiped seeded collections')
}

// ── Admin user ────────────────────────────────────────────────
const users = await payload.count({ collection: 'users' })
if (users.totalDocs === 0) {
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  if (email && password) {
    await payload.create({ collection: 'users', data: { email, password, name: 'Amrit Dairy Admin', role: 'admin' } })
    log(`Created admin user ${email}`)
  } else {
    log('No SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD set: create the first admin at /admin')
  }
}

// ── Media (uploaded once per file) ────────────────────────────
const mediaCache = new Map<string, number>()
async function media(file: string, alt: { en: string; hi: string }) {
  const key = file
  if (mediaCache.has(key)) return mediaCache.get(key)!
  const doc = await payload.create({ collection: 'media', data: { alt: alt.en }, filePath: path.join(MEDIA_DIR, file), locale: 'en' })
  await payload.update({ collection: 'media', id: doc.id, data: { alt: alt.hi }, locale: 'hi' })
  mediaCache.set(key, doc.id)
  return doc.id
}

// ── Categories ────────────────────────────────────────────────
const categoryIds: Record<string, number> = {}
for (const c of categories) {
  const image = await media(c.image, { en: c.en.title, hi: c.hi.title })
  const cx = categoryExtras[c.slug]
  const bannerImage = cx ? await media(`cutouts/${cx.banner}`, { en: c.en.title, hi: c.hi.title }) : undefined
  const doc = await payload.create({
    collection: 'categories',
    locale: 'en',
    data: { slug: c.slug, order: c.order, image, bannerImage, ...c.en, tagline: cx?.en.tagline, pills: cx?.en.pills.map((text) => ({ text })) },
  })
  await payload.update({ collection: 'categories', id: doc.id, locale: 'hi', data: { ...c.hi, tagline: cx?.hi.tagline, pills: cx?.hi.pills.map((text) => ({ text })) } })
  categoryIds[c.slug] = doc.id
}
log(`Categories: ${categories.length}`)

// ── Products ──────────────────────────────────────────────────
const productIds: Record<string, number> = {}
for (const p of products) {
  const image = await media(p.image, {
    en: p.image.startsWith('placeholder') ? `${p.en.title} (photo coming soon)` : p.en.title,
    hi: p.image.startsWith('placeholder') ? `${p.hi.title} (फोटो जल्द)` : p.hi.title,
  })
  const ex = extraFor(p.slug, p.category)
  const cutout = ex?.cutout ? await media(`cutouts/${ex.cutout}`, { en: p.en.title, hi: p.hi.title }) : undefined
  const exLoc = (l?: NonNullable<typeof ex>['en']) => ({
    cardPoints: l?.cardPoints.map((text) => ({ text })),
    usage: l?.usage?.map((text) => ({ text })),
    benefits: l?.benefits?.map((text) => ({ text })),
    comparison: l?.comparison?.map(([ours, regular]) => ({ ours, regular })),
  })
  const mapLoc = (l: typeof p.en) => ({
    title: l.title,
    secondaryName: l.secondaryName,
    shortDescription: l.shortDescription,
    description: l.description,
    highlights: l.highlights?.map((text) => ({ text })),
    process: l.process,
    ingredients: l.ingredients,
    storage: l.storage,
    faqs: l.faqs,
  })
  const doc = await payload.create({
    collection: 'products',
    locale: 'en',
    data: {
      slug: p.slug,
      category: categoryIds[p.category],
      images: [image],
      status: p.status,
      fulfilment: p.fulfilment,
      badge: p.badge,
      featured: Boolean(p.featured),
      subscribable: Boolean(p.subscribable),
      order: p.order,
      cutout,
      badges: (ex?.badges ?? []) as never,
      storySlides: (ex?.storySlides ?? []) as never,
      ...exLoc(ex?.en),
      variants: p.variants.map((v) => ({
        sku: v.sku,
        label: v.label.en,
        price: v.price,
        weightGrams: v.weightGrams,
        onDemand: Boolean(v.onDemand),
        inStock: true,
        unitPriceLabel: v.unit?.en,
      })),
      ...mapLoc(p.en),
    },
  })
  await payload.update({
    collection: 'products',
    id: doc.id,
    locale: 'hi',
    data: {
      variants: (doc.variants ?? []).map((v, i) => ({ ...v, label: p.variants[i].label.hi, unitPriceLabel: p.variants[i].unit?.hi })),
      ...mapLoc(p.hi),
      ...exLoc(ex?.hi),
    },
  })
  productIds[p.slug] = doc.id
}
// Related: ghee ↔ honey, plus achars for the ghee page
await payload.update({
  collection: 'products',
  id: productIds['desi-cow-golden-ghee'],
  data: { relatedProducts: ['raw-forest-honey', 'ker-sangri-achar', 'kaccha-mango-achar', 'matka-dahi'].map((s) => productIds[s]) },
})
log(`Products: ${products.length}`)

// ── Breeds ────────────────────────────────────────────────────
for (const [i, b] of breeds.entries()) {
  const image = await media(`breeds/${b.slug}.jpg`, { en: `${b.en[0]} cow`, hi: `${b.hi[0]} गाय` })
  const loc = (x: typeof b.en) => ({ name: x[0], origin: x[1], summary: x[2], traits: x[3].map((text) => ({ text })) })
  const doc = await payload.create({ collection: 'breeds', locale: 'en', data: { slug: b.slug, image, onFarm: Boolean(b.onFarm), order: i + 1, ...loc(b.en) } })
  await payload.update({ collection: 'breeds', id: doc.id, locale: 'hi', data: loc(b.hi) })
}
log(`Breeds: ${breeds.length}`)

// ── Departments & facilities ──────────────────────────────────
const deptIds: Record<string, number> = {}
for (const d of departments) {
  const loc = (l: typeof d.en) => ({
    title: l.title,
    summary: l.summary,
    description: deptBody(l),
    responsibilities: l.list.map((text) => ({ text })),
    standards: l.standards,
  })
  const doc = await payload.create({
    collection: 'departments',
    locale: 'en',
    data: { slug: d.slug, icon: d.icon as never, order: d.order, relatedProducts: (d.products ?? []).map((s) => productIds[s]), ...loc(d.en) },
  })
  await payload.update({ collection: 'departments', id: doc.id, locale: 'hi', data: loc(d.hi) })
  deptIds[d.slug] = doc.id
}
for (const f of facilities) {
  const image = f.image ? await media(f.image, { en: f.en.title, hi: f.hi.title }) : undefined
  const loc = (l: typeof f.en) => ({
    title: l.title,
    summary: l.summary,
    description: facBody(l),
    steps: l.steps,
    hygiene: l.hygiene?.map((text) => ({ text })),
    specs: l.specs,
  })
  const doc = await payload.create({
    collection: 'facilities',
    locale: 'en',
    data: {
      slug: f.slug,
      icon: f.icon as never,
      order: f.order,
      image,
      department: deptIds[f.department],
      relatedProducts: (f.products ?? []).map((s) => productIds[s]),
      ...loc(f.en),
    },
  })
  await payload.update({ collection: 'facilities', id: doc.id, locale: 'hi', data: loc(f.hi) })
}
log(`Departments: ${departments.length}, facilities: ${facilities.length}`)

// ── Blog ──────────────────────────────────────────────────────
for (const [i, p] of posts.entries()) {
  const cover = await media(p.cover, { en: p.en.title, hi: p.hi.title })
  const loc = (l: typeof p.en) => ({
    title: l.title,
    excerpt: l.excerpt,
    tldr: l.tldr.map((text) => ({ text })),
    content: l.content,
    keyTakeaways: l.keyTakeaways.map((text) => ({ text })),
    faqs: 'faqs' in l ? l.faqs : undefined,
  })
  const doc = await payload.create({
    collection: 'posts',
    locale: 'en',
    data: {
      slug: p.slug,
      category: p.category as never,
      cover,
      sources: 'sources' in p ? p.sources : undefined,
      relatedProducts: ('products' in p ? (p.products as string[]) : []).map((s) => productIds[s]),
      author: { name: 'Amrit Dairy Farm Team', role: 'Amrit Dairy, Sonipat' },
      publishedAt: new Date(Date.now() - i * 86400000 * 3).toISOString(),
      ...loc(p.en),
    },
  })
  await payload.update({ collection: 'posts', id: doc.id, locale: 'hi', data: { ...loc(p.hi), author: { name: 'Amrit Dairy Farm Team', role: 'अमृत डेयरी, सोनीपत' } } })
}
log(`Posts: ${posts.length}`)

// ── FAQs, ticker, delivery areas, legal ───────────────────────
for (const [i, f] of faqs.entries()) {
  const doc = await payload.create({ collection: 'faqs', locale: 'en', data: { question: f.en[0], answer: f.en[1], order: i, showOnHome: true } })
  await payload.update({ collection: 'faqs', id: doc.id, locale: 'hi', data: { question: f.hi[0], answer: f.hi[1] } })
}
for (const t of ticker) {
  const doc = await payload.create({ collection: 'ticker', locale: 'en', data: { text: t.en, type: t.type as never, priority: t.priority, link: t.link, active: true } })
  await payload.update({ collection: 'ticker', id: doc.id, locale: 'hi', data: { text: t.hi } })
}
for (const a of areas) {
  const doc = await payload.create({
    collection: 'service-areas',
    locale: 'en',
    data: { slug: a.slug, pincodes: a.pincodes, status: 'live', city: 'Sonipat', ...a.en, landmarks: a.landmarks?.en.map((name) => ({ name })) },
  })
  await payload.update({ collection: 'service-areas', id: doc.id, locale: 'hi', data: { city: 'सोनीपत', ...a.hi, landmarks: a.landmarks?.hi.map((name) => ({ name })) } })
}
for (const l of legal) {
  const doc = await payload.create({ collection: 'legal-pages', locale: 'en', data: { slug: l.slug, order: l.order, effectiveDate: new Date().toISOString(), ...l.en } })
  await payload.update({ collection: 'legal-pages', id: doc.id, locale: 'hi', data: l.hi })
}
log(`FAQs: ${faqs.length}, ticker: ${ticker.length}, areas: ${areas.length}, legal: ${legal.length}`)

// ── Site settings ─────────────────────────────────────────────
await payload.updateGlobal({ slug: 'site-settings', locale: 'en', data: { cutoffTime: '9 PM' } })
await payload.updateGlobal({
  slug: 'site-settings',
  locale: 'hi',
  data: { address: 'अमृत डेयरी, अनूप स्पोर्ट्स विलेज के पास, राजभाया, गढ़ी ब्राह्मणान, सोनीपत, हरियाणा - 131001', cutoffTime: 'रात 9 बजे' },
})

log('Done ✅')
process.exit(0)
