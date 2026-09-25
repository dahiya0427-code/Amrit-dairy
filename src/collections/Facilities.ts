import type { CollectionConfig } from 'payload'
import { anyone, loggedIn } from '@/access'
import { slugField } from '@/fields/slug'
import { seoField } from '@/fields/seo'
import { faqsField } from '@/fields/faqs'
import { iconOptions } from './Departments'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

export const Facilities: CollectionConfig = {
  slug: 'facilities',
  admin: { useAsTitle: 'title', group: 'Farm', defaultColumns: ['title', 'department', 'order'] },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  defaultSort: 'order',
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'summary', type: 'textarea', required: true, localized: true },
    { name: 'icon', type: 'select', options: iconOptions, defaultValue: 'leaf' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true },
    { name: 'description', type: 'richText', localized: true },
    {
      name: 'steps',
      label: 'Process steps',
      type: 'array',
      localized: true,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'text', type: 'textarea' },
      ],
    },
    {
      name: 'hygiene',
      label: 'Hygiene & safety points',
      type: 'array',
      localized: true,
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'specs',
      label: 'Key facts',
      type: 'array',
      localized: true,
      admin: { description: 'Only verified numbers, e.g. "Cows housed: 250".' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    { name: 'department', type: 'relationship', relationTo: 'departments' },
    { name: 'relatedProducts', type: 'relationship', relationTo: 'products', hasMany: true },
    faqsField,
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    slugField(),
    seoField,
  ],
}
