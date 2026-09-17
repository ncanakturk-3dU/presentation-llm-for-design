/**
 * Which deck is presented, and which one is the reference.
 *
 * Their own module because two very different readers need them. `decks.ts`
 * reads them in the browser, where `import.meta.glob` and `import.meta.env`
 * are Vite's to resolve; `scripts/lab-states.ts` reads them in Node, where
 * neither exists. Keeping the two ids free of both is what lets the generator
 * import the fact instead of parsing it back out of the source.
 */

/** The deck the app presents and the build publishes. */
export const DEFAULT_DECK = 'version_1'

/** The reference deck: one slide of every archetype, and never presented. */
export const REFERENCE_DECK = 'sample'
