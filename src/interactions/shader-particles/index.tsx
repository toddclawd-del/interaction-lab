import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import { ResponsiveShader, useShaderContext } from '../../components/ResponsiveShader'
import * as THREE from 'three'

// Custom particle shader material
class ParticleMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uMouseStrength: { value: 0.5 },
        uMouseRadius: { value: 0.2 },
        uAttractionMode: { value: 0 }, // 0: attract, 1: repel
        uColor1: { value: new THREE.Color('#667eea') },
        uColor2: { value: new THREE.Color('#764ba2') },
        uSize: { value: 2.0 },
        uSpeed: { value: 0.1 },
      },
      vertexShader: `
        attribute vec3 velocity;
        attribute float size;
        attribute float seed;
        
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uMouseStrength;
        uniform float uMouseRadius;
        uniform float uAttractionMode;
        uniform float uSize;
        uniform float uSpeed;
        
        varying float vAlpha;
        varying vec3 vColor;
        varying float vSeed;
        
        // Noise for organic movement
        float hash(float n) {
          return fract(sin(n) * 43758.5453);
        }
        
        void main() {
          vSeed = seed;
          
          // Current position
          vec3 pos = position;
          
          // Time-based movement
          float t = uTime * uSpeed;
          
          // Add organic noise movement
          pos.x += sin(t + seed * 10.0) * 0.05;
          pos.y += cos(t * 0.7 + seed * 7.0) * 0.05;
          pos.z += sin(t * 0.5 + seed * 5.0) * 0.02;
          
          // Mouse interaction
          vec2 toMouse = uMouse - pos.xy;
          float mouseDist = length(toMouse);
          float mouseInfluence = smoothstep(uMouseRadius, 0.0, mouseDist) * uMouseStrength;
          
          // Attract or repel based on mode
          vec2 mouseDir = normalize(toMouse + 0.001);
          if (uAttractionMode < 0.5) {
            // Attract
            pos.xy += mouseDir * mouseInfluence * 0.1;
          } else {
            // Repel
            pos.xy -= mouseDir * mouseInfluence * 0.15;
          }
          
          // Project to clip space
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          // Size attenuation
          gl_PointSize = size * uSize * (1.0 / -mvPosition.z) * 100.0;
          
          // Depth-based alpha
          vAlpha = smoothstep(-1.0, 0.0, pos.z);
          
          // Color variation
          vColor = vec3(hash(seed), hash(seed + 1.0), hash(seed + 2.0));
        }
      `,
      fragmentShader: `
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        
        varying float vAlpha;
        varying vec3 vColor;
        varying float vSeed;
        
        void main() {
          // Circular particle
          vec2 center = gl_PointCoord - 0.5;
          float dist = length(center);
          if (dist > 0.5) discard;
          
          // Soft edges
          float alpha = smoothstep(0.5, 0.2, dist) * vAlpha;
          
          // Mix colors based on seed
          vec3 color = mix(uColor1, uColor2, vSeed);
          
          // Add slight glow
          color += (1.0 - dist * 2.0) * 0.2;
          
          gl_FragColor = vec4(color, alpha * 0.8);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  }
}

extend({ ParticleMaterial })

// Type declaration for extend
declare module '@react-three/fiber' {
  interface ThreeElements {
    particleMaterial: any
  }
}

interface ParticleSystemProps {
  count: number
  colors: [string, string]
  size: number
  speed: number
  mouseStrength: number
  mouseRadius: number
  attractMode: boolean
}

function ParticleSystem({
  count,
  colors,
  size,
  speed,
  mouseStrength,
  mouseRadius,
  attractMode,
}: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const materialRef = useRef<ParticleMaterial>(null)
  const { mouse } = useShaderContext()

  // Generate particle data
  const { positions, velocities, sizes, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const seeds = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Position: spread across the view
      positions[i * 3] = (Math.random() - 0.5) * 2
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5

      // Velocity
      velocities[i * 3] = (Math.random() - 0.5) * 0.01
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.005

      // Size variation
      sizes[i] = 0.5 + Math.random() * 1.5

      // Unique seed for each particle
      seeds[i] = Math.random()
    }

    return { positions, velocities, sizes, seeds }
  }, [count])

  useFrame(({ clock }) => {
    if (!materialRef.current) return

    const uniforms = materialRef.current.uniforms
    uniforms.uTime.value = clock.getElapsedTime()
    uniforms.uMouse.value.set(mouse.x * 2 - 1, mouse.y * 2 - 1) // Convert to -1 to 1
    uniforms.uAttractionMode.value = attractMode ? 0 : 1
  })

  useEffect(() => {
    if (!materialRef.current) return
    materialRef.current.uniforms.uColor1.value.set(colors[0])
    materialRef.current.uniforms.uColor2.value.set(colors[1])
    materialRef.current.uniforms.uSize.value = size
    materialRef.current.uniforms.uSpeed.value = speed
    materialRef.current.uniforms.uMouseStrength.value = mouseStrength
    materialRef.current.uniforms.uMouseRadius.value = mouseRadius
  }, [colors, size, speed, mouseStrength, mouseRadius])

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-velocity"
          count={count}
          array={velocities}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-seed"
          count={count}
          array={seeds}
          itemSize={1}
        />
      </bufferGeometry>
      <particleMaterial ref={materialRef} />
    </points>
  )
}

interface ShaderParticlesProps {
  count?: number
  colors?: [string, string]
  size?: number
  speed?: number
  mouseStrength?: number
  mouseRadius?: number
  attractMode?: boolean
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

export function ShaderParticles({
  count = 1000,
  colors = ['#667eea', '#764ba2'],
  size = 2,
  speed = 0.1,
  mouseStrength = 1.0,
  mouseRadius = 0.5,
  attractMode = true,
  className = '',
  style,
  children,
}: ShaderParticlesProps) {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '400px',
        background: '#0a0a0f',
        ...style,
      }}
    >
      <div style={{ position: 'absolute', inset: 0 }}>
        <ResponsiveShader
          trackMouse
          mobileInteraction="touch"
          pauseWhenHidden
        >
          <ParticleSystem
            count={count}
            colors={colors}
            size={size}
            speed={speed}
            mouseStrength={mouseStrength}
            mouseRadius={mouseRadius}
            attractMode={attractMode}
          />
        </ResponsiveShader>
      </div>

      {children && (
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}

// Particle presets
export const particlePresets = {
  stars: {
    count: 2000,
    colors: ['#ffffff', '#aaaaff'] as [string, string],
    size: 1.5,
    speed: 0.02,
    mouseStrength: 0.2,
    mouseRadius: 0.4,
    attractMode: false,
  },
  fireflies: {
    count: 200,
    colors: ['#f7d794', '#f19066'] as [string, string],
    size: 4,
    speed: 0.15,
    mouseStrength: 0.8,
    mouseRadius: 0.3,
    attractMode: true,
  },
  snow: {
    count: 500,
    colors: ['#ffffff', '#e0e0e0'] as [string, string],
    size: 2,
    speed: 0.05,
    mouseStrength: 0.3,
    mouseRadius: 0.2,
    attractMode: false,
  },
  magic: {
    count: 800,
    colors: ['#f72585', '#4cc9f0'] as [string, string],
    size: 2.5,
    speed: 0.08,
    mouseStrength: 0.6,
    mouseRadius: 0.35,
    attractMode: true,
  },
  ocean: {
    count: 1500,
    colors: ['#00b4d8', '#90e0ef'] as [string, string],
    size: 2,
    speed: 0.03,
    mouseStrength: 0.4,
    mouseRadius: 0.4,
    attractMode: false,
  },
}

interface PresetParticlesProps {
  preset: keyof typeof particlePresets
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

export function PresetParticles({
  preset,
  className,
  style,
  children,
}: PresetParticlesProps) {
  const config = particlePresets[preset]
  return (
    <ShaderParticles {...config} className={className} style={style}>
      {children}
    </ShaderParticles>
  )
}

// Interactive particle demo with controls
export function ParticleDemo({ className = '' }: { className?: string }) {
  const presetNames = Object.keys(particlePresets) as Array<keyof typeof particlePresets>
  const [selectedPreset, setSelectedPreset] = useState<keyof typeof particlePresets>('magic')
  const [attractMode, setAttractMode] = useState(true)

  return (
    <div className={className}>
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        {presetNames.map((name) => (
          <button
            key={name}
            onClick={() => setSelectedPreset(name)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: 'none',
              background: selectedPreset === name ? '#667eea' : '#e0e0e0',
              color: selectedPreset === name ? 'white' : 'black',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {name}
          </button>
        ))}
        <button
          onClick={() => setAttractMode(!attractMode)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            border: 'none',
            background: attractMode ? '#10b981' : '#ef4444',
            color: 'white',
            cursor: 'pointer',
            marginLeft: '1rem',
          }}
        >
          {attractMode ? 'Attract' : 'Repel'}
        </button>
      </div>
      <ShaderParticles
        {...particlePresets[selectedPreset]}
        attractMode={attractMode}
        style={{ height: '500px', borderRadius: '8px' }}
      >
        <h2 style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
          Move your mouse
        </h2>
      </ShaderParticles>
    </div>
  )
}

export default ShaderParticles
