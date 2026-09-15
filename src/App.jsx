import { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import ParticleField from './scene/ParticleField'
import Overlay from './components/Overlay'
import ErrorBoundary from './components/ErrorBoundary'
import { useContent } from './lib/useContent'
import { useReducedMotion } from './lib/motion'
import './App.css'

const FIELD_MODE = { slider: 'plane', category: 'ambient', quote: 'ambient', browser: 'ambient' }

export default function App() {
  const { status, data, error } = useContent()
  const [index, setIndex] = useState(0)
  const reduced = useReducedMotion()

  const items = data?.items || []
  const total = items.length
  const meta = data?.meta || {}

  useEffect(() => {
    if (meta.mark) document.title = meta.mark
  }, [meta.mark])

  const go = useCallback((i) => { if (total) setIndex(Math.max(0, Math.min(total - 1, i))) }, [total])
  const next = useCallback(() => { if (total) setIndex((i) => Math.min(total - 1, i + 1)) }, [total])
  const prev = useCallback(() => { if (total) setIndex((i) => Math.max(0, i - 1)) }, [total])

  useEffect(() => {
    const onKey = (e) => {
      const onButton = document.activeElement && document.activeElement.tagName === 'BUTTON'
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault(); next()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault(); prev()
      } else if (e.key === ' ' || e.key === 'Enter') {
        if (onButton) return
        e.preventDefault(); next()
      } else if (e.key === 'Home') {
        e.preventDefault(); go(0)
      } else if (e.key === 'End') {
        e.preventDefault(); go(total - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, go, total])

  const touchX = useRef(null)
  const onTouchStart = (e) => { touchX.current = e.changedTouches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchX.current == null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 64) (dx < 0 ? next() : prev())
    touchX.current = null
  }

  if (status === 'loading') {
    return <div className="app app--msg"><p className="app__msg micro">Loading…</p></div>
  }
  if (status === 'error') {
    return <div className="app app--msg"><p className="app__msg micro">Could not load content.json{error ? ` — ${error}` : ''}</p></div>
  }
  if (total === 0) {
    return <div className="app app--msg"><p className="app__msg micro">content.json has no items. Add slides to the "items" array.</p></div>
  }

  const item = items[index]
  const shape = item.shape || 'sphere'
  const colorA = item.colorA || '#ffc44d'
  const colorB = item.colorB || '#ff7d38'

  return (
    <ErrorBoundary>
      <div className="app" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <Canvas
          className="canvas"
          camera={{ position: [0, 0, 6.2], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          onCreated={({ gl }) => gl.setClearColor('#0d0f0e', 1)}
        >
          <ParticleField mode={FIELD_MODE[item.type] || 'model'} shape={shape} colorA={colorA} colorB={colorB} reduced={reduced} />
          <EffectComposer>
            <Bloom intensity={1.15} luminanceThreshold={0.1} luminanceSmoothing={0.9} radius={0.72} mipmapBlur />
          </EffectComposer>
        </Canvas>
        <Overlay
          items={items}
          meta={meta}
          index={index}
          go={go}
          next={next}
          prev={prev}
          reduced={reduced}
          accent={colorA}
        />
      </div>
    </ErrorBoundary>
  )
}
