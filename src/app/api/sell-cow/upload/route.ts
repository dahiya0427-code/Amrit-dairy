import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { clientIp, rateLimit } from '@/lib/ratelimit'
import { CHUNK_BYTES, MAX_PHOTO_BYTES, MAX_VIDEO_BYTES, PHOTO_TYPES, VIDEO_TYPES } from '@/lib/cow-offer'

/** File signatures, so a "photo" really is an image and a "video" really is a video. */
function looksLike(kind: 'photo' | 'video', head: Buffer) {
  const hex = head.subarray(0, 12).toString('hex')
  if (kind === 'photo') return hex.startsWith('ffd8ff') || hex.startsWith('89504e47') || (hex.startsWith('52494646') && head.subarray(8, 12).toString() === 'WEBP')
  const ftyp = head.subarray(4, 8).toString() === 'ftyp' // mp4, mov, 3gp, m4v
  return ftyp || hex.startsWith('1a45dfa3') // webm / mkv
}

/**
 * Receives one piece of a photo or video for the "Sell your cow" form.
 * Pieces arrive in order (0, 1, 2…); the first one registers the file.
 */
export async function POST(req: Request) {
  if (!rateLimit(`cow-upload:${clientIp(req)}`, 60)) return NextResponse.json({ error: 'Too many uploads. Please wait a minute.' }, { status: 429 })
  const form = await req.formData().catch(() => null)
  const piece = form?.get('chunk')
  if (!form || !(piece instanceof Blob)) return NextResponse.json({ error: 'Invalid upload' }, { status: 400 })

  const uploadId = String(form.get('uploadId') || '')
  const kind = form.get('kind') === 'video' ? 'video' : 'photo'
  const index = Number(form.get('index'))
  const total = Number(form.get('total'))
  const size = Number(form.get('size'))
  const mimeType = String(form.get('type') || '')
  const filename = String(form.get('name') || `${kind}`).replace(/[^\w.\- ]+/g, '_').slice(0, 120)

  const maxBytes = kind === 'video' ? MAX_VIDEO_BYTES : MAX_PHOTO_BYTES
  const allowed = kind === 'video' ? VIDEO_TYPES : PHOTO_TYPES
  if (
    !/^[a-z0-9-]{16,64}$/i.test(uploadId) ||
    !Number.isInteger(index) || !Number.isInteger(total) || index < 0 || index >= total ||
    !(size > 0) || size > maxBytes || total !== Math.ceil(size / CHUNK_BYTES) ||
    piece.size > CHUNK_BYTES || !allowed.includes(mimeType)
  ) {
    return NextResponse.json({ error: kind === 'video' ? 'Video must be MP4/MOV/WebM, up to 40 MB.' : 'Photo must be JPG, PNG or WebP.' }, { status: 400 })
  }

  const bytes = Buffer.from(await piece.arrayBuffer())
  const payload = await getPayloadClient()
  const existing = (await payload.find({ collection: 'cow-offer-files', where: { uploadId: { equals: uploadId } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]

  if (index === 0) {
    if (existing) return NextResponse.json({ error: 'Upload already started' }, { status: 409 })
    if (!looksLike(kind, bytes)) return NextResponse.json({ error: 'This file does not look like a photo or video.' }, { status: 400 })
    await payload.create({ collection: 'cow-offer-files', data: { uploadId, kind, filename, mimeType, size, chunks: total }, overrideAccess: true })
  } else if (!existing || existing.offer || existing.chunks !== total) {
    return NextResponse.json({ error: 'Upload not found' }, { status: 404 })
  }

  // replace the piece if the browser re-sends it (retry after a network blip)
  await payload.delete({ collection: 'cow-offer-chunks', where: { and: [{ uploadId: { equals: uploadId } }, { index: { equals: index } }] }, overrideAccess: true })
  await payload.create({ collection: 'cow-offer-chunks', data: { uploadId, index, data: bytes.toString('base64') }, overrideAccess: true })
  return NextResponse.json({ ok: true })
}
