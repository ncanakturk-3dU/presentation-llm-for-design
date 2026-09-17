---
description: Author a deck in /content — map content onto existing slide types, or (with permission) create a new slide type
---

Author or extend a deck for this presentation app. Work from the user's actual content, fit it to the existing slide types, and only invent a new type when the content genuinely needs one.

## Steps

1. **Get the content.** If `$ARGUMENTS` has a topic/outline, use it. Otherwise ask the user for the content — a topic, an outline, or raw material (notes, copy, a doc). Keep copy real and specific; never invent facts, metrics, or quotes the user didn't provide — leave a placeholder instead.
2. **Map content to existing types.** For each beat of the content, pick the existing slide type whose layout fits best (see the schema below). Open with a `cover`, use a `divider` between sections, close with a `quote`; reach for the rest as needed. Most content fits the eight existing types — prefer them.
3. **Only if a beat doesn't fit any existing type well:** describe the new slide type you have in mind (its purpose, layout, and fields, in one short paragraph) and **ask the user's permission** before building it. Do not create a new type unprompted. If they approve, implement it per **"Adding a new slide type"** below, then use it.
4. **Write the deck.** Emit a single JSON object `{ "meta": {…}, "items": [ … ] }` to `content/<kebab-name>.json`.
5. **Make it active** by pointing the import in `src/lib/useContent.js` at the new file (`import deck from '../../content/<kebab-name>.json'`). That import is the single declaration of which deck is presented. Leave older decks in `content/` as versions. Never overwrite `content/sample.json` — it is the reference deck, one slide per archetype, and it is what the next deck gets started from.
6. **Repoint the lab** with `npm run lab:states`. The designlab states pin item **ids** from the active deck, so after step 5 they name content that is gone: nothing errors, the deck just quietly falls back to the first slide and every capture is a picture of the cover. `npm run lab:states -- --check` exits 1 when they are stale.
7. **Look at every slide** in designlab rather than only clicking through the deck: `npm run lab:states` gives the `Slide` component one variant per archetype, captured in isolation at desktop and phone. A slide that only ever gets seen mid-deck hides its own layout bugs.

## Schema

`meta`: `{ "mark": "<name shown top-left>" }`

Every item: `{ "type": <type>, "id": "<unique>", "chapter": "<short label for the Contents outline>", …type fields }`.

- Emphasise exactly ONE word in a `title` / `quote` by wrapping it in `**double asterisks**` → it renders in the accent color.
- Ground: `cover` and `keypoints` are dark by default, the rest light. Override per item with `"theme": "light" | "dark"`.
- The page index (top-right) is always automatic — `{current} / {total slides}`. No per-slide override.

Existing type fields:
- `cover` — `title`, `subtitle`
- `divider` — `number` ("01"), `title`, `note`, `list` (array of strings)
- `keypoints` — `kicker`, `title`, `points` (array of strings)
- `twocolumn` — `kicker`, `title`, `note`, `columns` (array of `{ variant: "plain"|"brand", label, caption, note }`)
- `process` — `kicker`, `title`, `steps` (array of `{ n, tone: "teal"|"blue"|"violet"|"ink", title, points: [strings] }`)
- `codeui` — `kicker`, `title`, `code` (string, use `\n`), `preview` (`{ title, buttons: [{ label, variant: "primary"|"secondary"|"danger" }], states: [strings] }`), `note`
- `table` — `kicker`, `title`, `note`, `columns` (array of strings), `rows` (array of `{ severity, tone: "red"|"orange"|"yellow"|"muted", meaning, examples, action }`)
- `quote` — `quote`, `closer`, `byline`

Reference: `content/sample.json` — a complete one-of-every-type example.

## Adding a new slide type

Only after the user approves. A slide type is a small, data-driven layout component. Touch these four places, then use the type in the JSON:

1. **`src/slides/Slides.jsx`**
   - Add a component `function <Name>({ item, reduced, still }) { … }` that renders purely from `item` fields. `reduced` is the reader's `prefers-reduced-motion`; `still` is designlab asking for a frame that is identical every capture, so anything animated or random must read it (see `CoverSphere`, whose dot cloud is seeded under `still`). A static type can ignore both. Reuse the shared pieces: `renderAccent(item.title)` for the accent word, the `<Head kicker title note />` helper for the standard eyebrow+heading, `pad`/`highlightCode` from `../lib/text` as needed. Keep it a single root element that fills the stage (`height: 100%`).
   - Register it in `const MAP = { …, <type>: <Name> }`.
   - Add a `case '<type>':` to `slideOutline(item)` returning the array of sub-item strings for the Contents outline (return `[]` if none).
   - `slideTitle` already falls back to `item.title || item.quote || item.chapter || item.type`, so give the type a `title` or `chapter`. If the type should default to a **dark** ground, add it to `slideTheme` alongside `cover`/`keypoints`.
2. **`src/slides/slides.css`** — add its styles. Stay on the design system: color/spacing/radius tokens only (`var(--ink)`, `var(--accent)`, `var(--panel)`, `var(--r-sm|md)`, the `--pad*`/`--gap` clamps), hairline borders, the `.shead`/`.kicker` type ramp, mono micro-labels via `.mono`. No new house colors — depicted-UI specimen colors (like the process tones) are fine but stay out of the palette.
3. **The JSON item** uses `"type": "<type>"` plus its new fields.
4. **Update this file's schema list** and `content/sample.json` (add one example of the new type) so the type stays documented and discoverable. Add it to `ARCHETYPES` in `scripts/lab-states.mjs` too, so its lab variant gets a real label and note instead of the generic fallback — and to the phone list below it if its layout is multi-column.

Follow `DESIGN.md` for the world's rules (one accent word per slide, warm-neutral grounds, flat chrome, Geist + Geist Mono). Before finishing, run `npm run lab:states` and look at the new type's variant on the designlab component stage at both devices — not just at the slide in the running deck.
