/**
 * TextDissolveExperience - WebGPU Three.js Experience
 * 
 * Handles the full WebGPU scene with MSDF text, particles, and bloom post-processing.
 */

import * as THREE from 'three/webgpu'
import { float, mrt, pass, output, uniform } from 'three/tsl'
// @ts-ignore - bloom import from examples
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode.js'
import gsap from 'gsap'
import { MSDFTextModule } from './modules/msdf-text'
import { DustParticles } from './modules/dust-particles'
import { PetalParticles } from './modules/petal-particles'
import { loadTextures, loadPetalGeometry } from './modules/loaders'

export class TextDissolveExperience {
  private renderer: THREE.WebGPURenderer | null = null
  private scene: THREE.Scene | null = null
  private camera: THREE.PerspectiveCamera | null = null
  private composer: THREE.PostProcessing | null = null
  private animationId: number | null = null
  
  private uProgress = uniform(0.0)
  
  private msdfText: MSDFTextModule | null = null
  private dustParticles: DustParticles | null = null
  private petalParticles: PetalParticles | null = null
  
  private dustInterval = 0.125
  private petalInterval = 0.05
  private gommageTween: gsap.core.Tween | null = null
  private spawnDustTween: gsap.core.Tween | null = null
  private spawnPetalTween: gsap.core.Tween | null = null
  
  private triggerButton: HTMLElement | null = null

  async initialize(container: HTMLElement) {
    // Setup renderer
    this.renderer = new THREE.WebGPURenderer({ antialias: true })
    await this.renderer.init()
    
    this.renderer.shadowMap.enabled = false
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.setClearColor(0x111111, 1)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(this.renderer.domElement)
    
    // Setup camera
    const fov = 45
    const aspect = window.innerWidth / window.innerHeight
    this.camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 25)
    this.camera.position.set(0, 0, 5)
    this.onResize()
    
    // Setup scene
    this.scene = new THREE.Scene()
    
    // Load assets
    const basePath = this.getBasePath()
    const { perlinTexture, dustParticleTexture, fontAtlasTexture, fontData } = await loadTextures(basePath)
    const petalGeometry = await loadPetalGeometry(basePath)
    
    // Create MSDF text
    this.msdfText = new MSDFTextModule()
    const textMesh = this.msdfText.create(
      'DISSOLVE',
      new THREE.Vector3(0, 0, 0),
      this.uProgress,
      perlinTexture,
      fontAtlasTexture,
      fontData
    )
    this.scene.add(textMesh)
    
    // Create dust particles
    this.dustParticles = new DustParticles()
    const dustMesh = this.dustParticles.create(perlinTexture, dustParticleTexture)
    this.scene.add(dustMesh)
    
    // Create petal particles
    this.petalParticles = new PetalParticles()
    const petalMesh = this.petalParticles.create(perlinTexture, petalGeometry)
    this.scene.add(petalMesh)
    
    // Setup post-processing with selective bloom
    await this.setupPostProcessing()
    
    // Event listeners
    window.addEventListener('resize', this.onResize)
    
    // Trigger button
    this.triggerButton = document.getElementById('dissolve-trigger')
    if (this.triggerButton) {
      this.triggerButton.addEventListener('click', this.triggerDissolve)
    }
    
    // Start render loop
    this.animate()
  }
  
  private getBasePath(): string {
    // Assets are in public/text-dissolve, served at base path
    const base = import.meta.env.BASE_URL || '/'
    return `${base}text-dissolve`
  }
  
  private async setupPostProcessing() {
    if (!this.renderer || !this.scene || !this.camera) return
    
    this.composer = new THREE.PostProcessing(this.renderer)
    const scenePass = pass(this.scene, this.camera)
    
    // Setup MRT for selective bloom
    // @ts-ignore - TSL types not fully exported
    scenePass.setMRT(
      mrt({
        output,
        bloomIntensity: float(0)
      })
    )
    
    // @ts-ignore - TSL types experimental
    let outNode: any = scenePass
    
    // @ts-ignore - TSL types experimental
    const outputPass = scenePass.getTextureNode()
    // @ts-ignore - TSL types experimental
    const bloomIntensityPass = scenePass.getTextureNode('bloomIntensity')
    // @ts-ignore - bloom import types
    const bloomPass = bloom(outputPass.mul(bloomIntensityPass), 0.8)
    outNode = outNode.add(bloomPass)
    
    // TSL types are experimental, cast to any
    (this.composer as any).outputNode = outNode.renderOutput();
    (this.composer as any).needsUpdate = true
  }
  
  private onResize = () => {
    if (!this.camera || !this.renderer) return
    
    const HORIZONTAL_FOV_TARGET = THREE.MathUtils.degToRad(45)
    this.camera.aspect = window.innerWidth / window.innerHeight
    const verticalFov = 2 * Math.atan(Math.tan(HORIZONTAL_FOV_TARGET / 2) / this.camera.aspect)
    this.camera.fov = THREE.MathUtils.radToDeg(verticalFov)
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }
  
  private triggerDissolve = () => {
    // Don't start if already running
    if (this.gommageTween || this.spawnDustTween || this.spawnPetalTween) return
    
    this.uProgress.value = 0
    
    // Disable button while effect is running
    if (this.triggerButton) {
      this.triggerButton.setAttribute('disabled', 'true')
    }
    
    // Spawn dust particles
    this.spawnDustTween = gsap.to({}, {
      duration: this.dustInterval,
      repeat: -1,
      onRepeat: () => {
        if (this.msdfText && this.dustParticles) {
          const pos = this.msdfText.getRandomPositionInBounds()
          this.dustParticles.spawn(pos)
        }
      }
    })
    
    // Spawn petal particles
    this.spawnPetalTween = gsap.to({}, {
      duration: this.petalInterval,
      repeat: -1,
      onRepeat: () => {
        if (this.msdfText && this.petalParticles) {
          const pos = this.msdfText.getRandomPositionInBounds()
          this.petalParticles.spawn(pos)
        }
      }
    })
    
    // Animate dissolve progress
    this.gommageTween = gsap.to(this.uProgress, {
      value: 1,
      duration: 6,
      ease: 'linear',
      onComplete: () => {
        this.spawnDustTween?.kill()
        this.spawnPetalTween?.kill()
        this.spawnDustTween = null
        this.spawnPetalTween = null
        this.gommageTween = null
        
        // Re-enable button after a delay
        gsap.delayedCall(2, () => {
          if (this.triggerButton) {
            this.triggerButton.removeAttribute('disabled')
          }
          // Reset for next trigger
          this.uProgress.value = 0
        })
      }
    })
  }
  
  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate)
    
    if (this.composer) {
      this.composer.render()
    }
  }
  
  dispose() {
    // Cancel animation frame
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId)
    }
    
    // Kill GSAP tweens
    this.gommageTween?.kill()
    this.spawnDustTween?.kill()
    this.spawnPetalTween?.kill()
    
    // Remove event listeners
    window.removeEventListener('resize', this.onResize)
    if (this.triggerButton) {
      this.triggerButton.removeEventListener('click', this.triggerDissolve)
    }
    
    // Dispose Three.js resources
    if (this.renderer) {
      this.renderer.dispose()
      this.renderer.domElement.remove()
    }
  }
}
