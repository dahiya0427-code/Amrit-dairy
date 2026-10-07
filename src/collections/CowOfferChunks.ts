import type { CollectionConfig } from 'payload'
import { CHUNK_BYTES } from '@/lib/cow-offer'

/** Raw pieces of uploaded cow photos/videos (base64). Server-only, never listed. */
export const CowOfferChunks: CollectionConfig = {
  slug: 'cow-offer-chunks',
  admin: { hidden: true },
  access: { read: () => false, create: () => false, update: () => false, delete: () => false },
  fields: [
    { name: 'uploadId', type: 'text', required: true, index: true },
    { name: 'index', type: 'number', required: true },
    // base64 of one piece (4/3 of CHUNK_BYTES), above Payload's 40,000-character default
    { name: 'data', type: 'textarea', required: true, maxLength: Math.ceil((CHUNK_BYTES * 4) / 3) + 16 },
  ],
}
