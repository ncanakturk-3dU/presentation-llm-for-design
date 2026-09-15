import { AnimatePresence, motion } from 'framer-motion'
import { EASE_SETTLE } from '../lib/motion'
import ImageSlider from './ImageSlider'
import BrowserFrame from './BrowserFrame'
import './Overlay.css'

const pad = (n) => String(n).padStart(2, '0')

function Chevron({ dir }) {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" aria-hidden="true">
      <path
        d={dir === 'next' ? 'M9.5 5.5 16 12l-6.5 6.5' : 'M14.5 5.5 8 12l6.5 6.5'}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function variants(reduced) {
  const parent = reduced
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.2 } }, exit: { opacity: 0, transition: { duration: 0.16 } } }
    : {
        hidden: {},
        show: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
        exit: { transition: { duration: 0.26, ease: EASE_SETTLE } },
      }
  const child = reduced
    ? { hidden: { opacity: 0 }, show: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        hidden: { opacity: 0, y: 18 },
        show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_SETTLE } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.26, ease: EASE_SETTLE } },
      }
  return { parent, child }
}

function StageText({ item, index, reduced, hint }) {
  const { parent, child } = variants(reduced)
  return (
    <AnimatePresence mode="wait">
      <motion.div key={index} className="slide" variants={parent} initial="hidden" animate="show" exit="exit">
        {item.type === 'quote' ? (
          <>
            <motion.blockquote className="quote" variants={child}>
              <p className="quote__text">{item.quote}</p>
            </motion.blockquote>
            {item.attribution && (
              <motion.p className="quote__by micro" variants={child}>{item.attribution}</motion.p>
            )}
          </>
        ) : (
          <>
            {item.title && <motion.h1 className="slide__title" variants={child}>{item.title}</motion.h1>}

            {item.type === 'category' && item.subtitle && (
              <motion.p className="slide__subtitle" variants={child}>{item.subtitle}</motion.p>
            )}

            {(item.type === 'point' || item.type === 'slider') && item.summary && (
              <motion.p className="slide__summary" variants={child}>{item.summary}</motion.p>
            )}

            {item.type === 'agenda' && Array.isArray(item.points) && (
              <motion.ol className="agenda" variants={parent}>
                {item.points.map((pt, k) => (
                  <motion.li className="agenda__row" key={k} variants={child}>
                    <span className="agenda__num">{pad(k + 1)}</span>
                    <span className="agenda__label">{typeof pt === 'string' ? pt : pt?.label}</span>
                  </motion.li>
                ))}
              </motion.ol>
            )}

            {item.type === 'stat' && Array.isArray(item.stats) && (
              <motion.div className="stats" variants={parent}>
                {item.stats.map((st, k) => (
                  <motion.div className="stat" key={k} variants={child}>
                    <span className="stat__value">{st?.value}</span>
                    <span className="stat__label micro">{st?.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}

        {item.credit && <motion.p className="slide__credit micro" variants={child}>{item.credit}</motion.p>}
        {hint && <motion.p className="slide__hint micro" variants={child}>{hint}</motion.p>}
      </motion.div>
    </AnimatePresence>
  )
}

export default function Overlay({ items, index, meta, go, next, prev, reduced, accent }) {
  const item = items[index]
  const total = items.length
  const showHint = index === 0 ? meta.hint : null
  const images = Array.isArray(item.images) ? item.images.filter((im) => im && typeof im.src === 'string') : []

  return (
    <div className="overlay" style={{ '--accent': accent }}>
      <div className="overlay__scrim" aria-hidden="true" />

      <header className="mark">
        {meta.mark && <span className="mark__name micro">{meta.mark}</span>}
        {meta.source && <span className="mark__src micro">{meta.source}</span>}
      </header>

      <div className="pos" aria-hidden="true">
        <div className="pos__index">
          <span className="pos__num">{pad(index + 1)}</span>
          <span className="pos__total">/ {pad(total)}</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            className="pos__chapter micro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.4, ease: EASE_SETTLE } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            {item.chapter || item.type}
          </motion.span>
        </AnimatePresence>
      </div>

      <main className={`stage stage--${item.type}`} aria-live="polite">
        <StageText item={item} index={index} reduced={reduced} hint={showHint} />
      </main>

      <AnimatePresence mode="wait">
        {item.type === 'slider' && images.length > 0 && (
          <motion.div
            key={`sl-${index}`}
            className="slider-panel"
            initial={{ opacity: 0, scale: reduced ? 1 : 0.975 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: reduced ? 0.2 : 0.7, ease: EASE_SETTLE, delay: reduced ? 0 : 0.12 } }}
            exit={{ opacity: 0, scale: reduced ? 1 : 0.985, transition: { duration: reduced ? 0.15 : 0.5, ease: EASE_SETTLE } }}
          >
            <ImageSlider images={images} reduced={reduced} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {item.type === 'browser' && item.url && (
          <motion.div
            key={`br-${index}`}
            className="browser-panel"
            initial={{ opacity: 0, scale: reduced ? 1 : 0.975 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: reduced ? 0.2 : 0.7, ease: EASE_SETTLE, delay: reduced ? 0 : 0.12 } }}
            exit={{ opacity: 0, scale: reduced ? 1 : 0.985, transition: { duration: reduced ? 0.15 : 0.5, ease: EASE_SETTLE } }}
          >
            <BrowserFrame url={item.url} />
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="controls" aria-label="Slide navigation">
        <ol className="rail">
          {items.map((s, i) => (
            <li key={i}>
              <button
                type="button"
                className={`rail__tick ${i === index ? 'is-current' : ''} ${i < index ? 'is-past' : ''}`}
                aria-label={`Go to slide ${i + 1}: ${s.chapter || s.title || s.type}`}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => go(i)}
              >
                <span aria-hidden="true" />
              </button>
            </li>
          ))}
        </ol>
        <div className="arrows">
          <button type="button" className="arrow" aria-label="Previous slide" disabled={index === 0} onClick={prev}>
            <Chevron dir="prev" />
          </button>
          <button type="button" className="arrow" aria-label="Next slide" disabled={index === total - 1} onClick={next}>
            <Chevron dir="next" />
          </button>
        </div>
      </nav>
    </div>
  )
}
