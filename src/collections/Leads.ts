import type { CollectionConfig } from 'payload'
import { adminsOrManagers } from '@/access'

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Enquiry', plural: 'Enquiries' },
  admin: {
    useAsTitle: 'name',
    group: 'Shop',
    defaultColumns: ['type', 'name', 'phone', 'pincode', 'status', 'createdAt'],
    description: 'Contact form, bulk orders, subscriptions, cow enquiries and "Notify me" requests.',
  },
  // Created only by the site's API routes (server-side, access overridden).
  access: { read: adminsOrManagers, create: () => false, update: adminsOrManagers, delete: adminsOrManagers },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Contact', value: 'contact' },
        { label: 'Bulk order', value: 'bulk' },
        { label: 'Milk subscription', value: 'subscription' },
        { label: 'Cow buy/sell', value: 'cow' },
        { label: 'Notify me', value: 'notify' },
        { label: 'Area waitlist', value: 'waitlist' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      admin: { position: 'sidebar' },
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Converted', value: 'converted' },
        { label: 'Closed', value: 'closed' },
      ],
    },
    { name: 'name', type: 'text' },
    { name: 'phone', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'pincode', type: 'text' },
    { name: 'product', type: 'text' },
    { name: 'quantity', type: 'text' },
    { name: 'message', type: 'textarea' },
    { name: 'locale', type: 'text', admin: { readOnly: true } },
    { name: 'sourcePage', type: 'text', admin: { readOnly: true } },
  ],
}
