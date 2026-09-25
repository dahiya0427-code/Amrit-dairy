'use client'

import { createContext, useContext, useMemo } from 'react'
import { getDictionary, type Dictionary } from '@/i18n'
import { localePath, type Locale } from '@/i18n/config'

type I18n = { locale: Locale; t: Dictionary; href: (path: string) => string }

const I18nContext = createContext<I18n | null>(null)

export function I18nProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const value = useMemo(() => ({ locale, t: getDictionary(locale), href: (p: string) => localePath(locale, p) }), [locale])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18n {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>')
  return ctx
}
