/**
 * Every deck in `content/`, discovered rather than listed.
 *
 * There used to be one static import naming one file, which meant adding a deck
 * was an edit in two places and presenting the wrong one was a silent typo.
 * Vite's glob is eager, so all decks are still bundled at build time and
 * nothing is fetched at runtime — the only thing that changes is that the set
 * is read off the directory instead of restated here.
 */
const modules = import.meta.glob('../../content/*.json', { eager: true })

/** Filename without extension: `content/version_1.json` → `version_1`. */
const idOf = (path) => path.split('/').pop().replace(/\.json$/, '')

/**
 * The deck presented when nothing asks for another one. `sample` is the
 * reference deck, one slide of every archetype, so it is deliberately not the
 * default: it is what a new deck is copied from, not what gets shown.
 */
export const DEFAULT_DECK = 'version_1'

/** The reference deck, and the one guaranteed to carry every archetype. */
export const REFERENCE_DECK = 'sample'

export const DECKS = Object.entries(modules)
  .map(([path, mod]) => {
    const data = mod.default ?? mod
    const id = idOf(path)
    return {
      id,
      // What the deck calls itself, falling back to a readable form of its
      // file name so a deck with no `meta.mark` is still nameable in a picker.
      label: data?.meta?.mark || id.replace(/[-_]+/g, ' '),
      items: data?.items || [],
      data,
    }
  })
  .sort((a, b) => a.id.localeCompare(b.id))

export const DECK_IDS = DECKS.map((d) => d.id)

/**
 * The deck for an id, falling back to the default. A URL that names a deck
 * which is not there gets the presentation rather than an empty stage, because
 * a blank screen mid-talk is worse than the wrong-but-working one.
 */
export function resolveDeck(id) {
  return DECKS.find((d) => d.id === id) || DECKS.find((d) => d.id === DEFAULT_DECK) || DECKS[0] || null
}
