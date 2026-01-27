/**
 * Infinite Canvas
 * 
 * An infinitely pannable image grid using React Three Fiber.
 * Drag/pan in any direction to explore an endless space of images.
 * 
 * Features:
 * - Infinite scrolling in all directions
 * - Chunk-based rendering for performance
 * - Smooth drag with momentum/inertia
 * - Hover effects on images
 * - Fully responsive (mobile to ultrawide)
 * - Touch support
 * 
 * Inspired by: https://tympanus.net/codrops/2026/01/07/infinite-canvas
 */

import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { useRef, useState, useMemo, useCallback, useEffect } from 'react'
import * as THREE from 'three'

// ============================================
// Configuration
// ============================================

// Sample images from Picsum (placeholder service)
// In production, replace with your own image URLs
const SAMPLE_IMAGES = Array.from({ length: 20 }, (_, i) => 
  `https://picsum.photos/seed/lab${i + 1}/400/400`
)

// ============================================
// Responsive Utilities
// ============================================

/**
 * Calculate viewport dimensions in world units using camera frustum
 * This ensures consistent behavior across all screen sizes
 */
function getViewportInWorldUnits(
  camera: THREE.PerspectiveCamera, 
  width: number, 
  height: number
): { worldWidth: number; worldHeight: number } {
  // Distance from camera to the plane where our content lives (z=0)
  const distance = camera.position.z
  
  // Calculate visible height at z=0 using FOV
  const vFov = (camera.fov * Math.PI) / 180
  const worldHeight = 2 * Math.tan(vFov / 2) * distance
  
  // Calculate width based on aspect ratio
  const aspect = width / height
  const worldWidth = worldHeight * aspect
  
  return { worldWidth, worldHeight }
}

// ============================================
// Image Tile Component
// ============================================

interface ImageTileProps {
  position: [number, number, number]
  url: string
  size: number
  isMobile: boolean
}

/**
 * Individual image tile with hover effect
 * Hover disabled on mobile for better touch experience
 */
function ImageTile({ position, url, size, isMobile }: ImageTileProps) {
  const texture = useTexture(url)
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  
  // Smooth scale animation on hover (desktop only)
  useFrame(() => {
    if (meshRef.current) {
      const targetScale = hovered && !isMobile ? 1.08 : 1
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, 1),
        0.1
      )
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={(e) => {
        if (isMobile) return
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        if (isMobile) return
        setHovered(false)
        document.body.style.cursor = 'grab'
      }}
    >
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial 
        map={texture} 
        toneMapped={false}
      />
    </mesh>
  )
}

// ============================================
// Grid Chunk Component
// ============================================

interface GridChunkProps {
  chunkX: number
  chunkY: number
  images: string[]
  gridSize: number
  imageSize: number
  gap: number
  isMobile: boolean
}

/**
 * A chunk of the infinite grid containing gridSize x gridSize images
 * Chunks are rendered/unrendered based on camera proximity
 */
function GridChunk({ chunkX, chunkY, images, gridSize, imageSize, gap, isMobile }: GridChunkProps) {
  const chunkWorldSize = gridSize * (imageSize + gap)
  
  // Pre-calculate all tile positions and image assignments
  const tiles = useMemo(() => {
    const result = []
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        // Deterministic but varied image selection based on position
        const seed = Math.abs(chunkX * 7 + chunkY * 13 + row * 3 + col * 5)
        const imageIndex = seed % images.length
        
        // Calculate world position
        const x = chunkX * chunkWorldSize + col * (imageSize + gap) + imageSize / 2
        const y = chunkY * chunkWorldSize + row * (imageSize + gap) + imageSize / 2
        
        result.push({
          key: `${chunkX}-${chunkY}-${row}-${col}`,
          position: [x, y, 0] as [number, number, number],
          url: images[imageIndex],
        })
      }
    }
    return result
  }, [chunkX, chunkY, images, gridSize, imageSize, gap, chunkWorldSize])

  return (
    <group>
      {tiles.map((tile) => (
        <ImageTile
          key={tile.key}
          position={tile.position}
          url={tile.url}
          size={imageSize}
          isMobile={isMobile}
        />
      ))}
    </group>
  )
}

// ============================================
// Infinite Grid Controller
// ============================================

interface InfiniteGridProps {
  images: string[]
  gridSize: number
  imageSize: number
  gap: number
  isMobile: boolean
}

/**
 * Main grid component that handles:
 * - Drag/pan controls (mouse and touch)
 * - Momentum/inertia after release
 * - Chunk visibility calculation
 * - Responsive viewport calculations
 */
function InfiniteGrid({ images, gridSize, imageSize, gap, isMobile }: InfiniteGridProps) {
  const { size, gl, camera } = useThree()
  
  // Pan offset state
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  
  // Drag state refs (using refs to avoid re-renders during drag)
  const isDragging = useRef(false)
  const lastPointer = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  
  const chunkWorldSize = gridSize * (imageSize + gap)
  
  // Calculate viewport in world units using proper camera math
  const viewport = useMemo(() => {
    return getViewportInWorldUnits(camera as THREE.PerspectiveCamera, size.width, size.height)
  }, [camera, size.width, size.height])
  
  // Calculate drag sensitivity based on viewport size
  // This ensures consistent "feel" across all screen sizes
  const dragSensitivity = useMemo(() => {
    // Base sensitivity adjusted by viewport size
    // Larger viewports need more movement per pixel
    return viewport.worldWidth / size.width
  }, [viewport.worldWidth, size.width])
  
  // Calculate which chunks should be visible based on current offset
  const visibleChunks = useMemo(() => {
    const chunks: { x: number; y: number }[] = []
    
    // Current center in world coordinates
    const centerX = -offset.x
    const centerY = -offset.y
    
    // How many chunks we need to cover the viewport + buffer
    // Add extra buffer for smooth scrolling
    const chunksNeededX = Math.ceil(viewport.worldWidth / chunkWorldSize) + 4
    const chunksNeededY = Math.ceil(viewport.worldHeight / chunkWorldSize) + 4
    
    // Starting chunk indices
    const startChunkX = Math.floor(centerX / chunkWorldSize) - Math.floor(chunksNeededX / 2)
    const startChunkY = Math.floor(centerY / chunkWorldSize) - Math.floor(chunksNeededY / 2)
    
    // Generate chunk list
    for (let x = startChunkX; x < startChunkX + chunksNeededX; x++) {
      for (let y = startChunkY; y < startChunkY + chunksNeededY; y++) {
        chunks.push({ x, y })
      }
    }
    
    return chunks
  }, [offset, viewport, chunkWorldSize])

  // ============================================
  // Unified Pointer/Touch Handlers
  // ============================================

  const getPointerPosition = useCallback((e: PointerEvent | TouchEvent): { x: number; y: number } => {
    if ('touches' in e && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
    if ('clientX' in e) {
      return { x: e.clientX, y: e.clientY }
    }
    return { x: 0, y: 0 }
  }, [])

  const handlePointerDown = useCallback((e: PointerEvent | TouchEvent) => {
    isDragging.current = true
    const pos = getPointerPosition(e)
    lastPointer.current = pos
    velocity.current = { x: 0, y: 0 }
    if (!isMobile) {
      document.body.style.cursor = 'grabbing'
    }
  }, [getPointerPosition, isMobile])

  const handlePointerMove = useCallback((e: PointerEvent | TouchEvent) => {
    if (!isDragging.current) return
    
    const pos = getPointerPosition(e)
    
    // Calculate delta using responsive sensitivity
    const deltaX = (pos.x - lastPointer.current.x) * dragSensitivity
    const deltaY = (pos.y - lastPointer.current.y) * -dragSensitivity // Invert Y for natural feel
    
    // Store velocity for momentum (reduced for touch)
    const velocityMultiplier = isMobile ? 0.6 : 0.8
    velocity.current = { x: deltaX * velocityMultiplier, y: deltaY * velocityMultiplier }
    
    // Update offset
    setOffset(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY,
    }))
    
    lastPointer.current = pos
  }, [getPointerPosition, dragSensitivity, isMobile])

  const handlePointerUp = useCallback(() => {
    isDragging.current = false
    if (!isMobile) {
      document.body.style.cursor = 'grab'
    }
  }, [isMobile])

  // Attach event listeners to the canvas
  useEffect(() => {
    const canvas = gl.domElement
    
    // Mouse events
    canvas.addEventListener('pointerdown', handlePointerDown as EventListener)
    window.addEventListener('pointermove', handlePointerMove as EventListener)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointerleave', handlePointerUp)
    
    // Touch events for better mobile support
    canvas.addEventListener('touchstart', handlePointerDown as EventListener, { passive: true })
    window.addEventListener('touchmove', handlePointerMove as EventListener, { passive: true })
    window.addEventListener('touchend', handlePointerUp)
    window.addEventListener('touchcancel', handlePointerUp)
    
    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown as EventListener)
      window.removeEventListener('pointermove', handlePointerMove as EventListener)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointerleave', handlePointerUp)
      
      canvas.removeEventListener('touchstart', handlePointerDown as EventListener)
      window.removeEventListener('touchmove', handlePointerMove as EventListener)
      window.removeEventListener('touchend', handlePointerUp)
      window.removeEventListener('touchcancel', handlePointerUp)
    }
  }, [gl, handlePointerDown, handlePointerMove, handlePointerUp])

  // Apply momentum after release
  useFrame(() => {
    if (!isDragging.current) {
      const speed = Math.sqrt(velocity.current.x ** 2 + velocity.current.y ** 2)
      
      // Only apply momentum if there's meaningful velocity
      if (speed > 0.0005) {
        setOffset(prev => ({
          x: prev.x + velocity.current.x,
          y: prev.y + velocity.current.y,
        }))
        
        // Decay velocity (friction) - slightly more friction on mobile
        const friction = isMobile ? 0.92 : 0.95
        velocity.current.x *= friction
        velocity.current.y *= friction
      }
    }
  })

  return (
    <group position={[offset.x, offset.y, 0]}>
      {visibleChunks.map((chunk) => (
        <GridChunk
          key={`chunk-${chunk.x}-${chunk.y}`}
          chunkX={chunk.x}
          chunkY={chunk.y}
          images={images}
          gridSize={gridSize}
          imageSize={imageSize}
          gap={gap}
          isMobile={isMobile}
        />
      ))}
    </group>
  )
}

// ============================================
// Main Export Component
// ============================================

export interface InfiniteCanvasProps {
  /** Array of image URLs to display */
  images?: string[]
  /** Number of images per row/column in each chunk (default: 3) */
  gridSize?: number
  /** Size of each image in world units (default: 2, auto-adjusts for mobile) */
  imageSize?: number
  /** Gap between images in world units (default: 0.3) */
  gap?: number
  /** Background color (default: #0a0a0a) */
  backgroundColor?: string
}

/**
 * Infinite Canvas Component
 * 
 * An infinitely scrollable image grid that can be panned in any direction.
 * Uses chunk-based rendering to maintain performance even with thousands of potential images.
 * Fully responsive from mobile (375px) to ultrawide (2560px+).
 * 
 * @example
 * ```tsx
 * // Basic usage with defaults
 * <InfiniteCanvas />
 * 
 * // With custom images
 * <InfiniteCanvas 
 *   images={['image1.jpg', 'image2.jpg', 'image3.jpg']}
 *   imageSize={3}
 *   gap={0.5}
 * />
 * ```
 */
export function InfiniteCanvas({
  images = SAMPLE_IMAGES,
  gridSize = 3,
  imageSize: propImageSize,
  gap: propGap,
  backgroundColor = '#0a0a0a',
}: InfiniteCanvasProps) {
  // Detect if mobile for responsive adjustments
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Responsive image size and gap
  // Smaller images on mobile for better fit, larger on desktop/ultrawide
  const imageSize = propImageSize ?? (isMobile ? 1.5 : 2)
  const gap = propGap ?? (isMobile ? 0.2 : 0.3)

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      cursor: isMobile ? 'default' : 'grab',
      position: 'relative',
      touchAction: 'none', // Prevent browser handling of touch
      overflow: 'hidden',
    }}>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]} // Responsive pixel ratio
        style={{ touchAction: 'none' }}
      >
        <color attach="background" args={[backgroundColor]} />
        <InfiniteGrid
          images={images}
          gridSize={gridSize}
          imageSize={imageSize}
          gap={gap}
          isMobile={isMobile}
        />
      </Canvas>
      
      {/* UI Overlay - Instructions (responsive text) */}
      <div style={{
        position: 'absolute',
        bottom: isMobile ? 16 : 24,
        left: isMobile ? 16 : 24,
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: isMobile ? 11 : 13,
        opacity: 0.5,
        pointerEvents: 'none',
        userSelect: 'none',
      }}>
        {isMobile ? 'Swipe to explore' : 'Drag to explore'}
      </div>
      
      {/* Branding (responsive) */}
      <div style={{
        position: 'absolute',
        bottom: isMobile ? 16 : 24,
        right: isMobile ? 16 : 24,
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: isMobile ? 9 : 11,
        opacity: 0.3,
        pointerEvents: 'none',
        userSelect: 'none',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
      }}>
        Infinite Canvas
      </div>
    </div>
  )
}

export default InfiniteCanvas
