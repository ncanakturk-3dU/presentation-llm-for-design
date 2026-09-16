import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { seededRandom } from '../../lib/lab'
import './CoverSphere.css'

const vertex = /* glsl */ `
  uniform float uSize;
  uniform float uPixelRatio;
  attribute float aRand;
  varying float vDepth;
  varying float vRand;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * (0.6 + aRand * 0.7) * uPixelRatio * (4.2 / -mv.z);
    gl_Position = projectionMatrix * mv;
    vDepth = clamp((mv.z + 3.0) / 3.0, 0.0, 1.0);
    vRand = aRand;
  }
`

const fragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vDepth;
  varying float vRand;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float edge = smoothstep(0.5, 0.12, d);
    float depth = mix(0.28, 1.0, vDepth);
    float a = edge * depth * (0.55 + vRand * 0.45);
    gl_FragColor = vec4(uColor, a);
  }
`

function Dots({ reduced, still }) {
  const ref = useRef()
  // Under `still` the per-dot sizes come from a fixed seed, so two captures of
  // one state are the same sphere and a diff between them is a real change.
  const geometry = useMemo(() => {
    const rnd = still ? seededRandom(0x5eed) : Math.random
    const N = 2800
    const pos = new Float32Array(N * 3)
    const rand = new Float32Array(N)
    const R = 1.5
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const theta = i * Math.PI * (3 - Math.sqrt(5))
      pos[i * 3] = Math.cos(theta) * r * R
      pos[i * 3 + 1] = y * R
      pos[i * 3 + 2] = Math.sin(theta) * r * R
      rand[i] = rnd()
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aRand', new THREE.BufferAttribute(rand, 1))
    return g
  }, [still])

  const uniforms = useMemo(
    () => ({
      uSize: { value: 3.4 },
      uPixelRatio: { value: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.8) },
      uColor: { value: new THREE.Color('#f3f2ee') },
    }),
    [],
  )

  useFrame((state, delta) => {
    if (!ref.current || reduced || still) return
    ref.current.rotation.y += delta * 0.11
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.14) * 0.09
  })

  return (
    <points ref={ref} geometry={geometry} rotation={[0.35, 0, 0.12]}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  )
}

/**
 * The dot sphere behind the cover.
 *
 * `standalone` is for the component stage only. On a slide the sphere sits in
 * `.cover__art`, which gives it both its box and the dark ground its bone dots
 * need; on its own it has neither, and a white sphere on the light ground is an
 * invisible component. The flag asks for that missing context and nothing else,
 * so the app never passes it.
 */
export default function CoverSphere({ reduced = false, still = false, standalone = false }) {
  const frozen = reduced || still
  return (
    <div className={`coversphere ${standalone ? 'coversphere--standalone' : ''}`} data-theme={standalone ? 'dark' : undefined}>
    <Canvas
      className="cover__canvas"
      frameloop={frozen ? 'demand' : 'always'}
      camera={{ position: [0, 0, 4.2], fov: 45 }}
      dpr={[1, 1.8]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
    >
      <Dots reduced={reduced} still={still} />
    </Canvas>
    </div>
  )
}
