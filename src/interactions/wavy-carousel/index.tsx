/**
 * Wavy Infinite Carousel
 * 
 * Reference: https://tympanus.net/codrops/2025/11/26/creating-wavy-infinite-carousels-in-react-three-fiber-with-glsl-shaders/
 * Author: Colin Demouge
 * 
 * Scroll-driven infinite carousel with wavy distortion using GLSL shaders.
 * Images wrap infinitely, stretch on velocity, and follow a curved path.
 * 
 * Key techniques:
 * - Custom GLSL shaders for vertex displacement
 * - World position-based curve calculations
 * - Modulo repositioning for infinite scroll
 * - Velocity-based stretch effect
 * - Object-fit cover in shader
 */

import { useRef, useMemo, useEffect, forwardRef, useState, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import Lenis from 'lenis'

// Import shaders as raw text
import vertexShader from './shaders/vertex.glsl?raw'
import fragmentShader from './shaders/fragment.glsl?raw'

// ============================================
// Sample Images - Using Unsplash with specific IDs (more reliable)
// ============================================

const IMAGE_LIST = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop', // Mountains
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=800&fit=crop', // Nature
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&h=800&fit=crop', // Forest
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&h=800&fit=crop', // Waterfall
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=800&fit=crop', // Lake
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=800&fit=crop', // Foggy
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=800&fit=crop', // Sunlight
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&h=800&fit=crop', // Valley
]

// ============================================
// Utility Functions
// ============================================

function mod(n: number, m: number): number {
  return ((n % m) + m) % m
}

// ============================================
// GLImage Component - Image plane with custom shader
// ============================================

interface GLImageProps {
  imageUrl: string
  scale: [number, number, number]
  geometry: THREE.PlaneGeometry
  position?: [number, number, number]
  curveStrength?: number
  curveFrequency?: number
}

const GLImage = forwardRef<THREE.Mesh, GLImageProps>(
  (
    {
      imageUrl,
      scale,
      geometry,
      position = [0, 0, 0],
      curveStrength = 0,
      curveFrequency = 0,
    },
    forwardedRef
  ) => {
    const localRef = useRef<THREE.Mesh>(null)
    const meshRef = (forwardedRef || localRef) as React.RefObject<THREE.Mesh>
    const texture = useTexture(imageUrl)
    
    useEffect(() => {
      if (texture) {
        console.log('Texture ready:', imageUrl.slice(-30))
      }
    }, [texture, imageUrl])

    const imageSizes = useMemo(() => {
      if (!texture) return [1, 1]
      return [texture.image?.width || 600, texture.image?.height || 800]
    }, [texture])

    const shaderArgs = useMemo(
      () => ({
        uniforms: {
          uTexture: { value: texture },
          uPlaneSizes: { value: new THREE.Vector2(scale[0], scale[1]) },
          uImageSizes: { value: new THREE.Vector2(imageSizes[0], imageSizes[1]) },
          uScrollSpeed: { value: 0.0 },
          uCurveStrength: { value: curveStrength },
          uCurveFrequency: { value: curveFrequency },
          uOpacity: { value: 1.0 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
      }),
      [texture, scale, imageSizes, curveStrength, curveFrequency]
    )

    return (
      <mesh position={position} ref={meshRef} scale={scale}>
        <primitive object={geometry} attach="geometry" />
        <shaderMaterial {...shaderArgs} />
      </mesh>
    )
  }
)

GLImage.displayName = 'GLImage'

// ============================================
// Carousel Component - Handles infinite scroll
// ============================================

interface CarouselProps {
  position?: [number, number, number]
  imageSize: [number, number]
  gap: number
  curveStrength?: number
  curveFrequency?: number
  direction?: 'vertical' | 'horizontal'
  scrollMultiplier?: number
  lenis: Lenis | null
  nativeScroll?: React.MutableRefObject<{ scroll: number; velocity: number }>
  isMobile?: boolean
}

function Carousel({
  position = [0, 0, 0],
  imageSize,
  gap,
  curveStrength = 0.8,
  curveFrequency = 0.5,
  direction = 'vertical',
  scrollMultiplier = 0.01,
  lenis,
  nativeScroll,
  isMobile = false,
}: CarouselProps) {
  const imageRefs = useRef<THREE.Mesh[]>([])
  const velocityRef = useRef(0)

  const planeGeometry = useMemo(() => {
    return new THREE.PlaneGeometry(1, 1, 32, 32)
  }, [])

  const totalSize = useMemo(() => {
    return IMAGE_LIST.length * gap + IMAGE_LIST.length * (direction === 'vertical' ? imageSize[1] : imageSize[0])
  }, [gap, imageSize, direction])

  // Subscribe to scroll events - Lenis or native
  useEffect(() => {
    if (isMobile && nativeScroll) {
      // Mobile: poll native scroll in animation frame
      return
    }
    
    if (!lenis) return

    const handleScroll = ({ velocity }: { velocity: number }) => {
      velocityRef.current = velocity
    }

    lenis.on('scroll', handleScroll)
    return () => {
      lenis.off('scroll', handleScroll)
    }
  }, [lenis, isMobile, nativeScroll])

  // Debug: track frames
  const frameCountRef = useRef(0)
  
  // Animation loop - handle infinite scroll and velocity effects
  useFrame(() => {
    // Get velocity from either Lenis or native scroll
    const velocity = isMobile && nativeScroll 
      ? nativeScroll.current.velocity 
      : velocityRef.current
    
    // Debug log every 60 frames (~1 second)
    frameCountRef.current++
    if (frameCountRef.current % 60 === 1) {
      console.log('Frame update:', { isMobile, velocity: velocity.toFixed(3), imageCount: imageRefs.current.length })
    }

    imageRefs.current.forEach((ref) => {
      if (!ref) return

      // Get the shader material
      const material = ref.material as THREE.ShaderMaterial
      if (material.uniforms) {
        // Update scroll speed uniform for stretch effect
        material.uniforms.uScrollSpeed.value = velocity * scrollMultiplier
      }

      if (direction === 'vertical') {
        // Move based on velocity
        ref.position.y -= velocity * scrollMultiplier

        // Wrap position for infinite effect
        ref.position.y = mod(ref.position.y + totalSize / 2, totalSize) - totalSize / 2
      } else {
        // Horizontal carousel
        ref.position.x -= velocity * scrollMultiplier
        ref.position.x = mod(ref.position.x + totalSize / 2, totalSize) - totalSize / 2
      }
    })

    // Decay velocity smoothly when not scrolling
    velocityRef.current *= 0.95
  })

  return (
    <group position={position}>
      {IMAGE_LIST.map((url, index) => {
        const initialPos: [number, number, number] =
          direction === 'vertical'
            ? [0, index * (imageSize[1] + gap) - (totalSize / 2) + imageSize[1] / 2, 0]
            : [index * (imageSize[0] + gap) - (totalSize / 2) + imageSize[0] / 2, 0, 0]

        return (
          <GLImage
            key={index}
            imageUrl={url}
            scale={[imageSize[0], imageSize[1], 1]}
            geometry={planeGeometry}
            position={initialPos}
            curveStrength={curveStrength}
            curveFrequency={curveFrequency}
            ref={(el) => {
              if (el) imageRefs.current[index] = el
            }}
          />
        )
      })}
    </group>
  )
}

// ============================================
// Scene Component - Contains all carousels
// ============================================

interface SceneProps {
  variant: 'single' | 'dual' | 'triple' | 'horizontal'
  lenis: Lenis | null
  nativeScroll?: React.MutableRefObject<{ scroll: number; velocity: number }>
  isMobileDevice?: boolean
}

function Scene({ variant, lenis, nativeScroll, isMobileDevice }: SceneProps) {
  const { viewport } = useThree()

  // Responsive sizing - detect mobile
  const isMobile = viewport.width < 4.5
  const baseSize = Math.min(viewport.width, viewport.height)
  
  // Adjust image size based on screen size
  const sizeMultiplier = isMobile ? 0.4 : 0.25
  const imageWidth = baseSize * sizeMultiplier
  const imageHeight = imageWidth * 1.33

  if (variant === 'single') {
    return (
      <Carousel
        imageSize={[imageWidth * (isMobile ? 1.2 : 1), imageHeight * (isMobile ? 1.2 : 1)]}
        gap={imageHeight * 0.15}
        curveStrength={isMobile ? 0.3 : 0.6}
        curveFrequency={0.4}
        lenis={lenis} nativeScroll={nativeScroll} isMobile={isMobileDevice}
      />
    )
  }

  if (variant === 'dual') {
    const offset = isMobile ? imageWidth * 0.55 : imageWidth * 0.8
    const imgScale = isMobile ? 0.8 : 0.9
    return (
      <>
        <Carousel
          position={[-offset, 0, 0]}
          imageSize={[imageWidth * imgScale, imageHeight * imgScale]}
          gap={imageHeight * 0.12}
          curveStrength={isMobile ? 0.3 : 0.5}
          curveFrequency={0.35}
          scrollMultiplier={0.012}
          lenis={lenis} nativeScroll={nativeScroll} isMobile={isMobileDevice}
        />
        <Carousel
          position={[offset, imageHeight * 0.5, 0]}
          imageSize={[imageWidth * imgScale, imageHeight * imgScale]}
          gap={imageHeight * 0.12}
          curveStrength={isMobile ? -0.3 : -0.5}
          curveFrequency={0.35}
          scrollMultiplier={-0.01}
          lenis={lenis} nativeScroll={nativeScroll} isMobile={isMobileDevice}
        />
      </>
    )
  }

  if (variant === 'triple') {
    // On mobile, fall back to dual layout
    if (isMobile) {
      const offset = imageWidth * 0.55
      return (
        <>
          <Carousel
            position={[-offset, 0, 0]}
            imageSize={[imageWidth * 0.75, imageHeight * 0.75]}
            gap={imageHeight * 0.1}
            curveStrength={0.25}
            curveFrequency={0.3}
            scrollMultiplier={0.01}
            lenis={lenis} nativeScroll={nativeScroll} isMobile={isMobileDevice}
          />
          <Carousel
            position={[offset, imageHeight * 0.4, 0]}
            imageSize={[imageWidth * 0.75, imageHeight * 0.75]}
            gap={imageHeight * 0.1}
            curveStrength={-0.25}
            curveFrequency={0.3}
            scrollMultiplier={-0.008}
            lenis={lenis} nativeScroll={nativeScroll} isMobile={isMobileDevice}
          />
        </>
      )
    }
    
    const offset = imageWidth * 1.1
    return (
      <>
        <Carousel
          position={[-offset, 0, -0.5]}
          imageSize={[imageWidth * 0.75, imageHeight * 0.75]}
          gap={imageHeight * 0.1}
          curveStrength={0.4}
          curveFrequency={0.3}
          scrollMultiplier={0.008}
          lenis={lenis} nativeScroll={nativeScroll} isMobile={isMobileDevice}
        />
        <Carousel
          position={[0, imageHeight * 0.3, 0]}
          imageSize={[imageWidth, imageHeight]}
          gap={imageHeight * 0.15}
          curveStrength={0}
          curveFrequency={0}
          scrollMultiplier={0.015}
          lenis={lenis} nativeScroll={nativeScroll} isMobile={isMobileDevice}
        />
        <Carousel
          position={[offset, -imageHeight * 0.2, -0.5]}
          imageSize={[imageWidth * 0.75, imageHeight * 0.75]}
          gap={imageHeight * 0.1}
          curveStrength={-0.4}
          curveFrequency={0.3}
          scrollMultiplier={-0.01}
          lenis={lenis} nativeScroll={nativeScroll} isMobile={isMobileDevice}
        />
      </>
    )
  }

  // Horizontal variant
  return (
    <Carousel
      imageSize={[imageWidth * (isMobile ? 1 : 1), imageHeight * (isMobile ? 1 : 1)]}
      gap={imageWidth * 0.15}
      curveStrength={0.5}
      curveFrequency={0.3}
      direction="horizontal"
      lenis={lenis} nativeScroll={nativeScroll} isMobile={isMobileDevice}
    />
  )
}

// ============================================
// Main Export Component
// ============================================

// Detect mobile
const isMobileBrowser = () => {
  if (typeof window === 'undefined') return false
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768
}

// Check WebGL support
const isWebGLAvailable = () => {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch (e) {
    return false
  }
}

// Native scroll tracker for mobile
interface NativeScrollState {
  scroll: number
  velocity: number
}

export function WavyCarousel() {
  const [variant, setVariant] = useState<'single' | 'dual' | 'triple' | 'horizontal'>('dual')
  const lenisRef = useRef<Lenis | null>(null)
  const [lenisReady, setLenisReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMobile] = useState(isMobileBrowser)
  const [webglSupported] = useState(isWebGLAvailable)
  const nativeScrollRef = useRef<NativeScrollState>({ scroll: 0, velocity: 0 })
  const lastScrollRef = useRef(0)
  const lastTimeRef = useRef(Date.now())

  // Check WebGL support
  if (!webglSupported) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#0a0a0a', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '2rem',
        color: '#fff',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
        <h2 style={{ marginBottom: '0.5rem' }}>WebGL Not Supported</h2>
        <p style={{ color: '#888', marginBottom: '1.5rem' }}>
          This interaction requires WebGL which isn't available on your device/browser.
        </p>
        <Link to="/" style={{ color: '#fff', textDecoration: 'underline' }}>← Back to Home</Link>
      </div>
    )
  }

  // Initialize scroll - Lenis for desktop, native for mobile
  useEffect(() => {
    if (isMobile) {
      // Mobile: use native scroll
      setLenisReady(true) // Mark as ready immediately
      
      let scrollLogCount = 0
      const handleScroll = () => {
        const now = Date.now()
        const dt = Math.max(now - lastTimeRef.current, 1)
        const currentScroll = window.scrollY
        const velocity = (currentScroll - lastScrollRef.current) / dt * 16
        
        nativeScrollRef.current = {
          scroll: currentScroll,
          velocity: velocity * 0.5
        }
        
        // Debug log first 5 scroll events
        if (scrollLogCount < 5) {
          console.log('Mobile scroll:', { scroll: currentScroll, velocity: velocity.toFixed(2) })
          scrollLogCount++
        }
        
        lastScrollRef.current = currentScroll
        lastTimeRef.current = now
      }
      
      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => window.removeEventListener('scroll', handleScroll)
    } else {
      // Desktop: use Lenis
      try {
        const lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: variant === 'horizontal' ? 'horizontal' : 'vertical',
          gestureOrientation: variant === 'horizontal' ? 'horizontal' : 'vertical',
          smoothWheel: true,
          infinite: true,
        })

        lenisRef.current = lenis
        setLenisReady(true)

        let rafId: number

        function raf(time: number) {
          lenis.raf(time)
          rafId = requestAnimationFrame(raf)
        }

        rafId = requestAnimationFrame(raf)

        return () => {
          cancelAnimationFrame(rafId)
          lenis.destroy()
          lenisRef.current = null
          setLenisReady(false)
        }
      } catch (err) {
        console.error('Lenis initialization failed:', err)
        setError('Scroll initialization failed')
      }
    }
  }, [variant, isMobile])

  // Error fallback
  if (error) {
    return (
      <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <p style={{ color: '#ff6b6b', fontSize: '1.2rem' }}>⚠️ {error}</p>
        <Link to="/" style={{ color: '#fff', textDecoration: 'underline' }}>← Back to Home</Link>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Loading state */}
      {!lenisReady && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <p style={{ color: '#666' }}>Loading...</p>
        </div>
      )}

      {/* Back button */}
      <Link to="/" style={styles.backButton}>
        ← Back
      </Link>

      {/* Variant selector */}
      <div style={styles.controls}>
        {(['single', 'dual', 'triple', 'horizontal'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setVariant(v)}
            style={{
              ...styles.button,
              ...(variant === v ? styles.buttonActive : {}),
            }}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {/* Scroll hint */}
      <div style={styles.hint}>
        {variant === 'horizontal' ? '← Scroll horizontally →' : '↑ Scroll to explore ↓'}
      </div>

      {/* Three.js Canvas - key forces remount on variant change */}
      <Canvas
        key={`canvas-${variant}`}
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={styles.canvas}
        gl={{ 
          antialias: !isMobile,
          alpha: true,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false
        }}
        dpr={isMobile ? 1 : [1, 2]}
        onCreated={({ gl }) => {
          console.log('WebGL context created:', gl.getContext().getParameter(gl.getContext().VERSION))
        }}
        onError={(e) => {
          console.error('Canvas error:', e)
          setError('WebGL initialization failed')
        }}
      >
        <color attach="background" args={['#0a0a0a']} />
        <Suspense fallback={null}>
          {lenisReady && <Scene variant={variant} lenis={lenisRef.current} nativeScroll={nativeScrollRef} isMobileDevice={isMobile} />}
        </Suspense>
      </Canvas>

      {/* Branding */}
      <div style={styles.branding}>WAVY CAROUSEL</div>

      {/* Scrollable area for Lenis */}
      <div style={styles.scrollArea} />
    </div>
  )
}

// ============================================
// Styles
// ============================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
    width: '100vw',
    minHeight: '100vh',
    background: '#0a0a0a',
  },
  backButton: {
    position: 'fixed',
    top: 16,
    left: 16,
    color: 'rgba(255, 255, 255, 0.5)',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
    zIndex: 100,
    padding: '4px 8px',
    background: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 4,
  },
  controls: {
    position: 'fixed',
    top: 60,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: 6,
    zIndex: 100,
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: '90vw',
  },
  button: {
    padding: '6px 12px',
    fontSize: 11,
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'rgba(255, 255, 255, 0.5)',
    background: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  buttonActive: {
    color: '#fff',
    background: 'rgba(255, 255, 255, 0.15)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  hint: {
    position: 'fixed',
    bottom: 24,
    left: '50%',
    transform: 'translateX(-50%)',
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 12,
    fontWeight: 400,
    letterSpacing: '0.1em',
    zIndex: 100,
    animation: 'pulse 2s ease-in-out infinite',
  },
  canvas: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 1,
  },
  branding: {
    position: 'fixed',
    top: 16,
    right: 16,
    color: 'rgba(255, 255, 255, 0.3)',
    fontFamily: 'monospace',
    fontSize: 10,
    letterSpacing: '0.1em',
    pointerEvents: 'none',
    userSelect: 'none',
    zIndex: 100,
  },
  scrollArea: {
    position: 'relative',
    width: '100%',
    height: '500vh', // Creates scrollable space
    pointerEvents: 'auto', // Allow scroll interaction
  },
}

export default WavyCarousel
