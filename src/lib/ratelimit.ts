import 'server-only'

/**
 * Small in-memory rate limiter for form and checkout endpoints. It is
 * per-instance (serverless), so it slows down abuse rather than blocking it
 * completely; add Cloudflare Turnstile for stronger protection.
 */
const hits = new Map<string, { count: number; reset: number }>()

export function rateLimit(key: string, limit = 8, windowMs = 60_000): boolean {
  const now = Date.now()
  const entry = hits.get(key)
  if (!entry || entry.reset < now) {
    hits.set(key, { count: 1, reset: now + windowMs })
    if (hits.size > 5000) hits.clear()
    return true
  }
  entry.count += 1
  return entry.count <= limit
}

export const clientIp = (req: Request) => req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
