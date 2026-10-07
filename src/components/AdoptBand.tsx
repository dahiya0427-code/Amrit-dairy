import Image from 'next/image'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import { localePath } from '@/i18n/config'
import { getDictionary } from '@/i18n'
import { Icon } from './Icon'

/** "Adopt a desi cow" invitation band, linking to /adopt-a-cow (home and Farm Story). */
export function AdoptBand({ locale, photos }: { locale: Locale; photos: string[] }) {
  const t = getDictionary(locale)
  const a = t.adopt
  return (
    <section className="container-x py-12">
      <div className="relative overflow-hidden rounded-[28px] bg-ink text-snow">
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(201,162,74,0.32),transparent_65%)]" aria-hidden="true" />
        <div className="relative grid items-center gap-8 p-6 md:grid-cols-[1.2fr_1fr] md:p-12">
          <div>
            <p className="font-serif text-sm font-bold uppercase tracking-[0.3em] text-gold-500">{a.kicker}</p>
            <h2 className="mt-3 font-serif text-3xl leading-[0.95] !text-snow md:text-5xl">{a.bandTitle}</h2>
            <p className="mt-4 max-w-xl text-base text-snow/80 md:text-lg">{a.bandText}</p>
            <Link href={localePath(locale, '/adopt-a-cow')} className="btn btn-gold mt-6 !px-8 !py-4 text-lg shadow-[0_0_40px_-8px_rgba(201,162,74,0.8)]">
              <Icon name="cow" size={22} /> {a.bandCta}
            </Link>
          </div>
          {photos.length > 0 && (
            <div className="grid grid-cols-3 gap-3" aria-hidden="true">
              {photos.slice(0, 3).map((src, i) => (
                <span key={src} className={`relative block aspect-[3/4] overflow-hidden rounded-t-full rounded-b-2xl border-2 border-gold-500/70 ${i === 1 ? '-translate-y-4' : 'translate-y-2'}`}>
                  <Image src={src} alt="" fill sizes="(max-width: 768px) 30vw, 180px" className="object-cover" />
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
