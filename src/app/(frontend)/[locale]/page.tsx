import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { FarmSketch } from '@/components/FarmSketch'
import { Icon } from '@/components/Icon'
import { PincodeChecker } from '@/components/PincodeChecker'
import { ProductCard } from '@/components/ProductCard'
import { ScrollStory } from '@/components/ScrollStory'
import { FAQ } from '@/components/ui'
import { getDictionary } from '@/i18n'
import { isLocale, localePath, type Locale } from '@/i18n/config'
import { formatDate, formatINR } from '@/lib/format'
import { mediaUrl } from '@/lib/media'
import { minPrice } from '@/lib/product'
import { getBreeds, getCategories, getFaqs, getPosts, getProduct, getProducts, getServiceAreas, getSettings, getTestimonials } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { categoryCutout } from '@/lib/tone'
import { telLink, whatsappLink } from '@/lib/site'

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

  const [settings, categories, featured, ghee, breeds, faqs, posts, reviews, areas] = await Promise.all([
    getSettings(locale),
    getCategories(locale),
    getProducts(locale, { featured: true, limit: 8 }),
    getProduct('desi-cow-golden-ghee', locale),
    getBreeds(locale),
    getFaqs(locale),
    getPosts(locale, 3),
    getTestimonials(locale),
    getServiceAreas(locale),
  ])
  const gheePrice = ghee ? minPrice(ghee) : null
  const farmBreeds = breeds.filter((b) => b.onFarm).slice(0, 5)
  const liveAreas = areas.filter((a) => a.status === 'live')

  const pick = (slug: string) => featured.find((f) => f.slug === slug)
  const priceOf = (slug: string) => {
    const prod = pick(slug)
    const min = prod ? minPrice(prod) : null
    return min ? formatINR(min) : null
  }
  const acharCat = categories.find((c) => c.slug === 'achar')
  const storyItems = [
    { title: ghee?.title ?? 'Desi Cow Ghee', price: gheePrice ? formatINR(gheePrice) : null, image: '/images/ghee-cutout.png', href: href('/products/desi-cow-golden-ghee') },
    { title: pick('raw-forest-honey')?.title ?? 'Raw Forest Honey', price: priceOf('raw-forest-honey'), image: '/images/honey-cutout.png', href: href('/products/raw-forest-honey') },
    { title: pick('desi-cow-milk')?.title ?? 'Desi Cow Milk', price: priceOf('desi-cow-milk'), image: '/images/milk-cutout.png', href: href('/products/desi-cow-milk') },
    { title: acharCat?.title ?? 'Achar', price: null, image: '/images/mix-veg-achar-cutout.png', href: href('/shop/achar') },
  ]
  const storyBreeds = farmBreeds.map((b) => ({ name: b.name, image: mediaUrl(b.image, 'card') }))
  const uses = (ghee?.usage ?? []).map((u) => u.text).slice(0, 6)

  return (
    <>
      <ScrollStory
        jar="/images/ghee-cutout.png"
        breeds={storyBreeds}
        items={storyItems}
        uses={uses}
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

      {/* Collections */}
      <section className="bg-smoke py-20">
        <div className="container-x">
          <Heading eyebrow={p.collectionsEyebrow} title={p.collections} />
          <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-6">
            {categories.map((c) => {
              const cut = categoryCutout[c.slug] ?? mediaUrl(c.bannerImage, 'card')
              return (
                <li key={c.id}>
                  <Link href={href(`/shop/${c.slug}`)} className="group flex h-full flex-col items-center rounded-2xl border border-line bg-char p-5 text-center transition hover:shadow-lift">
                    {cut && (
                      <span className="relative block h-40 w-full md:h-56">
                        <Image src={cut} alt="" fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-contain drop-shadow-xl transition duration-500 group-hover:-translate-y-2" />
                      </span>
                    )}
                    <span className="mt-4 font-serif text-2xl font-bold uppercase leading-tight">{c.title}</span>
                    {c.tagline && <span className="mt-1 text-sm text-muted">{c.tagline}</span>}
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-gold-700">
                      {p.shopNow} <Icon name="arrow" size={14} />
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* Our herd, on the etched farm */}
      <section className="relative overflow-hidden pt-20">
        <div className="container-x">
          <Heading eyebrow={p.herdEyebrow} title={p.herdTitle} />
          <p className="mx-auto -mt-4 mb-10 max-w-2xl text-center text-lg text-muted">{t.home.farmText}</p>
          <ul className="flex flex-wrap justify-center gap-6 md:gap-10">
            {farmBreeds.map((b) => (
              <li key={b.id}>
                <Link href={href(`/desi-cows/${b.slug}`)} className="group flex w-32 flex-col items-center text-center md:w-40">
                  <span className="relative block h-32 w-32 overflow-hidden rounded-full border border-line bg-char md:h-40 md:w-40">
                    {mediaUrl(b.image, 'card') && <Image src={mediaUrl(b.image, 'card') as string} alt={`${b.name} cow`} fill sizes="160px" className="object-contain transition duration-500 group-hover:scale-110" />}
                  </span>
                  <span className="mt-4 font-serif text-xl font-bold uppercase">{b.name}</span>
                  {b.origin && <span className="text-xs text-muted">{b.origin}</span>}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center">
            <Link href={href('/desi-cows')} className="btn btn-outline !px-10">{t.home.allBreeds} <Icon name="arrow" size={18} /></Link>
          </div>
        </div>
        <FarmSketch className="mt-8 h-40 md:h-64" />
      </section>

      {/* Reviews: only real ones, once there are at least 3 */}
      {reviews.length >= 3 && (
        <section className="border-t border-line py-20">
          <div className="container-x">
            <Heading eyebrow="★★★★★" title={t.home.reviewsTitle} />
            <ul className="grid gap-5 md:grid-cols-3">
              {reviews.slice(0, 6).map((r) => (
                <li key={r.id} className="rounded-2xl border border-line bg-char p-8">
                  <p className="text-gold-500" aria-label={`${r.rating} / 5`}>{'★'.repeat(r.rating ?? 5)}</p>
                  <blockquote className="mt-3 text-lg">“{r.quote}”</blockquote>
                  <p className="mt-4 text-sm font-semibold text-muted">{r.name}{r.locality ? ` · ${r.locality}` : ''}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Delivery */}
      <section className="border-t border-line bg-smoke py-20">
        <div className="container-x grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold-700">{t.nav.delivery}</p>
            <h2 className="mt-3 text-4xl leading-[0.95] md:text-6xl">{t.home.deliveryTitle}</h2>
            <p className="mt-4 text-lg text-muted">{t.home.deliveryText}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {liveAreas.map((a) => (
                <li key={a.id}>
                  <Link href={href(`/delivery/${a.slug}`)} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-char px-4 py-2 text-sm font-semibold hover:border-gold-500">
                    <Icon name="map" size={16} className="text-gold-700" /> {a.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-line bg-char p-6 shadow-card md:p-8">
            <p className="mb-3 font-serif text-2xl font-bold uppercase">{t.home.checkDelivery}</p>
            <PincodeChecker compact />
          </div>
        </div>
      </section>

      {/* Journal */}
      {posts.length > 0 && (
        <section className="py-20">
          <div className="container-x">
            <Heading eyebrow={p.journalEyebrow} title={p.journal} />
            <ul className="grid gap-5 md:grid-cols-3">
              {posts.map((post) => (
                <li key={post.id}>
                  <Link href={href(`/blog/${post.slug}`)} className="group block overflow-hidden rounded-2xl border border-line bg-char transition hover:shadow-lift">
                    <span className="relative block aspect-[4/3] overflow-hidden bg-smoke">
                      {mediaUrl(post.cover, 'card') && <Image src={mediaUrl(post.cover, 'card') as string} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" />}
                    </span>
                    <span className="block p-6">
                      <span className="block text-xs font-bold uppercase tracking-[0.16em] text-gold-700">{t.blog.categories[post.category]} · {formatDate(post.publishedAt, locale)}</span>
                      <span className="mt-2 block font-serif text-2xl font-bold leading-snug">{post.title}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <FAQ locale={locale} faqs={faqs.map((f) => ({ question: f.question, answer: f.answer }))} />

      {/* WhatsApp */}
      <section className="border-t border-line py-16 text-center">
        <div className="container-x">
          <h2 className="mx-auto max-w-3xl text-4xl leading-[0.95] md:text-6xl">{t.home.whatsappTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">{t.home.whatsappText}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={whatsappLink(settings.ordersPhone, 'Hi Amrit Dairy, I want to place an order.')} target="_blank" rel="noopener" className="btn btn-gold !px-8">
              <Icon name="whatsapp" /> {t.common.whatsappUs}
            </a>
            <a href={telLink(settings.ordersPhone)} className="btn btn-outline !px-8">
              <Icon name="phone" /> {t.common.callUs}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
