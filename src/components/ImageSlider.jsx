import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE_SETTLE } from '../lib/motion'

const asset = (src) =>
  typeof src === 'string' && src.length
    ? /^https?:/.test(src)
      ? src
      : import.meta.env.BASE_URL + src.replace(/^\//, '')
    : ''

function PlayPause({ playing }) {
  return playing ? (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
      <path d="M8 5l11 7-11 7z" />
    </svg>
  )
}

export default function ImageSlider({ images, reduced }) {
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(true)
  const n = images.length

  useEffect(() => {
    if (reduced || n <= 1 || !playing) return
    const id = setInterval(() => setI((p) => (p + 1) % n), 4400)
    return () => clearInterval(id)
  }, [reduced, n, playing])

  if (!n) return null
  const idx = Math.min(i, n - 1)
  const current = images[idx]

  return (
    <div className="slider">
      <div className="slider__frame">
        <AnimatePresence>
          <motion.img
            key={idx}
            className="slider__img"
            src={asset(current.src)}
            alt={current.caption || `Slide image ${idx + 1}`}
            initial={{ opacity: 0, scale: reduced ? 1 : 1.04 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: reduced ? 0.001 : 0.8, ease: EASE_SETTLE } }}
            exit={{ opacity: 0, transition: { duration: reduced ? 0.001 : 0.6, ease: EASE_SETTLE } }}
          />
        </AnimatePresence>
      </div>
      <div className="slider__foot">
        {current.caption && <span className="slider__caption micro">{current.caption}</span>}
        {n > 1 && (
          <div className="slider__controls">
            {!reduced && (
              <button
                type="button"
                className="slider__play"
                aria-label={playing ? 'Pause image rotation' : 'Play image rotation'}
                aria-pressed={!playing}
                onClick={() => setPlaying((p) => !p)}
              >
                <PlayPause playing={playing} />
              </button>
            )}
            <div className="slider__dots">
              {images.map((img, k) => (
                <button
                  key={k}
                  type="button"
                  className={`slider__dot ${k === idx ? 'is-on' : ''}`}
                  aria-label={`Show image ${k + 1} of ${n}`}
                  aria-current={k === idx ? 'true' : undefined}
                  onClick={() => { setI(k); setPlaying(false) }}
                >
                  <span aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
