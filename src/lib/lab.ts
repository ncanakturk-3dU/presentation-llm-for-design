import type { SlideItem } from '../../content/types'

/**
 * The designlab host contract (docs/HOST.md in the designlab repo).
 *
 * designlab renders one screen at a time and passes
 *   { kind, preset, nav, ...knobs, ...params }
 * where `kind` is the device id, `preset` the state id, `nav` a patch function,
 * and every knob from lab.config.js plus every param from the states file
 * arrives as a prop of its own id. The real app (src/App.tsx) passes the same
 * shape with `preset: 'app'`.
 *
 * Every value that names something arrives as a string from a JSON states
 * file, so a screen narrows it with `pick()` rather than trusting it.
 */

/** The device ids lab.config.js declares. */
export const DEVICES = ['desktop', 'iphone'] as const
export type Device = (typeof DEVICES)[number]

/** The `motion` knob's options. */
export const MOTIONS = ['still', 'live'] as const
export type Motion = (typeof MOTIONS)[number]

/** The deck's `contents` param: what the contents panel is showing. */
export const CONTENTS = ['closed', 'outline', 'slides'] as const
export type ContentsView = (typeof CONTENTS)[number]

/** The deck's `status` param: what it shows instead of slides. */
export const STATUSES = ['ready', 'empty'] as const
export type Status = (typeof STATUSES)[number]

/**
 * The two list params, and the one value they share: `deck` means "leave the
 * item alone". They are overrides for looking, not a second place to author —
 * settle on one in the studio, then write it into the deck module as
 * `marker` / `split`, or the next capture forgets it.
 */
export const LIST_MARKERS = ['deck', 'number', 'bullet', 'none'] as const
export const LIST_SPLITS = ['deck', 'golden', 'even', 'golden-flip'] as const
export type MarkerParam = (typeof LIST_MARKERS)[number]
export type SplitParam = (typeof LIST_SPLITS)[number]

/**
 * Narrow a value to one of its declared options, falling back to the default.
 *
 * Every param arrives from a JSON states file as a bare string, so this is the
 * one place a `string` becomes one of the literal types the rest of the app
 * reasons about. Unknown in, known out.
 */
export function pick<T extends string>(value: unknown, options: readonly T[], fallback: T): T {
  return typeof value === 'string' && (options as readonly string[]).includes(value) ? (value as T) : fallback
}

export const pickDevice = (kind: unknown) => pick(kind, DEVICES, 'desktop')
export const pickMotion = (motion: unknown) => pick(motion, MOTIONS, 'still')
export const pickContents = (contents: unknown) => pick(contents, CONTENTS, 'closed')
export const pickStatus = (status: unknown) => pick(status, STATUSES, 'ready')
export const pickMarker = (marker: unknown) => pick(marker, LIST_MARKERS, 'deck')
export const pickSplit = (split: unknown) => pick(split, LIST_SPLITS, 'deck')

/**
 * The item a designlab state renders: the deck's own, plus whichever list
 * params are set to something other than `deck`.
 *
 * Only `divider` and `keypoints` have a `marker` or a `split`, and the union
 * says so, so the other nine archetypes are returned untouched rather than
 * quietly growing a field nothing reads.
 */
export function withLabOverrides(item: SlideItem, { marker, split }: { marker?: unknown; split?: unknown }): SlideItem {
  if (item.type !== 'divider' && item.type !== 'keypoints') return item
  const m = pickMarker(marker)
  const s = pickSplit(split)
  if (m === 'deck' && s === 'deck') return item
  return { ...item, ...(m === 'deck' ? null : { marker: m }), ...(s === 'deck' ? null : { split: s }) }
}

/** True for a frozen designlab state; false only for the real app. */
export const isLab = (preset: unknown): boolean => preset !== undefined && preset !== 'app'

/**
 * Where a state points the deck. A state pins a content.json item **id**, not
 * an index, so reordering the deck does not silently repoint every capture.
 * An id nothing matches falls back to the first slide rather than a blank
 * stage, because a capture of nothing looks like a rendering bug.
 */
export function indexOfSlide(items: readonly SlideItem[], id: unknown): number {
  if (typeof id !== 'string') return 0
  const i = items.findIndex((it) => it.id === id)
  return i === -1 ? 0 : i
}

/**
 * A 32-bit hash into a seeded generator (mulberry32). CoverSphere builds its
 * dot cloud from ~2800 random numbers; under `still` those come from here so
 * two captures of one state are the same picture, and a diff between them is
 * a real change rather than a reshuffled sphere.
 */
export function seededRandom(seed = 1): () => number {
  let t = seed >>> 0
  return () => {
    t = (t + 0x6d2b79f5) >>> 0
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}
