import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Icon } from '@/components/Icon'
import { JsonLd } from '@/components/JsonLd'
import { ProductBuyBox } from '@/components/ProductBuyBox'
import { ProductCard } from '@/components/ProductCard'
import { RichText } from '@/components/RichText'
import { Badge, Breadcrumbs, CheckList, FAQ, SectionHeading } from '@/components/ui'
import { getDictionary } from '@/i18n'
import { isLocale, localePath } from '@/i18n/config'
import type { Category, Product } from '@/payload-types'
import { mediaOf, mediaUrl } from '@/lib/media'
import { getProduct, getProducts, getSettings } from '@/lib/queries'
import { buildMetadata, productJsonLd } from '@/lib/seo'

// Rendered on first visit, then cached (ISR) and refreshed when content changes.
export async function generateStaticParams() {
  return []
}

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const p = await getProduct(slug, locale)
  if (!p) return {}
  return buildMetadata({
    locale,
    path: `/products/${p.slug}`,
    title: p.meta?.title || p.title,
    description: p.meta?.description || p.shortDescription,
    image: mediaUrl(p.images?.[0], 'card'),
  })
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const product = await getProduct(slug, locale)
  if (!product) notFound()
  const t = getDictionary(locale)
  const settings = await getSettings(locale)
  const category = typeof product.category === 'object' ? (product.category as Category) : null

  let related = (product.relatedProducts ?? []).filter((r): r is Product => typeof r === 'object')
  if (!related.length && category) {
    related = (await getProducts(locale, { categoryId: category.id, limit: 5 })).filter((p) => p.id !== product.id).slice(0, 4)
  }

  const images = (product.images ?? []).map(mediaOf).filter(Boolean)
  const variants = (product.variants ?? []).map((v) => ({
    label: v.label,
    sku: v.sku,
    price: v.price ?? null,
    mrp: v.mrp ?? null,
    unitPriceLabel: v.unitPriceLabel ?? null,
    onDemand: Boolean(v.onDemand),
    available: v.inStock !== false,
  }))

  return (
    <>
      <Breadcrumbs
        locale={locale}
        items={[
          { name: t.nav.shop, path: '/shop' },
          ...(category ? [{ name: category.title, path: `/shop/${category.slug}` }] : []),
          { name: product.title, path: `/products/${product.slug}` },
        ]}
      />

      <section className="container-x grid gap-8 py-6 lg:grid-cols-2 lg:gap-12">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-malai">
            {images[0] && (
              <Image src={mediaUrl(images[0], 'hero') as string} alt={images[0]!.alt || product.title} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-contain p-6" />
            )}
            <span className="absolute left-4 top-4 flex gap-2">
              {product.badge === 'bestseller' && <Badge tone="bestseller">{t.common.bestseller}</Badge>}
              <Badge tone={product.fulfilment === 'ship' ? 'ship' : 'local'}>{product.fulfilment === 'ship' ? t.common.shipsIndia : t.common.localOnly}</Badge>
            </span>
          </div>
          {images.length > 1 && (
            <ul className="mt-3 grid grid-cols-4 gap-3">
              {images.slice(1, 5).map((m) => (
                <li key={m!.id} className="relative aspect-square overflow-hidden rounded-2xl bg-malai">
                  <Image src={mediaUrl(m, 'thumb') as string} alt={m!.alt} fill sizes="120px" className="object-contain p-2" />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Buy box */}
        <div>
          <h1 className="text-3xl md:text-4xl">{product.title}</h1>
          {product.secondaryName && <p className="mt-1 font-serif text-xl text-gold-700">{product.secondaryName}</p>}
          {product.shortDescription && <p className="mt-3 text-lg text-muted">{product.shortDescription}</p>}
          <div className="mt-6">
            <ProductBuyBox
              productId={product.id}
              slug={product.slug}
              title={product.title}
              image={mediaUrl(product.images?.[0], 'card')}
              status={product.status}
              fulfilment={product.fulfilment}
              subscribable={Boolean(product.subscribable)}
              variants={variants}
              whatsapp={settings.ordersPhone}
            />
          </div>
          <ul className="mt-6 grid grid-cols-2 gap-3 border-t border-line pt-5 text-sm">
            {t.product.trust.map((label, i) => (
              <li key={label} className="flex items-center gap-2">
                <Icon name={['cow', 'ghee', 'jar', 'shield'][i]} className="text-leaf-600" /> {label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {product.highlights && product.highlights.length > 0 && (
        <section className="container-x py-10">
          <SectionHeading title={t.product.highlights} />
          <CheckList items={product.highlights.map((h) => h.text)} />
        </section>
      )}

      {product.process && product.process.length > 0 && (
        <section className="bg-malai/60 py-12">
          <div className="container-x">
            <SectionHeading title={t.product.process} />
            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {product.process.map((s, i) => (
                <li key={s.id ?? i} className="flex gap-4 rounded-2xl bg-cream p-5 shadow-card">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-forest-900 font-serif font-semibold text-gold-500">{i + 1}</span>
                  <span>
                    <span className="block font-semibold text-forest-900">{s.title}</span>
                    {s.text && <span className="mt-1 block text-muted">{s.text}</span>}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <section className="container-x grid gap-8 py-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-3xl">{t.product.description}</h2>
          <RichText data={product.description} />
        </div>
        <aside className="space-y-2">
          <h2 className="mb-2 text-2xl">{t.product.details}</h2>
          <dl className="divide-y divide-line rounded-2xl border border-line bg-white text-sm">
            {[
              [t.product.ingredients, product.ingredients],
              [t.product.shelfLife, product.shelfLife],
              [t.product.storage, product.storage],
              [t.product.legal, t.product.legalText(settings.fssai || '')],
              [t.product.shipping, t.product.shippingText],
            ]
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k as string} className="p-4">
                  <dt className="font-semibold text-forest-900">{k}</dt>
                  <dd className="mt-1 text-muted">{v}</dd>
                </div>
              ))}
          </dl>
          <p className="pt-2 text-sm">
            <Link href={localePath(locale, '/legal/refund-policy')} className="text-leaf-600 underline underline-offset-4">
              {t.product.shipping} →
            </Link>
          </p>
        </aside>
      </section>

      {product.faqs && product.faqs.length > 0 && <FAQ locale={locale} faqs={product.faqs} />}

      {related.length > 0 && (
        <section className="container-x py-10">
          <SectionHeading title={t.product.related} />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:gap-5">
            {related.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} locale={locale} />)}
          </div>
        </section>
      )}

      <JsonLd data={productJsonLd(locale, product)} />
    </>
  )
}
