import { useRef, useState, useEffect, useCallback } from 'react'
import { useFrame, Canvas } from '@react-three/fiber'
import * as THREE from 'three'

// Shader variants for cursor
const cursorShaders = {
  ripple: `
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform float uSize;
    uniform vec3 uColor;
    
    void main() {
      vec2 uv = vUv - 0.5;
      float dist = length(uv) * 2.0;
      
      float ripple = sin(dist * 20.0 - uTime * 8.0) * 0.5 + 0.5;
      ripple *= 1.0 - smoothstep(0.0, 0.5, dist);
      
      float alpha = ripple * (1.0 - dist * 2.0);
      alpha = max(0.0, alpha);
      
      vec3 color = uColor * (0.5 + ripple * 0.5);
      gl_FragColor = vec4(color, alpha * 0.8);
    }
  `,
  glow: `
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform float uSize;
    uniform vec3 uColor;
    
    void main() {
      vec2 uv = vUv - 0.5;
      float dist = length(uv) * 2.0;
      
      float glow = 1.0 - smoothstep(0.0, 0.5, dist);
      glow = pow(glow, 1.5);
      
      // Pulsing
      float pulse = sin(uTime * 3.0) * 0.2 + 0.8;
      glow *= pulse;
      
      gl_FragColor = vec4(uColor, glow * 0.7);
    }
  `,
  vortex: `
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform float uSize;
    uniform vec3 uColor;
    
    void main() {
      vec2 uv = vUv - 0.5;
      float dist = length(uv) * 2.0;
      float angle = atan(uv.y, uv.x);
      
      // Spiral
      float spiral = sin(angle * 5.0 - dist * 10.0 + uTime * 5.0);
      spiral = spiral * 0.5 + 0.5;
      
      float alpha = spiral * (1.0 - smoothstep(0.0, 0.5, dist));
      
      vec3 color = uColor * (0.6 + spiral * 0.4);
      gl_FragColor = vec4(color, alpha * 0.6);
    }
  `,
  noise: `
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform float uSize;
    uniform vec3 uColor;
    
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }
    
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x),
                 mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
    }
    
    void main() {
      vec2 uv = vUv - 0.5;
      float dist = length(uv) * 2.0;
      
      float n = noise(uv * 10.0 + uTime * 2.0);
      float n2 = noise(uv * 20.0 - uTime * 3.0);
      
      float alpha = (n * 0.5 + n2 * 0.5) * (1.0 - smoothstep(0.0, 0.5, dist));
      
      vec3 color = uColor * (0.5 + n * 0.5);
      gl_FragColor = vec4(color, alpha * 0.7);
    }
  `,
  blob: `
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform float uSize;
    uniform vec3 uColor;
    
    void main() {
      vec2 uv = vUv - 0.5;
      float dist = length(uv) * 2.0;
      
      // Wobbly blob
      float angle = atan(uv.y, uv.x);
      float wobble = sin(angle * 3.0 + uTime * 4.0) * 0.1;
      wobble += sin(angle * 5.0 - uTime * 3.0) * 0.05;
      
      float radius = 0.4 + wobble;
      float blob = 1.0 - smoothstep(radius - 0.05, radius + 0.05, dist);
      
      // Inner gradient
      float inner = 1.0 - dist / radius;
      inner = max(0.0, inner);
      
      vec3 color = uColor * (0.7 + inner * 0.3);
      gl_FragColor = vec4(color, blob * 0.8);
    }
  `,
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

type CursorMode = keyof typeof cursorShaders

interface CursorMeshProps {
  mode: CursorMode
  color: string
}

function CursorMesh({ mode, color }: CursorMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  const uniforms = useRef({
    uTime: { value: 0 },
    uSize: { value: 1 },
    uColor: { value: new THREE.Color(color) },
  })

  useFrame(({ clock }) => {
    uniforms.current.uTime.value = clock.getElapsedTime()
  })

  useEffect(() => {
    uniforms.current.uColor.value.set(color)
  }, [color])

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={cursorShaders[mode]}
        uniforms={uniforms.current}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

interface ShaderCursorProps {
  mode?: CursorMode
  color?: string
  size?: number
  expandOnHover?: boolean
  expandedSize?: number
  hoverTargets?: string // CSS selector for elements that trigger expansion
  mobileEnabled?: boolean
  className?: string
}

export function ShaderCursor({
  mode = 'ripple',
  color = '#667eea',
  size = 40,
  expandOnHover = true,
  expandedSize = 80,
  hoverTargets = 'a, button, [data-cursor-expand]',
  mobileEnabled = true,
  className = '',
}: ShaderCursorProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [currentSize, setCurrentSize] = useState(size)
  const [visible, setVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const rippleIdRef = useRef(0)

  // Detect mobile
  useEffect(() => {
    setIsMobile('ontouchstart' in window)
  }, [])

  // Mouse tracking
  useEffect(() => {
    if (isMobile) return

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setVisible(true)
    }

    const handleMouseLeave = () => setVisible(false)
    const handleMouseEnter = () => setVisible(true)

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [isMobile])

  // Hover expansion
  useEffect(() => {
    if (!expandOnHover || isMobile) return

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as Element
      if (target.matches(hoverTargets)) {
        setCurrentSize(expandedSize)
      }
    }

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as Element
      if (target.matches(hoverTargets)) {
        setCurrentSize(size)
      }
    }

    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)

    return () => {
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
    }
  }, [expandOnHover, hoverTargets, size, expandedSize, isMobile])

  // Mobile touch ripples
  const handleTouch = useCallback((e: React.TouchEvent) => {
    if (!mobileEnabled || !isMobile) return

    const touch = e.touches[0] || e.changedTouches[0]
    if (!touch) return

    const newRipple = {
      id: rippleIdRef.current++,
      x: touch.clientX,
      y: touch.clientY,
    }

    setRipples((prev) => [...prev, newRipple])

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
    }, 1000)
  }, [mobileEnabled, isMobile])

  // Hide on mobile if not enabled
  if (isMobile && !mobileEnabled) return null

  return (
    <>
      {/* Desktop cursor */}
      {!isMobile && (
        <div
          className={`shader-cursor ${className}`}
          style={{
            position: 'fixed',
            left: position.x,
            top: position.y,
            width: currentSize,
            height: currentSize,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 9999,
            opacity: visible ? 1 : 0,
            transition: 'width 0.2s, height 0.2s, opacity 0.2s',
            mixBlendMode: 'screen',
          }}
        >
          <Canvas
            gl={{ antialias: true, alpha: true }}
            style={{ width: '100%', height: '100%' }}
          >
            <CursorMesh mode={mode} color={color} />
          </Canvas>
        </div>
      )}

      {/* Mobile touch ripples */}
      {isMobile && mobileEnabled && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 9999,
          }}
          onTouchStart={handleTouch}
        >
          {ripples.map((ripple) => (
            <div
              key={ripple.id}
              style={{
                position: 'absolute',
                left: ripple.x,
                top: ripple.y,
                width: expandedSize * 2,
                height: expandedSize * 2,
                transform: 'translate(-50%, -50%)',
                animation: 'rippleFade 1s ease-out forwards',
              }}
            >
              <Canvas
                gl={{ antialias: true, alpha: true }}
                style={{ width: '100%', height: '100%' }}
              >
                <CursorMesh mode="ripple" color={color} />
              </Canvas>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes rippleFade {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </>
  )
}

// Hook to control cursor mode from anywhere
export function useShaderCursor() {
  const [mode, setMode] = useState<CursorMode>('ripple')
  const [color, setColor] = useState('#667eea')

  return {
    mode,
    color,
    setMode,
    setColor,
    props: { mode, color },
  }
}

// Context-aware cursor wrapper
interface ShaderCursorProviderProps {
  children: React.ReactNode
  defaultMode?: CursorMode
  defaultColor?: string
  modeByElement?: Record<string, CursorMode>
  colorByElement?: Record<string, string>
}

export function ShaderCursorProvider({
  children,
  defaultMode = 'ripple',
  defaultColor = '#667eea',
  modeByElement = {},
  colorByElement = {},
}: ShaderCursorProviderProps) {
  const [mode, setMode] = useState(defaultMode)
  const [color, setColor] = useState(defaultColor)

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as Element

      // Check mode
      for (const [selector, m] of Object.entries(modeByElement)) {
        if (target.matches(selector)) {
          setMode(m)
          break
        }
      }

      // Check color
      for (const [selector, c] of Object.entries(colorByElement)) {
        if (target.matches(selector)) {
          setColor(c)
          break
        }
      }
    }

    const handleMouseOut = () => {
      setMode(defaultMode)
      setColor(defaultColor)
    }

    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)

    return () => {
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
    }
  }, [defaultMode, defaultColor, modeByElement, colorByElement])

  return (
    <>
      {children}
      <ShaderCursor mode={mode} color={color} />
    </>
  )
}

export default ShaderCursor
