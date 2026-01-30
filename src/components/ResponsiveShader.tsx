import { useRef, useEffect, useState, createContext, useContext, ReactNode } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Shader context for passing mouse/scroll data to children
interface ShaderContextType {
  mouse: THREE.Vector2
  scroll: number
  isMobile: boolean
  isHovered: boolean
}

const ShaderContext = createContext<ShaderContextType>({
  mouse: new THREE.Vector2(0.5, 0.5),
  scroll: 0,
  isMobile: false,
  isHovered: false,
})

export const useShaderContext = () => useContext(ShaderContext)

// Hook to update shader uniforms with context values
export function useShaderUniforms(uniforms: Record<string, THREE.IUniform>) {
  const { mouse, scroll, isHovered } = useShaderContext()
  
  useFrame(({ clock }) => {
    if (uniforms.uTime) uniforms.uTime.value = clock.getElapsedTime()
    if (uniforms.uMouse) uniforms.uMouse.value.set(mouse.x, mouse.y)
    if (uniforms.uScrollProgress) uniforms.uScrollProgress.value = scroll
    if (uniforms.uHover) uniforms.uHover.value = isHovered ? 1 : 0
  })
}

// Resize handler component
function ResizeHandler() {
  const { gl, size } = useThree()
  
  useEffect(() => {
    gl.setSize(size.width, size.height)
  }, [gl, size])
  
  return null
}

interface ResponsiveShaderProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  // Mouse tracking
  trackMouse?: boolean
  // Mobile fallbacks
  mobileInteraction?: 'scroll' | 'touch' | 'tilt' | 'none'
  // Performance
  frameloop?: 'always' | 'demand' | 'never'
  dpr?: number | [number, number]
  // Visibility optimization
  pauseWhenHidden?: boolean
  // Events
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export function ResponsiveShader({
  children,
  className,
  style,
  trackMouse = true,
  mobileInteraction = 'touch',
  frameloop = 'always',
  dpr = [1, 2],
  pauseWhenHidden = true,
  onMouseEnter,
  onMouseLeave,
}: ResponsiveShaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mouse, setMouse] = useState(new THREE.Vector2(0.5, 0.5))
  const [scroll, setScroll] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  // Detect mobile
  useEffect(() => {
    setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  // Mouse tracking (desktop)
  useEffect(() => {
    if (!trackMouse || isMobile) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      setMouse(new THREE.Vector2(
        (e.clientX - rect.left) / rect.width,
        1 - (e.clientY - rect.top) / rect.height // Flip Y for WebGL
      ))
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [trackMouse, isMobile])

  // Mobile interactions
  useEffect(() => {
    if (!isMobile) return

    if (mobileInteraction === 'scroll') {
      const handleScroll = () => {
        const scrollY = window.scrollY / (document.body.scrollHeight - window.innerHeight)
        setScroll(scrollY)
        setMouse(new THREE.Vector2(0.5, scrollY))
      }
      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => window.removeEventListener('scroll', handleScroll)
    }

    if (mobileInteraction === 'touch') {
      const handleTouch = (e: TouchEvent) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const touch = e.touches[0]
        if (touch) {
          setMouse(new THREE.Vector2(
            (touch.clientX - rect.left) / rect.width,
            1 - (touch.clientY - rect.top) / rect.height
          ))
        }
      }
      window.addEventListener('touchmove', handleTouch, { passive: true })
      return () => window.removeEventListener('touchmove', handleTouch)
    }

    if (mobileInteraction === 'tilt') {
      const handleOrientation = (e: DeviceOrientationEvent) => {
        const x = ((e.gamma || 0) + 45) / 90
        const y = ((e.beta || 0) + 45) / 90
        setMouse(new THREE.Vector2(
          Math.max(0, Math.min(1, x)),
          Math.max(0, Math.min(1, y))
        ))
      }
      window.addEventListener('deviceorientation', handleOrientation)
      return () => window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [isMobile, mobileInteraction])

  // Scroll tracking (desktop)
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY / (document.body.scrollHeight - window.innerHeight)
      setScroll(Math.max(0, Math.min(1, scrollY)))
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Visibility optimization with IntersectionObserver
  useEffect(() => {
    if (!pauseWhenHidden || !containerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [pauseWhenHidden])

  const handleMouseEnter = () => {
    setIsHovered(true)
    onMouseEnter?.()
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    onMouseLeave?.()
  }

  const actualFrameloop = pauseWhenHidden && !isVisible ? 'never' : frameloop

  return (
    <ShaderContext.Provider value={{ mouse, scroll, isMobile, isHovered }}>
      <div
        ref={containerRef}
        className={className}
        style={{ width: '100%', height: '100%', ...style }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Canvas
          frameloop={actualFrameloop}
          dpr={isMobile ? Math.min(dpr as number, 1.5) : dpr}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          style={{ width: '100%', height: '100%' }}
        >
          <ResizeHandler />
          {children}
        </Canvas>
      </div>
    </ShaderContext.Provider>
  )
}

// Fullscreen shader plane component
interface ShaderPlaneProps {
  fragmentShader: string
  vertexShader?: string
  uniforms?: Record<string, THREE.IUniform>
}

const defaultVertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`

export function ShaderPlane({ fragmentShader, vertexShader, uniforms = {} }: ShaderPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()
  const { mouse, scroll, isHovered } = useShaderContext()

  // Create uniforms with defaults
  const shaderUniforms = useRef({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uResolution: { value: new THREE.Vector2(viewport.width, viewport.height) },
    uScrollProgress: { value: 0 },
    uHover: { value: 0 },
    ...uniforms,
  })

  // Update uniforms each frame
  useFrame(({ clock }) => {
    const u = shaderUniforms.current
    u.uTime.value = clock.getElapsedTime()
    u.uMouse.value.set(mouse.x, mouse.y)
    u.uScrollProgress.value = scroll
    u.uHover.value = isHovered ? 1 : 0
  })

  // Update resolution on viewport change
  useEffect(() => {
    shaderUniforms.current.uResolution.value.set(viewport.width, viewport.height)
  }, [viewport])

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader || defaultVertexShader}
        fragmentShader={fragmentShader}
        uniforms={shaderUniforms.current}
      />
    </mesh>
  )
}
