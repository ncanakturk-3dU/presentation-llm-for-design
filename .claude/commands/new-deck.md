---
description: Author a deck in /content — map content onto existing slide types, or (with permission) create a new slide type
---

Author or extend a deck for this presentation app. Work from the user's actual content, fit it to the existing slide types, and only invent a new type when the content genuinely needs one.

## Steps

1. **Get the content.** If `$ARGUMENTS` has a topic/outline, use it. Otherwise ask the user for the content — a topic, an outline, or raw material (notes, copy, a doc). Keep copy real and specific; never invent facts, metrics, or quotes the user didn't provide — leave a placeholder instead.
2. **Group the content into parts, then map each beat to a type.** A deck's top level is its parts, so decide the sections first — an `intro`, the numbered parts, a `closing` — and write each beat into the part it belongs to. Then, for each beat, pick the existing slide type whose layout fits best (see the schema below). Open with a `cover`, open each numbered part with a `divider`, close with a `quote`; reach for the rest as needed. Most content fits the eleven existing types — prefer them.
3. **Only if a beat doesn't fit any existing type well:** describe the new slide type you have in mind (its purpose, layout, and fields, in one short paragraph) and **ask the user's permission** before building it. Do not create a new type unprompted. If they approve, implement it per **"Adding a new slide type"** below, then use it.
4. **Write the deck.** Emit a TypeScript module to `content/<kebab-name>.ts`, shaped like the others:

   ```ts
   import type { Deck } from './types'

   const deck = {
     meta: { mark: "<name shown top-left>" },
     parts: [
       { id: "intro", label: "Intro", slides: [ … ] },
       { id: "part-1", label: "<short name>", slides: [ { type: "divider", … }, … ] },
       { id: "closing", label: "Closing", slides: [ … ] },
     ],
   } satisfies Deck

   export default deck
   ```

   `satisfies`, never a `: Deck` annotation — it checks the whole deck while keeping the literal's narrow types. Then run `npm run typecheck`: the contract in `content/types.ts` catches a misspelled `type`, a `tone` that is not a tone, or a `table` with the wrong number of columns. A deck that does not typecheck is not finished.
5. **Leave it unpresented unless asked.** Dropping the module into `content/` is enough to review it: designlab gives every deck there its own screen. Only when the user says this deck is the one they are presenting, set `DEFAULT_DECK` in `src/lib/deck-ids.ts` to its id **and** repoint the static `import presented from` at the top of `src/lib/decks.ts` — they must name the same file, and `npm run lab:states` fails if they drift. The app shows that deck and nothing else, so changing it changes what gets published. Leave older decks in `content/` as versions. Never overwrite `content/sample.ts`: it is the reference deck, one slide per archetype, what the next deck starts from, and the source of the `Slide` archetype variants in the lab.
6. **Repoint the lab** with `npm run lab:states`. The designlab states pin item **ids** from the active deck, so after step 5 they name content that is gone: nothing errors, the deck just quietly falls back to the first slide and every capture is a picture of the cover. `npm run lab:states -- --check` exits 1 when they are stale.
7. **Look at every slide** in designlab rather than only clicking through the deck: `npm run lab:states` gives the `Slide` component one variant per archetype, captured in isolation at desktop and phone. A slide that only ever gets seen mid-deck hides its own layout bugs.

## Schema

`meta`: `{ mark: "<name shown top-left>" }`

`parts`: the deck's top level. Each is `{ id: "<unique>", label: "<short name>", slides: [ … ] }`.

- A slide belongs to the part whose `slides` array it is written in. Nothing infers it, so a slide cannot drift into the part above when you reorder.
- A part has no `number` of its own. A numbered part opens on a `divider` and that divider's `number` is the numeral — asked for once, drawn on the slide, and read back by the chrome and the Contents outline. A part with no divider (`intro`, `closing`, a bonus section) has no number and shows its `label` alone.
- `slides: []` is allowed. A part that is named but not yet written renders nothing and lists nothing, so the slot can exist in the file before the content does.

Every slide: `{ type: <type>, id: "<unique>", chapter: "<short label for the Contents outline>", …type fields }`. `id` is required — designlab states pin ids, never indexes. `chapter` is the slide's own name, one level below the part that holds it.

- `standalone: true` draws no part reference in the corner. It does **not** change which part the slide is in — nesting decides that. Use it only where the slide's own title is the whole slide: the cover, a full-bleed reference list.

- Emphasise exactly ONE word in a `title` / `quote` by wrapping it in `**double asterisks**` → it renders in the accent color.
- Ground: `cover` and `keypoints` are dark by default, the rest light. Override per item with `theme: "light" | "dark"`.
- The page index (top-right) is always automatic — `{current} / {total slides}`. No per-slide override.

Existing type fields:
- `cover` — `title`, `subtitle`
- `divider` — `number` ("01"), `title`, `note`, `list` (array of strings), `marker` (`"number"` default, `"bullet"`, `"none"`), `split` (`"golden"`, `"even"`, `"golden-flip"`). `marker` is what stands in front of each row — the accent numerals, a dot, or nothing — and it also picks the element, since an `ol` claims the order matters and a `ul` does not. `split` is the main-to-list proportion, on the golden scale: `golden` is φ : 1 (62 : 38) and is also what you get by leaving the field out, `golden-flip` is the same ratio the other way up for a section whose list is the substance, and `even` is the one deliberate exception. Row padding answers to how many rows there are, so a long list tightens itself instead of running off the stage. `list` is optional: omit it or leave it empty and the slide switches to its solo layout — a 2:1 grid with the title and note stepped up a size, rather than a two-column grid with a dead right half. Both fields are also designlab params on the deck screen (`marker`, `split`), so you can try values on the running slide before writing one in — the param is for looking, the deck module is what ships.
- `keypoints` — `kicker`, `title`, `points` (array of strings), `marker`, `split` (the same two fields `divider` takes, on the same reading — but unset here is `even`, not `golden`, because that is what every keypoints slide was before the fields existed)
- `callouts` — `kicker`, `title`, `image` (`{ src, alt, label }`), `points` (array of `{ text, pin: { x, y } }`), `status`. The evidenced `keypoints`: the same numbered rows on the left, one screenshot on the right, and a pin carrying each row's number on the thing it names. `x` and `y` are percentages of the image itself, from its top left, so a coordinate keeps meaning whatever size the picture renders at. Place a pin next to what it marks rather than on top of it — a pin that covers the tell hides the evidence. `pin` is optional: a point without one keeps its number in the list and marks nothing, which is the case for a failing a still cannot show (an animation). Same `src` rule as `showcase`: a `public/` path with no leading slash, and no `src` draws `alt` in a dashed frame.
- `twocolumn` — `kicker`, `title`, `note`, `columns` (array of `{ variant: "plain"|"brand", label, caption, note }`)
- `process` — `kicker`, `title`, `steps` (array of `{ n, tone: "teal"|"blue"|"violet"|"ink", title, points: [strings] }`)
- `cards` — `kicker`, `title`, `note`, `quoted` (boolean), `cards` (array of `{ title, subtitle, points: [strings] }` or `{ title, subtitle, text }` — one body or the other, never both). Parallel specimens, not steps: each card states one thing and lists what supports it. Reach for it instead of `process` whenever the items have no order — `process` numbers its cards and draws a connector between them, which claims a sequence the content may not have. `title` and `subtitle` sit on the same dark band `process` gives its step cards, so the claim is legible from the back of the room and the body below it is clearly support. Set `quoted` when the titles are things somebody said or typed and the element wraps each one in quotation marks itself, so write them as plain text; leave it out for a filename or a name. `subtitle` is the line that says what the content under it is (`Why it fails`, `The AI hears`, `What you get`).
- `codeui` — `kicker`, `title`, `code` (string, use `\n`), `file` (the tab label, default `Button.tsx`), `preview` (`{ title, buttons: [{ label, variant: "primary"|"secondary"|"danger" }], statesLabel, states: [strings] }`), `note`. `highlightCode` is JavaScript-aware, so a word like `for` or `else` in prose inside `code` gets coloured as a keyword — reword rather than fight it.
- `table` — `kicker`, `title`, `note`, `columns` (array of exactly 4 strings), `rows` (array of `{ severity, tone: "red"|"orange"|"yellow"|"muted"|"ink", meaning, examples, action }`). The red/orange/yellow/muted ladder is for a severity table; use `ink` for a table that is a matrix or a reference list, because `muted` renders in `--ink-faint` and does not reach AA contrast.
- `showcase` — `kicker`, `title`, `note`, `images` (1 or 2 of `{ src, alt, label }`), `status`, `link`. `src` is a path inside `public/` written **without** a leading slash (`showcase/thing.png`), resolved against Vite's base so it works both in the studio and in the built site. Omit `src` and the frame draws `alt` in a dashed box — that is the placeholder for work with no screenshot yet, and it is how a placeholder stays visibly a placeholder.
- `quote` — `quote`, `closer`, `byline`

Reference: `content/sample.ts` — a complete one-of-every-type example. `content/types.ts` is the contract itself, and the editor will autocomplete from it.

## Adding a new slide type

Only after the user approves. A slide type is a small, data-driven layout component. Touch these five places, in this order:

1. **`content/types.ts`**
   - Add a `<Name>Item` type — `Base & { type: '<type>'; …fields }` — and add it to the `SlideItem` union. Required means the layout cannot render without it; optional means optional in the layout, not "not written yet". Do this first: the union is what the rest of the steps are checked against, and `MAP` in `Slides.tsx` will not compile until the new type has a component.

2. **`src/slides/Slides.tsx`**
   - Add a component `function <Name>({ item }: { item: <Name>Item }) { … }` that renders purely from `item` fields (take `reduced` / `still` too if it animates). `reduced` is the reader's `prefers-reduced-motion`; `still` is designlab asking for a frame that is identical every capture, so anything animated or random must read it (see `CoverOrb`, which holds one frame under `still`). A static type can ignore both. Reuse the shared pieces: `renderAccent(item.title)` for the accent word, the `<Head kicker title note />` helper for the standard eyebrow+heading, `pad`/`highlightCode` from `../lib/text` as needed. Keep it a single root element that fills the stage (`height: 100%`).
   - Register it in `const MAP = { …, <type>: <Name> }`.
   - Add a `case '<type>':` to `slideOutline(item)` returning the array of sub-item strings for the Contents outline (return `[]` if none).
   - `slideTitle` already falls back to `item.title || item.quote || item.chapter || item.type`, so give the type a `title` or `chapter`. If the type should default to a **dark** ground, add it to `slideTheme` alongside `cover`/`keypoints`.
3. **`src/slides/slides.css`** — add its styles. Stay on the design system: color/spacing/radius tokens only (`var(--ink)`, `var(--accent)`, `var(--panel)`, `var(--r-sm|md)`, the `--pad*`/`--gap` clamps), hairline borders, the `.shead`/`.kicker` type ramp, mono micro-labels via `.mono`. No new house colors — depicted-UI specimen colors (like the process tones) are fine but stay out of the palette.
4. **The deck item** uses `type: '<type>'` plus its new fields.
5. **Update this file's schema list** and `content/sample.ts` (add one example of the new type) so the type stays documented and discoverable. Add it to `ARCHETYPES` in `scripts/lab-states.ts` too, so its lab variant gets a real label and note instead of the generic fallback — and to the phone list below it if its layout is multi-column.

Follow `DESIGN.md` for the world's rules (one accent word per slide, warm-neutral grounds, flat chrome, Geist + Geist Mono). Before finishing, run `npm run lab:states` and look at the new type's variant on the designlab component stage at both devices — not just at the slide in the running deck.
