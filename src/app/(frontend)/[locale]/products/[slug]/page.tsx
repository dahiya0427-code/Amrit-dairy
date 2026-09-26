import Image from 'next/image'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Icon } from '@/components/Icon'
import { JsonLd } from '@/components/JsonLd'
import { ProductBuyBox } from '@/components/ProductBuyBox'
import { ProductCard } from '@/components/ProductCard'
import { ProductGallery, type GallerySlide } from '@/components/ProductGallery'
import { RichText } from '@/components/RichText'
import { storySlides } from '@/components/StorySlides'
import { Badge, Breadcrumbs, CheckList, FAQ, SectionHeading } from '@/components/ui'
import { getDictionary } from '@/i18n'
import { isLocale } from '@/i18n/config'
import type { Category, Product } from '@/payload-types'
import { formatINR } from '@/lib/format'
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

const badgeIcons: Record<string, string> = {
  bilona: 'churn',
  'desi-cow': 'cow',
  makkhan: 'pot',
  glass: 'jar',
  clay: 'pot',
  'small-batch': 'sparkle',
  'no-additives': 'shield',
  fresh: 'milk',
  ships: 'truck',
  rajasthani: 'flame',
}

function Accordion({ title, children, open = false }: { title: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details className="group border-b border-line" open={open}>
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-sm font-bold uppercase tracking-wider text-forest-900 [&::-webkit-details-marker]:hidden">
        {title}
        <Icon name="plus" className="shrink-0 text-gold-700 transition group-open:rotate-45" />
      </summary>
      <div className="pb-5 text-muted">{children}</div>
    </details>
  )
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

  const photos = (product.images ?? []).map(mediaOf).filter((m): m is NonNullable<typeof m> => Boolean(m))
  const packshot = mediaUrl(product.images?.[0], 'card')
  const extraPhoto = mediaOf(product.hoverImage)

  // Gallery = product photos + designed story slides from the CMS.
  const slides: GallerySlide[] = [
    ...[...photos, ...(extraPhoto ? [extraPhoto] : [])].map((m, i) => ({
      key: `photo-${m.id}-${i}`,
      thumb: <Image src={mediaUrl(m, 'thumb') as string} alt="" fill sizes="80px" className="object-contain p-1" />,
      node: (
        <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-malai">
          <Image src={mediaUrl(m, 'hero') as string} alt={m.alt || product.title} fill priority={i === 0} sizes="(max-width: 1024px) 100vw, 50vw" className="object-contain p-6" />
          {i === 0 && (
            <span className="absolute left-4 top-4 flex gap-2">
              {product.badge === 'bestseller' && <Badge tone="bestseller">{t.common.bestseller}</Badge>}
              <Badge tone={product.fulfilment === 'ship' ? 'ship' : 'local'}>{product.fulfilment === 'ship' ? t.common.shipsIndia : t.common.localOnly}</Badge>
            </span>
          )}
        </div>
      ),
    })),
    ...storySlides({ product, image: packshot, cutout: mediaUrl(product.cutout, 'card'), locale, fssai: settings.fssai }).map((s) => ({
      key: `story-${s.key}`,
      thumb: (
        <span className="grid h-full w-full place-items-center bg-forest-900 p-1 text-center text-[9px] font-semibold leading-tight text-gold-500 lg:text-[10px]">
          {s.label}
        </span>
      ),
      node: s.node,
    })),
  ]

  const variants = (product.variants ?? []).map((v) => ({
    label: v.label,
    sku: v.sku,
    price: v.price ?? null,
    mrp: v.mrp ?? null,
    unitPriceLabel: v.unitPriceLabel ?? null,
    weightGrams: v.weightGrams ?? null,
    onDemand: Boolean(v.onDemand),
    available: v.inStock !== false,
  }))
  const threshold = settings.freeDeliveryThreshold ? formatINR(settings.freeDeliveryThreshold) : ''

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
        <div>
          <ProductGallery slides={slides} />
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl">{product.title}</h1>
          {product.secondaryName && <p className="mt-1 font-serif text-xl text-gold-700">{product.secondaryName}</p>}
          {product.shortDescription && <p className="mt-3 text-lg text-muted">{product.shortDescription}</p>}

          {product.badges && product.badges.length > 0 && (
            <ul className="mt-5 grid grid-cols-4 gap-2">
              {product.badges.slice(0, 4).map((b) => (
                <li key={b} className="flex flex-col items-center gap-1.5 text-center">
                  <span className="grid h-14 w-14 place-items-center rounded-full border-2 border-forest-900 text-forest-900 sm:h-16 sm:w-16">
                    <Icon name={badgeIcons[b] ?? 'leaf'} size={28} />
                  </span>
                  <span className="text-[11px] font-bold uppercase leading-tight tracking-wide text-forest-900">{t.badges[b]}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6">
            <ProductBuyBox
              productId={product.id}
              slug={product.slug}
              title={product.title}
              image={packshot}
              status={product.status}
              fulfilment={product.fulfilment}
              subscribable={Boolean(product.subscribable)}
              variants={variants}
              whatsapp={settings.ordersPhone}
            />
          </div>

          <ul className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5 text-center text-xs font-semibold text-forest-900 sm:grid-cols-4">
            {t.pdp.trust.map((item) => (
              <li key={item.label} className="flex flex-col items-center gap-2">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-mint text-leaf-600"><Icon name={item.icon} size={24} /></span>
                {item.label.replace('{amount}', threshold)}
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t border-line">
            <Accordion title={t.product.description} open>
              <RichText data={product.description} />
            </Accordion>
            {product.ingredients && <Accordion title={t.product.ingredients}><p>{product.ingredients}</p></Accordion>}
            {product.usage && product.usage.length > 0 && (
              <Accordion title={t.pdp.usage}><CheckList items={product.usage.map((u) => u.text)} /></Accordion>
            )}
            {product.benefits && product.benefits.length > 0 && (
              <Accordion title={t.pdp.benefits}><CheckList items={product.benefits.map((u) => u.text)} /></Accordion>
            )}
            {(product.storage || product.shelfLife) && (
              <Accordion title={t.pdp.storage}>
                {product.storage && <p>{product.storage}</p>}
                {product.shelfLife && <p className="mt-2">{t.product.shelfLife}: {product.shelfLife}</p>}
              </Accordion>
            )}
            <Accordion title={t.product.legal}><p>{t.product.legalText(settings.fssai || '')}</p></Accordion>
            <Accordion title={t.product.shipping}><p>{t.product.shippingText}</p></Accordion>
          </div>
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
