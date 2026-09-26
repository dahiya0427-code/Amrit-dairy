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
import { categoryCutout, toneOf, tones, type Tone } from '@/lib/tone'
import { telLink, whatsappLink } from '@/lib/site'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return buildMetadata({ locale, path: '/' })
}

const artIcons = ['cow', 'milk', 'flame', 'pot', 'churn', 'drop']
const trustIcons = ['cow', 'churn', 'jar', 'shield']
const trustTones: Tone[] = ['ghee', 'milk', 'chilli', 'leaf']
const herdTones: Tone[] = ['ghee', 'milk', 'chilli', 'honey', 'leaf']

/** Section heading: coloured eyebrow pill over a big display title. */
function Heading({ eyebrow, title, tone = 'ghee', dark = false }: { eyebrow: string; title: string; tone?: Tone; dark?: boolean }) {
  return (
    <div className="mb-12 text-center">
      <p className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] ${dark ? 'bg-ink/10 text-ink' : `${tones[tone].soft} ${tones[tone].text}`}`}>
        <Icon name="sparkle" size={14} /> {eyebrow}
      </p>
      <h2 className={`mx-auto mt-4 max-w-3xl text-4xl leading-[1.02] md:text-6xl ${dark ? '!text-ink' : ''}`}>{title}</h2>
    </div>
  )
}

/** Hero stage: near-black with a big disc of the product's colour behind it. */
function Stage({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <div className="relative min-h-[680px] overflow-hidden bg-coal md:min-h-[620px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgb(255_255_255/0.06),transparent_40%)]" aria-hidden="true" />
      {children}
    </div>
  )
}

/** The coloured disc + dashed orbit the hero product floats on. */
function Disc({ tone }: { tone: Tone }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-items-center">
      <div className={`absolute aspect-square w-[88%] max-w-[520px] rounded-full border-2 border-dashed opacity-40 ${tones[tone].border}`} />
      <div className={`absolute aspect-square w-[72%] max-w-[430px] rounded-full ${tones[tone].bg} shadow-[0_0_120px_rgb(0_0_0/0.4)]`}>
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgb(255_255_255/0.45),transparent_55%)]" />
      </div>
      <span className={`absolute right-[8%] top-[10%] h-6 w-6 rounded-full ${tones[tone].bg} animate-float`} />
      <span className="absolute bottom-[16%] left-[6%] h-3 w-3 rounded-full bg-cream/70 animate-float [animation-delay:-2s]" />
    </div>
  )
}

function SlideText({ s, tone, price, primary, secondary, hindiLine, as: H = 'h2' }: { s: { eyebrow: string; title: string; sub: string; cta: string; cta2: string }; tone: Tone; price?: string; primary: string; secondary: string; hindiLine?: string; as?: 'h1' | 'h2' }) {
  const c = tones[tone]
  return (
    <div className="relative z-10 max-w-xl">
      <p className={`inline-flex rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] ${c.soft} ${c.text}`}>{s.eyebrow}</p>
      {hindiLine && <p lang="hi" className="mt-5 font-serif text-2xl text-cream/80 md:text-3xl">{hindiLine}</p>}
      <H className="mt-3 text-6xl leading-[0.92] md:text-8xl">{s.title}</H>
      <p className="mt-5 max-w-md text-lg text-muted">{s.sub}</p>
      {price && <p className={`mt-4 font-serif text-3xl font-bold ${c.text}`}>{price}</p>}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={primary} className={`btn !px-8 text-ink hover:brightness-110 ${c.bg}`}>{s.cta} <Icon name="arrow" size={18} /></Link>
        <Link href={secondary} className="btn btn-outline !px-8">{s.cta2}</Link>
      </div>
    </div>
  )
}

/** A generic plastic tub for the "regular ghee" side of the comparison. */
function PlasticTub() {
  return (
    <svg viewBox="0 0 120 130" className="h-full w-full" aria-hidden="true">
      <rect x="18" y="8" width="84" height="18" rx="4" fill="#5b544d" />
      <path d="M22 26h76l-6 94a6 6 0 0 1-6 6H34a6 6 0 0 1-6-6Z" fill="#8a8178" />
      <path d="M26 40h68" stroke="#6d655d" strokeWidth="3" />
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
    <Stage key="ghee" tone="ghee">
      <div className="container-x grid min-h-[680px] items-center gap-4 py-14 md:min-h-[620px] md:grid-cols-2">
        <SlideText
          as="h1"
          tone="ghee"
          s={p.slides[0]}
          hindiLine={t.home.heroHindi}
          price={gheePrice ? `${formatINR(gheePrice)} · 1 kg` : undefined}
          primary={href('/products/desi-cow-golden-ghee')}
          secondary={href('/farm-story')}
        />
        <HeroParallax className="relative mx-auto h-[340px] w-full max-w-lg md:h-[540px]">
          <Disc tone="ghee" />
          <div aria-hidden="true" className="absolute inset-0">
            <div data-depth="0.6" className="parallax-layer absolute bottom-[14%] left-[6%] h-[42%] w-[30%]">
              <div className="animate-rise h-full w-full [animation-delay:0.25s]">
                <div className="animate-float-wide relative h-full w-full [animation-delay:-1.6s]">
                  <Image src="/images/honey-cutout.png" alt="" fill sizes="160px" className="object-contain drop-shadow-[0_20px_25px_rgb(0_0_0/0.5)]" />
                </div>
              </div>
            </div>
            <div data-depth="1.1" className="parallax-layer absolute bottom-[10%] left-[27%] h-[78%] w-[50%]">
              <div className="animate-rise h-full w-full">
                <div className="animate-float-wide relative h-full w-full">
                  <Image src="/images/ghee-cutout.png" alt="Amrit Desi Cow Golden Ghee" fill priority sizes="(max-width: 768px) 50vw, 25vw" className="object-contain drop-shadow-[0_24px_30px_rgb(0_0_0/0.55)]" />
                </div>
              </div>
            </div>
          </div>
        </HeroParallax>
      </div>
    </Stage>,
    // 2 · Milk with splash
    <Stage key="milk" tone="milk">
      <div className="container-x grid min-h-[680px] items-center gap-4 py-14 md:min-h-[620px] md:grid-cols-2">
        <SlideText tone="milk" s={p.slides[1]} primary={href('/subscribe')} secondary={href('/delivery')} />
        <div className="relative mx-auto h-[340px] w-full max-w-lg md:h-[540px]" aria-hidden="true">
          <Disc tone="milk" />
          <div className="absolute bottom-[12%] left-1/2 h-[76%] w-[32%] -translate-x-1/2">
            <div className="animate-float-wide relative h-full w-full">
              <Image src="/images/milk-cutout.png" alt="" fill sizes="220px" className="object-contain drop-shadow-[0_24px_30px_rgb(0_0_0/0.5)]" />
            </div>
            <MilkSplash className="absolute -bottom-[8%] left-1/2 h-[36%] w-[260%] -translate-x-1/2" />
          </div>
        </div>
      </div>
    </Stage>,
    // 3 · Achar
    <Stage key="achar" tone="chilli">
      <div className="container-x grid min-h-[680px] items-center gap-4 py-14 md:min-h-[620px] md:grid-cols-2">
        <SlideText tone="chilli" s={p.slides[2]} primary={href('/shop/achar')} secondary={href('/shop')} />
        <div className="relative mx-auto h-[340px] w-full max-w-lg md:h-[540px]" aria-hidden="true">
          <Disc tone="chilli" />
          <div className="absolute inset-x-[10%] bottom-[16%] flex h-[62%] items-end justify-center gap-1">
            {['kaccha-mango-achar', 'mix-veg-achar', 'garlic-achar'].map((n, i) => (
              <div key={n} className={`relative w-1/3 ${i === 1 ? 'h-full' : 'h-[80%]'}`}>
                <div className="animate-float-wide relative h-full w-full" style={{ animationDelay: `${-i * 1.4}s` }}>
                  <Image src={`/images/${n}-cutout.png`} alt="" fill sizes="160px" className="object-contain drop-shadow-[0_20px_25px_rgb(0_0_0/0.5)]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Stage>,
  ]
  const marquee = [...t.home.marquee, ...t.home.marquee]

  return (
    <>
      <HeroCarousel slides={slides} />

      {/* Tilted marquee band */}
      <div className="relative z-10 -my-3 -rotate-1 overflow-hidden bg-gold-500 py-3 text-ink shadow-float" aria-hidden="true">
        <ul className="animate-marquee flex w-max gap-8 whitespace-nowrap font-serif text-2xl font-bold">
          {[...marquee, ...marquee].map((m, i) => (
            <li key={i} className="flex items-center gap-8">{m} <Icon name="sparkle" size={20} /></li>
          ))}
        </ul>
      </div>

      {/* Trust row */}
      <section className="container-x pt-20">
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {p.trust.map((item, i) => (
            <li key={item} className="flex flex-col items-start gap-3 rounded-3xl border border-line bg-char p-4 sm:flex-row sm:items-center sm:gap-4 md:p-5">
              <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-ink md:h-14 md:w-14 ${tones[trustTones[i]].bg}`}>
                <Icon name={trustIcons[i]} size={28} />
              </span>
              <span className="font-serif text-lg font-semibold leading-tight">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Bestsellers */}
      {featured.length > 0 && (
        <section className="container-x py-20">
          <Heading eyebrow={p.bestsellersEyebrow} title={p.bestsellers} />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {featured.map((prod) => <ProductCard key={prod.id} product={prod} locale={locale} />)}
          </div>
          <div className="mt-12 text-center">
            <Link href={href('/shop')} className="btn btn-outline !px-10">{t.common.viewAll} <Icon name="arrow" size={18} /></Link>
          </div>
        </section>
      )}

      {/* The Art of Slow: a bright ghee-yellow block */}
      <section className="px-3 sm:px-6">
        <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[40px] bg-ghee py-16 text-ink md:py-20">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-honey/60" aria-hidden="true" />
          <div className="absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-cream/40" aria-hidden="true" />
          <div className="container-x relative grid items-center gap-10 lg:grid-cols-[1.4fr_0.6fr]">
            <div>
              <Heading eyebrow={p.artEyebrow} title={p.artTitle} dark />
              <ol className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3">
                {p.artSteps.map((step, i) => (
                  <li key={step} className="flex flex-col items-center text-center">
                    <span className="relative grid h-20 w-20 place-items-center rounded-full bg-ink text-ghee">
                      <Icon name={artIcons[i]} size={34} />
                      <span className="absolute -right-1 -top-1 grid h-7 w-7 place-items-center rounded-full bg-cream text-xs font-bold text-ink">{i + 1}</span>
                    </span>
                    <span className="mt-3 max-w-[12rem] font-serif text-xl font-semibold leading-tight">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="relative mx-auto h-80 w-60 lg:h-[440px] lg:w-72" aria-hidden="true">
              <div className="absolute inset-[8%] rounded-full bg-cream/50 blur-2xl" />
              <div className="animate-float-wide relative h-full w-full">
                <Image src="/images/ghee-cutout.png" alt="" fill sizes="300px" className="object-contain drop-shadow-[0_24px_30px_rgb(0_0_0/0.35)]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collections: one bold colour each */}
      <section className="container-x py-20">
        <Heading eyebrow={p.collectionsEyebrow} title={p.collections} tone="milk" />
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
          {categories.map((c, i) => {
            const tone = tones[toneOf(c.slug)]
            const cut = categoryCutout[c.slug] ?? mediaUrl(c.bannerImage, 'card')
            return (
              <li key={c.id}>
                <Link href={href(`/shop/${c.slug}`)} className={`group relative flex aspect-[4/5] flex-col overflow-hidden rounded-[28px] p-5 text-ink transition duration-300 hover:-translate-y-1 hover:shadow-lift ${tone.bg} ${i % 2 ? 'lg:mt-8' : ''}`}>
                  <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgb(255_255_255/0.4),transparent_60%)]" aria-hidden="true" />
                  <span className="relative font-serif text-2xl font-bold leading-tight md:text-3xl">{c.title}</span>
                  {c.tagline && <span className="relative mt-1 hidden text-sm font-medium text-ink/75 sm:block">{c.tagline}</span>}
                  {cut && (
                    <span className="relative mt-2 flex-1">
                      <Image src={cut} alt="" fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-contain drop-shadow-[0_18px_22px_rgb(0_0_0/0.3)] transition duration-500 group-hover:-rotate-3 group-hover:scale-110" />
                    </span>
                  )}
                  <span className="relative mt-2 inline-flex items-center gap-2 self-start rounded-full bg-ink px-4 py-2 text-sm font-semibold text-cream">
                    {p.shopNow} <Icon name="arrow" size={16} />
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      {/* Purity is a tradition: Amrit vs regular */}
      {comparison.length > 0 && (
        <section className="container-x pb-20">
          <Heading eyebrow={p.compareEyebrow} title={p.compareTitle} tone="chilli" />
          <div className="grid gap-5 md:grid-cols-2">
            <div className="relative overflow-hidden rounded-[32px] border-2 border-ghee bg-char p-7 md:p-10">
              <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-ghee/20 blur-2xl" aria-hidden="true" />
              <p className="relative flex items-center gap-3 font-serif text-3xl font-bold text-ghee">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-leaf text-ink"><Icon name="check" size={20} /></span> {p.ours}
              </p>
              <div className="relative mt-6 grid grid-cols-[1fr_auto] items-end gap-4">
                <ul className="space-y-3 text-lg">{comparison.map((c) => <li key={c.id} className="flex gap-2"><Icon name="check" size={20} className="mt-1 shrink-0 text-leaf" />{c.ours}</li>)}</ul>
                <div className="relative h-44 w-32 md:h-56 md:w-40" aria-hidden="true">
                  <div className="animate-float-wide relative h-full w-full">
                    <Image src="/images/ghee-cutout.png" alt="" fill sizes="160px" className="object-contain drop-shadow-2xl" />
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-[32px] border border-line bg-char/60 p-7 text-muted md:p-10">
              <p className="flex items-center gap-3 font-serif text-3xl font-bold">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-error text-ink"><Icon name="close" size={20} /></span> {p.regular}
              </p>
              <div className="mt-6 grid grid-cols-[1fr_auto] items-end gap-4">
                <ul className="space-y-3 text-lg">{comparison.map((c) => <li key={c.id} className="flex gap-2"><Icon name="close" size={20} className="mt-1 shrink-0 text-error" />{c.regular}</li>)}</ul>
                <div className="h-36 w-28 opacity-80"><PlasticTub /></div>
              </div>
            </div>
          </div>
          <div className="mt-10 text-center">
            <Link href={href('/products/desi-cow-golden-ghee')} className="btn btn-gold !px-10">{t.home.bilonaCta} <Icon name="arrow" size={18} /></Link>
          </div>
        </section>
      )}

      {/* Our herd */}
      <section className="border-y border-line bg-char py-20">
        <div className="container-x">
          <Heading eyebrow={p.herdEyebrow} title={p.herdTitle} tone="leaf" />
          <p className="mx-auto -mt-6 mb-12 max-w-2xl text-center text-lg text-muted">{t.home.farmText}</p>
          <ul className="flex flex-wrap justify-center gap-6 md:gap-10">
            {farmBreeds.map((b, i) => (
              <li key={b.id}>
                <Link href={href(`/desi-cows/${b.slug}`)} className="group flex w-36 flex-col items-center text-center md:w-44">
                  <span className={`relative block h-36 w-36 rounded-full ring-4 ring-offset-4 ring-offset-char md:h-44 md:w-44 ${tones[herdTones[i % herdTones.length]].ring}`}>
                    <span className="relative block h-full w-full overflow-hidden rounded-full bg-paper">
                      {mediaUrl(b.image, 'card') && <Image src={mediaUrl(b.image, 'card') as string} alt={`${b.name} cow`} fill sizes="180px" className="object-contain transition duration-500 group-hover:scale-110" />}
                    </span>
                  </span>
                  <span className="mt-5 font-serif text-2xl font-bold">{b.name}</span>
                  {b.origin && <span className="text-xs uppercase tracking-[0.12em] text-muted">{b.origin}</span>}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-12 text-center">
            <Link href={href('/desi-cows')} className="btn btn-outline !px-10">{t.home.allBreeds} <Icon name="arrow" size={18} /></Link>
          </div>
        </div>
      </section>

      {/* Reviews: only real ones, once there are at least 3 */}
      {reviews.length >= 3 && (
        <section className="container-x py-20">
          <Heading eyebrow="★★★★★" title={t.home.reviewsTitle} tone="honey" />
          <ul className="grid gap-5 md:grid-cols-3">
            {reviews.slice(0, 6).map((r) => (
              <li key={r.id} className="rounded-[28px] border border-line bg-char p-8">
                <p className="text-gold-500" aria-label={`${r.rating} / 5`}>{'★'.repeat(r.rating ?? 5)}</p>
                <blockquote className="mt-3 font-serif text-xl">“{r.quote}”</blockquote>
                <p className="mt-4 text-sm font-semibold text-muted">{r.name}{r.locality ? ` · ${r.locality}` : ''}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Delivery: a sky-blue block */}
      <section className="px-3 py-20 sm:px-6">
        <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[40px] bg-milk py-14 text-ink md:py-16">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-cream/35" aria-hidden="true" />
          <div className="container-x relative grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="inline-flex rounded-full bg-ink/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em]">{t.nav.delivery}</p>
              <h2 className="mt-4 text-4xl leading-[1.02] !text-ink md:text-6xl">{t.home.deliveryTitle}</h2>
              <p className="mt-4 text-lg text-ink/80">{t.home.deliveryText}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {liveAreas.map((a) => (
                  <li key={a.id}>
                    <Link href={href(`/delivery/${a.slug}`)} className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-cream hover:bg-ink/85">
                      <Icon name="map" size={16} className="text-milk" /> {a.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[28px] bg-coal p-6 text-cream shadow-float md:p-8">
              <p className="mb-3 font-serif text-2xl font-bold">{t.home.checkDelivery}</p>
              <PincodeChecker compact />
            </div>
          </div>
        </div>
      </section>

      {/* Journal */}
      {posts.length > 0 && (
        <section className="container-x pb-20">
          <Heading eyebrow={p.journalEyebrow} title={p.journal} tone="honey" />
          <ul className="grid gap-5 md:grid-cols-3">
            {posts.map((post) => (
              <li key={post.id}>
                <Link href={href(`/blog/${post.slug}`)} className="group block overflow-hidden rounded-[28px] border border-line bg-char transition hover:shadow-lift">
                  <span className="relative block aspect-[4/3] overflow-hidden bg-smoke">
                    {mediaUrl(post.cover, 'card') && <Image src={mediaUrl(post.cover, 'card') as string} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" />}
                  </span>
                  <span className="block p-6">
                    <span className="block text-xs font-bold uppercase tracking-[0.16em] text-honey">{t.blog.categories[post.category]} · {formatDate(post.publishedAt, locale)}</span>
                    <span className="mt-2 block font-serif text-2xl font-bold leading-snug group-hover:text-gold-500">{post.title}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <FAQ locale={locale} faqs={faqs.map((f) => ({ question: f.question, answer: f.answer }))} />

      {/* WhatsApp: a green block */}
      <section className="px-3 pb-16 sm:px-6">
        <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[40px] bg-leaf px-4 py-14 text-center text-ink">
          <div className="absolute -right-16 -bottom-16 h-56 w-56 rounded-full bg-cream/30" aria-hidden="true" />
          <h2 className="relative mx-auto max-w-3xl text-4xl leading-[1.02] !text-ink md:text-6xl">{t.home.whatsappTitle}</h2>
          <p className="relative mx-auto mt-4 max-w-2xl text-lg text-ink/80">{t.home.whatsappText}</p>
          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={whatsappLink(settings.ordersPhone, 'Hi Amrit Dairy, I want to place an order.')} target="_blank" rel="noopener" className="btn bg-ink !px-8 text-cream hover:bg-ink/85">
              <Icon name="whatsapp" /> {t.common.whatsappUs}
            </a>
            <a href={telLink(settings.ordersPhone)} className="btn border-2 border-ink !px-8 text-ink hover:bg-ink/10">
              <Icon name="phone" /> {t.common.callUs}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
