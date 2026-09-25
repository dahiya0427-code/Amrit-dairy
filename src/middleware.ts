import { NextResponse, type NextRequest } from 'next/server'
import { defaultLocale, locales } from '@/i18n/config'

/**
 * English is served at `/…` and Hindi at `/hi/…`. Internally every page lives
 * under `app/(frontend)/[locale]`, so unprefixed paths are rewritten to `/en/…`
 * and explicit `/en/…` URLs are redirected to the clean URL.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === `/${defaultLocale}` || pathname.startsWith(`/${defaultLocale}/`)) {
    const url = req.nextUrl.clone()
    url.pathname = pathname.slice(defaultLocale.length + 1) || '/'
    return NextResponse.redirect(url, 308)
  }

  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))
  if (hasLocale) return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  // Skip Payload admin/API, Next internals, metadata routes and files with an extension.
  matcher: ['/((?!admin|api|_next|media|sitemap.xml|robots.txt|llms.txt|feeds|favicon.ico|.*\\..*).*)'],
}
