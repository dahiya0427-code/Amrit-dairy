import 'server-only'
import type { Payload } from 'payload'

/** Everyone who should hear about new enquiries: the order inbox, the site email, and all admins/managers. */
export async function teamEmails(payload: Payload): Promise<string[]> {
  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  const staff = await payload.find({ collection: 'users', where: { role: { in: ['admin', 'manager'] } }, limit: 50, depth: 0, overrideAccess: true })
  const list = [process.env.ORDER_NOTIFY_EMAIL, settings.email, ...staff.docs.map((u) => u.email)]
  return [...new Set(list.filter((e): e is string => Boolean(e)).map((e) => e.toLowerCase()))]
}

export const escapeHtml = (v: unknown) => String(v ?? '').replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)

/** Branded email shell with a details table and action buttons, shared by the site's forms. */
export function teamEmailHtml(opts: { heading: string; intro: string; rows: [string, unknown][]; buttons?: { href: string; label: string; color?: string }[]; footer?: string }) {
  const esc = escapeHtml
  const table = opts.rows
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `<tr><td style="padding:6px 14px 6px 0;color:#5A554D;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:6px 0;white-space:pre-wrap">${esc(v)}</td></tr>`)
    .join('')
  const buttons = (opts.buttons ?? [])
    .map((b) => `<a href="${esc(b.href)}" style="display:inline-block;margin:0 8px 8px 0;background:${b.color ?? '#2B1B10'};color:#fff;padding:10px 16px;border-radius:999px;text-decoration:none;font-weight:700">${b.label}</a>`)
    .join('')
  return `<!doctype html><html><body style="margin:0;background:#FFFDF7;font-family:Arial,sans-serif;color:#1E1C19">
  <div style="max-width:620px;margin:0 auto;padding:24px">
    <div style="background:#2B1B10;color:#C9A24A;padding:16px 20px;border-radius:16px 16px 0 0;font:600 22px Georgia,serif">${opts.heading}</div>
    <div style="background:#fff;padding:20px;border-radius:0 0 16px 16px;border:1px solid #E6DCC6">
      <p style="margin:0 0 14px">${opts.intro}</p>
      ${buttons ? `<p style="margin:0 0 14px">${buttons}</p>` : ''}
      <table style="width:100%;border-collapse:collapse;font-size:14px">${table}</table>
      ${opts.footer ? `<p style="margin:16px 0 0;font-size:14px">${opts.footer}</p>` : ''}
    </div>
  </div></body></html>`
}
