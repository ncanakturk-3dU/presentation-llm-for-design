import type { Deck } from "./types";

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
	parts: [
		{
			id: "intro",
			label: "Intro",
			slides: [
				{
					type: "cover",
					id: "designing-with-ai",
					chapter: "Cover",
					standalone: true,
					title: "Designing with AI, **opinionated**.",
					subtitle:
						"For developers who enslave the AI-agents, and art is not their way of life.",
				},
				{
					type: "keypoints",
					id: "what-we-cover-today",
					chapter: "Table of contents",
					title: "What we are going to **cover**",
					points: [
						"Why most of the initial prompts fail",
						"How to express your design intent",
						"How to know what is wrong",
						"My working loop (for now)",
						"Hidden gems, not hype",
					],
				},
			],
		},
		{
			id: "part-1",
			label: "Why prompts fail",
			slides: [
				{
					type: "divider",
					id: "why-prompts-fail",
					chapter: "Why prompts fail",
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
					id: "three-prompts-three-defaults",
					chapter: "Three prompts, three defaults",
					title: "Three prompts, three **defaults**.",
					note: "When you give too much freedom to the AI, it defaults to generic patterns. When you give too much constraints, it struggles to follow them.",
					quoted: true,
					cards: [
						{
							title: "Create a modern dashboard.",
							subtitle: "The AI hears",
							points: [
								"Use the most statistically common dashboard pattern.",
								"That usually means cards, rounded corners, blue accents, generic navigation, neutral typography, and predictable spacing.",
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
						{
							title:
								"Use exactly 16px padding, 8px radius, three columns, blue buttons…",
							subtitle: "The AI hears",
							points: [
								"Follow the instructions even when they conflict with the problem.",
								"Specs replace judgement: the numbers get met and the layout stops making sense.",
							],
						},
					],
				},
				{
					type: "callouts",
					id: "you-already-know-this-look",
					theme: "light",
					chapter: "You already know this look",
					title: "You already know this **look**.",
					image: {
						src: "showcase/slop-specimen.png",
						alt: "A generic SaaS landing page: centered hero on a purple-blue gradient, a small BETA badge, three identical feature cards below.",
					},
					points: [
						{
							text: "Overused fonts: Inter, Roboto, Arial",
							pin: { x: 24, y: 25 },
						},
						{
							text: "Purple-blue gradients with no brand logic",
							pin: { x: 13, y: 31 },
						},
						{ text: "Repeated three-card grids", pin: { x: 82, y: 58 } },
						{
							text: "Centered hero sections, weak hierarchy",
							pin: { x: 50, y: 44 },
						},
						{
							text: "An eyebrow label over every heading: BETA, NEW",
							pin: { x: 44, y: 16 },
						},
						{
							text: "Too many nested cards, low-contrast gray text",
							pin: { x: 18, y: 73 },
						},
						{ text: "Heavy animation using transition: all" },
						{ text: "Em dashes everywhere — including this one" },
					],
					status: "How many times you seen this? Be honest.",
				},
				{
					type: "keypoints",
					id: "seven-things-to-prepare",
					chapter: "Seven things to prepare",
					kicker: "PART 1 — TAKEAWAY",
					title: "Seven things to **prepare** before you type.",
					marker: "number",
					split: "golden-flip",
					points: [
						"Product context — what this thing is, and who pays for it",
						"User — who is on the other side of the screen",
						"Hierarchy — what has to be read first, second, last",
						"References — the work you want it to resemble",
						"Constraints — the fonts, colors, and patterns it may not leave",
						"Priorities — what gives way when two of these collide",
						"Success criteria — how you will know the result is right",
					],
				},
			],
		},
		{
			id: "part-2",
			label: "Express your design intent",
			slides: [
				{
					type: "divider",
					id: "express-your-design-intent",
					chapter: "Express your design intent",
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
					type: "keypoints",
					id: "what-makes-intent-actionable",
					theme: "light",
					chapter: "What makes intent actionable",
					title: "What makes design intent **actionable**?",
					marker: "bullet",
					split: "golden-flip",
					points: [
						"Audience — who it is for, in one sentence",
						"Purpose — the job the screen does for them",
						"Hierarchy — the order the eye is meant to travel",
						"Visual direction — type, color, and density, named not implied",
						"Interaction rules — what responds, and how it responds",
						"Anti-patterns — the moves it is not allowed to make",
					],
				},
				{
					type: "cards",
					id: "the-brand-book-in-two-files",
					chapter: "The brand book, in two files",
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
					chapter: "PRODUCT.md anatomy",
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
							{
								label: "Stack",
								detail: "Greenfield only; else the repo answers.",
							},
							{ label: "Users", detail: "Who, their situation, their job." },
							{
								label: "Product Purpose",
								detail: "What it does, and what success is.",
							},
							{
								label: "Positioning",
								detail: "The claim no neighbour could copy.",
							},
							{
								label: "Operating Context",
								detail: "Where and how it is really used.",
							},
							{
								label: "Capabilities and Constraints",
								detail: "Functionality, limits, open decisions.",
							},
							{
								label: "Brand Commitments",
								detail: "Name, voice, binding assets.",
							},
							{
								label: "Evidence on Hand",
								detail: "Real material — and the absences.",
							},
							{
								label: "Product Principles",
								detail: "Three to five durable rules.",
							},
							{
								label: "Accessibility & Inclusion",
								detail: "A known need, or a standard.",
							},
						],
					},
					note: "Written by ```/impeccable init``` — and **only** that: no palette, no type, no layout. A section with nothing confirmed behind it is omitted, not padded. This deck's own, 73 lines, folded.",
				},
				{
					type: "codeui",
					id: "design-md-anatomy",
					chapter: "DESIGN.md anatomy",
					title: "**DESIGN.md** anatomy",
					file: "DESIGN.md",
					href: "https://github.com/ncanakturk-3dU/presentation-llm-for-design/blob/main/DESIGN.md",
					lang: "md",
					code: "---\nname: LLM for Design\ndials: { variance: 7, motion: 3, density: 4 }\ncolors:      ⋯ 18 tokens\ntypography:  ⋯ 6 roles\ncomponents:  ⋯ 9 specs\n---\n\n## Overview           ⋯ 13 lines\n## Colors             ⋯ 18 lines\n## Typography         ⋯ 13 lines\n## Layout             ⋯ 4 lines\n## Elevation & Depth  ⋯ 8 lines\n## Shapes             ⋯ 1 line\n## Components         ⋯ 22 lines\n## Do's and Don'ts    ⋯ 20 lines",
					preview: {
						title: "Structure details: (order matters)",
						buttons: [],
						rows: [
							{
								label: "1. Overview",
								detail:
									"What the product is, who it is for, how it should feel.",
							},
							{
								label: "2. Colors",
								detail: "The palette by role: ground, ink, one accent.",
							},
							{
								label: "3. Typography",
								detail: "Families, sizes, weights, line heights.",
							},
							{
								label: "4. Layout",
								detail: "Grid, spacing scale, breakpoints.",
							},
							{
								label: "5. Elevation & Depth",
								detail: "Shadows and layers: what floats over what.",
							},
							{
								label: "6. Shapes",
								detail: "Corner radii, borders, icon shape language.",
							},
							{
								label: "7. Components",
								detail: "Buttons, fields, cards and every state they take.",
							},
							{
								label: "8. Do's and Don'ts",
								detail: "The traps, written down instead of learned twice.",
							},
						],
					},
					note: "The open DESIGN.md spec, from Google Labs, Apache 2.0, still alpha. Unknown sections are preserved rather than rejected. This deck's own DESIGN.md, 267 lines, folded.",
				},
				{
					type: "cards",
					id: "three-ways-to-get-a-brand-book",
					chapter: "Three ways to get a brand book",
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
					id: "what-to-review-from-design-md",
					theme: "light",
					chapter: "What to review from DESIGN.md",
					title: "What **you** should review from **DESIGN.md**.",
					marker: "bullet",
					split: "golden-flip",
					points: [
						"Read the principles, not just the rules",
						"Check compatibility with your product",
						"Find conflicts and remove over-specific instructions",
						"Test it on 2–3 real screens",
					],
				},
				{
					type: "keypoints",
					id: "establish-a-design-contract",
					chapter: "Establish a design contract",
					kicker: "PART 2 — TAKEAWAY",
					title:
						"Before developing your first screen, establish a design **contract**.",
					marker: "none",
					points: [
						"Reduce ambiguous design decisions by making intent persistent and explicit.",
						"The contract is the two files: `PRODUCT.md` and `DESIGN.md`.",
					],
				},
			],
		},
		{
			id: "part-3",
			label: "How to know what is wrong",
			slides: [
				{
					type: "divider",
					id: "how-to-know-what-is-wrong",
					chapter: "How to know what is wrong",
					number: "03",
					split: "golden-flip",
					marker: "bullet",
					title: "How to know what is **wrong**.",
					note: "PRODUCT.md and DESIGN.md describe what we intended to build. They do not tell us whether the result actually works.",
					list: [
						"Intent is not evidence. An agent can follow the spec and still miss the context.",
						"And you cannot name a failure without knowing what right looks like first.",
						"Right comes from three places: principles, conventions, and what good products already do.",
						"Then the check is worth running: metric, evidence, severity, finding.",
					],
				},
				{
					type: "keypoints",
					id: "do-not-reinvent-the-wheel",
					theme: "light",
					chapter: "Do not reinvent the wheel",
					title: "Do not reinvent the **wheel**.",
					marker: "bullet",
					split: "golden-flip",
					points: [
						"Usability research — decades of it, and almost none of it yours",
						"Platform conventions — what the OS already taught your user",
						"Accessibility standards — normative, and not a matter of taste",
						"Interaction principles — why a control behaves the way it does",
						"Iteration with real users — the part no reference can hand you",
						"Following a proven convention is not plagiarism. Lifting a whole design system is.",
					],
				},
				{
					type: "cards",
					id: "look-past-the-first-reference",
					chapter: "Look past the first reference",
					title: "Look past the first reference that looks **good**.",
					note: "Read them for the recurring pattern — hierarchy, spacing, typography, navigation, interaction, content density, rhythm. The goal is not to copy a screen; it is to see why a good screen feels right.",
					cards: [
						{
							title: "Product flows",
							subtitle: "What the screen does next",
							points: [
								"[Mobbin](https://mobbin.com) · [Pageflows](https://pageflows.com) · [ScreensDesign](https://screensdesign.com)",
								"Whole flows, not single screens. The states between them are what a still never shows you.",
							],
						},
						{
							title: "Visual inspiration",
							subtitle: "How it looks, and how it feels",
							points: [
								"[Dribbble](https://dribbble.com) · [Behance](https://behance.net) · [Godly](https://godly.website) · [Awwwards](https://awwwards.com)",
								"Strong on treatment, weak on product logic. Take the surface, leave the structure.",
							],
						},
						{
							title: "Landing pages",
							subtitle: "How it sells itself",
							points: [
								"[Landingfolio](https://landingfolio.com)",
								"One page, one job. The order of the sections is the argument the page is making.",
							],
						},
					],
				},
				{
					type: "table",
					id: "not-every-rule-binds-the-same-way",
					chapter: "Not every rule binds the same way",
					title: "Not every rule **binds** the same way.",
					note: "Which level a number comes from decides how much trust it earns, and how hard to argue when an agent cites it at you.",
					columns: ["Level", "How much it binds", "Source & example"],
					rows: [
						{
							severity: "Requirements",
							tone: "red",
							meaning: "Must. An audit fails without it.",
							examples:
								"[WCAG 2.2](https://www.w3.org/TR/WCAG22) — 4.5:1 body contrast · 24×24px targets, with listed exceptions",
						},
						{
							severity: "Guidelines",
							tone: "orange",
							meaning: "Should. What the platform expects.",
							examples:
								"[Apple HIG](https://developer.apple.com/design) — at least 44×44pt for a touch target",
						},
						{
							severity: "Heuristics",
							tone: "yellow",
							meaning: "Consider. A study, not a threshold.",
							examples:
								"[Laws of UX](https://lawsofux.com) — feedback inside ~400ms · [designparser](https://designparser.de) — 50–75ch measure",
						},
					],
				},
				{
					type: "codeui",
					id: "measure-what-can-be-measured",
					chapter: "Measure what can be measured",
					title: "Measure what can be **measured**.",
					file: "DESIGN.md",
					lang: "md",
					code: "## Review contract\n\nrequired   contrast >= 4.5:1 body    WCAG 1.4.3\nrequired   target >= 24x24px         WCAG 2.5.8\nguideline  target >= 44x44pt on iOS  Apple HIG\nheuristic  measure 50-75ch body      designparser\nheuristic  feedback under 400ms      Laws of UX\nconvention animate transform/opacity  DESIGN.md\n\njudged     hierarchy, clarity, density,\n           appropriateness, perceived complexity\n\nReport every failure as:\nmetric or evidence \u00b7 severity \u00b7 fix",
					preview: {
						title: "What comes back, per failure",
						buttons: [],
						rows: [
							{
								label: "metric",
								detail:
									"The threshold and the measured value, where one exists.",
							},
							{
								label: "evidence",
								detail:
									"A screenshot, or the file and line. Required where no metric does.",
							},
							{
								label: "severity",
								detail: "Blocking, major, minor, or polish.",
							},
							{ label: "fix", detail: "Concrete, or the agent invents one." },
						],
					},
					note: "It lives beside the tokens in ```DESIGN.md```, so every session reads it. Contrast and target size are arithmetic and any agent can answer them. Hierarchy, clarity and perceived complexity are not — those come back evidence-based, and the evidence is what makes them arguable instead of a mood.",
				},
				{
					type: "cards",
					id: "what-this-looks-like-in-impeccable",
					chapter: "What this looks like in Impeccable",
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
					id: "know-right-to-know-wrong",
					chapter: "Know right to know wrong",
					kicker: "PART 3 — TAKEAWAY",
					title: "You need to know what is **right** to know what is wrong.",
					marker: "bullet",
					points: [
						"Principles tell you why it works",
						"Conventions tell you what users already expect",
						"References expand what you can imagine",
						"Pick the metric before you evaluate the screen",
						"Run the checks each pass, not once at the end",
					],
				},
			],
		},
		{
			id: "part-4",
			label: "My working loop",
			slides: [
				{
					type: "divider",
					id: "my-working-loop",
					chapter: "My working loop",
					number: "04",
					split: "golden-flip",
					marker: "bullet",
					title: "My working **loop** (for now).",
					note: "The commands change every few months, as the tools do. What does not change is the shape: say what the job is, choose a direction, then build and review — and every pass ends by deciding whether to go round again.",
					list: [],
				},
				{
					type: "cards",
					id: "pick-your-style",
					chapter: "Pick your style",
					title: "Pick your development **style**.",
					note: "A switch in the picker, answered per run. With image generation on and nothing saved it starts mockup-first. Pin it with ```/impeccable use code-led as this project's default for new design work```, or write `buildPath` into `.impeccable/config.json`.",
					cards: [
						{
							title: "comp-led",
							subtitle: "Mockup first",
							points: [
								"Bolder compositions, reviewed as pictures before any code exists",
								"Needs image generation, and costs iterations: turning an image into code loses detail",
							],
						},
						{
							title: "code-led",
							subtitle: "Build directly",
							points: [
								"A more coherent first implementation, inside the model's natural visual range",
								"Less ambitious, and it needs no image generation",
							],
						},
					],
				},
				{
					type: "commands",
					id: "comp-led-session",
					chapter: "A comp-led session",
					title: "**COMP-LED**: You approve a **picture**, then it builds to match.",
					split: "golden",
					image: {
						src: "showcase/impeccable-directions.jpg",
						alt: "The picker, \u201cChoose the visual world\u201d: a COMP FIRST / CODE FIRST switch top right, then four direction cards \u2014 Teletext Service, The Program Guide, Aicher Olympic Program \u2014 each with a rendered mockup, the idea in one line, its palette and tags, a RISK line and a Build this button. A steer field runs along the bottom beside Safer hand, Re-roll and Bolder hand.",
						label: "impeccable · choose the visual world",
					},
					commands: [
						{
							run: "/impeccable use comp-led as this project's default for new design work",
							writes: "mockups, then code",
							detail: "Several compositions come back as pictures before any code exists. You approve one, and it becomes the target the build is measured against.",
						},
					],
					rules: [
						"Needs image generation turned on, and costs time and usage.",
						"Approved mockups are kept in `.impeccable/mocks/`, with how each was generated.",
						"Turning an image into code loses detail — expect several rounds of prompting and review to get near the picture.",
					],
				},
				{
					type: "commands",
					id: "code-led-session",
					chapter: "A code-led session",
					title: "**CODE-LED**: You choose a **structure**, and it writes it.",
					commands: [
						{
							run: "/impeccable use code-led as this project's default for new design work",
							writes: "code, first pass",
							detail: "The options are layouts — a ledger, a board, a pipeline map. You choose one, and the structure is the brief it writes from.",
						},
					],
					rules: [
						"No image generation, so nothing waits on a render.",
						"Re-roll or steer the set the same way as on the other path.",
						"A more coherent first implementation, inside the model's natural range — less ambitious than a mockup would have been, and it runs.",
					],
				},
				{
					// Command, description and group are quoted from impeccable's own
					// Command reference at impeccable.style/docs, in the page's order,
					// spelling and punctuation. Ten of the twenty-four are on the
					// slide; the last row links the rest rather than paraphrasing it.
					type: "table",
					id: "all-the-syntax",
					chapter: "All the syntax",
					title: "**Control** it yourself.",
					note: "If you know what you want, drive it yourself.",
					columns: ["Command", "What it does", "Group"],
					rows: [
						{
							severity: "shape",
							tone: "ink",
							meaning: "Turn an idea into a design brief you can build from.",
							examples: "Create",
						},
						{
							severity: "audit",
							tone: "ink",
							meaning: "Find implementation problems and prioritize the fixes.",
							examples: "Evaluate",
						},
						{
							severity: "critique",
							tone: "ink",
							meaning: "Find what\u2019s holding the design back and what to improve first.",
							examples: "Evaluate",
						},
						{
							severity: "layout",
							tone: "ink",
							meaning: "Arrange the page so people know where to look and what belongs together.",
							examples: "Refine",
						},
						{
							severity: "typeset",
							tone: "ink",
							meaning: "Make text easier to read, scan, and recognize across the product.",
							examples: "Refine",
						},
						{
							severity: "adapt",
							tone: "ink",
							meaning: "Make an existing design work on a different screen, device, or platform.",
							examples: "Simplify",
						},
						{
							severity: "harden",
							tone: "ink",
							meaning: "Keep the interface usable when data, connections, or actions go wrong.",
							examples: "Harden",
						},
						{
							severity: "polish",
							tone: "ink",
							meaning: "Make an existing page feel finished and work better.",
							examples: "Harden",
						},
						{
							severity: "document",
							tone: "ink",
							meaning: "Record your visual system so future work can follow it.",
							examples: "System",
						},
						{
							severity: "init",
							tone: "ink",
							meaning: "Give Impeccable the context to design for your project.",
							examples: "System",
						},
						{
							severity: "+14 more",
							tone: "ink",
							meaning: "Every other verb is the same shape.",
							examples: "[impeccable.style/docs](https://impeccable.style/docs)",
						},
					],
				},
				{
					type: "showcase",
					id: "use-a-fresh-model-as-a-second-opinion",
					chapter: "A fresh model as second opinion",
					title: "Use a fresh model as a **second opinion**.",
					note: "Do not ask another agent for a prettier version. Send the screen as it is, ask for concrete issues and a rendered alternative, then decide which of the fixes belong in your product.",
					images: [
						{
							src: "showcase/treeqr-shipped.png",
							alt: "The shipped 4-Season QR screen: a generated QR code, a full-width music transport bar under it, and one card holding the season tabs, six colour swatches, a URL field and three equal buttons.",
						},
						{
							src: "showcase/treeqr-hardened.png",
							alt: "The revised flow: eight screens, each with a titled header, labelled sections for URL, Season and Tree Theme, and a single filled primary button.",
						},
					],
					points: [
						"Hierarchy — the music bar outweighs the card that does the job",
						"Control weight — tabs, swatches and three buttons all equal, and nothing is primary",
						"Unclear relationship — the tap hint collides with the URL field",
					],
					link: "Source: [findexu.github.io/qr-4-seasons](https://findexu.github.io/qr-4-seasons/) · [sketch.3duniversum.com/treeqr-demo](https://sketch.3duniversum.com/treeqr-demo/latest/)",
				},
				{
					type: "keypoints",
					id: "how-you-run-the-loop",
					chapter: "How you run the loop",
					kicker: "PART 4 — TAKEAWAY",
					title: "How **you** run the loop.",
					marker: "bullet",
					split: "golden-flip",
					points: [
						"Choose the path before the run — `comp-led` when the composition is the risk, `code-led` when it is not",
						"Both paths stop and ask: you approve a picture or a structure before anything is built on it",
						"`init` and `document` are written once, and every session after reads them",
						"When you already know what you want, name the verb yourself instead of asking for options",
						"A fresh model is a second opinion, not a redesign — send the screen as it is, and keep only the fixes that are yours",
					],
				},
			],
		},
		{
			id: "part-5",
			label: "Hidden gems, not hype",
			slides: [
				{
					type: "divider",
					id: "part-5",
					chapter: "Hidden gems, not hype",
					number: "05",
					title: "Hidden gems, not **hype**.",
					note: "As of September 2026. Five things worth the install, one starter set of three, and four references to keep open in a tab. Every one has a date on it, so you can see what is still moving.",
					list: [
						"Five tools, and what each is for",
						"A starter three",
						"References worth a bookmark",
						"What to take away",
					],
				},
				{
					type: "cards",
					id: "part-5-tools",
					chapter: "Five tools worth the install.",
					title: "Five tools worth the **install**.",
					note: "As of September 2026, and none of them was in Parts 1–4. Two make the agent design better; three make you see whether it did. Every one has a date on it, so you can see what is still moving.",
					cards: [
						{
							title: "emilkowalski/skills",
							subtitle: "Motion the agent gets right",
							points: [
								"`npx skills add emilkowalski/skills`",
								"Picks curve, duration and property before anything moves, then grades what it built",
								"Sep 2026 · [emilkowalski/skills](https://github.com/emilkowalski/skills)",
							],
						},
						{
							title: "diagram-design",
							subtitle: "Diagrams in your brand, not Mermaid",
							points: [
								"`/plugin marketplace add cathrynlavery/diagram-design`",
								"39 editorial types as self-contained HTML+SVG, in your site's own palette and fonts",
								"Cathryn Lavery · Sep 2026 · [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design)",
							],
						},
						{
							title: "web-design-guidelines",
							subtitle: "The rulebook, run as an audit",
							points: [
								"`npx skills add vercel-labs/agent-skills`",
								"“Review my UI” fetches 100+ rules fresh and reports every miss as `file:line`",
								"Vercel Labs · Aug 2026 · [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)",
							],
						},
						{
							title: "jakubkrehel/skills",
							subtitle: "One ranked verdict on the whole screen",
							points: [
								"`npx skills add jakubkrehel/skills`",
								"`better-interface` checks a11y, type, color, copy and motion, then ranks the findings",
								"Aug 2026 · [jakubkrehel/skills](https://github.com/jakubkrehel/skills)",
							],
						},
						{
							title: "agent-browser",
							subtitle: "The review step, in a real browser",
							points: [
								"`npm i -g agent-browser`",
								"Playwright in a Rust CLI; `snapshot` returns the a11y tree as text, ~5× fewer tokens",
								"Vercel Labs · Sep 2026 · [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser)",
							],
						},
					],
				},
				{
					type: "cards",
					id: "part-5-starter-three",
					chapter: "A starter three",
					title: "If you only install **three**.",
					note: "One to write the rules down, one to keep the slop out of what the agent draws, one to audit the result against those rules. The rest can wait a week.",
					cards: [
						{
							title: "impeccable",
							subtitle: "Write the rules",
							points: [
								"`/impeccable init` + `/impeccable document`",
								"Your own codebase → `PRODUCT.md` + `DESIGN.md`, read by every session",
								"Sep 2026 · [impeccable.style](https://impeccable.style)",
							],
						},
						{
							title: "tasteskill",
							subtitle: "Prevent the slop",
							points: [
								"`npx skills add Leonxlnx/taste-skill`",
								"Three dials — variance, motion, density — set before the agent writes",
								"Sep 2026 · [tasteskill.dev](https://tasteskill.dev)",
							],
						},
						{
							title: "web-design-guidelines",
							subtitle: "Audit it",
							points: [
								"`npx skills add vercel-labs/agent-skills`",
								"“Review my UI” → 100+ rules, `file:line`, on every pass",
								"Aug 2026 · [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)",
							],
						},
					],
				},
				{
					type: "cards",
					id: "part-5-references",
					chapter: "References worth a bookmark",
					title: "Keep these open in a **tab**.",
					note: "Not the Part 3 standards again — these are the four I keep open while designing with an agent. Every one has a date.",
					cards: [
						{
							title: "The anti-slop framework",
							subtitle: "Mohamed Elkholy — May 2026",
							points: [
								"5 stages, 3 disciplines — the spine this whole talk is built on",
								"Read it once; it names the thing you keep re-deriving on your own",
								"May 2026 · [moelkholy1995.medium.com](https://moelkholy1995.medium.com/beyond-make-it-beautiful-the-anti-slop-framework-for-ai-frontend-craftsmanship-c99bbee6c994)",
							],
						},
						{
							title: "Web Interface Guidelines",
							subtitle: "Vercel Labs — Aug 2026",
							points: [
								"100+ rules under nine headings: interactions, animations, layout, content, forms, performance, design",
								"The list `web-design-guidelines` fetches fresh on every review — read it once, so a finding is something you can argue with",
								"Aug 2026 · [vercel-labs/web-interface-guidelines](https://github.com/vercel-labs/web-interface-guidelines)",
							],
						},
						{
							title: "Details that make interfaces feel better",
							subtitle: "Jakub Krehel — Mar 2026",
							points: [
								"`text-wrap: balance` on titles, concentric radii, tabular numerals, interruptible motion — small things that compound",
								"By the hands behind the `better-*` skills in the five; the tips ship as a skill of their own too",
								"Mar 2026 · [jakub.kr/writing/details-that-make-interfaces-feel-better](https://jakub.kr/writing/details-that-make-interfaces-feel-better)",
							],
						},
						{
							title: "A Review Checklist for AI-Generated UI",
							subtitle: "21st.dev — Aug 2026",
							points: [
								"Six passes in the order that catches most for least: is it in the HTML, the keyboard, the states nobody generates",
								"The gap a screenshot review cannot see — what only exists in the source",
								"Aug 2026 · [21st.dev/blog/ai-generated-ui-review-checklist](https://21st.dev/blog/ai-generated-ui-review-checklist)",
							],
						},
					],
				},
				{
					type: "keypoints",
					id: "everything-here-has-a-link",
					chapter: "Everything here has a link",
					standalone: true,
					title: "Everything here has a **link**.",
          split: "golden-flip",
					points: [
						"[moelkholy1995.medium.com](https://moelkholy1995.medium.com/beyond-make-it-beautiful-the-anti-slop-framework-for-ai-frontend-craftsmanship-c99bbee6c994) — the anti-slop framework this talk follows",
						"[emilkowalski/skills](https://github.com/emilkowalski/skills) · [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design)",
						"[vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) · [jakubkrehel/skills](https://github.com/jakubkrehel/skills) · [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser)",
						"[vercel-labs/web-interface-guidelines](https://github.com/vercel-labs/web-interface-guidelines) · [jakub.kr](https://jakub.kr/writing/details-that-make-interfaces-feel-better) · [21st.dev/blog/ai-generated-ui-review-checklist](https://21st.dev/blog/ai-generated-ui-review-checklist)",
						"[impeccable.style](https://impeccable.style) · [skillui.vercel.app](https://skillui.vercel.app) · [getdesign.md](https://getdesign.md) · [tasteskill.dev](https://tasteskill.dev)",
						"[designparser.de](https://designparser.de) · [lawsofux.com](https://lawsofux.com) · [developer.apple.com/design](https://developer.apple.com/design) · [w3.org/TR/WCAG22](https://www.w3.org/TR/WCAG22)",
					],
				},
			],
		},
		{
			id: "closing",
			label: "Closing",
			slides: [
				{
					type: "process",
					id: "final-takeaway",
					chapter: "The RED framework",
					kicker: "THE RED FRAMEWORK",
					mark: "block",
					title:
						"Good AI design prompts shape the **thinking** that creates the screen.",
					steps: [
						{
							n: "R",
							tone: "teal",
							title: "Research",
							subtitle: "Shape the idea",
							points: [
								"Study competitors, proven flows, and references",
								"Look past individual screens — find what repeats",
								"Decide what the experience must achieve before designing it",
							],
						},
						{
							n: "E",
							tone: "blue",
							title: "Encode",
							subtitle: "Reduce the ambiguity",
							points: [
								"Convert research into explicit `PRODUCT.md` + `DESIGN.md` decisions",
								"Reduce ambiguity: fewer choices, clearer constraints",
							],
						},
						{
							n: "D",
							tone: "violet",
							title: "Develop",
							subtitle: "Evaluate and harden",
							points: [
								"Build from the encoded rules",
								"Critique against evidence, conventions, and constraints",
								"Audit the result — then feed what you learn back into Research",
							],
						},
					],
					loop: "REPEAT R → E → D",
				},
			],
		},
		{
			id: "bonus",
			label: "Bonus Tips",
			slides: [
				{
					type: "divider",
					id: "bonus-tracks",
					chapter: "Bonus track",
					number: "Bonus",
					title: "But... I don't want to code or **install** anything.",
					note: "You don't have to. You can still apply the RED framework without writing any code — you just have to be more directive in your prompt.",
				},
				{
					type: "promptrun",
					id: "bonus-landing-page-prompting",
					chapter: "1 · Landing page prompt example",
					title: "Landing page **prompt** example",				
					prompt: {
						label: "The prompt",
						source: "landing-page.md"						
					},
					results: [
						{
							label: "ChatGPT · GPT-5.6",
							detail: "High effort, single prompt",
							image: {
								src: "showcase/prompt-1-gpt-5-6.png",
								alt: "The 3DUniversum landing page GPT-5.6 returned: a wide headline over a point-cloud render, with the client logos beneath.",
							},
							href: "results/prompt-1-gpt-5-6.html",
						},
						{
							label: "Claude Opus 5",
							detail: "High effort, single prompt",
							image: {
								src: "showcase/prompt-1-claude-opus-5.png",
								alt: "The 3DUniversum landing page Claude Opus 5 returned: 'We turn cameras into measurement instruments' beside a live depth-sample capture.",
							},
							href: "results/prompt-1-claude-opus-5.html",
						},
					],
				},

				{
					type: "promptrun",
					id: "bonus-newsletter-prompting",
					chapter: "2 · Newsletter prompt example",
					title: "Newsletter **prompt** example",				
					prompt: {
						label: "The prompt",
						source: "newsletter.md"						
						
					},
					results: [
						{
							label: "ChatGPT · GPT-5.6",
							detail: "High effort, single prompt",
							image: {
								src: "showcase/prompt-2-gpt-5-6.png",
								alt: "The weScan BENG announcement GPT-5.6 returned: headline beside the elevation drawing, with the report CTA under it.",
							},
							href: "results/prompt-2-gpt-5-6.html",
						},
						{
							label: "Claude Opus 5",
							detail: "High effort, single prompt",
							image: {
								src: "showcase/prompt-2-claude-opus-5.png",
								alt: "The weScan BENG announcement Claude Opus 5 returned: a single column, headline over the full-width elevation drawing.",
							},
							href: "results/prompt-2-claude-opus-5.html",
						},
					],
				}
			],
		},
	],
} satisfies Deck;

export default deck;
