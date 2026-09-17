import type { Deck } from './types'

/**
 * The deck that gets presented and published — `DEFAULT_DECK` in
 * `src/lib/decks.ts` names this file.
 *
 * `satisfies Deck` rather than a type annotation: it checks the whole deck
 * against the contract while keeping the literal's own narrow types, so a
 * misspelled archetype or a `tone` that is not a tone is an error here rather
 * than a slide that renders the wrong thing on stage.
 */
const deck = {
  meta: {
    mark: "Designing with AI (highly opinionated)",
  },
  items: [
    {
      type: "cover",
      id: "cover",
      chapter: "Cover",
      title: "Designing with AI, **opinionated**.",
      subtitle: "For developers who enslave the AI-agents, and art is not their way of life.",
    },
    {
      type: "keypoints",
      id: "agenda",
      chapter: "Agenda",
      title: "What we are going to **cover** today",
      points: [
        "Why most of the initial prompts fail",
        "How to express your design intent",
        "How to know what is wrong",
        "My working pipeline (for now)",
        "Hidden gems, not hype",
      ],
    },
    {
      type: "divider",
      id: "part-1",
      chapter: "Part 1",
      number: "01",
      split: "golden-flip",
      title: "Why most of the initial prompts **fail**.",
      note: "Generic prompt = Generic failure",
      list: [
        "AI coding tools can build interfaces incredibly fast.",
        "The problem is that they often build the same interface over and over again. (AI-Slob)",
        "Most AI-generated interfaces fail for the same reason: the prompt gives the model too much freedom.",
      ],
      marker: "bullet",
    },
    {
      type: "cards",
      id: "prompts-that-fail",
      chapter: "Prompts that fail",
      title: "Three prompts, three **defaults**.",
      note: "When you give too much freedom to the AI, it defaults to generic patterns. When you give too much constraints, it struggles to follow them.",
      quoted: true,
      cards: [
        {
          title: "Create a modern dashboard.",
          subtitle: "The AI hears",
          points: [
            "Use the most statistically common dashboard pattern.",
            "That usually means cards, rounded corners, blue accents, generic navigation, neutral typography, and predictable spacing."
          ],
        },
        {
          title: "Make this look premium.",
          subtitle: "What you get",
          points: [
            "That phrase is too vague.",
            "It gives the model permission to fall back on generic patterns.",
            "Gradients, floating icons, fake product mockups",
            "Badge labels, symmetrical feature sections",            
          ],
        },
      ],
    },
    {
      type: "callouts",
      id: "the-look",
      chapter: "The look you recognise",
      title: "You already know this **look**.",
      image: {
        src: "showcase/slop-specimen.png",
        alt: "A generic SaaS landing page: centered hero on a purple-blue gradient, a small BETA badge, three identical feature cards below.",        
      },
      points: [
        { text: "Overused fonts: Inter, Roboto, Arial", pin: { x: 24, y: 25 } },
        { text: "Purple-blue gradients with no brand logic", pin: { x: 13, y: 31 } },
        { text: "Repeated three-card grids", pin: { x: 82, y: 58 } },
        { text: "Centered hero sections, weak hierarchy", pin: { x: 50, y: 44 } },
        { text: "Too many nested cards, low-contrast gray text", pin: { x: 18, y: 73 } },
        { text: "Heavy animation using transition: all" },
      ],
      status: "How many times you seen this? Be honest.",
    },
    {
      type: "divider",
      id: "part-2",
      chapter: "Part 2",
      number: "02",
      split: "golden-flip",
      marker: "bullet",
      title: "How to express your design **intent**.",
      note: "Every studio writes a brand book. This one is written for a reader that cannot be briefed in a meeting: files the agent reads before it writes.",
      list: [
        "A longer prompt does not fix this. The next session starts from zero again.",
        "What the model needs is not more words. It is fewer choices.",
        "So the constraints get written down once, in the repo, where every session finds them.",
      ],
    },
    {
      type: "cards",
      id: "two-files",
      chapter: "Two files",
      title: "The brand book, in two **files**.",
      note: "*based on impeccable.",
      cards: [
        {
          title: "PRODUCT.md",
          subtitle: "Who it serves, and why",
          points: [
            "Users and their situation",
            "Purpose and constraints to preserve",
            "Open questions, marked as open",
            "Written by ```/impeccable init```",
          ],
        },
        {
          title: "DESIGN.md",
          subtitle: "How it looks, and why",
          points: [
            "Token values in YAML frontmatter",
            "Prose on how each value is used",
            "Component rules, Do's and Don'ts",
            "Written by ```/impeccable document```",
          ],
        },
      ],
    },
    {
      type: "codeui",
      id: "product-md-anatomy",
      chapter: "Inside a PRODUCT.md",
      title: "**PRODUCT.md** anatomy",
      file: "PRODUCT.md",
      href: "https://github.com/ncanakturk-3dU/presentation-llm-for-design/blob/main/PRODUCT.md",
      lang: "md",
      code: "# Product\n<!-- impeccable:product-schema 1 -->\n\n## Platform                      web\n## Stack                         ⋯ 1 line\n## Users                         ⋯ 1 line\n## Product Purpose               ⋯ 1 line\n## Positioning                   ⋯ 1 line\n## Operating Context             ⋯ 3 lines\n## Capabilities and Constraints  ⋯ 6 lines\n## Brand Commitments             ⋯ 3 lines\n## Evidence on Hand              ⋯ 12 lines\n## Product Principles            ⋯ 5 lines\n## Accessibility & Inclusion     ⋯ 3 lines",
      preview: {
        title: "Structure details: (omit, don't pad)",
        buttons: [],
        rows: [
          { label: "Platform", detail: "web, ios, android or adaptive." },
          { label: "Stack", detail: "Greenfield only; else the repo answers." },
          { label: "Users", detail: "Who, their situation, their job." },
          { label: "Product Purpose", detail: "What it does, and what success is." },
          { label: "Positioning", detail: "The claim no neighbour could copy." },
          { label: "Operating Context", detail: "Where and how it is really used." },
          { label: "Capabilities and Constraints", detail: "Functionality, limits, open decisions." },
          { label: "Brand Commitments", detail: "Name, voice, binding assets." },
          { label: "Evidence on Hand", detail: "Real material — and the absences." },
          { label: "Product Principles", detail: "Three to five durable rules." },
          { label: "Accessibility & Inclusion", detail: "A known need, or a standard." },
        ],
      },
      note: "Written by ```/impeccable init``` — and **only** that: no palette, no type, no layout. A section with nothing confirmed behind it is omitted, not padded. This deck's own, 73 lines, folded.",
    },
    {
      type: "codeui",
      id: "design-md-anatomy",
      chapter: "Inside a DESIGN.md",
      title: "**DESIGN.md** anatomy",
      file: "DESIGN.md",
      href: "https://github.com/ncanakturk-3dU/presentation-llm-for-design/blob/main/DESIGN.md",
      lang: "md",
      code: "---\nname: LLM for Design\ndials: { variance: 7, motion: 3, density: 4 }\ncolors:      ⋯ 18 tokens\ntypography:  ⋯ 6 roles\ncomponents:  ⋯ 9 specs\n---\n\n## Overview           ⋯ 13 lines\n## Colors             ⋯ 18 lines\n## Typography         ⋯ 13 lines\n## Layout             ⋯ 4 lines\n## Elevation & Depth  ⋯ 8 lines\n## Shapes             ⋯ 1 line\n## Components         ⋯ 22 lines\n## Do's and Don'ts    ⋯ 20 lines",
      preview: {
        title: "Structure details: (order matters)",
        buttons: [],
        rows: [
          { label: "1. Overview", detail: "What the product is, who it is for, how it should feel." },
          { label: "2. Colors", detail: "The palette by role: ground, ink, one accent." },
          { label: "3. Typography", detail: "Families, sizes, weights, line heights." },
          { label: "4. Layout", detail: "Grid, spacing scale, breakpoints." },
          { label: "5. Elevation & Depth", detail: "Shadows and layers: what floats over what." },
          { label: "6. Shapes", detail: "Corner radii, borders, icon shape language." },
          { label: "7. Components", detail: "Buttons, fields, cards and every state they take." },
          { label: "8. Do's and Don'ts", detail: "The traps, written down instead of learned twice." },
        ],
      },
      note: "The open DESIGN.md spec, from Google Labs, Apache 2.0, still alpha. Unknown sections are preserved rather than rejected. This deck's own DESIGN.md, 267 lines, folded.",
    },
    {
      type: "cards",
      id: "three-sources",
      chapter: "Three ways to get one",
      title: "Three ways to get a brand **book**.",
      cards: [
        {
          title: "From a site you admire",
          subtitle: "skillui",
          points: [
            "```skillui --url https://site.com```",
            "Static analysis. No AI, no API key.",
            "Emits DESIGN.md, JSON tokens, shots",
            "Read more: [skillui.vercel.app](https://skillui.vercel.app)",
          ],
        },
        {
          title: "From your own codebase",
          subtitle: "impeccable",
          points: [
            "```/impeccable document```",
            "Reads tokens, styles, components and the rendered page",
            "Read more: [impeccable.style](https://impeccable.style)",
          ],
        },
        {
          title: "From a ready-made catalog",
          subtitle: "getdesign.md",
          points: [
            "550+ analyses of real sites",
            "Pick one, drop it in the repo",
            "Read more: [getdesign.md](https://getdesign.md)",
          ],
        },
      ],
    },
    {
      type: "keypoints",
      id: "review-the-spec",
      chapter: "Review the generated spec",
      title: "What **you** should review from **DESIGN.md**.",
      marker: "bullet",
      split: "golden-flip",
      points: [
        "Read the principles, not just the rules",
        "Check compatibility with your product",
        "Find conflicts and remove over-specific instructions",
        "Test it on 2–3 real screens"        
      ],
    },
    {
      type: "divider",
      id: "part-3",
      chapter: "Part 3",
      number: "03",
      split: "golden-flip",
      marker: "bullet",
      title: "How to know what is **wrong**.",
      note: "PRODUCT.md and DESIGN.md describe what we intended to build. They do not tell us whether the result actually works.",
      list: [
        "Intent is not evidence. An agent can follow the spec and still miss the context.",
        "Review needs measurable checks. Not just \"this feels better\".",
        "Many checks already exist. Heuristic laws give us a foundation.",
        "Make the judgment reproducible: metric, evidence, severity, finding.",
      ],
    },
    {
      type: "table",
      id: "standards",
      chapter: "The standards",
      title: "Four sources that end the **argument**.",
      note: "The first two are normative \u2014 an accessibility audit fails without them. The last two cite the research behind each rule, which is why they settle an argument instead of starting one.",
      columns: [
        "Source",
        "What it settles",
        "Numbers to remember",
        "Where",
      ],
      rows: [
        {
          severity: "WCAG 2.2",
          tone: "ink",
          meaning: "Accessibility, and it is normative",
          examples: "4.5:1 text \u00b7 3:1 non-text \u00b7 24px targets",
          action: "w3.org/TR/WCAG22",
        },
        {
          severity: "Apple HIG",
          tone: "ink",
          meaning: "How the platform expects to behave",
          examples: "44pt default control size",
          action: "developer.apple.com/design",
        },
        {
          severity: "Laws of UX",
          tone: "ink",
          meaning: "Heuristics with the study attached",
          examples: "400ms before a tool stops feeling instant",
          action: "lawsofux.com",
        },
        {
          severity: "designparser",
          tone: "ink",
          meaning: "88 rules, each one sourced",
          examples: "50-75ch measure \u00b7 8pt grid \u00b7 60-30-10",
          action: "designparser.de",
        },
      ],
    },
    {
      type: "codeui",
      id: "review-contract",
      chapter: "Hand it to the agent",
      title: "Give the agent a **number**, not a mood.",
      file: "DESIGN.md",
      lang: "md",
      code: "## Review contract\n\ncheck      threshold          source\ncontrast   >= 4.5:1 body      WCAG 1.4.3\ntarget     >= 24px, 44pt iOS  WCAG 2.5.8, HIG\nmeasure    50-75ch body       designparser\nresponse   < 400ms feedback   Doherty\nmotion     transform, opacity DESIGN.md\n\nReport every failure as:\nmetric \u00b7 evidence \u00b7 severity \u00b7 fix",
      preview: {
        title: "What comes back, per failure",
        buttons: [],
        rows: [
          { label: "metric", detail: "Which threshold, and the measured value." },
          { label: "evidence", detail: "A screenshot, or the file and line." },
          { label: "severity", detail: "Blocking, major, minor, or polish." },
          { label: "fix", detail: "Concrete, or the agent invents one." },
        ],
      },
      note: "It lives beside the tokens in ```DESIGN.md```, so every session reads it. Any agent can answer it \u2014 the checks are **arithmetic**, not taste.",
    },
    {
      type: "cards",
      id: "impeccable-does-it",
      chapter: "One implementation",
      title: "What this looks like in **Impeccable**.",
      note: "Impeccable is one example of turning design principles into a repeatable review process.",
      cards: [
        {
          title: "/impeccable document",
          subtitle: "Define the design rules",
          points: [
            "Reads the existing product and design system",
            "Turns design decisions into a reusable DESIGN.md",
          ],
        },
        {
          title: "/impeccable critique",
          subtitle: "Review the design",
          points: [
            "Identifies usability and visual design issues",
            "Explains why they matter and suggests improvements",
          ],
        },
        {
          title: "/impeccable audit",
          subtitle: "Run objective checks",
          points: [
            "Checks things that can be measured consistently",
            "Covers areas such as accessibility, structure, and interaction",
          ],
        },
      ],
    },
    {
      type: "keypoints",
      id: "what-wrong-looks-like",
      chapter: "What to take from this",
      title: "How to avoid making **mistakes** in design phases",
      marker: "bullet",
      split: "golden-flip",
      points: [
        "Expand your knowledge of the design rules",
        "Do quick research on dribbble or other design inspiration sites",
        "Pick the metric before you evaluate your design",
        "Run the checks each pass, not once at the end",
      ],
    },
    {
      type: "divider",
      id: "part-4",
      chapter: "Part 4",
      number: "04",
      split: "golden-flip",
      marker: "bullet",
      title: "My working **pipeline** (for now).",
      note: "Pipeline detail always evolves following the improvements of the available tools. Tools change, but the principles remain.",
      list: [],
    },
    {
      type: "process",
      id: "three-phases",
      chapter: "Three phases",
      title: "Three phases, one **loop**.",
      steps: [
        {
          n: "01",
          tone: "teal",
          title: "Initial",
          via: "Refine",
          points: [
            "PRODUCT.md, DESIGN.md, and a direction",
            "Once per project, not per feature",
          ],
        },
        {
          n: "02",
          tone: "blue",
          title: "Development",
          via: "Validate",
          points: [
            "UX and behaviour first, then the visual pass",
            "No visual work until the shape is agreed",
          ],
        },
        {
          n: "03",
          tone: "ink",
          title: "Hardening",
          points: [
            "Fix what the checks found",
            "Show a screenshot; describing the defect is slower",
            "Sometimes use a different model or provider if needed to avoid bias or limitations.",
            "Repeat until nothing is left open",
          ],
        },
      ],
    },
    {
      type: "codeui",
      id: "command-chain",
      chapter: "The command chain",
      title: "The practical **seven** commands.",
      file: "the-loop.sh",
      code: "/impeccable init\n  -> /impeccable document\n  -> /impeccable shape <feature>\n  -> /design-taste-frontend\n     or /redesign-existing-projects\n  -> Implement\n  -> /impeccable critique <feature>\n  -> /impeccable audit <feature>\n  -> /impeccable polish <feature>",
      preview: {
        title: "What each command is for",
        buttons: [],
        rows: [
          { label: "init", detail: "Writes PRODUCT.md. Once per project." },
          { label: "document", detail: "Reads the code, writes DESIGN.md." },
          { label: "shape", detail: "UX and behaviour, before any visual work." },
          { label: "taste skill", detail: "The branch: refine, or set a direction." },
          { label: "critique", detail: "Findings, each with a severity and a fix." },
          { label: "audit", detail: "The measurable checks, run per screen." },
          { label: "polish", detail: "The last pass before it is called done." },
        ],
      },
      note: "Seven commands and one step that is still mine: ```Implement``` is where the code gets written, and everything around it decides what gets written and whether it worked.",
    },
    {
      type: "cards",
      id: "which-taste-skill",
      chapter: "Which taste skill",
      title: "Refine what exists, or set a new **direction**.",
      note: "One branch in the loop, and the choice is about how much should change. Reach for design-taste when the direction itself is the problem.",
      cards: [
        {
          title: "/redesign-existing-projects",
          subtitle: "Refine what is already there",
          points: [
            "Audits the screen before it changes anything",
            "Fixes layout, spacing and hierarchy",
            "Ask it: ```Improve <feature> visually without changing its functionality or UX structure.```",
          ],
        },
        {
          title: "/design-taste-frontend",
          subtitle: "Set a new or stronger direction",
          points: [
            "For a direction that is missing or too weak to refine",
            "Sets the direction the later passes hold to",
            "Ask it: ```Improve the visual direction while preserving the existing brand and product structure.```",
          ],
        },
      ],
    },
    {
      type: "showcase",
      id: "hardening-example",
      chapter: "Example of hardening",
      title: "One example for **hardening** your design",
      note: "Create a collated view of your current design, pass it to other agent, then use the result to improve and harden your design.",
      images: [
        {
          src: "showcase/treeqr-shipped.png",
          alt: "Before",
          label: "The original design before hardening",
        },
        {
          src: "showcase/treeqr-hardened.png",
          alt: "After",
          label: "The design suggestions by another agent",
        },
      ],
    },
    {
      type: "keypoints",
      id: "how-the-loop-runs",
      chapter: "What to take from this",
      title: "How **you** run the loop.",
      marker: "bullet",
      split: "golden-flip",
      points: [
        "Write the spec once per project, not per feature",
        "Agree the shape before anyone touches the visual pass",
        "Branch on how much should change: refine, or redirect",
        "Show a screenshot, and let a fresh model re-cut it",
      ],
    },
    {
      type: "divider",
      id: "part-5",
      chapter: "Part 5",
      number: "05",
      title: "Hidden gems, not **hype**.",
      note: "As of September 2026. Five things worth the install, one starter set of three, and four references to keep open in a tab. Every one has a date on it, so you can see what is still moving.",
      list: [
        "Five tools, and what each is for",
        "A starter three",
        "Four references worth a bookmark",
        "What to take away",
      ],
    },
    {
      type: "divider",
      id: "part-5-placeholder",
      chapter: "To be written",
      title: "To be **written**.",
    },
    {
      type: "quote",
      id: "closing",
      chapter: "Closing",
      quote: "They shape the **thinking** that creates it.",
      closer: "Good design prompts.",
      byline: "Mohamed Elkholy, \"Beyond Make it Beautiful\", May 2026.",
    },
    {
      type: "keypoints",
      id: "sources",
      chapter: "Sources",
      title: "Everything here has a **link**.",
      points: [
        "moelkholy1995.medium.com, the anti-slop article",
        "impeccable.style · tasteskill.dev · github.com/emilkowalski/skills",
        "skillui.vercel.app · getdesign.md · design.md spec, Google Labs",
        "designparser.de · lawsofux.com",
        "developer.apple.com/design · w3.org/TR/WCAG22",
      ],
    },
  ],
} satisfies Deck

export default deck
