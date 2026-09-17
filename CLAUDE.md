# Project notes

A presentation deck driven by typed content. React + Vite + **TypeScript**, Framer Motion for transitions, React Three Fiber / three **only** for the cover slide's dotted sphere (`src/components/CoverSphere/CoverSphere.tsx`).

## Content

- All decks live in **`content/`** as TypeScript modules (one file = one deck; `meta` + an `items` array, `export default` + `satisfies Deck`). Keep versions here as separate files.
- **`content/types.ts` is the contract.** Every archetype is a member of the `SlideItem` union, discriminated on `type`, so a misspelled archetype, a `tone` that is not a tone or a `table` with three columns is a compile error while the deck is being written — not a wrong slide on stage. `npm run typecheck` is the gate, and `npm run build` runs it first.
- The **presented** deck is `DEFAULT_DECK` in `src/lib/deck-ids.ts` — currently `version_1`. The app shows that deck and only that deck: a published presentation is one deck, and a way to switch mid-talk is a way to open the wrong one on stage. Change what is presented by changing that constant.
- **All** decks in `content/` are visible in designlab through the screen's `deck` param, so a draft can be reviewed without being presentable.
- A **production build carries only the presented deck**: the glob over `content/` is dev-only, so a draft's copy is never readable in the published JS. The studio runs the dev server, which is why every deck shows up there. One consequence — `export_prototype` is a production build, so an exported prototype has only the presented deck.
- `content/sample.ts` is the **reference** deck (`meta.mark: "Sample Deck"`), one slide of every archetype. It is what a new deck gets started from and what the schema is documented against — never overwrite it to change what is presented.
- The designlab states pin item **ids** from the active deck, so after changing content run **`npm run lab:states`**. Skipping it breaks nothing loudly: the deck falls back to the first slide and every capture becomes a picture of the cover. `npm run lab:states -- --check` exits 1 when they are stale.
- Author a new deck with the **`/new-deck`** command (see `.claude/commands/new-deck.md`): it maps your content onto the existing slide types, writes a new deck module into `content/`, points the import at it, and — with your OK — can add a new slide type when the content needs one.
- Prose fields take **inline Markdown**: `` `code` ``, `*emphasis*`, `[text](href)`, and `**word**`, which renders in the accent color rather than bold — that is the deck's one-accent-word rule. Block Markdown is deliberately not supported; headings and lists are what the archetypes are. `src/lib/text.tsx` owns the parser (`renderInline` to render, `stripMarks` for the plain string).

## Slide types

Eleven archetypes, each a layout in `src/slides/Slides.tsx` (styles in `src/slides/slides.css`): `cover`, `divider`, `keypoints`, `callouts`, `twocolumn`, `process`, `cards`, `codeui`, `table`, `quote`, `showcase`. `cards` is the un-ordered sibling of `process`: parallel specimen cards, no numerals, no connectors. Its title and subtitle sit on the same dark band `process` gives its step cards, so the claim separates from what supports it by more than two greys. A card is generic — `title`, optional `subtitle`, and content that is either `points` or `text`, never both — and the item's `quoted` flag decides whether the element wraps every title in quotation marks (for prompts and replies) or leaves them plain (for filenames and names). `callouts` is the evidenced sibling of `keypoints`: the same numbered list, beside one screenshot pinned with the same numbers, so each row has something to point at. A point with no `pin` keeps its number and marks nothing, which is how a failing that a still cannot show still gets said. `showcase` and `callouts` are the ones that render a real image; its `src` is a `public/`-relative path with no leading slash, and an image with no `src` draws its alt text as a visible placeholder. Ground (light/dark) defaults per type in `slideTheme()`; override with an item `theme`.

## Structure

- `src/deck/DeckView.tsx` — deck shell: index state, keyboard/touch nav, header/footer chrome, slide transitions, Contents overlay.
- `src/components/Contents/Contents.tsx` — the floating Contents overlay with two tabs: **Outline** (nested text outline for reading the deck) and **Slides** (PowerPoint-style thumbnail grid). Open with the ≡ button or the `O` / `Esc` key.
- `src/slides/Slides.tsx` — the ten slide components + a dispatcher and outline helpers. A `divider` with no `list` (or an empty one) renders solo: same φ : 1 grid, bigger title. `marker` (`number` / `bullet` / `none`) and `split` (`golden` / `even` / `golden-flip`, the golden ratio and its two deviations) are taken by **both** `divider` and `keypoints` — the two archetypes are the same shape, a claim beside a list — and each is an authorable field and a designlab param on the deck screen, so a proportion can be tried before it is written in. Unset is `golden` on a `divider` and `even` on a `keypoints`, which is what each looked like before the fields existed; a divider's row padding also scales with the row count.
- `src/design/` — tokens (light + dark themes, terracotta accent), base, and self-hosted Geist / Geist Mono fonts.
- `src/lib/deck-ids.ts` — `DEFAULT_DECK` and `REFERENCE_DECK`, free of Vite so `scripts/lab-states.ts` can import them in Node rather than parsing them out of the source.
- `scripts/lab-states.ts` — runs under `tsx` and **imports** the decks, so the generator and the app read the same modules through the same contract.

## Conventions

- Prose fields take **inline Markdown**: `` `code` ``, `*emphasis*`, `[text](href)`, and `**word**`, which renders in the accent color rather than bold — that is the deck's one-accent-word rule. Block Markdown is deliberately not supported; headings and lists are what the archetypes are. `src/lib/text.tsx` owns the parser (`renderInline` to render, `stripMarks` for the plain string).
- Keep the accent to the one word / active mark per slide; grounds are warm paper (light) and near-black (dark), never pure white/black.
