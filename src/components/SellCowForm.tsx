'use client'

import { useEffect, useRef, useState } from 'react'
import { CALF, CHUNK_BYTES, MAX_PHOTOS, MAX_VIDEO_BYTES, MAX_VIDEOS, MILKING_STATUS, TRANSPORT, VACCINES, VIDEO_TYPES, YES_NO_UNKNOWN } from '@/lib/cow-offer'
import { whatsappLink } from '@/lib/site'
import { useI18n } from './I18nProvider'
import { Icon } from './Icon'

type Picked = { key: string; kind: 'photo' | 'video'; file: Blob; name: string; type: string; preview: string }

const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`

/** Shrinks a phone photo to at most 1600 px as a JPEG, so it uploads quickly on mobile data. */
async function compressPhoto(file: File): Promise<Blob> {
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image()
      el.onload = () => resolve(el)
      el.onerror = reject
      el.src = url
    })
    const scale = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(img.naturalWidth * scale)
    canvas.height = Math.round(img.naturalHeight * scale)
    canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
    return await new Promise<Blob>((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('encode'))), 'image/jpeg', 0.82))
  } finally {
    URL.revokeObjectURL(url)
  }
}

/** Sends one file in pieces; each piece is retried twice before giving up. */
async function uploadFile(p: Picked, onBytes: (n: number) => void): Promise<string> {
  const uploadId = newId()
  const total = Math.ceil(p.file.size / CHUNK_BYTES)
  for (let index = 0; index < total; index++) {
    const piece = p.file.slice(index * CHUNK_BYTES, Math.min(p.file.size, (index + 1) * CHUNK_BYTES))
    const body = new FormData()
    Object.entries({ uploadId, kind: p.kind, index, total, size: p.file.size, type: p.type, name: p.name }).forEach(([k, v]) => body.append(k, String(v)))
    body.append('chunk', piece)
    let ok = false
    let message = ''
    for (let attempt = 0; attempt < 3 && !ok; attempt++) {
      const res = await fetch('/api/sell-cow/upload', { method: 'POST', body }).catch(() => null)
      ok = Boolean(res?.ok)
      if (!ok && res) message = (await res.json().catch(() => ({}))).error || ''
      if (!ok && res && res.status < 500 && res.status !== 429) break // a real problem with the file, retrying won't help
    }
    if (!ok) throw new Error(message || 'upload')
    onBytes(piece.size)
  }
  return uploadId
}

/**
 * "Sell your cow" band with a full form that opens below it: seller, cow,
 * health and sale details plus photos and videos. Sends everything to
 * /api/sell-cow, which saves it in the admin and emails the team.
 */
export function SellCowForm({ breeds, whatsapp }: { breeds: string[]; whatsapp: string }) {
  const { t, locale } = useI18n()
  const s = t.sellCow
  const [open, setOpen] = useState(false)
  const [breed, setBreed] = useState('')
  const [milking, setMilking] = useState('')
  const [pregnant, setPregnant] = useState('')
  const [files, setFiles] = useState<Picked[]>([])
  const [fileError, setFileError] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [progress, setProgress] = useState('')
  const [error, setError] = useState('')
  const panel = useRef<HTMLDivElement>(null)
  const photoInput = useRef<HTMLInputElement>(null)
  const videoInput = useRef<HTMLInputElement>(null)

  const photos = files.filter((x) => x.kind === 'photo')
  const videos = files.filter((x) => x.kind === 'video')
  const maxMb = MAX_VIDEO_BYTES / 1024 / 1024

  // open straight away when someone arrives on /desi-cows#sell-cow
  useEffect(() => {
    if (window.location.hash === '#sell-cow') setOpen(true)
  }, [])
  useEffect(() => {
    if (open) panel.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [open])
  // free the preview images when they are no longer shown
  useEffect(() => () => files.forEach((x) => URL.revokeObjectURL(x.preview)), [files])

  async function addPhotos(list: FileList | null) {
    setFileError('')
    const room = MAX_PHOTOS - photos.length
    const picked: Picked[] = []
    for (const file of Array.from(list ?? []).slice(0, room)) {
      try {
        const blob = await compressPhoto(file)
        picked.push({ key: newId(), kind: 'photo', file: blob, name: file.name.replace(/\.\w+$/, '') + '.jpg', type: 'image/jpeg', preview: URL.createObjectURL(blob) })
      } catch {
        setFileError(s.badPhoto(file.name))
      }
    }
    setFiles((cur) => [...cur, ...picked])
  }

  function addVideos(list: FileList | null) {
    setFileError('')
    const room = MAX_VIDEOS - videos.length
    const picked: Picked[] = []
    for (const file of Array.from(list ?? []).slice(0, room)) {
      const type = file.type || (/\.mov$/i.test(file.name) ? 'video/quicktime' : 'video/mp4')
      if (!VIDEO_TYPES.includes(type)) setFileError(s.badVideo(file.name))
      else if (file.size > MAX_VIDEO_BYTES) setFileError(s.tooBig(file.name, maxMb))
      else picked.push({ key: newId(), kind: 'video', file, name: file.name, type, preview: URL.createObjectURL(file) })
    }
    setFiles((cur) => [...cur, ...picked])
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const v = (k: string) => String(fd.get(k) ?? '').trim()
    const n = (k: string) => (v(k) === '' ? null : Number(v(k)))
    setState('sending')
    setError('')
    try {
      // 1. photos and videos, one after another, with a progress line
      const totalBytes = files.reduce((sum, x) => sum + x.file.size, 0)
      let sent = 0
      const uploads: string[] = []
      for (const [i, p] of files.entries()) {
        setProgress(s.uploading(i + 1, files.length, Math.round((sent / Math.max(1, totalBytes)) * 100)))
        uploads.push(
          await uploadFile(p, (bytes) => {
            sent += bytes
            setProgress(s.uploading(i + 1, files.length, Math.round((sent / Math.max(1, totalBytes)) * 100)))
          }),
        )
      }
      // 2. the details
      setProgress(s.sending)
      const res = await fetch('/api/sell-cow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale,
          website: v('website'),
          consent: fd.get('consent') === 'on',
          uploads,
          seller: { name: v('name'), phone: v('phone'), whatsapp: v('whatsapp'), email: v('email'), village: v('village'), district: v('district'), state: v('state'), pincode: v('pincode') },
          cow: {
            breed: v('breed'),
            breedOther: v('breedOther'),
            ageYears: n('ageYears'),
            calvings: n('calvings'),
            milkingStatus: v('milkingStatus'),
            milkPerDay: n('milkPerDay'),
            lastCalving: v('lastCalving'),
            pregnant: v('pregnant') || undefined,
            pregnantMonths: n('pregnantMonths'),
            calf: v('calf') || undefined,
            colour: v('colour'),
            tagNumber: v('tagNumber'),
            papers: v('papers') || undefined,
          },
          health: { vaccinations: fd.getAll('vaccinations').map(String), dewormed: v('dewormed') || undefined, notes: v('healthNotes') },
          sale: { expectedPrice: n('expectedPrice'), negotiable: fd.get('negotiable') === 'on', availableFrom: v('availableFrom'), transport: v('transport') || undefined, reason: v('reason') },
          notes: v('notes'),
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error || s.error)
      setState('done')
      setFiles([])
      panel.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } catch (err) {
      setError(err instanceof Error && err.message !== 'upload' ? err.message : s.error)
      setState('idle')
    }
    setProgress('')
  }

  const label = (text: string, req = false, htmlFor?: string) => (
    <label className="label" htmlFor={htmlFor}>
      {text}
      {req && <span className="text-error" aria-hidden="true"> *</span>}
    </label>
  )
  const input = (name: string, text: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      {label(text, props.required, `sc-${name}`)}
      <input className="input" id={`sc-${name}`} name={name} {...props} />
    </div>
  )
  const select = (name: string, text: string, options: readonly string[], labels: Record<string, string>, props: React.SelectHTMLAttributes<HTMLSelectElement> = {}) => (
    <div>
      {label(text, props.required, `sc-${name}`)}
      <select className="input" id={`sc-${name}`} name={name} defaultValue="" {...props}>
        <option value="" disabled={props.required}>{s.choose}</option>
        {options.map((o) => (
          <option key={o} value={o}>{labels[o]}</option>
        ))}
      </select>
    </div>
  )
  const card = (icon: string, title: string, children: React.ReactNode) => (
    <fieldset className="rounded-2xl border border-line bg-snow p-5 md:p-6">
      <legend className="flex items-center gap-2 px-2 font-serif text-xl font-bold uppercase tracking-[0.04em] text-[#6b3d1f]">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-500/20 text-gold-700"><Icon name={icon} size={18} /></span>
        {title}
      </legend>
      <div className="mt-2 grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  )
  const yn = YES_NO_UNKNOWN as readonly string[]

  return (
    <section id="sell-cow" className="container-x scroll-mt-32 py-10">
      {/* the band */}
      <div className="relative overflow-hidden rounded-[28px] bg-ink px-6 py-10 text-snow md:px-12 md:py-14">
        <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(201,162,74,0.35),transparent_65%)]" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(201,162,74,0.2),transparent_65%)]" aria-hidden="true" />
        <div className="relative grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="font-serif text-sm font-bold uppercase tracking-[0.3em] text-gold-500">{s.kicker}</p>
            <h2 className="mt-3 font-serif text-3xl leading-[0.95] !text-snow md:text-5xl">{s.title}</h2>
            <p className="mt-4 max-w-xl text-base text-snow/80 md:text-lg">{s.text}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {s.points.map((p) => (
                <li key={p} className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/40 bg-gold-500/10 px-3 py-1.5 text-sm font-semibold text-gold-500">
                  <Icon name="check" size={14} /> {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <button
              type="button"
              onClick={() => {
                setOpen((o) => !o)
                if (state === 'done') setState('idle')
              }}
              aria-expanded={open}
              aria-controls="sell-cow-form"
              className="btn btn-gold !px-8 !py-4 text-lg shadow-[0_0_40px_-8px_rgba(201,162,74,0.8)]"
            >
              <Icon name="cow" size={22} /> {open ? s.close : s.open}
            </button>
            <a href={whatsappLink(whatsapp, 'Namaste, I want to sell my desi cow.')} target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-sm font-semibold text-snow/80 underline-offset-4 hover:text-gold-500 hover:underline">
              <Icon name="whatsapp" size={16} /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* the form */}
      <div id="sell-cow-form" ref={panel} hidden={!open} className="scroll-mt-28">
        {state === 'done' ? (
          <div className="mt-6 rounded-[28px] border border-gold-500/50 bg-gold-500/10 p-8 text-center md:p-12" role="status">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold-500 text-ink"><Icon name="check" size={32} /></span>
            <h3 className="mt-4 font-serif text-3xl text-[#6b3d1f]">{s.doneTitle}</h3>
            <p className="mx-auto mt-2 max-w-lg text-lg text-muted">{s.doneText}</p>
            <button type="button" className="btn btn-outline mt-6" onClick={() => setState('idle')}>{s.another}</button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-5 rounded-[28px] bg-malai p-4 md:p-8">
            <div className="px-1">
              <h3 className="font-serif text-2xl text-[#6b3d1f] md:text-3xl">{s.formTitle}</h3>
              <p className="mt-1 text-muted">{s.formText}</p>
            </div>
            {/* honeypot for bots */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

            {card('user', s.you, (
              <>
                {input('name', s.name, { required: true, autoComplete: 'name', maxLength: 100 })}
                {input('phone', s.phone, { required: true, type: 'tel', inputMode: 'tel', autoComplete: 'tel', pattern: '^(\\+?91[\\s-]?)?[6-9][0-9]{4}[\\s-]?[0-9]{5}$' })}
                {input('whatsapp', s.whatsapp, { type: 'tel', inputMode: 'tel', pattern: '^(\\+?91[\\s-]?)?[6-9][0-9]{4}[\\s-]?[0-9]{5}$' })}
                {input('email', s.email, { type: 'email', autoComplete: 'email' })}
                {input('village', s.village, { required: true, maxLength: 100 })}
                {input('district', s.district, { maxLength: 80 })}
                {input('state', s.state, { maxLength: 80, defaultValue: locale === 'hi' ? 'हरियाणा' : 'Haryana' })}
                {input('pincode', s.pincode, { inputMode: 'numeric', pattern: '[1-9][0-9]{5}', maxLength: 6 })}
              </>
            ))}

            {card('cow', s.cow, (
              <>
                <div>
                  {label(s.breed, true, 'sc-breed')}
                  <select className="input" id="sc-breed" name="breed" required value={breed} onChange={(e) => setBreed(e.target.value)}>
                    <option value="" disabled>{s.choose}</option>
                    {breeds.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                    <option value="other">{s.otherBreed}</option>
                  </select>
                </div>
                {breed === 'other' ? input('breedOther', s.breedOther, { maxLength: 60 }) : <div className="hidden sm:block" />}
                {input('ageYears', s.age, { type: 'number', min: 0, max: 30, step: 0.5, inputMode: 'decimal' })}
                {input('calvings', s.calvings, { type: 'number', min: 0, max: 20, inputMode: 'numeric' })}
                {select('milkingStatus', s.milkingStatus, MILKING_STATUS, s.milking, { required: true, onChange: (e) => setMilking(e.target.value) })}
                {milking === 'milking' ? input('milkPerDay', s.milkPerDay, { type: 'number', min: 0, max: 80, step: 0.5, inputMode: 'decimal' }) : <div className="hidden sm:block" />}
                {input('lastCalving', s.lastCalving, { maxLength: 40, placeholder: locale === 'hi' ? 'जैसे मार्च 2026' : 'e.g. March 2026' })}
                {select('calf', s.calf, CALF, s.calves)}
                {select('pregnant', s.pregnant, yn, s.yesNo, { onChange: (e) => setPregnant(e.target.value) })}
                {pregnant === 'yes' ? input('pregnantMonths', s.pregnantMonths, { type: 'number', min: 1, max: 10, inputMode: 'numeric' }) : <div className="hidden sm:block" />}
                {input('colour', s.colour, { maxLength: 60 })}
                {input('tagNumber', s.tag, { maxLength: 60 })}
                {select('papers', s.papers, yn, s.yesNo)}
              </>
            ))}

            {card('shield', s.health, (
              <>
                <fieldset className="sm:col-span-2">
                  <legend className="label">{s.vaccinations}</legend>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {VACCINES.map((vac) => (
                      <label key={vac} className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line bg-char px-3 py-2 text-sm has-[:checked]:border-gold-500 has-[:checked]:bg-gold-500/15">
                        <input type="checkbox" name="vaccinations" value={vac} className="h-4 w-4 accent-[#6b3d1f]" />
                        {s.vaccines[vac]}
                      </label>
                    ))}
                  </div>
                </fieldset>
                {select('dewormed', s.dewormed, yn, s.yesNo)}
                <div className="sm:col-span-2">
                  {label(s.healthNotes, false, 'sc-healthNotes')}
                  <textarea className="input min-h-20" id="sc-healthNotes" name="healthNotes" maxLength={1500} />
                </div>
              </>
            ))}

            {card('box', s.sale, (
              <>
                {input('expectedPrice', s.price, { type: 'number', min: 0, step: 500, inputMode: 'numeric' })}
                <label className="flex items-center gap-2 self-end pb-3 text-sm font-semibold">
                  <input type="checkbox" name="negotiable" className="h-4 w-4 accent-[#6b3d1f]" /> {s.negotiable}
                </label>
                {input('availableFrom', s.availableFrom, { type: 'date' })}
                {select('transport', s.transport, TRANSPORT, s.transports)}
                <div className="sm:col-span-2">
                  {label(s.reason, false, 'sc-reason')}
                  <textarea className="input min-h-20" id="sc-reason" name="reason" maxLength={800} />
                </div>
                <div className="sm:col-span-2">
                  {label(s.notes, false, 'sc-notes')}
                  <textarea className="input min-h-20" id="sc-notes" name="notes" maxLength={2000} />
                </div>
              </>
            ))}

            {card('star', s.media, (
              <div className="space-y-5 sm:col-span-2">
                {/* photos */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold">{s.photos} <span className="text-sm font-normal text-muted">({photos.length}/{MAX_PHOTOS})</span></p>
                      <p className="text-sm text-muted">{s.photosHint(MAX_PHOTOS)}</p>
                    </div>
                    <button type="button" className="btn btn-outline" disabled={photos.length >= MAX_PHOTOS || state === 'sending'} onClick={() => photoInput.current?.click()}>
                      <Icon name="plus" size={18} /> {s.addPhotos}
                    </button>
                    <input ref={photoInput} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { addPhotos(e.target.files); e.target.value = '' }} />
                  </div>
                  {photos.length > 0 && (
                    <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                      {photos.map((p) => (
                        <li key={p.key} className="relative aspect-square overflow-hidden rounded-xl border border-line">
                          {/* eslint-disable-next-line @next/next/no-img-element -- local preview of a picked file */}
                          <img src={p.preview} alt="" className="h-full w-full object-cover" />
                          <button type="button" aria-label={s.remove} onClick={() => setFiles((cur) => cur.filter((x) => x.key !== p.key))} className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-ink/80 text-snow hover:bg-error">
                            <Icon name="close" size={14} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {/* videos */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold">{s.videos} <span className="text-sm font-normal text-muted">({videos.length}/{MAX_VIDEOS})</span></p>
                      <p className="text-sm text-muted">{s.videosHint(MAX_VIDEOS, maxMb)}</p>
                    </div>
                    <button type="button" className="btn btn-outline" disabled={videos.length >= MAX_VIDEOS || state === 'sending'} onClick={() => videoInput.current?.click()}>
                      <Icon name="play" size={18} /> {s.addVideos}
                    </button>
                    <input ref={videoInput} type="file" accept="video/*" multiple className="hidden" onChange={(e) => { addVideos(e.target.files); e.target.value = '' }} />
                  </div>
                  {videos.length > 0 && (
                    <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                      {videos.map((p) => (
                        <li key={p.key} className="relative overflow-hidden rounded-xl border border-line bg-ink">
                          <video src={p.preview} muted playsInline preload="metadata" controls className="aspect-video w-full" />
                          <p className="truncate px-3 py-2 text-xs text-snow/80">{p.name} · {(p.file.size / 1024 / 1024).toFixed(1)} MB</p>
                          <button type="button" aria-label={s.remove} onClick={() => setFiles((cur) => cur.filter((x) => x.key !== p.key))} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-ink/80 text-snow hover:bg-error">
                            <Icon name="close" size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {fileError && <p role="alert" className="text-sm font-medium text-error">{fileError}</p>}
              </div>
            ))}

            <label className="flex items-start gap-2 px-1 text-sm">
              <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 accent-[#6b3d1f]" />
              <span>{s.consent}</span>
            </label>
            {error && <p role="alert" className="rounded-xl bg-char p-3 text-sm font-medium text-error">{error}</p>}
            <div className="flex flex-wrap items-center gap-4">
              <button type="submit" className="btn btn-gold !px-10 text-lg" disabled={state === 'sending'}>
                {state === 'sending' ? progress || s.sending : s.send}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
