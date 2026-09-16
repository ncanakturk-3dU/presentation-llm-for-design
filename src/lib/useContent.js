import deck from '../../content/sample.json'

// The active deck. Swap this import to any file in /content to change decks.
export function useContent() {
  return { status: 'ready', data: deck, error: null }
}
