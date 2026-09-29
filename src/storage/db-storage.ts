import type { Adapter } from '@payloadcms/plugin-cloud-storage/types'

/**
 * Storage adapter that keeps uploaded files in the database (the hidden
 * "media-files" collection) instead of on disk or in a separate file service.
 * Works anywhere the database works, including serverless hosting where the
 * disk is read-only. Files are served at the normal /api/media/file/<name>
 * address with long browser/CDN caching; Next.js image optimisation caches
 * the resized copies on top of that.
 */
export const dbStorage: Adapter = () => ({
  name: 'database',

  handleUpload: async ({ file, req }) => {
    const data = file.buffer.toString('base64')
    const existing = await req.payload.find({ collection: 'media-files', where: { filename: { equals: file.filename } }, limit: 1, depth: 0, req, overrideAccess: true })
    if (existing.docs[0]) {
      await req.payload.update({ collection: 'media-files', id: existing.docs[0].id, data: { data, mimeType: file.mimeType }, req, overrideAccess: true })
    } else {
      await req.payload.create({ collection: 'media-files', data: { filename: file.filename, mimeType: file.mimeType, data }, req, overrideAccess: true })
    }
  },

  handleDelete: async ({ filename, req }) => {
    await req.payload.delete({ collection: 'media-files', where: { filename: { equals: filename } }, req, overrideAccess: true })
  },

  staticHandler: async (req, { params: { filename } }) => {
    const { docs } = await req.payload.find({ collection: 'media-files', where: { filename: { equals: filename } }, limit: 1, depth: 0, overrideAccess: true })
    const doc = docs[0]
    if (!doc) return new Response('Not found', { status: 404 })
    const body = Buffer.from(doc.data, 'base64')
    return new Response(body, {
      headers: {
        'Content-Type': doc.mimeType || 'application/octet-stream',
        'Content-Length': String(body.length),
        // file names change when a file is replaced, so they can be cached for a long time
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  },
})
