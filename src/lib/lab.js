/**
 * The designlab host contract (docs/HOST.md in the designlab repo).
 *
 * designlab renders one screen at a time and passes
 *   { kind, preset, nav, ...knobs, ...params }
 * where `kind` is the device id, `preset` the state id, `nav` a patch function,
 * and every knob from lab.config.js plus every param from the states file
 * arrives as a prop of its own id. The real app (src/App.jsx) passes the same
 * shape with `preset: 'app'`.
 *
 * Every value that names something arrives as a string from a JSON states
 * file, so a screen narrows it with `pick()` rather than trusting it.
 */

/** The device ids lab.config.js declares. */
export const DEVICES = ['desktop', 'iphone']

/** The `motion` knob's options. */
export const MOTIONS = ['still', 'live']

/** The deck's `contents` param: what the contents panel is showing. */
export const CONTENTS = ['closed', 'outline', 'slides']

/** The deck's `status` param: what it shows instead of slides. */
export const STATUSES = ['ready', 'empty']

/** Narrow a value to one of its declared options, falling back to the default. */
export function pick(value, options, fallback) {
  return typeof value === 'string' && options.includes(value) ? value : fallback
}

export const pickDevice = (kind) => pick(kind, DEVICES, 'desktop')
export const pickMotion = (motion) => pick(motion, MOTIONS, 'still')
export const pickContents = (contents) => pick(contents, CONTENTS, 'closed')
export const pickStatus = (status) => pick(status, STATUSES, 'ready')

/** True for a frozen designlab state; false only for the real app. */
export const isLab = (preset) => preset !== undefined && preset !== 'app'

/**
 * Where a state points the deck. A state pins a content.json item **id**, not
 * an index, so reordering the deck does not silently repoint every capture.
 * An id nothing matches falls back to the first slide rather than a blank
 * stage, because a capture of nothing looks like a rendering bug.
 */
export function indexOfSlide(items, id) {
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
export function seededRandom(seed = 1) {
  let t = seed >>> 0
  return () => {
    t = (t + 0x6d2b79f5) >>> 0
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}
