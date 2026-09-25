'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { localePath, stripLocale } from '@/i18n/config'
import { useI18n } from './I18nProvider'

export function LanguageToggle({ className = '' }: { className?: string }) {
  const { locale, t } = useI18n()
  const pathname = usePathname() || '/'
  const other = locale === 'en' ? 'hi' : 'en'
  const target = localePath(other, stripLocale(pathname))
  return (
    <Link
      href={target}
      hrefLang={other === 'hi' ? 'hi-IN' : 'en-IN'}
      lang={other}
      className={`inline-flex h-10 items-center rounded-full border border-gold-500/60 px-3 text-sm font-semibold ${className}`}
      aria-label={t.nav.languageLabel}
    >
      {t.nav.language}
    </Link>
  )
}
