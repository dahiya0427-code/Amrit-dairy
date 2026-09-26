import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Birds, Cloud, FarmHills, Sun } from '@/components/FarmScene'
import { HeroParallax } from '@/components/HeroParallax'
import { Icon } from '@/components/Icon'
import { MilkSplash } from '@/components/MilkSplash'
import { PincodeChecker } from '@/components/PincodeChecker'
import { ProductCard } from '@/components/ProductCard'
import { FAQ } from '@/components/ui'
import { getDictionary } from '@/i18n'
import { isLocale, localePath, type Locale } from '@/i18n/config'
import { formatDate, formatINR } from '@/lib/format'
import { mediaUrl } from '@/lib/media'
import { minPrice } from '@/lib/product'
import { getBreeds, getCategories, getFaqs, getPosts, getProduct, getProducts, getServiceAreas, getSettings, getTestimonials } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { telLink, whatsappLink } from '@/lib/site'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return buildMetadata({ locale, path: '/' })
}

const journeyIcons = ['leaf', 'cow', 'milk', 'lab', 'box', 'home']
const whyIcons = ['cow', 'truck', 'milk', 'shield', 'search', 'map']

/** Centered section title with a handwritten line above it. */
function Title({ hand, title, intro }: { hand?: string; title: string; intro?: string }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      {hand && <p className="font-hand text-xl text-gold-700 md:text-2xl">{hand}</p>}
      <h2 className="text-4xl !text-leaf-900 md:text-5xl">{title}</h2>
      {intro && <p className="mt-3 text-lg text-muted">{intro}</p>}
    </div>
  )
}

export default async function HomePage({ params }: Props) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale
  const t = getDictionary(locale)
  const href = (p: string) => localePath(locale, p)

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
  const [heroLine1, heroLine2] = t.home.heroHindi.split(', ')

  return (
    <>
      {/* 1 · Morning on the farm */}
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#fff7e3_0%,#ffeab4_55%,#fff4d6_100%)]">
        <Sun className="absolute -top-10 right-[8%] h-56 w-56 md:h-72 md:w-72" />
        <Cloud className="animate-drift absolute top-10 h-12 w-36 [animation-duration:70s]" />
        <Cloud className="animate-drift absolute top-28 h-9 w-28 opacity-80 [animation-delay:-35s] [animation-duration:90s]" />
        <Birds className="animate-birds absolute top-20 h-8 w-24" />

        <div className="container-x relative z-10 grid items-end gap-6 pb-36 pt-10 md:grid-cols-[1.1fr_1fr] md:pb-48 md:pt-16">
          <div className="pb-4">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-sm font-semibold text-leaf-900 shadow-card">
              <span className="h-2 w-2 rounded-full bg-hill-2" /> {t.home.heroEyebrow}
            </p>
            <h1 lang="hi" className="mt-5 leading-[0.95]">
              <span className="block text-6xl font-extrabold !text-leaf-900 md:text-8xl">{heroLine1},</span>
              <span className="mt-2 block font-hand text-5xl font-bold text-gold-700 md:text-7xl">{heroLine2}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg font-medium text-leaf-900/80 md:text-xl">{t.home.heroSub}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {t.heroPills.map((pill) => (
                <li key={pill} className="rounded-full bg-leaf-900 px-4 py-2 text-sm font-semibold text-sky">{pill}</li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href={href('/products/desi-cow-golden-ghee')} className="btn btn-gold !px-7 text-lg shadow-lift">
                {t.common.buyNow} · {t.home.heroPriceLabel}
              </Link>
              <Link href={href('/shop')} className="btn btn-outline !border-leaf-900 !text-leaf-900">{t.home.shopAll}</Link>
            </div>
            {gheePrice && (
              <p className="mt-4 text-sm text-leaf-900/70">
                <strong className="font-serif text-2xl text-leaf-900">{formatINR(gheePrice)}</strong> / kg · {t.common.inclTaxes}
              </p>
            )}
          </div>

          {/* Floating bottles standing on the hill: rise in, float, follow the mouse; the milk splashes */}
          <HeroParallax className="relative mx-auto aspect-[5/4] w-full max-w-[360px] sm:max-w-md md:max-w-lg">
            <div aria-hidden="true" className="absolute inset-0">
              <div data-depth="0.3" className="parallax-layer absolute inset-[6%] rounded-full bg-white/50 blur-3xl" />
              <div data-depth="0.6" className="parallax-layer absolute bottom-[8%] left-[2%] h-[62%] w-[34%]">
                <div className="animate-rise h-full w-full [animation-delay:0.25s]">
                  <div className="animate-float-wide relative h-full w-full [animation-delay:-1.6s]">
                    <Image src="/images/honey-cutout.png" alt="" fill sizes="160px" className="object-contain drop-shadow-2xl" />
                  </div>
                </div>
              </div>
              <div data-depth="0.9" className="parallax-layer absolute bottom-[8%] right-[4%] h-[70%] w-[22%]">
                <div className="animate-rise relative h-full w-full [animation-delay:0.4s]">
                  <div className="animate-float-wide relative h-full w-full [animation-delay:-3.2s]">
                    <Image src="/images/milk-cutout.png" alt="" fill sizes="120px" className="object-contain drop-shadow-2xl" />
                  </div>
                  <MilkSplash delay="-3.2s" className="absolute -bottom-[12%] left-1/2 h-[44%] w-[240%] -translate-x-1/2" />
                </div>
              </div>
              <div data-depth="1.2" className="parallax-layer absolute bottom-[2%] left-[27%] h-[92%] w-[46%]">
                <div className="animate-rise h-full w-full">
                  <div className="animate-float-wide relative h-full w-full">
                    <Image src="/images/ghee-cutout.png" alt="Amrit Desi Cow Golden Ghee" fill priority sizes="(max-width: 768px) 45vw, 22vw" className="object-contain drop-shadow-2xl" />
                  </div>
                  <div className="animate-float-shadow mx-auto -mt-1 h-4 w-3/4 rounded-full bg-leaf-900/40 blur-md" />
                </div>
              </div>
            </div>
          </HeroParallax>
        </div>

        <FarmHills className="absolute inset-x-0 bottom-0 z-0 h-44 w-full md:h-64" ground="#1f3a1a" />
      </section>

      {/* 2 · Scrolling product strip */}
      <section className="overflow-hidden bg-leaf-900 py-4 text-sky" aria-label={t.home.categoriesTitle}>
        <div className="animate-marquee flex w-max items-center whitespace-nowrap">
          {[0, 1].map((copy) => (
            <span key={copy} className="flex items-center" aria-hidden={copy === 1 || undefined}>
              {t.home.marquee.map((m) => (
                <span key={m} className="flex items-center font-serif text-2xl font-bold md:text-3xl">
                  <span className="px-6">{m}</span>
                  <span className="text-sun" aria-hidden="true">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </section>

      {/* 3 · Shop by category: round photos */}
      <section className="container-x py-16">
        <Title hand={t.home.categoriesEyebrow} title={t.home.categoriesTitle} />
        <ul className="flex flex-wrap justify-center gap-6 md:gap-10">
          {categories.map((c) => (
            <li key={c.id}>
              <Link href={href(`/shop/${c.slug}`)} className="group flex w-32 flex-col items-center text-center md:w-40">
                <span className="relative block h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-sky shadow-lift ring-2 ring-sun/60 transition group-hover:-translate-y-1 group-hover:ring-hill-2 md:h-40 md:w-40">
                  {mediaUrl(c.bannerImage, 'card') ? (
                    <Image src={mediaUrl(c.bannerImage, 'card') as string} alt="" fill sizes="160px" className="object-contain p-4 transition duration-500 group-hover:scale-110" />
                  ) : (
                    mediaUrl(c.image, 'card') && <Image src={mediaUrl(c.image, 'card') as string} alt="" fill sizes="160px" className="object-cover" />
                  )}
                </span>
                <span className="mt-3 font-serif text-xl font-bold text-leaf-900">{c.title}</span>
                {c.secondaryTitle && <span className="text-sm text-muted">{c.secondaryTitle}</span>}
              </Link>
            </li>
          ))}
          <li>
            <Link href={href('/desi-cows')} className="group flex w-32 flex-col items-center text-center md:w-40">
              <span className="relative block h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-hill-1 shadow-lift ring-2 ring-sun/60 transition group-hover:-translate-y-1 md:h-40 md:w-40">
                <Image src="/images/cat-cow.jpg" alt="" fill sizes="160px" className="object-cover" />
              </span>
              <span className="mt-3 font-serif text-xl font-bold text-leaf-900">{t.home.cowTile}</span>
              <span className="text-sm text-muted">{t.home.cowTileHindi}</span>
            </Link>
          </li>
        </ul>
      </section>

      {/* 4 · Bestsellers */}
      {featured.length > 0 && (
        <section className="bg-sky py-16">
          <div className="container-x">
            <Title hand={t.home.bestsellersEyebrow} title={t.home.bestsellersTitle} />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {featured.map((p) => <ProductCard key={p.id} product={p} locale={locale} />)}
            </div>
            <div className="mt-8 text-center">
              <Link href={href('/shop')} className="btn btn-primary !bg-leaf-900 !px-8">{t.common.viewAll}</Link>
            </div>
          </div>
        </section>
      )}

      {/* 5 · From our cows to your kitchen */}
      <section className="container-x py-16">
        <Title hand={t.home.journeyEyebrow} title={t.home.journeyTitle} intro={t.home.farmText} />
        <ol className="relative grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          <svg className="pointer-events-none absolute inset-x-0 top-10 hidden h-6 w-full lg:block" viewBox="0 0 1000 24" preserveAspectRatio="none" aria-hidden="true">
            <path d="M20 12 C 160 -4, 300 28, 500 12 S 840 -4, 980 12" stroke="#74b152" strokeWidth="3" strokeDasharray="8 10" fill="none" />
          </svg>
          {t.farm.journey.map((step, i) => (
            <li key={step} className="relative flex flex-col items-center text-center">
              <span className="relative grid h-20 w-20 place-items-center rounded-full border-4 border-white bg-mint text-hill-3 shadow-lift">
                <Icon name={journeyIcons[i]} size={34} />
                <span className="absolute -right-1 -top-1 grid h-7 w-7 place-items-center rounded-full bg-sun font-serif text-sm font-bold text-leaf-900">{i + 1}</span>
              </span>
              <span className="mt-3 font-serif text-lg font-bold text-leaf-900">{step}</span>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href={href('/farm-story')} className="btn btn-primary !bg-leaf-900">{t.home.farmCta}</Link>
          <Link href={href('/products/desi-cow-golden-ghee')} className="btn btn-gold">{t.home.bilonaCta}</Link>
        </div>
      </section>

      {/* 6 · Meet the cows (standing on the farm ground) */}
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#fff4d6,#f3f8e8)] pb-40 pt-16 md:pb-52">
        <div className="container-x relative z-10">
          <Title hand={t.cows.onFarm} title={t.home.breedsTitle} />
          <ul className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 md:justify-center">
            {farmBreeds.map((b) => (
              <li key={b.id} className="snap-start">
                <Link href={href(`/desi-cows/${b.slug}`)} className="group block w-44 rounded-3xl bg-white p-3 text-center shadow-card transition hover:-translate-y-1 hover:shadow-lift md:w-48">
                  <span className="relative block aspect-square overflow-hidden rounded-2xl bg-sky">
                    {mediaUrl(b.image, 'card') && <Image src={mediaUrl(b.image, 'card') as string} alt={`${b.name} cow`} fill sizes="200px" className="object-contain transition group-hover:scale-105" />}
                  </span>
                  <span className="mt-2 block font-serif text-lg font-bold text-leaf-900">{b.name}</span>
                  {b.origin && <span className="block text-xs text-muted">{b.origin}</span>}
                </Link>
              </li>
            ))}
            <li className="snap-start">
              <Link href={href('/desi-cows')} className="grid h-full w-44 place-items-center rounded-3xl bg-leaf-900 p-4 text-center text-sky shadow-card hover:bg-hill-3 md:w-48">
                <span>
                  <span className="block font-serif text-5xl font-extrabold text-sun">18</span>
                  <span className="font-semibold">{t.home.allBreeds} →</span>
                </span>
              </Link>
            </li>
          </ul>
        </div>
        <FarmHills className="absolute inset-x-0 bottom-0 h-40 w-full md:h-56" ground="#74b152" />
      </section>

      {/* 7 · Milk subscription with splash */}
      <section className="bg-hill-2 pb-16">
        <div className="container-x">
          <div className="grid items-center gap-8 overflow-hidden rounded-[2rem] bg-white p-6 shadow-float md:grid-cols-[0.8fr_1.2fr] md:p-10">
            <div className="relative mx-auto h-72 w-44 md:h-96 md:w-56" aria-hidden="true">
              <div className="animate-float-wide relative h-full w-full">
                <Image src="/images/milk-cutout.png" alt="" fill sizes="220px" className="object-contain drop-shadow-2xl" />
              </div>
              <MilkSplash className="absolute -bottom-[12%] left-1/2 h-[40%] w-[230%] -translate-x-1/2" />
            </div>
            <div>
              <p className="font-hand text-2xl text-gold-700">{t.nav.subscribe}</p>
              <h2 className="text-4xl !text-leaf-900 md:text-5xl">{t.home.subscribeTitle}</h2>
              <p className="mt-3 text-lg text-muted">{t.home.subscribeText}</p>
              <ol className="mt-6 grid gap-3 sm:grid-cols-3">
                {t.home.subscribeSteps.map((s, i) => (
                  <li key={s} className="flex items-center gap-3 rounded-2xl bg-sky p-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-leaf-900 font-serif font-bold text-sun">{i + 1}</span>
                    <span className="font-semibold text-leaf-900">{s}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-6 grid gap-4 lg:grid-cols-[auto_1fr] lg:items-center">
                <Link href={href('/subscribe')} className="btn btn-gold">{t.home.subscribeCta}</Link>
                <PincodeChecker fulfilment="local" compact />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8 · Why families choose Amrit */}
      <section className="container-x py-16">
        <Title hand={t.home.whyEyebrow} title={t.home.whyTitle} />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.home.why.map((w, i) => (
            <li key={w.title} className="flex gap-4 rounded-3xl border border-line bg-white p-6 transition hover:-translate-y-1 hover:shadow-lift">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-sky text-hill-3"><Icon name={whyIcons[i]} size={28} /></span>
              <span>
                <span className="block font-serif text-xl font-bold text-leaf-900">{w.title}</span>
                <span className="mt-1 block text-muted">{w.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* 9 · Reviews: only real ones, and only once there are at least 3 */}
      {reviews.length >= 3 && (
        <section className="bg-sky py-16">
          <div className="container-x">
            <Title title={t.home.reviewsTitle} />
            <ul className="grid gap-4 md:grid-cols-3">
              {reviews.slice(0, 6).map((r) => (
                <li key={r.id} className="rounded-3xl bg-white p-6 shadow-card">
                  <p className="text-sun" aria-label={`${r.rating} / 5`}>{'★'.repeat(r.rating ?? 5)}</p>
                  <blockquote className="mt-2">“{r.quote}”</blockquote>
                  <p className="mt-3 text-sm font-semibold">{r.name}{r.locality ? ` · ${r.locality}` : ''}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 10 · Delivery */}
      <section className="container-x pb-16">
        <div className="grid gap-8 rounded-[2rem] bg-leaf-900 p-6 text-sky md:grid-cols-2 md:p-10">
          <div>
            <p className="font-hand text-2xl text-sun">{t.nav.delivery}</p>
            <h2 className="text-4xl !text-sky">{t.home.deliveryTitle}</h2>
            <p className="mt-3 text-lg text-sky/80">{t.home.deliveryText}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {liveAreas.map((a) => (
                <li key={a.id}>
                  <Link href={href(`/delivery/${a.slug}`)} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold hover:bg-white/20">
                    <Icon name="map" size={16} className="text-sun" /> {a.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="self-center rounded-3xl bg-white p-1 text-ink">
            <PincodeChecker />
          </div>
        </div>
      </section>

      {/* 11 · Blog */}
      {posts.length > 0 && (
        <section className="container-x pb-4">
          <Title hand={t.nav.blog} title={t.home.blogTitle} />
          <ul className="grid gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <li key={post.id} className="overflow-hidden rounded-3xl border border-line bg-white transition hover:-translate-y-1 hover:shadow-lift">
                <Link href={href(`/blog/${post.slug}`)} className="group block">
                  <span className="relative block aspect-[16/10] bg-sky">
                    {mediaUrl(post.cover, 'card') && <Image src={mediaUrl(post.cover, 'card') as string} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />}
                  </span>
                  <span className="block p-5">
                    <span className="eyebrow">{t.blog.categories[post.category]}</span>
                    <span className="mt-1 block font-serif text-xl font-bold text-leaf-900 group-hover:underline">{post.title}</span>
                    <span className="mt-2 block text-sm text-muted">{formatDate(post.publishedAt, locale)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 12 · FAQ */}
      <FAQ locale={locale} faqs={faqs.map((f) => ({ question: f.question, answer: f.answer }))} />

      {/* 13 · WhatsApp band */}
      <section className="container-x pb-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(120deg,#ffeab4,#f5b83d)] p-8 text-center md:p-12">
          <h2 className="text-3xl !text-leaf-900 md:text-5xl">{t.home.whatsappTitle}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-leaf-900/80">{t.home.whatsappText}</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={whatsappLink(settings.ordersPhone, 'Hi Amrit Dairy, I want to place an order.')} target="_blank" rel="noopener" className="btn btn-primary !bg-leaf-900">
              <Icon name="whatsapp" /> {t.common.whatsappUs}
            </a>
            <a href={telLink(settings.ordersPhone)} className="btn btn-outline !border-leaf-900 !text-leaf-900">
              <Icon name="phone" /> {t.common.callUs}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
