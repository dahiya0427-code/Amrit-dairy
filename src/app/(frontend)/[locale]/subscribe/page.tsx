import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LeadForm } from '@/components/LeadForm'
import { PincodeChecker } from '@/components/PincodeChecker'
import { Breadcrumbs, PageHero } from '@/components/ui'
import { getDictionary } from '@/i18n'
import { isLocale, localePath } from '@/i18n/config'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  return buildMetadata({ locale, path: '/subscribe', title: t.subscribe.title, description: t.subscribe.intro })
}

export default async function SubscribePage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  return (
    <>
      <PageHero title={t.subscribe.title} intro={t.subscribe.intro} secondary={t.home.subscribeTitle} />
      <Breadcrumbs locale={locale} items={[{ name: t.subscribe.title, path: '/subscribe' }]} />
      <section className="container-x grid gap-8 py-10 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-2">
          <ol className="space-y-3">
            {t.subscribe.steps.map((s, i) => (
              <li key={s} className="flex items-center gap-3 rounded-2xl bg-malai p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold-500 font-bold text-ink">{i + 1}</span>
                <span className="font-semibold">{s}</span>
              </li>
            ))}
          </ol>
          <div>
            <p className="label">{t.pincode.label}</p>
            <PincodeChecker fulfilment="local" />
          </div>
          <Link href={localePath(locale, '/delivery')} className="inline-block text-caramel underline underline-offset-4">{t.nav.delivery} →</Link>
        </div>
        <div className="rounded-lg border border-line bg-char p-6 lg:col-span-3">
          <LeadForm type="subscription" product="Desi Cow Milk" submitLabel={t.home.subscribeCta} />
        </div>
      </section>
    </>
  )
}
