import 'server-only'
import { cache } from 'react'
import type { Where } from 'payload'
import { getPayloadClient } from './payload'
import type { Locale } from '@/i18n/config'

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
  return res.docs
})

export const getProduct = cache(async (slug: string, locale: Locale) => {
  const payload = await getPayloadClient()
  return one(payload.find({ collection: 'products', locale, depth: 2, limit: 1, where: { slug: { equals: slug } } }))
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

export const getTestimonials = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  return (await payload.find({ collection: 'testimonials', locale, limit: 12, where: { approved: { equals: true } } })).docs
})
