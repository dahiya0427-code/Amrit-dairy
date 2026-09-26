import Image from 'next/image'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import { localePath } from '@/i18n/config'
import { getDictionary } from '@/i18n'
import type { Product } from '@/payload-types'
import { formatINR } from '@/lib/format'
import { mediaOf, mediaUrl } from '@/lib/media'
import { buyableVariants, hasMultiplePrices, minPrice } from '@/lib/product'
import { toneOf, tones } from '@/lib/tone'
import { Badge } from './ui'
import { CardAddButton } from './CardAddButton'
import { FlipToggle } from './FlipToggle'
import { Icon } from './Icon'

export function ProductCard({ product, locale, priority = false }: { product: Product; locale: Locale; priority?: boolean }) {
  const t = getDictionary(locale)
  const img = product.images?.[0]
  const src = mediaUrl(img, 'card')
  const price = minPrice(product)
  const variants = buyableVariants(product)
  const mode = product.status !== 'active' || !variants.length ? 'notify' : variants.length > 1 ? 'options' : 'add'
  const v = variants[0]
  const item =
    mode === 'add' && v
      ? {
          productId: product.id,
          slug: product.slug,
          title: product.title,
          variantLabel: v.label,
          sku: v.sku,
          price: v.price as number,
          image: src,
          fulfilment: product.fulfilment,
        }
      : null
  const url = localePath(locale, `/products/${product.slug}`)
  const hoverSrc = mediaUrl(product.hoverImage, 'card')
  const cutoutSrc = mediaUrl(product.cutout, 'card')
  const points = (product.cardPoints ?? []).map((p) => p.text).slice(0, 3)
  const catSlug = typeof product.category === 'object' ? product.category?.slug : null
  const tone = tones[toneOf(catSlug, product.slug)]

  return (
    <article className="card group flex flex-col overflow-hidden p-2 transition hover:shadow-lift [&.is-flipped_.flip-inner]:[transform:rotateY(180deg)]">
      <div className="relative aspect-square overflow-hidden rounded-[18px]">
        <Link href={url} className="flip absolute inset-0 block" tabIndex={-1} aria-hidden="true">
          <span className="flip-inner block">
            {/* Front: cut-out on the family colour, or the pack shot framed on it */}
            <span className={`flip-face block overflow-hidden ${tone.bg}`}>
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgb(255_255_255/0.45),transparent_60%)]" aria-hidden="true" />
              {cutoutSrc ? (
                <Image
                  src={cutoutSrc}
                  alt={mediaOf(img)?.alt ?? product.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-contain p-6 drop-shadow-[0_18px_22px_rgb(0_0_0/0.35)] transition duration-500 group-hover:-translate-y-1.5 group-hover:scale-105"
                  priority={priority}
                />
              ) : (
                src && (
                  <span className="absolute inset-[12%] overflow-hidden rounded-2xl bg-paper shadow-float">
                    <Image
                      src={src}
                      alt={mediaOf(img)?.alt ?? product.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-contain p-2"
                      priority={priority}
                    />
                  </span>
                )
              )}
            </span>
            {/* Back: second photo, or a details card */}
            <span className="flip-face flip-back block overflow-hidden bg-smoke text-cream">
              {hoverSrc ? (
                <Image src={hoverSrc} alt="" fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" />
              ) : (
                <span className="flex h-full flex-col items-center justify-center gap-2 p-3 text-center sm:gap-3 sm:p-5">
                  {(cutoutSrc || src) && (
                    <span className={`relative block h-[38%] w-[38%] ${cutoutSrc ? '' : 'overflow-hidden rounded-full bg-paper'}`}>
                      <Image src={(cutoutSrc || src) as string} alt="" fill sizes="120px" className={cutoutSrc ? 'object-contain drop-shadow-lg' : 'object-contain p-2'} />
                    </span>
                  )}
                  <span className="font-serif text-sm font-semibold text-gold-700 sm:text-lg">{product.secondaryName || product.title}</span>
                  {points.length > 0 && (
                    <span className="flex flex-col gap-1 text-left text-[11px] leading-snug sm:text-sm">
                      {points.map((p) => (
                        <span key={p} className="flex items-start gap-1.5">
                          <Icon name="check" size={14} className="mt-0.5 shrink-0 text-gold-700" />
                          {p}
                        </span>
                      ))}
                    </span>
                  )}
                </span>
              )}
            </span>
          </span>
        </Link>
        <span className="pointer-events-none absolute left-3 top-3 z-10 flex flex-col items-start gap-1">
          {product.badge === 'bestseller' && <Badge tone="bestseller">{t.common.bestseller}</Badge>}
          {product.badge === 'new' && <Badge tone="new">{t.common.new}</Badge>}
          {product.status === 'coming_soon' && <Badge tone="soon">{t.common.comingSoon}</Badge>}
          {product.status === 'out_of_stock' && <Badge tone="soon">{t.common.outOfStock}</Badge>}
        </span>
        <FlipToggle label={t.pdp.flipHint} />
      </div>
      <div className="flex flex-1 flex-col gap-1 px-2 pb-2 pt-4 sm:px-3">
        <h3 className="font-serif text-lg font-semibold leading-snug text-cream sm:text-xl">
          <Link href={url} className="hover:underline">{product.title}</Link>
        </h3>
        {product.secondaryName && <p className="text-sm text-muted">{product.secondaryName}</p>}
        <div className="mt-auto pt-2">
          {price ? (
            <p className="mb-3 text-xl font-bold tabular-nums text-gold-700">
              {hasMultiplePrices(product) && <span className="text-sm font-normal text-muted">{t.common.from} </span>}
              {formatINR(price)}
              {variants.length === 1 && <span className="ml-1 text-sm font-normal text-muted">· {variants[0].label}</span>}
            </p>
          ) : (
            <p className="mb-3 text-sm font-semibold text-gold-700">{product.status === 'out_of_stock' ? t.common.outOfStock : t.common.comingSoon}</p>
          )}
          <CardAddButton item={item} slug={product.slug} mode={mode} />
        </div>
      </div>
    </article>
  )
}
