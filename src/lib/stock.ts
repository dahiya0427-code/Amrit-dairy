import type { Payload, PayloadRequest } from 'payload'

type Line = { product?: number | { id: number } | null; sku?: string | null; quantity?: number | null }

/**
 * Changes "Stock left" on the ordered packs: -1 per pack when an order is
 * placed, +1 when it is cancelled or refunded. Packs without a stock count
 * are left alone. Best effort: a failure is logged, never blocks the order.
 */
export async function adjustStock(payload: Payload, lines: Line[], direction: -1 | 1, req?: PayloadRequest) {
  const byProduct = new Map<number, Map<string, number>>()
  for (const l of lines) {
    const id = typeof l.product === 'object' ? l.product?.id : l.product
    if (!id || !l.sku || !l.quantity) continue
    const skus = byProduct.get(id) ?? new Map<string, number>()
    skus.set(l.sku, (skus.get(l.sku) ?? 0) + l.quantity)
    byProduct.set(id, skus)
  }
  for (const [id, skus] of byProduct) {
    try {
      const product = await payload.findByID({ collection: 'products', id, depth: 0, locale: 'en', overrideAccess: true, req })
      let changed = false
      const variants = (product.variants ?? []).map((v) => {
        const qty = skus.get(v.sku)
        if (!qty || typeof v.stock !== 'number') return v
        changed = true
        return { ...v, stock: Math.max(0, v.stock + direction * qty) }
      })
      if (changed) await payload.update({ collection: 'products', id, locale: 'en', data: { variants }, overrideAccess: true, req })
    } catch (err) {
      payload.logger.error({ err }, `Could not update stock for product ${id}`)
    }
  }
}
