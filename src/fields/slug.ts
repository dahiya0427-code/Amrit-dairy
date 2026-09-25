import type { Field } from 'payload'

export const slugify = (value: string) =>
  value
    .toString()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/** URL slug, auto-generated from `fromField` (English) when left empty. */
export const slugField = (fromField = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  index: true,
  unique: true,
  required: true,
  admin: {
    position: 'sidebar',
    description: 'Used in the URL. Lowercase English words separated by hyphens.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data, req }) => {
        if (value) return slugify(value)
        const source = data?.[fromField]
        // localized fields arrive as a string for the current locale
        if (typeof source === 'string' && (req.locale === 'en' || !req.locale)) return slugify(source)
        return value
      },
    ],
  },
})
