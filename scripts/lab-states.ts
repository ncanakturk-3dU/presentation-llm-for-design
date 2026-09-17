#!/usr/bin/env tsx
/**
 * Regenerate the designlab states files from the decks in `content/`.
 *
 * The deck screen renders whichever deck is asked for, and its states pin a
 * deck item **id**. So the moment content changes — a new deck, a
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
 * `src/lib/deck-ids.ts` so this is not a second place to state them.
 *
 * It runs under `tsx`, so it imports the decks rather than parsing them: the
 * same modules the app imports, checked by the same contract. A deck that does
 * not typecheck never gets this far.
 *
 *   npm run lab:states              rewrite the states files
 *   npm run lab:states -- --check   exit 1 if they are stale (no writes)
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import type { Deck, SlideItem, SlideType, Theme } from '../content/types'
import { DEFAULT_DECK, REFERENCE_DECK } from '../src/lib/deck-ids'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const check = process.argv.includes('--check')

// decks.ts states the presented deck twice — once as a static import so every
// build carries it, once by naming DEFAULT_DECK. Two statements of one fact
// drift, and the drift is quiet: the app would present one deck while the lab
// captured another. Catch it here rather than in a screenshot nobody re-reads.
{
  const src = readFileSync(resolve(root, 'src/lib/decks.ts'), 'utf8')
  const m = src.match(/^import\s+presented\s+from\s+'.*?\/([^/']+)'/m)
  if (!m) throw new Error("src/lib/decks.ts has no `import presented from '.../<deck>'` line")
  if (m[1] !== DEFAULT_DECK) {
    throw new Error(
      `src/lib/decks.ts disagrees with itself: it imports '${m[1]}' but DEFAULT_DECK is ` +
        `'${DEFAULT_DECK}'. The app would present ${m[1]} while the lab captured ${DEFAULT_DECK}.`,
    )
  }
}

type LoadedDeck = { id: string; label: string; items: SlideItem[] }

const contentDir = resolve(root, 'content')
const deckFiles = readdirSync(contentDir)
  .filter((f) => f.endsWith('.ts') && f !== 'types.ts')
  .sort()

const decks: LoadedDeck[] = await Promise.all(
  deckFiles.map(async (f) => {
    const id = f.replace(/\.ts$/, '')
    const mod = (await import(resolve(contentDir, f))) as { default: Deck }
    const data = mod.default
    return { id, label: data?.meta?.mark || id.replace(/[-_]+/g, ' '), items: data?.items || [] }
  }),
)

if (decks.length === 0) throw new Error('no decks in content/')

for (const d of decks) {
  if (d.items.length === 0) throw new Error(`content/${d.id}.ts declares no items`)
  const missing = d.items.filter((it) => !it.id)
  if (missing.length) {
    throw new Error(
      `content/${d.id}.ts: every item needs an \`id\` — a state pins ids, not indexes. ` +
        `${missing.length} without one (types: ${[...new Set(missing.map((i) => i.type))].join(', ')})`,
    )
  }
  const dupes = d.items.map((i) => i.id).filter((id, i, a) => a.indexOf(id) !== i)
  if (dupes.length) {
    throw new Error(`content/${d.id}.ts: duplicate item ids (${[...new Set(dupes)].join(', ')})`)
  }
}

const pick = (id: string) => decks.find((d) => d.id === id)
const active = pick(DEFAULT_DECK)
if (!active) throw new Error(`DEFAULT_DECK '${DEFAULT_DECK}' has no content/${DEFAULT_DECK}.ts`)
const reference = pick(REFERENCE_DECK) || active

const ARCHETYPES: Partial<Record<SlideType, [string, string]>> = {
  cover: ['Cover', 'Dark. Headline with the accent word, over the dot sphere.'],
  divider: ['Section divider', 'Light. Big numeral, section title, and the numbered list of what is in it.'],
  keypoints: ['Key points', 'Dark. Title on the left, numbered rows hairline-separated on the right.'],
  callouts: [
    'Callouts',
    'Dark. The numbered list on the left and one screenshot on the right, pinned with the same numbers. A point with no `pin` keeps its number in the list and marks nothing on the picture, which is the case for a failing a still cannot show.',
  ],
  twocolumn: ['Two column', 'Light. Two mock screens side by side, each under its own caption.'],
  process: ['Process', 'Light. Tone-coded step cards in a row, each over its own points.'],
  cards: [
    'Cards',
    'Light. Parallel specimen cards — a title on the same dark band `process` gives its steps, over the list or paragraph that supports it. No numerals and no connectors, which is what separates it from the process row.',
  ],
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
const pascal = (id: string) => id.split(/[-_]+/).filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join('')

/** `version_1` → `version-1` (a screen id), `sample` → `sample`. */
const kebab = (id: string) => id.replace(/_+/g, '-').toLowerCase()

/** `version_1` → `Version 1`. The tree names decks by file, not by the talk's
 *  title: a deck's `meta.mark` is the presentation's name and changes as it is
 *  written, while the file is how you pick a version. */
const titleOf = (id: string) => id.split(/[-_]+/).filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join(' ')

const screens = decks.map((d) => {
  // A deck is navigated the way its table of contents reads: position first,
  // then which part you are in, then which slide of that part. So the label is
  // index · part · slide, taking the part from the last `divider` passed and
  // the slide from the item's own `chapter`. The archetype is not in the label
  // — it is what the slide is made of, not where it sits — and stays on the
  // `slide` param, which is the list you use when you want "the table one".
  let section: string | null = null
  type State = { id: string; label: string; note?: string; device?: string; params?: Record<string, string> }
  const states: State[] = d.items.map((it, n) => {
    if (it.type === 'divider') section = it.chapter || null
    if (it.standalone) section = null
    const crumbs = [String(n + 1).padStart(2, '0')]
    if (section) crumbs.push(section)
    if (it.chapter && it.chapter !== section) crumbs.push(it.chapter)
    return {
      id: `slide-${it.id}`,
      label: crumbs.join(' · '),
      note: `The ${it.type} archetype in the deck shell, with the chrome and page reference around it.`,
      params: { slide: it.id },
    }
  })

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
      `content/${d.id}.ts — "${d.label}", ${d.items.length} slides (${roles.join('; ')}). ` +
      'A state pins an item id, never an index, so reordering the deck does not repoint every ' +
      'capture. Generated by scripts/lab-states.ts — run `npm run lab:states` after changing content.',
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
      // `divider` and `keypoints` only, and overrides rather than authoring:
      // `Deck` renders the item as written, the rest try a value on it. Settle
      // on one here, then write it into the deck module as `marker` / `split` —
      // nothing outside the studio reads a param. On the other nine archetypes
      // they do nothing.
      {
        id: 'marker',
        label: 'marker',
        default: 'deck',
        options: [
          { id: 'deck', label: 'As written' },
          { id: 'number', label: 'Numbers' },
          { id: 'bullet', label: 'Bullets' },
          { id: 'none', label: 'None' },
        ],
      },
      {
        id: 'split',
        label: 'split',
        default: 'deck',
        options: [
          { id: 'deck', label: 'As written' },
          { id: 'golden', label: 'Golden · 62 : 38' },
          { id: 'even', label: 'Even · 50 : 50' },
          { id: 'golden-flip', label: 'Golden flipped · 38 : 62' },
        ],
      },
    ],
    states,
  }

  const module = `import type { ComponentProps } from 'react'
import DeckView from '../deck/DeckView'

/**
 * ${titleOf(d.id)} — \`content/${d.id}.ts\`${d.id === DEFAULT_DECK ? ', the deck that gets presented and published' : ', review only; it is not what the app shows'}.
 *
 * Generated by scripts/lab-states.ts. One screen per deck is what puts the
 * decks in the studio tree by name; the deck is fixed here so no state can
 * point this screen at a different one.
 */
export default function ${pascal(d.id)}(props: ComponentProps<typeof DeckView>) {
  return <DeckView {...props} deck="${d.id}" />
}
`

  return { deck: d, doc, module, moduleRel: `src/screens/${pascal(d.id)}.tsx`, statesRel: `src/screens/${pascal(d.id)}.states.json` }
})

// ------------------------------------------------------------ slide archetypes
// From the reference deck: it is the one that carries every archetype, so
// coverage does not depend on what the current talk happens to use.
const byType = new Map<SlideType, SlideItem>()
for (const it of reference.items) if (!byType.has(it.type)) byType.set(it.type, it)

const missingTypes = (Object.keys(ARCHETYPES) as SlideType[]).filter((t) => !byType.has(t))
if (missingTypes.length) {
  console.warn(
    `  warning     content/${reference.id}.json has no ${missingTypes.join(', ')} slide — ` +
      `those archetypes get no variant. The reference deck should carry one of every type.`,
  )
}

type SlideState = { id: string; label: string; device: string; note: string; props: Record<string, unknown> }
const slideStates: SlideState[] = []
for (const [type, it] of byType) {
  const [label, note] = ARCHETYPES[type] ?? [type, `The ${type} archetype.`]
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
const PHONE_TYPES: SlideType[] = ['cover', 'keypoints', 'callouts', 'twocolumn', 'process', 'cards', 'table', 'showcase']
for (const type of PHONE_TYPES) {
  const it = byType.get(type)
  if (!it) continue
  slideStates.push({
    id: `${type}-phone`,
    label: `${(ARCHETYPES[type] ?? [type])[0]} · phone`,
    device: 'iphone',
    note: 'The same archetype at 393px, where its grid has to give.',
    props: { item: it, still: true },
  })
}

// The other ground. An archetype has a default ground and an item can ask for
// the opposite one with `theme`; the reference deck carries each archetype once,
// so the flipped ground is only ever seen here.
const THEME_FLIP: Array<[SlideType, Theme]> = [['callouts', 'light']]
for (const [type, theme] of THEME_FLIP) {
  const it = byType.get(type)
  if (!it) continue
  slideStates.push({
    id: `${type}-${theme}`,
    label: `${(ARCHETYPES[type] ?? [type])[0]} · ${theme}`,
    device: 'desktop',
    note: `The same archetype with \`theme: "${theme}"\`, the ground an item asks for instead of the archetype's default.`,
    props: { item: { ...it, id: `${type}-${theme}`, theme }, still: true },
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
    `(content/${reference.id}.ts), so a variant shows what an author actually gets and every ` +
    `archetype has one whatever the current talk uses. Generated by scripts/lab-states.ts.`,
  states: slideStates,
}

// ------------------------------------------------------------------- write out
const targets: Array<[string, string | object]> = [
  ...screens.flatMap((sc): Array<[string, string | object]> => [
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
    `\n${byType.size} archetypes from the reference deck (content/${reference.id}.ts)`,
)

if (check && stale) {
  console.error(`\n${stale} states file(s) do not match content/. Run \`npm run lab:states\`.`)
  process.exit(1)
}
