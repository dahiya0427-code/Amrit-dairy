import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Icon } from '@/components/Icon'
import { LeadForm } from '@/components/LeadForm'
import { Breadcrumbs, PageHero } from '@/components/ui'
import { getDictionary } from '@/i18n'
import { isLocale } from '@/i18n/config'
import { getSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { telLink, whatsappLink } from '@/lib/site'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  return buildMetadata({ locale, path: '/contact', title: t.contact.title, description: t.contact.howToOrderText })
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  const s = await getSettings(locale)

  const cards = [
    { icon: 'whatsapp', title: t.contact.ordersLabel, value: s.ordersPhone, note: t.contact.ordersNote, actions: [{ label: 'WhatsApp', href: whatsappLink(s.ordersPhone, 'Hi Amrit Dairy!'), cls: 'btn-whatsapp' }, { label: t.common.callUs, href: telLink(s.ordersPhone), cls: 'btn-outline' }] },
    { icon: 'cow', title: t.contact.cowLabel, value: s.cowPhone, actions: [{ label: t.common.callUs, href: telLink(s.cowPhone), cls: 'btn-outline' }] },
    { icon: 'mail', title: t.contact.emailLabel, value: s.email, actions: [{ label: s.email, href: `mailto:${s.email}`, cls: 'btn-outline' }] },
    { icon: 'map', title: t.contact.visitLabel, value: s.address, actions: s.mapsUrl ? [{ label: t.contact.directions, href: s.mapsUrl, cls: 'btn-primary' }] : [] },
  ]

  return (
    <>
      <PageHero title={t.contact.hero} eyebrow={t.contact.title} />
      <Breadcrumbs locale={locale} items={[{ name: t.contact.title, path: '/contact' }]} />
      <section className="container-x py-10">
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <li key={c.title} className="card flex flex-col p-5">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-gold-500 text-ink"><Icon name={c.icon} /></span>
              <h2 className="mt-3 font-sans text-base font-semibold text-muted">{c.title}</h2>
              <p className="mt-1 flex-1 font-semibold text-cream">{c.value}{c.note ? <span className="block text-sm font-normal text-muted">{c.note}</span> : null}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {c.actions.map((a) => (
                  <a key={a.href} href={a.href} target={a.href.startsWith('http') ? '_blank' : undefined} rel="noopener" className={`btn ${a.cls} !min-h-10 !px-4 text-sm`}>{a.label}</a>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section className="container-x grid gap-10 pb-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <h2 className="text-3xl">{t.contact.howToOrder}</h2>
          <p className="mt-3 text-lg text-muted">{t.contact.howToOrderText}</p>
          <div className="mt-6 rounded-2xl bg-malai p-5 text-sm">
            <p className="font-semibold text-cream">{t.footer.registered}</p>
            <p className="mt-1">GSTIN: {s.gstin}</p>
            <p>FSSAI Lic. No.: {s.fssai}</p>
            <p>Udyam Reg. No.: {s.udyam}</p>
          </div>
        </div>
        <div className="rounded-lg border border-line bg-char p-6 lg:col-span-3">
          <h2 className="mb-4 text-2xl">{t.contact.formTitle}</h2>
          <LeadForm type="contact" />
        </div>
      </section>
    </>
  )
}
