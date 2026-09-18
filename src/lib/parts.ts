import type { Deck, Part, SlideItem } from '../../content/types'

/**
 * Reading a nested deck as the flat run of slides it is presented as.
 *
 * The deck is authored in parts, because that is what it *is* — a slide
 * belongs to the part whose `slides` array holds it and cannot quietly drift
 * into the one above. But presenting it is linear: one index, one arrow key,
 * one page number out of a total. So the nesting is the source and this is the
 * view of it, computed once per deck in `decks.ts` rather than by every caller
 * that wants to know where slide 17 sits.
 *
 * Free of Vite on purpose: `scripts/lab-states.ts` runs under `tsx` in Node and
 * flattens the same decks through this same function, so the studio's labels
 * and the deck's own chrome cannot disagree about which part a slide is in.
 */
export type FlatDeck = {
  /** Every slide of every part, in presentation order. */
  items: SlideItem[]
  /** `partAt[i]` is the part slide `i` was written in. Same length as `items`. */
  partAt: Part[]
  /** The same, reduced to what chrome needs — see `PartRef`. Same length as `items`. */
  refAt: PartRef[]
  /** The parts that actually contribute a slide — an empty one is not a section of the deck yet. */
  parts: Part[]
}

/**
 * A part as the chrome needs it: what to call it, and its numeral if it has one.
 *
 * The UI never wants the slides — it wants the label and the number — and a
 * `Part` cannot cross into a designlab states file, which is JSON: the slides
 * would have to be duplicated there, and two objects parsed out of JSON are
 * never the same reference, so anything comparing parts by identity would see a
 * new part on every row. So the boundary is this, compared by `id`.
 */
export type PartRef = { id: string; label: string; number?: string }

export const partRef = (part: Part): PartRef => ({
  id: part.id,
  label: part.label,
  number: partNumber(part),
})

/**
 * What the chrome calls a part in one line.
 *
 * `Part 01` when the numeral is a numeral, the numeral alone when it is not:
 * the bonus part opens on `number: "Bonus"`, and `Part Bonus` reads like a
 * part that mislaid its number. A part with no divider has no number at all,
 * and its label is what it is known by.
 */
export function partTag(ref?: PartRef | null): string | null {
  if (!ref) return null
  const num = ref.number?.trim()
  if (!num) return ref.label || null
  return /^\d+$/.test(num) ? `Part ${num}` : num
}

/**
 * The numeral a part is known by, read off the `divider` that opens it.
 *
 * A `Part` deliberately has no `number` of its own. A numbered part opens on a
 * divider, that divider draws the numeral as the slide's own artwork, and a
 * second copy on the part would be a second thing to keep in step. So the part
 * asks the divider. A part with no divider — the intro, the closing, a bonus
 * section — has no number, and its chrome shows its label alone.
 */
export function partNumber(part: Part): string | undefined {
  const opener = part.slides.find((s) => s.type === 'divider')
  return opener?.type === 'divider' ? opener.number : undefined
}

/**
 * An empty part renders nothing and lists nothing. That is what lets a part be
 * named in the file before it is written — `slides: []` is a slot, not a bug,
 * and the deck stays presentable while it sits there.
 */
export function flattenDeck(deck: Deck): FlatDeck {
  const items: SlideItem[] = []
  const partAt: Part[] = []
  const refAt: PartRef[] = []
  const parts: Part[] = []
  for (const part of deck?.parts || []) {
    if (part.slides.length === 0) continue
    parts.push(part)
    const ref = partRef(part)
    for (const item of part.slides) {
      items.push(item)
      partAt.push(part)
      refAt.push(ref)
    }
  }
  return { items, partAt, refAt, parts }
}
