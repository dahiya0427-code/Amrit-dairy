'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type CartItem = {
  productId: number
  slug: string
  title: string
  variantLabel: string
  sku: string
  price: number
  image?: string | null
  fulfilment: 'local' | 'ship'
  qty: number
}

type Cart = {
  items: CartItem[]
  count: number
  subtotal: number
  ready: boolean
  open: boolean
  setOpen: (v: boolean) => void
  add: (item: Omit<CartItem, 'qty'>, qty?: number) => void
  setQty: (sku: string, qty: number) => void
  remove: (sku: string) => void
  clear: () => void
}

const KEY = 'amrit-cart-v1'
const MAX_QTY = 20
const CartContext = createContext<Cart | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [ready, setReady] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {
      // storage unavailable (private mode); cart stays in memory
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {
      // ignore
    }
  }, [items, ready])

  const add = useCallback<Cart['add']>((item, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.sku === item.sku)
      if (existing) return prev.map((i) => (i.sku === item.sku ? { ...i, ...item, qty: Math.min(MAX_QTY, i.qty + qty) } : i))
      return [...prev, { ...item, qty: Math.min(MAX_QTY, qty) }]
    })
    setOpen(true)
  }, [])

  const setQty = useCallback((sku: string, qty: number) => {
    setItems((prev) => (qty <= 0 ? prev.filter((i) => i.sku !== sku) : prev.map((i) => (i.sku === sku ? { ...i, qty: Math.min(MAX_QTY, qty) } : i))))
  }, [])

  const remove = useCallback((sku: string) => setItems((prev) => prev.filter((i) => i.sku !== sku)), [])
  const clear = useCallback(() => setItems([]), [])

  const value = useMemo<Cart>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((n, i) => n + i.qty * i.price, 0),
      ready,
      open,
      setOpen,
      add,
      setQty,
      remove,
      clear,
    }),
    [items, ready, open, add, setQty, remove, clear],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): Cart {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
