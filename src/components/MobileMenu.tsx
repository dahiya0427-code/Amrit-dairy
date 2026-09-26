'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useI18n } from './I18nProvider'
import { Icon } from './Icon'
import { LanguageToggle } from './LanguageToggle'

export type NavLink = { label: string; href: string }

export function MobileMenu({ groups, buttonClassName = 'text-cream hover:bg-white/10' }: { groups: { title: string; links: NavLink[] }[]; buttonClassName?: string }) {
  const { t, href } = useI18n()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button type="button" className={`grid h-11 w-11 place-items-center rounded-full ${buttonClassName}`} onClick={() => setOpen(true)} aria-label={t.nav.menu} aria-expanded={open}>
        <Icon name="menu" size={24} />
      </button>
      {open && (
        <div className="fixed inset-0 z-[70] overflow-y-auto bg-cream" role="dialog" aria-modal="true" aria-label={t.nav.menu}>
          <div className="flex items-center justify-between bg-walnut px-4 py-3 text-cream">
            <span className="font-serif text-xl">{t.nav.menu}</span>
            <div className="flex items-center gap-2">
              <LanguageToggle className="text-cream" />
              <button type="button" className="grid h-11 w-11 place-items-center rounded-full hover:bg-white/10" onClick={() => setOpen(false)} aria-label={t.nav.close} autoFocus>
                <Icon name="close" size={24} />
              </button>
            </div>
          </div>
          <nav className="space-y-6 px-5 py-6">
            {groups.map((g) => (
              <div key={g.title}>
                <p className="eyebrow mb-2">{g.title}</p>
                <ul className="divide-y divide-line rounded-2xl bg-white">
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <Link href={href(l.href)} className="flex items-center justify-between px-4 py-3.5 text-lg" onClick={() => setOpen(false)}>
                        {l.label}
                        <Icon name="arrow" size={18} className="text-gold-700" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}
