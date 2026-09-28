import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Icon } from '@/components/Icon'
import { ProductCard } from '@/components/ProductCard'
import { ScrollStory } from '@/components/ScrollStory'
import { getDictionary } from '@/i18n'
import { isLocale, localePath, type Locale } from '@/i18n/config'
import { formatINR } from '@/lib/format'
import { cowPhoto } from '@/lib/cow-photo'
import { minPrice } from '@/lib/product'
import { getBreeds, getCategories, getProduct, getProducts, getSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { whatsappLink } from '@/lib/site'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return buildMetadata({ locale, path: '/' })
}

/** Clean section heading: small gold eyebrow over a big condensed uppercase title. */
function Heading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-10 text-center md:mb-14">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold-700">{eyebrow}</p>
      <h2 className="mx-auto mt-3 max-w-3xl text-4xl leading-[0.95] md:text-6xl">{title}</h2>
    </div>
  )
}

export default async function HomePage({ params }: Props) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale
  const t = getDictionary(locale)
  const p = t.premium
  const href = (path: string) => localePath(locale, path)

  const [settings, categories, featured, ghee, breeds] = await Promise.all([
    getSettings(locale),
    getCategories(locale),
    getProducts(locale, { featured: true, limit: 8 }),
    getProduct('desi-cow-golden-ghee', locale),
    getBreeds(locale),
  ])
  const gheePrice = ghee ? minPrice(ghee) : null
  const farmBreeds = breeds.filter((b) => b.onFarm).slice(0, 5)

  const pick = (slug: string) => featured.find((f) => f.slug === slug)
  const priceOf = (slug: string) => {
    const prod = pick(slug)
    const min = prod ? minPrice(prod) : null
    return min ? formatINR(min) : null
  }
  const acharCat = categories.find((c) => c.slug === 'achar')
  const storyCentre = { title: ghee?.title ?? 'Desi Cow Ghee', price: gheePrice ? formatINR(gheePrice) : null, image: '/images/ghee-cutout.png', href: href('/products/desi-cow-golden-ghee') }
  const storyItems = [
    { title: pick('raw-forest-honey')?.title ?? 'Raw Forest Honey', price: priceOf('raw-forest-honey'), image: '/images/honey-cutout.png', href: href('/products/raw-forest-honey') },
    { title: pick('kaccha-mango-achar')?.title ?? 'Kaccha Mango Achar', price: priceOf('kaccha-mango-achar'), image: '/images/kaccha-mango-achar-cutout.png', href: href('/products/kaccha-mango-achar') },
    { title: pick('desi-cow-milk')?.title ?? 'Desi Cow Milk', price: priceOf('desi-cow-milk'), image: '/images/milk-cutout.png', href: href('/products/desi-cow-milk') },
    { title: acharCat?.title ?? 'Achar', price: null, image: '/images/mix-veg-achar-cutout.png', href: href('/shop/achar') },
  ]
  const storyBreeds = farmBreeds.map((b) => ({ name: b.name, image: cowPhoto(b), origin: b.origin ?? null }))

  return (
    <>
      <ScrollStory
        jar="/images/ghee-cutout.png"
        turntable="/images/jar-turn.webp"
        breeds={storyBreeds}
        items={storyItems}
        centre={storyCentre}
        shopHref={href('/products/desi-cow-golden-ghee')}
        whatsappHref={whatsappLink(settings.ordersPhone, 'Hi Amrit Dairy, I want to order Bilona ghee.')}
      />

      {/* Bestsellers */}
      {featured.length > 0 && (
        <section className="border-t border-line py-20">
          <div className="container-x">
            <Heading eyebrow={p.bestsellersEyebrow} title={p.bestsellers} />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {featured.map((prod) => <ProductCard key={prod.id} product={prod} locale={locale} />)}
            </div>
            <div className="mt-12 text-center">
              <Link href={href('/shop')} className="btn btn-outline !px-10">{t.common.viewAll} <Icon name="arrow" size={18} /></Link>
            </div>
          </div>
        </section>
      )}

    </>
  )
}
