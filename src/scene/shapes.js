const TAU = Math.PI * 2

function fit(arr, radius) {
  let max = 0
  for (let i = 0; i < arr.length; i += 3) {
    const d = Math.hypot(arr[i], arr[i + 1], arr[i + 2])
    if (d > max) max = d
  }
  if (max > 0) {
    const k = radius / max
    for (let i = 0; i < arr.length; i++) arr[i] *= k
  }
  return arr
}

function gauss() {
  let u = 0, v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v)
}

function sphere(n) {
  const p = new Float32Array(n * 3)
  const phi = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const t = phi * i
    const shell = 1 + gauss() * 0.012
    p[i * 3] = Math.cos(t) * r * shell
    p[i * 3 + 1] = y * shell
    p[i * 3 + 2] = Math.sin(t) * r * shell
  }
  return p
}

function lattice(n) {
  const p = new Float32Array(n * 3)
  const s = Math.ceil(Math.cbrt(n))
  for (let i = 0; i < n; i++) {
    const x = i % s
    const y = Math.floor(i / s) % s
    const z = Math.floor(i / (s * s)) % s
    p[i * 3] = (x / (s - 1) - 0.5) * 2
    p[i * 3 + 1] = (y / (s - 1) - 0.5) * 2
    p[i * 3 + 2] = (z / (s - 1) - 0.5) * 2
  }
  return p
}

function cloud(n) {
  const p = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const rx = gauss(), ry = gauss(), rz = gauss()
    const swirl = 0.6 + Math.abs(rx * ry) * 0.4
    p[i * 3] = rx * 0.68 * swirl
    p[i * 3 + 1] = ry * 0.6
    p[i * 3 + 2] = rz * 0.68 * swirl
  }
  return p
}

function torus(n) {
  const p = new Float32Array(n * 3)
  const R = 1, r = 0.36
  for (let i = 0; i < n; i++) {
    const u = Math.random() * TAU
    const v = Math.random() * TAU
    const rr = r * (0.82 + Math.random() * 0.18)
    p[i * 3] = (R + rr * Math.cos(v)) * Math.cos(u)
    p[i * 3 + 1] = rr * Math.sin(v)
    p[i * 3 + 2] = (R + rr * Math.cos(v)) * Math.sin(u)
  }
  return p
}

const ICO_T = (1 + Math.sqrt(5)) / 2
const ICO_V = [
  [-1, ICO_T, 0], [1, ICO_T, 0], [-1, -ICO_T, 0], [1, -ICO_T, 0],
  [0, -1, ICO_T], [0, 1, ICO_T], [0, -1, -ICO_T], [0, 1, -ICO_T],
  [ICO_T, 0, -1], [ICO_T, 0, 1], [-ICO_T, 0, -1], [-ICO_T, 0, 1],
]
const ICO_F = [
  [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
  [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
  [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
  [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
]
const OCTA_V = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]
const OCTA_F = [
  [0, 2, 4], [2, 1, 4], [1, 3, 4], [3, 0, 4],
  [2, 0, 5], [1, 2, 5], [3, 1, 5], [0, 3, 5],
]

function edgesOf(faces) {
  const set = new Set()
  const edges = []
  for (const f of faces) {
    for (let k = 0; k < 3; k++) {
      const a = f[k], b = f[(k + 1) % 3]
      const key = a < b ? a + '_' + b : b + '_' + a
      if (!set.has(key)) { set.add(key); edges.push([a, b]) }
    }
  }
  return edges
}

function facetedSolid(verts, faces, edgeFrac) {
  const edges = edgesOf(faces)
  return (n) => {
    const p = new Float32Array(n * 3)
    const edgeCount = Math.floor(n * edgeFrac)
    for (let i = 0; i < n; i++) {
      if (i < edgeCount) {
        const e = edges[(Math.random() * edges.length) | 0]
        const a = verts[e[0]], b = verts[e[1]]
        const t = Math.random()
        const j = 0.012
        p[i * 3] = a[0] + (b[0] - a[0]) * t + gauss() * j
        p[i * 3 + 1] = a[1] + (b[1] - a[1]) * t + gauss() * j
        p[i * 3 + 2] = a[2] + (b[2] - a[2]) * t + gauss() * j
      } else {
        const f = faces[(Math.random() * faces.length) | 0]
        const a = verts[f[0]], b = verts[f[1]], c = verts[f[2]]
        let u = Math.random(), v = Math.random()
        if (u + v > 1) { u = 1 - u; v = 1 - v }
        const w = 1 - u - v
        p[i * 3] = a[0] * w + b[0] * u + c[0] * v
        p[i * 3 + 1] = a[1] * w + b[1] * u + c[1] * v
        p[i * 3 + 2] = a[2] * w + b[2] * u + c[2] * v
      }
    }
    return p
  }
}

const icosahedron = facetedSolid(ICO_V, ICO_F, 0.55)
const octahedron = facetedSolid(OCTA_V, OCTA_F, 0.6)

function knot(n) {
  const p = new Float32Array(n * 3)
  const P = 3, Q = 7
  for (let i = 0; i < n; i++) {
    const t = Math.random() * TAU
    const rr = Math.cos(Q * t) * 0.5 + 2
    const cx = rr * Math.cos(P * t)
    const cy = rr * Math.sin(P * t)
    const cz = Math.sin(Q * t) * 0.7
    const tube = 0.12
    p[i * 3] = cx + gauss() * tube
    p[i * 3 + 1] = cy + gauss() * tube
    p[i * 3 + 2] = cz + gauss() * tube
  }
  return p
}

function helix(n) {
  const p = new Float32Array(n * 3)
  const turns = 4.5, rad = 0.78, height = 3.4
  const rungEvery = 0.045
  for (let i = 0; i < n; i++) {
    const f = i / n
    const roll = Math.random()
    if (roll < 0.16) {
      const seg = Math.floor(f / rungEvery)
      const fa = seg * rungEvery
      const a = fa * turns * TAU
      const cross = Math.random()
      p[i * 3] = Math.cos(a) * rad * (1 - 2 * cross) + gauss() * 0.03
      p[i * 3 + 1] = (fa - 0.5) * height + gauss() * 0.01
      p[i * 3 + 2] = Math.sin(a) * rad * (1 - 2 * cross) + gauss() * 0.03
    } else {
      const strand = i % 2
      const a = f * turns * TAU + strand * Math.PI
      p[i * 3] = Math.cos(a) * rad + gauss() * 0.035
      p[i * 3 + 1] = (f - 0.5) * height
      p[i * 3 + 2] = Math.sin(a) * rad + gauss() * 0.035
    }
  }
  return p
}

function spiral(n) {
  const p = new Float32Array(n * 3)
  const arms = 4, turns = 2.6
  for (let i = 0; i < n; i++) {
    const roll = Math.random()
    if (roll < 0.24) {
      p[i * 3] = gauss() * 0.32
      p[i * 3 + 1] = gauss() * 0.16
      p[i * 3 + 2] = gauss() * 0.32
    } else {
      const arm = i % arms
      const f = i / n
      const radius = Math.sqrt(f) * 1.5
      const a = f * turns * TAU + (arm / arms) * TAU
      const scatter = (1 - f) * 0.12 + 0.05
      p[i * 3] = Math.cos(a) * radius + gauss() * scatter
      p[i * 3 + 1] = gauss() * (0.06 + f * 0.05)
      p[i * 3 + 2] = Math.sin(a) * radius + gauss() * scatter
    }
  }
  return p
}

function burst(n) {
  const p = new Float32Array(n * 3)
  const rays = 90
  for (let i = 0; i < n; i++) {
    const roll = Math.random()
    if (roll < 0.35) {
      const u = Math.random() * 2 - 1
      const t = Math.random() * TAU
      const rc = Math.sqrt(1 - u * u)
      const rad = Math.pow(Math.random(), 0.6) * 0.55
      p[i * 3] = Math.cos(t) * rc * rad
      p[i * 3 + 1] = u * rad
      p[i * 3 + 2] = Math.sin(t) * rc * rad
    } else {
      const ray = (Math.random() * rays) | 0
      const u = ((ray % 9) / 9) * 2 - 1
      const t = (ray / rays) * TAU * 7
      const rc = Math.sqrt(Math.max(0, 1 - u * u))
      const dist = 0.5 + Math.pow(Math.random(), 1.6) * 1.6
      const j = 0.03
      p[i * 3] = Math.cos(t) * rc * dist + gauss() * j
      p[i * 3 + 1] = u * dist + gauss() * j
      p[i * 3 + 2] = Math.sin(t) * rc * dist + gauss() * j
    }
  }
  return p
}

const SHAPES = { sphere, lattice, cloud, torus, icosahedron, octahedron, knot, helix, spiral, burst }

const RADIUS = { lattice: 1.9, cloud: 2.35, helix: 2.4, spiral: 2.4, burst: 2.4 }

export function buildShape(id, count) {
  const gen = SHAPES[id] || SHAPES.sphere
  return fit(gen(count), RADIUS[id] || 2.15)
}
