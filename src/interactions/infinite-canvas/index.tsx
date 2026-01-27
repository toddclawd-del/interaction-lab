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
// Image Tile Component
// ============================================

interface ImageTileProps {
  position: [number, number, number]
  url: string
  size: number
}

/**
 * Individual image tile with hover effect
 */
function ImageTile({ position, url, size }: ImageTileProps) {
  const texture = useTexture(url)
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  
  // Smooth scale animation on hover
  useFrame(() => {
    if (meshRef.current) {
      const targetScale = hovered ? 1.08 : 1
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
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
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
}

/**
 * A chunk of the infinite grid containing gridSize x gridSize images
 * Chunks are rendered/unrendered based on camera proximity
 */
function GridChunk({ chunkX, chunkY, images, gridSize, imageSize, gap }: GridChunkProps) {
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
}

/**
 * Main grid component that handles:
 * - Drag/pan controls
 * - Momentum/inertia after release
 * - Chunk visibility calculation
 */
function InfiniteGrid({ images, gridSize, imageSize, gap }: InfiniteGridProps) {
  const { size, gl } = useThree()
  
  // Pan offset state
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  
  // Drag state refs (using refs to avoid re-renders during drag)
  const isDragging = useRef(false)
  const lastPointer = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  
  const chunkWorldSize = gridSize * (imageSize + gap)
  
  // Calculate which chunks should be visible based on current offset
  const visibleChunks = useMemo(() => {
    const chunks: { x: number; y: number }[] = []
    
    // Estimate viewport size in world units (rough approximation)
    // This could be made more precise with camera calculations
    const viewportWorldWidth = size.width / 80
    const viewportWorldHeight = size.height / 80
    
    // Current center in world coordinates
    const centerX = -offset.x
    const centerY = -offset.y
    
    // How many chunks we need to cover the viewport + buffer
    const chunksNeededX = Math.ceil(viewportWorldWidth / chunkWorldSize) + 3
    const chunksNeededY = Math.ceil(viewportWorldHeight / chunkWorldSize) + 3
    
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
  }, [offset, size, chunkWorldSize])

  // ============================================
  // Pointer Event Handlers
  // ============================================

  const handlePointerDown = useCallback((e: PointerEvent) => {
    isDragging.current = true
    lastPointer.current = { x: e.clientX, y: e.clientY }
    velocity.current = { x: 0, y: 0 }
    document.body.style.cursor = 'grabbing'
  }, [])

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!isDragging.current) return
    
    // Calculate delta in world units
    // Adjust the multiplier to control pan speed
    const sensitivity = 0.015
    const deltaX = (e.clientX - lastPointer.current.x) * sensitivity
    const deltaY = (e.clientY - lastPointer.current.y) * -sensitivity // Invert Y for natural feel
    
    // Store velocity for momentum
    velocity.current = { x: deltaX * 0.8, y: deltaY * 0.8 }
    
    // Update offset
    setOffset(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY,
    }))
    
    lastPointer.current = { x: e.clientX, y: e.clientY }
  }, [])

  const handlePointerUp = useCallback(() => {
    isDragging.current = false
    document.body.style.cursor = 'grab'
  }, [])

  // Attach event listeners to the canvas
  useEffect(() => {
    const canvas = gl.domElement
    
    canvas.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointerleave', handlePointerUp)
    
    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointerleave', handlePointerUp)
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
        
        // Decay velocity (friction)
        const friction = 0.95
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
  /** Size of each image in world units (default: 2) */
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
  imageSize = 2,
  gap = 0.3,
  backgroundColor = '#0a0a0a',
}: InfiniteCanvasProps) {
  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      cursor: 'grab',
      position: 'relative',
    }}>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]} // Responsive pixel ratio
      >
        <color attach="background" args={[backgroundColor]} />
        <InfiniteGrid
          images={images}
          gridSize={gridSize}
          imageSize={imageSize}
          gap={gap}
        />
      </Canvas>
      
      {/* UI Overlay - Instructions */}
      <div style={{
        position: 'absolute',
        bottom: 24,
        left: 24,
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: 13,
        opacity: 0.5,
        pointerEvents: 'none',
        userSelect: 'none',
      }}>
        Drag to explore
      </div>
      
      {/* Branding */}
      <div style={{
        position: 'absolute',
        bottom: 24,
        right: 24,
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: 11,
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
