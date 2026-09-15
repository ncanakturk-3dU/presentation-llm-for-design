import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { buildShape } from './shapes'

const COUNT = 48000
const MORPH_DURATION = 1.9

const vertexShader = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uDrift;
  attribute vec3 aTarget;
  attribute vec3 aRand;
  attribute float aEdge;
  varying float vMix;
  varying float vBright;
  varying float vSeed;
  varying float vEdge;
  void main() {
    vec3 p = mix(position, aTarget, uProgress);
    float ph = aRand.x * 6.2831853;
    vec3 flow;
    flow.x = sin(uTime * 0.40 + p.y * 1.5 + ph);
    flow.y = cos(uTime * 0.34 + p.z * 1.5 + ph * 1.2);
    flow.z = sin(uTime * 0.46 + p.x * 1.5 + ph * 0.7);
    p += flow * uDrift;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float size = uSize * (0.35 + aRand.z * 1.1);
    gl_PointSize = size * uPixelRatio * (6.5 / -mv.z);
    gl_Position = projectionMatrix * mv;
    vMix = clamp(0.5 + p.y * 0.24 + (aRand.x - 0.5) * 0.9, 0.0, 1.0);
    vBright = 0.55 + aRand.z * 0.9;
    vSeed = aRand.y;
    vEdge = aEdge;
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uTime;
  uniform float uOpacity;
  uniform float uPlaneMode;
  varying float vMix;
  varying float vBright;
  varying float vSeed;
  varying float vEdge;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float alpha = pow(smoothstep(0.5, 0.0, d), 1.5);
    float twinkle = 0.85 + 0.15 * sin(uTime * 1.1 + vSeed * 24.0);
    vec3 col = mix(uColorA, uColorB, vMix) * vBright * twinkle;
    float edgeAlpha = mix(1.0, vEdge, uPlaneMode);
    gl_FragColor = vec4(col, alpha * 0.42 * uOpacity * edgeAlpha);
  }
`

// panelWorldRect mirrors the .slider-panel CSS layout in Overlay.css; keep the two in sync.
function panelWorldRect(W, H, camera) {
  const visH = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360)
  const visW = visH * (W / H)
  const clamp = (a, v, b) => Math.min(Math.max(v, a), b)
  const inset = clamp(22, 0.044 * W, 60)
  let left, top, pw, ph
  if (W > 900) {
    pw = Math.min(0.52 * W, 780)
    left = W - inset - pw
    top = clamp(96, 0.15 * H, 150)
    ph = H - 2 * top
  } else {
    left = inset
    pw = W - 2 * inset
    top = clamp(84, 0.13 * H, 120)
    ph = 0.4 * H
  }
  const cx = left + pw / 2
  const cy = top + ph / 2
  return {
    wx: (cx / W - 0.5) * visW,
    wy: (0.5 - cy / H) * visH,
    ww: (pw / W) * visW,
    wh: (ph / H) * visH,
  }
}

function buildPlane(count, ww, wh) {
  const halo = 1.26
  const W = ww * halo
  const H = wh * halo
  const pos = new Float32Array(count * 3)
  const edge = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    const u = Math.random()
    const v = Math.random()
    pos[i * 3] = (u - 0.5) * W
    pos[i * 3 + 1] = (v - 0.5) * H
    pos[i * 3 + 2] = (Math.random() - 0.5) * 0.06
    edge[i] = THREE.MathUtils.smoothstep(Math.min(u, 1 - u, v, 1 - v), 0, 0.2)
  }
  return { pos, edge }
}

export default function ParticleField({ mode, shape, colorA, colorB, reduced }) {
  const spinRef = useRef()
  const tiltRef = useRef()
  const matRef = useRef()
  const progress = useRef({ v: 1 })
  const morphTween = useRef(null)
  const posTarget = useRef(new THREE.Vector3(0, 0, 0))
  const scaleTarget = useRef(1)
  const { size, camera } = useThree()

  const getShape = useMemo(() => {
    const cache = new Map()
    return (id) => {
      if (!cache.has(id)) cache.set(id, buildShape(id, COUNT))
      return cache.get(id)
    }
  }, [])

  const rect = mode === 'plane' ? panelWorldRect(size.width, size.height, camera) : null
  const planeKey = rect ? `${Math.round(rect.ww * 100)}x${Math.round(rect.wh * 100)}` : 'na'
  const narrow = size.width <= 900

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const base = getShape('sphere')
    const rand = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT * 3; i++) rand[i] = Math.random()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(base), 3))
    g.setAttribute('aTarget', new THREE.BufferAttribute(new Float32Array(base), 3))
    g.setAttribute('aRand', new THREE.BufferAttribute(rand, 3))
    g.setAttribute('aEdge', new THREE.BufferAttribute(new Float32Array(COUNT).fill(1), 1))
    return g
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 1 },
      uTime: { value: 0 },
      uSize: { value: 4.6 },
      uPixelRatio: { value: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.5) },
      uDrift: { value: reduced ? 0 : 0.045 },
      uColorA: { value: new THREE.Color(colorA) },
      uColorB: { value: new THREE.Color(colorB) },
      uOpacity: { value: 1 },
      uPlaneMode: { value: mode === 'plane' ? 1 : 0 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useEffect(() => {
    const g = geometry
    const posAttr = g.attributes.position
    const tgtAttr = g.attributes.aTarget
    const edgeAttr = g.attributes.aEdge
    const p = progress.current.v
    const pos = posAttr.array
    const tg = tgtAttr.array
    for (let i = 0; i < pos.length; i++) pos[i] += (tg[i] - pos[i]) * p

    if (mode === 'plane' && rect) {
      const plane = buildPlane(COUNT, rect.ww, rect.wh)
      tg.set(plane.pos)
      edgeAttr.array.set(plane.edge)
    } else {
      tg.set(getShape(shape))
      edgeAttr.array.fill(1)
    }
    posAttr.needsUpdate = true
    tgtAttr.needsUpdate = true
    edgeAttr.needsUpdate = true

    morphTween.current?.kill()
    progress.current.v = 0
    const dur = reduced ? 0.001 : MORPH_DURATION
    if (matRef.current) {
      matRef.current.uniforms.uProgress.value = 0
      const a = new THREE.Color(colorA)
      const b = new THREE.Color(colorB)
      gsap.to(matRef.current.uniforms.uColorA.value, { r: a.r, g: a.g, b: a.b, duration: dur, ease: 'power2.inOut' })
      gsap.to(matRef.current.uniforms.uColorB.value, { r: b.r, g: b.g, b: b.b, duration: dur, ease: 'power2.inOut' })
      gsap.to(matRef.current.uniforms.uPlaneMode, { value: mode === 'plane' ? 1 : 0, duration: dur, ease: 'power2.inOut' })
    }
    morphTween.current = gsap.to(progress.current, {
      v: 1,
      duration: dur,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (matRef.current) matRef.current.uniforms.uProgress.value = progress.current.v
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, shape, colorA, colorB, reduced, planeKey])

  useEffect(() => {
    if (!matRef.current) return
    const target = mode === 'ambient' ? 0.3 : 1
    gsap.to(matRef.current.uniforms.uOpacity, { value: target, duration: reduced ? 0.001 : 0.9, ease: 'power2.out' })
  }, [mode, reduced])

  useEffect(() => () => morphTween.current?.kill(), [])

  useFrame((state, delta) => {
    if (matRef.current && !reduced) matRef.current.uniforms.uTime.value += delta

    if (mode === 'plane' && rect) {
      posTarget.current.set(rect.wx, rect.wy, 0)
    } else {
      posTarget.current.set(narrow ? 0 : mode === 'ambient' ? 0 : 1.0, narrow ? 0.55 : 0, 0)
    }
    scaleTarget.current = mode === 'ambient' ? 1.05 : mode === 'plane' ? 1 : narrow ? 0.82 : 1

    if (spinRef.current) {
      spinRef.current.position.lerp(posTarget.current, 0.08)
      const s = spinRef.current.scale.x + (scaleTarget.current - spinRef.current.scale.x) * 0.08
      spinRef.current.scale.setScalar(s)
      if (mode === 'plane') {
        spinRef.current.rotation.y += (0 - spinRef.current.rotation.y) * 0.08
      } else if (!reduced) {
        spinRef.current.rotation.y += delta * 0.05
      }
    }
    if (tiltRef.current) {
      const active = mode !== 'plane' && !reduced
      const tx = active ? state.pointer.y * 0.16 : 0
      const ty = active ? state.pointer.x * 0.22 : 0
      tiltRef.current.rotation.x += (tx - tiltRef.current.rotation.x) * 0.04
      tiltRef.current.rotation.y += (ty - tiltRef.current.rotation.y) * 0.04
    }
  })

  return (
    <group ref={tiltRef}>
      <group ref={spinRef}>
        <points geometry={geometry} frustumCulled={false}>
          <shaderMaterial
            ref={matRef}
            uniforms={uniforms}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            transparent
            depthWrite={false}
            depthTest={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>
    </group>
  )
}
