import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LeadForm } from '@/components/LeadForm'
import { Badge, Breadcrumbs, PageHero, SectionHeading } from '@/components/ui'
import { getDictionary } from '@/i18n'
import { isLocale, localePath } from '@/i18n/config'
import { mediaUrl } from '@/lib/media'
import { getBreeds, getSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { telLink } from '@/lib/site'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  return buildMetadata({ locale, path: '/desi-cows', title: t.cows.title, description: t.cows.intro })
}

export default async function DesiCowsPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  const [breeds, settings] = await Promise.all([getBreeds(locale), getSettings(locale)])
  const sorted = [...breeds.filter((b) => b.onFarm), ...breeds.filter((b) => !b.onFarm)]

  return (
    <>
      <PageHero title={t.cows.title} secondary={t.cows.hindi} intro={t.cows.intro} />
      <Breadcrumbs locale={locale} items={[{ name: t.cows.title, path: '/desi-cows' }]} />
      <section className="container-x py-10">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {sorted.map((b) => (
            <li key={b.id}>
              <Link href={localePath(locale, `/desi-cows/${b.slug}`)} className="group block rounded-3xl border border-line bg-white p-3 text-center transition hover:shadow-lift">
                <span className="relative block aspect-square">
                  {mediaUrl(b.image, 'card') && <Image src={mediaUrl(b.image, 'card') as string} alt={`${b.name} cow`} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-contain transition group-hover:scale-105" />}
                </span>
                <span className="mt-2 block font-semibold text-forest-900">{b.name}</span>
                {b.onFarm && <span className="mt-1 inline-block"><Badge tone="ship">{t.cows.onFarm}</Badge></span>}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section id="enquiry" className="container-x py-10">
        <div className="grid gap-8 rounded-3xl bg-malai p-6 md:grid-cols-2 md:p-10">
          <div>
            <SectionHeading title={t.cows.enquiryTitle} intro={t.cows.enquiryText} />
            <a href={telLink(settings.cowPhone)} className="btn btn-primary">{settings.cowPhone}</a>
          </div>
          <LeadForm type="cow" submitLabel={t.cows.enquiryCta} />
        </div>
      </section>
    </>
  )
}
