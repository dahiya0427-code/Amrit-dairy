import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = (url.searchParams.get('code') || '').trim()
  const locale = url.searchParams.get('locale') === 'hi' ? 'hi' : 'en'
  if (!/^[1-9][0-9]{5}$/.test(code)) return NextResponse.json({ error: 'Invalid pincode' }, { status: 400 })

  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'service-areas', limit: 200, depth: 0, locale, where: { pincodes: { contains: code } } })
  const matches = docs.filter((a) => a.pincodes.split(',').map((p) => p.trim()).includes(code))
  return NextResponse.json(
    {
      live: matches.filter((a) => a.status === 'live').map((a) => ({ name: a.name, slot: a.slot })),
      comingSoon: matches.filter((a) => a.status === 'coming_soon').map((a) => ({ name: a.name })),
    },
    { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } },
  )
}
