import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Breadcrumbs, PageHero } from '@/components/ui'
import { getDictionary } from '@/i18n'
import { isLocale, localePath } from '@/i18n/config'
import { formatDate } from '@/lib/format'
import { mediaUrl } from '@/lib/media'
import { getPosts } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  return buildMetadata({ locale, path: '/blog', title: t.blog.title, description: t.blog.intro })
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  const posts = await getPosts(locale)
  return (
    <>
      <PageHero title={t.blog.title} intro={t.blog.intro} />
      <Breadcrumbs locale={locale} items={[{ name: t.blog.title, path: '/blog' }]} />
      <section className="container-x py-10">
        {posts.length === 0 ? (
          <p className="text-center text-muted">{t.blog.empty}</p>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.id} className="card overflow-hidden">
                <Link href={localePath(locale, `/blog/${post.slug}`)} className="group block">
                  <span className="relative block aspect-[16/10] bg-malai">
                    {mediaUrl(post.cover, 'card') && <Image src={mediaUrl(post.cover, 'card') as string} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />}
                  </span>
                  <span className="block p-5">
                    <span className="eyebrow">{t.blog.categories[post.category]}</span>
                    <span className="mt-1 block font-serif text-xl font-semibold text-walnut group-hover:underline">{post.title}</span>
                    <span className="mt-2 block text-muted">{post.excerpt}</span>
                    <span className="mt-3 block text-sm text-muted">{formatDate(post.publishedAt, locale)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}
