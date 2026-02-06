/**
 * Petal Particles Module
 * 
 * Instanced 3D petal particles with bend, spin, and lighting effects using TSL shaders.
 */

import * as THREE from 'three/webgpu'
import {
  attribute,
  uniform,
  positionLocal,
  texture,
  mrt,
  mix,
  normalLocal,
  instanceIndex,
  normalize,
  abs,
  dot,
  time,
  vec2,
  vec3,
  clamp,
  smoothstep,
  float,
  pow,
  cos,
  sin,
  mat3,
  TWO_PI
} from 'three/tsl'

const MAX_PETALS = 400

// TSL rotation matrix functions
function rotX(a: ReturnType<typeof float>) {
  const c = cos(a)
  const s = sin(a)
  const ns = s.mul(-1.0)
  return mat3(1.0, 0.0, 0.0, 0.0, c, ns, 0.0, s, c)
}

function rotY(a: ReturnType<typeof float>) {
  const c = cos(a)
  const s = sin(a)
  const ns = s.mul(-1.0)
  return mat3(c, 0.0, s, 0.0, 1.0, 0.0, ns, 0.0, c)
}

function rotZ(a: ReturnType<typeof float>) {
  const c = cos(a)
  const s = sin(a)
  const ns = s.mul(-1.0)
  return mat3(c, ns, 0.0, s, c, 0.0, 0.0, 0.0, 1.0)
}

export class PetalParticles {
  private spawnPos: Float32Array
  private birthLifeSeedScale: Float32Array
  private currentIndex = 0
  private mesh: THREE.InstancedMesh | null = null
  
  constructor() {
    this.spawnPos = new Float32Array(MAX_PETALS * 3)
    this.birthLifeSeedScale = new Float32Array(MAX_PETALS * 4)
  }
  
  create(
    perlinTexture: THREE.Texture,
    petalGeometry: THREE.BufferGeometry
  ): THREE.InstancedMesh {
    // Clone and scale the petal geometry
    const geometry = petalGeometry.clone()
    const scale = 0.1
    geometry.scale(scale, scale, scale)
    
    // Add instanced attributes
    geometry.setAttribute(
      'aSpawnPos',
      new THREE.InstancedBufferAttribute(this.spawnPos, 3)
    )
    geometry.setAttribute(
      'aBirthLifeSeedScale',
      new THREE.InstancedBufferAttribute(this.birthLifeSeedScale, 4)
    )
    
    const material = this.createMaterial(perlinTexture)
    this.mesh = new THREE.InstancedMesh(geometry, material, MAX_PETALS)
    
    return this.mesh
  }
  
  private createMaterial(perlinTexture: THREE.Texture) {
    const material = new THREE.MeshBasicNodeMaterial({
      transparent: true,
      side: THREE.DoubleSide
    })
    
    // Get instance attributes
    const aSpawnPos = attribute('aSpawnPos', 'vec3')
    const aBirthLifeSeedScale = attribute('aBirthLifeSeedScale', 'vec4')
    const aBirth = aBirthLifeSeedScale.x
    const aLife = aBirthLifeSeedScale.y
    const aSeed = aBirthLifeSeedScale.z
    const aScale = aBirthLifeSeedScale.w
    
    // Movement parameters
    const uWindDirection = uniform(new THREE.Vector3(-1, 0, 0).normalize())
    const uWindStrength = uniform(0.3)
    const uRiseSpeed = uniform(0.1)
    const uNoiseScale = uniform(30.0)
    const uNoiseSpeed = uniform(0.015)
    const uWobbleAmp = uniform(0.6)
    
    // Bend and spin parameters
    const uBendAmount = uniform(2.5)
    const uBendSpeed = uniform(1.0)
    const uSpinSpeed = uniform(2.0)
    const uSpinAmp = uniform(0.45)
    
    // Color and lighting
    const uRedColor = uniform(new THREE.Color('#9B0000'))
    const uWhiteColor = uniform(new THREE.Color('#EEEEEE'))
    const uLightPosition = uniform(new THREE.Vector3(0, 0, 5))
    
    // Calculate age and life interpolation
    const petalAge = time.sub(aBirth)
    const lifeInterpolation = clamp(petalAge.div(aLife), 0, 1)
    
    // Noise sampling for organic movement
    const randomSeed = vec2(aSeed.mul(123.4), aSeed.mul(567.8))
    const noiseUv = aSpawnPos.xz
      .mul(uNoiseScale)
      .add(randomSeed)
      .add(uWindDirection.xz.mul(petalAge.mul(uNoiseSpeed)))
    
    const noiseSample = texture(perlinTexture, noiseUv).x
    const noiseSampleBis = texture(perlinTexture, noiseUv.add(vec2(13.37, 7.77))).x
    
    // Turbulence values
    const turbulenceX = noiseSample.sub(0.5).mul(2)
    const turbulenceY = noiseSampleBis.sub(0.5).mul(2)
    const turbulenceZ = noiseSample.sub(0.5).mul(2)
    
    // Swirl movement
    const swirl = vec3(
      clamp(turbulenceX.mul(lifeInterpolation), 0, 1.0),
      turbulenceY.mul(lifeInterpolation),
      0.0
    ).mul(uWobbleAmp)
    
    // Petal bending based on UV.y (tip bends more than base)
    const y = attribute('uv', 'vec2').y
    const bendWeight = pow(y, float(3.0))
    const bend = bendWeight.mul(uBendAmount).mul(sin(petalAge.mul(uBendSpeed.mul(noiseSample))))
    const B = rotX(bend)
    
    // Wind movement
    const windImpulse = uWindDirection.mul(uWindStrength).mul(petalAge)
    
    // Rising movement
    const riseFactor = clamp(noiseSample, 0.3, 1.0)
    const rise = vec3(0.0, petalAge.mul(uRiseSpeed).mul(riseFactor), 0.0)
    const driftMovement = windImpulse.add(rise).add(swirl)
    
    // Spin rotation - each petal gets unique base rotation from seed
    const baseX = aSeed.mul(1.13).mod(1.0).mul(TWO_PI)
    const baseY = aSeed.mul(2.17).mod(1.0).mul(TWO_PI)
    const baseZ = aSeed.mul(3.31).mod(1.0).mul(TWO_PI)
    
    const spin = petalAge.mul(uSpinSpeed).mul(uSpinAmp)
    const rx = baseX.add(spin.mul(0.9).mul(turbulenceX.add(1.5)))
    const ry = baseY.add(spin.mul(1.2).mul(turbulenceY.add(1.5)))
    const rz = baseZ.add(spin.mul(0.7).mul(turbulenceZ.add(1.5)))
    
    // Combined rotation matrix
    const R = rotY(ry).mul(rotX(rx)).mul(rotZ(rz))
    
    // Scale animation
    const scaleFactor = smoothstep(float(0), float(0.05), lifeInterpolation)
    const fadingOut = float(1.0).sub(smoothstep(float(0.8), float(1.0), lifeInterpolation))
    
    // Transform position: apply bend, then rotation
    const positionLocalUpdated = R.mul(B.mul(positionLocal))
    const normalUpdate = normalize(R.mul(B.mul(normalLocal)))
    
    // Final world position
    const worldPosition = aSpawnPos
      .add(driftMovement)
      .add(positionLocalUpdated.mul(aScale.mul(scaleFactor)))
    
    // Color: alternate between red and white based on instance index
    const petalColor = mix(uRedColor, uWhiteColor, instanceIndex.mod(3).equal(0))
    
    // Simple lighting based on normal direction
    const lightDirection = normalize(uLightPosition.sub(worldPosition))
    const facing = clamp(abs(dot(normalUpdate, lightDirection)), 0.4, 1)
    
    material.colorNode = petalColor.mul(facing)
    material.positionNode = worldPosition
    material.opacityNode = fadingOut
    
    // MRT for selective bloom
    material.mrtNode = mrt({
      bloomIntensity: float(0.7).mul(fadingOut)
    })
    
    return material
  }
  
  spawn(position: THREE.Vector3) {
    if (this.currentIndex >= MAX_PETALS) {
      this.currentIndex = 0
    }
    
    const id = this.currentIndex
    this.currentIndex++
    
    // Set spawn position
    this.spawnPos[id * 3 + 0] = position.x
    this.spawnPos[id * 3 + 1] = position.y
    this.spawnPos[id * 3 + 2] = position.z
    
    // Set birth time, life duration, random seed, and scale
    this.birthLifeSeedScale[id * 4 + 0] = performance.now() * 0.001
    this.birthLifeSeedScale[id * 4 + 1] = 6 // Longer life than dust
    this.birthLifeSeedScale[id * 4 + 2] = Math.random()
    this.birthLifeSeedScale[id * 4 + 3] = Math.random() * 0.5 + 0.5
    
    // Mark attributes for update
    if (this.mesh) {
      this.mesh.geometry.attributes.aSpawnPos.needsUpdate = true
      this.mesh.geometry.attributes.aBirthLifeSeedScale.needsUpdate = true
    }
  }
}
