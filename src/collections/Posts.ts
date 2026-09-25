import type { CollectionConfig } from 'payload'
import { anyone, loggedIn } from '@/access'
import { slugField } from '@/fields/slug'
import { seoField } from '@/fields/seo'
import { faqsField } from '@/fields/faqs'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Blog post', plural: 'Blog posts' },
  admin: { useAsTitle: 'title', group: 'Content', defaultColumns: ['title', 'category', 'publishedAt'] },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  defaultSort: '-publishedAt',
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'excerpt', type: 'textarea', required: true, localized: true },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'ghee',
      options: [
        { label: 'Ghee & Bilona', value: 'ghee' },
        { label: 'Desi Cows', value: 'cows' },
        { label: 'Health & Nutrition', value: 'health' },
        { label: 'Recipes', value: 'recipes' },
        { label: 'Farm Life', value: 'farm' },
        { label: 'News', value: 'news' },
      ],
    },
    {
      name: 'tldr',
      label: 'TL;DR (short answers shown at the top)',
      type: 'array',
      localized: true,
      maxRows: 4,
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    { name: 'content', type: 'richText', required: true, localized: true },
    {
      name: 'keyTakeaways',
      type: 'array',
      localized: true,
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    faqsField,
    {
      name: 'sources',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text' },
      ],
    },
    { name: 'relatedProducts', type: 'relationship', relationTo: 'products', hasMany: true },
    {
      name: 'author',
      type: 'group',
      admin: { position: 'sidebar' },
      fields: [
        { name: 'name', type: 'text', defaultValue: 'Amrit Dairy Team' },
        { name: 'role', type: 'text', localized: true },
      ],
    },
    { name: 'publishedAt', type: 'date', required: true, defaultValue: () => new Date(), admin: { position: 'sidebar' } },
    slugField(),
    seoField,
  ],
}
