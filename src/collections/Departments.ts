import type { CollectionConfig } from 'payload'
import { anyone, loggedIn } from '@/access'
import { slugField } from '@/fields/slug'
import { seoField } from '@/fields/seo'
import { faqsField } from '@/fields/faqs'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

export const iconOptions = [
  { label: 'Cow', value: 'cow' },
  { label: 'Milk', value: 'milk' },
  { label: 'Ghee / churn', value: 'ghee' },
  { label: 'Jar (achar)', value: 'jar' },
  { label: 'Lab / quality', value: 'lab' },
  { label: 'Box / packing', value: 'box' },
  { label: 'Truck / delivery', value: 'truck' },
  { label: 'Headset / support', value: 'support' },
  { label: 'Leaf / fields', value: 'leaf' },
  { label: 'Snowflake / cold', value: 'cold' },
]

export const Departments: CollectionConfig = {
  slug: 'departments',
  admin: { useAsTitle: 'title', group: 'Farm', defaultColumns: ['title', 'order'] },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  defaultSort: 'order',
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'summary', type: 'textarea', required: true, localized: true },
    { name: 'icon', type: 'select', options: iconOptions, defaultValue: 'cow' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'description', type: 'richText', localized: true },
    {
      name: 'responsibilities',
      type: 'array',
      localized: true,
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'standards',
      type: 'array',
      localized: true,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'text', type: 'textarea' },
      ],
    },
    { name: 'head', type: 'group', fields: [
      { name: 'name', type: 'text' },
      { name: 'role', type: 'text', localized: true },
      { name: 'photo', type: 'upload', relationTo: 'media' },
    ] },
    { name: 'relatedProducts', type: 'relationship', relationTo: 'products', hasMany: true },
    faqsField,
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    slugField(),
    seoField,
  ],
}
