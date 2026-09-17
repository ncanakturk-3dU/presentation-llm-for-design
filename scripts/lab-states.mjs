#!/usr/bin/env node
/**
 * Regenerate the designlab states files from the decks in `content/`.
 *
 * The deck screen renders whichever deck is asked for, and its states pin a
 * content.json item **id**. So the moment content changes — a new deck, a
 * renamed item, a slide dropped — those ids name content that is not there any
 * more, `indexOfSlide` quietly falls back to the first slide, and every capture
 * of "the table slide" is a picture of the cover. Nothing errors. That is the
 * failure this script exists to prevent.
 *
 * Two decks matter differently. The **default** deck is what gets presented, so
 * it gets a state per slide. The **reference** deck is the one guaranteed to
 * carry one of every archetype, so the `Slide` component's variants come from
 * it — archetype coverage is then complete by construction rather than by
 * whatever the current talk happens to use. Both ids are read from
 * `src/lib/decks.js` so this is not a second place to state them.
 *
 *   npm run lab:states              rewrite the states files
 *   npm run lab:states -- --check   exit 1 if they are stale (no writes)
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const check = process.argv.includes('--check')

/** Read a named const out of src/lib/decks.js, so ids live in one place. */
function deckConst(name) {
  const src = readFileSync(resolve(root, 'src/lib/decks.js'), 'utf8')
  const m = src.match(new RegExp(`export const ${name}\\s*=\\s*'([^']+)'`))
  if (!m) throw new Error(`src/lib/decks.js does not export a ${name} string`)
  return m[1]
}

const DEFAULT_DECK = deckConst('DEFAULT_DECK')
const REFERENCE_DECK = deckConst('REFERENCE_DECK')

// decks.js states the presented deck twice — once as a static import so every
// build carries it, once as DEFAULT_DECK. Two statements of one fact drift, and
// the drift is quiet: the app would present one deck while the lab captured
// another. Catch it here rather than in a screenshot nobody re-reads.
{
  const src = readFileSync(resolve(root, 'src/lib/decks.js'), 'utf8')
  const m = src.match(/^import\s+presented\s+from\s+'.*?\/([^/']+)\.json'/m)
  if (!m) throw new Error("src/lib/decks.js has no `import presented from '.../<deck>.json'` line")
  if (m[1] !== DEFAULT_DECK) {
    throw new Error(
      `src/lib/decks.js disagrees with itself: it imports '${m[1]}.json' but DEFAULT_DECK is ` +
        `'${DEFAULT_DECK}'. The app would present ${m[1]} while the lab captured ${DEFAULT_DECK}.`,
    )
  }
}

const contentDir = resolve(root, 'content')
const decks = readdirSync(contentDir)
  .filter((f) => f.endsWith('.json'))
  .sort()
  .map((f) => {
    const id = f.replace(/\.json$/, '')
    const data = JSON.parse(readFileSync(join(contentDir, f), 'utf8'))
    return { id, label: data?.meta?.mark || id.replace(/[-_]+/g, ' '), items: data?.items || [] }
  })

if (decks.length === 0) throw new Error('no decks in content/')

for (const d of decks) {
  if (d.items.length === 0) throw new Error(`content/${d.id}.json declares no items`)
  const missing = d.items.filter((it) => !it.id)
  if (missing.length) {
    throw new Error(
      `content/${d.id}.json: every item needs an \`id\` — a state pins ids, not indexes. ` +
        `${missing.length} without one (types: ${[...new Set(missing.map((i) => i.type))].join(', ')})`,
    )
  }
  const dupes = d.items.map((i) => i.id).filter((id, i, a) => a.indexOf(id) !== i)
  if (dupes.length) {
    throw new Error(`content/${d.id}.json: duplicate item ids (${[...new Set(dupes)].join(', ')})`)
  }
}

const pick = (id) => decks.find((d) => d.id === id)
const active = pick(DEFAULT_DECK)
const reference = pick(REFERENCE_DECK) || active
if (!active) throw new Error(`DEFAULT_DECK '${DEFAULT_DECK}' has no content/${DEFAULT_DECK}.json`)

const ARCHETYPES = {
  cover: ['Cover', 'Dark. Headline with the accent word, over the dot sphere.'],
  divider: ['Section divider', 'Light. Big numeral, section title, and the numbered list of what is in it.'],
  keypoints: ['Key points', 'Dark. Title on the left, numbered rows hairline-separated on the right.'],
  twocolumn: ['Two column', 'Light. Two mock screens side by side, each under its own caption.'],
  process: ['Process', 'Light. Tone-coded step cards in a row, each over its own points.'],
  codeui: ['Code and UI', 'Light. Highlighted source in a tabbed pane beside the rendered result.'],
  table: ['Table', 'Light. A matrix with tone-coded severity and action columns.'],
  quote: ['Quote', 'Light. Oversized quote mark, the line itself, and the closer beside it.'],
  showcase: [
    'Showcase',
    'Light. One or two real screenshots in framed figures, over a status line. An image with no `src` draws its alt text in a dashed frame, which is the placeholder case.',
  ],
}

// -------------------------------------------------------------- deck screens
// One screen per deck in content/, so the studio tree names the decks instead
// of hiding them behind a param on a single screen. Each screen is a generated
// wrapper that fixes its own deck; `slide` stays a param, because walking a
// deck is flipping one axis, not visiting 34 unrelated screens.

/** `version_1` → `Version1` (a module name), `sample` → `Sample`. */
const pascal = (id) => id.split(/[-_]+/).filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join('')

/** `version_1` → `version-1` (a screen id), `sample` → `sample`. */
const kebab = (id) => id.replace(/_+/g, '-').toLowerCase()

/** `version_1` → `Version 1`. The tree names decks by file, not by the talk's
 *  title: a deck's `meta.mark` is the presentation's name and changes as it is
 *  written, while the file is how you pick a version. */
const titleOf = (id) => id.split(/[-_]+/).filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join(' ')

const screens = decks.map((d) => {
  const states = d.items.map((it, n) => ({
    id: `slide-${it.id}`,
    label: `${String(n + 1).padStart(2, '0')} · ${it.type}`,
    note: `The ${it.type} archetype in the deck shell, with the chrome and page reference around it.`,
    params: { slide: it.id },
  }))

  states.push(
    {
      id: 'contents-outline',
      label: 'Contents · outline',
      note: 'The contents panel over the first slide, on the Outline tab: every slide with its sub-rows.',
      params: { slide: d.items[0].id, contents: 'outline' },
    },
    {
      id: 'contents-slides',
      label: 'Contents · slides',
      note: 'The same panel on the Slides tab: themed thumbnails, the current one marked.',
      params: { slide: d.items[0].id, contents: 'slides' },
    },
    {
      id: 'empty',
      label: 'No slides',
      note: 'A deck file with an empty items array. Nothing else can reach this copy.',
      params: { status: 'empty' },
    },
  )

  const roles = [
    d.id === DEFAULT_DECK ? 'presented and published' : 'not presented — review only',
    d.id === REFERENCE_DECK ? 'the reference deck, and the source of the Slide archetype variants' : null,
  ].filter(Boolean)

  const doc = {
    screen: kebab(d.id),
    title: titleOf(d.id),
    group: 'Deck',
    order: d.id === DEFAULT_DECK ? 1 : 2,
    mood: 'capture',
    note:
      `content/${d.id}.json — "${d.label}", ${d.items.length} slides (${roles.join('; ')}). ` +
      'A state pins an item id, never an index, so reordering the deck does not repoint every ' +
      'capture. Generated by scripts/lab-states.mjs — run `npm run lab:states` after changing content.',
    params: [
      { id: 'slide', label: 'slide', default: d.items[0].id, options: d.items.map((it) => ({ id: it.id, label: `${it.id} · ${it.type}` })) },
      {
        id: 'contents',
        label: 'contents',
        default: 'closed',
        options: [
          { id: 'closed', label: 'Closed' },
          { id: 'outline', label: 'Outline' },
          { id: 'slides', label: 'Slides' },
        ],
      },
      {
        id: 'status',
        label: 'status',
        default: 'ready',
        options: [
          { id: 'ready', label: 'Ready' },
          { id: 'empty', label: 'No slides' },
        ],
      },
    ],
    states,
  }

  const module = `import DeckView from '../deck/DeckView'

/**
 * ${titleOf(d.id)} — \`content/${d.id}.json\`${d.id === DEFAULT_DECK ? ', the deck that gets presented and published' : ', review only; it is not what the app shows'}.
 *
 * Generated by scripts/lab-states.mjs. One screen per deck is what puts the
 * decks in the studio tree by name; the deck is fixed here so no state can
 * point this screen at a different one.
 */
export default function ${pascal(d.id)}(props) {
  return <DeckView {...props} deck="${d.id}" />
}
`

  return { deck: d, doc, module, moduleRel: `src/screens/${pascal(d.id)}.jsx`, statesRel: `src/screens/${pascal(d.id)}.states.json` }
})

// ------------------------------------------------------------ slide archetypes
// From the reference deck: it is the one that carries every archetype, so
// coverage does not depend on what the current talk happens to use.
const byType = new Map()
for (const it of reference.items) if (!byType.has(it.type)) byType.set(it.type, it)

const missingTypes = Object.keys(ARCHETYPES).filter((t) => !byType.has(t))
if (missingTypes.length) {
  console.warn(
    `  warning     content/${reference.id}.json has no ${missingTypes.join(', ')} slide — ` +
      `those archetypes get no variant. The reference deck should carry one of every type.`,
  )
}

const slideStates = []
for (const [type, it] of byType) {
  const [label, note] = ARCHETYPES[type] || [type, `The ${type} archetype.`]
  slideStates.push({ id: type, label, device: 'desktop', note, props: { item: it, still: true } })
}

// The dispatcher falls back to Divider for a type it does not know, and that
// fallback is only ever seen here.
slideStates.push({
  id: 'unknown-type',
  label: 'Unknown type',
  device: 'desktop',
  note: 'An item whose `type` is not in the map. Slide falls back to Divider rather than rendering nothing.',
  props: { item: { ...reference.items[0], id: 'unknown-type', type: 'not-a-real-type' }, still: true },
})

// The narrow check, for the archetypes whose multi-column grid a phone breaks.
for (const type of ['cover', 'keypoints', 'twocolumn', 'process', 'table', 'showcase']) {
  const it = byType.get(type)
  if (!it) continue
  slideStates.push({
    id: `${type}-phone`,
    label: `${(ARCHETYPES[type] || [type])[0]} · phone`,
    device: 'iphone',
    note: 'The same archetype at 393px, where its grid has to give.',
    props: { item: it, still: true },
  })
}

const slideDoc = {
  component: 'Slide',
  title: 'Slide archetypes',
  group: 'Slides',
  order: 1,
  mood: 'capture',
  note:
    `The archetypes a deck is built from. Props are real items from the reference deck ` +
    `(content/${reference.id}.json), so a variant shows what an author actually gets and every ` +
    `archetype has one whatever the current talk uses. Generated by scripts/lab-states.mjs.`,
  states: slideStates,
}

// ------------------------------------------------------------------- write out
const targets = [
  ...screens.flatMap((sc) => [
    [sc.moduleRel, sc.module],
    [sc.statesRel, sc.doc],
  ]),
  ['src/components/Slide/Slide.states.json', slideDoc],
]

let stale = 0
for (const [rel, doc] of targets) {
  const path = resolve(root, rel)
  const next = typeof doc === 'string' ? doc : JSON.stringify(doc, null, 2) + '\n'
  let current = ''
  try {
    current = readFileSync(path, 'utf8')
  } catch {
    /* not there yet */
  }
  if (current === next) {
    console.log(`  up to date  ${rel}`)
    continue
  }
  stale++
  if (check) console.error(`  STALE       ${rel}`)
  else {
    // src/screens/ is generated wholesale, so it may not exist on a fresh
    // checkout or after every screen was removed.
    mkdirSync(dirname(path), { recursive: true })
    writeFileSync(path, next)
    console.log(`  wrote       ${rel}`)
  }
}

console.log(
  '\nscreens: ' +
    screens
      .map((sc) => `${sc.doc.title} (${sc.deck.items.length} slides${sc.deck.id === DEFAULT_DECK ? ', presented' : ''})`)
      .join(', ') +
    `\n${byType.size} archetypes from the reference deck (content/${reference.id}.json)`,
)

if (check && stale) {
  console.error(`\n${stale} states file(s) do not match content/. Run \`npm run lab:states\`.`)
  process.exit(1)
}
