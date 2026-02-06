// Compatibility shim for three.js
// Adds deprecated exports that some packages still use

import * as THREE from 'three'

// Re-export everything from three
export * from 'three'

// Add deprecated sRGBEncoding (removed in three.js 0.153+)
// @ts-ignore
export const sRGBEncoding = THREE.SRGBColorSpace
