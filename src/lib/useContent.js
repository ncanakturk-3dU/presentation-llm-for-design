import { DEFAULT_DECK, resolveDeck } from './decks'

/**
 * The deck being shown.
 *
 * Which one is a question the caller answers — `?deck=sample` in the app, the
 * `deck` param in designlab — so there is no single import here naming one
 * file any more. `src/lib/decks.js` holds the set and the default.
 */
export function useContent(deckId = DEFAULT_DECK) {
  const deck = resolveDeck(deckId)
  if (!deck) return { status: 'error', data: null, error: new Error('no decks in content/') }
  return { status: 'ready', data: deck.data, deck, error: null }
}
