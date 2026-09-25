import { APIError, type CollectionConfig } from 'payload'
import { anyone, loggedIn } from '@/access'
import { slugField } from '@/fields/slug'
import { seoField } from '@/fields/seo'
import { faqsField } from '@/fields/faqs'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    group: 'Shop',
    defaultColumns: ['title', 'category', 'status', 'fulfilment', 'featured'],
    listSearchableFields: ['title', 'slug'],
  },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  defaultSort: 'order',
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
    beforeChange: [
      ({ data, originalDoc }) => {
        // Doc 01 §7: never publish a product at ₹0.
        const status = data.status ?? originalDoc?.status
        if (status === 'active') {
          const variants = (data.variants ?? originalDoc?.variants ?? []) as { price?: number; onDemand?: boolean }[]
          const buyable = variants.filter((v) => !v.onDemand)
          if (buyable.length === 0 || buyable.some((v) => !v.price || v.price <= 0)) {
            throw new APIError(
              'An "Active" product needs at least one variant with a price above ₹0. Use "Coming soon" until prices are set.',
              400,
              undefined,
              true,
            )
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Basics',
          fields: [
            { name: 'title', type: 'text', required: true, localized: true },
            {
              name: 'secondaryName',
              type: 'text',
              localized: true,
              admin: {
                description:
                  'Shown under the name. Write it in the other language, as on the packaging (English page → "देसी गाय का बिलोना घी").',
              },
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              localized: true,
              admin: { description: 'One or two lines for product cards and search results.' },
            },
            { name: 'description', type: 'richText', localized: true },
            {
              name: 'images',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              admin: { description: 'First image is the main packshot (1:1, cream background).' },
            },
          ],
        },
        {
          label: 'Pricing & variants',
          fields: [
            {
              name: 'variants',
              type: 'array',
              minRows: 1,
              labels: { singular: 'Variant', plural: 'Variants' },
              admin: { description: 'Pack sizes. Prices are in rupees, GST-inclusive.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', required: true, localized: true, admin: { width: '40%' } },
                    { name: 'sku', type: 'text', required: true, admin: { width: '30%' } },
                    { name: 'weightGrams', type: 'number', admin: { width: '30%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'price', type: 'number', min: 0, admin: { width: '33%', description: 'Selling price (₹)' } },
                    { name: 'mrp', type: 'number', min: 0, admin: { width: '33%', description: 'MRP (₹), optional' } },
                    {
                      name: 'unitPriceLabel',
                      type: 'text',
                      localized: true,
                      admin: { width: '33%', description: 'e.g. ₹350 / 100 g' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'inStock', type: 'checkbox', defaultValue: true },
                    {
                      name: 'onDemand',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: { description: 'Bulk / made to order: shows "Request bulk order" instead of Add to cart.' },
                    },
                  ],
                },
              ],
            },
            { name: 'subscribable', type: 'checkbox', defaultValue: false, admin: { description: 'Offer daily subscription (milk, curd, buttermilk).' } },
          ],
        },
        {
          label: 'Details',
          fields: [
            {
              name: 'highlights',
              type: 'array',
              localized: true,
              maxRows: 6,
              fields: [{ name: 'text', type: 'text', required: true }],
            },
            {
              name: 'process',
              label: 'How it is made',
              type: 'array',
              localized: true,
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'text', type: 'textarea' },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'ingredients', type: 'text', localized: true },
                { name: 'shelfLife', type: 'text', localized: true },
              ],
            },
            { name: 'storage', type: 'text', localized: true },
            faqsField,
          ],
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'coming_soon',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Active (can be bought)', value: 'active' },
        { label: 'Coming soon (Notify me)', value: 'coming_soon' },
        { label: 'Out of stock (Notify me)', value: 'out_of_stock' },
      ],
    },
    {
      name: 'fulfilment',
      type: 'select',
      required: true,
      defaultValue: 'ship',
      admin: { position: 'sidebar', description: 'Fresh items can only be delivered in live service areas.' },
      options: [
        { label: 'Fresh: local delivery only', value: 'local' },
        { label: 'Shelf-stable: ships across India', value: 'ship' },
      ],
    },
    { name: 'category', type: 'relationship', relationTo: 'categories', required: true, admin: { position: 'sidebar' } },
    {
      name: 'badge',
      type: 'select',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Bestseller', value: 'bestseller' },
        { label: 'New', value: 'new' },
      ],
    },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar', description: 'Show in Bestsellers on the home page.' } },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    { name: 'relatedProducts', type: 'relationship', relationTo: 'products', hasMany: true, admin: { position: 'sidebar' } },
    slugField(),
    seoField,
  ],
}
