import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { HeroCarousel } from '@/components/HeroCarousel'
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

const artIcons = ['cow', 'milk', 'flame', 'pot', 'churn', 'drop']
const trustIcons = ['cow', 'churn', 'jar', 'shield']

/** Premium section heading: small-caps eyebrow between gold rules, serif title. */
function Heading({ eyebrow, title, light = false }: { eyebrow: string; title: string; light?: boolean }) {
  return (
    <div className="mb-12 text-center">
      <p className={`flex items-center justify-center gap-4 text-xs font-medium uppercase tracking-[0.35em] ${light ? 'text-gold-500' : 'text-gold-700'}`}>
        <span className="h-px w-10 bg-current opacity-60" /> {eyebrow} <span className="h-px w-10 bg-current opacity-60" />
      </p>
      <h2 className={`mt-3 text-4xl uppercase tracking-[0.06em] md:text-6xl ${light ? '!text-cream' : '!text-walnut'}`}>{title}</h2>
    </div>
  )
}

/** Studio banner backdrop: warm brown with a soft light and a wooden-table edge. */
function Studio({ tone = 'walnut', children }: { tone?: 'walnut' | 'cocoa' | 'espresso'; children: React.ReactNode }) {
  const bg = {
    walnut: 'bg-[radial-gradient(ellipse_at_72%_40%,#6b4526_0%,#3b2415_38%,#1c100a_82%)]',
    cocoa: 'bg-[radial-gradient(ellipse_at_72%_40%,#5e3d27_0%,#34201a_40%,#170d08_85%)]',
    espresso: 'bg-[radial-gradient(ellipse_at_72%_40%,#7a4a1e_0%,#3b2415_40%,#1a0f08_85%)]',
  }[tone]
  return (
    <div className={`relative min-h-[620px] overflow-hidden md:min-h-[600px] ${bg}`}>
      {/* wooden table the products stand on */}
      <div className="absolute inset-x-0 bottom-0 h-[18%] bg-[linear-gradient(180deg,#3b2415,#1a0f08)] shadow-[0_-12px_30px_rgb(0_0_0/0.25)]" aria-hidden="true" />
      {children}
    </div>
  )
}

function SlideText({ s, eyebrowExtra, primary, secondary, hindiLine, as: H = 'h2' }: { s: { eyebrow: string; title: string; sub: string; cta: string; cta2: string }; eyebrowExtra?: string; primary: string; secondary: string; hindiLine?: string; as?: 'h1' | 'h2' }) {
  return (
    <div className="relative z-10 max-w-xl text-cream">
      <p className="text-xs font-medium uppercase tracking-[0.35em] text-gold-500">{s.eyebrow}</p>
      {hindiLine && <p lang="hi" className="mt-4 font-serif text-2xl italic text-butter md:text-3xl">{hindiLine}</p>}
      <H className="mt-3 text-5xl uppercase leading-[0.95] tracking-[0.04em] !text-cream md:text-7xl">{s.title}</H>
      <p className="mt-5 max-w-md text-lg text-cream/85">{s.sub}</p>
      {eyebrowExtra && <p className="mt-3 font-serif text-2xl text-gold-500">{eyebrowExtra}</p>}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={primary} className="btn btn-gold !rounded-full !px-8 uppercase tracking-[0.14em]">{s.cta}</Link>
        <Link href={secondary} className="btn btn-outline-light !rounded-full !px-8 uppercase tracking-[0.14em]">{s.cta2}</Link>
      </div>
    </div>
  )
}

/** A generic plastic tub for the "regular ghee" side of the comparison. */
function PlasticTub() {
  return (
    <svg viewBox="0 0 120 130" className="h-full w-full" aria-hidden="true">
      <rect x="18" y="8" width="84" height="18" rx="4" fill="#f2d24b" />
      <path d="M22 26h76l-6 94a6 6 0 0 1-6 6H34a6 6 0 0 1-6-6Z" fill="#f7df6a" />
      <path d="M26 40h68" stroke="#e5c33a" strokeWidth="3" />
    </svg>
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
  const comparison = ghee?.comparison ?? []

  const slides = [
    // 1 · Ghee
    <Studio key="ghee" tone="walnut">
      <div className="container-x grid min-h-[620px] items-center gap-6 py-14 md:min-h-[600px] md:grid-cols-2">
        <SlideText
          as="h1"
          s={p.slides[0]}
          hindiLine={t.home.heroHindi}
          eyebrowExtra={gheePrice ? `${formatINR(gheePrice)} · 1 kg` : undefined}
          primary={href('/products/desi-cow-golden-ghee')}
          secondary={href('/farm-story')}
        />
        <HeroParallax className="relative mx-auto h-[320px] w-full max-w-md self-end md:h-[480px]">
          <div aria-hidden="true" className="absolute inset-0">
            <div data-depth="0.3" className="parallax-layer absolute inset-[10%] rounded-full bg-gold-500/25 blur-3xl" />
            <div data-depth="0.6" className="parallax-layer absolute bottom-[4%] left-[0%] h-[52%] w-[34%]">
              <div className="animate-rise h-full w-full [animation-delay:0.25s]">
                <div className="animate-float-wide relative h-full w-full [animation-delay:-1.6s]">
                  <Image src="/images/honey-cutout.png" alt="" fill sizes="160px" className="object-contain drop-shadow-2xl" />
                </div>
              </div>
            </div>
            <div data-depth="1.1" className="parallax-layer absolute bottom-[2%] left-[26%] h-[88%] w-[52%]">
              <div className="animate-rise h-full w-full">
                <div className="animate-float-wide relative h-full w-full">
                  <Image src="/images/ghee-cutout.png" alt="Amrit Desi Cow Golden Ghee" fill priority sizes="(max-width: 768px) 50vw, 25vw" className="object-contain drop-shadow-2xl" />
                </div>
                <div className="animate-float-shadow mx-auto -mt-2 h-4 w-3/4 rounded-full bg-black/50 blur-md" />
              </div>
            </div>
          </div>
        </HeroParallax>
      </div>
    </Studio>,
    // 2 · Milk with splash
    <Studio key="milk" tone="cocoa">
      <div className="container-x grid min-h-[620px] items-center gap-6 py-14 md:min-h-[600px] md:grid-cols-2">
        <SlideText s={p.slides[1]} primary={href('/subscribe')} secondary={href('/delivery')} />
        <div className="relative mx-auto h-[320px] w-40 self-end md:h-[470px] md:w-56" aria-hidden="true">
          <div className="animate-float-wide relative h-full w-full">
            <Image src="/images/milk-cutout.png" alt="" fill sizes="220px" className="object-contain drop-shadow-2xl" />
          </div>
          <MilkSplash className="absolute -bottom-[8%] left-1/2 h-[36%] w-[260%] -translate-x-1/2" />
        </div>
      </div>
    </Studio>,
    // 3 · Achar
    <Studio key="achar" tone="espresso">
      <div className="container-x grid min-h-[620px] items-center gap-6 py-14 md:min-h-[600px] md:grid-cols-2">
        <SlideText s={p.slides[2]} primary={href('/shop/achar')} secondary={href('/shop')} />
        <div className="relative mx-auto flex h-[300px] w-full max-w-md items-end justify-center gap-2 self-end md:h-[420px]" aria-hidden="true">
          {['kaccha-mango-achar', 'mix-veg-achar', 'garlic-achar'].map((n, i) => (
            <div key={n} className={`relative w-1/3 ${i === 1 ? 'h-[92%]' : 'h-[74%]'}`}>
              <div className="animate-float-wide relative h-full w-full" style={{ animationDelay: `${-i * 1.4}s` }}>
                <Image src={`/images/${n}-cutout.png`} alt="" fill sizes="160px" className="object-contain drop-shadow-2xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Studio>,
  ]

  return (
    <>
      <HeroCarousel slides={slides} />

      {/* Trust row */}
      <section className="border-b border-line bg-cream">
        <ul className="container-x grid grid-cols-2 divide-line py-6 md:grid-cols-4 md:divide-x">
          {p.trust.map((item, i) => (
            <li key={item} className="flex flex-col items-center gap-2 px-3 py-2 text-center">
              <Icon name={trustIcons[i]} size={30} className="text-gold-700" />
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-walnut">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Bestsellers */}
      {featured.length > 0 && (
        <section className="container-x py-20">
          <Heading eyebrow={p.bestsellersEyebrow} title={p.bestsellers} />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-7">
            {featured.map((prod) => <ProductCard key={prod.id} product={prod} locale={locale} />)}
          </div>
          <div className="mt-12 text-center">
            <Link href={href('/shop')} className="btn btn-outline !rounded-full !px-10 uppercase tracking-[0.16em]">{t.common.viewAll}</Link>
          </div>
        </section>
      )}

      {/* The Art of Slow */}
      <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_80%_50%,#6b4526_0%,#3b2415_45%,#1c100a_100%)] py-20 text-cream">
        <div className="container-x grid items-center gap-10 lg:grid-cols-[1.4fr_0.6fr]">
          <div>
            <Heading eyebrow={p.artEyebrow} title={p.artTitle} light />
            <ol className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3">
              {p.artSteps.map((step, i) => (
                <li key={step} className="flex flex-col items-center text-center">
                  <span className="grid h-20 w-20 place-items-center rounded-full border border-cream/40 text-cream">
                    <Icon name={artIcons[i]} size={36} />
                  </span>
                  <span className="mt-3 text-[11px] font-medium uppercase tracking-[0.18em] text-gold-500">{String(i + 1).padStart(2, '0')}</span>
                  <span className="mt-1 max-w-[12rem] font-serif text-xl leading-tight">{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="relative mx-auto h-80 w-60 lg:h-[420px] lg:w-72" aria-hidden="true">
            <div className="animate-float-wide relative h-full w-full">
              <Image src="/images/ghee-cutout.png" alt="" fill sizes="300px" className="object-contain drop-shadow-2xl" />
            </div>
            <div className="animate-float-shadow mx-auto -mt-2 h-4 w-2/3 rounded-full bg-black/50 blur-md" />
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="container-x py-20">
        <Heading eyebrow={p.collectionsEyebrow} title={p.collections} />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <li key={c.id}>
              <Link href={href(`/shop/${c.slug}`)} className="group block overflow-hidden bg-cream shadow-card transition hover:shadow-lift">
                <span className="relative block aspect-[4/5] bg-[radial-gradient(circle_at_50%_40%,#f1dcae,#e6d2b0_60%,#d8c29f)]">
                  {mediaUrl(c.bannerImage, 'card') && (
                    <Image src={mediaUrl(c.bannerImage, 'card') as string} alt="" fill sizes="(max-width: 640px) 100vw, 25vw" className="object-contain p-10 transition duration-700 group-hover:-translate-y-2 group-hover:scale-105" />
                  )}
                </span>
                <span className="block border-t border-line p-5 text-center">
                  <span className="block font-serif text-2xl font-semibold text-walnut">{c.title}</span>
                  {c.tagline && <span className="mt-1 block text-sm text-muted">{c.tagline}</span>}
                  <span className="mt-3 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-gold-700">
                    {p.shopNow} <Icon name="arrow" size={14} />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Purity is a tradition: Amrit vs regular */}
      {comparison.length > 0 && (
        <section className="bg-[linear-gradient(180deg,#3b2415,#1c100a)] py-20 text-cream">
          <div className="container-x">
            <Heading eyebrow={p.compareEyebrow} title={p.compareTitle} light />
            <div className="relative grid gap-10 md:grid-cols-2">
              <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden border-l-2 border-dashed border-cream/40 md:block" aria-hidden="true" />
              <div className="flex flex-col items-center text-center">
                <p className="flex items-center gap-2 font-serif text-3xl">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-success"><Icon name="check" size={16} /></span> {p.ours}
                </p>
                <ul className="mt-5 space-y-2 text-lg text-cream/90">{comparison.map((c) => <li key={c.id}>{c.ours}</li>)}</ul>
                <div className="relative mt-8 h-56 w-44">
                  <div className="animate-float-wide relative h-full w-full">
                    <Image src="/images/ghee-cutout.png" alt="" fill sizes="180px" className="object-contain drop-shadow-2xl" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center text-center text-cream/75">
                <p className="flex items-center gap-2 font-serif text-3xl">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-error text-cream"><Icon name="close" size={16} /></span> {p.regular}
                </p>
                <ul className="mt-5 space-y-2 text-lg">{comparison.map((c) => <li key={c.id}>{c.regular}</li>)}</ul>
                <div className="mt-8 h-44 w-36 opacity-90"><PlasticTub /></div>
              </div>
            </div>
            <div className="mt-12 text-center">
              <Link href={href('/products/desi-cow-golden-ghee')} className="btn btn-gold !rounded-full !px-10 uppercase tracking-[0.14em]">{t.home.bilonaCta}</Link>
            </div>
          </div>
        </section>
      )}

      {/* Our herd */}
      <section className="container-x py-20">
        <Heading eyebrow={p.herdEyebrow} title={p.herdTitle} />
        <p className="mx-auto -mt-6 mb-12 max-w-2xl text-center text-lg text-muted">{t.home.farmText}</p>
        <ul className="flex flex-wrap justify-center gap-8">
          {farmBreeds.map((b) => (
            <li key={b.id}>
              <Link href={href(`/desi-cows/${b.slug}`)} className="group flex w-36 flex-col items-center text-center md:w-44">
                <span className="relative block h-36 w-36 overflow-hidden rounded-full border border-gold-500 bg-cream p-1 md:h-44 md:w-44">
                  <span className="relative block h-full w-full overflow-hidden rounded-full bg-latte">
                    {mediaUrl(b.image, 'card') && <Image src={mediaUrl(b.image, 'card') as string} alt={`${b.name} cow`} fill sizes="180px" className="object-contain transition duration-500 group-hover:scale-110" />}
                  </span>
                </span>
                <span className="mt-4 font-serif text-2xl font-semibold text-walnut">{b.name}</span>
                {b.origin && <span className="text-xs uppercase tracking-[0.12em] text-muted">{b.origin}</span>}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-12 text-center">
          <Link href={href('/desi-cows')} className="btn btn-outline !rounded-full !px-10 uppercase tracking-[0.16em]">{t.home.allBreeds}</Link>
        </div>
      </section>

      {/* Reviews: only real ones, once there are at least 3 */}
      {reviews.length >= 3 && (
        <section className="bg-cream py-20">
          <div className="container-x">
            <Heading eyebrow="★★★★★" title={t.home.reviewsTitle} />
            <ul className="grid gap-6 md:grid-cols-3">
              {reviews.slice(0, 6).map((r) => (
                <li key={r.id} className="border border-line bg-parchment p-8 text-center">
                  <p className="text-gold-500" aria-label={`${r.rating} / 5`}>{'★'.repeat(r.rating ?? 5)}</p>
                  <blockquote className="mt-3 font-serif text-xl italic">“{r.quote}”</blockquote>
                  <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted">{r.name}{r.locality ? ` · ${r.locality}` : ''}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Delivery */}
      <section className="bg-cream py-20">
        <div className="container-x grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-gold-700">{t.nav.delivery}</p>
            <h2 className="mt-3 text-4xl uppercase tracking-[0.05em] !text-walnut md:text-5xl">{t.home.deliveryTitle}</h2>
            <p className="mt-4 text-lg text-muted">{t.home.deliveryText}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {liveAreas.map((a) => (
                <li key={a.id}>
                  <Link href={href(`/delivery/${a.slug}`)} className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm text-walnut hover:border-walnut">
                    <Icon name="map" size={16} className="text-gold-700" /> {a.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-line bg-parchment p-6 md:p-8">
            <p className="mb-3 font-serif text-2xl text-walnut">{t.home.checkDelivery}</p>
            <PincodeChecker compact />
          </div>
        </div>
      </section>

      {/* Journal */}
      {posts.length > 0 && (
        <section className="container-x py-20">
          <Heading eyebrow={p.journalEyebrow} title={p.journal} />
          <ul className="grid gap-8 md:grid-cols-3">
            {posts.map((post) => (
              <li key={post.id}>
                <Link href={href(`/blog/${post.slug}`)} className="group block">
                  <span className="relative block aspect-[4/3] overflow-hidden bg-latte">
                    {mediaUrl(post.cover, 'card') && <Image src={mediaUrl(post.cover, 'card') as string} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" />}
                  </span>
                  <span className="mt-5 block text-xs uppercase tracking-[0.2em] text-gold-700">{t.blog.categories[post.category]} · {formatDate(post.publishedAt, locale)}</span>
                  <span className="mt-2 block font-serif text-2xl font-semibold leading-snug text-walnut group-hover:text-gold-700">{post.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <FAQ locale={locale} faqs={faqs.map((f) => ({ question: f.question, answer: f.answer }))} />

      {/* WhatsApp */}
      <section className="bg-walnut py-16 text-center text-cream">
        <div className="container-x">
          <h2 className="text-3xl uppercase tracking-[0.05em] !text-cream md:text-5xl">{t.home.whatsappTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-cream/80">{t.home.whatsappText}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={whatsappLink(settings.ordersPhone, 'Hi Amrit Dairy, I want to place an order.')} target="_blank" rel="noopener" className="btn btn-gold !rounded-full !px-8 uppercase tracking-[0.14em]">
              <Icon name="whatsapp" /> {t.common.whatsappUs}
            </a>
            <a href={telLink(settings.ordersPhone)} className="btn btn-outline-light !rounded-full !px-8 uppercase tracking-[0.14em]">
              <Icon name="phone" /> {t.common.callUs}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
