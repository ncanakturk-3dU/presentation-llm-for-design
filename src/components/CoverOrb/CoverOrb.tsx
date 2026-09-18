import { useEffect, useRef } from 'react'
import { MODE_DRAWS, resolvePreset, type OrbState } from 'thinking-orbs/engine'
import './CoverOrb.css'

/**
 * The cover's orb, drawn at cover scale.
 *
 * `thinking-orbs` ships its React component at two tuned size presets, 64 and
 * 20 CSS px, and neither is a cover: a 64px mark held against a 90px title is
 * a favicon, and scaling that canvas up is a raster stretched past its backing
 * store. The package's `engine` subpath is the way out — `MODE_DRAWS` paints a
 * mode into a context at whatever CSS size it is handed, and the preset's own
 * options carry `rsPow` / `rSizeMul`, so dot radii grow sub-linearly with the
 * frame instead of being fixed at the 64px tuning. So the animation is the
 * package's, unmodified; only the frame it is painted into is ours.
 *
 * The box comes from CSS, not a prop, which is what lets the cover keep its
 * old responsive art: `clamp(280px, 42vw, 560px)` on a laptop, `112vw` pushed
 * off the right edge on a phone. A ResizeObserver reads that box back and the
 * canvas is rebuilt at the device pixel ratio for it.
 */
export default function CoverOrb({
  state = 'connecting',
  dark = true,
  speed = 1,
  reduced = false,
  still = false,
  standalone = false,
}: {
  state?: OrbState
  dark?: boolean
  speed?: number
  reduced?: boolean
  still?: boolean
  standalone?: boolean
}) {
  const canvas = useRef<HTMLCanvasElement>(null)
  // `still` is designlab asking for a frame that is identical every capture,
  // and `reduced` is the reader asking for no motion. Both land on one held
  // frame; the constant is the package's own reduced-motion instant, so the
  // still is a pose the author of the animation picked.
  const frozen = reduced || still

  useEffect(() => {
    const el = canvas.current
    if (!el) return
    const { mode, speed: baked, opts } = resolvePreset(state, 64)
    const draw = MODE_DRAWS[mode]
    const rate = baked * speed

    let size = 0
    let dpr = 0
    const frame = (t: number) => {
      const ctx = el.getContext('2d')
      if (!ctx || !size) return
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, size, size)
      draw(ctx, size, t, dark, opts)
    }

    let raf = 0
    let running = false
    const loop = () => {
      frame((performance.now() / 1000) * rate)
      if (running) raf = requestAnimationFrame(loop)
    }
    const start = () => {
      if (running || frozen) return
      running = true
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    // The canvas is square and sized off the box's smaller side: the phone's
    // art box is a square too, but a ResizeObserver reports it mid-layout and
    // a one-frame oblong reads as a squashed orb.
    const resize = () => {
      const box = el.parentElement?.getBoundingClientRect()
      const next = Math.round(Math.min(box?.width || 0, box?.height || 0))
      if (!next) return
      size = next
      dpr = Math.min(2, window.devicePixelRatio || 1)
      el.width = Math.round(size * dpr)
      el.height = Math.round(size * dpr)
      el.style.width = `${size}px`
      el.style.height = `${size}px`
      frame(frozen ? 0.6 : (performance.now() / 1000) * rate)
    }

    const ro = new ResizeObserver(resize)
    if (el.parentElement) ro.observe(el.parentElement)
    resize()

    if (frozen) return () => ro.disconnect()

    // Same economy the package's own component keeps: an orb that is scrolled
    // away or on a hidden tab stops burning frames.
    let visible = true
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && document.visibilityState !== 'hidden') start()
      else stop()
    })
    io.observe(el)
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') stop()
      else if (visible) start()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [state, dark, speed, frozen])

  return (
    <div
      className={`coverorb ${standalone ? 'coverorb--standalone' : ''}`}
      data-theme={standalone ? (dark ? 'dark' : 'light') : undefined}
    >
      <canvas ref={canvas} className="coverorb__canvas" role="img" aria-label={`${state}…`} />
    </div>
  )
}
