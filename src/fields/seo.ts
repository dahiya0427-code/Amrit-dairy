import type { Field } from 'payload'

export const seoField: Field = {
  name: 'meta',
  label: 'SEO',
  type: 'group',
  admin: { position: 'sidebar' },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      admin: { description: 'Search result title (≤ 60 characters). Leave empty to use the default.' },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: { description: 'Search result description (≤ 155 characters).' },
    },
  ],
}
