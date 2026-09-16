import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Slide, { itemTheme } from './slides/Slides'
import Contents from './components/Contents'
import ErrorBoundary from './components/ErrorBoundary'
import { useContent } from './lib/useContent'
import { useReducedMotion, EASE } from './lib/motion'
import { pad } from './lib/text'
import './App.css'

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

export default function App() {
  const { data } = useContent()
  const [index, setIndex] = useState(() => {
    const n = parseInt(typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '', 10)
    return Number.isFinite(n) && n > 0 ? n - 1 : 0
  })
  const [contentsOpen, setContentsOpen] = useState(false)
  const reduced = useReducedMotion()

  const items = data?.items || []
  const total = items.length
  const meta = data?.meta || {}

  useEffect(() => {
    if (meta.mark) document.title = meta.mark
  }, [meta.mark])

  useEffect(() => {
    if (total && index > total - 1) setIndex(total - 1)
  }, [total, index])

  useEffect(() => {
    if (total) window.location.hash = String(index + 1)
  }, [index, total])

  const go = useCallback((i) => { if (total) setIndex(Math.max(0, Math.min(total - 1, i))) }, [total])
  const next = useCallback(() => { if (total) setIndex((i) => Math.min(total - 1, i + 1)) }, [total])
  const prev = useCallback(() => { if (total) setIndex((i) => Math.max(0, i - 1)) }, [total])
  const pick = useCallback((i) => { go(i); setContentsOpen(false) }, [go])

  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName
      const typing = tag === 'INPUT' || tag === 'TEXTAREA'
      if (e.key === 'Escape') {
        if (contentsOpen) { e.preventDefault(); setContentsOpen(false) }
        return
      }
      if ((e.key === 'o' || e.key === 'O') && !typing) {
        e.preventDefault(); setContentsOpen((v) => !v); return
      }
      if (contentsOpen || typing) return
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault(); next()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault(); prev()
      } else if (e.key === 'Home') {
        e.preventDefault(); go(0)
      } else if (e.key === 'End') {
        e.preventDefault(); go(total - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [contentsOpen, next, prev, go, total])

  const touchX = useRef(null)
  const onTouchStart = (e) => { touchX.current = e.changedTouches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchX.current == null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (!contentsOpen && Math.abs(dx) > 64) (dx < 0 ? next() : prev())
    touchX.current = null
  }
  const onStageClick = (e) => {
    if (contentsOpen) return
    if (e.clientX < window.innerWidth * 0.28) prev()
    else next()
  }

  if (total === 0) return <div className="deck deck--msg"><p className="deck__msg mono">This deck has no slides.</p></div>

  const item = items[index]
  const theme = itemTheme(item)
  const pageLabel = `${pad(index + 1)} / ${pad(total)}`

  return (
    <ErrorBoundary>
      <div className="deck" data-theme={theme} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <header className="chrome chrome--top">
          <div className="brand">
            <button className="brand__menu" aria-label="Open contents (O)" aria-haspopup="dialog" onClick={() => setContentsOpen(true)}>
              <MenuIcon />
            </button>
            {meta.mark && <span className="brand__name">{meta.mark}</span>}
          </div>
          <div className="pageref">
            <span className="mono pageref__index">{pageLabel}</span>
          </div>
        </header>

        <section className="stage" aria-live="polite" onClick={onStageClick}>
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              className="slidewrap"
              initial={{ opacity: 0, y: reduced ? 0 : 14 }}
              animate={{ opacity: 1, y: 0, transition: { duration: reduced ? 0.15 : 0.44, ease: EASE } }}
              exit={{ opacity: 0, y: reduced ? 0 : -10, transition: { duration: reduced ? 0.12 : 0.26, ease: EASE } }}
            >
              <Slide item={item} reduced={reduced} />
            </motion.div>
          </AnimatePresence>
        </section>
      </div>

      <Contents open={contentsOpen} items={items} index={index} reduced={reduced} onSelect={pick} onClose={() => setContentsOpen(false)} />
    </ErrorBoundary>
  )
}
