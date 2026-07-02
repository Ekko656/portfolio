import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const BASE = '/models/scifi/'

/**
 * Loads + clones a Quaternius Modular Sci-Fi MegaKit piece (real CC0 PBR model)
 * and enables shadows. Cloning lets the same model be placed many times.
 */
export default function Model({
  name,
  position,
  rotation,
  scale,
}: {
  name: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
}) {
  const { scene } = useGLTF(BASE + name + '.gltf')
  const cloned = useMemo(() => {
    const c = scene.clone(true)
    c.traverse((o) => {
      const m = o as THREE.Mesh
      if (m.isMesh) {
        m.castShadow = true
        m.receiveShadow = true
      }
    })
    return c
  }, [scene])
  return <primitive object={cloned} position={position} rotation={rotation} scale={scale} />
}

/** Preload the pieces used in the scene so they pop in together. */
export function preloadKit(names: string[]) {
  names.forEach((n) => useGLTF.preload(BASE + n + '.gltf'))
}
