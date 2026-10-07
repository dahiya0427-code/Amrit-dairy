'use server'

import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'

export type PriceChange = {
  productId: number
  variants: { id: string; price: number | null; mrp: number | null; inStock: boolean; stock?: number | null }[]
}

const money = (v: unknown) => (v === null || v === '' || v === undefined ? null : Math.max(0, Math.round(Number(v) * 100) / 100))

/**
 * Saves the Price list screen. Runs as the signed-in admin user with normal
 * access rules, so the product checks (e.g. no ₹0 active product) still apply.
 */
export async function savePrices(changes: PriceChange[]): Promise<{ productId: number; ok: boolean; error?: string }[]> {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) return changes.map((c) => ({ productId: c.productId, ok: false, error: 'Please log in again.' }))

  const results = []
  for (const change of changes.slice(0, 200)) {
    try {
      const product = await payload.findByID({ collection: 'products', id: change.productId, depth: 0, locale: 'en', user, overrideAccess: false })
      const variants = (product.variants ?? []).map((v) => {
        const c = change.variants.find((x) => x.id === v.id)
        if (!c) return v
        const price = money(c.price)
        const mrp = money(c.mrp)
        if (price !== null && !Number.isFinite(price)) throw new Error(`Price for ${v.label} is not a number`)
        const stock = c.stock === null || c.stock === undefined ? null : Math.max(0, Math.round(Number(c.stock)))
        return { ...v, price, mrp: mrp && Number.isFinite(mrp) ? mrp : null, inStock: Boolean(c.inStock), stock: stock !== null && Number.isFinite(stock) ? stock : null }
      })
      await payload.update({ collection: 'products', id: product.id, locale: 'en', data: { variants }, user, overrideAccess: false })
      results.push({ productId: change.productId, ok: true })
    } catch (err) {
      results.push({ productId: change.productId, ok: false, error: err instanceof Error ? err.message : 'Could not save' })
    }
  }
  return results
}
