import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Breadcrumbs, PageHero } from '@/components/ui'
import { getDictionary } from '@/i18n'
import { isLocale, localePath } from '@/i18n/config'
import { formatDate } from '@/lib/format'
import { getNews } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  return buildMetadata({ locale, path: '/news', title: t.news.title, description: t.news.intro })
}

const tone: Record<string, string> = {
  offer: 'bg-clay text-white',
  area: 'bg-walnut text-cream',
  launch: 'bg-gold-500 text-ink',
  event: 'bg-latte text-walnut',
  notice: 'bg-white text-walnut border border-line',
}

export default async function NewsPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  const items = await getNews(locale)
  return (
    <>
      <PageHero title={t.news.title} intro={t.news.intro} />
      <Breadcrumbs locale={locale} items={[{ name: t.news.title, path: '/news' }]} />
      <section className="container-x max-w-3xl py-10">
        {items.length === 0 ? (
          <p className="text-muted">{t.news.empty}</p>
        ) : (
          <ol className="relative space-y-5 border-l-2 border-line pl-6">
            {items.map((n) => (
              <li key={n.id} className="relative">
                <span className="absolute -left-[33px] top-2 h-4 w-4 rounded-full border-4 border-cream bg-gold-500" aria-hidden="true" />
                <article className="card p-5">
                  <p className="flex flex-wrap items-center gap-2 text-sm text-muted">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${tone[n.type ?? 'notice']}`}>{t.news.types[n.type ?? 'notice']}</span>
                    <time dateTime={n.createdAt}>{formatDate(n.createdAt, locale)}</time>
                  </p>
                  <h2 className="mt-2 font-sans text-lg font-semibold">{n.link ? <Link href={n.link.startsWith('/') ? localePath(locale, n.link) : n.link} className="hover:underline">{n.text}</Link> : n.text}</h2>
                  {n.details && <p className="mt-1 text-muted">{n.details}</p>}
                </article>
              </li>
            ))}
          </ol>
        )}
      </section>
    </>
  )
}
