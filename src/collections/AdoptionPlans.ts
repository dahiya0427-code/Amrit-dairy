import type { CollectionConfig } from 'payload'
import { adminsOrManagers, anyone } from '@/access'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

/** Sponsorship plans shown on /adopt-a-cow. Edit names, prices and what each includes here. */
export const AdoptionPlans: CollectionConfig = {
  slug: 'adoption-plans',
  labels: { singular: 'Adoption plan', plural: 'Adoption plans' },
  admin: {
    useAsTitle: 'name',
    group: 'Farm',
    defaultColumns: ['name', 'price', 'period', 'highlight', 'active', 'order'],
    description: 'The plans on the "Adopt a Cow" page. Untick Active to hide a plan.',
  },
  access: { read: anyone, create: adminsOrManagers, update: adminsOrManagers, delete: adminsOrManagers },
  defaultSort: 'order',
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { type: 'row', fields: [
      { name: 'name', type: 'text', required: true, localized: true, admin: { width: '40%' } },
      { name: 'price', label: 'Price (₹)', type: 'number', required: true, min: 1, admin: { width: '30%' } },
      { name: 'period', type: 'select', required: true, defaultValue: 'month', admin: { width: '30%' }, options: [
        { label: 'Per month', value: 'month' },
        { label: 'Per year', value: 'year' },
        { label: 'One time', value: 'once' },
      ] },
    ] },
    { name: 'tagline', type: 'text', localized: true, admin: { description: 'One short line under the name.' } },
    {
      name: 'perks',
      label: 'What’s included',
      type: 'array',
      localized: true,
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    { name: 'highlight', label: 'Show as "Most loved"', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'active', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
