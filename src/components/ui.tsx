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
      {eyebrow && <p className={`eyebrow mb-2 ${light ? '!text-gold-700' : ''}`}>{eyebrow}</p>}
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
                <Link href={localePath(locale, item.path)} className="hover:text-cream hover:underline">{item.name}</Link>
              ) : (
                <span aria-current={i === all.length - 1 ? 'page' : undefined} className="text-cream">{item.name}</span>
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
        <p className="mb-3 text-center"><span className="inline-flex rounded-full bg-gold-500/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-gold-700">{t.common.faqEyebrow}</span></p>
        <h2 id="faq-title" className="mb-8 text-center text-4xl md:text-6xl">{title ?? t.common.faqTitle}</h2>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <details key={i} className="group rounded-3xl border border-line bg-char px-6 py-1 open:border-gold-500/60">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-semibold [&::-webkit-details-marker]:hidden">
                {f.question}
                <Icon name="plus" className="shrink-0 rounded-full bg-gold-500 p-1 text-ink transition group-open:rotate-45" size={28} />
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
    <section className="relative overflow-hidden border-b border-line bg-char">
      <div className="container-x relative py-14 text-center md:py-20">
        {eyebrow && <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-gold-700">{eyebrow}</p>}
        <h1 className="mx-auto max-w-4xl text-5xl leading-[0.95] md:text-7xl">{title}</h1>
        {secondary && <p className="mt-3 text-xl font-semibold text-gold-700">{secondary}</p>}
        {intro && <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">{intro}</p>}
      </div>
    </section>
  )
}

export function Badge({ tone, children }: { tone: 'bestseller' | 'new' | 'soon' | 'ship' | 'local' | 'offer'; children: React.ReactNode }) {
  const tones = {
    bestseller: 'bg-ink text-gold-500',
    new: 'bg-leaf text-ink',
    soon: 'bg-ink/85 text-snow',
    ship: 'bg-ink/85 text-snow',
    local: 'bg-char text-cream border border-line',
    offer: 'bg-gold-500 text-ink',
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
