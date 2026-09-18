import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import CopyButton from '../CopyButton/CopyButton'
import './Lightbox.css'

/**
 * What a slide hands the lightbox.
 *
 * Two kinds, because two things on a slide are too small to read from the back
 * of a room: a still of a page, and a prompt. `href` is optional on both and is
 * the real thing behind what is shown — a link out sits inside the overlay
 * rather than replacing the click, because a talk needs the thing big far more
 * often than it needs the site.
 */
export type ImageShot = { kind?: 'image'; src: string; alt: string; label?: string; href?: string }
export type TextShot = { kind: 'text'; text: string; label?: string; href?: string }
export type Shot = ImageShot | TextShot

const isText = (shot: Shot): shot is TextShot => shot.kind === 'text'

/**
 * The sizes the prompt can be read at, in pixels.
 *
 * A ladder rather than a zoom: the point is that someone in the back row can
 * read it, and four steps reach that in one or two presses. `18` is the middle
 * and the size the overlay opens at — already twice the pane on the slide.
 */
const TEXT_SIZES = [14, 18, 24, 32] as const

type Ctx = { open: (shot: Shot) => void; enabled: boolean }

/**
 * Default to a no-op: `Slide` also renders inside designlab's component host,
 * with no deck around it and so no provider. There, an image is a picture and
 * nothing more, which is what a component variant should be.
 */
const LightboxCtx = createContext<Ctx>({ open: () => {}, enabled: false })

export const useLightbox = () => useContext(LightboxCtx)

export function LightboxProvider({ value, children }: { value: Ctx; children: ReactNode }) {
  return <LightboxCtx.Provider value={value}>{children}</LightboxCtx.Provider>
}

/**
 * The overlay itself: the still at the size the room needs it, over the slide
 * it came from.
 *
 * Escape and a click on the backdrop both close it, and the deck's own key
 * handler stands down while it is open — a picture that swallows the arrow
 * keys is better than one that pages the deck behind it.
 */
export default function Lightbox({ shot, onClose, reduced = false }: { shot: Shot | null; onClose: () => void; reduced?: boolean }) {
  useEffect(() => {
    if (!shot) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); onClose() }
    }
    // Capture: the deck listens on window too, and Escape there closes the
    // contents panel. First listener wins, and the overlay is what is on top.
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [shot, onClose])

  if (!shot) return null
  const label = shot.label || (isText(shot) ? 'Prompt' : shot.alt) || 'Full size'
  return (
    <div
      className="lightbox"
      data-reduced={reduced ? '' : undefined}
      data-kind={isText(shot) ? 'text' : 'image'}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={onClose}
    >
      <figure className="lightbox__fig" onClick={(e) => e.stopPropagation()}>
        {isText(shot) ? <TextBody shot={shot} /> : <img className="lightbox__img" src={shot.src} alt={shot.alt} />}
        <figcaption className="lightbox__bar">
          {shot.label && <span className="lightbox__cap mono">{shot.label}</span>}
          <span className="lightbox__spacer" />
          {isText(shot) && <CopyButton code={shot.text} />}
          {shot.href && (
            <a className="lightbox__link mono" href={shot.href} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
              {isText(shot) ? 'open the file ↗' : 'open the page ↗'}
            </a>
          )}
          <button type="button" className="lightbox__close mono" onClick={onClose}>close · esc</button>
        </figcaption>
      </figure>
    </div>
  )
}

/**
 * A prompt at a size the room can read, with the size in the reader's hands.
 *
 * The control is two steps rather than a slider: on stage the question is only
 * ever "bigger" or "smaller", and a slider is something to aim at while people
 * wait. The buttons disable at the ends of the ladder so a press that does
 * nothing looks like nothing rather than like a broken overlay.
 */
function TextBody({ shot }: { shot: TextShot }) {
  const [step, setStep] = useState(1)
  const size = TEXT_SIZES[step]
  const move = (by: number) => setStep((n) => Math.max(0, Math.min(TEXT_SIZES.length - 1, n + by)))

  return (
    <div className="lightbox__textwrap">
      <div className="lightbox__sizer mono">
        <button
          type="button"
          className="lightbox__size"
          onClick={() => move(-1)}
          disabled={step === 0}
          aria-label="Smaller text"
        >
          A−
        </button>
        <span className="lightbox__sizeval" aria-live="polite">{size}px</span>
        <button
          type="button"
          className="lightbox__size"
          onClick={() => move(1)}
          disabled={step === TEXT_SIZES.length - 1}
          aria-label="Bigger text"
        >
          A+
        </button>
      </div>
      <pre className="lightbox__text" style={{ fontSize: `${size}px` }}>{shot.text}</pre>
    </div>
  )
}
