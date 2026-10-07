import type { CollectionConfig } from 'payload'
import { adminsOrManagers } from '@/access'

/**
 * Photos and videos sent with a "Sell your cow" offer. The bytes live in
 * cow-offer-chunks (uploaded in pieces); staff view them through
 * /api/sell-cow/file/<id>. Shown inside each Cow offer, not in the menu.
 */
export const CowOfferFiles: CollectionConfig = {
  slug: 'cow-offer-files',
  admin: { hidden: true, useAsTitle: 'filename' },
  access: { read: adminsOrManagers, create: () => false, update: () => false, delete: adminsOrManagers },
  hooks: {
    // removing a file also removes its stored pieces
    afterDelete: [
      async ({ doc, req }) => {
        await req.payload.delete({ collection: 'cow-offer-chunks', where: { uploadId: { equals: doc.uploadId } }, req, overrideAccess: true })
      },
    ],
  },
  fields: [
    { name: 'uploadId', type: 'text', required: true, unique: true, index: true },
    { name: 'offer', type: 'relationship', relationTo: 'cow-offers', index: true },
    { name: 'kind', type: 'select', required: true, options: ['photo', 'video'] },
    { name: 'filename', type: 'text', required: true },
    { name: 'mimeType', type: 'text', required: true },
    { name: 'size', type: 'number', required: true },
    { name: 'chunks', type: 'number', required: true },
  ],
}
