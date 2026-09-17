# Presentation Deck

A presentation deck driven by typed content — ten editorial slide archetypes rendered from a single deck module. Built with **React + Vite + TypeScript**, **Framer Motion** for transitions, and **React Three Fiber** (three.js) for the cover slide's rotating dotted sphere.

## Quick start

```bash
npm install
npm run dev        # start the dev server
npm run build      # typecheck, then production build → dist/
npm run preview    # preview the production build
npm run typecheck  # tsc --noEmit, the deck contract included
```

## Content

The whole deck is data — everything renders from one deck module, and `content/types.ts` says what a deck is allowed to be. A misspelled archetype or a `tone` that is not a tone fails `npm run typecheck` rather than rendering the wrong thing on stage.

- Decks live in **`content/`** as `.ts` modules. Every file but `types.ts` is a deck; `src/lib/decks.ts` discovers them.
- The **presented** deck is `DEFAULT_DECK` in `src/lib/deck-ids.ts` — currently `version_1`. The running app shows that one and only that one, so what you publish is never ambiguous.
- Every deck is browsable in designlab via the `deck` param on the deck screen, which is where you review a draft without making it presentable.
- To present a different deck, change `DEFAULT_DECK` in `src/lib/deck-ids.ts` **and** the static import at the top of `src/lib/decks.ts` — they must name the same file, and `npm run lab:states` fails if they drift. Then re-run it.
- A production build bundles only the presented deck, so an unfinished draft in `content/` is never readable on the published page. Drafts are reviewed in the designlab studio, which runs the dev server.
- `content/sample.ts` is the reference deck, one slide of every type. Copy it to start a new deck; do not overwrite it to change what is presented.
- Emphasise one word in a `title` or `quote` with `**double asterisks**` — it renders in the accent color.

### Slide types

`cover`, `divider`, `keypoints`, `callouts`, `twocolumn`, `process`, `cards`, `codeui`, `table`, `quote`, `showcase`. Grounds (light / dark) default per type and can be overridden per item with `"theme"`. See `content/sample.ts` for a complete example of every type, and `content/types.ts` for the fields each one takes.

## Authoring a new deck — `/new-deck`

This project ships a Claude Code command to scaffold decks. In Claude Code, run:

```
/new-deck <topic or rough outline>
```

It authors a new deck module that satisfies `Deck`, writes it into `content/`, and points the active import at it. Run it with no argument and it asks for the topic first. The full schema (every type and field) lives in `.claude/commands/new-deck.md`.

You can also write one by hand — copy the shape of any item in `content/sample.ts`, let the editor autocomplete the rest, then run `npm run lab:states`.

## Navigation

- **Next / previous:** → ← / Space / Page Up · Down, or click the right / left of the slide. Swipe on touch.
- **Jump anywhere:** the **Contents** side drawer — open with the ≡ button (top-left) or the `O` key, close with `Esc`. Two tabs: **Outline** (a nested text outline) and **Slides** (a thumbnail grid). Search filters both.
- **First / last:** Home / End.
- **Deep link:** `#N` in the URL opens the deck at slide N (e.g. `/#5`).

## Deployment

Pushing to `main` builds and deploys to GitHub Pages via `.github/workflows/deploy.yml`.

## Project layout

- `content/` — the decks, and `types.ts`, which is the contract they satisfy. `sample.ts` is the reference; the presented one is `DEFAULT_DECK` in `src/lib/deck-ids.ts`.
- `public/showcase/` — the screenshots the `showcase` slides point at.
- `src/slides/` — the ten slide layout components + shared helpers.
- `src/components/` — the Contents drawer, the cover sphere, and the lab stage for the slide archetypes.
- `src/screens/` — one generated screen per deck, which is how the studio tree lists them by name.
- `scripts/lab-states.ts` — regenerates the designlab states from the decks it imports (`npm run lab:states`).
- `src/design/` — tokens (light / dark themes, accent), base styles, self-hosted fonts.
- `.claude/commands/new-deck.md` — the deck-authoring command.
- `CLAUDE.md` — project notes for Claude Code.
