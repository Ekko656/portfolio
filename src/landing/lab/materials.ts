import * as THREE from 'three'

/** Shared materials for the lab kit — created once, reused across all instances. */
export const M = {
  // structural metals
  hull: new THREE.MeshStandardMaterial({ color: '#1b212c', metalness: 0.9, roughness: 0.5, envMapIntensity: 0.9 }),
  hullLight: new THREE.MeshStandardMaterial({ color: '#2b333f', metalness: 0.85, roughness: 0.45, envMapIntensity: 1 }),
  panel: new THREE.MeshStandardMaterial({ color: '#222a36', metalness: 0.8, roughness: 0.5 }),
  dark: new THREE.MeshStandardMaterial({ color: '#10141c', metalness: 0.7, roughness: 0.6 }),
  rubber: new THREE.MeshStandardMaterial({ color: '#0c0f15', metalness: 0.2, roughness: 0.9 }),
  steel: new THREE.MeshStandardMaterial({ color: '#aab4c6', metalness: 0.95, roughness: 0.35, envMapIntensity: 1.2 }),
  // emissives
  blue: new THREE.MeshStandardMaterial({ color: '#0c1424', emissive: '#4f8bff', emissiveIntensity: 2.4, toneMapped: false }),
  cyan: new THREE.MeshStandardMaterial({ color: '#04141c', emissive: '#39c6ff', emissiveIntensity: 2.6, toneMapped: false }),
  warm: new THREE.MeshStandardMaterial({ color: '#1a1208', emissive: '#ffae5c', emissiveIntensity: 2.2, toneMapped: false }),
  green: new THREE.MeshStandardMaterial({ color: '#05140c', emissive: '#48e58b', emissiveIntensity: 2.2, toneMapped: false }),
  screen: new THREE.MeshStandardMaterial({ color: '#0a1422', emissive: '#2b5fb0', emissiveIntensity: 1.3, toneMapped: false }),
  softlight: new THREE.MeshStandardMaterial({ color: '#0c1424', emissive: '#bcd0ff', emissiveIntensity: 1.0, toneMapped: false }),
}
