import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Icon } from '@/components/Icon'
import { Breadcrumbs, PageHero } from '@/components/ui'
import { getDictionary } from '@/i18n'
import { isLocale, localePath } from '@/i18n/config'
import { mediaUrl } from '@/lib/media'
import { getFacilities, getSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { whatsappLink } from '@/lib/site'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  return buildMetadata({ locale, path: '/facilities', title: t.facilities.title, description: t.facilities.intro })
}

export default async function FacilitiesPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  const [facilities, settings] = await Promise.all([getFacilities(locale), getSettings(locale)])
  return (
    <>
      <PageHero title={t.facilities.title} intro={t.facilities.intro} />
      <Breadcrumbs locale={locale} items={[{ name: t.facilities.title, path: '/facilities' }]} />
      <section className="container-x py-10">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((f) => (
            <li key={f.id}>
              <Link href={localePath(locale, `/facilities/${f.slug}`)} className="card group block h-full overflow-hidden hover:shadow-lift">
                <span className="relative flex aspect-[16/10] items-center justify-center bg-walnut text-gold-500">
                  {mediaUrl(f.image, 'card') ? (
                    <Image src={mediaUrl(f.image, 'card') as string} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition group-hover:scale-105" />
                  ) : (
                    <Icon name={f.icon ?? 'leaf'} size={56} />
                  )}
                </span>
                <span className="block p-5">
                  <span className="block font-serif text-xl font-semibold text-walnut">{f.title}</span>
                  <span className="mt-2 block text-muted">{f.summary}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section className="container-x pb-6">
        <div className="flex flex-col items-start justify-between gap-4 rounded-lg bg-latte p-6 sm:flex-row sm:items-center md:p-8">
          <div>
            <h2 className="text-2xl">{t.facilities.visitTitle}</h2>
            <p className="text-muted">{t.facilities.visitText}</p>
          </div>
          <a href={whatsappLink(settings.ordersPhone, 'Hi Amrit Dairy, I would like to visit the farm.')} target="_blank" rel="noopener" className="btn btn-primary">
            <Icon name="whatsapp" /> {t.common.whatsappUs}
          </a>
        </div>
      </section>
    </>
  )
}
