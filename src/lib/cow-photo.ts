import type { Breed } from '@/payload-types'
import { mediaUrl } from './media'

/** Breeds that have a pasture photo (made by scripts/cow-pasture.py). */
const pasture = new Set(['amritmahal','deoni','gir','hallikar','hariana','kangayam','kankrej','khillari','krishna-ghati','lal-sindhi','mewati','nagauri','ongole','punganur','rathi','sahiwal','tharparkar','umblacheri'])

/** The cow standing in a pasture if we have one, else the CMS image. */
export function cowPhoto(b: Pick<Breed, 'slug' | 'image'>, size: 'card' | 'hero' = 'card'): string | null {
  if (b.slug && pasture.has(b.slug)) return `/images/cows/${b.slug}.jpg`
  return mediaUrl(b.image, size)
}
