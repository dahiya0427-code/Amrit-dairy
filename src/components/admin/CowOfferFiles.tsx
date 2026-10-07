'use client'

import { useDocumentInfo } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

type FileDoc = { id: number; kind: 'photo' | 'video'; filename: string; size: number }

const mb = (n: number) => `${(n / 1024 / 1024).toFixed(1)} MB`

/** Photos and videos the seller sent, shown at the top of each Cow offer. */
export function CowOfferFiles() {
  const { id } = useDocumentInfo()
  const [files, setFiles] = useState<FileDoc[] | null>(null)

  useEffect(() => {
    if (!id) return
    fetch(`/api/cow-offer-files?where[offer][equals]=${id}&limit=20&depth=0&sort=createdAt`, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setFiles(d.docs ?? []))
      .catch(() => setFiles([]))
  }, [id])

  if (!id) return null
  const url = (f: FileDoc) => `/api/sell-cow/file/${f.id}`
  const photos = files?.filter((f) => f.kind === 'photo') ?? []
  const videos = files?.filter((f) => f.kind === 'video') ?? []

  return (
    <div style={{ marginBottom: 28 }}>
      <h3 style={{ margin: '0 0 10px' }}>Photos & videos from the seller</h3>
      {files === null ? (
        <p style={{ color: 'var(--theme-elevation-500)' }}>Loading…</p>
      ) : files.length === 0 ? (
        <p style={{ color: 'var(--theme-elevation-500)' }}>No photos or videos were sent.</p>
      ) : (
        <>
          {photos.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
              {photos.map((f) => (
                <a key={f.id} href={url(f)} target="_blank" rel="noreferrer" title="Open full size">
                  {/* eslint-disable-next-line @next/next/no-img-element -- staff-only file, served with login */}
                  <img src={url(f)} alt={f.filename} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 8, border: '1px solid var(--theme-elevation-150)' }} />
                </a>
              ))}
            </div>
          )}
          {videos.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12, marginTop: 12 }}>
              {videos.map((f) => (
                <figure key={f.id} style={{ margin: 0 }}>
                  <video src={url(f)} controls preload="metadata" playsInline style={{ width: '100%', borderRadius: 8, background: '#000' }} />
                  <figcaption style={{ fontSize: 12, color: 'var(--theme-elevation-500)', marginTop: 4 }}>
                    {f.filename} · {mb(f.size)} · <a href={url(f)} download={f.filename}>Download</a>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
