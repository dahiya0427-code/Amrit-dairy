import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import path from 'path'

/**
 * Data only: replaces the dairy product cut-outs whose milk had been cut away
 * (bottles looked empty) with the filled versions from seed-media/cutouts.
 * Skips anything that is missing, so it is safe on any database.
 */
const FILES: Record<string, string> = {
  'desi-cow-milk': 'milk.png',
  'matka-dahi': 'curd.png',
  buttermilk: 'buttermilk.png',
  paneer: 'paneer.png',
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const dir = path.resolve(process.cwd(), 'seed-media/cutouts')
  const replace = async (id: number | undefined | null, file: string) => {
    if (!id) return
    await payload.update({ collection: 'media', id, filePath: path.join(dir, file), data: {}, req, overrideAccess: true })
  }
  const idOf = (v: unknown) => (typeof v === 'object' && v !== null ? (v as { id: number }).id : (v as number | null))
  for (const [slug, file] of Object.entries(FILES)) {
    const p = (await payload.find({ collection: 'products', where: { slug: { equals: slug } }, limit: 1, depth: 0, req, overrideAccess: true })).docs[0]
    await replace(idOf(p?.cutout), file)
  }
  const dairy = (await payload.find({ collection: 'categories', where: { slug: { equals: 'dairy' } }, limit: 1, depth: 0, req, overrideAccess: true })).docs[0]
  // the dairy banner shares the milk picture only if it is a separate upload
  const milk = (await payload.find({ collection: 'products', where: { slug: { equals: 'desi-cow-milk' } }, limit: 1, depth: 0, req, overrideAccess: true })).docs[0]
  if (idOf(dairy?.bannerImage) !== idOf(milk?.cutout)) await replace(idOf(dairy?.bannerImage), 'milk.png')
  payload.logger.info('[migration] Filled the dairy product cut-outs')
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // pictures only; nothing to undo
}
