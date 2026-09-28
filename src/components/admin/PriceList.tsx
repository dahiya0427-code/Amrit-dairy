import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import type { Category } from '@/payload-types'
import { applyOffers } from '@/lib/offers'
import { PriceListEditor, type PriceRow } from './PriceListEditor'

/** Admin → Price list: every product and pack size on one screen. */
export async function PriceListView({ initPageResult, params, searchParams }: AdminViewServerProps) {
  const { req, permissions, visibleEntities, locale } = initPageResult
  if (!req.user) redirect('/admin/login?redirect=%2Fadmin%2Fprice-list')

  const [products, offers] = await Promise.all([
    req.payload.find({ collection: 'products', depth: 1, limit: 500, locale: 'en', sort: 'order', pagination: false }),
    req.payload.find({ collection: 'offers', depth: 0, limit: 200, locale: 'en', pagination: false, where: { active: { equals: true } } }),
  ])

  const rows: PriceRow[] = products.docs.map((p) => {
    const onSite = applyOffers(p, offers.docs)
    const category = p.category as Category | number
    return {
      id: p.id,
      title: p.title,
      category: typeof category === 'object' ? category.title : '',
      status: p.status,
      offer: onSite.offer?.label ?? null,
      variants: (p.variants ?? []).map((v, i) => ({
        id: v.id as string,
        label: v.label,
        sku: v.sku,
        price: v.price ?? null,
        mrp: v.mrp ?? null,
        inStock: v.inStock !== false,
        onDemand: Boolean(v.onDemand),
        sitePrice: onSite.variants?.[i]?.price ?? null,
      })),
    }
  })

  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={req.payload}
      permissions={permissions}
      searchParams={searchParams}
      user={req.user}
      visibleEntities={visibleEntities}
    >
      <Gutter>
        <PriceListEditor rows={rows} />
      </Gutter>
    </DefaultTemplate>
  )
}
