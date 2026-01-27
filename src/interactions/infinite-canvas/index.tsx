/**
 * Infinite Canvas — True 3D Version (v5: Instanced + Fast Pinch)
 * 
 * Reference: https://tympanus.net/codrops/2026/01/07/infinite-canvas
 * 
 * v5 Improvements:
 * - Instanced mesh rendering for placeholders
 * - Texture disposal on unmount
 * - Much faster pinch (bigger impulse per gesture)
 * - Better memory management
 */

import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useRef, useState, useMemo, useCallback, useEffect, Suspense } from 'react'
import * as THREE from 'three'

// ============================================
// Configuration
// ============================================

const SAMPLE_IMAGES = Array.from({ length: 30 }, (_, i) => 
  `https://picsum.photos/seed/canvas${i + 1}/400/400`
)

// Chunk configuration
const CHUNK_SIZE = 20
const CHUNK_RADIUS = 1
const PLANES_PER_CHUNK = 5 // Reduced for better perf
const PLANE_SIZE_MIN = 3
const PLANE_SIZE_MAX = 6

// Navigation
const DRAG_SENSITIVITY = 0.015
const MOMENTUM_FRICTION = 0.94
const MOMENTUM_FRICTION_MOBILE = 0.90

// Z spring physics
const Z_SCROLL_SPEED = 0.8
const Z_SPRING_STIFFNESS = 0.08
const Z_SPRING_DAMPING = 0.85

// Pinch - MUCH faster now
const PINCH_SENSITIVITY = 0.12 // 4x increase from 0.03
const PINCH_DEADZONE = 3 // Reduced deadzone
const PINCH_MIN_IMPULSE = 0.5 // Minimum Z movement per pinch

// Visual
const FADE_START = 25
const FADE_END = 45

// ============================================
// Seeded Random
// ============================================

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

function hashChunk(cx: number, cy: number, cz: number): number {
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
// Chunk Plane Generation
// ============================================

const planeCache = new Map<string, PlaneData[]>()
const MAX_CACHE = 128

function generateChunkPlanes(cx: number, cy: number, cz: number): PlaneData[] {
  const key = `${cx},${cy},${cz}`
  
  if (planeCache.has(key)) {
    const cached = planeCache.get(key)!
    planeCache.delete(key)
    planeCache.set(key, cached)
    return cached
  }
  
  const planes: PlaneData[] = []
  const baseSeed = hashChunk(cx, cy, cz)
  
  for (let i = 0; i < PLANES_PER_CHUNK; i++) {
    const seed = baseSeed + i * 1000
    const r = (n: number) => seededRandom(seed + n)
    
    planes.push({
      id: `${cx}-${cy}-${cz}-${i}`,
      position: new THREE.Vector3(
        cx * CHUNK_SIZE + r(0) * CHUNK_SIZE,
        cy * CHUNK_SIZE + r(1) * CHUNK_SIZE,
        cz * CHUNK_SIZE + r(2) * CHUNK_SIZE
      ),
      size: PLANE_SIZE_MIN + r(3) * (PLANE_SIZE_MAX - PLANE_SIZE_MIN),
      imageIndex: Math.floor(r(4) * 1000000),
    })
  }
  
  planeCache.set(key, planes)
  while (planeCache.size > MAX_CACHE) {
    const firstKey = planeCache.keys().next().value
    if (firstKey) planeCache.delete(firstKey)
  }
  
  return planes
}

// ============================================
// Spring Physics
// ============================================

class SpringValue {
  current = 0
  target = 0
  velocity = 0
  
  constructor(initial = 0) {
    this.current = initial
    this.target = initial
  }
  
  update(stiffness: number, damping: number) {
    const force = (this.target - this.current) * stiffness
    this.velocity += force
    this.velocity *= damping
    this.current += this.velocity
    
    if (Math.abs(this.target - this.current) < 0.001 && Math.abs(this.velocity) < 0.001) {
      this.current = this.target
      this.velocity = 0
    }
  }
  
  addImpulse(amount: number) {
    this.target += amount
  }
}

// ============================================
// Shared Geometry (memory optimization)
// ============================================

const sharedGeometry = new THREE.PlaneGeometry(1, 1)

// ============================================
// Instanced Placeholder Mesh
// ============================================

interface InstancedPlaceholdersProps {
  planes: PlaneData[]
  cameraPosition: React.MutableRefObject<THREE.Vector3>
}

function InstancedPlaceholders({ planes, cameraPosition }: InstancedPlaceholdersProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const tempMatrix = useMemo(() => new THREE.Matrix4(), [])
  const tempVec = useMemo(() => new THREE.Vector3(), [])
  
  // Set up instances
  useEffect(() => {
    if (!meshRef.current) return
    
    planes.forEach((plane, i) => {
      tempMatrix.makeTranslation(plane.position.x, plane.position.y, plane.position.z)
      tempMatrix.scale(tempVec.set(plane.size, plane.size, 1))
      meshRef.current!.setMatrixAt(i, tempMatrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [planes, tempMatrix, tempVec])
  
  // Update opacity based on distance
  useFrame(() => {
    if (!meshRef.current) return
    
    // For instanced mesh, we can't easily set per-instance opacity
    // So we just set visibility based on average distance
    const avgDist = planes.reduce((sum, p) => 
      sum + p.position.distanceTo(cameraPosition.current), 0
    ) / planes.length
    
    meshRef.current.visible = avgDist < FADE_END
  })

  if (planes.length === 0) return null

  return (
    <instancedMesh 
      ref={meshRef} 
      args={[sharedGeometry, undefined, planes.length]}
      frustumCulled
    >
      <meshBasicMaterial 
        color="#1a1a2e" 
        transparent 
        opacity={0.3}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  )
}

// ============================================
// Image Plane with Loading State
// ============================================

interface ImagePlaneProps {
  position: THREE.Vector3
  size: number
  url: string
  cameraPosition: React.MutableRefObject<THREE.Vector3>
  isMobile: boolean
}

function ImagePlaneInner({ position, size, url, cameraPosition, isMobile }: ImagePlaneProps) {
  const texture = useTexture(url)
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshBasicMaterial>(null)
  const [hovered, setHovered] = useState(false)
  const loadProgress = useRef(0)
  
  // Dispose texture on unmount
  useEffect(() => {
    return () => {
      if (texture) {
        texture.dispose()
      }
    }
  }, [texture])
  
  useFrame((_, delta) => {
    if (!meshRef.current || !materialRef.current) return
    
    const dist = position.distanceTo(cameraPosition.current)
    
    // Skip updates for far away planes
    if (dist > FADE_END + 5) {
      meshRef.current.visible = false
      return
    }
    
    // Distance fade
    let targetOpacity = 1
    if (dist > FADE_START) {
      targetOpacity = 1 - (dist - FADE_START) / (FADE_END - FADE_START)
      targetOpacity = Math.max(0, Math.min(1, targetOpacity))
    }
    
    // Loading fade-in
    if (loadProgress.current < 1) {
      loadProgress.current = Math.min(1, loadProgress.current + delta * 4)
    }
    
    materialRef.current.opacity = targetOpacity * loadProgress.current
    meshRef.current.visible = targetOpacity > 0.01
    
    // Billboard
    meshRef.current.lookAt(cameraPosition.current)
    
    // Hover scale (desktop only)
    if (!isMobile) {
      const targetScale = hovered ? 1.1 : 1
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale * size, targetScale * size, 1),
        0.1
      )
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={[size, size, 1]}
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
      <planeGeometry args={[1, 1]} />
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

// Placeholder for loading state
function PlaceholderPlane({ position, size }: { position: THREE.Vector3; size: number }) {
  return (
    <mesh position={position} scale={[size, size, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color="#1a1a2e" transparent opacity={0.3} side={THREE.DoubleSide} />
    </mesh>
  )
}

function ImagePlane(props: ImagePlaneProps) {
  return (
    <Suspense fallback={<PlaceholderPlane position={props.position} size={props.size} />}>
      <ImagePlaneInner {...props} />
    </Suspense>
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
  const [loaded, setLoaded] = useState(false)
  
  useEffect(() => {
    let canceled = false
    
    const generate = () => {
      if (!canceled) {
        setPlanes(generateChunkPlanes(cx, cy, cz))
        // Delay loaded state to stagger image loading
        setTimeout(() => {
          if (!canceled) setLoaded(true)
        }, 50)
      }
    }
    
    if (typeof requestIdleCallback !== 'undefined') {
      const id = requestIdleCallback(generate, { timeout: 100 })
      return () => { canceled = true; cancelIdleCallback(id) }
    } else {
      const id = setTimeout(generate, 0)
      return () => { canceled = true; clearTimeout(id) }
    }
  }, [cx, cy, cz])

  return (
    <group>
      {/* Show instanced placeholders while loading */}
      {!loaded && planes.length > 0 && (
        <InstancedPlaceholders planes={planes} cameraPosition={cameraPosition} />
      )}
      
      {/* Actual image planes */}
      {loaded && planes.map((plane) => (
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
  
  const cameraPos = useRef(new THREE.Vector3(0, 0, 0))
  const velocity = useRef(new THREE.Vector3(0, 0, 0))
  const zSpring = useRef(new SpringValue(0))
  
  const isDragging = useRef(false)
  const lastPointer = useRef({ x: 0, y: 0 })
  
  // Pinch state
  const lastPinchDist = useRef(0)
  const isPinching = useRef(false)
  
  const [currentChunk, setCurrentChunk] = useState({ cx: 0, cy: 0, cz: 0 })
  
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
  
  // ============================================
  // Event Handlers
  // ============================================

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
    if ('touches' in e && e.touches.length >= 2) return
    
    isDragging.current = true
    lastPointer.current = getPointerPos(e)
    velocity.current.set(0, 0, 0)
    if (!isMobile) document.body.style.cursor = 'grabbing'
  }, [getPointerPos, isMobile])

  const handlePointerMove = useCallback((e: PointerEvent | TouchEvent) => {
    if (!isDragging.current || isPinching.current) return
    
    const pos = getPointerPos(e)
    const deltaX = (pos.x - lastPointer.current.x) * DRAG_SENSITIVITY
    const deltaY = (pos.y - lastPointer.current.y) * -DRAG_SENSITIVITY
    
    const mult = isMobile ? 0.5 : 0.7
    velocity.current.x = -deltaX * mult
    velocity.current.y = -deltaY * mult
    
    cameraPos.current.x -= deltaX
    cameraPos.current.y -= deltaY
    
    lastPointer.current = pos
  }, [getPointerPos, isMobile])

  const handlePointerUp = useCallback(() => {
    isDragging.current = false
    if (!isMobile) document.body.style.cursor = 'grab'
  }, [isMobile])

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY * Z_SCROLL_SPEED * 0.01
    zSpring.current.addImpulse(delta)
  }, [])

  // Pinch handlers - FASTER
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      isPinching.current = true
      isDragging.current = false
      
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      lastPinchDist.current = Math.sqrt(dx * dx + dy * dy)
    } else if (e.touches.length === 1) {
      handlePointerDown(e)
    }
  }, [handlePointerDown])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2 && isPinching.current) {
      e.preventDefault() // Prevent zoom
      
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      const distDelta = lastPinchDist.current - dist
      
      // Only process if past deadzone
      if (Math.abs(distDelta) > PINCH_DEADZONE) {
        // Calculate impulse with minimum
        let zDelta = distDelta * PINCH_SENSITIVITY
        
        // Ensure minimum impulse for snappy feel
        if (Math.abs(zDelta) < PINCH_MIN_IMPULSE) {
          zDelta = Math.sign(zDelta) * PINCH_MIN_IMPULSE
        }
        
        zSpring.current.addImpulse(zDelta)
        lastPinchDist.current = dist
      }
    } else if (e.touches.length === 1 && !isPinching.current) {
      handlePointerMove(e)
    }
  }, [handlePointerMove])

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (e.touches.length < 2) {
      isPinching.current = false
      lastPinchDist.current = 0
    }
    if (e.touches.length === 0) {
      handlePointerUp()
    }
  }, [handlePointerUp])

  // Attach events
  useEffect(() => {
    const canvas = gl.domElement
    
    canvas.addEventListener('pointerdown', handlePointerDown as EventListener)
    window.addEventListener('pointermove', handlePointerMove as EventListener)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointerleave', handlePointerUp)
    
    canvas.addEventListener('wheel', handleWheel, { passive: false })
    
    canvas.addEventListener('touchstart', handleTouchStart as EventListener, { passive: true })
    window.addEventListener('touchmove', handleTouchMove as EventListener, { passive: false })
    window.addEventListener('touchend', handleTouchEnd as EventListener)
    window.addEventListener('touchcancel', handleTouchEnd as EventListener)
    
    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown as EventListener)
      window.removeEventListener('pointermove', handlePointerMove as EventListener)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointerleave', handlePointerUp)
      canvas.removeEventListener('wheel', handleWheel)
      canvas.removeEventListener('touchstart', handleTouchStart as EventListener)
      window.removeEventListener('touchmove', handleTouchMove as EventListener)
      window.removeEventListener('touchend', handleTouchEnd as EventListener)
      window.removeEventListener('touchcancel', handleTouchEnd as EventListener)
    }
  }, [gl, handlePointerDown, handlePointerMove, handlePointerUp, handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd])

  // Animation loop
  useFrame(() => {
    // X/Y momentum
    if (!isDragging.current && !isPinching.current) {
      const friction = isMobile ? MOMENTUM_FRICTION_MOBILE : MOMENTUM_FRICTION
      velocity.current.x *= friction
      velocity.current.y *= friction
      cameraPos.current.x += velocity.current.x
      cameraPos.current.y += velocity.current.y
    }
    
    // Z spring
    zSpring.current.update(Z_SPRING_STIFFNESS, Z_SPRING_DAMPING)
    cameraPos.current.z = zSpring.current.current
    
    // Update camera
    camera.position.copy(cameraPos.current)
    camera.position.z += 30
    
    // Check chunk change
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
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, isMobile ? 1.5 : 2]}
        style={{ touchAction: 'none' }}
        performance={{ min: 0.5 }}
      >
        <color attach="background" args={[backgroundColor]} />
        <fog attach="fog" args={[backgroundColor, FADE_START, FADE_END]} />
        <InfiniteGrid3D images={images} isMobile={isMobile} />
        
        {/* Post-processing: Bloom gives images a soft glow */}
        {!isMobile && (
          <EffectComposer>
            <Bloom 
              intensity={0.4}           // Strength of the glow
              luminanceThreshold={0.6}  // Only bright areas bloom
              luminanceSmoothing={0.9}  // Smooth transition
              mipmapBlur                // Better quality blur
            />
          </EffectComposer>
        )}
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
      
      {/* Branding */}
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
