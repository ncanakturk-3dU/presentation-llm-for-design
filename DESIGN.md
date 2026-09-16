---
name: LLM for Design
description: A JSON-driven presenter's deck of eight editorial slide archetypes on one grid and one type system, each archetype grounded light or dark, unified by a single terracotta word per slide.
colors:
  signal: "#d9552a"
  signal-dark: "#ec6b39"
  signal-ink: "#ffffff"
  signal-ink-dark: "#12100e"
  paper: "#f3f2ee"
  paper-2: "#ebe9e3"
  ink: "#17181b"
  ink-soft: "#56575c"
  ink-faint: "#8c8d92"
  panel: "#ffffff"
  panel-2: "#f7f6f2"
  night: "#0e0f11"
  night-2: "#16171a"
  ink-dark: "#f3f2ee"
  ink-soft-dark: "#a7a8ad"
  ink-faint-dark: "#6d6f75"
  panel-dark: "#17181b"
  panel-2-dark: "#1d1e22"
typography:
  display:
    fontFamily: "Geist, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "clamp(40px, 6vw, 90px)"
    fontWeight: 600
    lineHeight: 1.0
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Geist, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "clamp(32px, 4.4vw, 58px)"
    fontWeight: 600
    lineHeight: 1.0
    letterSpacing: "-0.024em"
  title:
    fontFamily: "Geist, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "clamp(30px, 4vw, 52px)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.022em"
  body:
    fontFamily: "Geist, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "clamp(15px, 1.15vw, 18px)"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.14em"
  numeral:
    fontFamily: "Geist, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "clamp(88px, 13vw, 188px)"
    fontWeight: 600
    lineHeight: 0.8
    letterSpacing: "-0.04em"
rounded:
  sm: "6px"
  md: "10px"
spacing:
  gap: "clamp(16px, 1.5vw, 24px)"
  pad-y: "clamp(24px, 3vw, 46px)"
  pad: "clamp(34px, 4.6vw, 84px)"
components:
  accent-word:
    textColor: "{colors.signal}"
    typography: "{typography.title}"
  menu-button:
    textColor: "{colors.ink}"
    rounded: "8px"
    size: "34px"
  keypoint-badge:
    textColor: "{colors.signal}"
    rounded: "999px"
    size: "40px"
  spec-card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "clamp(14px, 1.4vw, 20px)"
  chip:
    backgroundColor: "{colors.panel-2}"
    textColor: "{colors.ink-soft}"
    rounded: "999px"
    padding: "5px 11px"
  contents-thumb:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
---

# Design System: LLM for Design

## Overview

**Creative North Star: "The Well-Set Conference Talk."**

One presenter's deck built as a precise editorial system, not a bullet template and not the all-dark WebGL demo that preceded it. Eight distinct slide archetypes — cover, section divider, key-points, before/after two-column, process/workflow, code + UI, table/matrix, and quote/closing — ride a single grid, a single Geist type system, and a single terracotta signal. Each slide states one idea in the layout that idea deserves, and the accent marks the one word that carries it. It reads like a conference talk that was actually art-directed: generous margins, hairline rules, large muted section numerals, numbered structures, and a mono eyebrow labeling each idea.

The stage is a flat, full-viewport frame (`.deck`) with minimal chrome pinned to the top edge only — a menu button (≡) and wordmark upper-left, a page index upper-right — and one live slide beneath, cross-faded by Framer Motion. There is no footer and no chrome eyebrow; the page index is always `NN / NN` (current over total), never per-slide-overridden. Ground is assigned per archetype: cover and key-points sit on near-black night, everything else on warm paper, and any slide can override with its own `theme`. The two themes are one token set (`--accent`, `--ink`, `--ground`, `--panel`…) reassigned under `[data-theme]` on the deck, so a slide flips light↔dark by swapping one attribute and the deck color-transitions across it (420ms). WebGL appears exactly once: a slowly rotating dotted-particle sphere (React Three Fiber) on the cover, and nowhere else.

The world refuses generic slop and heavy ornament alike. Color lives almost entirely in the neutral ink-on-paper (or ink-on-night) surfaces; the terracotta signal is the only chromatic voice, and it is rationed to a single highlighted word plus the mono structural marks and active state. Depth is tonal and hairline by default; real elevation shadows appear only where the interface genuinely lifts off the page — the Contents drawer that slides in from the left.

**Key Characteristics:**
- Eight editorial archetypes on one grid and one Geist type system; JSON drives every slide from a static import of `content/sample.json` (versioned decks live in `content/`).
- Ground assigned per archetype via `slideTheme()` (cover + keypoints dark, rest light), overridable per item with `theme`; one token set flipped by `[data-theme]`.
- Exactly one terracotta word per slide, authored as `**word**` and rendered as `.accent`.
- Warm neutrals only — paper `#f3f2ee`, night `#0e0f11`, never pure `#000`/`#fff`; ink tinted warm.
- Geist grotesk carries display and body; Geist Mono carries page index, code, the slide eyebrow, and micro-labels.
- Flat and hairline by default; elevation shadow only on the floating Contents drawer.
- Everything settles on `cubic-bezier(0.22, 1, 0.36, 1)`; nothing eases in.

## Colors

Warm neutral ink on paper by day and on night by archetype, with one terracotta signal as the sole chromatic voice. Every neutral is tinted warm; nothing is pure black or white.

### Primary
- **Terracotta Signal** (light `#d9552a`, dark `#ec6b39`; `--accent`): the one accent. It marks the single highlighted word per slide, the mono slide eyebrow (`.kicker`), divider/badge numerals and control labels, the current item in the Contents drawer, `::selection`, and the focus ring. It warms slightly in dark theme so it holds against night. The contract named `#DD5C2B`; the build shipped `#d9552a`/`#ec6b39` and the build is canonical.
- **Signal Ink** (light `#ffffff`, dark `#12100e`; `--accent-ink`): foreground laid on a filled signal (the `::selection` highlight).

### Neutral (Light — default `:root, [data-theme='light']`)
- **Paper** (`#f3f2ee`, `--ground`) and **Paper 2** (`#ebe9e3`, `--ground-2`): the warm page and its slightly deeper wash.
- **Ink** (`#17181b`, `--ink`): titles and primary text. **Ink Soft** (`#56575c`, `--ink-soft`): notes and secondary copy. **Ink Faint** (`#8c8d92`, `--ink-faint`): mono meta, marks, muted cells.
- **Panel** (`#ffffff`, `--panel`) and **Panel 2** (`#f7f6f2`, `--panel-2`): raised surfaces inside slides (spec cards, code wells, the drawer).
- **Hairline** (`rgba(19,20,24,0.11)`) / **Hairline Strong** (`rgba(19,20,24,0.18)`) / **Panel Line** (`rgba(19,20,24,0.09)`): the only borders in the system. **Numeral** (`rgba(19,20,24,0.14)`): giant muted section numbers and the quote mark.

### Neutral (Dark — `[data-theme='dark']`)
- **Night** (`#0e0f11`, `--ground`) and **Night 2** (`#16171a`, `--ground-2`): the deep-warm ground for cover and key-points.
- Ink inverts to bone (`#f3f2ee`), soft `#a7a8ad`, faint `#6d6f75`; panels become `#17181b`/`#1d1e22`; hairlines become white at 10–20%.

### Tertiary (in-content specimen palette)
Slides that depict *other* interfaces carry their own functional colors — process step tones (teal `#2f8f86`, blue `#3768c9`, violet `#7a5af0`, ink `#2b2c31`) mixed at 15% over near-black card fills; the two-column "after" success green (`#2f9e6b`, on its checkmark badge, logomark, and CTA) against a neutral "before"; preview buttons (`#3b6fd4`, `#d64545`); code tokens (string `#2e8b6b`, keyword `#8257e6`); and the severity ramp (P0 `#d0402f`, P1 `#e08a2b`, P2 `#e3c34a`, P3 muted). These are specimen content shown *inside* a slide, not house colors. They never touch the chrome.

### Named Rules
**The One Accent Word Rule.** Each slide highlights exactly one word, authored in content as `**word**` and rendered terracotta by `renderAccent`. Beyond that word the signal serves only structure and state — the mono eyebrow, list numerals, the current slide in Contents, selection, focus. It is never a fill behind running text and never appears twice in one heading. Its rarity is the point.

**The Warm-Neutral Rule.** Ground is paper `#f3f2ee` or night `#0e0f11`, never pure black; ink is `#17181b` or bone `#f3f2ee`, never pure white. All neutrals tint warm.

## Typography

**Display / Body Font:** Geist (self-hosted woff2, weights 400/500/600; with `system-ui` fallback).
**Label / Mono Font:** Geist Mono (self-hosted woff2, weights 400/500/600; with `ui-monospace` fallback).

**Character:** A calm, contemporary grotesk doing both headline and body duty, cut against a single tracked monospace micro-layer for the page index, eyebrows, and code. The pairing reads technical but composed — a developer's masterclass, not a marketing page.

### Hierarchy
- **Display** (600, `clamp(40px, 6vw, 90px)`, line-height 1.0, tracking -0.03em, max 13ch): the cover title only.
- **Headline** (600, `clamp(32px, 4.4vw, 58px)`, line-height 1.0, tracking -0.024em, `text-wrap: balance`): divider and quote titles — the largest per-slide statements.
- **Title** (600, `clamp(30px, 4vw, 52px)`, line-height 1.02, tracking -0.022em, max 15ch): the shared slide heading (`.shead__title`); key-points push to `clamp(34px, 4.6vw, 62px)`.
- **Body** (400, `clamp(15px, 1.15vw, 18px)`, line-height 1.5, `--ink-soft`, max ~42ch): slide notes and the cover sub-line (`clamp(16px, 1.35vw, 21px)`). Row and list labels step up to weight 500.
- **Label** (Geist Mono 500, 11px, tracking 0.14em, UPPERCASE — the `.mono` class): page index (`NN / NN`, tracking 0.1em), the slide eyebrow, code tab, table headers, and divider/badge numbers. Code blocks and the line-number gutter render Geist Mono at `clamp(11px, 0.82vw, 13px)`.
- **Numeral** (600, `clamp(88px, 13vw, 188px)`, line-height 0.8, tracking -0.04em, color `--numeral`): the giant muted divider section number and the oversized quote mark.

### Named Rules
**The Two-Family Rule.** Geist sans carries everything a reader reads for meaning (titles, notes, labels-of-content); Geist Mono carries everything the machine indexes (page numbers, eyebrows, code, table headers). The families never trade jobs.

## Layout

A fixed full-viewport column (`.deck`, `position: fixed; inset: 0`) padded by `--pad` (`clamp(34px, 4.6vw, 84px)`) horizontally and `--pad-y` (`clamp(24px, 3vw, 46px)`) vertically: a flex-none top chrome and a flexible `.stage` that clips and cross-fades slides. Chrome is a single space-between row — a brand cluster (menu + wordmark) against the mono page index. There is no bottom chrome.

Each archetype owns its own internal grid: divider is `1.18fr / 0.82fr` (numeral+title against a numbered list), key-points and two-column are `1fr / 1fr`, process is a four-column flow of arrow-linked cards, code+UI is `1.05fr / 0.95fr` (code well beside a live preview), table is a full-width bordered matrix, quote is a centered oversized blockquote with corner closer and byline. Titles cap around 12–15ch; body around 42ch. Spacing runs on `--gap` (`clamp(16px, 1.5vw, 24px)`) with per-block `clamp()` rhythm rather than a fixed step scale.

Below 940px the multi-column archetypes collapse to a single column, the cover sphere moves inline beneath the text, the process flow drops to a 2-up (connector arrows hidden), and the table scrolls horizontally. Navigation: click (left 28% = prev, else next), Arrow/Space/PageUp-Down/Home/End keys, and a 64px horizontal swipe; `O` toggles Contents; `#N` in the hash deep-links the starting slide and stays in sync with the current index.

## Elevation & Depth

Two-tier. Slide chrome and in-slide surfaces are flat and separated tonally — the warm ground, `--panel`/`--panel-2` fills (or, for process cards, a tinted `color-mix` over near-black), and 1px hairline borders. There is no ambient drop-shadow on ordinary slide content; a slide flips ground by swapping `[data-theme]`, and the deck color-transitions the change over 420ms. Real elevation is reserved for the one element that genuinely floats: the Contents drawer slides in from the left over a dimmed, blurred scrim on a large soft edge-shadow, and its thumbnails lift on hover.

### Shadow Vocabulary
- **Drawer lift** (`box-shadow: 28px 0 80px -30px rgba(8,9,10,0.75)`): the left Contents drawer over its `rgba(8,9,10,0.5)` + `blur(3px)` scrim.
- **Tab lift** (`box-shadow: 0 1px 2px rgba(19,20,24,0.12)`): the active pill in the drawer's Outline/Slides tab switcher.
- **Thumb hover** (`translateY(-2px)`; current thumb `0 0 0 2px var(--accent)`): the Slides-tab grid responding to hover and marking the active slide.
- **Specimen shadow** (`0 16px 34px -22px rgba(19,20,24,0.4)` on the two-column auth mock): belongs to the depicted UI specimen, not the deck chrome.

### Named Rules
**The Flat-Chrome Rule.** Deck chrome and slide surfaces separate by tone and hairline, never by shadow. Outer shadows appear only on the Contents drawer and its thumbnails — the parts that literally float above the deck.

## Shapes

A soft, restrained radius family: `--r-sm` 6px (outline rows, thumbnails) and `--r-md` 10px (spec cards, code wells, two-column frames, process cards). The menu button rounds at 8px; pills at 999px carry badges, chips, tabs, and the close button; the focus ring rounds at 3px. Borders are uniformly hairline. The recurring geometry is the numbered list row divided by top-and-bottom hairlines, and the small rounded specimen card — the deck's structural motifs are lines and lightly-rounded rectangles, not heavy containers.

## Components

### Navigation
- **Menu button:** 34px square, 8px radius, 1px hairline border, ink glyph (three-line SVG); hover fills `--panel-2` and strengthens the border. Opens the Contents drawer (also `O`).
- **Deck nav:** click zones (left 28% prev / rest next), Arrows/Space/PageUp-Down/Home/End, and a 64px swipe. Slides cross-fade with a 14px rise-in (0.44s) and a 10px fall-out (0.26s) on the house ease.
- **Page index:** mono `NN / NN` (ink, tracking 0.1em), always current-over-total; no per-slide override, no corner eyebrow.

### Badges & Chips
- **Key-point badge:** 40px round (999px), 1px hairline-strong border, terracotta zero-padded number — one per row, hairline-divided.
- **Slide eyebrow (`.kicker`):** block mono label above the slide title, terracotta, tracked 0.14em uppercase — the per-slide idea label; part of the editorial archetype, not chrome.
- **Chip / variant pill:** 999px, `--panel-2` fill, `--panel-line` border, ink-soft mono/label text — used for preview state tags.

### Cards & Frames
- **Spec / code / two-column frame:** `--panel` (or `--panel-2`) fill, 1px `--panel-line` border, 10px radius, `clamp(14px…20px)` padding, no shadow.
- **Process step card:** a *tall dark-tinted* filled card (`color-mix(in srgb, var(--tone) 15%, #17181c)`, min-height ~88–108px, 10px radius), a small 7px-radius solid-tone number chip (white numeral), and a light `#f3f2ee` title; the four-up flow links cards with a rotated-corner arrow. Not a white bar.
- **Code well:** `--panel-2` well with a mono `--panel` tab header, a right-aligned mono **line-number gutter** (`--ink-faint`, 50% opacity), and syntax-highlighted `<pre>` (comment/string/keyword tokens).
- **Table/matrix:** borderless-outer, hairline row rules, mono uppercase headers, terracotta-free; severity is a filled specimen pill, action is plain colored text.

### Contents Drawer (signature)
A left side drawer (`min(420px, 88vw)`, full height, `--panel` fill, `--r-*` none — square-edged flush to the viewport, 1px hairline right border, drawer-lift shadow) that slides in from `x: -100%` over a dimmed blurred scrim. A pill tab-switcher toggles **Outline** — a nested numbered text outline (`slideOutline()` expands each archetype into its sub-items) with the current slide marked terracotta — and **Slides** — a 2-column 16:9 thumbnail grid where each thumb miniaturizes the slide's eyebrow/title over its own themed ground and the active one wears a 2px terracotta ring. A search field filters both views. Opened by the menu button or `O`; closed by `Esc`, the close pill, the scrim, or picking a slide.

### Cover Sphere (signature)
A single React Three Fiber `Canvas` (transparent, dpr `[1, 1.8]`, camera z 4.2 / fov 45), rendering one Fibonacci-distributed `points` cloud of 2,800 vertices (`NormalBlending`, soft round dot shader, depth-faded alpha, paper-colored `#f3f2ee`) on a 1.5-unit sphere, rotating slowly on Y (`0.11/s`) with a gentle X sway. It appears on the cover only, upper-right of the title, and freezes (`frameloop: demand`) under `prefers-reduced-motion`.

### Named Rules
**The One-Canvas Rule.** WebGL exists solely as the cover sphere. No other slide spawns a canvas; every other archetype is DOM and type. The medium stays quiet so the argument reads.

## Do's and Don'ts

### Do:
- **Do** drive every slide from `content/sample.json` (static import via `useContent`) — a `meta` block plus a typed `items` array; the eight `type` values map to the eight layout components in `Slides.jsx`. Versioned decks live in `content/`.
- **Do** highlight exactly one word per slide with `**word**`; let `renderAccent` color it terracotta.
- **Do** assign ground by archetype through `slideTheme()` (cover + keypoints dark, rest light) and flip themes by swapping `[data-theme]` on the deck; never hardcode a slide's colors outside the token set.
- **Do** keep chrome minimal and top-only: menu + wordmark upper-left, page index (`NN / NN`) upper-right — no footer, no chrome eyebrow.
- **Do** keep neutrals warm — paper `#f3f2ee` / night `#0e0f11`, ink `#17181b` / bone `#f3f2ee` — never pure `#000`/`#fff`.
- **Do** set the page index, code, and table headers in Geist Mono; set everything read for meaning in Geist sans.
- **Do** separate surfaces with tone and 1px hairlines; reserve the outer shadow for the floating Contents drawer.
- **Do** settle motion on `cubic-bezier(0.22, 1, 0.36, 1)` (~200ms controls, ~440ms slide-in, ~400ms drawer) and honor `prefers-reduced-motion` (freeze the sphere, shorten transitions).

### Don't:
- **Don't** put the terracotta signal on a filled surface behind running text, or use it twice in one heading — it marks one word plus structural marks and active state, nothing else.
- **Don't** add a second WebGL canvas; the cover sphere is the only one.
- **Don't** introduce a new archetype without giving it a `type` and a layout component; never render an untyped slide (the fallback is the divider).
- **Don't** add drop shadows, glass, or bordered container stacks to slide chrome — hairlines and tone carry separation.
- **Don't** promote a specimen color (process tones, the two-column success green, preview buttons, severity ramp, code tokens) into the house palette; those live inside depicted UI only.
