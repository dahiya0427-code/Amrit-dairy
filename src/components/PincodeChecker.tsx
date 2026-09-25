'use client'

import { useEffect, useState } from 'react'
import { useI18n } from './I18nProvider'
import { Icon } from './Icon'

type Result = { live: { name: string; slot?: string | null }[]; comingSoon: { name: string }[] }
const KEY = 'amrit-pincode'

export function PincodeChecker({ fulfilment, onResult, compact = false }: { fulfilment?: 'local' | 'ship'; onResult?: (live: boolean) => void; compact?: boolean }) {
  const { t, locale } = useI18n()
  const [code, setCode] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'invalid' | 'error'>('idle')
  const [result, setResult] = useState<Result | null>(null)

  async function check(value: string) {
    if (!/^[1-9][0-9]{5}$/.test(value)) {
      setState('invalid')
      return
    }
    setState('loading')
    try {
      const res = await fetch(`/api/pincode?code=${value}&locale=${locale}`)
      if (!res.ok) throw new Error()
      const json: Result = await res.json()
      setResult(json)
      setState('done')
      onResult?.(json.live.length > 0)
      try { localStorage.setItem(KEY, value) } catch { /* ignore */ }
    } catch {
      setState('error')
    }
  }

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY)
      if (saved) {
        setCode(saved)
        check(saved)
      }
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const live = result?.live ?? []
  const soon = result?.comingSoon ?? []

  return (
    <div className={compact ? '' : 'rounded-2xl border border-line bg-white p-4'}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          check(code.trim())
        }}
        className="flex gap-2"
      >
        <label htmlFor={`pin-${fulfilment ?? 'any'}`} className="sr-only">{t.pincode.label}</label>
        <span className="hidden items-center text-leaf-600 sm:flex"><Icon name="map" /></span>
        <input
          id={`pin-${fulfilment ?? 'any'}`}
          className="input flex-1"
          inputMode="numeric"
          maxLength={6}
          placeholder={t.pincode.placeholder}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          autoComplete="postal-code"
        />
        <button type="submit" className="btn btn-primary !px-5" disabled={state === 'loading'}>
          {state === 'loading' ? '…' : t.pincode.check}
        </button>
      </form>
      <div aria-live="polite" className="mt-2 space-y-1 text-sm">
        {state === 'invalid' && <p className="text-error">{t.pincode.invalid}</p>}
        {state === 'error' && <p className="text-error">{t.pincode.error}</p>}
        {state === 'done' && (
          <>
            {live.length > 0 && fulfilment !== 'ship' && (
              <p className="font-semibold text-success">{t.pincode.live(live.map((a) => a.name).join(', '), live[0]?.slot ?? '')}</p>
            )}
            {live.length === 0 && soon.length > 0 && fulfilment !== 'ship' && (
              <p className="font-semibold text-warning">{t.pincode.comingSoon(soon.map((a) => a.name).join(', '))}</p>
            )}
            {live.length === 0 && soon.length === 0 && fulfilment !== 'ship' && <p className="text-muted">{t.pincode.notLive}</p>}
            {fulfilment !== 'local' && <p className="text-forest-900">📦 {t.pincode.ships}</p>}
          </>
        )}
      </div>
    </div>
  )
}
