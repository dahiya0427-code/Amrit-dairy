import type { CollectionConfig } from 'payload'
import { anyone, loggedIn } from '@/access'
import { slugField } from '@/fields/slug'
import { seoField } from '@/fields/seo'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

export const Breeds: CollectionConfig = {
  slug: 'breeds',
  labels: { singular: 'Cow breed', plural: 'Cow breeds' },
  admin: { useAsTitle: 'name', group: 'Farm', defaultColumns: ['name', 'onFarm', 'order'] },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  defaultSort: 'order',
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'onFarm', label: 'On the Amrit Dairy farm', type: 'checkbox', defaultValue: false },
    { name: 'origin', type: 'text', localized: true, admin: { description: 'Home region, e.g. "Saurashtra, Gujarat"' } },
    { name: 'summary', type: 'textarea', localized: true },
    {
      name: 'traits',
      type: 'array',
      localized: true,
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    slugField('name'),
    seoField,
  ],
}
