import Image from 'next/image'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AdoptForm } from '@/components/AdoptForm'
import { Icon } from '@/components/Icon'
import { Breadcrumbs, FAQ } from '@/components/ui'
import { getDictionary } from '@/i18n'
import { isLocale } from '@/i18n/config'
import { cowPhoto } from '@/lib/cow-photo'
import { getAdoptionPlans, getBreeds, getSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { whatsappLink } from '@/lib/site'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  return buildMetadata({ locale, path: '/adopt-a-cow', title: t.adopt.title, description: t.adopt.intro })
}

/** Adopt a cow (gau seva): sponsor a farm cow's feed and care, with monthly photo updates. */
export default async function AdoptPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  const a = t.adopt
  const [plans, breeds, settings] = await Promise.all([getAdoptionPlans(locale), getBreeds(locale), getSettings(locale)])
  const farm = breeds.filter((b) => b.onFarm)
  const cows = farm.map((b) => ({ name: b.name, photo: cowPhoto(b) }))
  const photos = cows.map((c) => c.photo).filter((x): x is string => Boolean(x))

  return (
    <>
      {/* hero */}
      <section className="relative overflow-hidden bg-ink text-snow">
        <div className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(201,162,74,0.35),transparent_65%)]" aria-hidden="true" />
        <div className="container-x relative grid items-center gap-10 py-14 md:grid-cols-[1.1fr_1fr] md:py-20">
          <div>
            <p className="font-serif text-sm font-bold uppercase tracking-[0.3em] text-gold-500">{a.kicker}</p>
            <h1 className="mt-3 font-serif text-4xl leading-[0.92] !text-snow md:text-6xl">{a.title}</h1>
            <p className="mt-2 font-serif text-xl text-gold-500">{a.hindi}</p>
            <p className="mt-5 max-w-xl text-lg text-snow/80">{a.intro}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#plans" className="btn btn-gold !px-8 !py-4 text-lg shadow-[0_0_40px_-8px_rgba(201,162,74,0.8)]"><Icon name="cow" size={22} /> {a.cta}</a>
              <a href={whatsappLink(settings.cowPhone || settings.ordersPhone, 'Namaste, I would like to adopt a cow.')} target="_blank" rel="noopener" className="btn border border-gold-500/60 bg-transparent text-snow hover:bg-snow/10"><Icon name="whatsapp" size={18} /> WhatsApp</a>
            </div>
          </div>
          {photos.length > 0 && (
            <div className="grid grid-cols-3 gap-3" aria-hidden="true">
              {photos.slice(0, 3).map((src, i) => (
                <span key={src} className={`relative block aspect-[3/4] overflow-hidden rounded-t-full rounded-b-2xl border-2 border-gold-500/70 ${i === 1 ? '-translate-y-6' : 'translate-y-3'}`}>
                  <Image src={src} alt="" fill priority sizes="(max-width: 768px) 30vw, 200px" className="object-cover" />
                </span>
              ))}
            </div>
          )}
        </div>
      </section>
      <Breadcrumbs locale={locale} items={[{ name: a.title, path: '/adopt-a-cow' }]} />

      {/* how it works */}
      <section className="container-x py-10">
        <h2 className="text-center text-3xl md:text-4xl">{a.howTitle}</h2>
        <ul className="mx-auto mt-8 grid max-w-5xl gap-4 md:grid-cols-3">
          {a.how.map((step) => (
            <li key={step.title} className="rounded-2xl border border-line bg-snow p-6 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold-500/20 text-gold-700"><Icon name={step.icon} size={26} /></span>
              <h3 className="mt-3 font-serif text-xl font-bold uppercase text-[#6b3d1f]">{step.title}</h3>
              <p className="mt-2 text-muted">{step.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {plans.length > 0 && (
        <AdoptForm
          cows={cows}
          plans={plans.map((p) => ({ id: p.id, name: p.name, price: p.price, period: p.period, tagline: p.tagline ?? null, perks: (p.perks ?? []).map((x) => x.text), highlight: Boolean(p.highlight) }))}
        />
      )}

      <FAQ locale={locale} faqs={a.faqs} title={a.faqTitle} />
    </>
  )
}
