// designlab manifest: devices, knobs, groups, audit. Screens and components
// come from the tree (src/screens/<Screen>.states.json,
// src/components/<Name>/<Name>.states.json), so nothing is listed twice.
// designlab ssrLoadModule's this file inside its own server; keep it pure data.
export default {
  version: 2,
  name: 'LLM for design — presentation',
  // The presented deck. src/screens/ has one generated screen per deck in
  // content/, so this follows DEFAULT_DECK in src/lib/decks.js.
  defaultScreen: 'version-1',
  // Headings in the studio's tree, for screens and components alike. A states
  // file names its group; this list only fixes the order of the headings.
  groups: ['Deck', 'Slides', 'Parts'],
  // Two compositions: the laptop the deck is presented from, and the phone it
  // is checked on. The bezel art designlab draws is `iphone` and `ipad`, so the
  // desktop frame borrows the tablet's.
  devices: [
    { id: 'desktop', label: 'Desktop', width: 1440, height: 900, bezel: 'ipad' },
    { id: 'iphone', label: 'iPhone', width: 393, height: 852, bezel: 'iphone' },
  ],
  // The deck moves in three places: the cover's dot sphere spins and is built
  // from a random per-dot seed, slides cross-fade on change, and the contents
  // panel slides in from the left. `still` pins all three — seeded sphere held
  // at one frame, transitions snapped — so two captures of one state are the
  // same picture. `live` is the deck as it is presented.
  knobs: [
    {
      id: 'motion',
      label: 'motion',
      default: 'still',
      options: [
        { id: 'still', label: 'Still' },
        { id: 'live', label: 'Live' },
      ],
    },
  ],
  // A presentation read on a laptop is pointer-driven, so WCAG's 24x24px
  // targets and 16px body are the bar on both devices; the iPhone frame is a
  // narrow check of the same deck, not a touch app.
  audit: { surface: 'web' },
  flows: [],
  flowNotes: [],
}
