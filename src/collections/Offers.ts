import { APIError, type CollectionConfig } from 'payload'
import { adminsOrManagers, anyone } from '@/access'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

/**
 * Automatic sale prices. While an offer is live, the matching products show
 * the lower price (with the old one struck through) and checkout charges it.
 * No code needed; for codes customers type in, use Coupons.
 */
export const Offers: CollectionConfig = {
  slug: 'offers',
  labels: { singular: 'Offer', plural: 'Offers' },
  admin: {
    useAsTitle: 'title',
    group: 'Shop',
    defaultColumns: ['title', 'discountType', 'value', 'appliesTo', 'active', 'startsAt', 'endsAt'],
    description:
      'Sale prices applied automatically on the website, e.g. "10% off all ghee this Diwali". If two offers match a product, the bigger discount is used. Changes show on the site within 5 minutes.',
  },
  access: { read: anyone, create: adminsOrManagers, update: adminsOrManagers, delete: adminsOrManagers },
  defaultSort: '-createdAt',
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
    beforeChange: [
      ({ data }) => {
        if (data.discountType === 'percent' && (data.value ?? 0) >= 100) throw new APIError('A percentage offer must be below 100%.', 400, undefined, true)
        if (data.startsAt && data.endsAt && new Date(data.endsAt) <= new Date(data.startsAt)) throw new APIError('The end date must be after the start date.', 400, undefined, true)
        return data
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, admin: { description: 'For your reference, e.g. "Diwali ghee offer".' } },
    {
      name: 'badge',
      type: 'text',
      localized: true,
      maxLength: 24,
      admin: { description: 'Short label on the product, e.g. "Diwali offer". Leave empty to use the title.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'discountType',
          type: 'select',
          required: true,
          defaultValue: 'percent',
          admin: { width: '50%' },
          options: [
            { label: 'Percent off (%)', value: 'percent' },
            { label: 'Rupees off each pack (₹)', value: 'flat' },
          ],
        },
        { name: 'value', type: 'number', required: true, min: 1, admin: { width: '50%', description: 'e.g. 10 for 10% or ₹10' } },
      ],
    },
    {
      name: 'appliesTo',
      type: 'select',
      required: true,
      defaultValue: 'all',
      options: [
        { label: 'All products', value: 'all' },
        { label: 'Chosen categories', value: 'categories' },
        { label: 'Chosen products', value: 'products' },
      ],
    },
    { name: 'categories', type: 'relationship', relationTo: 'categories', hasMany: true, admin: { condition: (_, s) => s?.appliesTo === 'categories' } },
    { name: 'products', type: 'relationship', relationTo: 'products', hasMany: true, admin: { condition: (_, s) => s?.appliesTo === 'products' } },
    { name: 'active', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar', description: 'Untick to pause the offer.' } },
    { name: 'startsAt', type: 'date', admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' }, description: 'Optional. Empty = starts now.' } },
    { name: 'endsAt', type: 'date', admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' }, description: 'Optional. Empty = no end.' } },
  ],
}
