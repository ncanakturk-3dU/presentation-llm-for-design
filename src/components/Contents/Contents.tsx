import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { slideOutline, slideTitle, itemTheme } from '../../slides/Slides'
import { pad, stripMarks } from '../../lib/text'
import { EASE } from '../../lib/motion'
import type { SlideItem } from '../../../content/types'
import './Contents.css'

function TabIcon({ name }: { name: 'outline' | 'slides' }) {
  if (name === 'outline') {
    return (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <path d="M5 6h.01M5 12h.01M5 18h.01M9 6h10M9 12h10M9 18h10" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="4" y="5" width="7" height="6" rx="1" /><rect x="13" y="5" width="7" height="6" rx="1" />
      <rect x="4" y="13" width="7" height="6" rx="1" /><rect x="13" y="13" width="7" height="6" rx="1" />
    </svg>
  )
}

type ContentsProps = {
  open: boolean
  items: SlideItem[]
  index: number
  reduced: boolean
  onSelect: (index: number) => void
  onClose: () => void
  initialTab?: 'outline' | 'slides'
  initialQuery?: string
  still?: boolean
}

export default function Contents({ open, items, index, reduced, onSelect, onClose, initialTab = 'outline', initialQuery = '', still = false }: ContentsProps) {
  const [tab, setTab] = useState(initialTab)
  const [query, setQuery] = useState(initialQuery)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setQuery(initialQuery)
      const t = setTimeout(() => inputRef.current?.focus(), reduced ? 0 : 260)
      return () => clearTimeout(t)
    }
  }, [open, reduced, initialQuery])

  const q = query.trim().toLowerCase()
  const matches = (it: SlideItem) => {
    if (!q) return true
    const kicker = 'kicker' in it ? it.kicker : undefined
    const hay = [slideTitle(it), kicker, it.chapter, ...slideOutline(it)].filter(Boolean).join(' ').toLowerCase()
    return hay.includes(q)
  }

  const panelV = reduced || still
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.16 } }, exit: { opacity: 0, transition: { duration: 0.12 } } }
    : {
        hidden: { x: '-100%' },
        show: { x: 0, transition: { duration: 0.4, ease: EASE } },
        exit: { x: '-100%', transition: { duration: 0.26, ease: EASE } },
      }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="toc" data-theme="light" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced || still ? 0.12 : 0.24 }}>
          <div className="toc__scrim" onClick={onClose} aria-hidden="true" />
          <motion.div className="toc__panel" role="dialog" aria-modal="true" aria-label="Contents" variants={panelV} initial="hidden" animate="show" exit="exit">
            <div className="toc__bar">
              <div className="toc__tabs" role="tablist" aria-label="Contents view">
                <button role="tab" aria-selected={tab === 'outline'} className={`toc__tab ${tab === 'outline' ? 'is-on' : ''}`} onClick={() => setTab('outline')}>
                  <TabIcon name="outline" /> Outline
                </button>
                <button role="tab" aria-selected={tab === 'slides'} className={`toc__tab ${tab === 'slides' ? 'is-on' : ''}`} onClick={() => setTab('slides')}>
                  <TabIcon name="slides" /> Slides
                </button>
              </div>
              <button className="toc__close" aria-label="Close contents (Esc)" onClick={onClose}>
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div className="toc__search">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <circle cx="11" cy="11" r="6.5" /><path d="M20 20l-3.6-3.6" strokeLinecap="round" />
              </svg>
              <input ref={inputRef} className="toc__input" placeholder="Search slides…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search slides" />
            </div>

            <div className="toc__body">
              {tab === 'outline' ? (
                <div className="toc__outline">
                  {items.map((it, i) => {
                    if (!matches(it)) return null
                    const subs = slideOutline(it)
                    return (
                      <div key={it.id || i} className={`ol ${i === index ? 'is-current' : ''}`}>
                        <button className="ol__row" onClick={() => onSelect(i)}>
                          <span className="ol__num mono">{pad(i + 1)}</span>
                          <span className="ol__title">{slideTitle(it)}</span>
                          {subs.length > 0 && <span className="ol__count mono">{subs.length}</span>}
                        </button>
                        {subs.length > 0 && (
                          <ul className="ol__subs">
                            {subs.map((s, j) => (
                              <li key={j}>
                                <button className="ol__sub" onClick={() => onSelect(i)}>
                                  <span className="ol__subn mono">{i + 1}.{j + 1}</span>
                                  <span className="ol__subt">{stripMarks(s)}</span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="toc__slides">
                  {items.map((it, i) => {
                    if (!matches(it)) return null
                    return (
                      <button key={it.id || i} className={`thumb ${i === index ? 'is-current' : ''}`} onClick={() => onSelect(i)}>
                        <span className="thumb__frame" data-theme={itemTheme(it)}>
                          <span className="thumb__kicker mono">{('kicker' in it && it.kicker) || it.type}</span>
                          <span className="thumb__title">{slideTitle(it)}</span>
                        </span>
                        <span className="thumb__foot">
                          <span className="mono thumb__n">{pad(i + 1)}</span>
                          <span className="mono thumb__type">{it.type}</span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
