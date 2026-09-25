export const locales = ['en', 'hi'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export const isLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value)

/** English lives at `/…`, Hindi at `/hi/…` (Doc 05 §1). */
export function localePath(locale: Locale, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`
  if (locale === defaultLocale) return clean
  return clean === '/' ? `/${locale}` : `/${locale}${clean}`
}

/** Remove a leading `/hi` from a browser path to get the locale-neutral path. */
export function stripLocale(pathname: string): string {
  for (const l of locales) {
    if (l === defaultLocale) continue
    if (pathname === `/${l}`) return '/'
    if (pathname.startsWith(`/${l}/`)) return pathname.slice(l.length + 1)
  }
  return pathname
}

export const htmlLang: Record<Locale, string> = { en: 'en-IN', hi: 'hi-IN' }
