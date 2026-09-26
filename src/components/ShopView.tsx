import Image from 'next/image'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import { localePath } from '@/i18n/config'
import { getDictionary } from '@/i18n'
import type { Category, Product } from '@/payload-types'
import { mediaUrl } from '@/lib/media'
import { whatsappLink } from '@/lib/site'
import { Icon } from './Icon'
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
  const base = active ? `/shop/${active.slug}` : '/shop'
  const bannerSrc = mediaUrl(active?.bannerImage, 'card') ?? '/images/ghee-cutout.png'
  const chip = (on: boolean) =>
    `inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-semibold transition ${on ? 'border-forest-900 bg-forest-900 text-cream' : 'border-line bg-white hover:border-forest-900'}`

  return (
    <>
      <Breadcrumbs locale={locale} items={active ? [{ name: t.nav.shop, path: '/shop' }, { name: active.title, path: base }] : [{ name: t.nav.shop, path: '/shop' }]} />
      {/* Collection banner: tagline, pills and a floating product */}
      <section className="container-x pt-4">
        <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(120deg,#fbebc7,#f6efdd_45%,#eaf1e4)]">
          <div className="grid items-center gap-4 p-6 md:grid-cols-[1.3fr_1fr] md:p-10">
            <div className="relative z-10">
              <p className="eyebrow">{active?.secondaryTitle ?? t.nav.shop}</p>
              <h1 className="mt-1 text-4xl md:text-6xl">{active?.title ?? t.shop.title}</h1>
              {active?.tagline && <p className="mt-2 font-serif text-2xl text-leaf-600 md:text-3xl">{active.tagline}</p>}
              <p className="mt-3 max-w-xl text-lg text-muted">{active?.intro ?? t.shop.intro}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {(active?.pills?.length ? active.pills.map((p) => p.text) : t.heroPills).map((pill) => (
                  <li key={pill} className="rounded-full bg-forest-900 px-3.5 py-1.5 text-sm font-semibold text-cream">{pill}</li>
                ))}
              </ul>
            </div>
            <div className="relative mx-auto h-48 w-full max-w-xs md:h-64" aria-hidden="true">
              <div className="absolute inset-[10%] rounded-full bg-gold-500/30 blur-2xl" />
              <div className="animate-float relative h-full w-full">
                <Image src={bannerSrc} alt="" fill sizes="320px" className="object-contain drop-shadow-2xl" priority />
              </div>
            </div>
          </div>
          <svg className="absolute inset-x-0 bottom-0 h-10 w-full md:h-14" viewBox="0 0 1200 60" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 40 C 200 10, 380 55, 620 32 S 1000 12, 1200 36 V60 H0 Z" fill="#4a7d3b" opacity="0.35" />
            <path d="M0 48 C 260 28, 460 62, 720 44 S 1080 30, 1200 50 V60 H0 Z" fill="#3d6b30" opacity="0.5" />
          </svg>
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
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
            {products.map((p, i) => <ProductCard key={p.id} product={p} locale={locale} priority={i < 4} />)}
          </div>
        ) : (
          <p className="py-10 text-center text-muted">{t.shop.empty}</p>
        )}

        <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-3xl bg-mint p-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-serif text-xl font-semibold text-forest-900">{t.shop.helpTitle}</p>
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
