import { headers as nextHeaders } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import { readFileRange } from '@/lib/cow-offer-server'

/**
 * Shows a cow photo or plays a video to signed-in admins and managers
 * (supports partial requests so phones can play and seek videos).
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await nextHeaders() })
  const role = (user as { role?: string } | null)?.role
  if (!user || (role !== 'admin' && role !== 'manager')) return new Response('Please log in to the admin to see this file.', { status: 401 })

  const id = Number((await params).id)
  if (!Number.isInteger(id)) return new Response('Not found', { status: 404 })
  const file = await payload.findByID({ collection: 'cow-offer-files', id, depth: 0, overrideAccess: true }).catch(() => null)
  if (!file) return new Response('Not found', { status: 404 })

  const base = {
    'Content-Type': file.mimeType,
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'private, max-age=3600',
    'X-Content-Type-Options': 'nosniff',
    'Content-Disposition': `inline; filename="${file.filename.replace(/"/g, '')}"`,
  }
  const range = req.headers.get('range')?.match(/^bytes=(\d*)-(\d*)$/)
  if (range && (range[1] || range[2])) {
    let start = range[1] ? Number(range[1]) : file.size - Number(range[2])
    let end = range[1] && range[2] ? Number(range[2]) : file.size - 1
    start = Math.max(0, start)
    end = Math.min(end, file.size - 1)
    if (start > end) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${file.size}` } })
    const body = await readFileRange(payload, file, start, end)
    return new Response(new Uint8Array(body), { status: 206, headers: { ...base, 'Content-Range': `bytes ${start}-${end}/${file.size}`, 'Content-Length': String(body.length) } })
  }
  const body = await readFileRange(payload, file)
  return new Response(new Uint8Array(body), { headers: { ...base, 'Content-Length': String(body.length) } })
}
