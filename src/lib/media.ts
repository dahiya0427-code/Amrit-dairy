import type { Media } from '@/payload-types'

type MaybeMedia = number | Media | null | undefined

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '')

export function mediaOf(value: MaybeMedia): Media | null {
  return value && typeof value === 'object' ? value : null
}

/** Same-site uploads become relative paths (served by Payload); Blob URLs stay absolute. */
function normalize(url: string): string {
  if (SITE && url.startsWith(SITE)) return url.slice(SITE.length) || '/'
  return url
}

export function mediaUrl(value: MaybeMedia, size?: 'thumb' | 'card' | 'hero'): string | null {
  const m = mediaOf(value)
  if (!m) return null
  const sized = size ? m.sizes?.[size]?.url : null
  const url = sized || m.url
  return url ? normalize(url) : null
}
