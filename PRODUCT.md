# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Delegated to the design lead ("You recommend"), then pinned by the user's explicit brief: **React + Vite** (JavaScript/JSX, matching the user's admired reference project `qr-4-seasons`; TypeScript not required), **React Three Fiber** (`@react-three/fiber`) with **Drei** (`@react-three/drei`) for the WebGL scene, **Framer Motion** for UI/text animation, and **GSAP** for particle morphing and 3D transitions. Pinned to React 18 / three 0.170 to match the reference. This stack is a binding brief constraint, not a suggestion.

## Users

Primary user: the **presenter** delivering the talk live — on stage or screen-share — while speaking to it. The deck is driven by a human stepping through slides in real time, not read unattended. Secondary audience: the people watching the projected/shared screen.

## Product Purpose

An interactive 3D web presentation that communicates the key ideas of Mohamed Elkholy's article *"Beyond 'Make it Beautiful': The Anti-Slop Framework for AI Frontend Craftsmanship."* Success = the audience follows the argument (why AI UI looks generic → the anti-slop process → the disciplines and the quality gate) with each idea reinforced by a distinct, fluid 3D visual, and the presenter can move through it confidently live.

## Positioning

The deck **is an argument by demonstration**: a presentation about anti-slop frontend craft that itself refuses generic slide-template slop. A full-screen morphing WebGL particle field carries each section, so the medium proves the message. This is not a slide template with swapped text.

## Operating Context

- Presented live; the presenter controls pacing with next/prev and expects keyboard arrows plus discreet on-screen controls.
- Single continuous session, typically projected or screen-shared at 1080p+; must also degrade gracefully to a laptop screen and stay sane in smaller windows.
- Runs in a modern desktop browser with WebGL2.

## Capabilities and Constraints

- Full-screen background WebGL canvas: a GPU particle system (`THREE.Points` + `BufferGeometry`) that fluidly morphs its vertex positions from one 3D form to another as the active slide changes (GSAP-driven position tweens).
- Every slide maps to one particle target shape. Placeholder shapes are mathematical geometries sampled to a **fixed particle count**; the geometry layer is structured so external GLTF/GLB vertex data can replace a shape later without touching slide/state logic.
- Foreground HTML/DOM overlay (Framer Motion) holds title + short summary + navigation; outgoing content fades down/out, incoming content slides up/in.
- State: a single active-slide index syncs the DOM overlay and the particle morph target.
- Content is derived from the source article (see Evidence). Slide copy is a distilled paraphrase for presentation, not the article verbatim.
- Must respect `prefers-reduced-motion`.

## Brand Commitments

- **Attribute the source:** article by Mohamed Elkholy, *"Beyond 'Make it Beautiful': The Anti-Slop Framework for AI Frontend Craftsmanship"* (Medium, 2026). The deck presents his ideas; it must credit him and not claim the framework as the presenter's own.
- **Dark-mode aesthetic** with high-contrast typography that does not fight the 3D canvas (explicit brief constraint).
- The deck must itself honor the article's anti-slop rules it is describing — no generic template feel, purposeful restrained motion, intentional color. Practicing what it preaches is binding.

## Evidence on Hand

- Source article (full text retrieved this session): `moelkholy1995.medium.com/beyond-make-it-beautiful-the-anti-slop-framework-for-ai-frontend-craftsmanship-c99bbee6c994` — by Mohamed Elkholy, ~11 min read, May 28 2026.
- Core sections extracted from the article (raw material for slides):
  1. **AI design monoculture** — AI builds the same interface repeatedly (centered hero, purple-blue gradient, BETA badge, three identical cards, Inter everywhere, soft shadows, `transition: all`). "Clean enough to pass at a glance, but it does not feel designed."
  2. **Why AI UI looks generic** — vague prompts give the model too much freedom; it defaults to the statistically most common pattern. "Make it beautiful" = "use the safest SaaS pattern."
  3. **A process, not a prompt** — the five-stage workflow: Design Strategy → Layout Constraints → Production Code → Motion Polish → Quality Audit. Most people skip to code; that is the mistake.
  4. **Three disciplines** — Impeccable Style (workflow, tokens, typography, polish), Taste Skill (anti-slop layout discipline + taste knobs: variance / density / motion), Emil Kowalski-style motion (spring physics, fast micro-interactions).
  5. **Ban the clichés** — no purple-blue gradient, no badge + headline + three-card grid, no fake dashboard mockups, no floating icon pills, no generic BETA badges; demand asymmetry and one memorable visual anchor per section.
  6. **Motion with intent** — animate only `transform`/`opacity`, keep transitions ~120–250ms (under 300ms), custom easing (`cubic-bezier(0.23,1,0.32,1)`), no `transition: all`, no `ease-in` entrances, respect `prefers-reduced-motion`.
  7. **Color as architecture** — OKLCH light/dark systems, never pure `#000`/`#fff`, tint neutrals toward the brand hue, WCAG AA (4.5:1 body / 3:1 large), restrained for product UI and committed for brand.
  8. **Failure blocks delivery** — a final quality gate: contrast, stable React keys, semantic HTML, no generic card-grid repetition, empty/loading/error states. "Failure is not a note. Failure blocks delivery."
  9. **Closing** — "Good design prompts do not just describe the output. They shape the thinking that creates it."
- No other brand assets, logos, imagery, or data were provided. Do not fabricate testimonials, metrics, or logos.

## Product Principles

- **Practice the article:** the deck must not exhibit the slop it describes.
- **One idea per slide,** reinforced by one distinct 3D form — distilled, never cluttered.
- The 3D is the argument's spine, not decoration; morphs are purposeful and continuous.
- **Presenter-first:** fast, legible from the back of a room, controllable with the keyboard.
- **Restraint over ornament** in motion and color; intentional, never exaggerated.

## Accessibility & Inclusion

- Respect `prefers-reduced-motion` (reduce or disable particle morph and text motion; keep content fully legible).
- WCAG AA text contrast against the dark canvas.
- Keyboard navigation for slide control.
