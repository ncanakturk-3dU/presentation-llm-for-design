import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Slide, { itemTheme } from '../slides/Slides'
import Contents from '../components/Contents/Contents'
import { useContent } from '../lib/useContent'
import { useReducedMotion, EASE } from '../lib/motion'
import { pad } from '../lib/text'
import { indexOfSlide, isLab, pickContents, pickMotion, pickStatus, withLabOverrides } from '../lib/lab'
import { DEFAULT_DECK } from '../lib/decks'
import Lightbox, { LightboxProvider } from '../components/Lightbox/Lightbox'
import type { Shot } from '../components/Lightbox/Lightbox'
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
  mark?: string
  art?: string
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

function StepIcon({ dir }: { dir: 'prev' | 'next' }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={dir === 'prev' ? 'M14.5 5 8 12l6.5 7' : 'M9.5 5 16 12l-6.5 7'} />
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
export default function DeckView({ preset, motion: motionKnob, deck: deckParam, slide, contents, status, marker, split, mark: markParam, art: artParam }: DeckViewProps) {
  const lab = isLab(preset)
  const still = lab && pickMotion(motionKnob) === 'still'

  const deckId = (lab && deckParam) || DEFAULT_DECK
  const { data, deck } = useContent(deckId)
  const reducedPref = useReducedMotion()
  const reduced = reducedPref || still

  const all = deck?.items || []
  // A pinned `empty` state is the only way to see the no-slides copy: the
  // shipped deck always has items, so nothing else would ever render it.
  const items = lab && pickStatus(status) === 'empty' ? [] : all
  const total = items.length
  const mark = data?.meta?.mark || deck?.label

  // The picture a viewer asked to see full size. It lives here rather than in
  // the slide because the deck's own key handler has to stand down while it is
  // open — arrows that page the deck behind an overlay are a bug you only find
  // on stage.
  const [shot, setShot] = useState<Shot | null>(null)

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

  // A new slide arrives at its own top rather than wherever the last one was
  // read down to. The scroll lives on the deck on a phone and on the stage on
  // the desktop, so reset both.
  const deckRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLElement>(null)

  // The desktop stage dissolves at whichever edge still hides content instead
  // of cutting it — the fade itself is a mask in CSS, and this only raises it
  // on a side that is actually clipped, so a slide that fits keeps crisp edges
  // and a scrolled slide's first line is never dimmed while it sits at the top.
  const syncStageFade = useCallback(() => {
    const el = stageRef.current
    if (!el) return
    el.style.setProperty('--fade-top', el.scrollTop > 1 ? 'var(--stage-fade)' : '0px')
    el.style.setProperty('--fade-bottom', el.scrollTop + el.clientHeight < el.scrollHeight - 1 ? 'var(--stage-fade)' : '0px')
  }, [])

  useEffect(() => {
    deckRef.current?.scrollTo(0, 0)
    stageRef.current?.scrollTo(0, 0)
    // Crisp through the change; the entering slide recomputes its fades once
    // its real height has settled (onAnimationComplete on the slidewrap).
    stageRef.current?.style.setProperty('--fade-top', '0px')
    stageRef.current?.style.setProperty('--fade-bottom', '0px')
  }, [index])

  useEffect(() => {
    window.addEventListener('resize', syncStageFade)
    return () => window.removeEventListener('resize', syncStageFade)
  }, [syncStageFade])

  // ---- the phone's chrome, and when it gets out of the way ----------------
  //
  // On a phone the deck is read by scrolling, and the two bars — the header
  // and the page bar — are the only things on screen that are not the slide.
  // They retract while the reader is going down the slide and come back the
  // moment they are wanted: a scroll back up, either end of the slide, a new
  // slide, or a tap on the slide itself.
  //
  // What they never do is take room away as they go. The stage reserves the
  // bar's height whether it is shown or hidden, so retracting is a transform
  // and nothing reflows mid-scroll — a slide that jumps under the thumb is
  // worse than a bar that stays.
  const [chromeHidden, setChromeHidden] = useState(false)
  const lastY = useRef(0)
  // Distance travelled in one direction, reset the moment the direction
  // changes. This is the whole difference between a bar that retracts and one
  // that flickers: a thumb and the momentum after it do not scroll one way,
  // they scroll mostly one way in steps of three to eight pixels either side.
  // A per-event threshold reads every one of those back-steps as a decision.
  const travel = useRef(0)

  // Shown again on every page turn: a reader who swiped to get here has not
  // told us they want the chrome gone, and the counter is how they know where
  // the swipe landed them.
  useEffect(() => { setChromeHidden(false); lastY.current = 0; travel.current = 0 }, [index])

  // And on the way out of the lightbox. While it is open the deck is not the
  // thing being scrolled, so the handler below stands down rather than
  // reading somebody else's gesture as an instruction about our bars.
  useEffect(() => { if (!shot) setChromeHidden(false) }, [shot])

  const onDeckScroll = useCallback(() => {
    const el = deckRef.current
    if (!el || shot || contentsOpen) return
    const y = el.scrollTop
    const dy = y - lastY.current
    lastY.current = y
    if (dy === 0) return
    travel.current = (travel.current > 0) === (dy > 0) ? travel.current + dy : dy
    // The top is not a direction, it is a place: the header belongs to a slide
    // read from its first line, so arriving there shows it whatever the thumb
    // was doing. The bottom gets no such rule — the bar's height is reserved
    // down there either way, so nothing is under it to rescue, and a rule that
    // fired at the end of every downward fling was half of the flicker.
    if (y <= 48) { setChromeHidden(false); travel.current = 0; return }
    // Asymmetric on purpose: going away takes a deliberate pull, coming back
    // takes half of one. Wanting the bar is the more urgent of the two.
    if (travel.current > 40) { setChromeHidden(true); travel.current = 0 }
    else if (travel.current < -24) { setChromeHidden(false); travel.current = 0 }
  }, [shot, contentsOpen])

  const go = useCallback((i: number) => { if (total) setIndex(Math.max(0, Math.min(total - 1, i))) }, [total])
  const next = useCallback(() => { if (total) setIndex((i) => Math.min(total - 1, i + 1)) }, [total])
  const prev = useCallback(() => { if (total) setIndex((i) => Math.max(0, i - 1)) }, [total])
  const choose = useCallback((i: number) => { go(i); setContentsOpen(false) }, [go])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName
      const typing = tag === 'INPUT' || tag === 'TEXTAREA'
      if (e.key === 'Escape') {
        // The overlay closes itself on Escape, from a capturing listener that
        // runs before this one; nothing to do here but stay out of the way.
        if (shot) return
        if (contentsOpen) { e.preventDefault(); setContentsOpen(false) }
        return
      }
      if ((e.key === 'o' || e.key === 'O') && !typing) {
        e.preventDefault(); setContentsOpen((v) => !v); return
      }
      if (contentsOpen || typing || shot) return
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
  }, [contentsOpen, shot, next, prev, go, total])

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
    // A slide may carry a real control — a card's reference link, a codeui tab
    // pointing at the file on GitHub, the copy button on a prompt, the still
    // that opens full size. Without this the click does its own job *and*
    // turns the page, so the presenter lands on the wrong slide behind the
    // thing they just opened.
    if ((e.target as HTMLElement).closest('a, button, [role="button"], input, select, textarea')) return
    // On a phone the surface scrolls and the swipe turns the page, so a tap
    // turns no page — otherwise reading past the fold jumps a slide per tap.
    // It calls the chrome back instead, or sends it away: the same guard above
    // is what keeps that off the pictures, so tapping a still still opens it
    // full size rather than arguing with the bars.
    if (window.innerWidth <= 940) { setChromeHidden((v) => !v); return }
    if (e.clientX < window.innerWidth * 0.28) prev()
    else next()
  }

  if (total === 0) {
    return <div className="deck deck--msg"><p className="deck__msg mono">This deck has no slides.</p></div>
  }

  // The divider params are studio-only: the app renders the deck as written.
  const item = lab ? withLabOverrides(items[index], { marker, split, mark: markParam, art: artParam }) : items[index]
  const theme = itemTheme(item)
  const pageLabel = `${pad(index + 1)} / ${pad(total)}`
  // The running section header, taken from the part the slide was written in
  // rather than inferred from whatever divider came before it. Not drawn on a
  // `divider` — that slide is the part's own full title card, so a label
  // repeating it in the corner is noise — and not on a `standalone` slide,
  // which is how the cover and a full-bleed reference list opt out of chrome.
  const part = item.type === 'divider' || item.standalone ? null : (deck?.refAt || [])[index] || null

  return (
    <LightboxProvider value={{ open: setShot, enabled: true }}>
      <div
        className="deck"
        ref={deckRef}
        data-theme={theme}
        data-chrome={chromeHidden ? 'hidden' : undefined}
        data-reduced={reduced ? '' : undefined}
        onScroll={onDeckScroll}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <header className="chrome chrome--top" data-part={part ? '' : undefined}>
          <div className="brand">
            <button className="brand__menu" aria-label="Open contents (O)" aria-haspopup="dialog" onClick={() => setContentsOpen(true)}>
              <MenuIcon />
            </button>
            {/* Not on the cover: that slide is the deck's name, set as big as
                the stage allows, and a second copy of it 60px above in 14px
                type is the chrome talking over the slide it is framing. */}
            {mark && item.type !== 'cover' && <span className="brand__name">{mark}</span>}
          </div>
          {part && (
            <div className="partref">
              {part.number && <span className="mono partref__tag">Part {part.number}</span>}
              <span className="partref__name">{part.label}</span>
            </div>
          )}
        </header>

        <section className="stage" ref={stageRef} aria-live="polite" onScroll={syncStageFade} onClick={onStageClick}>
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              className="slidewrap"
              data-theme={theme}
              initial={{ opacity: 0, y: reduced ? 0 : 14 }}
              animate={{ opacity: 1, y: 0, transition: { duration: reduced ? 0.15 : 0.44, ease: EASE } }}
              exit={{ opacity: 0, y: reduced ? 0 : -10, transition: { duration: reduced ? 0.12 : 0.26, ease: EASE } }}
              onAnimationComplete={syncStageFade}
            >
              <Slide item={item} reduced={reduced} still={still} />
            </motion.div>
          </AnimatePresence>
        </section>

        {/* The page bar. On the desktop it is the page number it always was,
            bottom-right and quiet. On a phone the two steps either side of it
            come out of hiding, because there the page turns on a swipe and a
            swipe is a thing you have to already know about — the bar is what
            tells a reader the deck goes somewhere, and the counter in the
            middle opens the contents rather than only reporting a number. */}
        <footer className="chrome chrome--bottom">
          <button
            type="button"
            className="pageref__step"
            aria-label="Previous slide"
            onClick={prev}
            disabled={index === 0}
          >
            <StepIcon dir="prev" />
          </button>
          <button
            type="button"
            className="pageref__jump"
            aria-label="Open contents (O)"
            aria-haspopup="dialog"
            onClick={() => setContentsOpen(true)}
          >
            <span className="mono pageref__index">{pageLabel}</span>
          </button>
          <button
            type="button"
            className="pageref__step"
            aria-label="Next slide"
            onClick={next}
            disabled={index === total - 1}
          >
            <StepIcon dir="next" />
          </button>
        </footer>
      </div>

      <Contents
        open={contentsOpen}
        items={items}
        partAt={deck?.refAt}
        index={index}
        reduced={reduced}
        still={still}
        initialTab={labContents === 'slides' ? 'slides' : 'outline'}
        onSelect={choose}
        onClose={() => setContentsOpen(false)}
      />
      <Lightbox shot={shot} onClose={() => setShot(null)} reduced={reduced} />
    </LightboxProvider>
  )
}
