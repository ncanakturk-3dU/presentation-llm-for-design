import deck from '../../content/version_1.json'

// The active deck, and the one place that says which file it is. Swap this
// import to any file in /content to present a different deck; `content/
// sample.json` is the reference deck, one slide per archetype, and is what a
// new deck starts from rather than what gets presented.
//
// The designlab states files name this deck's item ids, so after changing it
// run `npm run lab:states` to point them at the new content.
export function useContent() {
  return { status: 'ready', data: deck, error: null }
}
