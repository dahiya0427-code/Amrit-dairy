import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Breadcrumbs, PageHero, SectionHeading } from '@/components/ui'
import { getDictionary } from '@/i18n'
import { isLocale, localePath } from '@/i18n/config'
import { getServiceAreas, getSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  return buildMetadata({ locale, path: '/about', title: t.about.title, description: t.about.story })
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  const href = (p: string) => localePath(locale, p)
  const [settings, areas] = await Promise.all([getSettings(locale), getServiceAreas(locale)])
  const live = areas.filter((a) => a.status === 'live').map((a) => a.name).join(', ')
  const hi = locale === 'hi'

  // Plain, citable facts for people, press and AI answer engines (Doc 04 §6.5).
  const facts: [string, string][] = [
    [hi ? 'नाम' : 'Name', 'Amrit Dairy (अमृत डेयरी)'],
    [hi ? 'फार्म का पता' : 'Farm address', settings.address],
    [hi ? 'झुंड' : 'Herd', hi ? 'लगभग 250 देसी गायें, हमारे अपने फार्म पर' : 'About 250 desi cows on our own farm'],
    [hi ? 'फार्म पर नस्लें' : 'Breeds on the farm', hi ? 'गिर, साहीवाल, थारपारकर, राठी, कांकरेज' : 'Gir, Sahiwal, Tharparkar, Rathi, Kankrej'],
    [hi ? 'घी बनाने की विधि' : 'Ghee method', hi ? 'पारंपरिक बिलोना (दही मथकर)' : 'Traditional Bilona (hand-churned from curd)'],
    [hi ? 'ताज़ा डिलीवरी क्षेत्र' : 'Fresh delivery areas', `${live} (Sonipat)`],
    [hi ? 'पूरे भारत में शिपिंग' : 'Ships across India', hi ? 'घी, अचार, शहद, सरसों तेल' : 'Ghee, achar, honey, mustard oil'],
    ['GSTIN', settings.gstin ?? ''],
    ['FSSAI', settings.fssai ?? ''],
    ['Udyam', settings.udyam ?? ''],
    [hi ? 'ऑर्डर / WhatsApp' : 'Orders / WhatsApp', settings.ordersPhone],
    [hi ? 'ईमेल' : 'Email', settings.email],
  ]

  return (
    <>
      <PageHero title={t.about.title} secondary={t.about.tagline} intro={t.about.values} />
      <Breadcrumbs locale={locale} items={[{ name: t.about.title, path: '/about' }]} />
      <section className="container-x max-w-4xl py-10">
        <p className="text-xl leading-relaxed">{t.about.story}</p>
      </section>
      <section className="container-x py-8">
        <SectionHeading title={t.about.valuesTitle} />
        <ul className="grid gap-4 md:grid-cols-3">
          {t.about.valueCards.map((v) => (
            <li key={v.title} className="card p-6">
              <h3 className="text-2xl">{v.title}</h3>
              <p className="mt-2 text-muted">{v.text}</p>
            </li>
          ))}
        </ul>
      </section>
      <section className="container-x py-10" aria-labelledby="facts">
        <h2 id="facts" className="mb-4 text-3xl">{t.about.factsTitle}</h2>
        <dl className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
          {facts.map(([k, v]) => (
            <div key={k} className="grid gap-1 p-4 sm:grid-cols-3">
              <dt className="font-semibold text-walnut">{k}</dt>
              <dd className="sm:col-span-2">{v}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="container-x flex flex-wrap gap-3 pb-6">
        <Link href={href('/farm-story')} className="btn btn-primary">{t.nav.farmStory}</Link>
        <Link href={href('/departments')} className="btn btn-outline">{t.nav.departments}</Link>
        <Link href={href('/facilities')} className="btn btn-outline">{t.nav.facilities}</Link>
        <Link href={href('/shop')} className="btn btn-gold">{t.nav.shop}</Link>
      </section>
    </>
  )
}
