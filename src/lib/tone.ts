/**
 * One bold colour per product family (ghee yellow, milk blue, achar red,
 * honey amber). Class names are written out in full so Tailwind can see them.
 */
export type Tone = 'ghee' | 'milk' | 'chilli' | 'honey' | 'leaf'

export const tones: Record<Tone, { bg: string; text: string; soft: string; ring: string; border: string }> = {
  ghee: { bg: 'bg-ghee', text: 'text-ghee-ink', soft: 'bg-ghee/15', ring: 'ring-ghee', border: 'border-ghee' },
  milk: { bg: 'bg-milk', text: 'text-milk-ink', soft: 'bg-milk/15', ring: 'ring-milk', border: 'border-milk' },
  chilli: { bg: 'bg-chilli', text: 'text-chilli-ink', soft: 'bg-chilli/15', ring: 'ring-chilli', border: 'border-chilli' },
  honey: { bg: 'bg-honey', text: 'text-honey-ink', soft: 'bg-honey/15', ring: 'ring-honey', border: 'border-honey' },
  leaf: { bg: 'bg-leaf', text: 'text-leaf-ink', soft: 'bg-leaf/15', ring: 'ring-leaf', border: 'border-leaf' },
}

const byCategory: Record<string, Tone> = { ghee: 'ghee', dairy: 'milk', achar: 'chilli', pantry: 'honey' }

/** Tone for a category slug; honey and oil get amber wherever they sit. */
export function toneOf(categorySlug?: string | null, productSlug?: string | null): Tone {
  if (productSlug && /honey|oil/.test(productSlug)) return 'honey'
  return (categorySlug && byCategory[categorySlug]) || 'ghee'
}

/** Cut-out pack shot that represents each category on colour blocks. */
export const categoryCutout: Record<string, string> = {
  ghee: '/images/ghee-cutout.png',
  dairy: '/images/milk-cutout.png',
  achar: '/images/mix-veg-achar-cutout.png',
  pantry: '/images/honey-cutout.png',
}
