import Image from 'next/image'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import { localePath } from '@/i18n/config'
import { getDictionary } from '@/i18n'
import type { Category, Product } from '@/payload-types'
import { mediaUrl } from '@/lib/media'
import { buyableVariants } from '@/lib/product'
import { whatsappLink } from '@/lib/site'
import { categoryCutout, toneOf, tones } from '@/lib/tone'
import { Icon } from './Icon'
import { MilkSplash } from './MilkSplash'
import { ProductCard } from './ProductCard'
import { Breadcrumbs, FAQ } from './ui'

export function ShopView({
  locale,
  categories,
  products,
  active,
  type,
  whatsapp,
}: {
  locale: Locale
  categories: Category[]
  products: Product[]
  active?: Category | null
  type?: 'local' | 'ship'
  whatsapp: string
}) {
  const t = getDictionary(locale)
  // Two sections: what can be ordered now, and what is not available yet.
  const isAvailable = (p: Product) => p.status === 'active' && buyableVariants(p).length > 0
  const available = products.filter(isAvailable)
  const soon = products.filter((p) => !isAvailable(p))
  const base = active ? `/shop/${active.slug}` : '/shop'
  const bannerSrc = (active && categoryCutout[active.slug]) || mediaUrl(active?.bannerImage, 'card') || '/images/ghee-cutout.png'
  const tone = tones[toneOf(active?.slug)]
  const chip = (on: boolean) =>
    `inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-semibold transition ${on ? 'border-gold-500 bg-gold-500 text-ink' : 'border-line bg-char hover:border-gold-500'}`

  return (
    <>
      <Breadcrumbs locale={locale} items={active ? [{ name: t.nav.shop, path: '/shop' }, { name: active.title, path: base }] : [{ name: t.nav.shop, path: '/shop' }]} />
      {/* Collection banner: tagline, pills and a floating product */}
      <section className="container-x pt-4">
        <div className={`relative overflow-hidden rounded-[36px] text-ink ${tone.bg}`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_40%,rgb(255_255_255/0.45),transparent_45%)]" aria-hidden="true" />
          <div className="absolute -left-16 -bottom-24 h-64 w-64 rounded-full bg-ink/10" aria-hidden="true" />
          <div className="relative grid items-center gap-4 p-7 md:grid-cols-[1.3fr_1fr] md:p-12">
            <div className="relative z-10">
              <p className="inline-flex rounded-full bg-ink/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em]">{active?.secondaryTitle ?? t.nav.shop}</p>
              <h1 className="mt-3 text-5xl leading-[0.95] !text-ink md:text-7xl">{active?.title ?? t.shop.title}</h1>
              {active?.tagline && <p className="mt-3 font-serif text-2xl font-semibold md:text-3xl">{active.tagline}</p>}
              <p className="mt-3 max-w-xl text-lg text-ink/80">{active?.intro ?? t.shop.intro}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {(active?.pills?.length ? active.pills.map((p) => p.text) : t.heroPills).map((pill) => (
                  <li key={pill} className="rounded-full bg-ink px-4 py-1.5 text-sm font-semibold text-snow">{pill}</li>
                ))}
              </ul>
            </div>
            <div className="relative mx-auto h-56 w-full max-w-xs md:h-72" aria-hidden="true">
              <div className="absolute inset-[6%] rounded-full bg-snow/55" />
              <div className="animate-float relative h-full w-full">
                <Image src={bannerSrc} alt="" fill sizes="320px" className="object-contain drop-shadow-[0_20px_25px_rgb(0_0_0/0.35)]" priority />
              </div>
              {active?.slug === 'dairy' && <MilkSplash duration="4.5s" className="absolute -bottom-[8%] left-1/2 h-[30%] w-[70%] -translate-x-1/2" />}
            </div>
          </div>
        </div>
      </section>

      <section className="container-x pb-6 pt-6">
        <nav aria-label={t.nav.shop} className="-mx-4 mt-6 overflow-x-auto px-4">
          <ul className="flex w-max gap-2">
            <li><Link href={localePath(locale, '/shop')} className={chip(!active)}>{t.shop.all}</Link></li>
            {categories.map((c) => (
              <li key={c.id}><Link href={localePath(locale, `/shop/${c.slug}`)} className={chip(active?.id === c.id)}>{c.title}</Link></li>
            ))}
          </ul>
        </nav>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-y border-line py-3">
          <ul className="flex flex-wrap gap-2 text-sm" aria-label="Filter">
            <li><Link href={localePath(locale, base)} className={chip(!type)}>{t.shop.filterAll}</Link></li>
            <li><Link href={`${localePath(locale, base)}?type=local`} className={chip(type === 'local')}>{t.shop.filterLocal}</Link></li>
            <li><Link href={`${localePath(locale, base)}?type=ship`} className={chip(type === 'ship')}>{t.shop.filterShip}</Link></li>
          </ul>
          <p className="text-sm text-muted">{t.shop.count(products.length)}</p>
        </div>
      </section>

      <section className="container-x">
        {products.length ? (
          <>
            {available.length > 0 && (
              <div>
                <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
                  <h2 className="flex items-center gap-3 text-2xl md:text-3xl">
                    <span className="h-3 w-3 rounded-full bg-success" aria-hidden="true" /> {t.shop.availableTitle}
                    <span className="text-base font-normal normal-case text-muted">({available.length})</span>
                  </h2>
                  <p className="text-sm text-muted">{t.shop.availableText}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
                  {available.map((p, i) => <ProductCard key={p.id} product={p} locale={locale} priority={i < 4} />)}
                </div>
              </div>
            )}
            {soon.length > 0 && (
              <div className={available.length ? 'mt-14 border-t border-line pt-10' : ''}>
                <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
                  <h2 className="flex items-center gap-3 text-2xl md:text-3xl">
                    <span className="h-3 w-3 rounded-full bg-gold-500" aria-hidden="true" /> {t.shop.soonTitle}
                    <span className="text-base font-normal normal-case text-muted">({soon.length})</span>
                  </h2>
                  <p className="max-w-md text-sm text-muted">{t.shop.soonText}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
                  {soon.map((p) => <ProductCard key={p.id} product={p} locale={locale} />)}
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="py-10 text-center text-muted">{t.shop.empty}</p>
        )}

        <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-lg bg-latte p-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-serif text-xl font-semibold text-cream">{t.shop.helpTitle}</p>
            <p className="text-muted">{t.shop.helpText}</p>
          </div>
          <a href={whatsappLink(whatsapp, 'Hi Amrit Dairy, please help me choose products.')} target="_blank" rel="noopener" className="btn btn-whatsapp">
            <Icon name="whatsapp" /> {t.common.whatsappUs}
          </a>
        </div>
      </section>

      {active?.faqs && active.faqs.length > 0 && <FAQ locale={locale} faqs={active.faqs} />}
    </>
  )
}
