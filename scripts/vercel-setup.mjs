/**
 * Runs before `next build` on Vercel, so a new deployment sets itself up:
 * 1. creates/updates the database tables (committed migrations);
 * 2. on an empty database, loads the starter catalogue and content.
 *    Photos go to Vercel Blob, so this waits until a Blob store is connected
 *    (MEDIA_READ_WRITE_TOKEN or BLOB_READ_WRITE_TOKEN); without it the site would show broken images.
 * Does nothing outside Vercel (local builds use `pnpm migrate` / `pnpm seed`).
 */
import { execSync } from 'node:child_process'

const run = (cmd) => execSync(cmd, { stdio: 'inherit', env: { ...process.env, NODE_OPTIONS: '--no-deprecation' } })

if (!process.env.VERCEL) process.exit(0)
if (!process.env.DATABASE_URL) {
  console.warn('[setup] DATABASE_URL is not set: skipping database setup')
  process.exit(0)
}

console.log('[setup] Updating database tables…')
run('pnpm exec payload migrate')

if (!process.env.MEDIA_READ_WRITE_TOKEN && !process.env.BLOB_READ_WRITE_TOKEN) {
  console.warn('[setup] No Blob store connected yet: starter content (with photos) will load on the next deploy after you connect one.')
  process.exit(0)
}

console.log('[setup] Loading starter content if the database is empty…')
try {
  // src/seed/index.ts only runs on an empty database, so later deploys skip it
  run('pnpm exec payload run src/seed/index.ts')
} catch (err) {
  console.error('[setup] Starter content failed to load; the site will still deploy.', err?.message ?? err)
}
