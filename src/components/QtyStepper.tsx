'use client'

import { Icon } from './Icon'
import { useI18n } from './I18nProvider'

export function QtyStepper({ value, onChange, min = 1, max = 20, size = 'md' }: { value: number; onChange: (v: number) => void; min?: number; max?: number; size?: 'sm' | 'md' }) {
  const { t } = useI18n()
  const btn = size === 'sm' ? 'h-9 w-9' : 'h-11 w-11'
  return (
    <div className="inline-flex items-center rounded-full border border-line bg-white" role="group" aria-label={t.common.quantity}>
      <button type="button" className={`${btn} grid place-items-center rounded-full text-walnut hover:bg-latte disabled:opacity-40`} onClick={() => onChange(value - 1)} disabled={value <= min - 1 || value <= 0} aria-label={t.common.decrease}>
        <Icon name="minus" size={18} />
      </button>
      <span className="min-w-8 text-center font-semibold tabular-nums" aria-live="polite">{value}</span>
      <button type="button" className={`${btn} grid place-items-center rounded-full text-walnut hover:bg-latte disabled:opacity-40`} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={t.common.increase}>
        <Icon name="plus" size={18} />
      </button>
    </div>
  )
}
