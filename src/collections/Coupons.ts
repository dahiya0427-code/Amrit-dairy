import { APIError, type CollectionConfig } from 'payload'
import { adminsOrManagers } from '@/access'

/**
 * Codes customers type at checkout. Checked again on the server when the order
 * is placed, so a code can never be used outside its rules.
 */
export const Coupons: CollectionConfig = {
  slug: 'coupons',
  labels: { singular: 'Coupon', plural: 'Coupons' },
  admin: {
    useAsTitle: 'code',
    group: 'Shop',
    defaultColumns: ['code', 'type', 'value', 'minOrder', 'usedCount', 'active', 'endsAt'],
    description: 'Discount codes for checkout, e.g. WELCOME10. Codes are not case-sensitive.',
  },
  // Codes are private: only staff can list them. Checkout reads them server-side.
  access: { read: adminsOrManagers, create: adminsOrManagers, update: adminsOrManagers, delete: adminsOrManagers },
  defaultSort: '-createdAt',
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.code) data.code = String(data.code).trim().toUpperCase().replace(/\s+/g, '')
        if (data.type === 'percent' && (data.value ?? 0) > 100) throw new APIError('A percentage coupon cannot be more than 100%.', 400, undefined, true)
        if (data.type !== 'free_delivery' && !(data.value > 0)) throw new APIError('Enter the discount amount.', 400, undefined, true)
        if (data.startsAt && data.endsAt && new Date(data.endsAt) <= new Date(data.startsAt)) throw new APIError('The end date must be after the start date.', 400, undefined, true)
        return data
      },
    ],
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      maxLength: 30,
      admin: { description: 'Letters and numbers, e.g. GHEE100. Saved in capitals.' },
    },
    {
      name: 'description',
      type: 'text',
      localized: true,
      admin: { description: 'Shown to the customer when the code works, e.g. "₹100 off your first ghee order".' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'percent',
          admin: { width: '50%' },
          options: [
            { label: 'Percent off the order (%)', value: 'percent' },
            { label: 'Rupees off the order (₹)', value: 'flat' },
            { label: 'Free delivery', value: 'free_delivery' },
          ],
        },
        { name: 'value', type: 'number', min: 0, admin: { width: '50%', condition: (_, s) => s?.type !== 'free_delivery', description: 'e.g. 10 for 10% or 100 for ₹100' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'minOrder', type: 'number', min: 0, admin: { width: '50%', description: 'Minimum order (₹), optional' } },
        { name: 'maxDiscount', type: 'number', min: 0, admin: { width: '50%', condition: (_, s) => s?.type === 'percent', description: 'Cap on the discount (₹), optional' } },
      ],
    },
    {
      name: 'appliesTo',
      type: 'select',
      required: true,
      defaultValue: 'all',
      admin: { description: 'The discount is worked out on the matching items only.' },
      options: [
        { label: 'Whole order', value: 'all' },
        { label: 'Chosen categories', value: 'categories' },
        { label: 'Chosen products', value: 'products' },
      ],
    },
    { name: 'categories', type: 'relationship', relationTo: 'categories', hasMany: true, admin: { condition: (_, s) => s?.appliesTo === 'categories' } },
    { name: 'products', type: 'relationship', relationTo: 'products', hasMany: true, admin: { condition: (_, s) => s?.appliesTo === 'products' } },
    {
      type: 'row',
      fields: [
        { name: 'usageLimit', type: 'number', min: 1, admin: { width: '50%', description: 'Total uses allowed, optional' } },
        { name: 'perCustomerLimit', type: 'number', min: 1, admin: { width: '50%', description: 'Uses per phone number, optional (1 = once each)' } },
      ],
    },
    { name: 'active', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar', description: 'Untick to stop the code working.' } },
    { name: 'startsAt', type: 'date', admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'endsAt', type: 'date', admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'usedCount', type: 'number', defaultValue: 0, admin: { position: 'sidebar', readOnly: true, description: 'Orders placed with this code (not counting cancelled ones).' } },
  ],
}
