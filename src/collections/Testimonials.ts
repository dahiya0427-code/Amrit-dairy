import type { CollectionConfig } from 'payload'
import { anyone, loggedIn } from '@/access'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Customer review', plural: 'Customer reviews' },
  admin: {
    useAsTitle: 'name',
    group: 'Shop',
    defaultColumns: ['name', 'locality', 'rating', 'approved'],
    description: 'Only real customers. The home page shows reviews once at least 3 are approved.',
  },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'locality', type: 'text' },
    { name: 'rating', type: 'number', min: 1, max: 5, defaultValue: 5 },
    { name: 'quote', type: 'textarea', required: true, localized: true },
    { name: 'product', type: 'relationship', relationTo: 'products' },
    { name: 'approved', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
  ],
}
