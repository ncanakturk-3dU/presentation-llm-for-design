const ACCENT_RE = /\*\*(.+?)\*\*/g

export const pad = (n) => String(n).padStart(2, '0')

export const stripAccent = (s) => (typeof s === 'string' ? s.replace(ACCENT_RE, '$1') : s)

export function renderAccent(str) {
  if (typeof str !== 'string') return str
  return str.split(ACCENT_RE).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="accent">
        {part}
      </span>
    ) : (
      part
    ),
  )
}

const CODE_RE =
  /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(export|function|return|const|let|var|import|from|default|type|interface|class|new|await|async|if|else|for|while|of|in)\b/g

export function highlightCode(code) {
  const out = []
  let last = 0
  let key = 0
  let m
  CODE_RE.lastIndex = 0
  while ((m = CODE_RE.exec(code))) {
    if (m.index > last) out.push(code.slice(last, m.index))
    const cls = m[1] ? 'tok-comment' : m[2] ? 'tok-str' : 'tok-kw'
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
