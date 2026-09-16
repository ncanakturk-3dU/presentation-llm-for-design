# Project notes

A JSON-driven presentation deck. React + Vite (JSX), Framer Motion for transitions, React Three Fiber / three **only** for the cover slide's dotted sphere (`src/components/CoverSphere.jsx`).

## Content

- All deck JSONs live in **`content/`** (one JSON = one deck; `meta` + an `items` array of typed slides). Keep versions here as separate files.
- The **active** deck is whatever `src/lib/useContent.js` imports — by default `content/sample.json` (a placeholder deck with one of every slide type). Swap that one import to change decks.
- Author a new deck with the **`/new-deck`** command (see `.claude/commands/new-deck.md`): it maps your content onto the existing slide types, writes a new JSON into `content/`, points the import at it, and — with your OK — can add a new slide type when the content needs one.
- Emphasise one word in a title/quote with `**word**` (renders in the accent color).

## Slide types

Eight archetypes, each a layout in `src/slides/Slides.jsx` (styles in `src/slides/slides.css`): `cover`, `divider`, `keypoints`, `twocolumn`, `process`, `codeui`, `table`, `quote`. Ground (light/dark) defaults per type in `slideTheme()`; override with an item `theme`.

## Structure

- `src/App.jsx` — deck shell: index state, keyboard/touch nav, header/footer chrome, slide transitions, Contents overlay.
- `src/components/Contents.jsx` — the floating Contents overlay with two tabs: **Outline** (nested text outline for reading the deck) and **Slides** (PowerPoint-style thumbnail grid). Open with the ≡ button or the `O` / `Esc` key.
- `src/slides/Slides.jsx` — the eight slide components + a dispatcher and outline helpers.
- `src/design/` — tokens (light + dark themes, terracotta accent), base, and self-hosted Geist / Geist Mono fonts.

## Conventions

- Emphasise one word in a title/quote with `**word**` (renders in the accent color).
- Keep the accent to the one word / active mark per slide; grounds are warm paper (light) and near-black (dark), never pure white/black.
