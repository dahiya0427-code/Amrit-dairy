import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Badge, Breadcrumbs, CheckList } from '@/components/ui'
import { getDictionary } from '@/i18n'
import { isLocale, localePath } from '@/i18n/config'
import { mediaUrl } from '@/lib/media'
import { getBreed, getSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { telLink } from '@/lib/site'

// Rendered on first visit, then cached (ISR) and refreshed when content changes.
export async function generateStaticParams() {
  return []
}

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const b = await getBreed(slug, locale)
  if (!b) return {}
  return buildMetadata({ locale, path: `/desi-cows/${b.slug}`, title: b.meta?.title || `${b.name} · ${getDictionary(locale).cows.title}`, description: b.meta?.description || b.summary, image: mediaUrl(b.image, 'card') })
}

export default async function BreedPage({ params }: Props) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const breed = await getBreed(slug, locale)
  if (!breed) notFound()
  const t = getDictionary(locale)
  const settings = await getSettings(locale)

  return (
    <>
      <Breadcrumbs locale={locale} items={[{ name: t.cows.title, path: '/desi-cows' }, { name: breed.name, path: `/desi-cows/${breed.slug}` }]} />
      <article className="container-x grid gap-10 py-8 md:grid-cols-2">
        <div className="relative aspect-square rounded-lg border border-line bg-paper">
          {mediaUrl(breed.image, 'hero') && <Image src={mediaUrl(breed.image, 'hero') as string} alt={`${breed.name} cow`} fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-contain p-6" />}
        </div>
        <div>
          {breed.onFarm && <Badge tone="ship">{t.cows.onFarm}</Badge>}
          <h1 className="mt-2 text-4xl md:text-5xl">{breed.name}</h1>
          {breed.origin && <p className="mt-2 text-lg"><strong>{t.cows.origin}:</strong> {breed.origin}</p>}
          {breed.summary && <p className="mt-4 text-lg text-muted">{breed.summary}</p>}
          {breed.traits && breed.traits.length > 0 && (
            <div className="mt-6">
              <h2 className="mb-3 text-2xl">{t.cows.traits}</h2>
              <CheckList items={breed.traits.map((x) => x.text)} />
            </div>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={localePath(locale, '/products/desi-cow-golden-ghee')} className="btn btn-gold">{t.home.bilonaCta}</Link>
            <a href={telLink(settings.cowPhone)} className="btn btn-outline">{t.cows.enquiryCta}</a>
          </div>
        </div>
      </article>
    </>
  )
}
