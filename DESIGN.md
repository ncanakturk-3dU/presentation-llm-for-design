---
name: The Anti-Slop Framework
description: A JSON-driven WebGL particle deck where one bloom-lit field takes three modes — model, ambient, and image-slider plane — driven by six item types, and every item carries its own two-tone light.
colors:
  void: "#141613"
  scrim: "#0d0f0e"
  bone: "#f1ede2"
  bone-soft: "#cdccc0"
  bone-faint: "#9a9b8f"
  signal: "#e0592f"
  hairline: "#f1ede21f"
  hairline-soft: "#f1ede210"
  slider-well: "#0a0c0b"
typography:
  display:
    fontFamily: "Big Shoulders Text, Arial Narrow, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(48px, 8.2vw, 128px)"
    fontWeight: 700
    lineHeight: 0.96
    letterSpacing: "-0.012em"
  title:
    fontFamily: "Big Shoulders Text, Arial Narrow, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(38px, 6.6vw, 88px)"
    fontWeight: 700
    lineHeight: 0.96
    letterSpacing: "-0.012em"
  quote:
    fontFamily: "Big Shoulders Text, Arial Narrow, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(30px, 4.3vw, 66px)"
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: "-0.005em"
  stat-value:
    fontFamily: "Big Shoulders Text, Arial Narrow, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(44px, 6vw, 88px)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.01em"
  agenda-label:
    fontFamily: "Big Shoulders Text, Arial Narrow, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(20px, 2.6vw, 34px)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "0.01em"
  subtitle:
    fontFamily: "Big Shoulders Text, Arial Narrow, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(16px, 1.9vw, 22px)"
    fontWeight: 500
    lineHeight: 1.45
    letterSpacing: "0.01em"
  body:
    fontFamily: "Big Shoulders Text, Arial Narrow, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(16px, 1.85vw, 21px)"
    fontWeight: 500
    lineHeight: 1.46
    letterSpacing: "0.01em"
  base:
    fontFamily: "Big Shoulders Text, Arial Narrow, Helvetica Neue, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.2
  index:
    fontFamily: "IBM Plex Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.18em"
  agenda-num:
    fontFamily: "IBM Plex Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "13px"
    fontWeight: 500
    letterSpacing: "0.16em"
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.55
    letterSpacing: "0.28em"
rounded:
  pill: "999px"
  tick: "2px"
  frame: "8px"
spacing:
  sm: "8px"
  md: "12px"
  gutter: "16px"
  inset: "clamp(22px, 4.4vw, 60px)"
components:
  arrow:
    textColor: "{colors.bone}"
    rounded: "{rounded.pill}"
    size: "46px"
  arrow-hover:
    textColor: "{colors.bone}"
    backgroundColor: "rgba(241, 237, 226, 0.05)"
    rounded: "{rounded.pill}"
  arrow-disabled:
    textColor: "{colors.bone-faint}"
    rounded: "{rounded.pill}"
  rail-tick:
    backgroundColor: "{colors.bone-faint}"
    rounded: "{rounded.tick}"
    width: "16px"
    height: "2px"
  rail-tick-current:
    backgroundColor: "var(--accent)"
    rounded: "{rounded.tick}"
    width: "16px"
    height: "2px"
  slider-play:
    textColor: "{colors.bone-soft}"
    rounded: "{rounded.pill}"
    size: "34px"
  slider-dot:
    backgroundColor: "{colors.bone-faint}"
    rounded: "{rounded.tick}"
    width: "18px"
    height: "2px"
  slider-dot-current:
    backgroundColor: "var(--accent)"
    rounded: "{rounded.tick}"
    width: "18px"
    height: "2px"
  slider-frame:
    backgroundColor: "{colors.slider-well}"
    rounded: "{rounded.frame}"
---

# Design System: The Anti-Slop Framework

## Overview

**Creative North Star: "Instrument."**

A deep-graphite instrument, never lit and never pure black. The whole stage is one full-bleed WebGL particle field — 80,000 fine vertices — driven entirely from `public/content.json`. There is no hardcoded deck: a `meta` block names the mark, source, and opening hint, and an `items` array of typed entries supplies every slide. Each item declares a `type` — one of six: `category`, `point`, `slider`, `quote`, `agenda`, `stat` — and a saturated two-tone pair (`colorA`/`colorB`) that runs as a gradient across the form and glows through a bloom pass, so each idea arrives in its own light. The interface reads as a precision tool laid over that light: hairline rules, mono micro-labels, and current-state marks that pick up the active item's color.

The one field takes three **modes**, not one per type — `type` maps to a mode in App.jsx (`FIELD_MODE = { slider: 'plane', category: 'ambient', quote: 'ambient' }`, everything else defaults to `'model'`). A **model** mode field (`point`, `agenda`, `stat`) is a full-opacity 3D shape offset right of center. An **ambient** mode field (`category`, `quote`) is a dim (30% opacity) centered shape behind centered copy, used as a divider or a pull-quote backdrop. A **plane** mode field (`slider`) morphs the same cloud into a flat plane sized to the image panel, colored in the item palette, with an edge-alpha falloff so it reads as a tile-map dust halo dissolving from the image edges into the background. The field is continuous across items: group position and scale are lerped every frame and the shape morph, colors, opacity, and plane-mode are GSAP-tweened over 1.9s.

The world refuses two defaults at once: the bulleted title-card deck, and the generic dashboard-slop the argument names. Contrast is high and typographic, so the type never fights the canvas. Motion is restrained and physical — nothing eases in, everything settles. Because the deck argues for anti-slop craft, its chrome carries none of the slop it describes: no gradient wash as DOM decoration, no card grids, no floating pills, no glass, no bordered container stacks, no outer drop shadows. Color lives in the WebGL field, not in the chrome. Chrome is bone ink laid directly over the canvas through a directional scrim, pinned to the margins.

**Key Characteristics:**
- One full-bleed particle field (80,000 vertices), JSON-driven, is the entire stage; chrome lives at the margins.
- One field, three modes keyed to item `type`: `model` shape, dim `ambient` divider, `slider` image-halo `plane`. Six types fold onto those three modes.
- Each item owns a saturated `colorA`→`colorB` pair; the field glows it through additive blending and bloom.
- `--accent` follows the active item's `colorA` onto the current-state marks (and the quote attribution and agenda numbers); the fixed terracotta only backs `::selection`.
- Bone ink on warm graphite; condensed display type (Big Shoulders Text) against one tracked mono micro-layer (IBM Plex Mono).
- Hairline, pill, and quiet-block DOM vocabulary only — no glass, no bordered stacks, no decorative surface shadow.
- Everything settles on `cubic-bezier(0.16, 1, 0.3, 1)`; nothing eases in.

## Colors

Bone ink on deep graphite for the chrome; a vivid, saturated two-tone pair per item that lives in the WebGL field and, at the current-state marks only, tints the chrome through `--accent`.

### Primary
The palette is per-item and data-driven, not a fixed house set. Each item carries a `colorA` → `colorB` pair in `content.json`. In the field, the shader mixes `colorA` at the base toward `colorB` across the form (by vertical position and per-particle seed, `vMix`) and cross-fades both over the 1.9s morph. `colorA` is also handed to the chrome as `--accent`. The shipped `content.json` is placeholder content; its pairs (gold→ember `#ffc44d`→`#ff7d38`, teal→aqua `#1fd6b0`→`#54e6ff`, magenta→gold `#ff4db8`→`#ffd24d`, amber→ember `#ffb14d`→`#ff6a3d`, cyan→periwinkle `#22c1ff`→`#6a8bff`, gold→cream `#ffd24d`→`#fff0c0`, violet→pink `#a24bff`→`#ff5ecb`, red→orange `#ff3b47`→`#ff8a3c`) are examples of the strategy, not canonized brand colors. The App-level fallback when an item omits color is `#ffc44d` → `#ff7d38`.

### Tertiary
- **Terracotta Signal** (#e0592f, `--signal`): not a house accent. It backs `::selection` only, and is the CSS fallback for `--accent` before an item color is applied.

### Neutral
- **Void** (#141613, `--void`): the graphite ground for `html`/`body`/`.app`. Deliberately warm-dark, never pure `#000`.
- **Scrim** (#0d0f0e): the darkest tone — the Canvas WebGL clear color and the base of the overlay scrim gradients that seat copy over the field.
- **Slider Well** (#0a0c0b): the near-black backing behind a slider image frame before its image paints.
- **Bone** (#f1ede2, `--bone`): primary ink — titles, quote text, stat values, agenda labels, and active index number.
- **Bone Soft** (#cdccc0, `--bone-soft`): secondary ink — summary and subtitle copy, resting slider play glyph.
- **Bone Faint** (#9a9b8f, `--bone-faint`): tertiary ink — mono meta, source line, position total, captions, stat labels, hint/credit, resting ticks and dots, disabled arrows.
- **Hairline** (#f1ede21f, ~12% bone) and **Hairline Soft** (#f1ede210, ~6% bone): inset ring strokes for controls; the only "borders" in the system.

### Named Rules
**The Accent-Follows-Item Rule.** There is no fixed chrome accent. The active item's `colorA` is set on the overlay as `--accent` (inline style) and appears only on the current-state and item-keyed marks — the current rail tick, the chapter label, the current slider dot, the quote attribution, and the agenda numbers. Everything else in the chrome stays bone and graphite. The accent shifts per item; it is never a surface, never a fill behind copy, never running body text.

**The Warm-Dark Rule.** The ground is graphite (#141613 / clear #0d0f0e), never pure black; chrome ink is bone (#f1ede2), never pure white. Neutrals are tinted warm. Item color is saturated on purpose — it lives in the field, where bloom carries it.

## Typography

**Display Font:** Big Shoulders Text (with Arial Narrow, Helvetica Neue, Arial fallback) — self-hosted woff2 (latin + latin-ext), variable weight 100–900, `font-display: swap`.
**Body Font:** Big Shoulders Text — the same condensed face carries copy and the 14px document base (`body` font-size, line-height 1.2).
**Label/Mono Font:** IBM Plex Mono (with ui-monospace, SFMono-Regular, Menlo fallback) — self-hosted woff2, weight 500 only.

**Character:** A tall, condensed, high-confidence display face doing double duty for titles and copy, cut against a single precise mono micro-layer. The pairing reads as a working instrument's panel, not a marketing page.

### Hierarchy
- **Display** (700, `clamp(48px, 8.2vw, 128px)`, line-height 0.96, tracking -0.012em, `max-width: 16ch`, centered): the `category` divider title. Drops to `clamp(40px, 12vw, 76px)` / `max-width: 14ch` below 900px.
- **Title** (700, `clamp(38px, 6.6vw, 88px)`, line-height 0.96, tracking -0.012em, `text-wrap: balance`): the `point`/`slider`/`agenda`/`stat` slide title, lower-left, with a soft legibility `text-shadow`.
- **Quote** (500, `clamp(30px, 4.3vw, 66px)`, line-height 1.12, tracking -0.005em, `max-width: 20ch`, centered, `text-wrap: balance`): the `quote` pull-quote (`.quote__text`), wrapped in curly quotes via CSS `::before`/`::after` (`\201C`/`\201D`). Below 900px it pins to `clamp(26px, 7vw, 42px)` / `max-width: 18ch`.
- **Stat Value** (700, `clamp(44px, 6vw, 88px)`, line-height 0.95, tracking -0.01em, `font-variant-numeric: tabular-nums`): the `stat` figure (`.stat__value`). Below 900px it pins to `clamp(40px, 13vw, 64px)`.
- **Agenda Label** (600, `clamp(20px, 2.6vw, 34px)`, line-height 1.1, tracking 0.01em): the `agenda` row text (`.agenda__label`). Below 900px it pins to `clamp(19px, 5.4vw, 28px)`.
- **Subtitle** (500, `clamp(16px, 1.9vw, 22px)`, line-height 1.45, tracking 0.01em, max 52ch): the centered `category` supporting line. Below 900px it pins to 16px / max 40ch.
- **Body** (500, `clamp(16px, 1.85vw, 21px)`, line-height 1.46, tracking 0.01em, max 42ch): the `point`/`slider` summary copy (46ch below 900px, 16px below 560px).
- **Index** (Mono 500, 12px, tracking 0.18em): the position readout `01 / 05`, active number in bone, total in bone-faint.
- **Agenda Number** (Mono 500, 13px, tracking 0.16em, `min-width: 2.4ch`, `--accent`): the numbered prefix on each `agenda` row (`.agenda__num`).
- **Label** (Mono 500, 11px, line-height 1.55, tracking 0.28em, UPPERCASE — the `--type-micro` token): the single micro-layer — deck mark, source, chapter, credit, hint, slider caption, quote attribution (`.quote__by`, `--accent`), stat label (`.stat__label`, bone-faint), and status messages.

### Named Rules
**The One Micro-Layer Rule.** All small text is the same mono treatment: 11px, weight 500, uppercase, tracked 0.28em (`--type-micro` + `--tracking-micro`). Marks, chapters, captions, credits, quote attributions, stat labels, and status copy never diverge from it; color may shift (the chapter label and quote attribution pick up `--accent`, stat labels stay bone-faint) but the treatment holds. Two mono readouts are the deliberate exceptions that step outside the micro-layer: the position index (12px, 0.18em) and the agenda number (13px, 0.16em, `--accent`).

## Layout

Full-viewport fixed stage (`.app`, `inset: 0`, `overflow: hidden`); the canvas is layer 0, the overlay layer 2, and the overlay is `pointer-events: none` except its controls. Chrome pins to the four margins with a shared `--inset` of `clamp(22px, 4.4vw, 60px)`: deck mark top-left, position readout + chapter top-right, controls spanning the bottom.

The stage layout is keyed by item type. The default `.stage` seats a title block lower-left at `bottom: clamp(92px, 15vh, 156px)`, max-width `min(660px, 64vw)` — this carries `point`, `slider`, `agenda`, and `stat`, so the drafted form breathes right of center. The `category` and `quote` stages center instead (shared `.stage--category, .stage--quote` block): `top: 50%` translated, full-width with `padding: 0 clamp(24px, 8vw, 160px)`, text centered, behind a soft radial scrim vignette (`::before`). A `slider` adds a right-hand image panel pinned `top`/`bottom` `clamp(96px, 15vh, 150px)`, `right: var(--inset)`, `width: min(52vw, 780px)`; the particle plane is computed to match this rect via `panelWorldRect`. The `agenda` list is a flex column (gap `clamp(10px, 1.4vh, 18px)`) of `.agenda__row` (mono number + display label, baseline-aligned, `--space-gutter` gap); the `stat` block is a `flex-wrap` row (gap `clamp(28px, 4vw, 64px)`) of `.stat` value/label stacks.

The spacing rhythm runs on a small fixed scale — 8 / 12 / 16px (`--space-sm`/`--space-md`/`--space-gutter`) — with `--inset` as the responsive page margin. Below 900px the particle group recenters, lifts (`y 0.55`), and shrinks (scale 0.82 for model mode); the source line hides; the scrim flips to a bottom-up gradient; the slider panel spans full width at 40vh above the title; quote, agenda, and stat type step down to their mobile clamps. Below 560px summary type pins to 16px and the chapter clamps to 42vw. Short viewports (`max-height: 560px`) lift the title block. A horizontal swipe over 64px advances/retreats; arrows, space/enter, page keys, and Home/End drive the index.

## Elevation & Depth

Two distinct depth models, one per layer. The DOM chrome is flat: no drop shadows on surfaces. Separation there is tonal and atmospheric — the graphite ground, a directional overlay scrim (radial + linear gradients of the ground color) that seats copy over the busiest part of the field, a soft radial vignette behind category and quote copy, and a 1px inset hairline ring on controls. Type over the canvas carries a soft blur `text-shadow` purely for legibility, never for lift.

The WebGL field has its own depth: perspective, `AdditiveBlending`, and a bloom post-process pass (`@react-three/postprocessing` EffectComposer Bloom, intensity 1.15, luminanceThreshold 0.1, luminanceSmoothing 0.9, radius 0.72, mipmapBlur) that lets the saturated item colors glow where particles pile up. This glow belongs to the field only; it is never emulated on a DOM surface.

### Shadow Vocabulary
- **Hairline inset ring** (`box-shadow: inset 0 0 0 1px var(--hairline)`): the resting edge of nav arrows, the slider play button, and the slider image frame; the only "border" device. Hover shifts the ring to `bone-faint`; disabled arrows drop it to `hairline-soft`.
- **Legibility text-shadow** (`0 2px 34px rgba(13,15,14,0.55)` on titles; `0 2px 30px rgba(13,15,14,0.6)` on quote text; `0 2px 26px rgba(13,15,14,0.55)` on stat values; `0 1px 24px rgba(13,15,14,0.5)` on summaries/subtitles; `0 1px 20px rgba(13,15,14,0.5)` on agenda labels): seats ink over the live field. Not for depth.

### Named Rules
**The No-Surface-Shadow Rule.** DOM surfaces never cast outer shadows. Separation comes from tone, the scrim, and 1px hairline insets. Any outer `box-shadow` on a container is off-world. Glow is a property of the field, produced by bloom, not of the chrome.

## Shapes

Three DOM radii. Controls are fully round pills (`999px`, `--rounded-pill`) or hairline ticks and dots with a 2px corner (`--rounded-tick`); the slider image frame is the one mid-radius surface at `8px`. Focus rings round at 2px. There are no cards — the DOM vocabulary is hairline, pill, tick, and one framed image well.

The recurring silhouette is the particle form itself: ten mathematical geometries in `shapes.js`, each richer than a bare primitive — a Fibonacci-shell sphere, a cubic lattice grid, a swirled gaussian cloud, a tube torus, faceted polyhedra with edge emphasis (icosahedron ~55% edge samples, octahedron ~60%), a multi-wind torus knot (P=3, Q=7), a DNA double-helix with rungs, a four-arm galaxy spiral with a core bulge, and a supernova burst with a dense core and radial streaks. Each form is fit to a per-shape radius and sampled to the fixed 80,000-vertex `Float32Array` so any form can morph into any other; the registry is structured so external GLTF/GLB vertex data can replace a shape without touching item or state logic. The `slider` type (plane mode) replaces the shape target with a flat plane (`buildPlane`) sized to the image panel, with a 1.26× halo and a per-vertex `aEdge` alpha falloff (`smoothstep` over the outer 20%).

## Components

### Navigation
- **Arrows (prev/next):** 46px round pills (`999px`) with a 1px inset hairline ring; bone chevrons drawn as inline stroke SVG (`stroke-width: 1.6`, round caps), 19px. Hover shifts the ring to bone-faint and lays a 5%-bone wash; active nudges down 1px; disabled drops to opacity 0.32 with the soft ring and no wash. Transitions run 160ms (`--dur-quick`) on the settle ease.
- **Tick rail:** one 16×2px bar per item (2px corner), bone-faint at 0.5 opacity, in a 22×44px button hit target with `aria-current`. Past ticks lift to 0.75; the current tick scales to `scaleX(1.85)`, turns `var(--accent)`, and goes fully opaque. Hover brings a tick to full opacity.
- **Keyboard/touch:** arrows, space/enter (unless a button is focused), page keys, Home/End drive the index; a 64px horizontal swipe advances.

### Marks & Readouts
- **Deck mark (top-left):** two stacked mono micro-labels from `meta` — `mark` in bone, `source` in bone-faint (source hides under 900px). `meta.mark` also sets `document.title`.
- **Position (top-right):** mono index `NN / NN` (active bone, total faint) over a chapter label rendered in `var(--accent)`, cross-faded on item change; falls back to the item `type` when no chapter is set.

### Content Blocks
- **Quote (`quote` type):** a centered `.quote` blockquote holding `.quote__text` (the Quote ramp, bone, curly-quoted via `::before`/`::after`) and an optional `.quote__by` attribution in the mono micro-layer, `--accent`-colored, 28px below. Field mode is `ambient`, same as `category`.
- **Agenda (`agenda` type):** a numbered `.agenda` flex column of `.agenda__row`, each a mono `.agenda__num` (13px, 0.16em, `--accent`, zero-padded via `pad()`) plus a display `.agenda__label` (Agenda Label ramp, bone). Reads `points[]` (array of strings). Field mode `model`.
- **Stat (`stat` type):** a "by the numbers" `.stats` flex-wrap row of `.stat` stacks, each a display `.stat__value` (Stat Value ramp, tabular-nums, bone) over a mono `.stat__label` (micro-layer, bone-faint, max 18ch). Reads `stats[]` (array of `{value, label}`). Field mode `model`.

### Image Slider (`slider` type)
- **Frame:** an 8px-radius well (`#0a0c0b`) with a 1px inset hairline ring, `object-fit: cover` image cross-fading (Framer, 0.8s settle, slight scale-in). Panel is `pointer-events: none`; only the footer controls take input.
- **Footer:** a mono caption (bone-faint) plus controls — a 34px round pill **play/pause** button (inline SVG glyph, bone-soft → bone on hover, `aria-pressed`) and a row of **dots** (18×2px ticks in 24×44px targets, bone-faint at 0.5; current is `scaleX(1.6)` in `var(--accent)`, `aria-current`). Autoplay advances every 4400ms; choosing a dot or pausing stops it.

### Particle Field (signature)
A single `THREE.Points` cloud of 80,000 vertices on a custom `ShaderMaterial` under `THREE.AdditiveBlending`, `depthWrite`/`depthTest` off, transparent, dpr cap [1, 1.75], camera at z 6.2 / fov 45. `uSize` 4.6; the fragment shader draws a soft round dot, mixes `uColorA`→`uColorB` by `vMix`, applies per-particle brightness (`vBright`, 0.55–1.45) and a slow sine twinkle, and outputs at alpha 0.42 so bloom does the lifting. Per-vertex `uDrift` (0.045) keeps the form breathing.

One field, three modes selected by App.jsx `FIELD_MODE[item.type]` (default `'model'`) and passed as the `mode` prop:
- **model** (`point`, `agenda`, `stat`): full opacity (`uOpacity` 1), 3D shape, group offset x 1.0 desktop (recentered/lifted/0.82 on narrow), slow y-spin (0.05/s) and damped pointer tilt.
- **ambient** (`category`, `quote`): dim (`uOpacity` 0.3), centered, scale 1.05, same spin/tilt.
- **plane** (`slider`): full opacity, the cloud morphs into a flat plane sized to the image panel (`panelWorldRect` from the live viewport), positioned over the panel, spin damped to 0 and tilt off, with the `aEdge` falloff (`uPlaneMode` 1) making the palette dissolve from the image edges.

Item changes retarget the geometry and GSAP-tween `uProgress` 0→1 over 1.9s (`power2.inOut`) while `uColorA`/`uColorB` cross-fade and `uPlaneMode` tweens over the same window; `uOpacity` tweens over 0.9s (`power2.out`); group position and scale lerp every frame at 0.08.

### Named Rules
**The One-Field-Three-Modes Rule.** There is exactly one particle system. Item `type` selects a mode through `FIELD_MODE` (`model` shape / dim `ambient` divider / `slider` halo-`plane`); six types fold onto those three modes and none spawns a second field or swaps to DOM imagery for the shape. The slider's crisp image is DOM; the field remains the same 80,000-vertex cloud, morphed to a plane.

**The Bloom-Lit Field Rule.** The field renders under `AdditiveBlending` plus a bloom pass, so saturated item colors glow where vertices overlap. Color is a scene property carried as item data (`colorA`/`colorB`) and cross-faded on morph — never a flat DOM fill.

## Do's and Don'ts

### Do:
- **Do** drive every slide from `content.json` — a `meta` block and a typed `items` array; keep the field and chrome reading item fields (`type`, `title`, `summary`/`subtitle`, `quote`/`attribution`, `points`, `stats`, `chapter`, `colorA`/`colorB`, `shape`, `images`), never hardcoded slides. `_allowed.type` lists all six types.
- **Do** map any new item `type` onto one of the three field modes via `FIELD_MODE` (default `model`); never add a fourth field behavior.
- **Do** drive both the field and the one chrome accent from the active item's pair: `colorA`→`colorB` across the form, `colorA` on the current-state and item-keyed marks via `--accent`.
- **Do** keep the ground graphite (#141613 / clear #0d0f0e) and chrome ink bone (#f1ede2); never pure `#000`/`#fff`.
- **Do** render the field under additive blending and bloom so the saturated item color glows; keep glow in the field, not on chrome.
- **Do** render all small text as the one mono micro-layer: 11px, 500, uppercase, tracked 0.28em; the index (12px/0.18em) and agenda number (13px/0.16em) are the only sanctioned deviations.
- **Do** separate DOM with tone, the scrim, and 1px hairline insets; use `text-shadow` only for legibility over the field.
- **Do** settle every transition on `cubic-bezier(0.16, 1, 0.3, 1)` (~160ms controls, ~320ms content, 1.9s morph); animate only transform/opacity.
- **Do** honor `prefers-reduced-motion` (freeze `uTime` so twinkle/drift stop, kill spin/tilt, snap morphs and text, stop slider autoplay) and `prefers-contrast: more` (lift bone-soft/faint and hairline).
- **Do** ship the loading, error, empty (`no items`), and render-error (ErrorBoundary) states as centered mono status lines.

### Don't:
- **Don't** reintroduce a single fixed house accent for the chrome — the state marks follow the active item's hue.
- **Don't** put item color on a chrome surface or behind running text; its home is the field (accent tints only marks, the quote attribution, and agenda numbers).
- **Don't** add glass, bordered container stacks, cards, or outer drop shadows on DOM surfaces; the image frame's 8px well is the only framed surface.
- **Don't** ease anything in; nothing enters with `ease-in`.
- **Don't** spawn a second particle system or swap the shape for a DOM image — one field, three modes keyed to item `type`.
- **Don't** reintroduce removed tokens (`--void-lift`, `--signal-deep`, `--scrim`, `--space-xs`, `--space-row`, `--space-margin`, `--space-xl`); document only tokens defined in `tokens.css` now.
