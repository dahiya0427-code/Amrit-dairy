import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

// AI answer-engine crawlers are allowed on purpose (Doc 04 §6.5, GEO).
export default function robots(): MetadataRoute.Robots {
  const disallow = ['/admin', '/api', '/cart', '/checkout', '/order/', '/hi/cart', '/hi/checkout', '/hi/order/']
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow },
      { userAgent: ['GPTBot', 'OAI-SearchBot', 'PerplexityBot', 'Google-Extended', 'ClaudeBot'], allow: '/', disallow },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
