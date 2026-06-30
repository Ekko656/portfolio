import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const COUNT = 8500

// Ashima simplex noise (snoise) — compact, well-known, GPU-friendly.
const SNOISE = /* glsl */ `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`

const vertex = /* glsl */ `
uniform float uTime;
uniform vec3 uMouse;
uniform float uMouseStrength;
uniform float uSize;
attribute float aScale;
attribute vec3 aSeed;
varying float vAlpha;
${SNOISE}
void main(){
  vec3 p = position;
  float t = uTime * 0.06;
  vec3 np = p * 0.16 + aSeed;
  // curl-ish flow field from three offset noise samples
  vec3 flow = vec3(
    snoise(np + vec3(t, 1.7, 0.0)),
    snoise(np + vec3(0.0, t, 4.3)),
    snoise(np + vec3(5.1, 0.0, t))
  );
  p += flow * 0.9;
  p.y += sin(uTime * 0.25 + aScale * 6.28) * 0.12;

  // cursor repulsion — particles part around the pointer
  vec3 d = p - uMouse;
  float dist = length(d);
  float infl = smoothstep(3.0, 0.0, dist) * uMouseStrength;
  p += normalize(d + 1e-4) * infl * 1.4;

  vAlpha = 0.25 + 0.75 * aScale;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = uSize * aScale * (1.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}
`

const fragment = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
varying float vAlpha;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.0, d) * vAlpha;
  vec3 col = mix(uColorA, uColorB, vAlpha);
  gl_FragColor = vec4(col, a);
}
`

/**
 * The signature art element: a volume of particles drifting through a simplex
 * flow field that parts around the cursor. Additive + bloom give it the
 * glowing "diffuser" look. The camera flies through it on scroll.
 */
export default function ParticleDiffuser() {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const { camera } = useThree()
  const mouseWorld = useRef(new THREE.Vector3(0, 3, 0))
  const ndc = useRef(new THREE.Vector3())

  const { positions, scales, seeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const scales = new Float32Array(COUNT)
    const seeds = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      // soft, flattened sphere of points centred above the plinth
      const r = Math.cbrt(Math.random()) * 8
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = 2.8 + r * Math.cos(phi) * 0.5
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
      scales[i] = 0.3 + Math.random() * 0.7
      seeds[i * 3] = Math.random() * 10
      seeds[i * 3 + 1] = Math.random() * 10
      seeds[i * 3 + 2] = Math.random() * 10
    }
    return { positions, scales, seeds }
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector3(0, 3, 0) },
      uMouseStrength: { value: 0 },
      uSize: { value: 26 },
      uColorA: { value: new THREE.Color('#5573b8') },
      uColorB: { value: new THREE.Color('#dfe7fb') },
    }),
    [],
  )

  useFrame((state, delta) => {
    if (!matRef.current) return
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime

    // project the cursor to a point at mid-depth and ease the attractor there
    ndc.current.set(state.pointer.x, state.pointer.y, 0.4).unproject(camera)
    mouseWorld.current.lerp(ndc.current, 1 - Math.exp(-6 * delta))
    matRef.current.uniforms.uMouse.value.copy(mouseWorld.current)

    const moving = state.pointer.x !== 0 || state.pointer.y !== 0
    const tgt = moving ? 1 : 0
    const u = matRef.current.uniforms.uMouseStrength
    u.value += (tgt - u.value) * (1 - Math.exp(-3 * delta))
  })

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
