import type { ReactNode } from 'react'
import CopyButton from '../components/CopyButton/CopyButton'
import CoverOrb from '../components/CoverOrb/CoverOrb'
import { renderInline, highlightCode, pad, stripMarks } from '../lib/text'
import { useLightbox } from '../components/Lightbox/Lightbox'
import { promptText } from '../lib/prompts'
import type {
  CalloutsItem,
  CodeUIItem,
  CommandsItem,
  CoverItem,
  DividerItem,
  KeyPointsItem,
  ProcessItem,
  PromptRunItem,
  CardsItem,
  QuoteItem,
  ShowcaseItem,
  SlideItem,
  SlideType,
  TableItem,
  Theme,
  TwoColumnItem,
} from '../../content/types'
import './slides.css'

/**
 * A style object that also carries CSS custom properties. React types `style`
 * as `CSSProperties`, which has no room for `--rows`, and the alternative to
 * this one alias is a cast at every call site.
 */
type CSSVars = React.CSSProperties & Record<`--${string}`, string | number>

export const slideTheme = (type: SlideType): Theme =>
  type === 'cover' || type === 'keypoints' || type === 'callouts' ? 'dark' : 'light'

export const itemTheme = (item: SlideItem): Theme => item.theme || slideTheme(item.type)

export function slideTitle(item: SlideItem): string {
  const named = 'title' in item ? item.title : 'quote' in item ? item.quote : undefined
  return stripMarks(named || item.chapter || item.type)
}

export function slideOutline(item: SlideItem): string[] {
  switch (item.type) {
    case 'divider':
      return item.list || []
    case 'keypoints':
      return item.points || []
    case 'callouts':
      return (item.points || []).map((p) => p.text)
    case 'twocolumn':
      return (item.columns || []).map((c) => `${c.label} — ${c.caption}`)
    case 'process':
      return (item.steps || []).map((s) => s.title)
    case 'cards':
      return (item.cards || []).map((c) => c.title)
    case 'commands':
      return [
        ...(item.commands || []).map((c) => `${c.run} — ${c.detail}`),
        ...(item.rules || []),
      ]
    case 'table':
      return (item.rows || []).map((r) => `${r.severity} — ${r.meaning}`)
    case 'codeui':
      return [
        ...(item.preview?.buttons || []).map((b) => b.label),
        ...(item.preview?.rows || []).map((r) => `${r.label} — ${r.detail}`),
      ]
    case 'promptrun':
      return (item.results || []).map((r) => (r.detail ? `${r.label} — ${r.detail}` : r.label))
    case 'cover':
      return item.subtitle ? [item.subtitle] : []
    case 'quote':
      return item.closer ? [item.closer] : []
    case 'showcase':
      return (item.images || []).flatMap((im) => (im.label ? [im.label] : []))
    default:
      return []
  }
}

type HeadProps = { kicker?: string; title?: string; note?: string }

function Head({ kicker, title, note }: HeadProps) {
  return (
    <header className="shead">
      {kicker && <span className="mono kicker">{kicker}</span>}
      {title && <h2 className="shead__title">{renderInline(title)}</h2>}
      {note && <p className="shead__note">{renderInline(note)}</p>}
    </header>
  )
}

/**
 * The title card: the line the talk is called, and the orb behind it.
 *
 * `art` is the phone's copy of the laptop's reading. Unset is `overlap`,
 * because the laptop's is the one the deck was designed at: the orb too big
 * for its frame, running off the right edge, the title in front of it. `stack`
 * is the way out for a title long enough that the two argue.
 */
function Cover({ item, reduced, still }: { item: CoverItem; reduced: boolean; still: boolean }) {
  return (
    <div className="cover" data-art={item.art ?? 'overlap'}>
      <div className="cover__text">
        <h1 className="cover__title">{renderInline(item.title)}</h1>
        {item.subtitle && <p className="cover__sub">{renderInline(item.subtitle)}</p>}
      </div>
      <div className="cover__art">
        <CoverOrb state="connecting" dark={itemTheme(item) === 'dark'} reduced={reduced} still={still} />
      </div>
    </div>
  )
}

/**
 * A section opener: numeral, title, note, and — optionally — the list of what
 * the section holds.
 *
 * An empty `list` counts as no list, not as a list with nothing in it. Without
 * that, an author who deletes the four rows still gets the two-column grid and
 * a dead right half. With no list the grid goes 2:1 and the type steps up a
 * size, so the void on the right is a proportion someone chose rather than the
 * shape of a column that lost its contents.
 */
function Divider({ item }: { item: DividerItem }) {
  const list = Array.isArray(item.list) && item.list.length ? item.list : null
  // `marker` is what stands in front of each row: the accent numerals, a dot,
  // or nothing. It also picks the element, because that is the real difference
  // — an `ol` claims the order matters, a `ul` does not. No runtime guard on
  // either of these: `ListMarker` and `ListSplit` are closed unions, so
  // the only values that reach here are ones the CSS has a rule for.
  const marker = item.marker ?? 'number'
  const numbered = marker === 'number'
  const List = numbered ? 'ol' : 'ul'
  // `split` is the main-to-list proportion. Unset keeps the type's own, which
  // is deliberately not one of the three: it is what a divider looks like when
  // nobody has had an opinion about it.
  const split = item.split ?? null
  return (
    <div className={`divider${list ? '' : ' divider--solo'}`} data-split={list ? split : null}>
      <div className="divider__main">
        {item.number && <div className="divider__num">{item.number}</div>}
        <h2 className="divider__title">{renderInline(item.title)}</h2>
        {item.note && <p className="divider__note">{renderInline(item.note)}</p>}
      </div>
      {list && (
        // `--rows` lets the row rhythm answer to how many rows there are: four
        // topics get the full padding, nine share the same block of height
        // instead of running off the stage.
        <List className={`divider__list divider__list--${marker}`} style={{ '--rows': list.length } as CSSVars}>
          {list.map((l, i) => (
            <li key={i} className="divider__row">
              {numbered && <span className="mono divider__n">{pad(i + 1)}</span>}
              <span className="divider__label">{renderInline(l)}</span>
            </li>
          ))}
        </List>
      )}
    </div>
  )
}

/**
 * The same two knobs a `divider` takes, on the same reading.
 *
 * `marker` picks the element as well as what stands in front of a row, because
 * that is the real difference: an `ol` claims the order matters, a `ul` does
 * not. `split` is the title-to-list proportion. Both default to what every
 * `keypoints` slide looked like before the fields existed — numbered rows in
 * even columns — so an item that sets neither is untouched.
 */
function KeyPoints({ item }: { item: KeyPointsItem }) {
  const marker = item.marker ?? 'number'
  const numbered = marker === 'number'
  const List = numbered ? 'ol' : 'ul'
  const split = item.split ?? null
  return (
    <div className="keypoints" data-split={split}>
      <Head kicker={item.kicker} title={item.title} />
      <List className={`keypoints__list keypoints__list--${marker}`}>
        {(item.points || []).map((p, i) => (
          <li key={i} className="keypoints__row">
            {numbered && <span className="keypoints__badge mono">{pad(i + 1)}</span>}
            <span className="keypoints__text">{renderInline(p)}</span>
          </li>
        ))}
      </List>
    </div>
  )
}

/**
 * The list on the left, the evidence on the right. Each pin carries the number
 * of the row it belongs to, and a row whose failing cannot be seen in a still
 * simply has no pin — the number stays, so the list keeps counting straight.
 */
function Callouts({ item }: { item: CalloutsItem }) {
  const points = item.points || []
  const base = import.meta.env.BASE_URL || '/'
  const src = item.image?.src
  return (
    <div className="callouts">
      <div className="callouts__side">
        <Head kicker={item.kicker} title={item.title} />
        <ol className="callouts__list">
          {points.map((p, i) => (
            <li key={i} className={`callouts__row ${p.pin ? '' : 'callouts__row--unpinned'}`}>
              <span className="callouts__badge mono">{pad(i + 1)}</span>
              <span className="callouts__text">{renderInline(p.text)}</span>
            </li>
          ))}
        </ol>
      </div>
      <figure className="callouts__fig">
        <div className="callouts__frame">
          {/* The pins are positioned against this, and it shrink-wraps the
              picture, so a coordinate is a percentage of the image itself. Hung
              on the frame instead, every pin on a letterboxed image pointed at
              the wrong thing — and by a different amount per image. */}
          <div className="callouts__stage">
            {src ? (
              <Shot
                className="callouts__img"
                src={/^(https?:|data:|\/)/.test(src) ? src : base + src}
                alt={item.image.alt || ''}
                label={item.image.label}
                lightbox={item.image.lightbox}
              />
            ) : (
              <span className="callouts__placeholder mono">{item.image?.alt || 'no image'}</span>
            )}
            {points.map((p, i) =>
              p.pin ? (
                <span
                  key={i}
                  className="callouts__pin mono"
                  style={{ '--x': `${p.pin.x}%`, '--y': `${p.pin.y}%` } as CSSVars}
                  aria-hidden="true"
                >
                  {pad(i + 1)}
                </span>
              ) : null,
            )}
          </div>
        </div>
        <figcaption className="callouts__foot">
          {item.image?.label && <span className="callouts__cap mono">{item.image.label}</span>}
          {item.status && <span className="callouts__status mono">{item.status}</span>}
        </figcaption>
      </figure>
    </div>
  )
}

function MockAuth({ variant }: { variant: TwoColumnItem['columns'][number]['variant'] }) {
  const brand = variant === 'brand'
  return (
    <div className={`mock ${brand ? 'mock--brand' : 'mock--plain'}`}>
      {brand && (
        <span className="mock__check" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 6.5" />
          </svg>
        </span>
      )}
      <div className="mock__brandrow">
        {brand && <span className="mock__logomark" aria-hidden="true" />}
        <span className="mock__brandname">{brand ? 'Acme' : ''}</span>
      </div>
      <div className="mock__title">Welcome back</div>
      <div className="mock__sub">Sign in to your workspace</div>
      <div className="mock__field">
        <span>Email</span>
      </div>
      <div className="mock__field">
        <span>Password</span>
      </div>
      <div className={`mock__btn ${brand ? 'mock__btn--brand' : ''}`}>Sign in</div>
      <div className="mock__foot">{brand ? 'Keep me signed in' : 'Forgot password?'}</div>
    </div>
  )
}

function TwoColumn({ item }: { item: TwoColumnItem }) {
  return (
    <div className="twocol">
      <Head kicker={item.kicker} title={item.title} note={item.note} />
      <div className="twocol__grid">
        {(item.columns || []).map((c, i) => (
          <figure key={i} className="twocol__col">
            <div className="twocol__frame">
              <MockAuth variant={c.variant} />
            </div>
            <figcaption className="twocol__cap">
              <span className="mono twocol__label">{c.label}</span>
              <span className="twocol__caption">{renderInline(c.caption)}</span>
              {c.note && <span className="twocol__note">{renderInline(c.note)}</span>}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}

function Process({ item }: { item: ProcessItem }) {
  return (
    <div className="process" data-mark={item.mark || undefined}>
      <Head kicker={item.kicker} title={item.title} />
      <ol className="process__flow" style={{ '--steps': (item.steps || []).length || 4 } as CSSVars}>
        {(item.steps || []).map((s, i) => (
          <li key={i} className="process__step" data-tone={s.tone || 'ink'} style={{ '--i': i } as CSSVars}>
            <div className="process__card">
              {/* The band and the points are one card, not two siblings. A
                  card that closes above its own list tells the eye the content
                  ended before it began, and no amount of proximity undoes a
                  boundary. */}
              <div className="process__cardhead">
                <span className="process__chip mono">{s.n}</span>
                <span className="process__cardtext">
                  <span className="process__steptitle">{renderInline(s.title)}</span>
                  {/* The step said again in the title's words. It sits on the
                      band with the name rather than at the top of the list,
                      because a restatement read as a point is a point the
                      step does not have. */}
                  {s.subtitle && (
                    <span className="process__stepsub">{renderInline(s.subtitle)}</span>
                  )}
                </span>
              </div>
              <ul className="process__points">
                {(s.points || []).map((p, j) => (
                  <li key={j}>{renderInline(p)}</li>
                ))}
              </ul>
            </div>
            {/* The connector is three marks, not a line: a ring on the card it
                leaves, the curve, and a head on the card it arrives at. A line
                with unmarked ends reads as a stray rule. */}
            {i < (item.steps || []).length - 1 && (
              <span className="process__linkwrap" aria-hidden="true">
                {s.via && <em className="mono process__via">{s.via}</em>}
                {/* One SVG, one coordinate system. The ring, the curve and the
                    head were three absolutely-positioned boxes, and three
                    boxes sized off three different `calc()`s drift apart by a
                    pixel or two at some viewport — which is exactly what a
                    join between them shows. Here they are one 100x100 drawing
                    scaled as a square, so they cannot disagree. */}
                <svg className="process__link" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                  <path className="process__arrow" d="M7 0 H58 Q100 0 100 42 V90" />
                  <path className="process__arrow" d="M91 86 L100 97 L109 86" />
                  <circle className="process__ring" cx="0" cy="0" r="5" />
                </svg>
              </span>
            )}
          </li>
        ))}
      </ol>
      {/* The return. It is a row under the flow rather than a path drawn around
          it: the connectors between cards are hidden at phone width, where the
          flow is one column, and a loop that disappears on the narrow layout is
          a loop the deck only claims on the wide one. */}
      {item.loop && (
        <p className="process__loop">
          <svg className="process__loopcap" viewBox="0 0 13 13" aria-hidden="true">
            <path d="M7.5 1 L2 6.5 L7.5 12" />
          </svg>
          <span className="process__loopline" aria-hidden="true" />
          <em className="mono process__looplabel">{item.loop}</em>
          <span className="process__loopline" aria-hidden="true" />
          <span className="process__loopdot" aria-hidden="true" />
        </p>
      )}
    </div>
  )
}

/**
 * Parallel specimens, not steps: a row of cards that each quote one input
 * verbatim and list what it produces.
 *
 * The difference from `process` is the whole point of the type. A process
 * numbers its cards and draws a connector between them, which reads as "first
 * this, then that". A set of three bad prompts has no order — each one fails on
 * its own — so the cards here carry no numeral, no arrow, and no per-card tone.
 * They are deliberately identical, because their being interchangeable is the
 * argument the slide is making.
 */
/**
 * Specimen cards side by side, in no order: a title, the line that says what
 * sits under it, and either a list or a paragraph.
 *
 * Each card is three rows of the shared grid — title, subtitle, content — so
 * the rules and the lists line up across cards on measured heights. A card
 * with no subtitle leaves that row empty rather than pulling its own content
 * up out of line with its neighbours.
 */
function Cards({ item }: { item: CardsItem }) {
  const cards = item.cards || []
  // `q`, not a styled element with typed-in quotation marks: the marks belong
  // to the element, so a deck that quotes its titles cannot end up with two
  // sets of them. A title that is a filename or a name is not quoted at all.
  const Title = item.quoted ? 'q' : 'h3'
  return (
    <div className="cards" data-dense={cards.length >= 5 ? '' : undefined}>
      <Head kicker={item.kicker} title={item.title} note={item.note} />
      <ul className="cards__grid" style={{ '--cards': cards.length || 3 } as CSSVars}>
        {cards.map((c, i) => (
          <li key={i} className="cards__card">
            <Title className="cards__title">{renderInline(c.title)}</Title>
            {/* The placeholder carries the subtitle's own class: title and
                subtitle share one tinted header band, and a card without a
                subtitle would otherwise leave a strip of card ground inside
                the band while its neighbours are filled. */}
            {c.subtitle ? (
              <p className="cards__sub">{renderInline(c.subtitle)}</p>
            ) : (
              <span className="cards__sub" aria-hidden="true" />
            )}
            {c.points ? (
              <ul className="cards__points">
                {c.points.map((p, j) => (
                  <li key={j}>{renderInline(p)}</li>
                ))}
              </ul>
            ) : (
              <p className="cards__text">{renderInline(c.text)}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function CodeUI({ item }: { item: CodeUIItem }) {
  const pv = item.preview || {}
  return (
    <div className="codeui">
      <Head kicker={item.kicker} title={item.title} />
      <div className="codeui__grid">
        <div className="codeui__code">
          <div className="codeui__tab mono">
            {item.href ? (
              <a className="codeui__file" href={item.href} target="_blank" rel="noreferrer">
                {item.file || 'Button.tsx'}
              </a>
            ) : (
              item.file || 'Button.tsx'
            )}
            {item.copy && <CopyButton code={item.copyText || item.code || ''} />}
          </div>
          <div className="codeui__body">
            <div className="codeui__gutter" aria-hidden="true">
              {(item.code || '').split('\n').map((_, i) => (
                <span key={i}>{i + 1}</span>
              ))}
            </div>
            <pre className="codeui__pre">
              <code>{highlightCode(item.code || '', item.lang)}</code>
            </pre>
          </div>
        </div>
        <div className="codeui__preview">
          <span className="codeui__pvhead mono">{pv.title || 'Preview'}</span>
          <div className="codeui__buttons">
            {(pv.buttons || []).map((b, i) => (
              <span key={i} className={`pvbtn pvbtn--${b.variant}`}>
                {b.label}
              </span>
            ))}
          </div>
          {Array.isArray(pv.states) && pv.states.length > 0 && (
            <div className="codeui__variants">
              <span className="mono codeui__vlabel">{pv.statesLabel || 'Variants'}</span>
              <div className="codeui__vrow">
                {pv.states.map((s, i) => (
                  <span key={i} className="pvchip">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
          {Array.isArray(pv.rows) && pv.rows.length > 0 && (
            <div className="codeui__variants">
              {!pv.states?.length && pv.statesLabel && (
                <span className="mono codeui__vlabel">{pv.statesLabel}</span>
              )}
              <table className="pvtable">
                <tbody>
                  {pv.rows.map((r, i) => (
                    <tr key={i}>
                      <th scope="row">{renderInline(r.label)}</th>
                      <td>{renderInline(r.detail)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {item.note && <p className="codeui__note">{renderInline(item.note)}</p>}
    </div>
  )
}

function TableSlide({ item }: { item: TableItem }) {
  const cols = item.columns || []
  const rows = item.rows || []
  return (
    // Eight rows or more and the matrix drops a step: a severity ladder is
    // three or four rows, a reference list is ten, and the slide is clipped
    // rather than scrolled. The count decides it, the way it decides `cards`
    // and `commands` density — there is nothing to author.
    <div className="tableslide" data-dense={rows.length >= 8 ? '' : undefined}>
      <Head kicker={item.kicker} title={item.title} note={item.note} />
      <table className="matrix">
        <thead>
          <tr>
            {cols.map((c, i) => (
              <th key={i} className="mono">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>
                <span className={`sev sev--${r.tone}`}>{r.severity}</span>
              </td>
              <td className="matrix__strong">{renderInline(r.meaning)}</td>
              <td className="matrix__muted">{renderInline(r.examples)}</td>
              {/* The fourth column is optional: a three-column table is the
                  same matrix with the source folded into the prose, and an
                  empty cell in every row would draw a column that says
                  nothing. */}
              {cols.length > 3 && (
                <td>
                  <span className={`act act--${r.tone}`}>{r.action}</span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Quote({ item }: { item: QuoteItem }) {
  return (
    <div className="quoteslide">
      <div className="quoteslide__main">
        <span className="quoteslide__mark" aria-hidden="true">
          &ldquo;
        </span>
        <blockquote className="quoteslide__text">{renderInline(item.quote)}</blockquote>
        {item.closer && (
          <div className="quoteslide__side">
            <div className="quoteslide__closer">{renderInline(item.closer)}</div>
          </div>
        )}
      </div>
      {item.byline && <div className="quoteslide__byline">{item.byline}</div>}
    </div>
  )
}

/**
 * Real screenshots, one or two, under the standard eyebrow+heading.
 *
 * `src` is a path inside `public/` written without a leading slash
 * (`showcase/treeqr-studio.png`), resolved against Vite's `BASE_URL` so the
 * same JSON works on the dev server designlab renders through (`/`) and in the
 * relative-base production build GitHub Pages serves (`./`). An item with no
 * `src` draws the frame with its alt text in it, which is how a placeholder
 * slide for work that has no screenshot yet stays honest rather than empty.
 */
function Showcase({ item }: { item: ShowcaseItem }) {
  const images = item.images || []
  const base = import.meta.env.BASE_URL || '/'
  /* The findings sit between the two pictures, so the row reads left to right
     as what was sent, what came back about it, and what came back instead. A
     list under the images would be a caption for both and point at neither. */
  const findings = images.length === 2 ? item.points || [] : []
  const url = (path: string) => (/^(https?:|data:|\/)/.test(path) ? path : base + path)
  const figures = images.map((im, i) => {
    const frame = (
      <>
        {im.src ? (
          <Shot
            className="showcase__img"
            src={url(im.src)}
            alt={im.alt || im.label || ''}
            label={im.label}
            href={im.href ? url(im.href) : undefined}
            lightbox={im.lightbox}
          />
        ) : (
          <span className="showcase__placeholder mono">{im.alt || 'no image'}</span>
        )}
      </>
    )
    return (
      <figure key={i} className="showcase__fig">
        {/* A still of a page nobody can read from the back of the room. The
            click opens it full size; the `href` to the real page rides along
            inside that overlay, because the room needs the picture bigger far
            more often than it needs the site. A picture with no `src` is a
            placeholder, and a placeholder that is a link is a dead end. */}
        {im.href && !im.src ? (
          <a className="showcase__frame showcase__frame--link" href={url(im.href)} target="_blank" rel="noreferrer">
            {frame}
            <span className="showcase__open mono" aria-hidden="true">open ↗</span>
          </a>
        ) : (
          <div className="showcase__frame">{frame}</div>
        )}
        {im.label && <figcaption className="showcase__cap mono">{im.label}</figcaption>}
      </figure>
    )
  })
  return (
    <div className="showcase">
      <Head kicker={item.kicker} title={item.title} note={item.note} />
      <div className="showcase__grid" data-count={images.length} data-mid={findings.length ? '' : undefined}>
        {figures[0]}
        {findings.length > 0 && (
          <ol className="showcase__findings">
            {findings.map((p, i) => (
              <li key={i} className="showcase__finding">
                <span className="showcase__fnum mono">{pad(i + 1)}</span>
                <span>{renderInline(p)}</span>
              </li>
            ))}
          </ol>
        )}
        {figures.slice(1)}
      </div>
      <div className="showcase__foot">
        {item.status && <span className="showcase__status mono">{item.status}</span>}
        {item.link && <span className="showcase__link mono">{renderInline(item.link)}</span>}
      </div>
    </div>
  )
}

/**
 * A still that opens full size when it is clicked.
 *
 * Every picture in the deck is evidence of a screen nobody can read from the
 * back of the room, so the click is the default and `lightbox: false` is the
 * opt-out. Outside the deck — a designlab component variant — there is no
 * overlay to open, so the picture renders as a plain `img` rather than a
 * cursor promising something that cannot happen.
 */
function Shot({
  className,
  src,
  alt,
  label,
  href,
  lightbox,
}: {
  className: string
  src: string
  alt: string
  label?: string
  href?: string
  lightbox?: boolean
}) {
  const { open, enabled } = useLightbox()
  const img = <img className={className} src={src} alt={alt} />
  if (!enabled || lightbox === false) return img
  return (
    <button
      type="button"
      className="shot"
      aria-label={`Open full size: ${label || alt || 'image'}`}
      onClick={() => open({ src, alt, label, href })}
    >
      {img}
    </button>
  )
}

/**
 * A reference of calls: one row per command, and the rules under them.
 *
 * The row is a grid rather than a sentence: the command holds the first column
 * at its own measure, what it writes sits beside it, and the line that says
 * what it is for takes the rest. Three columns because they answer three
 * questions — what do I type, what do I get, why — and a reader scanning for
 * one of them should not have to read the other two.
 */
function Commands({ item }: { item: CommandsItem }) {
  const commands = item.commands || []
  const rules = item.rules || []
  const base = import.meta.env.BASE_URL || '/'
  const imageUrl = (path: string) => (/^(https?:|data:|\/)/.test(path) ? path : base + path)
  return (
    /* Four calls or more is a reference sheet rather than a pair of examples:
       the blocks go to three columns and one step down in size, the way a
       five-card `cards` slide does. The count decides it, so a deck never has
       to set a density by hand. */
    <div
      className="commands"
      data-dense={commands.length >= 4 ? '' : undefined}
      data-figure={item.image ? '' : undefined}
      data-split={item.image ? item.split || 'golden-flip' : undefined}
    >
      <Head kicker={item.kicker} title={item.title} note={item.note} />
      <div className="commands__body">
        <div className="commands__main">
      <ul className="commands__grid" style={{ '--commands': item.image ? 1 : commands.length || 2 } as CSSVars}>
        {commands.map((c, i) => (
          <li key={i} className="commands__item">
            {/* The console, drawn as the thing it is: a prompt and a line to
                type at it. The chevron is what says "this is typed, not read" —
                without it the pane is a filename in a box. */}
            <div className="commands__console">
              <span className="commands__chev mono" aria-hidden="true">&rsaquo;</span>
              <code className="commands__run">{c.run}</code>
              {/* The call is meant to be taken away, not transcribed off a
                  projector, so the button is on unless a deck turns it off. */}
              {item.copy !== false && <CopyButton code={c.run} />}
            </div>
            {/* What comes back, on its own line under the prompt rather than
                beside it: a result that shares a row with the call reads as
                part of what you type. */}
            {c.writes && (
              <p className="commands__out">
                <span className="commands__arrow" aria-hidden="true" />
                <span className="commands__writes">{c.writes}</span>
              </p>
            )}
            <p className="commands__detail">{renderInline(c.detail)}</p>
          </li>
        ))}
      </ul>
      {rules.length > 0 && (
        <ul className="commands__rules">
          {rules.map((r, i) => (
            <li key={i} className="commands__rule">{renderInline(r)}</li>
          ))}
        </ul>
      )}
        </div>
        {/* What the call puts on screen, framed the way `showcase` frames a
            still: the calls argue, the picture is the evidence. An image with
            no `src` draws its alt in a dashed frame rather than a broken one. */}
        {item.image && (
          <figure className="commands__fig">
            <div className="commands__frame">
              {item.image.src ? (
                <Shot
                  className="commands__img"
                  src={imageUrl(item.image.src)}
                  alt={item.image.alt || item.image.label || ''}
                  label={item.image.label}
                  lightbox={item.image.lightbox}
                />
              ) : (
                <span className="commands__placeholder mono">{item.image.alt || 'no image'}</span>
              )}
            </div>
            {item.image.label && <figcaption className="commands__cap mono">{item.image.label}</figcaption>}
          </figure>
        )}
      </div>
    </div>
  )
}

/**
 * Every archetype, one component each. The index signature is the union's own
 * `type`, so an archetype added to `content/types.ts` and left out here is a
 * compile error rather than a slide that renders as a divider on stage.
 */
/**
 * One prompt beside what each model returned for it.
 *
 * The prompt column is the tall one on purpose: it is the only column with
 * something to read, and it scrolls rather than shrinking its type, because a
 * prompt shown at eight pixels is a prompt nobody in the room can check against
 * what came back. The two result columns are stills — the pages are full
 * landing pages and there is no size at which one is readable inside a third of
 * a slide — so each frame is a link to the page itself.
 */
function PromptRun({ item }: { item: PromptRunItem }) {
  const base = import.meta.env.BASE_URL || '/'
  const url = (path: string) => (/^(https?:|data:|\/)/.test(path) ? path : base + path)
  const text = promptText(item.prompt.source)
  const { open, enabled } = useLightbox()
  const linkLabel = (href: string, given?: string) => {
    if (given) return given
    try {
      return new URL(href, 'https://x.invalid').host || 'open'
    } catch {
      return 'open'
    }
  }

  return (
    <div className="promptrun">
      <Head kicker={item.kicker} title={item.title} note={item.note} />
      <div className="promptrun__grid">
        <section className="promptrun__col promptrun__col--prompt">
          <header className="promptrun__head">
            <span className="promptrun__label mono">{item.prompt.label}</span>
            {item.prompt.detail && <span className="promptrun__detail">{renderInline(item.prompt.detail)}</span>}
          </header>
          {/* The pane on the slide is a specimen — nobody past the third row
              reads 9px mono. Clicking it hands the same text to the overlay,
              where the reader sets the size. Outside the deck (designlab's
              component host) there is no overlay, so it stays a pane. */}
          {text !== null && enabled ? (
            <button
              type="button"
              className="promptrun__pane promptrun__pane--open"
              onClick={() => open({ kind: 'text', text: text.trimEnd(), label: item.prompt.label, href: item.prompt.href ? url(item.prompt.href) : undefined })}
            >
              <pre className="promptrun__text">{text.trimEnd()}</pre>
              <span className="promptrun__open mono" aria-hidden="true">read it big ↗</span>
            </button>
          ) : (
            <div className="promptrun__pane">
              {text === null ? (
                <span className="promptrun__missing mono">
                  no prompt at content/prompts/{item.prompt.source}
                </span>
              ) : (
                <pre className="promptrun__text">{text.trimEnd()}</pre>
              )}
            </div>
          )}
          <footer className="promptrun__foot">
            {text !== null && <CopyButton code={text.trimEnd()} />}
            {item.prompt.href && (
              <a className="promptrun__link mono" href={url(item.prompt.href)} target="_blank" rel="noreferrer">
                {linkLabel(item.prompt.href, item.prompt.hrefLabel)} ↗
              </a>
            )}
          </footer>
        </section>

        {(item.results || []).map((r, i) => (
          <section key={i} className="promptrun__col">
            <header className="promptrun__head">
              <span className="promptrun__label mono">{r.label}</span>
              {r.detail && <span className="promptrun__detail">{renderInline(r.detail)}</span>}
            </header>
            {/* Same rule as `showcase`: the still opens full size, and the
                page it is of goes with it into the overlay. Only a result with
                no screenshot yet keeps the frame-as-link. */}
            {r.href && !r.image?.src ? (
              <a className="promptrun__shot promptrun__shot--link" href={url(r.href)} target="_blank" rel="noreferrer">
                <ResultImage image={r.image} label={r.label} />
                <span className="promptrun__open mono" aria-hidden="true">open ↗</span>
              </a>
            ) : (
              <div className="promptrun__shot">
                <ResultImage image={r.image} label={r.label} href={r.href ? url(r.href) : undefined} />
              </div>
            )}
            <footer className="promptrun__foot">
              {r.href && (
                <a className="promptrun__link mono" href={url(r.href)} target="_blank" rel="noreferrer">
                  open the page ↗
                </a>
              )}
            </footer>
          </section>
        ))}
      </div>
    </div>
  )
}

/** The still, or the alt text in a dashed frame while there is no still yet. */
function ResultImage({ image, label, href }: { image?: { src?: string; alt: string; lightbox?: boolean }; label?: string; href?: string }) {
  const base = import.meta.env.BASE_URL || '/'
  if (!image?.src) {
    return <span className="promptrun__placeholder mono">{image?.alt || 'no screenshot yet'}</span>
  }
  const src = /^(https?:|data:|\/)/.test(image.src) ? image.src : base + image.src
  return <Shot className="promptrun__img" src={src} alt={image.alt} label={label} href={href} lightbox={image.lightbox} />
}

const MAP: { [K in SlideType]: (props: { item: Extract<SlideItem, { type: K }>; reduced: boolean; still: boolean }) => ReactNode } = {
  cover: Cover,
  divider: Divider,
  keypoints: KeyPoints,
  callouts: Callouts,
  twocolumn: TwoColumn,
  process: Process,
  cards: Cards,
  codeui: CodeUI,
  commands: Commands,
  promptrun: PromptRun,
  table: TableSlide,
  quote: Quote,
  showcase: Showcase,
}

export default function Slide({ item, reduced = false, still = false }: { item: SlideItem; reduced?: boolean; still?: boolean }) {
  // An unknown `type` cannot come from a typed deck any more, but it can still
  // come from a stale designlab state, so the fallback stays.
  const Cmp = (MAP[item.type] ?? Divider) as (props: { item: SlideItem; reduced: boolean; still: boolean }) => ReactNode
  return <Cmp item={item} reduced={reduced} still={still} />
}
