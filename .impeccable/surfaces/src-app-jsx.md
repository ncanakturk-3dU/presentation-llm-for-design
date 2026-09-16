---
version: 1
slug: "src-app-jsx"
primary_target: "src/App.jsx"
related_targets: []
---

## Scope & mode

Whole surface: the entire presentation app, rebuilt as a JSON-driven typed-slide deck. Mode: Experience with a Read backbone — the presenter drives; each slide is one idea in its own editorial layout, and the audience follows a masterclass arc.

## Audience & job

Primary: the presenter delivering the talk live (stage / screen-share). Secondary: the room watching a projected 1080p+ screen. Job: follow the argument slide by slide and jump anywhere via a left-side Contents drawer (Outline + Slides tabs). Action = advance (→ / space / click); wayfinding = page index + the Contents drawer.

## Direction contract

THESIS: A presenter's deck as a precise editorial system — eight distinct slide archetypes (cover, section divider, key-points, before/after two-column, process/workflow diagram, code + UI, table/matrix, quote/closing) unified by one grid, one type system, and a single warm signal. It refuses both the generic bullet-template deck and the all-dark WebGL demo the prior world was; it reads like a well-set conference talk.

OWN-WORLD: Mixed grounds assigned per archetype — warm paper (#F5F4F1) light and near-black (#0E0F11) dark; near-black / bone ink; one terracotta signal (#DD5C2B) used only on the one key word and active marks. Geist grotesk for display + body; Geist Mono for eyebrows, page indices, and code. Hairline rules, generous margins, large muted section numerals, numbered structures. Chrome is header-only — menu + wordmark top-left, automatic `{current} / {total}` page index top-right; no footer, no corner kicker. One slowly rotating dotted-particle sphere (R3F) appears only on the cover.

STORY: The audience follows a masterclass arc across archetypes; each slide states one idea in its own layout, the accent marks the single word that carries it, and a left-side Contents drawer (Outline for reading the deck as a document; Slides for a PowerPoint-style thumbnail grid) lets the presenter jump anywhere.

FIRST VIEWPORT (cover): dark ground; large left heading "Turn ideas into better products with AI." with "better" in terracotta; a quiet sub-line beneath; a slowly rotating dotted sphere upper-right; top-left menu + "LLM for Design", top-right page index "01 / NN"; no footer. Primary action: advance.

FORM: JSON-driven typed-slide deck (React + Vite, Framer Motion transitions, R3F/three ONLY for the cover sphere). Eight item types map to eight layout components; a two-tab left-side Contents drawer (Outline / Slides) slides in over them. New types can be added on request (see `.claude/commands/new-deck.md`). World pinned by the user's supplied 8-slide reference image — the concept roll was not run because the user pinned the world. No seed key (roll not run); list position n/a (pinned).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Memorable moment

The cover's slowly rotating dotted sphere resolving over the dark ground as the title sets; then the editorial rhythm — a huge muted "01" section number, a two-column before/after, a four-box workflow — each archetype arriving in its own decisive layout, tied together by the one terracotta word per slide.

## Unresolved / to confirm later

- Decks live in `content/`; the active deck is a static import in `src/lib/useContent.js` (default `content/sample.json`, one of every type with placeholder copy). Author new decks — and new slide types — via `/new-deck`.
- Exact Geist weights and the accent hue tuned in the inspection round.
