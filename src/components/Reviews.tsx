import Image from 'next/image'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import { localePath } from '@/i18n/config'
import { getDictionary } from '@/i18n'
import type { Testimonial } from '@/payload-types'
import { mediaUrl } from '@/lib/media'
import { Icon } from './Icon'
import { ReviewForm } from './ReviewForm'
import { Stars } from './Stars'

export function summarise(reviews: Pick<Testimonial, 'rating'>[]) {
  const count = reviews.length
  const average = count ? Math.round((reviews.reduce((s, r) => s + (r.rating ?? 5), 0) / count) * 10) / 10 : 0
  return { count, average }
}

export function ReviewCard({ review, locale, showProduct = false }: { review: Testimonial; locale: Locale; showProduct?: boolean }) {
  const t = getDictionary(locale)
  const product = typeof review.product === 'object' ? review.product : null
  const photo = mediaUrl(review.photo, 'card')
  const date = new Date(review.createdAt).toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-IN', { month: 'short', year: 'numeric' })
  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-snow p-5 shadow-[0_10px_30px_-22px_rgba(43,27,16,0.5)]">
      <div className="flex items-center justify-between gap-2">
        <Stars value={review.rating ?? 5} size={18} />
        <span className="text-xs text-muted">{date}</span>
      </div>
      <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-ink">“{review.quote}”</blockquote>
      {photo && (
        <span className="relative mt-3 block aspect-[4/3] overflow-hidden rounded-xl border border-line">
          <Image src={photo} alt="" fill sizes="(max-width: 768px) 80vw, 320px" className="object-cover" />
        </span>
      )}
      <footer className="mt-4 flex items-center gap-3 border-t border-line pt-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink font-serif text-lg font-bold text-gold-500">{review.name.trim().charAt(0).toUpperCase()}</span>
        <span className="min-w-0 text-sm">
          <span className="block truncate font-semibold text-ink">{review.name}{review.locality ? `, ${review.locality}` : ''}</span>
          <span className="flex flex-wrap items-center gap-x-2 text-xs text-muted">
            {review.verified && <span className="inline-flex items-center gap-1 font-semibold text-gold-700"><Icon name="check" size={12} /> {t.reviews.verified}</span>}
            {showProduct && product && <Link href={localePath(locale, `/products/${product.slug}`)} className="underline-offset-2 hover:underline">{product.title}</Link>}
          </span>
        </span>
      </footer>
    </article>
  )
}

/** Average stars, then the reviews in a swipeable row, then a form to write one. */
export function ReviewsBlock({
  reviews,
  locale,
  productId,
  products,
  showProduct = false,
  title,
  id = 'reviews',
  stacked = false,
}: {
  reviews: Testimonial[]
  locale: Locale
  productId?: number
  products?: { id: number; title: string }[]
  showProduct?: boolean
  title?: string
  id?: string
  /** list everything top-to-bottom on phones (the full reviews page) instead of a swipe row */
  stacked?: boolean
}) {
  const t = getDictionary(locale)
  const { count, average } = summarise(reviews)
  return (
    <section id={id} className="container-x scroll-mt-28 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-serif text-sm font-bold uppercase tracking-[0.25em] text-gold-700">{t.reviews.eyebrow}</p>
          <h2 className="mt-2 text-3xl md:text-4xl">{title ?? t.reviews.title}</h2>
        </div>
        {count > 0 && (
          <div className="flex items-center gap-3 rounded-2xl bg-ink px-5 py-3 text-snow">
            <span className="font-serif text-4xl font-bold text-gold-500">{average.toFixed(1)}</span>
            <span>
              <Stars value={average} size={18} />
              <span className="block text-xs text-snow/70">{t.reviews.basedOn(count)}</span>
            </span>
          </div>
        )}
      </div>
      {count > 0 ? (
        <ul className={stacked ? 'mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'no-scrollbar -mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0'}>
          {reviews.map((r) => (
            <li key={r.id} className={stacked ? '' : 'w-[82%] shrink-0 snap-start sm:w-[60%] md:w-auto'}>
              <ReviewCard review={r} locale={locale} showProduct={showProduct} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-muted">{t.reviews.none}</p>
      )}
      <ReviewForm productId={productId} products={products} />
    </section>
  )
}
