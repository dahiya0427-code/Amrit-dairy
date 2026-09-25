import type { Product } from '@/payload-types'

export type Variant = NonNullable<Product['variants']>[number]

export const buyableVariants = (p: Product): Variant[] =>
  p.status === 'active' ? (p.variants ?? []).filter((v) => !v.onDemand && v.inStock !== false && (v.price ?? 0) > 0) : []

export const isBuyable = (p: Product) => buyableVariants(p).length > 0

/** Lowest shown price; never returns 0 (Doc 01 §7). */
export function minPrice(p: Product): number | null {
  const prices = buyableVariants(p).map((v) => v.price as number)
  return prices.length ? Math.min(...prices) : null
}

export const hasMultiplePrices = (p: Product) => new Set(buyableVariants(p).map((v) => v.price)).size > 1
