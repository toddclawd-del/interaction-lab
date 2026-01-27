import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { useRef, useState, useMemo, useCallback } from 'react'
import * as THREE from 'three'

// Sample images from Picsum (placeholder service)
const SAMPLE_IMAGES = Array.from({ length: 20 }, (_, i) => 
  `https://picsum.photos/seed/${i + 1}/400/400`
)

interface ImageTileProps {
  position: [number, number, number]
  url: string
  size: number
}

function ImageTile({ position, url, size }: ImageTileProps) {
  const texture = useTexture(url)
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  
  useFrame(() => {
    if (meshRef.current) {
      const targetScale = hovered ? 1.05 : 1
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
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  )
}

interface GridChunkProps {
  chunkX: number
  chunkY: number
  images: string[]
  gridSize: number
  imageSize: number
  gap: number
}

function GridChunk({ chunkX, chunkY, images, gridSize, imageSize, gap }: GridChunkProps) {
  const chunkSize = gridSize * (imageSize + gap)
  const tiles = useMemo(() => {
    const result = []
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const imageIndex = ((chunkX + chunkY + row + col) % images.length + images.length) % images.length
        const x = chunkX * chunkSize + col * (imageSize + gap)
        const y = chunkY * chunkSize + row * (imageSize + gap)
        result.push({
          key: `${chunkX}-${chunkY}-${row}-${col}`,
          position: [x, y, 0] as [number, number, number],
          url: images[imageIndex],
        })
      }
    }
    return result
  }, [chunkX, chunkY, images, gridSize, imageSize, gap, chunkSize])

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

interface InfiniteGridProps {
  images: string[]
  gridSize: number
  imageSize: number
  gap: number
}

function InfiniteGrid({ images, gridSize, imageSize, gap }: InfiniteGridProps) {
  const { camera, size } = useThree()
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const lastPointer = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  
  const chunkSize = gridSize * (imageSize + gap)
  
  // Calculate visible chunks based on camera position and viewport
  const visibleChunks = useMemo(() => {
    const chunks: { x: number; y: number }[] = []
    const viewportWidth = size.width / 100 // Approximate world units
    const viewportHeight = size.height / 100
    
    const centerX = -offset.x
    const centerY = -offset.y
    
    const chunksX = Math.ceil(viewportWidth / chunkSize) + 2
    const chunksY = Math.ceil(viewportHeight / chunkSize) + 2
    
    const startChunkX = Math.floor(centerX / chunkSize) - Math.floor(chunksX / 2)
    const startChunkY = Math.floor(centerY / chunkSize) - Math.floor(chunksY / 2)
    
    for (let x = startChunkX; x < startChunkX + chunksX; x++) {
      for (let y = startChunkY; y < startChunkY + chunksY; y++) {
        chunks.push({ x, y })
      }
    }
    
    return chunks
  }, [offset, size, chunkSize])

  const handlePointerDown = useCallback((e: THREE.Event) => {
    isDragging.current = true
    lastPointer.current = { x: e.clientX, y: e.clientY }
    velocity.current = { x: 0, y: 0 }
  }, [])

  const handlePointerMove = useCallback((e: THREE.Event) => {
    if (!isDragging.current) return
    
    const deltaX = (e.clientX - lastPointer.current.x) * 0.01
    const deltaY = (e.clientY - lastPointer.current.y) * -0.01
    
    velocity.current = { x: deltaX, y: deltaY }
    
    setOffset(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY,
    }))
    
    lastPointer.current = { x: e.clientX, y: e.clientY }
  }, [])

  const handlePointerUp = useCallback(() => {
    isDragging.current = false
  }, [])

  // Apply momentum after release
  useFrame(() => {
    if (!isDragging.current && (Math.abs(velocity.current.x) > 0.001 || Math.abs(velocity.current.y) > 0.001)) {
      setOffset(prev => ({
        x: prev.x + velocity.current.x,
        y: prev.y + velocity.current.y,
      }))
      velocity.current.x *= 0.95
      velocity.current.y *= 0.95
    }
  })

  return (
    <group
      position={[offset.x, offset.y, 0]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Invisible plane for capturing pointer events */}
      <mesh position={[0, 0, -1]}>
        <planeGeometry args={[1000, 1000]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {visibleChunks.map((chunk) => (
        <GridChunk
          key={`${chunk.x}-${chunk.y}`}
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

export interface InfiniteCanvasProps {
  images?: string[]
  gridSize?: number
  imageSize?: number
  gap?: number
}

export function InfiniteCanvas({
  images = SAMPLE_IMAGES,
  gridSize = 3,
  imageSize = 2,
  gap = 0.3,
}: InfiniteCanvasProps) {
  return (
    <div style={{ width: '100%', height: '100%', cursor: 'grab' }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#0a0a0a']} />
        <InfiniteGrid
          images={images}
          gridSize={gridSize}
          imageSize={imageSize}
          gap={gap}
        />
      </Canvas>
      
      {/* UI Overlay */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        color: 'white',
        fontFamily: 'system-ui, sans-serif',
        fontSize: 14,
        opacity: 0.6,
      }}>
        Drag to explore • Infinite Canvas
      </div>
    </div>
  )
}

export default InfiniteCanvas
