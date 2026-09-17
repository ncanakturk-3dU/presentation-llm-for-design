---
target: the process slide (three-phases)
total_score: 10
max_score: 20
na_heuristics: 3,5,7,9,10
p0_count: 2
p1_count: 2
target_identity: "file:/Users/finde/Work/Web/presentation-llm-for-design/src/slides/Slides.tsx"
target_fingerprint: "sha256:7d2a8749de33c1a867e13f92aebf66df60a41b7aed1ae301c46cf0eb1d44f139"
target_path: /Users/finde/Work/Web/presentation-llm-for-design/src/slides/Slides.tsx
timestamp: 2026-09-17T14-14-13Z
slug: src-slides-slides-tsx
---
Method: dual-agent (A: design review · B: detector + rendered-DOM measurement)

Target: the `process` archetype — `ProcessSlide` in `src/slides/Slides.tsx`, `.process*` in `src/slides/slides.css`, as rendered by `three-phases` in `content/version_1.ts` (slide 17 / 23). Surface mode: Read — a projected slide a presenter talks over.

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Deck index is right; the slide gives the room no cue which phase the presenter is on — all 12 points live at once. |
| 2 | Match System / Real World | 2 | Title's accent word is **loop**; the diagram draws a line that stops at 03. The picture contradicts the sentence. |
| 3 | User Control and Freedom | n/a | Non-interactive slide; navigation belongs to the deck shell. |
| 4 | Consistency and Standards | 2 | Breaks three of the deck's own rules: Measured-Alignment (zero cross-column datum), Faint-Is-Not-Text (`--ink-faint` carries the sequence), and the `min-height` guess DESIGN.md warns against. |
| 5 | Error Prevention | n/a | Static slide; authoring errors already prevented by `content/types.ts`. |
| 6 | Recognition Rather Than Recall | 2 | The audience must reconstruct which list belongs to which card across a gap, and remember what teal/blue/ink mean. |
| 7 | Flexibility and Efficiency | n/a | No interaction surface. |
| 8 | Aesthetic and Minimalist Design | 1 | 12 point rows, 6 code chips, 3 hues, a stair, 2 connectors — and ~35% empty paper. |
| 9 | Error Recovery | n/a | No error states. |
| 10 | Help and Documentation | n/a | The presenter is the documentation. |
| **Total** | | **10 / 20 applicable** | Needs work |

## Design Specificity Verdict

**LLM assessment.** Split. The engineering is authored for this deck — `--steps` driven from content, `--stair` self-limiting at `132px / --steps`, a phone branch that re-thinks the card. The composition is category-interchangeable: three staggered cards in a row with numbered chips and connector arrows is the most generic diagram in the slide-deck category. Specific content and specific code inside a generic layout. `callouts`, `cards` and `codeui` in this same deck clear the bar; this one does not.

**Deterministic scan.** `impeccable detect --json src/slides/Slides.tsx` → `[]`, exit 0, zero findings. A rendered-DOM pass at 1440x900 returned 2: `low-contrast` (white on `#2f8f86`, 3.9:1) and `tight-leading` (line-height 1.20). axe-core 4.12.1 at 393x852: 1 violation (`meta-viewport`, document-level, not this archetype), 25 passes, 1 incomplete — axe could not resolve the chip and `icode` backgrounds through a pseudo-element, so axe alone would have missed the real contrast failure.

**Measured, 1440x900:** step titles 15.84px at 13.3-15.4:1; points 14.4px at 6.43:1; `icode` chips 12.67px at 5.49:1; `--stair` 31.67px (offsets 0 / 31.68 / 63.36); connector box 23.03 x 31.67px, declared 1.5px but rendered aliased at ~1.18 CSS px perpendicular; no clipping at either viewport; `typecheck` and `lab:states --check` both exit 0.

**Two measured WCAG failures:**
- 1.4.3 — `.process__step[data-tone='teal']` chip: white on `#2f8f86` = **3.89:1**, needs 4.5. Nearest hue-preserving pass `#2b827a` (4.58:1). Tones 02 and 03 pass (5.27, 13.93).
- 1.4.11 — connector hairline `#8c8d92` on paper `#f3f2ee` = **2.96:1**, fails by 0.04, and renders thinner than declared.

**False positive:** `tight-leading` — no point wraps at either viewport (longest `li` is 416.5px in a 420.5px column), so leading cannot hurt text that never wraps. Latent risk if a point grows, not a rendered defect.

## Overall Impression

The two complaints have one root cause each, and both are structural, not cosmetic.

Hierarchy: the dark card is a **heading bar, not a container**. `Slides.tsx:297` renders `<ul className="process__points">` as a *sibling* of `.process__card`, so the strongest closed shape on the slide encloses a number and one word, while the twelve lines that carry the argument sit on bare paper belonging to nobody. Common region beats proximity; the boundary closes above the content it governs.

The arrow: a 1.18px line at 2.96:1 with no arrowhead and no anchor marker at either end. A line with two unmarked ends reads as a crop mark, not a vector. It is also the fourth encoding of an order the numerals, the reading direction and the stair already state — and the weakest of the four.

Underneath both: at 15.84px, the three phase names — the whole takeaway — are 1.9% of screen height against a ~2.5% floor for a projected room. The back row gets "three dark bars, descending."

## What's Working

1. **The step chip.** 26px, 7px radius, zero-padded mono numeral in solid tone. Reads as a counter at distance and matches the badge vocabulary without duplicating it. It should get bigger, not go away.
2. **The flow survives its own variance.** `--steps` from content, `--stair` capped so a five-step flow drops no further than a three-step one, reasoning in the comment.
3. **The phone branch already found the right design.** `.process__card { flex-direction: row; align-items: center; min-height: 0 }` — chip beside the phase name, points beneath, stair 0, connector hidden. The 393px render reads better than the 1440px one.
4. **The copy is sharp.** "Once per project, not per feature" and "No visual work until the shape is agreed" are the register this deck writes in.

## Priority Issues

**[P0] The card does not contain its points.** The near-black 420x112 rectangle holds a chip and one word; `min-height` plus `justify-content: space-between` leaves ~50px of dark void inside it. Fix: move the `<ul>` inside `.process__card`; split into `.process__cardhead` (the tinted band, chip beside title, the phone treatment promoted to desktop) and a `--panel` body holding the points; delete `min-height`, `justify-content: space-between` and the 14px gap.

**[P0] Nothing but the title is legible from the back row.** `.process__steptitle` → `clamp(18px, 1.55vw, 24px)`; `.process__points li` → `clamp(15px, 1.25vw, 19px)`. Affordable only once the point count drops.

**[P1] Twelve points and six code chips, one slide before the slide that owns the commands.** `command-chain` lists all seven commands in a code well *and* a seven-row table. Slide 17 spends slide 18's material, and the filled grey `icode` chips out-shout the 15.84px phase titles. Fix: cut each phase to two points in `content/version_1.ts` and strip the command names; re-run `npm run lab:states`.

**[P1] The stair reads as misalignment at three steps.** 31.67px is 28% of a 112px card — repeated twice, that is "these didn't line up," not "these descend." Four repetitions read as a pattern; three do not, so the change is worse on the deck that ships than on the reference deck. It also destroys the only cross-column datum. Fix: either `--stair: 0` and take the diagonal from the composition, or make it unambiguous (≥ one card height) — nothing in between.

**[P2] The connector is a semantic element in a decoration colour.** Fails 1.4.11 at 2.96:1, renders at ~1.18px, no head, no anchors. Fix, in order: delete it; or draw one continuous trajectory on `.process__flow::before` from the first chip centre to the last at the stair angle, 2px, `color-mix(in srgb, var(--ink) 30%, transparent)`, cards on top; or keep per-gap arrows at 2.5px in a 45%-ink mix with a 7px chevron at the receiving end.

**[P2] The tone ramp de-escalates and encodes nothing.** teal → blue → ink means phase 3's chip is the same near-black as every card fill, so **Hardening** — the phase the argument ends on — reads as disabled. Teal also fails contrast at 3.89:1. Fix: drop `tone` from all three steps (they are equals), or reverse the ramp so it brightens toward the end; if teal stays, `#2b827a`.

**[P3] The title promises a loop the diagram contradicts.** Either draw the return — one accent arc from 03 back to 01, which earns the accent word and gives the slide a memorable shape — or change the accent word to **three**.

## Persona Red Flags

**The person in the back row.** Gets the title and three dark bars, then stops. Cannot read a phase name (1.9% of screen height), cannot read a point (1.3%), cannot see the connector at all (1.18px at 2.96:1). Leaves able to say the presenter had a pipeline, unable to name its three phases.

**The presenter talking over it.** No cue to stand on — no reveal, no active state, so the room reads ahead down column three while they are still on phase one. Nothing large enough to point at. And it spends the next slide's material, so they either repeat themselves or reach their best slide with the punchline used.

## Minor Observations

- `ProcessItem` has no `note` field, so this archetype alone cannot carry the lead-in line every neighbour can.
- `.process__card`'s `min-height: clamp(88px, 10.5vw, 108px)` is exactly the guessed height DESIGN.md's Measured-Alignment Rule warns about.
- Two counter sizes for one job: `.process__chip` 26px vs the keypoint badge 40px.
- The connector's `width` duplicates the flow's `gap` value instead of referencing it; change the gap and the line silently detaches. Hoist to `--flow-gap`.
- Point text sits 3px right of the step title, and bullets 4px inside the card's left edge — no shared left datum.
- `sample.ts` uses `n: "1"`, `version_1.ts` uses `"01"`. Zero-padded is better in a 26px chip; the reference deck should adopt it.

## Questions to Consider

1. The title says loop and the picture is a line that stops. Which one is wrong — and if it is the picture, why is the composition horizontal at all, when a loop is the one shape a rail can close and a row of cards can never draw?
2. If the room takes one thing from this slide, is it Initial → Iteration → Hardening, or the command names? The type currently makes the commands win, three seconds before the slide that lists all seven properly.
3. The 393px render already solved this. What does 1440px buy that is worth giving it up?
