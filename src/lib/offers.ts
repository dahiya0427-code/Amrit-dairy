import type { Offer, Product } from '@/payload-types'

/**
 * Automatic offers (Shop → Offers in the admin). Pure functions shared by the
 * pages (shown prices) and checkout (charged prices), so both always agree.
 */
export type OfferTag = { label: string; percentOff: number }
export type RatingTag = { average: number; count: number }
export type ComboTag = { worth: number; save: number; items: { title: string; slug: string; quantity: number; note: string | null; image: unknown }[] }
/** A product as the pages get it: offer prices plus review stars, low stock and combo savings. */
export type PricedProduct = Product & { offer?: OfferTag | null; rating?: RatingTag | null; lowStock?: number | null; combo?: ComboTag | null }

const idOf = (v: unknown) => (typeof v === 'object' && v !== null ? (v as { id: number }).id : (v as number))

/** Is the offer switched on and inside its dates right now? */
export function offerIsLive(o: Offer, now = new Date()) {
  if (!o.active) return false
  if (o.startsAt && new Date(o.startsAt) > now) return false
  if (o.endsAt && new Date(o.endsAt) <= now) return false
  return true
}

export function offerAppliesTo(o: Offer, p: Product) {
  if (o.appliesTo === 'products') return (o.products ?? []).some((x) => idOf(x) === p.id)
  if (o.appliesTo === 'categories') return (o.categories ?? []).some((x) => idOf(x) === idOf(p.category))
  return true
}

/** Offer price for one pack: whole rupees, never below ₹1. */
export function offerPrice(o: Offer, price: number) {
  const off = o.discountType === 'flat' ? o.value : (price * o.value) / 100
  return Math.max(1, Math.round(price - Math.max(0, off)))
}

/**
 * Returns the product with each pack priced at its best live offer. The
 * original price moves to MRP (unless the MRP is already higher) so the
 * struck-through price and "% off" show everywhere without extra work.
 */
export function applyOffers<T extends Product>(p: T, offers: Offer[], now = new Date()): T & { offer: OfferTag | null } {
  const live = offers.filter((o) => offerIsLive(o, now) && offerAppliesTo(o, p))
  if (!live.length || p.status !== 'active') return { ...p, offer: null }
  let best: { offer: Offer; pct: number } | null = null
  const variants = (p.variants ?? []).map((v) => {
    if (!v.price || v.price <= 0 || v.onDemand) return v
    let price = v.price
    let used: Offer | null = null
    for (const o of live) {
      const np = offerPrice(o, v.price)
      if (np < price) {
        price = np
        used = o
      }
    }
    if (!used) return v
    const pct = Math.round(((v.price - price) / v.price) * 100)
    if (!best || pct > best.pct) best = { offer: used, pct }
    return { ...v, price, mrp: Math.max(v.mrp ?? 0, v.price) }
  })
  const b = best as { offer: Offer; pct: number } | null
  return { ...p, variants, offer: b ? { label: b.offer.badge || b.offer.title, percentOff: b.pct } : null }
}
