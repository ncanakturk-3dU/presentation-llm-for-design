import { DEFAULT_DECK, resolveDeck, type LoadedDeck } from './decks'
import type { Deck } from '../../content/types'

/**
 * The deck being shown.
 *
 * Which one is a question the caller answers — `?deck=sample` in the app, the
 * `deck` param in designlab — so there is no single import here naming one
 * file any more. `src/lib/decks.ts` holds the set and the default.
 */
type Loaded =
  | { status: 'ready'; data: Deck; deck: LoadedDeck; error: null }
  | { status: 'error'; data: null; deck?: undefined; error: Error }

export function useContent(deckId: string = DEFAULT_DECK): Loaded {
  const deck = resolveDeck(deckId)
  if (!deck) return { status: 'error', data: null, error: new Error('no decks in content/') }
  return { status: 'ready', data: deck.data, deck, error: null }
}
