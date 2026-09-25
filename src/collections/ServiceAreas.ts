import type { CollectionConfig } from 'payload'
import { anyone, loggedIn } from '@/access'
import { slugField } from '@/fields/slug'
import { seoField } from '@/fields/seo'
import { faqsField } from '@/fields/faqs'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

export const ServiceAreas: CollectionConfig = {
  slug: 'service-areas',
  labels: { singular: 'Delivery area', plural: 'Delivery areas' },
  admin: {
    useAsTitle: 'name',
    group: 'Shop',
    defaultColumns: ['name', 'city', 'status', 'pincodes'],
    description: 'Where fresh products (milk, dahi, paneer) are delivered. Add an area here to launch it; no code changes needed.',
  },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'city', type: 'text', required: true, localized: true, defaultValue: 'Sonipat' },
    {
      name: 'pincodes',
      type: 'text',
      required: true,
      admin: { description: 'Comma-separated, e.g. 131001, 131023' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'live',
      options: [
        { label: 'Live (we deliver)', value: 'live' },
        { label: 'Coming soon', value: 'coming_soon' },
      ],
    },
    { name: 'slot', type: 'text', localized: true, admin: { description: 'e.g. Every morning, 6–8 AM' } },
    { name: 'intro', type: 'textarea', localized: true, admin: { description: 'Unique text for this area page (important for local SEO).' } },
    {
      name: 'landmarks',
      type: 'array',
      localized: true,
      fields: [{ name: 'name', type: 'text', required: true }],
    },
    faqsField,
    slugField('name'),
    seoField,
  ],
}
