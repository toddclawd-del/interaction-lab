/**
 * Dust Particles Module
 * 
 * Instanced dust particles with wind, turbulence, and fade effects using TSL shaders.
 */

import * as THREE from 'three/webgpu'
import {
  attribute,
  uniform,
  positionLocal,
  texture,
  vec4,
  uv,
  mrt,
  time,
  vec2,
  vec3,
  clamp,
  smoothstep,
  float
} from 'three/tsl'

const MAX_DUST = 100

export class DustParticles {
  private spawnPos: Float32Array
  private birthLifeSeedScale: Float32Array
  private currentIndex = 0
  private mesh: THREE.InstancedMesh | null = null
  
  constructor() {
    this.spawnPos = new Float32Array(MAX_DUST * 3)
    this.birthLifeSeedScale = new Float32Array(MAX_DUST * 4)
  }
  
  create(
    perlinTexture: THREE.Texture,
    dustParticleTexture: THREE.Texture
  ): THREE.InstancedMesh {
    // Small plane geometry for each dust particle
    const geometry = new THREE.PlaneGeometry(0.02, 0.02)
    
    // Add instanced attributes
    geometry.setAttribute(
      'aSpawnPos',
      new THREE.InstancedBufferAttribute(this.spawnPos, 3)
    )
    geometry.setAttribute(
      'aBirthLifeSeedScale',
      new THREE.InstancedBufferAttribute(this.birthLifeSeedScale, 4)
    )
    
    const material = this.createMaterial(perlinTexture, dustParticleTexture)
    this.mesh = new THREE.InstancedMesh(geometry, material, MAX_DUST)
    
    return this.mesh
  }
  
  private createMaterial(
    perlinTexture: THREE.Texture,
    dustTexture: THREE.Texture
  ) {
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      depthWrite: false,
      depthTest: false
    })
    
    // Get instance attributes
    const aSpawnPos = attribute('aSpawnPos', 'vec3')
    const aBirthLifeSeedScale = attribute('aBirthLifeSeedScale', 'vec4')
    const aBirth = aBirthLifeSeedScale.x
    const aLife = aBirthLifeSeedScale.y
    const aSeed = aBirthLifeSeedScale.z
    const aScale = aBirthLifeSeedScale.w
    
    // Animation parameters
    const uDustColor = uniform(new THREE.Color('#8A8A8A'))
    const uWindDirection = uniform(new THREE.Vector3(-1, 0, 0).normalize())
    const uWindStrength = uniform(0.3)
    const uRiseSpeed = uniform(0.1)
    const uNoiseScale = uniform(30.0)
    const uNoiseSpeed = uniform(0.015)
    const uWobbleAmp = uniform(0.6)
    
    // Calculate particle age and life interpolation
    const dustAge = time.sub(aBirth)
    const lifeInterpolation = clamp(dustAge.div(aLife), 0, 1)
    
    // Use noise for organic movement variation
    const randomSeed = vec2(aSeed.mul(123.4), aSeed.mul(567.8))
    const noiseUv = aSpawnPos.xz
      .mul(uNoiseScale)
      .add(randomSeed)
      .add(uWindDirection.xz.mul(dustAge.mul(uNoiseSpeed)))
    
    // Sample noise for turbulence
    const noiseSample = texture(perlinTexture, noiseUv).x
    const noiseSampleBis = texture(perlinTexture, noiseUv.add(vec2(13.37, 7.77))).x
    
    // Convert to turbulence values (-1 to 1)
    const turbulenceX = noiseSample.sub(0.5).mul(2)
    const turbulenceY = noiseSampleBis.sub(0.5).mul(2)
    
    // Swirl effect that increases over lifetime
    const swirl = vec3(
      clamp(turbulenceX.mul(lifeInterpolation), 0, 1.0),
      turbulenceY.mul(lifeInterpolation),
      0.0
    ).mul(uWobbleAmp)
    
    // Wind movement
    const windImpulse = uWindDirection.mul(uWindStrength).mul(dustAge)
    
    // Rising movement with noise variation
    const riseFactor = clamp(noiseSample, 0.3, 1.0)
    const rise = vec3(0.0, dustAge.mul(uRiseSpeed).mul(riseFactor), 0.0)
    
    // Combined drift
    const driftMovement = windImpulse.add(rise).add(swirl)
    
    // Scale up quickly at birth
    const scaleFactor = smoothstep(float(0), float(0.05), lifeInterpolation)
    
    // Fade out near end of life
    const fadingOut = float(1.0).sub(smoothstep(float(0.8), float(1.0), lifeInterpolation))
    
    // Apply dust texture
    const dustSample = texture(dustTexture, uv())
    material.colorNode = vec4(uDustColor, dustSample.a)
    
    // Final position: spawn + drift + local (scaled)
    material.positionNode = aSpawnPos
      .add(driftMovement)
      .add(positionLocal.mul(aScale.mul(scaleFactor)))
    
    material.opacityNode = fadingOut
    
    // MRT for selective bloom
    material.mrtNode = mrt({
      bloomIntensity: float(0.5).mul(fadingOut)
    })
    
    return material
  }
  
  spawn(position: THREE.Vector3) {
    if (this.currentIndex >= MAX_DUST) {
      this.currentIndex = 0
    }
    
    const id = this.currentIndex
    this.currentIndex++
    
    // Set spawn position
    this.spawnPos[id * 3 + 0] = position.x
    this.spawnPos[id * 3 + 1] = position.y
    this.spawnPos[id * 3 + 2] = position.z
    
    // Set birth time, life duration, random seed, and scale
    this.birthLifeSeedScale[id * 4 + 0] = performance.now() * 0.001 // Birth time (seconds)
    this.birthLifeSeedScale[id * 4 + 1] = 4 // Life duration
    this.birthLifeSeedScale[id * 4 + 2] = Math.random() // Random seed
    this.birthLifeSeedScale[id * 4 + 3] = Math.random() * 0.5 + 0.5 // Scale (0.5-1.0)
    
    // Mark attributes for update
    if (this.mesh) {
      this.mesh.geometry.attributes.aSpawnPos.needsUpdate = true
      this.mesh.geometry.attributes.aBirthLifeSeedScale.needsUpdate = true
    }
  }
}
