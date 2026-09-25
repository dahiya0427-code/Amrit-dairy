import type { Metadata } from 'next'
import { getDictionary } from '@/i18n'
import { htmlLang, localePath, type Locale } from '@/i18n/config'
import type { Product, Post, SiteSetting } from '@/payload-types'
import { BUSINESS, SITE_URL } from './site'
import { mediaUrl } from './media'
import { buyableVariants } from './product'

const abs = (path: string) => (path.startsWith('http') ? path : `${SITE_URL}${path}`)

/** Page metadata with canonical + hreflang pairs (Doc 04 §6.1). */
export function buildMetadata({
  locale,
  path,
  title,
  description,
  image,
  noIndex,
  type = 'website',
}: {
  locale: Locale
  path: string
  title?: string | null
  description?: string | null
  image?: string | null
  noIndex?: boolean
  type?: 'website' | 'article'
}): Metadata {
  const t = getDictionary(locale)
  const url = abs(localePath(locale, path))
  const fullTitle = title ? `${title} · ${t.meta.siteName}` : t.meta.defaultTitle
  const desc = description || t.meta.defaultDescription
  return {
    title: fullTitle,
    description: desc,
    alternates: {
      canonical: url,
      languages: {
        'en-IN': abs(localePath('en', path)),
        'hi-IN': abs(localePath('hi', path)),
        'x-default': abs(localePath('en', path)),
      },
    },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: t.meta.siteName,
      locale: htmlLang[locale].replace('-', '_'),
      type,
      images: image ? [{ url: abs(image) }] : [{ url: abs('/images/og-default.jpg'), width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description: desc },
    robots: noIndex ? { index: false, follow: true } : undefined,
  }
}

export function organizationJsonLd(settings: SiteSetting) {
  const sameAs = [settings.facebook, settings.instagram, settings.youtube].filter(Boolean)
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'Store'],
    '@id': `${SITE_URL}/#organization`,
    name: 'Amrit Dairy',
    alternateName: ['अमृत डेयरी', 'Amrit Dairy Sonipat'],
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    slogan: 'Our cows are our own.',
    email: settings.email,
    telephone: settings.ordersPhone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.street,
      addressLocality: BUSINESS.city,
      addressRegion: BUSINESS.region,
      postalCode: BUSINESS.postalCode,
      addressCountry: 'IN',
    },
    areaServed: ['Sonipat', 'India'],
    identifier: [
      settings.gstin && { '@type': 'PropertyValue', propertyID: 'GSTIN', value: settings.gstin },
      settings.fssai && { '@type': 'PropertyValue', propertyID: 'FSSAI', value: settings.fssai },
    ].filter(Boolean),
    contactPoint: [
      { '@type': 'ContactPoint', contactType: 'customer service', telephone: settings.ordersPhone, availableLanguage: ['en', 'hi'] },
      { '@type': 'ContactPoint', contactType: 'sales', name: 'Cow buy/sell enquiry', telephone: settings.cowPhone, availableLanguage: ['hi', 'en'] },
    ],
    ...(sameAs.length ? { sameAs } : {}),
  }
}

export function websiteJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: getDictionary(locale).meta.siteName,
    inLanguage: htmlLang[locale],
    publisher: { '@id': `${SITE_URL}/#organization` },
  }
}

export function breadcrumbJsonLd(locale: Locale, items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: abs(localePath(locale, item.path)),
    })),
  }
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
}

export function productJsonLd(locale: Locale, product: Product) {
  const url = abs(localePath(locale, `/products/${product.slug}`))
  const images = (product.images ?? []).map((m) => mediaUrl(m, 'card')).filter(Boolean).map((u) => abs(u as string))
  const variants = buyableVariants(product)
  const base = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.shortDescription || undefined,
    image: images,
    sku: product.variants?.[0]?.sku,
    brand: { '@type': 'Brand', name: 'Amrit Dairy' },
    url,
  }
  if (!variants.length) {
    return {
      ...base,
      offers: {
        '@type': 'Offer',
        url,
        priceCurrency: 'INR',
        availability: product.status === 'coming_soon' ? 'https://schema.org/PreOrder' : 'https://schema.org/OutOfStock',
        seller: { '@id': `${SITE_URL}/#organization` },
      },
    }
  }
  const prices = variants.map((v) => v.price as number)
  return {
    ...base,
    offers: {
      '@type': 'AggregateOffer',
      url,
      priceCurrency: 'INR',
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: variants.length,
      availability: 'https://schema.org/InStock',
      seller: { '@id': `${SITE_URL}/#organization` },
    },
  }
}

export function articleJsonLd(locale: Locale, post: Post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    inLanguage: htmlLang[locale],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { '@type': 'Person', name: post.author?.name || 'Amrit Dairy Team', jobTitle: post.author?.role || undefined },
    publisher: { '@id': `${SITE_URL}/#organization` },
    image: mediaUrl(post.cover, 'hero') ? abs(mediaUrl(post.cover, 'hero') as string) : undefined,
    mainEntityOfPage: abs(localePath(locale, `/blog/${post.slug}`)),
  }
}
