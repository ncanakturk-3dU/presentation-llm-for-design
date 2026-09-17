# Presentation Deck

A JSON-driven presentation deck — eight editorial slide archetypes rendered from a single content file. Built with **React + Vite**, **Framer Motion** for transitions, and **React Three Fiber** (three.js) for the cover slide's rotating dotted sphere.

## Quick start

```bash
npm install
npm run dev        # start the dev server
npm run build      # production build → dist/
npm run preview    # preview the production build
```

## Content

The whole deck is data — everything renders from one JSON file.

- Deck JSONs live in **`content/`**. The **active** deck is the one imported by `src/lib/useContent.js` — currently `content/version_1.json`, the real presentation.
- To present a different deck, point that single import at another file in `content/`, then run `npm run lab:states` so the designlab states follow it.
- `content/sample.json` is the reference deck, one slide of every type. Copy it to start a new deck; do not overwrite it to change what is presented.
- Emphasise one word in a `title` or `quote` with `**double asterisks**` — it renders in the accent color.

### Slide types

`cover`, `divider`, `keypoints`, `twocolumn`, `process`, `codeui`, `table`, `quote`. Grounds (light / dark) default per type and can be overridden per item with `"theme"`. See `content/sample.json` for a complete example of every type.

## Authoring a new deck — `/new-deck`

This project ships a Claude Code command to scaffold decks. In Claude Code, run:

```
/new-deck <topic or rough outline>
```

It authors a new deck JSON that follows the schema, writes it into `content/`, and points the active import at it. Run it with no argument and it asks for the topic first. The full schema (every type and field) lives in `.claude/commands/new-deck.md`.

You can also edit the JSON by hand — copy the shape of any item in `content/sample.json`, then run `npm run lab:states`.

## Navigation

- **Next / previous:** → ← / Space / Page Up · Down, or click the right / left of the slide. Swipe on touch.
- **Jump anywhere:** the **Contents** side drawer — open with the ≡ button (top-left) or the `O` key, close with `Esc`. Two tabs: **Outline** (a nested text outline) and **Slides** (a thumbnail grid). Search filters both.
- **First / last:** Home / End.
- **Deep link:** `#N` in the URL opens the deck at slide N (e.g. `/#5`).

## Deployment

Pushing to `main` builds and deploys to GitHub Pages via `.github/workflows/deploy.yml`.

## Project layout

- `content/` — deck JSON files (the data). `sample.json` is the reference; the active one is named in `src/lib/useContent.js`.
- `src/slides/` — the eight slide layout components + shared helpers.
- `src/components/` — the Contents drawer, the cover sphere, and the lab stage for the slide archetypes.
- `src/screens/Deck.jsx` — the presented deck, and the one screen designlab renders.
- `scripts/lab-states.mjs` — regenerates the designlab states from the active deck (`npm run lab:states`).
- `src/design/` — tokens (light / dark themes, accent), base styles, self-hosted fonts.
- `.claude/commands/new-deck.md` — the deck-authoring command.
- `CLAUDE.md` — project notes for Claude Code.
