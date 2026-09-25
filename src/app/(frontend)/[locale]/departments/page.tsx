import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Icon } from '@/components/Icon'
import { Breadcrumbs, PageHero } from '@/components/ui'
import { getDictionary } from '@/i18n'
import { isLocale, localePath } from '@/i18n/config'
import { getDepartments } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  return buildMetadata({ locale, path: '/departments', title: t.departments.title, description: t.departments.intro })
}

export default async function DepartmentsPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  const departments = await getDepartments(locale)
  return (
    <>
      <PageHero title={t.departments.title} intro={t.departments.intro} />
      <Breadcrumbs locale={locale} items={[{ name: t.departments.title, path: '/departments' }]} />
      <section className="container-x py-10">
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {departments.map((d, i) => (
            <li key={d.id}>
              <Link href={localePath(locale, `/departments/${d.slug}`)} className="card flex h-full flex-col p-6 transition hover:shadow-lift">
                <span className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-forest-900 text-gold-500"><Icon name={d.icon ?? 'leaf'} /></span>
                  <span className="font-serif text-2xl text-gold-700" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                </span>
                <span className="mt-4 block font-serif text-xl font-semibold text-forest-900">{d.title}</span>
                <span className="mt-2 block flex-1 text-muted">{d.summary}</span>
                <span className="mt-4 inline-flex items-center gap-1 font-semibold text-leaf-600">{t.common.learnMore} <Icon name="arrow" size={16} /></span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
