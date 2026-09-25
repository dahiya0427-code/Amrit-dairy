/** Minimal helpers to write Lexical rich text in seed data. */
type Block = string | { h2: string } | { h3: string } | { ul: string[] } | { ol: string[] }

const text = (t: string) => ({ type: 'text', text: t, format: 0, detail: 0, mode: 'normal', style: '', version: 1 })
const base = { format: '' as const, indent: 0, version: 1, direction: 'ltr' as const }

export function rt(blocks: Block[]) {
  return {
    root: {
      type: 'root',
      ...base,
      children: blocks.map((b) => {
        if (typeof b === 'string') return { type: 'paragraph', ...base, textFormat: 0, textStyle: '', children: [text(b)] }
        if ('h2' in b) return { type: 'heading', tag: 'h2', ...base, children: [text(b.h2)] }
        if ('h3' in b) return { type: 'heading', tag: 'h3', ...base, children: [text(b.h3)] }
        const ordered = 'ol' in b
        const items = ordered ? b.ol : b.ul
        return {
          type: 'list',
          listType: ordered ? 'number' : 'bullet',
          tag: ordered ? 'ol' : 'ul',
          start: 1,
          ...base,
          children: items.map((t, i) => ({ type: 'listitem', value: i + 1, ...base, children: [text(t)] })),
        }
      }),
    },
  }
}
