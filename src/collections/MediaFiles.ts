import type { CollectionConfig } from 'payload'

/**
 * The bytes of every uploaded image, kept in the database (see src/storage/db-storage.ts)
 * so the site needs no separate file storage. Hidden from the admin; only the server reads it.
 */
export const MediaFiles: CollectionConfig = {
  slug: 'media-files',
  admin: { hidden: true },
  access: { read: () => false, create: () => false, update: () => false, delete: () => false },
  fields: [
    { name: 'filename', type: 'text', required: true, unique: true, index: true },
    { name: 'mimeType', type: 'text' },
    // base64 file contents; well above Payload's default 40,000-character text limit (max upload ≈ 30 MB)
    { name: 'data', type: 'textarea', required: true, maxLength: 40_000_000 },
  ],
}
