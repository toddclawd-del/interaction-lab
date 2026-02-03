import { useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Media } from './Media'

gsap.registerPlugin(ScrollTrigger)

interface WebGLCanvasProps {
  images: HTMLImageElement[]
  lenis: Lenis | null
  gridSize?: number
}

function Scene({ images, gridSize }: { images: HTMLImageElement[], gridSize: number }) {
  return (
    <>
      {images.map((img, i) => (
        <Media 
          key={img.src + i} 
          element={img} 
          gridSize={gridSize}
        />
      ))}
    </>
  )
}

function CameraSetup() {
  const { camera, viewport } = useThree()
  
  useEffect(() => {
    // Position camera so that viewport matches screen pixels
    const fov = 75
    const fovRad = (fov * Math.PI) / 180
    const z = viewport.height / (2 * Math.tan(fovRad / 2))
    camera.position.z = z
    camera.updateProjectionMatrix()
  }, [camera, viewport])
  
  return null
}

export function WebGLCanvas({ images, lenis, gridSize = 20 }: WebGLCanvasProps) {
  // Sync Lenis with GSAP ScrollTrigger
  useEffect(() => {
    if (!lenis) return
    
    lenis.on('scroll', ScrollTrigger.update)
    
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    
    gsap.ticker.lagSmoothing(0)
    
    return () => {
      lenis.off('scroll', ScrollTrigger.update)
    }
  }, [lenis])
  
  return (
    <Canvas
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10,
      }}
      camera={{ fov: 75, near: 0.1, far: 1000 }}
      gl={{ alpha: true, antialias: true }}
    >
      <CameraSetup />
      <Scene images={images} gridSize={gridSize} />
    </Canvas>
  )
}
