import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Model, { preloadKit } from './Model'
import HoloTelemetry from './HoloTelemetry'
import Drone from './Drone'
import Scanner from './Scanner'

const TILE = 4
const EDGE = 12 // room half-size; walls sit on the outermost floor tiles

const USED = [
  'Platform_DarkPlates',
  'WallAstra_Straight',
  'Column_Large_Straight',
  'Prop_Computer',
  'Prop_Crate3',
  'Prop_Crate4',
  'Prop_Barrel_Large',
  'Prop_Light_Wide',
  'Prop_Cable_1',
  'Prop_Cable_3',
  'Prop_Vent_Wide',
  'Decal_Line_90_Round_Large',
  'Decal_Dashes',
  'Decal_Line_Straight',
  'Decal_Logo',
  'Decal_Sign',
]
preloadKit(USED)

const DECAL_Y = 0.015 // just above the floor plates

const cells = [-3, -2, -1, 0, 1, 2, 3] // 7×7 floor, edges at ±14
const wallCells = [-2, -1, 0, 1, 2] // wall segments across ±10, corners left to columns

/** Flickering status pips above a console — tiny life on every screen. */
function BlinkPips({ position }: { position: [number, number, number] }) {
  const mats = useRef<(THREE.MeshStandardMaterial | null)[]>([])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    mats.current.forEach((m, i) => {
      if (m) m.emissiveIntensity = Math.sin(t * (2 + i * 0.7) + i * 2.1) > 0.2 ? 2.6 : 0.2
    })
  })
  const colors = ['#48e58b', '#39c6ff', '#ffae5c']
  return (
    <group position={position}>
      {colors.map((c, i) => (
        <mesh key={i} position={[(i - 1) * 0.14, 0, 0]}>
          <boxGeometry args={[0.07, 0.04, 0.02]} />
          <meshStandardMaterial
            ref={(m) => (mats.current[i] = m)}
            color="#04141c"
            emissive={c}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}

/** Hanging light fixture with a real pool of light below it. */
function HangLight({ position, color = '#cfe0ff' }: { position: [number, number, number]; color?: string }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.02, 0.02, 1.6, 6]} />
        <meshStandardMaterial color="#10141c" metalness={0.6} roughness={0.6} />
      </mesh>
      <group position={[0, -0.85, 0]}>
        <Model name="Prop_Light_Wide" position={[0, 0, 0]} />
        <pointLight position={[0, -0.35, 0]} intensity={7} distance={11} color={color} />
      </group>
    </group>
  )
}

/**
 * The robotics bay: uniform dark-plate floor, one consistent wall family
 * (back + both sides; front open to the camera), structural corner columns,
 * live telemetry holograms, consoles, a patrol drone, and pooled hanging light.
 */
export default function MegaLab() {
  return (
    <group>
      {/* floor — uniform */}
      {cells.map((gx) =>
        cells.map((gz) => (
          <Model key={`f${gx}${gz}`} name="Platform_DarkPlates" position={[gx * TILE, 0, gz * TILE]} />
        )),
      )}

      {/* ceiling plane for enclosure */}
      <mesh position={[0, 9.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[34, 34]} />
        <meshStandardMaterial color="#0a0d13" metalness={0.4} roughness={0.95} side={THREE.DoubleSide} />
      </mesh>

      {/* walls — WallAstra_Straight runs 4 units along its local Z.
          back row faces +Z (toward camera), side rows face inward,
          front row closes the room behind the camera. */}
      {wallCells.map((g) => (
        <Model key={`wb${g}`} name="WallAstra_Straight" position={[g * TILE, 0, -EDGE]} rotation={[0, Math.PI / 2, 0]} />
      ))}
      {wallCells.map((g) => (
        <Model key={`wl${g}`} name="WallAstra_Straight" position={[-EDGE, 0, g * TILE]} rotation={[0, 0, 0]} />
      ))}
      {wallCells.map((g) => (
        <Model key={`wr${g}`} name="WallAstra_Straight" position={[EDGE, 0, g * TILE]} rotation={[0, Math.PI, 0]} />
      ))}
      {/* front closure — a full-height dark panel well beyond the camera's
          max orbit distance, so swinging the view never shows void */}
      <mesh position={[0, 4.6, 14.2]}>
        <boxGeometry args={[30, 9.4, 0.4]} />
        <meshStandardMaterial color="#141a24" metalness={0.6} roughness={0.65} />
      </mesh>

      {/* upper wall bands — close the gap from the 3m kit walls to the
          ceiling so there is no visible "outside" */}
      {(
        [
          [0, -EDGE - 0.1, 0, 0.19], // back — strip faces +Z (inward)
          [-EDGE - 0.1, 0, Math.PI / 2, 0.19], // left — faces +X
          [EDGE + 0.1, 0, Math.PI / 2, -0.19], // right — faces -X
        ] as [number, number, number, number][]
      ).map(([x, z, ry, off], i) => (
        <group key={`band${i}`} position={[x, 0, z]} rotation={[0, ry, 0]}>
          <mesh position={[0, 6.15, 0]}>
            <boxGeometry args={[25, 6.3, 0.35]} />
            <meshStandardMaterial color="#161c27" metalness={0.6} roughness={0.62} />
          </mesh>
          {/* seam + faint light strip where the band meets the kit wall */}
          <mesh position={[0, 3.12, off]}>
            <boxGeometry args={[24.6, 0.06, 0.02]} />
            <meshStandardMaterial color="#0c1424" emissive="#3f6dbf" emissiveIntensity={1.1} toneMapped={false} />
          </mesh>
          <mesh position={[0, 7.9, off]}>
            <boxGeometry args={[24.6, 0.05, 0.02]} />
            <meshStandardMaterial color="#10151f" metalness={0.5} roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* structural columns at the corners + wall midpoints */}
      {[
        [-EDGE, -EDGE],
        [EDGE, -EDGE],
        [-EDGE, EDGE],
        [EDGE, EDGE],
        [0 - EDGE, 0],
        [EDGE, 0],
      ].map(([x, z], i) => (
        <Model key={`c${i}`} name="Column_Large_Straight" position={[x, 0, z]} />
      ))}

      {/* consoles along the back wall, screens facing the room */}
      {[-6, 0, 6].map((x, i) => (
        <group key={`console${i}`}>
          <Model name="Prop_Computer" position={[x, 0, -EDGE + 0.9]} />
          <BlinkPips position={[x, 1.75, -EDGE + 1.15]} />
        </group>
      ))}

      {/* work clutter — one asymmetric cluster each side, out of the hero's way */}
      <group position={[-8.5, 0, 4]} rotation={[0, 0.4, 0]}>
        <Model name="Prop_Crate3" position={[0, 0, 0]} />
        <Model name="Prop_Crate4" position={[1.3, 0, 0.4]} rotation={[0, -0.5, 0]} />
        <Model name="Prop_Crate3" position={[0.4, 1.0, 0.15]} rotation={[0, 0.9, 0]} scale={0.8} />
        <Model name="Prop_Barrel_Large" position={[-1.2, 0, 0.8]} />
      </group>
      <group position={[8.7, 0, 1.5]} rotation={[0, -0.6, 0]}>
        <Model name="Prop_Barrel_Large" position={[0, 0, 0]} />
        <Model name="Prop_Barrel_Large" position={[0.7, 0, 0.5]} />
        <Model name="Prop_Crate4" position={[-0.4, 0, 1.4]} rotation={[0, 0.3, 0]} />
      </group>

      {/* floor markings — a marked work zone around the dais */}
      {(
        [
          [2.4, 2.4, 0],
          [2.4, -2.4, Math.PI / 2],
          [-2.4, -2.4, Math.PI],
          [-2.4, 2.4, -Math.PI / 2],
        ] as [number, number, number][]
      ).map(([x, z, r], i) => (
        <Model key={`ring${i}`} name="Decal_Line_90_Round_Large" position={[x, DECAL_Y, z]} rotation={[0, r, 0]} />
      ))}
      {[4.4, 5.6, 6.8].map((z, i) => (
        <Model key={`dash${i}`} name="Decal_Dashes" position={[0, DECAL_Y, z]} rotation={[0, Math.PI / 2, 0]} />
      ))}
      {[-6, 6].map((x, i) => (
        <group key={`lane${i}`}>
          <Model name="Decal_Line_Straight" position={[x, DECAL_Y, -4]} />
          <Model name="Decal_Line_Straight" position={[x, DECAL_Y, 0]} />
          <Model name="Decal_Line_Straight" position={[x, DECAL_Y, 4]} />
        </group>
      ))}
      <Model name="Decal_Logo" position={[-7, DECAL_Y, 8.5]} rotation={[0, 0.35, 0]} />
      <Model name="Decal_Sign" position={[3.2, DECAL_Y, 3.4]} rotation={[0, -0.4, 0]} />

      {/* cabling from the consoles toward the dais + along the wall base */}
      <Model name="Prop_Cable_3" position={[0.2, 0.01, -8]} />
      <Model name="Prop_Cable_1" position={[-4.6, 0.01, -9.6]} rotation={[0, 0.7, 0]} />
      <Model name="Prop_Cable_1" position={[5.2, 0.01, -9.2]} rotation={[0, -1.1, 0]} />
      <Model name="Prop_Cable_1" position={[-9.8, 0.01, 0.5]} rotation={[0, 1.5, 0]} />

      {/* floor vents near the side walls */}
      <Model name="Prop_Vent_Wide" position={[-10.6, 0.01, -5]} />
      <Model name="Prop_Vent_Wide" position={[10.6, 0.01, 2]} rotation={[0, Math.PI, 0]} />

      {/* live holographic telemetry flanking the arm */}
      <HoloTelemetry position={[4.4, 2.6, -1.5]} rotation={[0, -0.55, 0]} />
      <HoloTelemetry
        position={[-4.6, 2.9, -2.2]}
        rotation={[0, 0.5, 0]}
        scale={0.85}
        title="BAY-07 · SYSTEMS"
      />

      {/* hanging light pools */}
      <HangLight position={[-5, 9.2, 3]} />
      <HangLight position={[5, 9.2, 3]} />
      <HangLight position={[0, 9.2, -6]} color="#ffd9b8" />

      {/* ambient events */}
      <Drone />
      <Scanner />
    </group>
  )
}
