/**
 * Asset loaders for the TextDissolve experience
 */

import * as THREE from 'three/webgpu'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

interface FontData {
  common: {
    lineHeight: number
  }
  // Add other font data properties as needed
}

interface LoadedTextures {
  perlinTexture: THREE.Texture
  dustParticleTexture: THREE.Texture
  fontAtlasTexture: THREE.Texture
  fontData: FontData
}

export async function loadTextures(basePath: string): Promise<LoadedTextures> {
  const textureLoader = new THREE.TextureLoader()
  
  // Load dust particle texture
  const dustParticleTexture = await textureLoader.loadAsync(`${basePath}/textures/dustParticle.png`)
  dustParticleTexture.colorSpace = THREE.NoColorSpace
  dustParticleTexture.minFilter = THREE.LinearFilter
  dustParticleTexture.magFilter = THREE.LinearFilter
  dustParticleTexture.generateMipmaps = false
  
  // Load perlin noise texture
  const perlinTexture = await textureLoader.loadAsync(`${basePath}/textures/perlin.webp`)
  perlinTexture.colorSpace = THREE.NoColorSpace
  perlinTexture.minFilter = THREE.LinearFilter
  perlinTexture.magFilter = THREE.LinearFilter
  perlinTexture.wrapS = THREE.RepeatWrapping
  perlinTexture.wrapT = THREE.RepeatWrapping
  perlinTexture.generateMipmaps = false
  
  // Load font atlas texture
  const fontAtlasTexture = await textureLoader.loadAsync(`${basePath}/fonts/Cinzel/Cinzel.png`)
  fontAtlasTexture.colorSpace = THREE.NoColorSpace
  fontAtlasTexture.minFilter = THREE.LinearFilter
  fontAtlasTexture.magFilter = THREE.LinearFilter
  fontAtlasTexture.wrapS = THREE.ClampToEdgeWrapping
  fontAtlasTexture.wrapT = THREE.ClampToEdgeWrapping
  fontAtlasTexture.generateMipmaps = false
  
  // Load font JSON data
  const fontResponse = await fetch(`${basePath}/fonts/Cinzel/Cinzel.json`)
  const fontData = await fontResponse.json() as FontData
  
  return { perlinTexture, dustParticleTexture, fontAtlasTexture, fontData }
}

export async function loadPetalGeometry(basePath: string): Promise<THREE.BufferGeometry> {
  const loader = new GLTFLoader()
  const gltf = await loader.loadAsync(`${basePath}/models/petal.glb`)
  const petalMesh = gltf.scene.getObjectByName('PetalV2') as THREE.Mesh
  
  if (!petalMesh || !petalMesh.geometry) {
    throw new Error('Petal mesh not found in GLTF')
  }
  
  return petalMesh.geometry
}
