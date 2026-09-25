import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { localePath, locales } from '@/i18n/config'
import { SITE_URL } from '@/lib/site'

// Generated per request (cached by the CDN below) so builds never need the database.
export const dynamic = 'force-dynamic'

const staticPaths = ['/', '/shop', '/farm-story', '/desi-cows', '/about', '/departments', '/facilities', '/blog', '/news', '/contact', '/delivery', '/subscribe', '/bulk-orders']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()
  const q = { limit: 1000, depth: 0, select: { slug: true, updatedAt: true } } as const
  const [products, categories, breeds, departments, facilities, posts, areas, legal] = await Promise.all([
    payload.find({ collection: 'products', ...q }),
    payload.find({ collection: 'categories', ...q }),
    payload.find({ collection: 'breeds', ...q }),
    payload.find({ collection: 'departments', ...q }),
    payload.find({ collection: 'facilities', ...q }),
    payload.find({ collection: 'posts', ...q }),
    payload.find({ collection: 'service-areas', ...q }),
    payload.find({ collection: 'legal-pages', ...q }),
  ])

  const entries: { path: string; updated?: string; priority: number }[] = [
    ...staticPaths.map((p) => ({ path: p, priority: p === '/' ? 1 : 0.7 })),
    ...products.docs.map((d) => ({ path: `/products/${d.slug}`, updated: d.updatedAt, priority: 0.9 })),
    ...categories.docs.map((d) => ({ path: `/shop/${d.slug}`, updated: d.updatedAt, priority: 0.8 })),
    ...breeds.docs.map((d) => ({ path: `/desi-cows/${d.slug}`, updated: d.updatedAt, priority: 0.5 })),
    ...departments.docs.map((d) => ({ path: `/departments/${d.slug}`, updated: d.updatedAt, priority: 0.5 })),
    ...facilities.docs.map((d) => ({ path: `/facilities/${d.slug}`, updated: d.updatedAt, priority: 0.5 })),
    ...posts.docs.map((d) => ({ path: `/blog/${d.slug}`, updated: d.updatedAt, priority: 0.6 })),
    ...areas.docs.map((d) => ({ path: `/delivery/${d.slug}`, updated: d.updatedAt, priority: 0.7 })),
    ...legal.docs.map((d) => ({ path: `/legal/${d.slug}`, updated: d.updatedAt, priority: 0.2 })),
  ]

  return entries.flatMap((e) =>
    locales.map((l) => ({
      url: `${SITE_URL}${localePath(l, e.path)}`,
      lastModified: e.updated ? new Date(e.updated) : undefined,
      priority: e.priority,
      alternates: { languages: Object.fromEntries(locales.map((x) => [x === 'hi' ? 'hi-IN' : 'en-IN', `${SITE_URL}${localePath(x, e.path)}`])) },
    })),
  )
}
