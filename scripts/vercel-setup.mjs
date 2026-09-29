/**
 * Runs before `next build` on Vercel, so a new deployment sets itself up:
 * 1. creates/updates the database tables (committed migrations);
 * 2. on an empty database, loads the starter catalogue, content and photos
 *    (photos are stored in the database itself, see src/storage/db-storage.ts).
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

console.log('[setup] Loading starter content if the database is empty…')
try {
  // src/seed/index.ts only runs on an empty database, so later deploys skip it
  run('pnpm exec payload run src/seed/index.ts')
} catch (err) {
  console.error('[setup] Starter content failed to load; the site will still deploy.', err?.message ?? err)
}
