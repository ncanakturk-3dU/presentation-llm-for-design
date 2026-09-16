import CoverSphere from '../components/CoverSphere'
import { renderAccent, highlightCode, pad, stripAccent } from '../lib/text'
import './slides.css'

export const slideTheme = (type) => (type === 'cover' || type === 'keypoints' ? 'dark' : 'light')

export const itemTheme = (item) => item.theme || slideTheme(item.type)

export function slideTitle(item) {
  return stripAccent(item.title || item.quote || item.chapter || item.type)
}

export function slideOutline(item) {
  switch (item.type) {
    case 'divider':
      return item.list || []
    case 'keypoints':
      return item.points || []
    case 'twocolumn':
      return (item.columns || []).map((c) => `${c.label} — ${c.caption}`)
    case 'process':
      return (item.steps || []).map((s) => s.title)
    case 'table':
      return (item.rows || []).map((r) => `${r.severity} — ${r.meaning}`)
    case 'codeui':
      return (item.preview?.buttons || []).map((b) => b.label)
    case 'cover':
      return item.subtitle ? [item.subtitle] : []
    case 'quote':
      return item.closer ? [item.closer] : []
    default:
      return []
  }
}

function Head({ kicker, title, note }) {
  return (
    <header className="shead">
      {kicker && <span className="mono kicker">{kicker}</span>}
      {title && <h2 className="shead__title">{renderAccent(title)}</h2>}
      {note && <p className="shead__note">{note}</p>}
    </header>
  )
}

function Cover({ item, reduced }) {
  return (
    <div className="cover">
      <div className="cover__text">
        <h1 className="cover__title">{renderAccent(item.title)}</h1>
        {item.subtitle && <p className="cover__sub">{item.subtitle}</p>}
      </div>
      <div className="cover__art">
        <CoverSphere reduced={reduced} />
      </div>
    </div>
  )
}

function Divider({ item }) {
  return (
    <div className="divider">
      <div className="divider__main">
        {item.number && <div className="divider__num">{item.number}</div>}
        <h2 className="divider__title">{renderAccent(item.title)}</h2>
        {item.note && <p className="divider__note">{item.note}</p>}
      </div>
      {Array.isArray(item.list) && (
        <ol className="divider__list">
          {item.list.map((l, i) => (
            <li key={i} className="divider__row">
              <span className="mono divider__n">{pad(i + 1)}</span>
              <span className="divider__label">{l}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

function KeyPoints({ item }) {
  return (
    <div className="keypoints">
      <Head kicker={item.kicker} title={item.title} />
      <ol className="keypoints__list">
        {(item.points || []).map((p, i) => (
          <li key={i} className="keypoints__row">
            <span className="keypoints__badge mono">{pad(i + 1)}</span>
            <span className="keypoints__text">{p}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function MockAuth({ variant }) {
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

function TwoColumn({ item }) {
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
              <span className="twocol__caption">{c.caption}</span>
              {c.note && <span className="twocol__note">{c.note}</span>}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}

function Process({ item }) {
  return (
    <div className="process">
      <Head kicker={item.kicker} title={item.title} />
      <ol className="process__flow">
        {(item.steps || []).map((s, i) => (
          <li key={i} className="process__step" data-tone={s.tone || 'ink'}>
            <div className="process__card">
              <span className="process__chip mono">{s.n}</span>
              <span className="process__steptitle">{s.title}</span>
            </div>
            <ul className="process__points">
              {(s.points || []).map((p, j) => (
                <li key={j}>{p}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  )
}

function CodeUI({ item }) {
  const pv = item.preview || {}
  return (
    <div className="codeui">
      <Head kicker={item.kicker} title={item.title} />
      <div className="codeui__grid">
        <div className="codeui__code">
          <div className="codeui__tab mono">Button.tsx</div>
          <div className="codeui__body">
            <div className="codeui__gutter" aria-hidden="true">
              {(item.code || '').split('\n').map((_, i) => (
                <span key={i}>{i + 1}</span>
              ))}
            </div>
            <pre className="codeui__pre">
              <code>{highlightCode(item.code || '')}</code>
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
          {Array.isArray(pv.states) && (
            <div className="codeui__variants">
              <span className="mono codeui__vlabel">Variants</span>
              <div className="codeui__vrow">
                {pv.states.map((s, i) => (
                  <span key={i} className="pvchip">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {item.note && <p className="codeui__note">{item.note}</p>}
    </div>
  )
}

function TableSlide({ item }) {
  const cols = item.columns || []
  return (
    <div className="tableslide">
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
          {(item.rows || []).map((r, i) => (
            <tr key={i}>
              <td>
                <span className={`sev sev--${r.tone}`}>{r.severity}</span>
              </td>
              <td className="matrix__strong">{r.meaning}</td>
              <td className="matrix__muted">{r.examples}</td>
              <td>
                <span className={`act act--${r.tone}`}>{r.action}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Quote({ item }) {
  return (
    <div className="quoteslide">
      <div className="quoteslide__main">
        <span className="quoteslide__mark" aria-hidden="true">
          &ldquo;
        </span>
        <blockquote className="quoteslide__text">{renderAccent(item.quote)}</blockquote>
      </div>
      <div className="quoteslide__side">
        {item.closer && <div className="quoteslide__closer">{item.closer}</div>}
      </div>
      {item.byline && <div className="quoteslide__byline">{item.byline}</div>}
    </div>
  )
}

const MAP = {
  cover: Cover,
  divider: Divider,
  keypoints: KeyPoints,
  twocolumn: TwoColumn,
  process: Process,
  codeui: CodeUI,
  table: TableSlide,
  quote: Quote,
}

export default function Slide({ item, reduced }) {
  const Cmp = MAP[item.type] || Divider
  return <Cmp item={item} reduced={reduced} />
}
