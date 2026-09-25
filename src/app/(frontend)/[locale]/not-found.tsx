'use client'

import Link from 'next/link'
import { useI18n } from '@/components/I18nProvider'
import { Icon } from '@/components/Icon'

export default function NotFound() {
  const { t, href } = useI18n()
  return (
    <section className="container-x py-20 text-center">
      <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-malai text-gold-700"><Icon name="cow" size={40} /></span>
      <h1 className="mt-6 text-4xl">{t.notFound.title}</h1>
      <p className="mt-3 text-lg text-muted">{t.notFound.text}</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href={href('/')} className="btn btn-primary">{t.common.backHome}</Link>
        <Link href={href('/shop')} className="btn btn-gold">{t.nav.shop}</Link>
      </div>
    </section>
  )
}
