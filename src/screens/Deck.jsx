import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Slide, { itemTheme } from '../slides/Slides'
import Contents from '../components/Contents/Contents'
import { useContent } from '../lib/useContent'
import { useReducedMotion, EASE } from '../lib/motion'
import { pad } from '../lib/text'
import { indexOfSlide, isLab, pickContents, pickMotion, pickStatus } from '../lib/lab'
import { DEFAULT_DECK } from '../lib/decks'
import './Deck.css'

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

/**
 * The presented deck, and the one screen designlab renders.
 *
 * The app passes `preset: 'app'` and the deck drives itself — the hash picks
 * the slide, the keyboard and the stage move it, the contents panel opens on a
 * click. A designlab state passes a `preset` of its own and pins the same three
 * things as params instead (`slide`, `contents`, `status`), because a capture
 * has nobody to press a key. Everything below that split is the same code.
 *
 * Which deck is shown is **not** a shared axis. The app always presents
 * `DEFAULT_DECK`, because a published presentation shows one deck and a way to
 * switch decks mid-talk is a way to open the wrong one on stage. Walking the
 * others is a review job, so `deck` is a designlab param and nothing else
 * reads it.
 */
export default function Deck({ preset, motion: motionKnob, deck: deckParam, slide, contents, status }) {
  const lab = isLab(preset)
  const still = lab && pickMotion(motionKnob) === 'still'

  const deckId = (lab && deckParam) || DEFAULT_DECK
  const { data, deck } = useContent(deckId)
  const reducedPref = useReducedMotion()
  const reduced = reducedPref || still

  const all = data?.items || []
  // A pinned `empty` state is the only way to see the no-slides copy: the
  // shipped deck always has items, so nothing else would ever render it.
  const items = lab && pickStatus(status) === 'empty' ? [] : all
  const total = items.length
  const meta = data?.meta || {}
  const mark = meta.mark || deck?.label

  const [appIndex, setAppIndex] = useState(() => {
    const n = parseInt(typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '', 10)
    return Number.isFinite(n) && n > 0 ? n - 1 : 0
  })
  const [appContentsOpen, setAppContentsOpen] = useState(false)

  const labContents = pickContents(contents)
  const index = lab ? indexOfSlide(items, slide) : appIndex
  const contentsOpen = lab ? labContents !== 'closed' : appContentsOpen

  useEffect(() => {
    if (!lab && mark) document.title = mark
  }, [lab, mark])

  useEffect(() => {
    if (!lab && total && appIndex > total - 1) setAppIndex(total - 1)
  }, [lab, total, appIndex])

  // The studio owns the frame's address, so a lab state never writes the hash.
  useEffect(() => {
    if (!lab && total) window.location.hash = String(appIndex + 1)
  }, [lab, appIndex, total])

  const go = useCallback((i) => { if (total) setAppIndex(Math.max(0, Math.min(total - 1, i))) }, [total])
  const next = useCallback(() => { if (total) setAppIndex((i) => Math.min(total - 1, i + 1)) }, [total])
  const prev = useCallback(() => { if (total) setAppIndex((i) => Math.max(0, i - 1)) }, [total])
  const choose = useCallback((i) => { go(i); setAppContentsOpen(false) }, [go])

  useEffect(() => {
    if (lab) return undefined
    const onKey = (e) => {
      const tag = document.activeElement?.tagName
      const typing = tag === 'INPUT' || tag === 'TEXTAREA'
      if (e.key === 'Escape') {
        if (appContentsOpen) { e.preventDefault(); setAppContentsOpen(false) }
        return
      }
      if ((e.key === 'o' || e.key === 'O') && !typing) {
        e.preventDefault(); setAppContentsOpen((v) => !v); return
      }
      if (appContentsOpen || typing) return
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
  }, [lab, appContentsOpen, next, prev, go, total])

  const touchX = useRef(null)
  const onTouchStart = (e) => { touchX.current = e.changedTouches[0].clientX }
  const onTouchEnd = (e) => {
    if (lab || touchX.current == null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (!appContentsOpen && Math.abs(dx) > 64) (dx < 0 ? next() : prev())
    touchX.current = null
  }
  const onStageClick = (e) => {
    if (lab || appContentsOpen) return
    if (e.clientX < window.innerWidth * 0.28) prev()
    else next()
  }

  if (total === 0) {
    return <div className="deck deck--msg"><p className="deck__msg mono">This deck has no slides.</p></div>
  }

  const item = items[index]
  const theme = itemTheme(item)
  const pageLabel = `${pad(index + 1)} / ${pad(total)}`

  return (
    <>
      <div className="deck" data-theme={theme} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <header className="chrome chrome--top">
          <div className="brand">
            <button className="brand__menu" aria-label="Open contents (O)" aria-haspopup="dialog" onClick={() => setAppContentsOpen(true)}>
              <MenuIcon />
            </button>
            {mark && <span className="brand__name">{mark}</span>}
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
              <Slide item={item} reduced={reduced} still={still} />
            </motion.div>
          </AnimatePresence>
        </section>
      </div>

      <Contents
        open={contentsOpen}
        items={items}
        index={index}
        reduced={reduced}
        still={still}
        initialTab={labContents === 'slides' ? 'slides' : 'outline'}
        onSelect={choose}
        onClose={() => setAppContentsOpen(false)}
      />
    </>
  )
}
