import type { CollectionConfig } from 'payload'
import { anyone, loggedIn } from '@/access'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  admin: { useAsTitle: 'question', group: 'Content', defaultColumns: ['question', 'topic', 'showOnHome'] },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  defaultSort: 'order',
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: 'question', type: 'text', required: true, localized: true },
    { name: 'answer', type: 'textarea', required: true, localized: true },
    {
      name: 'topic',
      type: 'select',
      defaultValue: 'general',
      options: ['general', 'delivery', 'payment', 'products', 'subscription'].map((v) => ({ label: v, value: v })),
    },
    { name: 'showOnHome', type: 'checkbox', defaultValue: true },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
