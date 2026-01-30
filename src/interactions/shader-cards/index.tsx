import { useRef, useState, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { ResponsiveShader, useShaderContext } from '../../components/ResponsiveShader'
import * as THREE from 'three'

// Card shader variations
const shaderVariants = {
  liquid: `
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uHover;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    
    float smin(float a, float b, float k) {
      float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
      return mix(b, a, h) - k * h * (1.0 - h);
    }
    
    float sdCircle(vec2 p, float r) { return length(p) - r; }
    
    void main() {
      vec2 uv = vUv - 0.5;
      float time = uTime * 0.5;
      vec2 mouse = uMouse - 0.5;
      
      float d = 1000.0;
      for (int i = 0; i < 5; i++) {
        float fi = float(i);
        float angle = fi * 1.256 + time;
        vec2 pos = vec2(cos(angle), sin(angle)) * 0.2;
        pos = mix(pos, mouse * 0.8, uHover * 0.5);
        d = smin(d, sdCircle(uv - pos, 0.08 + 0.02 * sin(time + fi)), 0.15);
      }
      
      float inside = 1.0 - smoothstep(0.0, 0.02, d);
      vec3 color = mix(uColor1 * 0.1, mix(uColor1, uColor2, smoothstep(-0.2, 0.2, d)), inside);
      color += vec3(1.0 - smoothstep(0.0, 0.04, abs(d))) * 0.3;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `,
  gradient: `
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uHover;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    
    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1,0)), f.x),
                 mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x), f.y);
    }
    
    void main() {
      vec2 uv = vUv;
      float time = uTime * 0.3;
      
      vec2 flow = uv + vec2(noise(uv * 3.0 + time), noise(uv * 3.0 + 10.0 - time)) * 0.1;
      flow += (uMouse - 0.5) * uHover * 0.2;
      
      float n = noise(flow * 2.0 + time);
      vec3 color = mix(uColor1, uColor2, n + uv.y * 0.5);
      
      float glow = smoothstep(0.5, 0.0, length(uv - uMouse)) * uHover * 0.5;
      color += uColor2 * glow;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `,
  waves: `
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uHover;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    
    void main() {
      vec2 uv = vUv;
      float time = uTime * 0.5;
      
      float wave = 0.0;
      for (float i = 1.0; i < 6.0; i++) {
        float freq = i * 3.0;
        float speed = i * 0.3;
        wave += sin(uv.x * freq + time * speed + uMouse.x * uHover * 2.0) / i;
        wave += sin(uv.y * freq * 0.7 + time * speed * 0.8) / i;
      }
      wave = wave * 0.25 + 0.5;
      
      vec3 color = mix(uColor1, uColor2, wave);
      
      float mouseGlow = smoothstep(0.4, 0.0, length(uv - uMouse)) * uHover;
      color += uColor2 * mouseGlow * 0.4;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `,
  noise: `
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uHover;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    
    vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
    
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865, 0.366025403, -0.577350269, 0.024390243);
      vec2 i = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
      m = m * m;
      m = m * m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 a0 = x - floor(x + 0.5);
      m *= 1.79284 - 0.85373 * (a0 * a0 + h * h);
      vec3 g;
      g.x = a0.x * x0.x + h.x * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }
    
    void main() {
      vec2 uv = vUv;
      float time = uTime * 0.2;
      
      vec2 offset = (uMouse - 0.5) * uHover * 0.3;
      float n1 = snoise((uv + offset) * 3.0 + time);
      float n2 = snoise((uv + offset) * 6.0 - time * 0.5);
      float n = n1 * 0.6 + n2 * 0.4;
      n = n * 0.5 + 0.5;
      
      vec3 color = mix(uColor1, uColor2, n);
      
      gl_FragColor = vec4(color, 1.0);
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

type ShaderVariant = keyof typeof shaderVariants

interface CardShaderMeshProps {
  variant: ShaderVariant
  colors: [string, string]
}

function CardShaderMesh({ variant, colors }: CardShaderMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { mouse, isHovered } = useShaderContext()
  const hoverRef = useRef(0)

  const uniforms = useRef({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uHover: { value: 0 },
    uColor1: { value: new THREE.Color(colors[0]) },
    uColor2: { value: new THREE.Color(colors[1]) },
  })

  useFrame(({ clock }) => {
    uniforms.current.uTime.value = clock.getElapsedTime()
    uniforms.current.uMouse.value.lerp(mouse, 0.1)
    // Smooth hover transition
    hoverRef.current += (isHovered ? 1 : 0 - hoverRef.current) * 0.1
    uniforms.current.uHover.value = hoverRef.current
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={shaderVariants[variant]}
        uniforms={uniforms.current}
      />
    </mesh>
  )
}

interface ShaderCardProps {
  title: string
  description?: string
  variant?: ShaderVariant
  colors?: [string, string]
  onClick?: () => void
  expanded?: boolean
  onClose?: () => void
}

function ShaderCard({
  title,
  description,
  variant = 'liquid',
  colors = ['#667eea', '#764ba2'],
  onClick,
  expanded = false,
  onClose,
}: ShaderCardProps) {
  return (
    <div
      onClick={expanded ? undefined : onClick}
      style={{
        position: expanded ? 'fixed' : 'relative',
        inset: expanded ? 0 : 'auto',
        zIndex: expanded ? 1000 : 1,
        width: expanded ? '100%' : '100%',
        height: expanded ? '100%' : '300px',
        borderRadius: expanded ? 0 : '16px',
        overflow: 'hidden',
        cursor: expanded ? 'default' : 'pointer',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: expanded
          ? 'none'
          : '0 10px 40px rgba(0,0,0,0.2)',
      }}
    >
      <ResponsiveShader
        trackMouse
        mobileInteraction="touch"
        pauseWhenHidden={!expanded}
        frameloop={expanded ? 'always' : 'demand'}
      >
        <CardShaderMesh variant={variant} colors={colors} />
      </ResponsiveShader>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: expanded ? '3rem' : '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: expanded ? 'center' : 'flex-end',
          alignItems: expanded ? 'center' : 'flex-start',
          color: 'white',
          textAlign: expanded ? 'center' : 'left',
          background: `linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent ${expanded ? '100%' : '80%'})`,
        }}
      >
        <h3
          style={{
            fontSize: expanded ? 'clamp(2rem, 6vw, 4rem)' : '1.5rem',
            fontWeight: 600,
            margin: 0,
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
          }}
        >
          {title}
        </h3>
        {description && (
          <p
            style={{
              fontSize: expanded ? '1.25rem' : '0.9rem',
              marginTop: '0.5rem',
              opacity: 0.9,
              maxWidth: expanded ? '600px' : 'none',
            }}
          >
            {description}
          </p>
        )}
      </div>

      {expanded && onClose && (
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '2rem',
            right: '2rem',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.5)',
            background: 'rgba(0,0,0,0.3)',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
        >
          ×
        </button>
      )}
    </div>
  )
}

interface ShaderCardsProps {
  cards?: Array<{
    title: string
    description?: string
    variant?: ShaderVariant
    colors?: [string, string]
  }>
  columns?: number
  gap?: string
  className?: string
}

export function ShaderCards({
  cards = [
    { title: 'Liquid', variant: 'liquid', colors: ['#667eea', '#764ba2'], description: 'Metaball effect' },
    { title: 'Gradient', variant: 'gradient', colors: ['#f093fb', '#f5576c'], description: 'Flowing colors' },
    { title: 'Waves', variant: 'waves', colors: ['#4facfe', '#00f2fe'], description: 'Ocean motion' },
    { title: 'Noise', variant: 'noise', colors: ['#43e97b', '#38f9d7'], description: 'Organic texture' },
  ],
  columns = 2,
  gap = '1.5rem',
  className = '',
}: ShaderCardsProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const handleCardClick = useCallback((index: number) => {
    setExpandedIndex(index)
  }, [])

  const handleClose = useCallback(() => {
    setExpandedIndex(null)
  }, [])

  return (
    <div className={className}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap,
          padding: '1rem',
        }}
      >
        {cards.map((card, index) => (
          <ShaderCard
            key={index}
            {...card}
            variant={card.variant as ShaderVariant}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>

      {expandedIndex !== null && (
        <ShaderCard
          {...cards[expandedIndex]}
          variant={cards[expandedIndex].variant as ShaderVariant}
          expanded
          onClose={handleClose}
        />
      )}
    </div>
  )
}

export default ShaderCards
