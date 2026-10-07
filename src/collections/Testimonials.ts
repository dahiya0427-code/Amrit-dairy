import type { CollectionConfig, FieldAccess } from 'payload'
import { loggedIn } from '@/access'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

const staffOnly: FieldAccess = ({ req: { user } }) => Boolean(user)

/**
 * Customer reviews. Customers can write one on the site (it waits here until
 * approved); staff can also add reviews received on WhatsApp, Google or in person.
 * Only approved reviews are ever shown or readable by the public.
 */
export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Customer review', plural: 'Customer reviews' },
  admin: {
    useAsTitle: 'name',
    group: 'Shop',
    defaultColumns: ['name', 'rating', 'product', 'source', 'verified', 'approved', 'createdAt'],
    description:
      'Only real customers. New reviews from the website arrive unapproved: tick "Approved" to show one. The home page shows reviews once at least 3 are approved.',
  },
  access: {
    read: ({ req: { user } }) => (user ? true : { approved: { equals: true } }),
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn,
  },
  defaultSort: '-createdAt',
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { type: 'row', fields: [
      { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
      { name: 'locality', label: 'City / area', type: 'text', admin: { width: '50%' } },
    ] },
    { type: 'row', fields: [
      { name: 'rating', type: 'number', min: 1, max: 5, defaultValue: 5, required: true, admin: { width: '33%' } },
      { name: 'product', type: 'relationship', relationTo: 'products', admin: { width: '67%', description: 'Leave empty for a general review of Amrit Dairy.' } },
    ] },
    { name: 'quote', label: 'Review', type: 'textarea', required: true, localized: true },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional: the customer’s photo of the product, or a screenshot of their WhatsApp message.' },
    },
    { name: 'approved', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar', description: 'Only approved reviews appear on the website.' } },
    { name: 'verified', label: 'Verified buyer', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar', description: 'Ticked automatically when the phone number matches an order.' } },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'website',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Website', value: 'website' },
        { label: 'WhatsApp', value: 'whatsapp' },
        { label: 'Google', value: 'google' },
        { label: 'In person / phone', value: 'in-person' },
      ],
    },
    { name: 'phone', type: 'text', access: { read: staffOnly }, admin: { position: 'sidebar', description: 'Never shown on the website.' } },
  ],
}
