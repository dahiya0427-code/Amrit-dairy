import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Icon } from '@/components/Icon'
import { Breadcrumbs, PageHero, SectionHeading } from '@/components/ui'
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
  return buildMetadata({ locale, path: '/farm-story', title: t.farm.title, description: t.farm.lead })
}

const journeyIcons = ['leaf', 'cow', 'milk', 'lab', 'box', 'home']

export default async function FarmStoryPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  const href = (p: string) => localePath(locale, p)
  const [breeds, settings] = await Promise.all([getBreeds(locale), getSettings(locale)])
  const onFarm = breeds.filter((b) => b.onFarm)

  return (
    <>
      <PageHero title={t.farm.title} intro={t.farm.intro} eyebrow={t.home.farmEyebrow} />
      <Breadcrumbs locale={locale} items={[{ name: t.farm.title, path: '/farm-story' }]} />

      <section className="container-x max-w-4xl py-10">
        <p className="text-xl leading-relaxed">{t.farm.lead}</p>
      </section>

      <section className="container-x py-6">
        <SectionHeading title={t.farm.cowsTitle} intro={t.farm.cowsText} />
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {onFarm.map((b) => (
            <li key={b.id}>
              <Link href={href(`/desi-cows/${b.slug}`)} className="card block p-3 text-center hover:shadow-lift">
                <span className="relative block aspect-square rounded-xl bg-paper">
                  {mediaUrl(b.image, 'card') && <Image src={mediaUrl(b.image, 'card') as string} alt={`${b.name} cow`} fill sizes="(max-width: 640px) 50vw, 20vw" className="object-contain" />}
                </span>
                <span className="mt-2 block font-semibold text-cream">{b.name}</span>
                {b.origin && <span className="block text-sm text-muted">{b.origin}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-x py-12">
        <ul className="grid gap-4 sm:grid-cols-3">
          {t.farm.stats.map((s) => (
            <li key={s.label} className="rounded-lg bg-gold-500 p-6 text-center text-ink">
              <span className="block font-serif text-5xl font-semibold text-gold-700">{s.value}</span>
              <span className="mt-2 block">{s.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-malai/60 py-14">
        <div className="container-x">
          <SectionHeading title={t.farm.journeyTitle} intro={t.farm.bilona} />
          <ol className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {t.farm.journey.map((step, i) => (
              <li key={step} className="relative rounded-2xl bg-char p-5 text-center shadow-card">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-latte text-caramel"><Icon name={journeyIcons[i]} /></span>
                <span className="mt-3 block font-semibold text-cream">{step}</span>
                {i < t.farm.journey.length - 1 && <span className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-gold-700 lg:block" aria-hidden="true">→</span>}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-x py-14">
        <div className="rounded-lg bg-milk p-8 text-ink md:p-12">
          <h2 className="text-3xl !text-cream">{t.farm.familyTitle}</h2>
          <p className="mt-3 max-w-2xl text-cream/85">{t.farm.familyText}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={href('/departments')} className="btn btn-gold">{t.nav.departments}</Link>
            <Link href={href('/facilities')} className="btn btn-outline-light">{t.nav.facilities}</Link>
            <a href={telLink(settings.cowPhone)} className="btn btn-outline-light"><Icon name="phone" /> {settings.cowPhone}</a>
          </div>
        </div>
      </section>
    </>
  )
}
