import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { ResponsiveShader, useShaderContext } from '../../components/ResponsiveShader'
import * as THREE from 'three'

// Image distortion shader with multiple modes
const distortionFragmentShader = `
precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform vec2 uMouse;
uniform sampler2D uTexture;
uniform float uHover;
uniform float uScrollProgress;
uniform int uDistortionMode; // 0: ripple, 1: wave, 2: twist, 3: bulge, 4: noise
uniform float uIntensity;

// Noise for organic distortion
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

// Ripple distortion
vec2 rippleDistort(vec2 uv, vec2 center, float time, float intensity) {
  vec2 toCenter = uv - center;
  float dist = length(toCenter);
  float ripple = sin(dist * 30.0 - time * 5.0) * intensity;
  ripple *= exp(-dist * 3.0);
  return uv + normalize(toCenter + 0.001) * ripple * 0.1;
}

// Wave distortion
vec2 waveDistort(vec2 uv, float time, float scroll, float intensity) {
  float waveX = sin(uv.y * 10.0 + time * 2.0 + scroll * 10.0) * intensity * 0.05;
  float waveY = sin(uv.x * 10.0 + time * 1.5) * intensity * 0.03;
  return vec2(uv.x + waveX, uv.y + waveY);
}

// Twist distortion
vec2 twistDistort(vec2 uv, vec2 center, float intensity) {
  vec2 toCenter = uv - center;
  float dist = length(toCenter);
  float angle = atan(toCenter.y, toCenter.x);
  float twist = intensity * exp(-dist * 3.0) * 2.0;
  angle += twist;
  return center + vec2(cos(angle), sin(angle)) * dist;
}

// Bulge distortion
vec2 bulgeDistort(vec2 uv, vec2 center, float intensity) {
  vec2 toCenter = uv - center;
  float dist = length(toCenter);
  float bulge = 1.0 + intensity * exp(-dist * 5.0) * 0.5;
  return center + toCenter * bulge;
}

// Noise distortion
vec2 noiseDistort(vec2 uv, float time, float intensity) {
  float n1 = noise(uv * 5.0 + time * 0.5);
  float n2 = noise(uv * 5.0 + time * 0.5 + 100.0);
  return uv + vec2(n1, n2) * intensity * 0.1;
}

void main() {
  vec2 uv = vUv;
  float time = uTime;
  vec2 mouse = uMouse;
  float intensity = uIntensity * uHover;
  
  // Apply distortion based on mode
  vec2 distortedUv = uv;
  
  if (uDistortionMode == 0) {
    distortedUv = rippleDistort(uv, mouse, time, intensity);
  } else if (uDistortionMode == 1) {
    distortedUv = waveDistort(uv, time, uScrollProgress, uIntensity * (0.3 + uHover * 0.7));
  } else if (uDistortionMode == 2) {
    distortedUv = twistDistort(uv, mouse, intensity);
  } else if (uDistortionMode == 3) {
    distortedUv = bulgeDistort(uv, mouse, intensity);
  } else {
    distortedUv = noiseDistort(uv, time, intensity);
  }
  
  // Add subtle chromatic aberration on hover
  float chromaOffset = uHover * uIntensity * 0.01;
  vec4 colorR = texture2D(uTexture, distortedUv + vec2(chromaOffset, 0.0));
  vec4 colorG = texture2D(uTexture, distortedUv);
  vec4 colorB = texture2D(uTexture, distortedUv - vec2(chromaOffset, 0.0));
  
  vec4 color = vec4(colorR.r, colorG.g, colorB.b, colorG.a);
  
  gl_FragColor = color;
}
`

// Fallback shader when no image provided
const placeholderFragmentShader = `
precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform vec2 uMouse;
uniform float uHover;
uniform int uDistortionMode;
uniform float uIntensity;

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
  vec2 uv = vUv;
  float time = uTime;
  
  // Create a procedural pattern
  float n = noise(uv * 5.0 + time * 0.2);
  
  // Distort based on mouse
  float dist = length(uv - uMouse);
  float ripple = sin(dist * 20.0 - time * 3.0) * 0.5 + 0.5;
  ripple *= exp(-dist * 3.0) * uHover;
  
  // Colors
  vec3 color1 = vec3(0.4, 0.3, 0.9);
  vec3 color2 = vec3(0.9, 0.3, 0.6);
  
  vec3 color = mix(color1, color2, n + ripple * 0.3);
  
  gl_FragColor = vec4(color, 1.0);
}
`

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`

type DistortionMode = 'ripple' | 'wave' | 'twist' | 'bulge' | 'noise'

const modeMap: Record<DistortionMode, number> = {
  ripple: 0,
  wave: 1,
  twist: 2,
  bulge: 3,
  noise: 4,
}

interface DistortionMeshProps {
  textureUrl?: string
  mode: DistortionMode
  intensity: number
}

function DistortionMeshWithTexture({ textureUrl, mode, intensity }: Required<DistortionMeshProps>) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { mouse, scroll, isHovered } = useShaderContext()
  const texture = useTexture(textureUrl)
  const hoverRef = useRef(0)

  const uniforms = useRef({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uTexture: { value: texture },
    uHover: { value: 0 },
    uScrollProgress: { value: 0 },
    uDistortionMode: { value: modeMap[mode] },
    uIntensity: { value: intensity },
  })

  useFrame(({ clock }) => {
    uniforms.current.uTime.value = clock.getElapsedTime()
    uniforms.current.uMouse.value.lerp(mouse, 0.1)
    uniforms.current.uScrollProgress.value = scroll
    hoverRef.current += (isHovered ? 1 : 0 - hoverRef.current) * 0.08
    uniforms.current.uHover.value = hoverRef.current
  })

  useEffect(() => {
    uniforms.current.uDistortionMode.value = modeMap[mode]
  }, [mode])

  useEffect(() => {
    uniforms.current.uTexture.value = texture
  }, [texture])

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={distortionFragmentShader}
        uniforms={uniforms.current}
      />
    </mesh>
  )
}

function DistortionMeshPlaceholder({ mode, intensity }: Omit<DistortionMeshProps, 'textureUrl'>) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { mouse, isHovered } = useShaderContext()
  const hoverRef = useRef(0)

  const uniforms = useRef({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uHover: { value: 0 },
    uDistortionMode: { value: modeMap[mode] },
    uIntensity: { value: intensity },
  })

  useFrame(({ clock }) => {
    uniforms.current.uTime.value = clock.getElapsedTime()
    uniforms.current.uMouse.value.lerp(mouse, 0.1)
    hoverRef.current += (isHovered ? 1 : 0 - hoverRef.current) * 0.08
    uniforms.current.uHover.value = hoverRef.current
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={placeholderFragmentShader}
        uniforms={uniforms.current}
      />
    </mesh>
  )
}

interface ShaderDistortionProps {
  src?: string
  alt?: string
  mode?: DistortionMode
  intensity?: number
  className?: string
  style?: React.CSSProperties
}

export function ShaderDistortion({
  src,
  alt = 'Distorted image',
  mode = 'ripple',
  intensity = 1,
  className = '',
  style,
}: ShaderDistortionProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '300px',
        overflow: 'hidden',
        borderRadius: '8px',
        ...style,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="img"
      aria-label={alt}
    >
      <ResponsiveShader
        trackMouse
        mobileInteraction="touch"
        pauseWhenHidden
        frameloop={isHovered ? 'always' : 'demand'}
      >
        {src ? (
          <DistortionMeshWithTexture textureUrl={src} mode={mode} intensity={intensity} />
        ) : (
          <DistortionMeshPlaceholder mode={mode} intensity={intensity} />
        )}
      </ResponsiveShader>
    </div>
  )
}

// Gallery of distortion effects
interface DistortionGalleryProps {
  images: Array<{
    src: string
    alt?: string
    mode?: DistortionMode
  }>
  columns?: number
  gap?: string
  className?: string
}

export function DistortionGallery({
  images,
  columns = 3,
  gap = '1rem',
  className = '',
}: DistortionGalleryProps) {
  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap,
      }}
    >
      {images.map((image, index) => (
        <ShaderDistortion
          key={index}
          src={image.src}
          alt={image.alt}
          mode={image.mode || 'ripple'}
          style={{ aspectRatio: '1' }}
        />
      ))}
    </div>
  )
}

export default ShaderDistortion
