import type { CollectionConfig } from 'payload'
import { anyone, loggedIn } from '@/access'
import { slugField } from '@/fields/slug'
import { seoField } from '@/fields/seo'
import { faqsField } from '@/fields/faqs'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Collection', plural: 'Shop collections' },
  admin: { useAsTitle: 'title', group: 'Shop', defaultColumns: ['title', 'slug', 'order'] },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  defaultSort: 'order',
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    {
      name: 'secondaryTitle',
      type: 'text',
      localized: true,
      admin: { description: 'Small line shown with the title, usually in the other language (e.g. "डेयरी उत्पाद").' },
    },
    { name: 'intro', type: 'textarea', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    faqsField,
    slugField(),
    seoField,
  ],
}
