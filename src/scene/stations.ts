import * as THREE from 'three'

/**
 * Camera keyframes for the cinematic scroll journey. The rig interpolates
 * position + look-at target between these as scroll progresses 0 → 1. Each
 * station lines up with one full-viewport page of overlay content.
 */
export type Station = {
  pos: [number, number, number]
  target: [number, number, number]
}

export const STATIONS: Station[] = [
  // 0 — Hero: three-quarter view of the arm on its plinth
  { pos: [4.2, 2.4, 7.5], target: [0, 1.4, 0] },
  // 1 — About: drift left into the particle field
  { pos: [-5.5, 2.2, 4.5], target: [-2.5, 1.2, -2] },
  // 2 — Projects: sweep around behind, past the floating props
  { pos: [6.5, 1.8, -2], target: [1.5, 0.8, -6.5] },
  // 3 — Contact: settle back in front, arm reaching toward the viewer
  { pos: [0.5, 2.0, 6.5], target: [0, 1.5, 0] },
]

export const PAGES = STATIONS.length

const _p = new THREE.Vector3()
const _t = new THREE.Vector3()
const posVecs = STATIONS.map((s) => new THREE.Vector3(...s.pos))
const tgtVecs = STATIONS.map((s) => new THREE.Vector3(...s.target))

/** Sample the camera path at scroll offset (0..1). Returns {pos, target}. */
export function samplePath(offset: number) {
  const n = STATIONS.length - 1
  const x = THREE.MathUtils.clamp(offset, 0, 1) * n
  const i = Math.min(Math.floor(x), n - 1)
  const f = x - i
  // smoothstep for eased segment transitions
  const s = f * f * (3 - 2 * f)
  _p.copy(posVecs[i]).lerp(posVecs[i + 1], s)
  _t.copy(tgtVecs[i]).lerp(tgtVecs[i + 1], s)
  return { pos: _p, target: _t }
}
