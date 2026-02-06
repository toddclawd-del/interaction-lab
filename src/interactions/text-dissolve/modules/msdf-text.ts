/**
 * MSDF Text Module with Dissolve Shader
 * 
 * Creates MSDF text with noise-driven dissolve effect using TSL shaders.
 */

import * as THREE from 'three/webgpu'
// @ts-ignore - three-msdf-text-utils types
import { MSDFTextGeometry, MSDFTextNodeMaterial } from 'three-msdf-text-utils'
import { 
  texture, 
  mix, 
  uniform, 
  clamp, 
  attribute, 
  step, 
  float, 
  smoothstep, 
  mrt
} from 'three/tsl'

// TSL types are not fully exported, use any for uniform nodes
type UniformNode<T> = ReturnType<typeof uniform> & { value: T }

interface FontData {
  common: {
    lineHeight: number
  }
}

export class MSDFTextModule {
  private worldPositionBounds: THREE.Box3 | null = null
  
  create(
    text: string,
    position: THREE.Vector3,
    uProgress: UniformNode<number>,
    perlinTexture: THREE.Texture,
    fontAtlasTexture: THREE.Texture,
    fontData: FontData
  ): THREE.Mesh {
    // Create text geometry
    const textGeometry = new MSDFTextGeometry({
      text,
      font: fontData,
      width: 1000,
      align: 'center'
    })
    
    // Create material with dissolve effect
    const textMaterial = this.createMaterial(fontAtlasTexture, perlinTexture, uProgress)
    textMaterial.alphaTest = 0.1
    
    const mesh = new THREE.Mesh(textGeometry, textMaterial)
    
    // Scale text to desired world size (0.5 world units line height)
    const targetLineHeight = 0.5
    const lineHeightPx = fontData.common.lineHeight
    const textScale = targetLineHeight / lineHeightPx
    
    mesh.scale.set(textScale, textScale, textScale)
    
    // Center the text
    const meshOffset = -(textGeometry.layout.width / 2) * textScale
    mesh.position.set(position.x + meshOffset, position.y, position.z)
    mesh.rotation.x = Math.PI
    
    // Compute world bounds for particle spawning
    textGeometry.computeBoundingBox()
    mesh.updateWorldMatrix(true, false)
    this.worldPositionBounds = new THREE.Box3().setFromObject(mesh)
    
    return mesh
  }
  
  private createMaterial(
    fontAtlasTexture: THREE.Texture,
    perlinTexture: THREE.Texture,
    uProgress: UniformNode<number>
  ) {
    const textMaterial = new MSDFTextNodeMaterial({
      map: fontAtlasTexture,
      transparent: true
    })
    
    // Get per-glyph UV attributes from MSDF geometry
    const glyphUv = attribute('glyphUv', 'vec2')
    const center = attribute('center', 'vec2')
    
    // Dissolve parameters
    const uNoiseRemapMin = uniform(0.48)
    const uNoiseRemapMax = uniform(0.9)
    const uCenterScale = uniform(0.05)
    const uGlyphScale = uniform(0.75)
    
    // Color parameters
    const uDissolvedColor = uniform(new THREE.Color('#5E5E5E'))
    const uDesatComplete = uniform(0.45)
    const uBaseColor = uniform(new THREE.Color('#ECCFA3'))
    
    // Custom UV that combines glyph position with noise sampling
    // This creates organic per-letter variation in the dissolve
    const customUv = center.mul(uCenterScale).add(glyphUv.mul(uGlyphScale))
    
    // Sample perlin noise and remap to full 0-1 range
    const perlinTextureNode = texture(perlinTexture, customUv).x
    const perlinRemap = clamp(
      perlinTextureNode.sub(uNoiseRemapMin).div(uNoiseRemapMax.sub(uNoiseRemapMin)),
      0,
      1
    )
    
    // Dissolve mask: pixels disappear when progress exceeds their noise value
    const dissolve = step(uProgress, perlinRemap)
    
    // Color desaturation as effect progresses
    const desaturationProgress = smoothstep(float(0.0), uDesatComplete, uProgress)
    const colorMix = mix(uBaseColor, uDissolvedColor, desaturationProgress)
    
    textMaterial.colorNode = colorMix
    
    // Combine MSDF opacity with dissolve mask
    const msdfOpacity = textMaterial.opacityNode
    textMaterial.opacityNode = msdfOpacity.mul(dissolve)
    
    // MRT output for selective bloom
    textMaterial.mrtNode = mrt({
      bloomIntensity: float(0.4).mul(dissolve)
    })
    
    return textMaterial
  }
  
  getRandomPositionInBounds(): THREE.Vector3 {
    if (!this.worldPositionBounds) {
      return new THREE.Vector3()
    }
    
    const min = this.worldPositionBounds.min
    const max = this.worldPositionBounds.max
    
    return new THREE.Vector3(
      Math.random() * (max.x - min.x) + min.x,
      Math.random() * (max.y - min.y) + min.y,
      Math.random() * 0.5 // Slight Z offset for depth
    )
  }
}
