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

import { useRef, useMemo, useEffect, forwardRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import Lenis from 'lenis'

// Import shaders as raw text
import vertexShader from './shaders/vertex.glsl?raw'
import fragmentShader from './shaders/fragment.glsl?raw'

// ============================================
// Sample Images - Using picsum.photos
// ============================================

const IMAGE_LIST = [
  'https://picsum.photos/seed/wavy1/600/800',
  'https://picsum.photos/seed/wavy2/600/800',
  'https://picsum.photos/seed/wavy3/600/800',
  'https://picsum.photos/seed/wavy4/600/800',
  'https://picsum.photos/seed/wavy5/600/800',
  'https://picsum.photos/seed/wavy6/600/800',
  'https://picsum.photos/seed/wavy7/600/800',
  'https://picsum.photos/seed/wavy8/600/800',
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
}: CarouselProps) {
  const imageRefs = useRef<THREE.Mesh[]>([])
  const velocityRef = useRef(0)

  const planeGeometry = useMemo(() => {
    return new THREE.PlaneGeometry(1, 1, 32, 32)
  }, [])

  const totalSize = useMemo(() => {
    return IMAGE_LIST.length * gap + IMAGE_LIST.length * (direction === 'vertical' ? imageSize[1] : imageSize[0])
  }, [gap, imageSize, direction])

  // Subscribe to Lenis scroll events
  useEffect(() => {
    if (!lenis) return

    const handleScroll = ({ velocity }: { velocity: number }) => {
      velocityRef.current = velocity
    }

    lenis.on('scroll', handleScroll)
    return () => {
      lenis.off('scroll', handleScroll)
    }
  }, [lenis])

  // Animation loop - handle infinite scroll and velocity effects
  useFrame(() => {
    const velocity = velocityRef.current

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
}

function Scene({ variant, lenis }: SceneProps) {
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
        lenis={lenis}
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
          lenis={lenis}
        />
        <Carousel
          position={[offset, imageHeight * 0.5, 0]}
          imageSize={[imageWidth * imgScale, imageHeight * imgScale]}
          gap={imageHeight * 0.12}
          curveStrength={isMobile ? -0.3 : -0.5}
          curveFrequency={0.35}
          scrollMultiplier={-0.01}
          lenis={lenis}
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
            lenis={lenis}
          />
          <Carousel
            position={[offset, imageHeight * 0.4, 0]}
            imageSize={[imageWidth * 0.75, imageHeight * 0.75]}
            gap={imageHeight * 0.1}
            curveStrength={-0.25}
            curveFrequency={0.3}
            scrollMultiplier={-0.008}
            lenis={lenis}
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
          lenis={lenis}
        />
        <Carousel
          position={[0, imageHeight * 0.3, 0]}
          imageSize={[imageWidth, imageHeight]}
          gap={imageHeight * 0.15}
          curveStrength={0}
          curveFrequency={0}
          scrollMultiplier={0.015}
          lenis={lenis}
        />
        <Carousel
          position={[offset, -imageHeight * 0.2, -0.5]}
          imageSize={[imageWidth * 0.75, imageHeight * 0.75]}
          gap={imageHeight * 0.1}
          curveStrength={-0.4}
          curveFrequency={0.3}
          scrollMultiplier={-0.01}
          lenis={lenis}
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
      lenis={lenis}
    />
  )
}

// ============================================
// Main Export Component
// ============================================

export function WavyCarousel() {
  const [variant, setVariant] = useState<'single' | 'dual' | 'triple' | 'horizontal'>('dual')
  const lenisRef = useRef<Lenis | null>(null)
  const [lenisReady, setLenisReady] = useState(false)

  // Initialize Lenis smooth scroll
  useEffect(() => {
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

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
      lenisRef.current = null
      setLenisReady(false)
    }
  }, [variant])

  return (
    <div style={styles.container}>
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

      {/* Three.js Canvas */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={styles.canvas}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#0a0a0a']} />
        {lenisReady && <Scene variant={variant} lenis={lenisRef.current} />}
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
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
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
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
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
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '500vh', // Creates scrollable space for Lenis
    pointerEvents: 'none',
  },
}

export default WavyCarousel
