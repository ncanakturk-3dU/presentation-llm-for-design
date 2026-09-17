import presented from '../../content/version_1.json'

/**
 * The decks in `content/`, and which one gets presented.
 *
 * Two builds want different things, so the module gives them different things:
 *
 * - The **presented** deck is imported statically, so every build carries it
 *   and the app never depends on a glob resolving.
 * - **Every** deck is globbed in, but only while Vite is in dev — which is how
 *   the designlab studio serves this project, so the `deck` param there lists
 *   them all. A production build drops the glob entirely, so a half-written
 *   draft sitting in `content/` never has its copy readable in the published
 *   JS. The one deck that ships is the one on stage.
 *
 * The trade: `export_prototype` is a production build, so an exported
 * prototype carries only the presented deck and the other `deck` options fall
 * back to it. Review drafts in the live studio, which is the dev server.
 *
 * `DEFAULT_DECK` must name the file imported above. `npm run lab:states`
 * fails if the two ever drift, and in dev the mismatch throws on load.
 */
export const DEFAULT_DECK = 'version_1'

/** The reference deck: one slide of every archetype, and never presented. */
export const REFERENCE_DECK = 'sample'

const modules = import.meta.env.DEV ? import.meta.glob('../../content/*.json', { eager: true }) : {}

/** Filename without extension: `content/version_1.json` → `version_1`. */
const idOf = (path) => path.split('/').pop().replace(/\.json$/, '')

function toDeck(id, data) {
  return {
    id,
    // What the deck calls itself, falling back to a readable form of its file
    // name so a deck with no `meta.mark` is still nameable in the studio.
    label: data?.meta?.mark || id.replace(/[-_]+/g, ' '),
    items: data?.items || [],
    data,
  }
}

const found = new Map(Object.entries(modules).map(([path, mod]) => {
  const id = idOf(path)
  return [id, toDeck(id, mod.default ?? mod)]
}))

// The static import wins for the presented deck, so it is there in every build
// whether or not the glob ran.
found.set(DEFAULT_DECK, toDeck(DEFAULT_DECK, presented))

if (import.meta.env.DEV && !Object.keys(modules).some((p) => idOf(p) === DEFAULT_DECK)) {
  throw new Error(
    `DEFAULT_DECK is '${DEFAULT_DECK}' but src/lib/decks.js statically imports a different file. ` +
      `Both must name the same deck — fix the import at the top of this file.`,
  )
}

export const DECKS = [...found.values()].sort((a, b) => a.id.localeCompare(b.id))

export const DECK_IDS = DECKS.map((d) => d.id)

/**
 * The deck for an id, falling back to the presented one. An id that is not
 * there — a stale lab state, or a production build where only the presented
 * deck was bundled — gets the presentation rather than an empty stage, because
 * a blank screen is worse than the wrong-but-working one.
 */
export function resolveDeck(id) {
  return DECKS.find((d) => d.id === id) || DECKS.find((d) => d.id === DEFAULT_DECK) || DECKS[0] || null
}
