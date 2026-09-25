import type { Field } from 'payload'

export const faqsField: Field = {
  name: 'faqs',
  label: 'FAQs',
  type: 'array',
  localized: true,
  admin: { description: 'Shown as an accordion and as FAQPage structured data.' },
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'textarea', required: true },
  ],
}
