import Image from 'next/image'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import { localePath } from '@/i18n/config'
import { getDictionary } from '@/i18n'
import type { Product } from '@/payload-types'
import { formatINR } from '@/lib/format'
import { mediaOf, mediaUrl } from '@/lib/media'
import { buyableVariants, hasMultiplePrices, minPrice } from '@/lib/product'
import { Badge } from './ui'
import { CardAddButton } from './CardAddButton'

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

  return (
    <article className="card group flex flex-col overflow-hidden transition hover:shadow-lift">
      <Link href={url} className="relative block aspect-square bg-malai" tabIndex={-1} aria-hidden="true">
        {src && (
          <Image
            src={src}
            alt={mediaOf(img)?.alt ?? product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-3 transition duration-300 group-hover:scale-[1.03]"
            priority={priority}
          />
        )}
        <span className="absolute left-3 top-3 flex flex-col items-start gap-1">
          {product.badge === 'bestseller' && <Badge tone="bestseller">{t.common.bestseller}</Badge>}
          {product.badge === 'new' && <Badge tone="new">{t.common.new}</Badge>}
          {product.status === 'coming_soon' && <Badge tone="soon">{t.common.comingSoon}</Badge>}
          {product.status === 'out_of_stock' && <Badge tone="soon">{t.common.outOfStock}</Badge>}
        </span>
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
        <h3 className="font-sans text-base font-semibold leading-snug text-ink sm:text-[17px]">
          <Link href={url} className="hover:underline">{product.title}</Link>
        </h3>
        {product.secondaryName && <p className="text-sm text-muted">{product.secondaryName}</p>}
        <div className="mt-auto pt-2">
          {price ? (
            <p className="mb-3 text-lg font-bold tabular-nums">
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
