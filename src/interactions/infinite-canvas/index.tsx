/**
 * Infinite Canvas — True 3D Version
 * 
 * An infinitely pannable 3D image space using React Three Fiber.
 * Navigate in X, Y, AND Z axes to explore an endless universe of images.
 * 
 * Based on: https://tympanus.net/codrops/2026/01/07/infinite-canvas
 * 
 * Features:
 * - True 3D navigation (X, Y via drag, Z via scroll/pinch)
 * - 3×3×3 chunk-based rendering (27 active chunks)
 * - Images at varied depths within chunks
 * - Distance-based opacity fading
 * - Smooth momentum physics
 * - Fully responsive + touch support
 */

import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { useRef, useState, useMemo, useCallback, useEffect } from 'react'
import * as THREE from 'three'

// ============================================
// Configuration
// ============================================

const SAMPLE_IMAGES = Array.from({ length: 30 }, (_, i) => 
  `https://picsum.photos/seed/canvas${i + 1}/400/400`
)

// Chunk configuration
const CHUNK_SIZE = 20 // World units per chunk
const CHUNK_RADIUS = 1 // How many chunks in each direction (1 = 3×3×3 = 27 chunks)
const PLANES_PER_CHUNK = 6 // Images per chunk
const PLANE_SIZE_MIN = 3
const PLANE_SIZE_MAX = 6

// Navigation
const DRAG_SENSITIVITY = 0.015
const SCROLL_SENSITIVITY = 0.5
const MOMENTUM_FRICTION = 0.94
const MOMENTUM_FRICTION_MOBILE = 0.90

// Visual
const FADE_START = 25 // Start fading at this distance
const FADE_END = 45 // Fully transparent at this distance

// ============================================
// Seeded Random for Deterministic Layouts
// ============================================

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

function hashChunk(cx: number, cy: number, cz: number): number {
  // Simple hash for chunk coordinates
  return cx * 73856093 + cy * 19349663 + cz * 83492791
}

// ============================================
// Types
// ============================================

interface PlaneData {
  id: string
  position: THREE.Vector3
  size: number
  imageIndex: number
}

interface ChunkData {
  key: string
  cx: number
  cy: number
  cz: number
}

// ============================================
// Generate Chunk Planes (Deterministic)
// ============================================

const planeCache = new Map<string, PlaneData[]>()
const MAX_CACHE = 128

function generateChunkPlanes(cx: number, cy: number, cz: number): PlaneData[] {
  const key = `${cx},${cy},${cz}`
  
  // Check cache
  if (planeCache.has(key)) {
    const cached = planeCache.get(key)!
    // Move to end for LRU
    planeCache.delete(key)
    planeCache.set(key, cached)
    return cached
  }
  
  const planes: PlaneData[] = []
  const baseSeed = hashChunk(cx, cy, cz)
  
  for (let i = 0; i < PLANES_PER_CHUNK; i++) {
    const seed = baseSeed + i * 1000
    const r = (n: number) => seededRandom(seed + n)
    
    // Random position within chunk bounds
    const x = cx * CHUNK_SIZE + r(0) * CHUNK_SIZE
    const y = cy * CHUNK_SIZE + r(1) * CHUNK_SIZE
    const z = cz * CHUNK_SIZE + r(2) * CHUNK_SIZE
    
    // Random size
    const size = PLANE_SIZE_MIN + r(3) * (PLANE_SIZE_MAX - PLANE_SIZE_MIN)
    
    // Random image (deterministic)
    const imageIndex = Math.floor(r(4) * 1000000)
    
    planes.push({
      id: `${cx}-${cy}-${cz}-${i}`,
      position: new THREE.Vector3(x, y, z),
      size,
      imageIndex,
    })
  }
  
  // Cache with LRU eviction
  planeCache.set(key, planes)
  while (planeCache.size > MAX_CACHE) {
    const firstKey = planeCache.keys().next().value
    if (firstKey) planeCache.delete(firstKey)
  }
  
  return planes
}

// ============================================
// Image Plane Component
// ============================================

interface ImagePlaneProps {
  position: THREE.Vector3
  size: number
  url: string
  cameraPosition: React.MutableRefObject<THREE.Vector3>
  isMobile: boolean
}

function ImagePlane({ position, size, url, cameraPosition, isMobile }: ImagePlaneProps) {
  const texture = useTexture(url)
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshBasicMaterial>(null)
  const [hovered, setHovered] = useState(false)
  
  // Update opacity based on distance from camera
  useFrame(() => {
    if (meshRef.current && materialRef.current) {
      // Calculate distance to camera
      const dist = position.distanceTo(cameraPosition.current)
      
      // Fade based on distance
      let opacity = 1
      if (dist > FADE_START) {
        opacity = 1 - (dist - FADE_START) / (FADE_END - FADE_START)
        opacity = Math.max(0, Math.min(1, opacity))
      }
      
      materialRef.current.opacity = opacity
      meshRef.current.visible = opacity > 0.01
      
      // Billboard: always face camera
      meshRef.current.lookAt(cameraPosition.current)
      
      // Hover scale (desktop only)
      const targetScale = hovered && !isMobile ? 1.1 : 1
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
        ref={materialRef}
        map={texture} 
        transparent
        toneMapped={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// ============================================
// Chunk Component
// ============================================

interface ChunkProps {
  cx: number
  cy: number
  cz: number
  images: string[]
  cameraPosition: React.MutableRefObject<THREE.Vector3>
  isMobile: boolean
}

function Chunk({ cx, cy, cz, images, cameraPosition, isMobile }: ChunkProps) {
  const [planes, setPlanes] = useState<PlaneData[]>([])
  
  // Generate planes on mount (deferred to idle time)
  useEffect(() => {
    let canceled = false
    
    const generate = () => {
      if (!canceled) {
        setPlanes(generateChunkPlanes(cx, cy, cz))
      }
    }
    
    if (typeof requestIdleCallback !== 'undefined') {
      const id = requestIdleCallback(generate, { timeout: 100 })
      return () => {
        canceled = true
        cancelIdleCallback(id)
      }
    } else {
      const id = setTimeout(generate, 0)
      return () => {
        canceled = true
        clearTimeout(id)
      }
    }
  }, [cx, cy, cz])

  return (
    <group>
      {planes.map((plane) => (
        <ImagePlane
          key={plane.id}
          position={plane.position}
          size={plane.size}
          url={images[plane.imageIndex % images.length]}
          cameraPosition={cameraPosition}
          isMobile={isMobile}
        />
      ))}
    </group>
  )
}

// ============================================
// 3D Infinite Grid Controller
// ============================================

interface InfiniteGrid3DProps {
  images: string[]
  isMobile: boolean
}

function InfiniteGrid3D({ images, isMobile }: InfiniteGrid3DProps) {
  const { gl, camera } = useThree()
  
  // Camera position state (we move the camera, not the world)
  const cameraPos = useRef(new THREE.Vector3(0, 0, 0))
  const velocity = useRef(new THREE.Vector3(0, 0, 0))
  const isDragging = useRef(false)
  const lastPointer = useRef({ x: 0, y: 0 })
  
  // Track current chunk for re-rendering
  const [currentChunk, setCurrentChunk] = useState({ cx: 0, cy: 0, cz: 0 })
  
  // Calculate visible chunks (3×3×3 around camera)
  const visibleChunks = useMemo<ChunkData[]>(() => {
    const chunks: ChunkData[] = []
    const { cx, cy, cz } = currentChunk
    
    for (let dx = -CHUNK_RADIUS; dx <= CHUNK_RADIUS; dx++) {
      for (let dy = -CHUNK_RADIUS; dy <= CHUNK_RADIUS; dy++) {
        for (let dz = -CHUNK_RADIUS; dz <= CHUNK_RADIUS; dz++) {
          chunks.push({
            key: `${cx + dx},${cy + dy},${cz + dz}`,
            cx: cx + dx,
            cy: cy + dy,
            cz: cz + dz,
          })
        }
      }
    }
    
    return chunks
  }, [currentChunk])
  
  // Pointer handlers
  const getPointerPos = useCallback((e: PointerEvent | TouchEvent) => {
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
    lastPointer.current = getPointerPos(e)
    velocity.current.set(0, 0, 0)
    if (!isMobile) document.body.style.cursor = 'grabbing'
  }, [getPointerPos, isMobile])

  const handlePointerMove = useCallback((e: PointerEvent | TouchEvent) => {
    if (!isDragging.current) return
    
    const pos = getPointerPos(e)
    const deltaX = (pos.x - lastPointer.current.x) * DRAG_SENSITIVITY
    const deltaY = (pos.y - lastPointer.current.y) * -DRAG_SENSITIVITY
    
    // Apply to velocity for momentum
    const mult = isMobile ? 0.5 : 0.7
    velocity.current.x = -deltaX * mult
    velocity.current.y = -deltaY * mult
    
    // Move camera
    cameraPos.current.x -= deltaX
    cameraPos.current.y -= deltaY
    
    lastPointer.current = pos
  }, [getPointerPos, isMobile])

  const handlePointerUp = useCallback(() => {
    isDragging.current = false
    if (!isMobile) document.body.style.cursor = 'grab'
  }, [isMobile])

  // Scroll/wheel for Z navigation
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY * SCROLL_SENSITIVITY * 0.01
    velocity.current.z += delta
  }, [])

  // Pinch zoom for mobile Z navigation
  const lastPinchDist = useRef(0)
  
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch gesture
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      if (lastPinchDist.current > 0) {
        const delta = (lastPinchDist.current - dist) * 0.05
        velocity.current.z += delta
      }
      
      lastPinchDist.current = dist
    } else if (isDragging.current) {
      // Regular drag
      handlePointerMove(e)
    }
  }, [handlePointerMove])

  const handleTouchEnd = useCallback(() => {
    lastPinchDist.current = 0
    handlePointerUp()
  }, [handlePointerUp])

  // Attach event listeners
  useEffect(() => {
    const canvas = gl.domElement
    
    canvas.addEventListener('pointerdown', handlePointerDown as EventListener)
    window.addEventListener('pointermove', handlePointerMove as EventListener)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointerleave', handlePointerUp)
    
    canvas.addEventListener('wheel', handleWheel, { passive: false })
    
    canvas.addEventListener('touchstart', handlePointerDown as EventListener, { passive: true })
    window.addEventListener('touchmove', handleTouchMove as EventListener, { passive: false })
    window.addEventListener('touchend', handleTouchEnd)
    window.addEventListener('touchcancel', handleTouchEnd)
    
    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown as EventListener)
      window.removeEventListener('pointermove', handlePointerMove as EventListener)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointerleave', handlePointerUp)
      
      canvas.removeEventListener('wheel', handleWheel)
      
      canvas.removeEventListener('touchstart', handlePointerDown as EventListener)
      window.removeEventListener('touchmove', handleTouchMove as EventListener)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [gl, handlePointerDown, handlePointerMove, handlePointerUp, handleWheel, handleTouchMove, handleTouchEnd])

  // Animation loop
  useFrame(() => {
    // Apply momentum when not dragging
    if (!isDragging.current) {
      const friction = isMobile ? MOMENTUM_FRICTION_MOBILE : MOMENTUM_FRICTION
      velocity.current.multiplyScalar(friction)
      
      // Apply velocity to position
      cameraPos.current.add(velocity.current)
    }
    
    // Update actual camera
    camera.position.copy(cameraPos.current)
    camera.position.z += 30 // Keep camera offset from content
    
    // Check if we've moved to a new chunk
    const newCx = Math.floor(cameraPos.current.x / CHUNK_SIZE)
    const newCy = Math.floor(cameraPos.current.y / CHUNK_SIZE)
    const newCz = Math.floor(cameraPos.current.z / CHUNK_SIZE)
    
    if (newCx !== currentChunk.cx || newCy !== currentChunk.cy || newCz !== currentChunk.cz) {
      setCurrentChunk({ cx: newCx, cy: newCy, cz: newCz })
    }
  })

  return (
    <>
      {visibleChunks.map((chunk) => (
        <Chunk
          key={chunk.key}
          cx={chunk.cx}
          cy={chunk.cy}
          cz={chunk.cz}
          images={images}
          cameraPosition={cameraPos}
          isMobile={isMobile}
        />
      ))}
    </>
  )
}

// ============================================
// Main Export
// ============================================

export interface InfiniteCanvasProps {
  images?: string[]
  backgroundColor?: string
}

export function InfiniteCanvas({
  images = SAMPLE_IMAGES,
  backgroundColor = '#050505',
}: InfiniteCanvasProps) {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      cursor: isMobile ? 'default' : 'grab',
      position: 'relative',
      touchAction: 'none',
      overflow: 'hidden',
    }}>
      <Canvas
        camera={{ position: [0, 0, 30], fov: 50, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        style={{ touchAction: 'none' }}
      >
        <color attach="background" args={[backgroundColor]} />
        <fog attach="fog" args={[backgroundColor, FADE_START, FADE_END]} />
        <InfiniteGrid3D images={images} isMobile={isMobile} />
      </Canvas>
      
      {/* Instructions */}
      <div style={{
        position: 'absolute',
        bottom: isMobile ? 16 : 24,
        left: isMobile ? 16 : 24,
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: isMobile ? 10 : 12,
        opacity: 0.4,
        pointerEvents: 'none',
        userSelect: 'none',
        lineHeight: 1.5,
      }}>
        {isMobile ? (
          <>Swipe to explore • Pinch to dive</>
        ) : (
          <>Drag to explore • Scroll to dive deeper</>
        )}
      </div>
      
      {/* Depth indicator */}
      <div style={{
        position: 'absolute',
        top: isMobile ? 16 : 24,
        right: isMobile ? 16 : 24,
        color: 'white',
        fontFamily: 'monospace',
        fontSize: isMobile ? 9 : 10,
        opacity: 0.3,
        pointerEvents: 'none',
        userSelect: 'none',
        letterSpacing: '0.1em',
      }}>
        INFINITE CANVAS
      </div>
    </div>
  )
}

export default InfiniteCanvas
