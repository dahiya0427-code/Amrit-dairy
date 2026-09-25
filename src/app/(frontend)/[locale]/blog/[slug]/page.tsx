import Image from 'next/image'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/JsonLd'
import { ProductCard } from '@/components/ProductCard'
import { RichText } from '@/components/RichText'
import { Breadcrumbs, CheckList, FAQ, SectionHeading } from '@/components/ui'
import { getDictionary } from '@/i18n'
import { isLocale } from '@/i18n/config'
import type { Product } from '@/payload-types'
import { formatDate } from '@/lib/format'
import { mediaUrl } from '@/lib/media'
import { getPost } from '@/lib/queries'
import { articleJsonLd, buildMetadata } from '@/lib/seo'

// Rendered on first visit, then cached (ISR) and refreshed when content changes.
export async function generateStaticParams() {
  return []
}

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const p = await getPost(slug, locale)
  if (!p) return {}
  return buildMetadata({ locale, path: `/blog/${p.slug}`, title: p.meta?.title || p.title, description: p.meta?.description || p.excerpt, image: mediaUrl(p.cover, 'hero'), type: 'article' })
}

/** Rough reading time from the Lexical JSON text. */
function readingMinutes(content: unknown) {
  const words = JSON.stringify(content ?? '').replace(/"[a-zA-Z]+":/g, ' ').split(/\s+/).length
  return Math.max(2, Math.round(words / 200))
}

export default async function PostPage({ params }: Props) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const post = await getPost(slug, locale)
  if (!post) notFound()
  const t = getDictionary(locale)
  const products = (post.relatedProducts ?? []).filter((p): p is Product => typeof p === 'object')

  return (
    <>
      <Breadcrumbs locale={locale} items={[{ name: t.blog.title, path: '/blog' }, { name: post.title, path: `/blog/${post.slug}` }]} />
      <article className="container-x max-w-3xl py-8">
        <p className="eyebrow">{t.blog.categories[post.category]}</p>
        <h1 className="mt-2 text-4xl md:text-5xl">{post.title}</h1>
        <p className="mt-4 text-sm text-muted">
          {t.blog.by} <strong className="text-ink">{post.author?.name}</strong>
          {post.author?.role ? `, ${post.author.role}` : ''} · {formatDate(post.publishedAt, locale)} · {t.blog.minRead(readingMinutes(post.content))}
        </p>
        {mediaUrl(post.cover, 'hero') && (
          <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-3xl bg-malai">
            <Image src={mediaUrl(post.cover, 'hero') as string} alt="" fill priority sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
          </div>
        )}
        {post.tldr && post.tldr.length > 0 && (
          <aside className="mt-8 rounded-2xl border-l-4 border-gold-500 bg-malai p-5" aria-label={t.blog.tldr}>
            <p className="mb-2 font-semibold text-forest-900">{t.blog.tldr}</p>
            <ul className="list-disc space-y-1 pl-5">
              {post.tldr.map((x) => <li key={x.id}>{x.text}</li>)}
            </ul>
          </aside>
        )}
        <RichText data={post.content} className="mt-8" />
        {post.keyTakeaways && post.keyTakeaways.length > 0 && (
          <section className="mt-10 rounded-2xl bg-mint p-6">
            <h2 className="mb-4 text-2xl">{t.blog.takeaways}</h2>
            <CheckList items={post.keyTakeaways.map((k) => k.text)} />
          </section>
        )}
        {post.sources && post.sources.length > 0 && (
          <section className="mt-8 text-sm">
            <h2 className="mb-2 text-xl">{t.blog.sources}</h2>
            <ol className="list-decimal space-y-1 pl-5 text-muted">
              {post.sources.map((s) => (
                <li key={s.id}>{s.url ? <a href={s.url} className="underline" target="_blank" rel="noopener nofollow">{s.label}</a> : s.label}</li>
              ))}
            </ol>
          </section>
        )}
      </article>
      {post.faqs && post.faqs.length > 0 && <FAQ locale={locale} faqs={post.faqs} />}
      {products.length > 0 && (
        <section className="container-x py-10">
          <SectionHeading title={t.blog.related} />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:gap-5">
            {products.map((p) => <ProductCard key={p.id} product={p} locale={locale} />)}
          </div>
        </section>
      )}
      <JsonLd data={articleJsonLd(locale, post)} />
    </>
  )
}
