import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import { samplePath } from './stations'

/**
 * Drives the default camera along the station path as the user scrolls, with a
 * subtle cursor parallax layered on top so the world feels handheld and alive.
 */
export default function CameraRig() {
  const scroll = useScroll()
  const { camera } = useThree()
  const target = useRef(new THREE.Vector3(0, 1.4, 0))
  const lookAt = useRef(new THREE.Vector3(0, 1.4, 0))

  useFrame((state, delta) => {
    const { pos, target: tgt } = samplePath(scroll.offset)

    // cursor parallax — small camera offset, eased
    const px = state.pointer.x * 0.6
    const py = state.pointer.y * 0.35
    target.current.set(pos.x + px, pos.y + py, pos.z)

    const k = 1 - Math.exp(-4 * delta)
    camera.position.lerp(target.current, k)
    lookAt.current.lerp(tgt, k)
    camera.lookAt(lookAt.current)
  })

  return null
}
