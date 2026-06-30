import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { M } from './materials'

type V3 = [number, number, number]

/* ----------------------------- kit pieces ----------------------------- */

function Pillar({ position, height = 10 }: { position: V3; height?: number }) {
  return (
    <group position={position}>
      <mesh material={M.hull} position={[0, height / 2, 0]}>
        <boxGeometry args={[0.75, height, 0.75]} />
      </mesh>
      <mesh material={M.hullLight} position={[0, 0.35, 0]}>
        <boxGeometry args={[1.0, 0.7, 1.0]} />
      </mesh>
      <mesh material={M.hullLight} position={[0, height - 0.35, 0]}>
        <boxGeometry args={[1.0, 0.7, 1.0]} />
      </mesh>
      <mesh material={M.blue} position={[0, height / 2, 0.385]}>
        <boxGeometry args={[0.12, height * 0.66, 0.02]} />
      </mesh>
      <mesh material={M.blue} position={[0, height / 2, -0.385]}>
        <boxGeometry args={[0.12, height * 0.66, 0.02]} />
      </mesh>
    </group>
  )
}

function Wall({ position, rotation, width = 6.2, height = 9 }: { position: V3; rotation: V3; width?: number; height?: number }) {
  const seams = [-height / 2 + 2.5, 0.4, height / 2 - 2]
  return (
    <group position={position} rotation={rotation}>
      <mesh material={M.panel} receiveShadow>
        <boxGeometry args={[width, height, 0.3]} />
      </mesh>
      {/* recessed sub-panels */}
      <mesh material={M.hull} position={[0, 0, 0.16]}>
        <boxGeometry args={[width - 0.6, height - 0.6, 0.06]} />
      </mesh>
      {/* horizontal data strip */}
      <mesh material={M.blue} position={[0, 1.4, 0.2]}>
        <boxGeometry args={[width * 0.78, 0.05, 0.02]} />
      </mesh>
      {/* seam lines */}
      {seams.map((y, i) => (
        <mesh key={i} material={M.dark} position={[0, y, 0.18]}>
          <boxGeometry args={[width - 0.4, 0.05, 0.02]} />
        </mesh>
      ))}
      {/* vents */}
      {[-width / 3, width / 3].map((x, i) => (
        <group key={i} position={[x, -height / 2 + 1.6, 0.18]}>
          {[-0.4, -0.2, 0, 0.2, 0.4].map((vy, k) => (
            <mesh key={k} material={M.dark} position={[0, vy, 0]}>
              <boxGeometry args={[1.1, 0.07, 0.04]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

function Truss({ position, rotation = [0, 0, 0], length = 12 }: { position: V3; rotation?: V3; length?: number }) {
  const struts = Math.floor(length / 1.2)
  return (
    <group position={position} rotation={rotation}>
      <mesh material={M.hull} position={[0, 0.2, 0]}>
        <boxGeometry args={[length, 0.16, 0.16]} />
      </mesh>
      <mesh material={M.hull} position={[0, -0.2, 0]}>
        <boxGeometry args={[length, 0.16, 0.16]} />
      </mesh>
      {Array.from({ length: struts }).map((_, i) => (
        <mesh key={i} material={M.hullLight} position={[-length / 2 + i * 1.2 + 0.6, 0, 0]} rotation={[0, 0, i % 2 ? 0.5 : -0.5]}>
          <boxGeometry args={[0.06, 0.55, 0.06]} />
        </mesh>
      ))}
    </group>
  )
}

function HangLight({ position, color = '#cfe0ff' }: { position: V3; color?: string }) {
  return (
    <group position={position}>
      <mesh material={M.dark} position={[0, 0.4, 0]}>
        <boxGeometry args={[0.06, 0.8, 0.06]} />
      </mesh>
      <mesh material={M.dark}>
        <boxGeometry args={[1.8, 0.2, 0.55]} />
      </mesh>
      <mesh material={M.softlight} position={[0, -0.11, 0]}>
        <boxGeometry args={[1.6, 0.04, 0.45]} />
      </mesh>
      <pointLight position={[0, -0.5, 0]} intensity={5} distance={9} color={color} />
    </group>
  )
}

function Rack({ position, rotation = [0, 0, 0] }: { position: V3; rotation?: V3 }) {
  const lights = [M.blue, M.green, M.cyan, M.warm, M.green, M.blue]
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[1.5, 3.4, 1.05]} radius={0.04} smoothness={2} material={M.hullLight} castShadow position={[0, 1.7, 0]} />
      <mesh material={M.dark} position={[0, 0.12, 0]}>
        <boxGeometry args={[1.65, 0.24, 1.2]} />
      </mesh>
      {/* face screen */}
      <mesh material={M.screen} position={[0, 2.5, 0.54]}>
        <planeGeometry args={[1.1, 0.7]} />
      </mesh>
      {/* status light rows */}
      {Array.from({ length: 6 }).map((_, r) =>
        Array.from({ length: 4 }).map((_, c) => (
          <mesh key={`${r}-${c}`} material={lights[(r + c) % lights.length]} position={[-0.45 + c * 0.3, 1.6 - r * 0.18, 0.54]}>
            <boxGeometry args={[0.12, 0.06, 0.02]} />
          </mesh>
        )),
      )}
    </group>
  )
}

function Crate({ position, rotation = [0, 0, 0], s = 1, accent = M.warm }: { position: V3; rotation?: V3; s?: number; accent?: THREE.Material }) {
  return (
    <group position={position} rotation={rotation} scale={s}>
      <RoundedBox args={[1.1, 1.0, 1.1]} radius={0.05} smoothness={2} material={M.hullLight} castShadow />
      {/* corner braces */}
      {[[-0.5, 0, 0.5], [0.5, 0, 0.5], [-0.5, 0, -0.5], [0.5, 0, -0.5]].map((p, i) => (
        <mesh key={i} material={M.dark} position={p as V3}>
          <boxGeometry args={[0.1, 1.02, 0.1]} />
        </mesh>
      ))}
      <mesh material={accent} position={[0, 0.1, 0.56]}>
        <boxGeometry args={[0.55, 0.1, 0.02]} />
      </mesh>
    </group>
  )
}

function Barrel({ position }: { position: V3 }) {
  return (
    <group position={position}>
      <mesh material={M.steel} castShadow position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 1.3, 20]} />
      </mesh>
      {[0.25, 1.05].map((y, i) => (
        <mesh key={i} material={M.dark} position={[0, y, 0]}>
          <cylinderGeometry args={[0.45, 0.45, 0.1, 20]} />
        </mesh>
      ))}
      <mesh material={M.cyan} position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.43, 0.43, 0.05, 20]} />
      </mesh>
    </group>
  )
}

function Conduit({ position, rotation = [0, 0, 0], length = 14 }: { position: V3; rotation?: V3; length?: number }) {
  const brackets = Math.floor(length / 3)
  return (
    <group position={position} rotation={rotation}>
      <mesh material={M.hull} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.16, 0.16, length, 12]} />
      </mesh>
      <mesh material={M.hullLight} rotation={[0, 0, Math.PI / 2]} position={[0, -0.32, 0]}>
        <cylinderGeometry args={[0.1, 0.1, length, 12]} />
      </mesh>
      {Array.from({ length: brackets }).map((_, i) => (
        <mesh key={i} material={M.dark} position={[-length / 2 + i * 3 + 1.5, -0.16, 0]}>
          <boxGeometry args={[0.1, 0.5, 0.42]} />
        </mesh>
      ))}
    </group>
  )
}

function Holo({ position, rotation = [0, 0, 0], w = 2.2, h = 1.4 }: { position: V3; rotation?: V3; w?: number; h?: number }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh material={M.screen}>
        <planeGeometry args={[w, h]} />
      </mesh>
      {/* frame */}
      <mesh material={M.cyan} position={[0, h / 2, 0.01]}>
        <boxGeometry args={[w, 0.03, 0.01]} />
      </mesh>
      <mesh material={M.cyan} position={[0, -h / 2, 0.01]}>
        <boxGeometry args={[w, 0.03, 0.01]} />
      </mesh>
      {/* fake UI bars */}
      {[0.3, 0.05, -0.2, -0.4].map((y, i) => (
        <mesh key={i} material={M.cyan} position={[-w / 2 + 0.35 + (i % 2) * 0.3, y, 0.01]}>
          <planeGeometry args={[0.6 + (i % 3) * 0.4, 0.05]} />
        </mesh>
      ))}
    </group>
  )
}

/** A large dormant gantry machine for a hero background silhouette. */
function Gantry({ position, rotation = [0, 0, 0] }: { position: V3; rotation?: V3 }) {
  return (
    <group position={position} rotation={rotation}>
      {[-2.4, 2.4].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh material={M.hull} position={[0, 3, 0]}>
            <boxGeometry args={[0.8, 6, 0.8]} />
          </mesh>
          <mesh material={M.hullLight} position={[0, 0.3, 0]}>
            <boxGeometry args={[1.4, 0.6, 1.4]} />
          </mesh>
          <mesh material={M.blue} position={[0, 3, 0.42]}>
            <boxGeometry args={[0.1, 4, 0.02]} />
          </mesh>
        </group>
      ))}
      {/* cross beam */}
      <mesh material={M.hullLight} position={[0, 5.7, 0]}>
        <boxGeometry args={[5.6, 0.7, 0.9]} />
      </mesh>
      {/* hanging head */}
      <group position={[1.1, 4.8, 0]}>
        <mesh material={M.dark} position={[0, 0.4, 0]}>
          <boxGeometry args={[0.5, 1.0, 0.5]} />
        </mesh>
        <mesh material={M.steel} position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.18, 0.28, 0.7, 16]} />
        </mesh>
        <mesh material={M.cyan} position={[0, -0.7, 0]}>
          <sphereGeometry args={[0.1, 12, 12]} />
        </mesh>
      </group>
    </group>
  )
}

/* ------------------------------ the lab ------------------------------ */

const R = 16 // enclosure radius
const wallTransforms: { position: V3; rotation: V3 }[] = Array.from({ length: 10 }).map((_, i) => {
  const a = (i / 10) * Math.PI * 2
  return { position: [Math.sin(a) * R, 4.5, Math.cos(a) * R], rotation: [0, a, 0] }
})
const pillarTransforms: V3[] = Array.from({ length: 8 }).map((_, i) => {
  const a = (i / 8) * Math.PI * 2 + Math.PI / 8
  return [Math.sin(a) * (R - 1.5), 0, Math.cos(a) * (R - 1.5)]
})

export default function Lab() {
  return (
    <group>
      {/* enclosure */}
      {wallTransforms.map((w, i) => (
        <Wall key={i} position={w.position} rotation={w.rotation} />
      ))}
      {pillarTransforms.map((p, i) => (
        <Pillar key={i} position={p} />
      ))}

      {/* overhead trusses + hanging lights */}
      {[-6, 0, 6].map((z, i) => (
        <Truss key={i} position={[0, 9, z]} length={26} />
      ))}
      {[-4, 4].map((x, i) => (
        <Truss key={`b${i}`} position={[x, 9.1, 0]} rotation={[0, Math.PI / 2, 0]} length={26} />
      ))}
      <HangLight position={[-3.5, 8.4, 3]} />
      <HangLight position={[3.5, 8.4, -3]} color="#bcd0ff" />
      <HangLight position={[0, 8.4, -5]} color="#ffd0a8" />

      {/* equipment along the back/sides */}
      <Rack position={[-7, 0, -9]} rotation={[0, 0.5, 0]} />
      <Rack position={[-9, 0, -6]} rotation={[0, 0.8, 0]} />
      <Rack position={[7.5, 0, -8.5]} rotation={[0, -0.6, 0]} />
      <Rack position={[10, 0, -3]} rotation={[0, -1.0, 0]} />
      <Rack position={[-10.5, 0, 2]} rotation={[0, 1.2, 0]} />

      {/* the dormant gantry — a big background landmark */}
      <Gantry position={[10.5, 0, 6]} rotation={[0, -2.2, 0]} />

      {/* crates + barrels grouped for midground depth */}
      <Crate position={[-6.5, 0.5, 5]} rotation={[0, 0.3, 0]} />
      <Crate position={[-7.4, 0.5, 6]} rotation={[0, -0.2, 0]} s={1.2} accent={M.cyan} />
      <Crate position={[-6.7, 1.45, 5.3]} rotation={[0, 0.6, 0]} s={0.8} accent={M.green} />
      <Crate position={[6.5, 0.5, 7]} rotation={[0, -0.4, 0]} s={1.1} />
      <Crate position={[7.6, 0.5, 6.2]} rotation={[0, 0.2, 0]} accent={M.cyan} />
      <Barrel position={[-5.2, 0, 6.8]} />
      <Barrel position={[-4.4, 0, 7.4]} />
      <Barrel position={[5.4, 0, 8]} />

      {/* conduits running along the upper walls */}
      <Conduit position={[0, 7.6, -13.5]} length={20} />
      <Conduit position={[-13.5, 6.8, 0]} rotation={[0, Math.PI / 2, 0]} length={20} />
      <Conduit position={[13.5, 7.2, 0]} rotation={[0, Math.PI / 2, 0]} length={18} />

      {/* floating holo displays */}
      <Holo position={[-5.5, 4, -7]} rotation={[0, 0.6, 0]} />
      <Holo position={[6, 4.5, -6]} rotation={[0, -0.7, 0]} w={2.6} h={1.6} />
      <Holo position={[-8.5, 3.4, 3]} rotation={[0, 1.1, 0]} w={1.8} h={1.2} />
    </group>
  )
}
