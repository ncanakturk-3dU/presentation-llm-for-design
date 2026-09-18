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
 * How big a `process` step's mark is drawn.
 *
 * `chip` is the small rounded square a numbered flow carries: the numeral
 * orders the cards and then gets out of the way. `block` is a tile the height
 * of the card's band with the mark set large inside it, for a flow whose marks
 * are themselves the takeaway — a named framework whose initials the room is
 * meant to carry out of the talk.
 */
export type StepMark = 'chip' | 'block'

/**
 * The `table` row tones. The red/orange/yellow/muted ladder is for a severity
 * table; a matrix or a reference list uses `ink`, because `muted` renders in
 * `--ink-faint` and does not reach AA.
 */
export type RowTone = 'red' | 'orange' | 'yellow' | 'muted' | 'ink'

/**
 * What the cover does with its sphere when the slide is one column wide.
 *
 * On a laptop there is no question: the title takes the left two thirds and
 * the sphere sits off the right edge behind it, too big for the frame on
 * purpose. A phone has no right edge to spare, so it has to choose, and this
 * is the choice.
 *
 * `overlap` keeps the laptop's reading — the sphere stays oversized and runs
 * off the edge, with the title over it. `stack` is the safe one: the sphere
 * shrinks to a square under the subtitle, fully inside the column, nothing
 * behind any text. The field does nothing above 940px, where both readings
 * are the same picture.
 */
export type CoverArt = 'overlap' | 'stack'

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

/**
 * Every picture in the deck opens full size when it is clicked, and that is the
 * default rather than a flag each slide has to remember. `lightbox: false` is
 * the opt-out, for a still that is decoration rather than evidence — there is
 * nothing to look closer at, so a cursor that promises a closer look lies.
 *
 * It does nothing in designlab's component host: a variant has no deck around
 * it, so there is no overlay to open.
 */
/** How a `codeui` pane is lexed: JS/TS by default, or Markdown for a .md file. */
export type CodeLang = 'tsx' | 'md'

/** The `codeui` preview's button styles. */
export type ButtonVariant = 'primary' | 'secondary' | 'danger'

/** The `twocolumn` mock screens: the plain one and the branded one. */
export type ColumnVariant = 'plain' | 'brand'

/**
 * On every item. `id` is required because designlab states pin ids, never
 * indexes — an item without one cannot be captured, and `npm run lab:states`
 * refuses a deck that has any.
 *
 * `chapter` is the slide's name — the short plain label the Contents outline
 * and the studio's state labels read, one level below the `Part` that holds
 * it. It is required, and it is not the same thing as `title`: a title is
 * written to be read off a projector at the back of a room, so it is a
 * sentence and it carries the accent word. An outline is read as a list of
 * places, and a list of sentences is not a list of places. Two fields because
 * they are two jobs; required because a slide with no name in the outline is a
 * row you cannot navigate by.
 *
 * `standalone` no longer decides which part a slide belongs to: the deck is
 * nested, so a slide belongs to the part whose `slides` array it is written in
 * and cannot drift out of it. What is left is the chrome — set it and the
 * slide draws no part reference in the corner. That is for the two slides
 * whose own title already is the whole slide: the cover, and a full-bleed
 * reference list that answers to nothing above it.
 */
type Base = {
  id: string
  chapter: string
  theme?: Theme
  standalone?: boolean
}

/**
 * The code the room scans off the title card.
 *
 * `src` is a path inside `public/` written without a leading slash, the same
 * rule `showcase` takes. On the slide it is a small mark under the subtitle
 * rather than the code itself: a QR printed at icon size is a decoration
 * nobody can scan, so the mark is the invitation and the tap is what puts the
 * code on the wall at the size a phone across the room can read. `label` is
 * what the overlay captions it with, and `href` is the same address in text,
 * for the reader who is looking at the deck rather than at the projector.
 */
export type CoverQR = {
  src: string
  alt: string
  label?: string
  href?: string
  /**
   * A page that draws the code live, framed in the overlay instead of the
   * still — desktop only. The phone keeps `src`: an iframe of a whole page is
   * a layout inside a layout on a 393px screen, and the code is what is
   * wanted there. A room with no network gets nothing from a frame either, so
   * `src` stays required and stays the fallback.
   */
  embed?: string
}

export type CoverItem = Base & {
  type: 'cover'
  title: string
  subtitle?: string
  /** Phone only; unset is `overlap`. See `CoverArt`. */
  art?: CoverArt
  /** A code to scan, shown as a mark that opens it full size. See `CoverQR`. */
  qr?: CoverQR
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
  image: { src?: string; alt: string; label?: string; lightbox?: boolean }
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
  /** How the step marks are drawn. Unset is `chip`, the small numbered square. */
  mark?: StepMark
  /**
   * What the return is called — set it and the flow draws a path from the last
   * step back to the first, which is the difference between a loop and a
   * pipeline that happens to be named one. Left out, the flow ends where its
   * last card ends.
   */
  loop?: string
  steps: Array<{
    n: string
    tone?: StepTone
    title: string
    /**
     * A second line under the step's name, on the same band: what the step is
     * called in the language the slide's title uses. It is the step restated,
     * not a first point — the points are what the step does.
     */
    subtitle?: string
    points: string[]
    /**
     * What the move to the *next* step is called — one word, set over the
     * connector that leaves this card. It belongs to the arrow, not to the
     * step, which is why the last step's is never drawn. Left out, the arrow
     * is drawn unlabelled.
     */
    via?: string
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
  /**
   * Put a copy button on the pane. Opt-in, because most of this deck's panes
   * are folded specimens — a structure with `⋯ 6 lines` standing in for its
   * body — and a button that hands someone those ellipses as if they were the
   * file is worse than no button. Set it on a pane whose text is the whole
   * thing and meant to be taken away, which is what a prompt is.
   */
  copy?: boolean
  /**
   * What the copy button hands over, when that is not what the pane shows.
   *
   * A long prompt cannot be read from the back of a room at any size that also
   * fits fifty lines, so the pane shows it folded — its sections, and what each
   * one holds — while the button still gives the whole thing. Leave it out and
   * the button copies exactly what is on screen, which is the honest default
   * for every pane short enough to show in full.
   */
  copyText?: string
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

/**
 * A short reference of calls: what you type, and what each one leaves behind.
 *
 * It is neither of the two archetypes that keep getting reached for here.
 * `codeui` is a document beside an explanation of it, and a set of commands has
 * no document — a pane with a file tab over four annotated lines is a file that
 * does not exist. `keypoints` is a claim beside prose, and a line whose subject
 * is a command and whose object is a file is two columns pretending to be a
 * sentence: the room reads it for the words and loses the syntax.
 *
 * So: one row per call, the command set in mono at the left, what it writes
 * beside it, and the line that says what it is for. `rules` is what governs the
 * whole set rather than any one row — how often it is run, and what it assumes.
 */
export type CommandsItem = Base & {
  type: 'commands'
  kicker?: string
  title: string
  note?: string
  /**
   * One picture beside the calls: what the call puts on screen. Same `src`
   * rule as `showcase` — a `public/`-relative path with no leading slash, and
   * an image with no `src` draws its alt text in a dashed frame, which is the
   * honest placeholder for a capture that does not exist yet. Left out, the
   * calls take the whole stage.
   */
  image?: { src?: string; alt: string; label?: string; lightbox?: boolean }
  /**
   * The proportion between the calls and the picture, on a slide that has one:
   * the same three steps `divider` and `keypoints` take. Unset is
   * `golden-flip` — the picture wide, the calls narrow — because a capture is
   * the thing that needs the width. `golden` turns it round when the calls are
   * what the slide is about and the picture is only there to prove the screen
   * exists. Ignored on a slide with no `image`.
   */
  split?: ListSplit
  /**
   * A copy button on every console, because a call on a slide is meant to be
   * taken away rather than transcribed from a projector. On by default; set it
   * false for a call that is an illustration rather than something to run.
   */
  copy?: boolean
  commands: Array<{
    /** Typed verbatim, set in mono. The syntax is the point of the row. */
    run: string
    /** What the call leaves behind — a file, usually. Left out for one that writes nothing. */
    writes?: string
    /** One line: what it is for. */
    detail: string
  }>
  /**
   * What holds for every row: when the set is run, when it is not, what it
   * assumes. Under the list, because a rule attached to one row is a detail.
   */
  rules?: string[]
}

/**
 * One prompt, and what more than one model did with it.
 *
 * Three columns: the prompt on the left, and a result per model beside it. It
 * is the archetype for the bonus track, where the claim is not "here is a
 * prompt" but "here is a prompt, and here is what came back" — which only
 * holds up if the answers are on the same slide as the question that produced
 * them.
 *
 * The prompt is not written here. `source` names a file in `content/prompts/`,
 * and that file is what the pane shows and what the copy button hands over, so
 * the thing on the slide and the thing in somebody's clipboard cannot drift
 * apart. A result is a still with a link: the page it came from is too small to
 * read on a slide, so the thumbnail is the exhibit and `href` is where it opens
 * full size.
 */
export type PromptRunItem = Base & {
  type: 'promptrun'
  kicker?: string
  title: string
  note?: string
  prompt: {
    /** The column heading, e.g. `The prompt`. */
    label: string
    /** A file name in `content/prompts/`, e.g. `landing-page.md`. */
    source: string
    /** The line under the heading: how it was run, what it assumed. */
    detail?: string
    /** Opened in a new tab from this column — the page being redesigned, usually. */
    href?: string
    /** What that link says. Defaults to the href's host. */
    hrefLabel?: string
  }
  /**
   * One per model. Two is what the layout is drawn for; a third column of
   * results makes every column too narrow to read a thumbnail in.
   */
  results: Array<{
    /** The model, named as it should be said out loud: `Claude Opus 5`. */
    label: string
    /** How it was run: `high effort · single prompt`. */
    detail?: string
    /** Same `src` rule as `showcase`: a `public/` path, no leading slash. */
    image?: { src?: string; alt: string; lightbox?: boolean }
    /** The returned page itself, opened full size in a new tab. */
    href?: string
  }>
}

export type TableItem = Base & {
  type: 'table'
  kicker?: string
  title: string
  note?: string
  /**
   * Three or four, and no other count: the layout is a label column, two
   * prose columns and an optional last one for where the row comes from. A
   * three-column table simply leaves `action` off its rows.
   */
  columns: [string, string, string] | [string, string, string, string]
  rows: Array<{
    severity: string
    tone?: RowTone
    meaning: string
    examples: string
    /** The fourth column. Omitted on a three-column table. */
    action?: string
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
   * A numbered column between two images — what was found in the first, and
   * answered in the second. Only drawn on a two-image showcase, because a
   * middle column with nothing either side of it is a list with a picture.
   */
  points?: string[]
  /**
   * One or two. `src` is a path inside `public/` written without a leading
   * slash; an image with no `src` draws its `alt` in a dashed frame, which is
   * how a placeholder for work with no screenshot stays visibly a placeholder.
   *
   * `href` makes the frame a link — the picture on the slide is a still of a
   * page that is too small to read from the back of a room, and the link is
   * where it opens full size. It takes the same kind of path as `src`, so a
   * result kept in `public/` is `results/thing.html`, and a hosted one is its
   * URL.
   */
  images: Array<{ src?: string; alt: string; label?: string; href?: string; lightbox?: boolean }>
  status?: string
  /**
   * The source line under the pictures: where the work on the slide actually
   * lives. It takes the same inline Markdown as any other prose field, so
   * `[text](href)` renders as a real link and opens in a new tab — a URL set as
   * plain text is one nobody in the room can follow.
   */
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
  | CommandsItem
  | PromptRunItem
  | QuoteItem
  | ShowcaseItem

/** Every archetype's name, derived from the union rather than restated. */
export type SlideType = SlideItem['type']

/**
 * A part: the deck's top level, and a real category rather than a label.
 *
 * It used to be inferred. `items` was one flat array and a slide's part was
 * whichever `divider` happened to sit above it, so moving a slide moved it
 * between parts silently and a closing line needed a `standalone` flag to
 * escape the part it had never meant to join. Nesting makes membership
 * structural: a slide is in the part whose `slides` it is written in, there is
 * no rule to remember, and a reorder that crosses a part boundary is a visible
 * move in the diff.
 *
 * `label` is the short name — the Contents heading and the running header.
 * There is no `number` here on purpose: a numbered part opens on a `divider`
 * and that divider's own `number` is the numeral drawn on it, so asking for the
 * number twice would be asking for two places to disagree. `partNumber()` in
 * `src/lib/parts.ts` reads it off the opening divider. A part with no divider —
 * the intro, the closing, a bonus section — has no number and shows its label
 * alone.
 *
 * `slides` may be empty. A part that is named but not yet written renders
 * nothing and lists nothing, so the slot can exist in the file before the
 * content does.
 */
export type Part = {
  id: string
  label: string
  slides: SlideItem[]
}

export type Deck = {
  /** The name shown top-left, all the way through the deck. */
  meta: { mark: string }
  parts: Part[]
}
