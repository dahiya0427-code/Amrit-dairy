import 'server-only'
import { cache } from 'react'
import type { Where } from 'payload'
import { getPayloadClient } from './payload'
import type { Locale } from '@/i18n/config'
import type { Product } from '@/payload-types'
import { applyOffers, type PricedProduct } from './offers'
import { lowStock, minPrice } from './product'

const one = async <T,>(p: Promise<{ docs: T[] }>) => (await p).docs[0] ?? null

export const getSettings = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', locale, depth: 0 })
})

export const getTicker = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  const now = new Date().toISOString()
  const res = await payload.find({
    collection: 'ticker',
    locale,
    limit: 10,
    sort: '-priority',
    where: {
      and: [
        { active: { equals: true } },
        { or: [{ startAt: { exists: false } }, { startAt: { less_than_equal: now } }] },
        { or: [{ endAt: { exists: false } }, { endAt: { greater_than: now } }] },
      ],
    },
  })
  return res.docs
})

export const getNews = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  return (await payload.find({ collection: 'ticker', locale, limit: 50, sort: '-createdAt' })).docs
})

export const getCategories = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  return (await payload.find({ collection: 'categories', locale, limit: 50, sort: 'order', depth: 1 })).docs
})

export const getCategory = cache(async (slug: string, locale: Locale) => {
  const payload = await getPayloadClient()
  return one(payload.find({ collection: 'categories', locale, limit: 1, depth: 1, where: { slug: { equals: slug } } }))
})

/** Offers that are switched on; dates are checked per request when applied. */
export const getOffers = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  return (await payload.find({ collection: 'offers', locale, depth: 0, limit: 200, pagination: false, where: { active: { equals: true } } })).docs
})

type ProductFilter = { categoryId?: number; featured?: boolean; fulfilment?: 'local' | 'ship'; limit?: number }

export const getProducts = cache(async (locale: Locale, filter: ProductFilter = {}) => {
  const payload = await getPayloadClient()
  const and: Where[] = []
  if (filter.categoryId) and.push({ category: { equals: filter.categoryId } })
  if (filter.featured) and.push({ featured: { equals: true } })
  if (filter.fulfilment) and.push({ fulfilment: { equals: filter.fulfilment } })
  const res = await payload.find({
    collection: 'products',
    locale,
    depth: 1,
    limit: filter.limit ?? 100,
    sort: 'order',
    where: and.length ? { and } : undefined,
  })
  return decorate(res.docs, locale)
})

export const getProduct = cache(async (slug: string, locale: Locale) => {
  const payload = await getPayloadClient()
  const p = await one(payload.find({ collection: 'products', locale, depth: 2, limit: 1, where: { slug: { equals: slug } } }))
  return p ? (await decorate([p], locale))[0] : null
})

/** Average stars and count of approved reviews, per product id. */
export const getRatings = cache(async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'testimonials', where: { approved: { equals: true } }, depth: 0, limit: 2000, pagination: false, select: { product: true, rating: true } })
  const sums = new Map<number, { total: number; count: number }>()
  for (const r of docs) {
    const id = typeof r.product === 'object' ? r.product?.id : r.product
    if (!id) continue
    const s = sums.get(id) ?? { total: 0, count: 0 }
    s.total += r.rating ?? 5
    s.count += 1
    sums.set(id, s)
  }
  return new Map([...sums].map(([id, s]) => [id, { average: Math.round((s.total / s.count) * 10) / 10, count: s.count }]))
})

/** Adds what the pages show on top of the stored product: offer prices, stars, low stock and combo savings. */
async function decorate(products: Product[], locale: Locale): Promise<PricedProduct[]> {
  const [offers, ratings, settings] = await Promise.all([getOffers(locale), getRatings(), getSettings(locale)])
  const threshold = settings.lowStockThreshold ?? 5
  return products.map((raw) => {
    const p = applyOffers(raw, offers)
    const parts = (p.bundle ?? []).filter((b) => typeof b.product === 'object' && b.product)
    let combo: PricedProduct['combo'] = null
    if (parts.length) {
      const worth = parts.reduce((sum, b) => sum + (minPrice(b.product as Product) ?? 0) * (b.quantity ?? 1), 0)
      const price = minPrice(p) ?? 0
      combo = {
        worth,
        save: price && worth > price ? worth - price : 0,
        items: parts.map((b) => {
          const item = b.product as Product
          return { title: item.title, slug: item.slug, quantity: b.quantity ?? 1, note: b.note ?? null, image: item.cutout || item.images?.[0] || null }
        }),
      }
    }
    return { ...p, rating: ratings.get(p.id) ?? null, lowStock: lowStock(p, threshold), combo }
  })
}

export const getAdoptionPlans = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  return (await payload.find({ collection: 'adoption-plans', locale, limit: 20, sort: 'order', depth: 0, where: { active: { equals: true } } })).docs
})

export const getBreeds = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  return (await payload.find({ collection: 'breeds', locale, limit: 100, sort: 'order', depth: 1 })).docs
})

export const getBreed = cache(async (slug: string, locale: Locale) => {
  const payload = await getPayloadClient()
  return one(payload.find({ collection: 'breeds', locale, limit: 1, depth: 1, where: { slug: { equals: slug } } }))
})

export const getDepartments = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  return (await payload.find({ collection: 'departments', locale, limit: 50, sort: 'order', depth: 1 })).docs
})

export const getDepartment = cache(async (slug: string, locale: Locale) => {
  const payload = await getPayloadClient()
  return one(payload.find({ collection: 'departments', locale, limit: 1, depth: 2, where: { slug: { equals: slug } } }))
})

export const getFacilities = cache(async (locale: Locale, departmentId?: number) => {
  const payload = await getPayloadClient()
  return (
    await payload.find({
      collection: 'facilities',
      locale,
      limit: 50,
      sort: 'order',
      depth: 1,
      where: departmentId ? { department: { equals: departmentId } } : undefined,
    })
  ).docs
})

export const getFacility = cache(async (slug: string, locale: Locale) => {
  const payload = await getPayloadClient()
  return one(payload.find({ collection: 'facilities', locale, limit: 1, depth: 2, where: { slug: { equals: slug } } }))
})

export const getPosts = cache(async (locale: Locale, limit = 50) => {
  const payload = await getPayloadClient()
  return (await payload.find({ collection: 'posts', locale, limit, sort: '-publishedAt', depth: 1 })).docs
})

export const getPost = cache(async (slug: string, locale: Locale) => {
  const payload = await getPayloadClient()
  return one(payload.find({ collection: 'posts', locale, limit: 1, depth: 2, where: { slug: { equals: slug } } }))
})

export const getFaqs = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  return (await payload.find({ collection: 'faqs', locale, limit: 50, sort: 'order', where: { showOnHome: { equals: true } } })).docs
})

export const getServiceAreas = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  return (await payload.find({ collection: 'service-areas', locale, limit: 100, sort: 'name' })).docs
})

export const getServiceArea = cache(async (slug: string, locale: Locale) => {
  const payload = await getPayloadClient()
  return one(payload.find({ collection: 'service-areas', locale, limit: 1, where: { slug: { equals: slug } } }))
})

export const getLegalPages = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  return (await payload.find({ collection: 'legal-pages', locale, limit: 20, sort: 'order', depth: 0 })).docs
})

export const getLegalPage = cache(async (slug: string, locale: Locale) => {
  const payload = await getPayloadClient()
  return one(payload.find({ collection: 'legal-pages', locale, limit: 1, where: { slug: { equals: slug } } }))
})

export const getTestimonials = cache(async (locale: Locale, productId?: number) => {
  const payload = await getPayloadClient()
  const where: Where = productId ? { and: [{ approved: { equals: true } }, { product: { equals: productId } }] } : { approved: { equals: true } }
  return (await payload.find({ collection: 'testimonials', locale, limit: 60, depth: 1, sort: '-createdAt', where })).docs
})
