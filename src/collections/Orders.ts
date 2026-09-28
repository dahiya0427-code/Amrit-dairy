import type { CollectionConfig } from 'payload'
import { adminsOrManagers } from '@/access'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    group: 'Shop',
    defaultColumns: ['orderNumber', 'contactName', 'phone', 'total', 'status', 'paymentStatus', 'createdAt'],
    listSearchableFields: ['orderNumber', 'phone', 'contactName', 'email'],
  },
  // Orders are created by the checkout API (server-side). Staff manage them here.
  access: { read: adminsOrManagers, create: () => false, update: adminsOrManagers, delete: ({ req: { user } }) => user?.role === 'admin' },
  defaultSort: '-createdAt',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'orderNumber', type: 'text', required: true, unique: true, index: true, admin: { readOnly: true, width: '50%' } },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'pending',
          admin: { width: '50%' },
          options: [
            { label: 'Pending payment', value: 'pending' },
            { label: 'Confirmed', value: 'confirmed' },
            { label: 'Packed', value: 'packed' },
            { label: 'Out for delivery / Shipped', value: 'shipped' },
            { label: 'Delivered', value: 'delivered' },
            { label: 'Cancelled', value: 'cancelled' },
            { label: 'Refunded', value: 'refunded' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'paymentStatus',
          type: 'select',
          required: true,
          defaultValue: 'unpaid',
          admin: { width: '33%' },
          options: [
            { label: 'Unpaid', value: 'unpaid' },
            { label: 'Paid', value: 'paid' },
            { label: 'Failed', value: 'failed' },
            { label: 'Refunded', value: 'refunded' },
          ],
        },
        {
          name: 'paymentMethod',
          type: 'select',
          admin: { width: '33%' },
          options: [
            { label: 'Razorpay (online)', value: 'razorpay' },
            { label: 'WhatsApp / UPI (manual)', value: 'whatsapp' },
          ],
        },
        { name: 'deliveryType', type: 'select', admin: { width: '33%' }, options: [
          { label: 'Local delivery', value: 'local' },
          { label: 'Courier shipping', value: 'ship' },
        ] },
      ],
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      admin: { readOnly: true },
      fields: [
        { name: 'product', type: 'relationship', relationTo: 'products' },
        { name: 'title', type: 'text' },
        { name: 'variant', type: 'text' },
        { name: 'sku', type: 'text' },
        { name: 'quantity', type: 'number' },
        { name: 'unitPrice', type: 'number' },
        { name: 'lineTotal', type: 'number' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'subtotal', type: 'number', admin: { readOnly: true, width: '25%' } },
        { name: 'discount', type: 'number', defaultValue: 0, admin: { readOnly: true, width: '25%', description: 'Coupon discount (₹)' } },
        { name: 'deliveryFee', type: 'number', admin: { readOnly: true, width: '25%' } },
        { name: 'total', type: 'number', required: true, admin: { readOnly: true, width: '25%' } },
      ],
    },
    {
      name: 'customer',
      type: 'group',
      fields: [
        { type: 'row', fields: [
          { name: 'name', type: 'text', required: true },
          { name: 'phone', type: 'text', required: true },
          { name: 'email', type: 'email' },
        ] },
        { name: 'address', type: 'textarea', required: true },
        { type: 'row', fields: [
          { name: 'landmark', type: 'text' },
          { name: 'city', type: 'text' },
          { name: 'state', type: 'text' },
          { name: 'pincode', type: 'text', required: true },
        ] },
        { name: 'notes', type: 'textarea' },
      ],
    },
    // Flattened copies for list view / search
    { name: 'contactName', type: 'text', admin: { hidden: true } },
    { name: 'phone', type: 'text', admin: { hidden: true } },
    { name: 'email', type: 'text', admin: { hidden: true } },
    {
      name: 'razorpay',
      type: 'group',
      admin: { position: 'sidebar' },
      fields: [
        { name: 'orderId', type: 'text', index: true, admin: { readOnly: true } },
        { name: 'paymentId', type: 'text', admin: { readOnly: true } },
      ],
    },
    { name: 'couponCode', type: 'text', index: true, admin: { position: 'sidebar', readOnly: true } },
    { name: 'locale', type: 'text', admin: { position: 'sidebar', readOnly: true } },
    { name: 'accessToken', type: 'text', admin: { hidden: true } },
    { name: 'internalNotes', type: 'textarea', admin: { position: 'sidebar' } },
  ],
  hooks: {
    // keep each coupon's "used" count in step with its orders (cancelled and unpaid online orders don't count)
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        const code = doc.couponCode || previousDoc?.couponCode
        if (!code) return doc
        try {
          const uses = await req.payload.count({
            collection: 'orders',
            req,
            where: {
              and: [
                { couponCode: { equals: code } },
                { status: { not_in: ['cancelled', 'refunded'] } },
                { or: [{ paymentStatus: { equals: 'paid' } }, { paymentMethod: { equals: 'whatsapp' } }] },
              ],
            },
          })
          await req.payload.update({ collection: 'coupons', where: { code: { equals: code } }, data: { usedCount: uses.totalDocs }, req })
        } catch (err) {
          req.payload.logger.error({ err }, 'Could not update coupon usage')
        }
        return doc
      },
    ],
    beforeChange: [
      ({ data }) => {
        if (data.customer) {
          data.contactName = data.customer.name
          data.phone = data.customer.phone
          data.email = data.customer.email
        }
        return data
      },
    ],
  },
}
