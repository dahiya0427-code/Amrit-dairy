import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import { localePath } from '@/i18n/config'
import { getDictionary } from '@/i18n'
import { breadcrumbJsonLd, faqJsonLd } from '@/lib/seo'
import { JsonLd } from './JsonLd'
import { Icon } from './Icon'

export function SectionHeading({ eyebrow, title, intro, align = 'left', as: Tag = 'h2', light = false }: { eyebrow?: string; title: string; intro?: string | null; align?: 'left' | 'center'; as?: 'h1' | 'h2'; light?: boolean }) {
  return (
    <div className={`mb-8 ${align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-3xl'}`}>
      {eyebrow && <p className={`eyebrow mb-2 ${light ? '!text-gold-500' : ''}`}>{eyebrow}</p>}
      <Tag className={`${Tag === 'h1' ? 'text-4xl md:text-5xl' : 'text-3xl md:text-4xl'} ${light ? '!text-cream' : ''}`}>{title}</Tag>
      {intro && <p className={`mt-3 text-lg ${light ? 'text-cream/85' : 'text-muted'}`}>{intro}</p>}
    </div>
  )
}

export function Breadcrumbs({ locale, items }: { locale: Locale; items: { name: string; path: string }[] }) {
  const t = getDictionary(locale)
  const all = [{ name: t.common.breadcrumbHome, path: '/' }, ...items]
  return (
    <>
      <nav aria-label="Breadcrumb" className="container-x pt-6 text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          {all.map((item, i) => (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden="true">/</span>}
              {i < all.length - 1 ? (
                <Link href={localePath(locale, item.path)} className="hover:text-walnut hover:underline">{item.name}</Link>
              ) : (
                <span aria-current={i === all.length - 1 ? 'page' : undefined} className="text-ink">{item.name}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(locale, all)} />
    </>
  )
}

export function FAQ({ locale, faqs, title }: { locale: Locale; faqs: { question: string; answer: string }[]; title?: string }) {
  if (!faqs?.length) return null
  const t = getDictionary(locale)
  return (
    <section className="container-x py-12" aria-labelledby="faq-title">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow mb-2 text-center">{t.common.faqEyebrow}</p>
        <h2 id="faq-title" className="mb-6 text-center text-3xl md:text-4xl">{title ?? t.common.faqTitle}</h2>
        <div className="divide-y divide-line rounded-md border border-line bg-cream">
          {faqs.map((f, i) => (
            <details key={i} className="group px-5 py-1">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-semibold [&::-webkit-details-marker]:hidden">
                {f.question}
                <Icon name="plus" className="shrink-0 text-gold-700 transition group-open:rotate-45" />
              </summary>
              <p className="pb-4 text-muted">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
      <JsonLd data={faqJsonLd(faqs)} />
    </section>
  )
}

export function PageHero({ title, intro, eyebrow, secondary }: { title: string; intro?: string | null; eyebrow?: string; secondary?: string }) {
  return (
    <section className="bg-[radial-gradient(ellipse_at_50%_0%,#7a5234,#4a2e1c_55%,#2b1a10)] text-cream">
      <div className="container-x flex flex-col items-center py-14 text-center md:py-20">
        {eyebrow && <p className="eyebrow mb-3 !text-gold-500">{eyebrow}</p>}
        <h1 className="text-4xl !text-cream md:text-6xl">{title}</h1>
        {secondary && <p className="mt-3 font-serif text-2xl italic text-gold-500">{secondary}</p>}
        <span className="mt-5 h-px w-20 bg-gold-500/70" aria-hidden="true" />
        {intro && <p className="mt-5 max-w-2xl text-lg text-cream/85">{intro}</p>}
      </div>
    </section>
  )
}

export function Badge({ tone, children }: { tone: 'bestseller' | 'new' | 'soon' | 'ship' | 'local'; children: React.ReactNode }) {
  const tones = {
    bestseller: 'bg-clay text-white',
    new: 'bg-walnut text-cream',
    soon: 'bg-butter text-gold-700',
    ship: 'bg-latte text-walnut',
    local: 'bg-white text-walnut border border-line',
  }
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${tones[tone]}`}>{children}</span>
}

export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((text, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-latte text-caramel"><Icon name="check" size={16} /></span>
          <span>{text}</span>
        </li>
      ))}
    </ul>
  )
}
