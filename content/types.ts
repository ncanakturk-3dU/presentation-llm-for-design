/**
 * What a deck is allowed to be.
 *
 * A deck is data, and it used to be JSON — which meant the only thing that
 * checked it was the renderer, at the moment someone was presenting. A
 * misspelled `type`, a `tone` that is not a tone, a `table` with three columns:
 * all of them rendered something, and the something was wrong. Here they are
 * type errors, and the editor says so while the deck is being written.
 *
 * Every archetype is one member of `SlideItem`, discriminated on `type`, so
 * adding a field to `divider` cannot silently become a field on `quote`. The
 * union is also what `Slides.tsx` switches over: a new archetype that is not
 * handled there is a compile error, not a blank slide.
 *
 * Optional means optional in the layout, not "not written yet". A field the
 * archetype cannot render without is required here.
 */

/** Ground. Defaults per archetype in `slideTheme()`; an item may override. */
export type Theme = 'light' | 'dark'

/** The `process` step tones — specimen colors, not palette tokens. */
export type StepTone = 'teal' | 'blue' | 'violet' | 'ink'

/**
 * The `table` row tones. The red/orange/yellow/muted ladder is for a severity
 * table; a matrix or a reference list uses `ink`, because `muted` renders in
 * `--ink-faint` and does not reach AA.
 */
export type RowTone = 'red' | 'orange' | 'yellow' | 'muted' | 'ink'

/** What stands in front of each row of a `divider` or `keypoints` list. */
export type ListMarker = 'number' | 'bullet' | 'none'

/**
 * A `divider`'s or `keypoints`' main-to-list proportion, on the golden scale.
 *
 * `golden` is φ : 1 (61.8 : 38.2) and is also what a divider gets when the
 * field is left out, so the unset case is a proportion rather than an
 * accident. `golden-flip` is the same ratio the other way up, for a section
 * whose list is the substance and whose title is the label on it. `even` is
 * the one deliberate exception: two things of equal weight — and it is what
 * `keypoints` has always been, so that is the proportion *it* keeps when the
 * field is left out.
 *
 * Three steps and no more. A scale earns its name by being short — 30 : 70 was
 * a number someone typed, not a proportion anyone chose.
 */
export type ListSplit = 'golden' | 'even' | 'golden-flip'

/** How a `codeui` pane is lexed: JS/TS by default, or Markdown for a .md file. */
export type CodeLang = 'tsx' | 'md'

/** The `codeui` preview's button styles. */
export type ButtonVariant = 'primary' | 'secondary' | 'danger'

/** The `twocolumn` mock screens: the plain one and the branded one. */
export type ColumnVariant = 'plain' | 'brand'

/**
 * On every item. `id` is required because designlab states pin ids, never
 * indexes — an item without one cannot be captured, and `npm run lab:states`
 * refuses a deck that has any. `chapter` is the short label the Contents
 * outline and the studio's state labels read.
 */
type Base = {
  id: string
  chapter?: string
  theme?: Theme
}

export type CoverItem = Base & {
  type: 'cover'
  title: string
  subtitle?: string
}

export type DividerItem = Base & {
  type: 'divider'
  number?: string
  title: string
  note?: string
  /** Omit it, or leave it empty, and the slide switches to its solo layout. */
  list?: string[]
  marker?: ListMarker
  split?: ListSplit
}

/**
 * A title and the numbered list that carries it.
 *
 * `marker` and `split` are the same two fields `divider` takes, and they mean
 * the same things here — the archetypes are the same shape, a claim beside a
 * list, so a proportion that can be tried on one can be tried on the other.
 * Unset, the list is numbered and the columns are even, which is what every
 * `keypoints` slide was before the fields existed.
 */
export type KeyPointsItem = Base & {
  type: 'keypoints'
  kicker?: string
  title: string
  points: string[]
  marker?: ListMarker
  split?: ListSplit
}

/**
 * A list of failings and one screen that has all of them.
 *
 * The numbers are the join: row `n` in the list and pin `n` on the image are
 * the same claim, so the pin is what proves the row rather than decorating it.
 * `pin` is optional because some failings do not survive a still — an
 * animation is named in the list and has nothing to point at.
 */
export type CalloutsItem = Base & {
  type: 'callouts'
  kicker?: string
  title: string
  note?: string
  /** One image. Same `src` rule as `showcase`: a `public/` path, no leading slash. */
  image: { src?: string; alt: string; label?: string }
  /** Numbered in order. `pin` is a percentage of the image, from its top left. */
  points: Array<{ text: string; pin?: { x: number; y: number } }>
  status?: string
}

export type TwoColumnItem = Base & {
  type: 'twocolumn'
  kicker?: string
  title: string
  note?: string
  columns: Array<{
    variant: ColumnVariant
    label: string
    caption: string
    note?: string
  }>
}

export type ProcessItem = Base & {
  type: 'process'
  kicker?: string
  title: string
  steps: Array<{
    n: string
    tone?: StepTone
    title: string
    points: string[]
  }>
}

/**
 * What a card says under its title: a list of short lines, or one paragraph.
 * Never both — a card that argues twice in two shapes is two cards — and never
 * neither, which is a card that was started and not finished. The union is what
 * makes both of those a type error rather than an empty half-card on stage.
 */
export type CardBody =
  | { points: string[]; text?: never }
  | { text: string; points?: never }

/**
 * One card. `title` is whatever the card is about — a prompt, a filename, a
 * name — and `subtitle` is the line that says what the content under it is.
 */
export type Card = {
  title: string
  subtitle?: string
} & CardBody

export type CardsItem = Base & {
  type: 'cards'
  kicker?: string
  title: string
  note?: string
  /**
   * Set when the titles are things somebody said or typed — prompts, replies —
   * and every card title is wrapped in quotation marks by the element itself,
   * so an author writes them as plain text and cannot end up with two sets.
   * Left out, a title is just a title: a filename, a label, a name.
   */
  quoted?: boolean
  cards: Card[]
}

export type CodeUIItem = Base & {
  type: 'codeui'
  kicker?: string
  title: string
  /** The tab label over the source pane. */
  file?: string
  /** Where the real file lives. Set it and the tab label becomes the link. */
  href?: string
  code: string
  /** Defaults to `tsx`; a Markdown pane wants `md` or its prose is mis-lexed. */
  lang?: CodeLang
  preview?: {
    title?: string
    buttons?: Array<{ label: string; variant: ButtonVariant }>
    statesLabel?: string
    states?: string[]
    /**
     * A two-column table in the preview pane: a term and one line saying what
     * it is. The evidenced sibling of `states` — chips name things, rows
     * explain them. Both may appear; rows render under the chips.
     */
    rows?: Array<{ label: string; detail: string }>
  }
  note?: string
}

export type TableItem = Base & {
  type: 'table'
  kicker?: string
  title: string
  note?: string
  /** Exactly four: the layout has four columns and no more. */
  columns: [string, string, string, string]
  rows: Array<{
    severity: string
    tone?: RowTone
    meaning: string
    examples: string
    action: string
  }>
}

export type QuoteItem = Base & {
  type: 'quote'
  quote: string
  closer?: string
  byline?: string
}

export type ShowcaseItem = Base & {
  type: 'showcase'
  kicker?: string
  title: string
  note?: string
  /**
   * One or two. `src` is a path inside `public/` written without a leading
   * slash; an image with no `src` draws its `alt` in a dashed frame, which is
   * how a placeholder for work with no screenshot stays visibly a placeholder.
   */
  images: Array<{ src?: string; alt: string; label?: string }>
  status?: string
  link?: string
}

export type SlideItem =
  | CoverItem
  | DividerItem
  | KeyPointsItem
  | CalloutsItem
  | TwoColumnItem
  | ProcessItem
  | CardsItem
  | CodeUIItem
  | TableItem
  | QuoteItem
  | ShowcaseItem

/** Every archetype's name, derived from the union rather than restated. */
export type SlideType = SlideItem['type']

export type Deck = {
  /** The name shown top-left, all the way through the deck. */
  meta: { mark: string }
  items: SlideItem[]
}
