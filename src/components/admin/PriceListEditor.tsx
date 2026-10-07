'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState, useTransition } from 'react'
import { savePrices, type PriceChange } from './price-actions'

export type PriceRow = {
  id: number
  title: string
  category: string
  status: 'active' | 'coming_soon' | 'out_of_stock'
  offer: string | null
  variants: { id: string; label: string; sku: string; price: number | null; mrp: number | null; inStock: boolean; stock: number | null; onDemand: boolean; sitePrice: number | null }[]
}

type Edit = { price: string; mrp: string; inStock: boolean; stock: string }

const statusLabel = { active: 'Active', coming_soon: 'Coming soon', out_of_stock: 'Out of stock' }
const toText = (n: number | null) => (n === null || n === undefined ? '' : String(n))
const toNum = (s: string) => (s.trim() === '' ? null : Number(s))

/** Editable price table for Admin → Price list. Nothing is saved until "Save changes". */
export function PriceListEditor({ rows: initialRows }: { rows: PriceRow[] }) {
  const router = useRouter()
  // saved values, updated straight after a save so the table never shows old prices
  const [rows, setRows] = useState(initialRows)
  useEffect(() => setRows(initialRows), [initialRows])
  const [edits, setEdits] = useState<Record<string, Edit>>({})
  const [filter, setFilter] = useState('')
  const [bulkPct, setBulkPct] = useState('')
  const [messages, setMessages] = useState<Record<number, string>>({})
  const [saved, setSaved] = useState('')
  const [pending, start] = useTransition()

  const categories = useMemo(() => [...new Set(rows.map((r) => r.category).filter(Boolean))], [rows])
  const shown = rows.filter((r) => !filter || r.category === filter)

  const value = (v: PriceRow['variants'][number]): Edit => edits[v.id] ?? { price: toText(v.price), mrp: toText(v.mrp), inStock: v.inStock, stock: toText(v.stock) }
  const set = (v: PriceRow['variants'][number], patch: Partial<Edit>) => setEdits((e) => ({ ...e, [v.id]: { ...value(v), ...patch } }))

  const isChanged = (v: PriceRow['variants'][number]) => {
    const e = edits[v.id]
    return Boolean(e && (toNum(e.price) !== v.price || toNum(e.mrp) !== v.mrp || e.inStock !== v.inStock || toNum(e.stock) !== v.stock))
  }
  const changedCount = rows.flatMap((r) => r.variants).filter(isChanged).length

  /** Raise or lower every shown price by a percentage (rounded to whole rupees). */
  function applyBulk() {
    const pct = Number(bulkPct)
    if (!pct || !Number.isFinite(pct)) return
    setEdits((e) => {
      const next = { ...e }
      for (const r of shown)
        for (const v of r.variants) {
          const cur = e[v.id] ?? { price: toText(v.price), mrp: toText(v.mrp), inStock: v.inStock, stock: toText(v.stock) }
          const p = toNum(cur.price)
          if (p) next[v.id] = { ...cur, price: String(Math.max(1, Math.round(p * (1 + pct / 100)))) }
        }
      return next
    })
    setBulkPct('')
  }

  function save() {
    const changes: PriceChange[] = rows
      .map((r) => ({
        productId: r.id,
        variants: r.variants.filter(isChanged).map((v) => {
          const e = edits[v.id]
          return { id: v.id, price: toNum(e.price), mrp: toNum(e.mrp), inStock: e.inStock, stock: toNum(e.stock) }
        }),
      }))
      .filter((c) => c.variants.length)
    if (!changes.length) return
    setSaved('')
    start(async () => {
      const results = await savePrices(changes)
      const msgs: Record<number, string> = {}
      results.forEach((r) => {
        if (!r.ok) msgs[r.productId] = r.error ?? 'Could not save'
      })
      setMessages(msgs)
      setRows((prev) =>
        prev.map((r) => {
          const change = changes.find((c) => c.productId === r.id)
          if (!change || msgs[r.id]) return r
          return { ...r, variants: r.variants.map((v) => ({ ...v, ...change.variants.find((x) => x.id === v.id) })) }
        }),
      )
      const ok = results.filter((r) => r.ok).length
      setSaved(`${ok} product${ok === 1 ? '' : 's'} saved${results.length > ok ? `, ${results.length - ok} with problems (see below)` : ''}. The website updates within a few minutes.`)
      // keep unsaved edits only for products that failed
      setEdits((e) => {
        const keep: Record<string, Edit> = {}
        for (const r of rows) if (msgs[r.id]) for (const v of r.variants) if (e[v.id]) keep[v.id] = e[v.id]
        return keep
      })
      router.refresh()
    })
  }

  return (
    <div className="price-list">
      <style>{css}</style>
      <header className="pl-head">
        <div>
          <h1>Price list</h1>
          <p className="pl-muted">
            Change prices, MRP and stock for every pack in one place. “Stock left” is optional: when it gets low the shop shows “Only N left!”, and it goes down with each order. Prices are in rupees, GST included. For sale prices use <Link href="/admin/collections/offers">Offers</Link>; for codes use{' '}
            <Link href="/admin/collections/coupons">Coupons</Link>.
          </p>
        </div>
      </header>

      <div className="pl-tools">
        <label>
          Category{' '}
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Change shown prices by{' '}
          <input type="number" step="1" placeholder="e.g. 5 or -10" value={bulkPct} onChange={(e) => setBulkPct(e.target.value)} style={{ width: 110 }} /> %
        </label>
        <button type="button" className="pl-btn" onClick={applyBulk} disabled={!bulkPct}>
          Apply to list
        </button>
        <span className="pl-spacer" />
        {changedCount > 0 && (
          <button type="button" className="pl-btn pl-ghost" onClick={() => setEdits({})} disabled={pending}>
            Undo changes
          </button>
        )}
        <button type="button" className="pl-btn pl-primary" onClick={save} disabled={!changedCount || pending}>
          {pending ? 'Saving…' : `Save changes${changedCount ? ` (${changedCount})` : ''}`}
        </button>
      </div>
      {saved && <p className="pl-saved">{saved}</p>}

      <table className="pl-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Pack</th>
            <th>Price ₹</th>
            <th>MRP ₹</th>
            <th>In stock</th>
            <th>Stock left</th>
            <th>On the website now</th>
          </tr>
        </thead>
        <tbody>
          {shown.map((r) =>
            r.variants.map((v, i) => {
              const e = value(v)
              return (
                <tr key={v.id} className={`${i === 0 ? 'pl-first' : ''} ${isChanged(v) ? 'pl-changed' : ''}`}>
                  {i === 0 && (
                    <td rowSpan={r.variants.length} className="pl-product">
                      <Link href={`/admin/collections/products/${r.id}`}>{r.title}</Link>
                      <span className="pl-muted">
                        {r.category} · {statusLabel[r.status]}
                      </span>
                      {r.offer && <span className="pl-offer">Offer: {r.offer}</span>}
                      {messages[r.id] && <span className="pl-error">{messages[r.id]}</span>}
                    </td>
                  )}
                  <td>
                    {v.label}
                    <span className="pl-muted">{v.sku}</span>
                  </td>
                  <td>
                    {v.onDemand ? (
                      <span className="pl-muted">On request</span>
                    ) : (
                      <input type="number" min="0" step="1" value={e.price} onChange={(ev) => set(v, { price: ev.target.value })} aria-label={`Price for ${r.title} ${v.label}`} />
                    )}
                  </td>
                  <td>
                    <input type="number" min="0" step="1" value={e.mrp} onChange={(ev) => set(v, { mrp: ev.target.value })} aria-label={`MRP for ${r.title} ${v.label}`} />
                  </td>
                  <td>
                    <input type="checkbox" checked={e.inStock} onChange={(ev) => set(v, { inStock: ev.target.checked })} aria-label={`${r.title} ${v.label} in stock`} />
                  </td>
                  <td>
                    <input type="number" min="0" step="1" placeholder="not counted" value={e.stock} onChange={(ev) => set(v, { stock: ev.target.value })} aria-label={`Stock left for ${r.title} ${v.label}`} style={{ width: 120 }} />
                  </td>
                  <td>
                    {r.status !== 'active' || v.onDemand || !v.sitePrice ? (
                      <span className="pl-muted">Not for sale</span>
                    ) : v.sitePrice !== v.price ? (
                      <span>
                        <strong>₹{v.sitePrice}</strong> <s className="pl-muted">₹{v.price}</s>
                      </span>
                    ) : (
                      <span>₹{v.sitePrice}</span>
                    )}
                  </td>
                </tr>
              )
            }),
          )}
        </tbody>
      </table>
    </div>
  )
}

const css = `
.price-list { padding: 24px 0 64px; }
.price-list h1 { margin: 0 0 6px; }
.pl-muted { display: block; color: var(--theme-elevation-500); font-size: 13px; }
.pl-head p a { text-decoration: underline; }
.pl-tools { position: sticky; top: 0; z-index: 2; display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin: 20px 0 8px; padding: 12px; border: 1px solid var(--theme-elevation-150); border-radius: 8px; background: var(--theme-bg); }
.pl-tools select, .pl-tools input, .pl-table input[type=number] { padding: 6px 8px; border: 1px solid var(--theme-elevation-200); border-radius: 4px; background: var(--theme-input-bg, var(--theme-elevation-0)); color: var(--theme-text); font: inherit; }
.pl-spacer { flex: 1; }
.pl-btn { padding: 8px 14px; border: 1px solid var(--theme-elevation-300); border-radius: 4px; background: var(--theme-elevation-50); color: var(--theme-text); font: inherit; cursor: pointer; }
.pl-btn:disabled { opacity: .5; cursor: default; }
.pl-primary { border-color: var(--theme-text); background: var(--theme-text); color: var(--theme-bg); font-weight: 600; }
.pl-ghost { background: transparent; }
.pl-saved { padding: 10px 12px; border-radius: 6px; background: var(--theme-success-100); color: var(--theme-success-800); }
.pl-table { width: 100%; border-collapse: collapse; }
.pl-table th { position: sticky; top: 64px; background: var(--theme-bg); text-align: left; font-size: 13px; color: var(--theme-elevation-600); padding: 8px; border-bottom: 1px solid var(--theme-elevation-200); }
.pl-table td { padding: 8px; vertical-align: top; border-bottom: 1px solid var(--theme-elevation-100); }
.pl-table tr.pl-first td { border-top: 2px solid var(--theme-elevation-150); }
.pl-table input[type=number] { width: 110px; }
.pl-table input[type=checkbox] { width: 18px; height: 18px; }
.pl-changed td:not(.pl-product) { background: var(--theme-warning-50, rgba(255, 200, 0, .08)); }
.pl-product a { font-weight: 600; }
.pl-offer { display: inline-block; margin-top: 4px; padding: 2px 8px; border-radius: 99px; background: #c9a24a; color: #1e1c19; font-size: 12px; font-weight: 600; }
.pl-error { display: block; margin-top: 4px; color: var(--theme-error-500); font-size: 13px; }
`
