import type { CollectionConfig } from 'payload'
import { admins, anyone } from '@/access'
import { slugField } from '@/fields/slug'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

export const LegalPages: CollectionConfig = {
  slug: 'legal-pages',
  labels: { singular: 'Legal page', plural: 'Legal pages' },
  admin: { useAsTitle: 'title', group: 'Content', defaultColumns: ['title', 'slug', 'effectiveDate'] },
  access: { read: anyone, create: admins, update: admins, delete: admins },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'content', type: 'richText', required: true, localized: true },
    { name: 'effectiveDate', type: 'date', required: true, admin: { position: 'sidebar' } },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    slugField(),
  ],
}
