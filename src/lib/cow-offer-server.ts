import 'server-only'
import type { Payload } from 'payload'
import type { CowOfferFile } from '@/payload-types'
import { CHUNK_BYTES } from './cow-offer'

/** Reads bytes [start, end] (inclusive) of an uploaded file from its stored pieces. */
export async function readFileRange(payload: Payload, file: CowOfferFile, start = 0, end = file.size - 1): Promise<Buffer> {
  const first = Math.floor(start / CHUNK_BYTES)
  const last = Math.floor(end / CHUNK_BYTES)
  const { docs } = await payload.find({
    collection: 'cow-offer-chunks',
    where: { and: [{ uploadId: { equals: file.uploadId } }, { index: { greater_than_equal: first } }, { index: { less_than_equal: last } }] },
    sort: 'index',
    limit: last - first + 1,
    depth: 0,
    pagination: false,
    overrideAccess: true,
  })
  const joined = Buffer.concat(docs.map((d) => Buffer.from(d.data, 'base64')))
  const offset = start - first * CHUNK_BYTES
  return joined.subarray(offset, offset + (end - start + 1))
}

/** Have all pieces of this upload arrived? */
export async function isComplete(payload: Payload, file: CowOfferFile) {
  const { totalDocs } = await payload.count({ collection: 'cow-offer-chunks', where: { uploadId: { equals: file.uploadId } }, overrideAccess: true })
  return totalDocs === file.chunks
}

/** Uploads never attached to an offer (form abandoned) are removed after a day. */
export async function removeAbandonedUploads(payload: Payload) {
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  await payload.delete({
    collection: 'cow-offer-files',
    where: { and: [{ offer: { exists: false } }, { createdAt: { less_than: dayAgo } }] },
    overrideAccess: true,
  })
}
