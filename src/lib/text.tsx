import type { ReactNode } from 'react'
import type { CodeLang } from '../../content/types'

/**
 * The inline Markdown a deck's prose may carry.
 *
 * A slide string is Markdown as far as inline marks go — code, emphasis,
 * links — so an author writes what they would write anywhere else and does not
 * have to remember a private syntax. Block Markdown is deliberately absent:
 * headings, lists and blockquotes are what the archetypes *are*, and a heading
 * typed inside a list item is a slide that wanted a different archetype.
 *
 * The one house reading: `**strong**` renders as the slide's accent word
 * rather than as bold weight. That is the deck's existing convention and the
 * reason the accent exists; Markdown's own meaning — this is the part that
 * carries the sentence — is what the accent already says in this deck's voice.
 *
 * Order matters in the alternation below: code is matched first, so a backtick
 * span containing `**` or `_` comes out verbatim, exactly as Markdown requires.
 */
const INLINE_RE = new RegExp(
  [
    // `code`, ``code with a ` in it``: any run of backticks, closed by a run
    // of the same length.
    '(`+)([\\s\\S]+?)\\1',
    // [text](href)
    '\\[([^\\]]+)\\]\\(([^)\\s]+)\\)',
    // **strong** / __strong__ — the accent word.
    '\\*\\*([\\s\\S]+?)\\*\\*|__([\\s\\S]+?)__',
    // *emphasis* — not a lone `*`, and not one inside a word.
    '(?<![\\w*])\\*(?!\\s)([^*]+?)(?<!\\s)\\*(?![\\w*])',
    // _emphasis_ — guarded by word boundaries so snake_case survives.
    '(?<![\\w_])_(?!\\s)([^_]+?)(?<!\\s)_(?![\\w_])',
  ].join('|'),
  'g',
)

export const pad = (n: number) => String(n).padStart(2, '0')

/**
 * The same string with its marks removed rather than rendered — for the places
 * that need a plain string and not a tree: the Contents outline, the deck
 * title, designlab's state labels.
 */
export function stripMarks(s: string): string
export function stripMarks<T>(s: T): T
export function stripMarks(s: unknown) {
  if (typeof s !== 'string') return s
  let out = s
  // Marks nest, so strip until the string stops changing rather than once.
  for (let i = 0; i < 4; i++) {
    const next = out.replace(INLINE_RE, (_m, _ticks, code, link, _href, strong, strongAlt, em, emAlt) =>
      code ?? link ?? strong ?? strongAlt ?? em ?? emAlt ?? '',
    )
    if (next === out) break
    out = next
  }
  return out
}

/**
 * Inline Markdown as React nodes. Emphasis and links carry their contents back
 * through this same function, so `**a _b_**` marks both; code does not, because
 * inside a code span the marks are the text.
 */
export function renderInline(str: string | undefined): ReactNode {
  if (typeof str !== 'string') return str
  const out: ReactNode[] = []
  let last = 0
  let key = 0
  let m: RegExpExecArray | null
  const re = new RegExp(INLINE_RE.source, 'g')
  while ((m = re.exec(str))) {
    if (m.index > last) out.push(str.slice(last, m.index))
    const [, , code, link, href, strong, strongAlt, em, emAlt] = m
    const k = key++
    if (code !== undefined) {
      out.push(
        <code key={k} className="icode">
          {code}
        </code>,
      )
    } else if (link !== undefined) {
      out.push(
        <a key={k} className="ilink" href={href} target="_blank" rel="noreferrer">
          {renderInline(link)}
        </a>,
      )
    } else if (strong !== undefined || strongAlt !== undefined) {
      out.push(
        <span key={k} className="accent">
          {renderInline((strong ?? strongAlt) as string)}
        </span>,
      )
    } else {
      out.push(<em key={k}>{renderInline((em ?? emAlt) as string)}</em>)
    }
    last = m.index + m[0].length
  }
  if (last < str.length) out.push(str.slice(last))
  return out
}

const CODE_RE =
  /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(export|function|return|const|let|var|import|from|default|type|interface|class|new|await|async|if|else|for|while|of|in)\b/g

/* Markdown is not JavaScript, and reading it with the JS lexer coloured a
   filename's `for` as a keyword and `'s and Don'` as a string. This one knows
   the four things a folded .md pane actually shows. */
const MD_RE =
  /(<!--[\s\S]*?-->)|(^---$)|(^#{1,6} .*$)|("(?:[^"\\]|\\.)*")|(\u22ef[^\n]*)/gm

export function highlightCode(code: string, lang: CodeLang = 'tsx'): ReactNode[] {
  const re = lang === 'md' ? MD_RE : CODE_RE
  const out: ReactNode[] = []
  let last = 0
  let key = 0
  let m: RegExpExecArray | null
  re.lastIndex = 0
  while ((m = re.exec(code))) {
    if (m.index > last) out.push(code.slice(last, m.index))
    const cls =
      lang === 'md'
        ? m[1] || m[2] || m[5]
          ? 'tok-comment'
          : m[3]
            ? 'tok-head'
            : 'tok-str'
        : m[1]
          ? 'tok-comment'
          : m[2]
            ? 'tok-str'
            : 'tok-kw'
    out.push(
      <span key={key++} className={cls}>
        {m[0]}
      </span>,
    )
    last = m.index + m[0].length
  }
  if (last < code.length) out.push(code.slice(last))
  return out
}
