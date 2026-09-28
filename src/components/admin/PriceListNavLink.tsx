import Link from 'next/link'

/** Adds "Price list" to the admin side menu. */
export function PriceListNavLink() {
  return (
    <Link href="/admin/price-list" className="nav__link" style={{ display: 'block', marginTop: 12, fontWeight: 600 }}>
      <span className="nav__link-label">₹ Price list</span>
    </Link>
  )
}
