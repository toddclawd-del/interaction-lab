import { useRef, useState, useCallback, useEffect, createContext, useContext, ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import { ResponsiveShader } from '../../components/ResponsiveShader'
import * as THREE from 'three'

// Transition shader types
const transitionShaders = {
  // Noise dissolve transition
  dissolve: `
    precision highp float;
    varying vec2 vUv;
    uniform float uProgress;
    uniform float uTime;
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
    
    float fbm(vec2 p) {
      float f = 0.0;
      float amp = 0.5;
      for (int i = 0; i < 4; i++) {
        f += amp * noise(p);
        p *= 2.0;
        amp *= 0.5;
      }
      return f;
    }
    
    void main() {
      vec2 uv = vUv;
      float n = fbm(uv * 8.0 + uTime * 0.5);
      float threshold = uProgress * 1.2 - 0.1;
      float alpha = smoothstep(threshold - 0.1, threshold + 0.1, n);
      
      // Edge glow
      float edge = smoothstep(threshold - 0.15, threshold, n) - smoothstep(threshold, threshold + 0.15, n);
      vec3 color = uColor + vec3(1.0) * edge * 2.0;
      
      gl_FragColor = vec4(color, alpha);
    }
  `,
  
  // Wipe transition
  wipe: `
    precision highp float;
    varying vec2 vUv;
    uniform float uProgress;
    uniform float uDirection; // 0: left, 1: right, 2: up, 3: down
    uniform vec3 uColor;
    
    void main() {
      vec2 uv = vUv;
      float p = uProgress;
      float alpha = 0.0;
      
      int dir = int(uDirection);
      if (dir == 0) alpha = step(uv.x, p);
      else if (dir == 1) alpha = step(1.0 - uv.x, p);
      else if (dir == 2) alpha = step(1.0 - uv.y, p);
      else alpha = step(uv.y, p);
      
      // Soft edge
      float edgeWidth = 0.02;
      float edge = 0.0;
      if (dir == 0) edge = smoothstep(p - edgeWidth, p, uv.x) - smoothstep(p, p + edgeWidth, uv.x);
      else if (dir == 1) edge = smoothstep(p - edgeWidth, p, 1.0 - uv.x) - smoothstep(p, p + edgeWidth, 1.0 - uv.x);
      else if (dir == 2) edge = smoothstep(p - edgeWidth, p, 1.0 - uv.y) - smoothstep(p, p + edgeWidth, 1.0 - uv.y);
      else edge = smoothstep(p - edgeWidth, p, uv.y) - smoothstep(p, p + edgeWidth, uv.y);
      
      vec3 color = uColor + vec3(1.0) * edge;
      gl_FragColor = vec4(color, alpha);
    }
  `,
  
  // Circle expand/contract
  circle: `
    precision highp float;
    varying vec2 vUv;
    uniform float uProgress;
    uniform vec2 uCenter;
    uniform vec3 uColor;
    
    void main() {
      vec2 uv = vUv;
      float dist = length(uv - uCenter);
      float maxDist = length(vec2(1.0, 1.0) - uCenter);
      float threshold = uProgress * maxDist * 1.5;
      
      float alpha = smoothstep(threshold + 0.02, threshold - 0.02, dist);
      
      // Edge glow
      float edge = smoothstep(threshold + 0.05, threshold, dist) - smoothstep(threshold, threshold - 0.05, dist);
      vec3 color = uColor + vec3(1.0) * edge;
      
      gl_FragColor = vec4(color, alpha);
    }
  `,
  
  // Pixelate transition
  pixelate: `
    precision highp float;
    varying vec2 vUv;
    uniform float uProgress;
    uniform vec3 uColor;
    
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }
    
    void main() {
      vec2 uv = vUv;
      
      // Pixel size changes with progress
      float pixelSize = mix(0.001, 0.1, uProgress);
      vec2 pixelUv = floor(uv / pixelSize) * pixelSize;
      
      // Random threshold per pixel
      float threshold = hash(pixelUv * 100.0);
      float alpha = step(threshold, uProgress * 1.5);
      
      gl_FragColor = vec4(uColor, alpha);
    }
  `,
  
  // Radial blur
  radial: `
    precision highp float;
    varying vec2 vUv;
    uniform float uProgress;
    uniform vec2 uCenter;
    uniform vec3 uColor;
    
    void main() {
      vec2 uv = vUv;
      vec2 toCenter = uv - uCenter;
      float angle = atan(toCenter.y, toCenter.x);
      float dist = length(toCenter);
      
      // Swirl effect
      float swirl = angle / 6.283 + 0.5;
      swirl = fract(swirl + uProgress * 2.0);
      
      float threshold = uProgress * 1.5;
      float alpha = smoothstep(threshold - 0.1, threshold + 0.1, swirl * dist * 2.0);
      
      vec3 color = uColor;
      gl_FragColor = vec4(color, alpha);
    }
  `,
  
  // Blinds/slats
  blinds: `
    precision highp float;
    varying vec2 vUv;
    uniform float uProgress;
    uniform float uSlats;
    uniform int uHorizontal;
    uniform vec3 uColor;
    
    void main() {
      vec2 uv = vUv;
      float coord = uHorizontal == 1 ? uv.y : uv.x;
      float slat = fract(coord * uSlats);
      float alpha = step(slat, uProgress);
      
      // Edge glow
      float edge = smoothstep(uProgress - 0.05, uProgress, slat) - smoothstep(uProgress, uProgress + 0.05, slat);
      vec3 color = uColor + vec3(1.0) * edge;
      
      gl_FragColor = vec4(color, alpha);
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

type TransitionType = keyof typeof transitionShaders

interface TransitionMeshProps {
  type: TransitionType
  progress: number
  color: string
  direction?: number
  center?: [number, number]
  slats?: number
  horizontal?: boolean
}

function TransitionMesh({
  type,
  progress,
  color,
  direction = 0,
  center = [0.5, 0.5],
  slats = 10,
  horizontal = false,
}: TransitionMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const progressRef = useRef(0)

  const uniforms = useRef({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uColor: { value: new THREE.Color(color) },
    uDirection: { value: direction },
    uCenter: { value: new THREE.Vector2(center[0], center[1]) },
    uSlats: { value: slats },
    uHorizontal: { value: horizontal ? 1 : 0 },
  })

  useFrame(({ clock }) => {
    uniforms.current.uTime.value = clock.getElapsedTime()
    // Smooth progress interpolation
    progressRef.current += (progress - progressRef.current) * 0.1
    uniforms.current.uProgress.value = progressRef.current
  })

  useEffect(() => {
    uniforms.current.uColor.value.set(color)
  }, [color])

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={transitionShaders[type]}
        uniforms={uniforms.current}
        transparent
      />
    </mesh>
  )
}

// Transition context for coordinating page transitions
interface TransitionContextType {
  isTransitioning: boolean
  progress: number
  startTransition: (onComplete?: () => void) => void
  type: TransitionType
  setType: (type: TransitionType) => void
}

const TransitionContext = createContext<TransitionContextType | null>(null)

export function usePageTransition() {
  const context = useContext(TransitionContext)
  if (!context) {
    throw new Error('usePageTransition must be used within ShaderTransitionProvider')
  }
  return context
}

interface ShaderTransitionProviderProps {
  children: ReactNode
  type?: TransitionType
  color?: string
  duration?: number
  direction?: number
  center?: [number, number]
  slats?: number
  horizontal?: boolean
}

export function ShaderTransitionProvider({
  children,
  type: initialType = 'dissolve',
  color = '#000000',
  duration = 1000,
  direction = 0,
  center = [0.5, 0.5],
  slats = 10,
  horizontal = false,
}: ShaderTransitionProviderProps) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [type, setType] = useState<TransitionType>(initialType)
  const onCompleteRef = useRef<(() => void) | undefined>()

  const startTransition = useCallback((onComplete?: () => void) => {
    onCompleteRef.current = onComplete
    setIsTransitioning(true)
    setProgress(0)

    // Animate progress
    const startTime = Date.now()
    const halfDuration = duration / 2

    const animate = () => {
      const elapsed = Date.now() - startTime
      
      if (elapsed < halfDuration) {
        // First half: progress 0 -> 1
        setProgress(elapsed / halfDuration)
        requestAnimationFrame(animate)
      } else if (elapsed < duration) {
        // Trigger callback at midpoint
        if (elapsed >= halfDuration && onCompleteRef.current) {
          onCompleteRef.current()
          onCompleteRef.current = undefined
        }
        // Second half: progress 1 -> 0
        setProgress(1 - (elapsed - halfDuration) / halfDuration)
        requestAnimationFrame(animate)
      } else {
        setProgress(0)
        setIsTransitioning(false)
      }
    }

    requestAnimationFrame(animate)
  }, [duration])

  return (
    <TransitionContext.Provider value={{ isTransitioning, progress, startTransition, type, setType }}>
      {children}
      
      {/* Transition overlay */}
      {isTransitioning && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        >
          <ResponsiveShader frameloop="always">
            <TransitionMesh
              type={type}
              progress={progress}
              color={color}
              direction={direction}
              center={center}
              slats={slats}
              horizontal={horizontal}
            />
          </ResponsiveShader>
        </div>
      )}
    </TransitionContext.Provider>
  )
}

// Standalone transition component for demos
interface ShaderTransitionDemoProps {
  type?: TransitionType
  color?: string
  direction?: number
  center?: [number, number]
  slats?: number
  horizontal?: boolean
  className?: string
  style?: React.CSSProperties
}

export function ShaderTransitionDemo({
  type = 'dissolve',
  color = '#1a1a2e',
  direction = 0,
  center = [0.5, 0.5],
  slats = 10,
  horizontal = false,
  className = '',
  style,
}: ShaderTransitionDemoProps) {
  const [progress, setProgress] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const triggerTransition = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setProgress(0)

    const startTime = Date.now()
    const duration = 2000

    const animate = () => {
      const elapsed = Date.now() - startTime
      
      if (elapsed < duration / 2) {
        setProgress(elapsed / (duration / 2))
        requestAnimationFrame(animate)
      } else if (elapsed < duration) {
        setProgress(1 - (elapsed - duration / 2) / (duration / 2))
        requestAnimationFrame(animate)
      } else {
        setProgress(0)
        setIsAnimating(false)
      }
    }

    requestAnimationFrame(animate)
  }, [isAnimating])

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '400px',
        background: '#f0f0f0',
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'pointer',
        ...style,
      }}
      onClick={triggerTransition}
    >
      {/* Background content */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          color: '#666',
        }}
      >
        Click to trigger transition
      </div>

      {/* Transition overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
        }}
      >
        <ResponsiveShader frameloop={isAnimating ? 'always' : 'never'}>
          <TransitionMesh
            type={type}
            progress={progress}
            color={color}
            direction={direction}
            center={center}
            slats={slats}
            horizontal={horizontal}
          />
        </ResponsiveShader>
      </div>
    </div>
  )
}

// Transition selector demo
export function TransitionShowcase({ className = '' }: { className?: string }) {
  const [selectedType, setSelectedType] = useState<TransitionType>('dissolve')
  const types: TransitionType[] = ['dissolve', 'wipe', 'circle', 'pixelate', 'radial', 'blinds']

  return (
    <div className={className}>
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1rem',
          flexWrap: 'wrap',
        }}
      >
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: 'none',
              background: selectedType === type ? '#667eea' : '#e0e0e0',
              color: selectedType === type ? 'white' : 'black',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {type}
          </button>
        ))}
      </div>
      <ShaderTransitionDemo type={selectedType} />
    </div>
  )
}

export default ShaderTransitionProvider
