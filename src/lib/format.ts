/** ₹3,500 · Indian digit grouping (₹1,00,000). */
export function formatINR(amount: number | null | undefined): string {
  if (amount == null) return ''
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount)
}

export function formatDate(value: string | Date, locale: 'en' | 'hi'): string {
  return new Intl.DateTimeFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', { dateStyle: 'long' }).format(new Date(value))
}

export const isValidPincode = (v: string) => /^[1-9][0-9]{5}$/.test(v.trim())
export const isValidPhone = (v: string) => /^(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/.test(v.trim())
