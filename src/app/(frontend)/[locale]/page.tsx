import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { HeroParallax } from '@/components/HeroParallax'
import { Icon } from '@/components/Icon'
import { MilkSplash } from '@/components/MilkSplash'
import { PincodeChecker } from '@/components/PincodeChecker'
import { ProductCard } from '@/components/ProductCard'
import { FAQ, SectionHeading } from '@/components/ui'
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

const trustIcons = ['cow', 'ghee', 'jar', 'shield']
const whyIcons = ['cow', 'truck', 'milk', 'shield', 'search', 'map']

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

  return (
    <>
      {/* 1 · Hero */}
      <section className="relative overflow-hidden bg-forest-900 text-cream">
        <div className="absolute inset-0 opacity-25" aria-hidden="true">
          <Image src="/images/hero-ghee.jpg" alt="" fill priority sizes="100vw" className="scale-110 object-cover blur-md" />
        </div>
        <div className="container-x relative grid items-center gap-8 pb-4 pt-10 md:grid-cols-2 md:pb-6 md:pt-16">
          <div className="order-2 md:order-1">
            <h1 lang="hi" className="text-4xl font-bold leading-tight !text-cream md:text-6xl">{t.home.heroHindi}</h1>
            <p className="mt-4 text-lg font-medium text-cream/90 md:text-xl">{t.home.heroSub}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {t.heroPills.map((pill) => (
                <li key={pill} className="rounded-full border border-gold-500/60 bg-forest-950/60 px-3.5 py-1.5 text-sm font-semibold text-cream">{pill}</li>
              ))}
            </ul>
            <div className="mt-6 rounded-3xl bg-cream p-5 text-ink shadow-float md:p-6">
              <span className="inline-flex rounded-full bg-forest-900 px-3 py-1 text-xs font-bold text-cream">100% {locale === 'hi' ? 'शुद्ध' : 'pure'} · Bilona</span>
              <p className="mt-3 font-serif text-2xl font-semibold text-forest-900">{t.home.heroPriceLabel}</p>
              <p className="text-muted" lang={locale === 'hi' ? 'en' : 'hi'}>{t.home.heroPriceHindi}</p>
              <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
                {t.home.heroFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2"><Icon name="check" size={16} className="text-leaf-600" />{f}</li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                {gheePrice && <p className="text-2xl font-bold tabular-nums">{formatINR(gheePrice)} <span className="text-base font-normal text-muted">/ kg</span></p>}
                <Link href={href('/products/desi-cow-golden-ghee')} className="btn btn-gold">{t.common.buyNow}</Link>
                <Link href={href('/shop')} className="btn btn-outline">{t.home.shopAll}</Link>
              </div>
            </div>
          </div>
          {/* Floating bottles: rise in on load, float up and down, and follow the mouse/scroll at different depths */}
          <HeroParallax className="relative order-1 mx-auto aspect-[5/4] w-full max-w-[340px] sm:max-w-md md:order-2 md:max-w-lg">
            <div aria-hidden="true" className="absolute inset-0">
              <div data-depth="0.3" className="parallax-layer absolute inset-[8%] rounded-full bg-gold-500/25 blur-3xl" />
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
                  {/* Milk splash bursts each time the bottle dips */}
                  <MilkSplash delay="-3.2s" className="absolute -bottom-[12%] left-1/2 h-[44%] w-[240%] -translate-x-1/2" />
                </div>
              </div>
              <div data-depth="1.2" className="parallax-layer absolute bottom-[2%] left-[27%] h-[92%] w-[46%]">
                <div className="animate-rise h-full w-full">
                  <div className="animate-float-wide relative h-full w-full">
                    <Image src="/images/ghee-cutout.png" alt="Amrit Desi Cow Golden Ghee" fill priority sizes="(max-width: 768px) 45vw, 22vw" className="object-contain drop-shadow-2xl" />
                  </div>
                  <div className="animate-float-shadow mx-auto -mt-1 h-4 w-3/4 rounded-full bg-black/50 blur-md" />
                </div>
              </div>
            </div>
          </HeroParallax>
        </div>
        {/* Rolling farm hills into the trust strip */}
        <svg className="relative -mb-px block h-10 w-full md:h-16" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 50 C 240 10, 420 70, 720 40 S 1200 10, 1440 45 V80 H0 Z" fill="#3d6b30" opacity="0.55" />
          <path d="M0 60 C 300 30, 520 80, 820 55 S 1260 35, 1440 60 V80 H0 Z" fill="#32502c" />
        </svg>
      </section>

      {/* 2 · Trust strip */}
      <section className="bg-forest-800 text-cream" aria-label="Why Amrit">
        <ul className="container-x grid grid-cols-2 gap-4 py-6 md:grid-cols-4">
          {t.home.trust.map((item, i) => (
            <li key={item.title} className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-forest-900 text-gold-500"><Icon name={trustIcons[i]} /></span>
              <span>
                <span className="block font-semibold leading-tight">{item.title}</span>
                <span className="block text-sm text-cream/75">{item.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* 3 · Categories */}
      <section className="container-x py-14">
        <SectionHeading eyebrow={t.home.categoriesEyebrow} title={t.home.categoriesTitle} />
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 lg:gap-4">
          {categories.map((c) => (
            <li key={c.id}>
              <Link href={href(`/shop/${c.slug}`)} className="group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-forest-900 shadow-lift">
                {mediaUrl(c.image, 'card') && (
                  <Image src={mediaUrl(c.image, 'card') as string} alt="" fill sizes="(max-width: 768px) 50vw, 20vw" className="object-cover transition duration-500 group-hover:scale-105" />
                )}
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-forest-950/95 via-forest-950/70 to-transparent p-4 pt-12 text-cream">
                  <span>
                    <span className="block font-serif text-lg font-semibold leading-tight">{c.title}</span>
                    {c.secondaryTitle && <span className="block text-sm text-cream/80">{c.secondaryTitle}</span>}
                  </span>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold-500 text-ink"><Icon name="arrow" size={16} /></span>
                </span>
              </Link>
            </li>
          ))}
          <li>
            <Link href={href('/desi-cows')} className="group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-forest-900 shadow-lift">
              <Image src="/images/cat-cow.jpg" alt="" fill sizes="(max-width: 768px) 50vw, 20vw" className="object-cover transition duration-500 group-hover:scale-105" />
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-forest-950/95 via-forest-950/70 to-transparent p-4 pt-12 text-cream">
                <span>
                  <span className="block font-serif text-lg font-semibold leading-tight">{t.home.cowTile}</span>
                  <span className="block text-sm text-cream/80">{t.home.cowTileHindi}</span>
                </span>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold-500 text-ink"><Icon name="arrow" size={16} /></span>
              </span>
            </Link>
          </li>
        </ul>
      </section>

      {/* 4 · Bestsellers */}
      {featured.length > 0 && (
        <section className="bg-malai/60 py-14">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading eyebrow={t.home.bestsellersEyebrow} title={t.home.bestsellersTitle} />
              <Link href={href('/shop')} className="mb-8 font-semibold text-leaf-600 underline underline-offset-4">{t.common.viewAll}</Link>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
              {featured.map((p) => <ProductCard key={p.id} product={p} locale={locale} />)}
            </div>
          </div>
        </section>
      )}

      {/* 5 · Subscription band */}
      <section className="bg-forest-800 text-cream">
        <div className="container-x grid gap-8 py-14 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl !text-cream md:text-4xl">{t.home.subscribeTitle}</h2>
            <p className="mt-3 text-lg text-cream/85">{t.home.subscribeText}</p>
            <ol className="mt-6 grid gap-3 sm:grid-cols-3">
              {t.home.subscribeSteps.map((s, i) => (
                <li key={s} className="flex items-center gap-3 rounded-2xl bg-forest-900 p-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-500 font-bold text-ink">{i + 1}</span>
                  <span className="font-semibold">{s}</span>
                </li>
              ))}
            </ol>
            <Link href={href('/subscribe')} className="btn btn-gold mt-6">{t.home.subscribeCta}</Link>
          </div>
          <div className="rounded-3xl bg-cream p-5 text-ink">
            <p className="mb-3 font-serif text-xl font-semibold text-forest-900">{t.home.checkDelivery}</p>
            <PincodeChecker fulfilment="local" compact />
          </div>
        </div>
      </section>

      {/* 6 · Farm */}
      <section className="container-x grid items-center gap-10 py-16 md:grid-cols-2">
        <div className="grid grid-cols-3 gap-3">
          {farmBreeds.map((b, i) => (
            <Link key={b.id} href={href(`/desi-cows/${b.slug}`)} className={`group rounded-2xl bg-white p-2 text-center shadow-card ${i === 0 ? 'col-span-2 row-span-2' : ''}`}>
              <span className="relative block aspect-square">
                {mediaUrl(b.image, 'card') && <Image src={mediaUrl(b.image, 'card') as string} alt={`${b.name} cow`} fill sizes="(max-width: 768px) 33vw, 20vw" className="object-contain" />}
              </span>
              <span className="mt-1 block text-sm font-semibold">{b.name}</span>
            </Link>
          ))}
          <Link href={href('/desi-cows')} className="grid place-items-center rounded-2xl bg-forest-900 p-2 text-center font-semibold text-cream shadow-card hover:bg-forest-800">
            <span>
              <span className="block font-serif text-3xl text-gold-500">18</span>
              <span className="text-sm">{t.cows.allBreeds} →</span>
            </span>
          </Link>
        </div>
        <div>
          <p className="eyebrow mb-2">{t.home.farmEyebrow}</p>
          <h2 className="text-3xl md:text-4xl">{t.home.farmTitle}</h2>
          <p className="mt-4 text-lg text-muted">{t.home.farmText}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={href('/farm-story')} className="btn btn-primary">{t.home.farmCta}</Link>
            <Link href={href('/desi-cows')} className="btn btn-outline">{t.nav.desiCows}</Link>
          </div>
        </div>
      </section>

      {/* 7 · Bilona process */}
      <section className="bg-malai/60 py-16">
        <div className="container-x">
          <SectionHeading eyebrow={t.home.bilonaEyebrow} title={t.home.bilonaTitle} align="center" />
          <ol className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {t.home.bilonaSteps.map((s, i) => (
              <li key={s.title} className="relative rounded-2xl bg-cream p-4 text-center shadow-card">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-forest-900 font-serif text-lg font-semibold text-gold-500">{i + 1}</span>
                <p className="mt-3 font-semibold text-forest-900">{s.title}</p>
                <p className="mt-1 text-sm text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 text-center">
            <Link href={href('/products/desi-cow-golden-ghee')} className="btn btn-gold">{t.home.bilonaCta}</Link>
          </div>
        </div>
      </section>

      {/* 8 · Why Amrit */}
      <section className="container-x py-16">
        <SectionHeading eyebrow={t.home.whyEyebrow} title={t.home.whyTitle} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.home.why.map((w, i) => (
            <li key={w.title} className="card flex gap-4 p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-mint text-leaf-600"><Icon name={whyIcons[i]} /></span>
              <span>
                <span className="block font-semibold text-forest-900">{w.title}</span>
                <span className="mt-1 block text-muted">{w.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* 9 · Reviews: only real ones, and only once there are at least 3 (Doc 05 §5.1) */}
      {reviews.length >= 3 && (
        <section className="bg-malai/60 py-16">
          <div className="container-x">
            <SectionHeading title={t.home.reviewsTitle} />
            <ul className="grid gap-4 md:grid-cols-3">
              {reviews.slice(0, 6).map((r) => (
                <li key={r.id} className="rounded-2xl bg-cream p-5 shadow-card">
                  <p className="text-gold-500" aria-label={`${r.rating} / 5`}>{'★'.repeat(r.rating ?? 5)}</p>
                  <blockquote className="mt-2">“{r.quote}”</blockquote>
                  <p className="mt-3 text-sm font-semibold">{r.name}{r.locality ? ` · ${r.locality}` : ''}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 10 · Delivery */}
      <section className="container-x py-16">
        <div className="grid gap-8 rounded-3xl bg-mint p-6 md:grid-cols-2 md:p-10">
          <div>
            <h2 className="text-3xl md:text-4xl">{t.home.deliveryTitle}</h2>
            <p className="mt-3 text-lg text-muted">{t.home.deliveryText}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {liveAreas.map((a) => (
                <li key={a.id}>
                  <Link href={href(`/delivery/${a.slug}`)} className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1.5 text-sm font-semibold text-forest-900 hover:underline">
                    <Icon name="map" size={16} className="text-leaf-600" /> {a.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="self-center">
            <PincodeChecker />
          </div>
        </div>
      </section>

      {/* 11 · Blog */}
      {posts.length > 0 && (
        <section className="container-x pb-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading title={t.home.blogTitle} />
            <Link href={href('/blog')} className="mb-8 font-semibold text-leaf-600 underline underline-offset-4">{t.common.viewAll}</Link>
          </div>
          <ul className="grid gap-5 md:grid-cols-3">
            {posts.map((post) => (
              <li key={post.id} className="card overflow-hidden">
                <Link href={href(`/blog/${post.slug}`)} className="group block">
                  <span className="relative block aspect-[16/10] bg-malai">
                    {mediaUrl(post.cover, 'card') && <Image src={mediaUrl(post.cover, 'card') as string} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />}
                  </span>
                  <span className="block p-5">
                    <span className="eyebrow">{t.blog.categories[post.category]}</span>
                    <span className="mt-1 block font-serif text-xl font-semibold text-forest-900 group-hover:underline">{post.title}</span>
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
      <section className="bg-forest-800 text-cream">
        <div className="container-x py-14 text-center">
          <h2 className="text-3xl !text-cream md:text-4xl">{t.home.whatsappTitle}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-cream/85">{t.home.whatsappText}</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={whatsappLink(settings.ordersPhone, 'Hi Amrit Dairy, I want to place an order.')} target="_blank" rel="noopener" className="btn btn-gold">
              <Icon name="whatsapp" /> {t.common.whatsappUs}
            </a>
            <a href={telLink(settings.ordersPhone)} className="btn btn-outline-light">
              <Icon name="phone" /> {t.common.callUs}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
