import { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { ResponsiveShader, useShaderContext } from '../../components/ResponsiveShader'
import * as THREE from 'three'

// Shader that reveals based on scroll progress with masking
const revealFragmentShader = `
precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform vec2 uMouse;
uniform float uRevealProgress;
uniform float uRevealDirection; // 0: left, 1: right, 2: top, 3: bottom, 4: center, 5: diagonal
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uNoiseAmount;

// Hash function
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
  float time = uTime * 0.5;
  
  // Calculate reveal mask based on direction
  float revealMask = 0.0;
  float progress = uRevealProgress;
  
  // Add noise to the reveal edge
  float noiseEdge = fbm(uv * 5.0 + time) * uNoiseAmount;
  
  int dir = int(uRevealDirection);
  if (dir == 0) { // Left to right
    revealMask = step(uv.x, progress + noiseEdge * 0.1);
  } else if (dir == 1) { // Right to left
    revealMask = step(1.0 - uv.x, progress + noiseEdge * 0.1);
  } else if (dir == 2) { // Top to bottom
    revealMask = step(1.0 - uv.y, progress + noiseEdge * 0.1);
  } else if (dir == 3) { // Bottom to top
    revealMask = step(uv.y, progress + noiseEdge * 0.1);
  } else if (dir == 4) { // Center radial
    float dist = length(uv - 0.5) * 1.414; // Normalize to 0-1
    revealMask = smoothstep(progress + 0.05, progress - 0.05, dist - noiseEdge * 0.1);
  } else { // Diagonal
    float diag = (uv.x + uv.y) * 0.5;
    revealMask = smoothstep(progress - 0.05, progress + 0.05, diag + noiseEdge * 0.1);
  }
  
  // Create the underlying shader pattern (domain warp)
  vec2 flowUv = uv;
  flowUv += (uMouse - 0.5) * 0.1 * progress;
  
  float warp1 = fbm(flowUv * 2.0 + time * 0.2);
  float warp2 = fbm(flowUv * 3.0 + vec2(5.2, 1.3) - time * 0.15);
  vec2 warpedUv = flowUv + vec2(warp1, warp2) * 0.4;
  
  float pattern = fbm(warpedUv * 2.0 + time * 0.1);
  
  // Color based on pattern
  vec3 shaderColor;
  if (pattern < 0.4) {
    shaderColor = mix(uColor1, uColor2, pattern * 2.5);
  } else {
    shaderColor = mix(uColor2, uColor3, (pattern - 0.4) * 1.67);
  }
  
  // Add intensity based on progress
  shaderColor *= 0.8 + progress * 0.4;
  
  // Edge glow at reveal boundary
  float edge = abs(revealMask - 0.5) * 2.0;
  edge = 1.0 - smoothstep(0.9, 1.0, edge);
  shaderColor += (uColor2 + uColor3) * 0.5 * edge * 0.5;
  
  // Output with alpha based on reveal
  gl_FragColor = vec4(shaderColor, revealMask);
}
`

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`

type RevealDirection = 'left' | 'right' | 'top' | 'bottom' | 'center' | 'diagonal'

const directionMap: Record<RevealDirection, number> = {
  left: 0,
  right: 1,
  top: 2,
  bottom: 3,
  center: 4,
  diagonal: 5,
}

interface RevealShaderMeshProps {
  progress: number
  direction: RevealDirection
  colors: [string, string, string]
  noiseAmount: number
}

function RevealShaderMesh({ progress, direction, colors, noiseAmount }: RevealShaderMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()
  const { mouse } = useShaderContext()

  const uniforms = useRef({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uRevealProgress: { value: 0 },
    uRevealDirection: { value: directionMap[direction] },
    uColor1: { value: new THREE.Color(colors[0]) },
    uColor2: { value: new THREE.Color(colors[1]) },
    uColor3: { value: new THREE.Color(colors[2]) },
    uNoiseAmount: { value: noiseAmount },
  })

  useFrame(({ clock }) => {
    uniforms.current.uTime.value = clock.getElapsedTime()
    uniforms.current.uMouse.value.lerp(mouse, 0.1)
    // Smooth progress interpolation
    uniforms.current.uRevealProgress.value += (progress - uniforms.current.uRevealProgress.value) * 0.1
  })

  useEffect(() => {
    uniforms.current.uRevealDirection.value = directionMap[direction]
  }, [direction])

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={revealFragmentShader}
        uniforms={uniforms.current}
        transparent
      />
    </mesh>
  )
}

interface ShaderRevealProps {
  children: React.ReactNode
  direction?: RevealDirection
  colors?: [string, string, string]
  noiseAmount?: number
  triggerOffset?: number // 0-1, when to start reveal (0 = top of viewport, 1 = bottom)
  revealRange?: number // How much scroll distance for full reveal
  className?: string
  style?: React.CSSProperties
}

export function ShaderReveal({
  children,
  direction = 'left',
  colors = ['#667eea', '#764ba2', '#f093fb'],
  noiseAmount = 0.5,
  triggerOffset = 0.3,
  revealRange = 0.5,
  className = '',
  style,
}: ShaderRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight

      // Calculate when element enters viewport
      const elementTop = rect.top
      const triggerPoint = viewportHeight * (1 - triggerOffset)
      const endPoint = viewportHeight * (1 - triggerOffset - revealRange)

      if (elementTop > triggerPoint) {
        setProgress(0)
      } else if (elementTop < endPoint) {
        setProgress(1)
      } else {
        const p = (triggerPoint - elementTop) / (triggerPoint - endPoint)
        setProgress(Math.max(0, Math.min(1, p)))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check
    return () => window.removeEventListener('scroll', handleScroll)
  }, [triggerOffset, revealRange])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '400px',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Original content (underneath) */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>

      {/* Shader overlay that reveals */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
        }}
      >
        <ResponsiveShader trackMouse mobileInteraction="scroll" pauseWhenHidden>
          <RevealShaderMesh
            progress={progress}
            direction={direction}
            colors={colors}
            noiseAmount={noiseAmount}
          />
        </ResponsiveShader>
      </div>
    </div>
  )
}

// Inverse reveal - shader is underneath, content reveals
interface ShaderRevealInverseProps extends ShaderRevealProps {
  shaderOpacity?: number
}

export function ShaderRevealInverse({
  children,
  direction = 'left',
  colors = ['#667eea', '#764ba2', '#f093fb'],
  noiseAmount = 0.5,
  triggerOffset = 0.3,
  revealRange = 0.5,
  shaderOpacity = 1,
  className = '',
  style,
}: ShaderRevealInverseProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const elementTop = rect.top
      const triggerPoint = viewportHeight * (1 - triggerOffset)
      const endPoint = viewportHeight * (1 - triggerOffset - revealRange)

      if (elementTop > triggerPoint) {
        setProgress(0)
      } else if (elementTop < endPoint) {
        setProgress(1)
      } else {
        const p = (triggerPoint - elementTop) / (triggerPoint - endPoint)
        setProgress(Math.max(0, Math.min(1, p)))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [triggerOffset, revealRange])

  // Calculate clip-path based on direction and progress
  const getClipPath = () => {
    const p = progress * 100
    switch (direction) {
      case 'left': return `inset(0 ${100 - p}% 0 0)`
      case 'right': return `inset(0 0 0 ${100 - p}%)`
      case 'top': return `inset(0 0 ${100 - p}% 0)`
      case 'bottom': return `inset(${100 - p}% 0 0 0)`
      case 'center': return `circle(${p}% at 50% 50%)`
      case 'diagonal': return `polygon(0 0, ${p * 2}% 0, 0 ${p * 2}%)`
      default: return 'none'
    }
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '400px',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Shader background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: shaderOpacity,
        }}
      >
        <ResponsiveShader trackMouse mobileInteraction="scroll" pauseWhenHidden>
          <RevealShaderMesh
            progress={1}
            direction={direction}
            colors={colors}
            noiseAmount={noiseAmount}
          />
        </ResponsiveShader>
      </div>

      {/* Content that reveals with clip-path */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          clipPath: getClipPath(),
          transition: 'clip-path 0.1s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default ShaderReveal
