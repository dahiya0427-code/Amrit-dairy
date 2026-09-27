import type { Metadata, Viewport } from 'next'
import { Barlow_Semi_Condensed, Cinzel, Jost, Mukta } from 'next/font/google'
import { notFound } from 'next/navigation'
import '../globals.css'

import { BottomNav } from '@/components/BottomNav'
import { CartDrawer } from '@/components/CartDrawer'
import { CartProvider } from '@/components/CartProvider'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { I18nProvider } from '@/components/I18nProvider'
import { JsonLd } from '@/components/JsonLd'
import { WhatsAppFloat } from '@/components/WhatsAppFloat'
import { getDictionary } from '@/i18n'
import { htmlLang, isLocale, type Locale } from '@/i18n/config'
import { getCategories, getLegalPages, getServiceAreas, getSettings, getTicker } from '@/lib/queries'
import { buildMetadata, organizationJsonLd, websiteJsonLd } from '@/lib/seo'
import { SITE_URL } from '@/lib/site'

// Rendered on first visit, then cached (ISR) and refreshed when content changes.
export async function generateStaticParams() {
  return []
}

const display = Barlow_Semi_Condensed({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-display', display: 'swap' })
const elegant = Cinzel({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-cinzel', display: 'swap' })
const jost = Jost({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-jost', display: 'swap' })
const mukta = Mukta({ subsets: ['latin', 'devanagari'], weight: ['400', '500', '600', '700'], variable: '--font-mukta', display: 'swap' })

// Pages are rendered on first request and cached (ISR); CMS edits purge the cache.
export const revalidate = 300

export const viewport: Viewport = { themeColor: '#FFFFFF', width: 'device-width', initialScale: 1 }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return { metadataBase: new URL(SITE_URL), ...buildMetadata({ locale, path: '/' }) }
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale
  const t = getDictionary(locale)

  const [settings, ticker, categories, areas, legal] = await Promise.all([
    getSettings(locale),
    getTicker(locale),
    getCategories(locale),
    getServiceAreas(locale),
    getLegalPages(locale),
  ])

  return (
    <html lang={htmlLang[locale]} className={`${display.variable} ${elegant.variable} ${jost.variable} ${mukta.variable}`}>
      <body className="min-h-screen antialiased">
        <I18nProvider locale={locale}>
          <CartProvider>
            <Header locale={locale} ticker={ticker.map((i) => ({ id: i.id, text: i.text, link: i.link }))} />
            <main id="main" className="pb-12">{children}</main>
            <Footer
              locale={locale}
              settings={settings}
              categories={categories}
              areas={areas.filter((a) => a.status === 'live')}
              legal={legal}
            />
            <CartDrawer whatsapp={settings.ordersPhone} freeThreshold={settings.freeDeliveryThreshold ?? 0} />
            <BottomNav whatsapp={settings.ordersPhone} />
            <WhatsAppFloat phone={settings.ordersPhone} label={t.common.whatsappUs} />
          </CartProvider>
        </I18nProvider>
        <JsonLd data={[organizationJsonLd(settings), websiteJsonLd(locale)]} />
      </body>
    </html>
  )
}
