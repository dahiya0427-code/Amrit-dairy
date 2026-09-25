import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

/**
 * Pages are cached (ISR). When editors change content in the admin, purge the
 * cache so the change is live within seconds. Outside a Next.js request
 * (e.g. `pnpm seed`) revalidation is unavailable, so failures are ignored.
 */
async function purge() {
  try {
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/', 'layout')
  } catch {
    // not running inside Next.js
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = async ({ doc }) => {
  await purge()
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  await purge()
  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = async ({ doc }) => {
  await purge()
  return doc
}
