import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Slide, { itemTheme } from '../slides/Slides'
import Contents from '../components/Contents/Contents'
import { useContent } from '../lib/useContent'
import { useReducedMotion, EASE } from '../lib/motion'
import { pad } from '../lib/text'
import { indexOfSlide, isLab, pickContents, pickMotion, pickStatus, withLabOverrides } from '../lib/lab'
import { DEFAULT_DECK } from '../lib/decks'
import './DeckView.css'

/**
 * What designlab hands a screen: `preset` names the state (`'app'` for the
 * real thing), and every knob and param arrives as a prop of its own id. They
 * are all optional and all `unknown`-ish, because a states file is JSON and
 * nothing guarantees a given key is in it — `pick()` is what turns each one
 * into a value this component can reason about.
 */
type DeckViewProps = {
  preset?: string
  motion?: string
  deck?: string
  slide?: string
  contents?: string
  status?: string
  marker?: string
  split?: string
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

/**
 * The deck itself — the shell, the chrome, the keyboard and the slide.
 *
 * It is not a designlab screen. `src/screens/` holds one generated wrapper per
 * deck in `content/`, each fixing its own `deck`, so the studio tree lists the
 * decks by name instead of hiding them behind a param on a single screen.
 *
 * The app passes `preset: 'app'` and the deck drives itself — the hash picks
 * the slide, the keyboard and the stage move it, the contents panel opens on a
 * click. A designlab state passes a `preset` of its own and pins the same three
 * things as params instead (`slide`, `contents`, `status`), because a capture
 * has nobody to press a key. Everything below that split is the same code.
 *
 * Two more params, `marker` and `split`, override the current `divider`'s or
 * `keypoints`' own fields so its row marker and column proportion can be tried
 * without an edit. They are for looking: whatever you settle on has to be
 * written into the deck module, because nothing outside the studio reads them.
 *
 * Which deck is shown is **not** a shared axis. The app always presents
 * `DEFAULT_DECK`, because a published presentation shows one deck and a way to
 * switch decks mid-talk is a way to open the wrong one on stage. Walking the
 * others is a review job, so `deck` is a designlab param and nothing else
 * reads it.
 */
export default function DeckView({ preset, motion: motionKnob, deck: deckParam, slide, contents, status, marker, split }: DeckViewProps) {
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
  const mark = data?.meta?.mark || deck?.label

  const labContents = pickContents(contents)
  // What the state pins is where the deck *starts*, not where it is stuck. A
  // capture is unaffected either way — screenshot_state renders the state fresh
  // and never touches it — so freezing the studio only cost a human the ability
  // to click through a deck, which is the main thing a deck is for.
  const pinnedIndex = lab ? indexOfSlide(items, slide) : 0

  const [index, setIndex] = useState(() => {
    if (lab) return pinnedIndex
    const n = parseInt(typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '', 10)
    return Number.isFinite(n) && n > 0 ? n - 1 : 0
  })
  const [contentsOpen, setContentsOpen] = useState(() => lab && labContents !== 'closed')

  // Flipping the param in the studio jumps the deck there, rather than being
  // ignored because the reader had already navigated away.
  useEffect(() => {
    if (lab) setIndex(pinnedIndex)
  }, [lab, pinnedIndex])

  useEffect(() => {
    if (lab) setContentsOpen(labContents !== 'closed')
  }, [lab, labContents])

  useEffect(() => {
    if (!lab && mark) document.title = mark
  }, [lab, mark])

  useEffect(() => {
    if (total && index > total - 1) setIndex(total - 1)
  }, [total, index])

  // The studio owns the frame's address, so a lab state never writes the hash.
  useEffect(() => {
    if (!lab && total) window.location.hash = String(index + 1)
  }, [lab, index, total])

  // A phone scrolls the deck, so a new slide has to arrive at its own top
  // rather than wherever the last one was read down to.
  const deckRef = useRef<HTMLDivElement>(null)
  useEffect(() => { deckRef.current?.scrollTo(0, 0) }, [index])

  const go = useCallback((i: number) => { if (total) setIndex(Math.max(0, Math.min(total - 1, i))) }, [total])
  const next = useCallback(() => { if (total) setIndex((i) => Math.min(total - 1, i + 1)) }, [total])
  const prev = useCallback(() => { if (total) setIndex((i) => Math.max(0, i - 1)) }, [total])
  const choose = useCallback((i: number) => { go(i); setContentsOpen(false) }, [go])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
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

  const touch = useRef<{ x: number; y: number } | null>(null)
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.changedTouches[0]
    touch.current = { x: t.clientX, y: t.clientY }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touch.current == null) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touch.current.x
    const dy = t.clientY - touch.current.y
    touch.current = null
    // Horizontal-dominant only: a phone now scrolls the deck, so a drag that
    // travels more down than across is a scroll and must not turn the page.
    if (!contentsOpen && Math.abs(dx) > 64 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      if (dx < 0) next()
      else prev()
    }
  }
  const onStageClick = (e: React.MouseEvent) => {
    if (contentsOpen) return
    // A slide may carry a real link — a card's reference page, a codeui tab
    // pointing at the file on GitHub. Without this the click opens the page
    // *and* advances the deck, so the presenter comes back to the wrong slide.
    if ((e.target as HTMLElement).closest('a')) return
    // On a phone the surface scrolls and the swipe turns the page, so a tap
    // does neither — otherwise reading past the fold jumps a slide per tap.
    if (window.innerWidth <= 940) return
    if (e.clientX < window.innerWidth * 0.28) prev()
    else next()
  }

  if (total === 0) {
    return <div className="deck deck--msg"><p className="deck__msg mono">This deck has no slides.</p></div>
  }

  // The divider params are studio-only: the app renders the deck as written.
  const item = lab ? withLabOverrides(items[index], { marker, split }) : items[index]
  const theme = itemTheme(item)
  const pageLabel = `${pad(index + 1)} / ${pad(total)}`

  return (
    <>
      <div className="deck" ref={deckRef} data-theme={theme} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <header className="chrome chrome--top">
          <div className="brand">
            <button className="brand__menu" aria-label="Open contents (O)" aria-haspopup="dialog" onClick={() => setContentsOpen(true)}>
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
              data-theme={theme}
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
        onClose={() => setContentsOpen(false)}
      />
    </>
  )
}
