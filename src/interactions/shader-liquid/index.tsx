import { useRef, useState, useEffect, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { ResponsiveShader, useShaderContext } from '../../components/ResponsiveShader'
import * as THREE from 'three'

// Liquid metaball shader
const liquidFragmentShader = `
precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform float uMouseDown;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uMetallic;
uniform float uSmoothness;

// Ball positions (up to 12 balls)
uniform vec2 uBalls[12];
uniform float uBallSizes[12];
uniform int uBallCount;

// Smooth minimum for metaball blending
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

// Circle SDF
float sdCircle(vec2 p, float r) {
  return length(p) - r;
}

void main() {
  vec2 uv = vUv;
  vec2 centeredUv = uv - 0.5;
  float time = uTime;

  // Start with large distance
  float d = 1000.0;

  // Add all balls
  for (int i = 0; i < 12; i++) {
    if (i >= uBallCount) break;
    
    vec2 ballPos = uBalls[i] - 0.5;
    float ballSize = uBallSizes[i];
    
    float ballDist = sdCircle(centeredUv - ballPos, ballSize);
    d = smin(d, ballDist, uSmoothness);
  }

  // Add mouse-following ball
  vec2 mousePos = uMouse - 0.5;
  float mouseSize = 0.08 + uMouseDown * 0.04;
  d = smin(d, sdCircle(centeredUv - mousePos, mouseSize), uSmoothness);

  // Create color based on distance
  float inside = 1.0 - smoothstep(0.0, 0.02, d);

  // Gradient based on distance
  float gradient = smoothstep(-0.2, 0.2, d);

  // Edge highlight for metallic effect
  float edge = 1.0 - smoothstep(0.0, 0.05, abs(d));
  edge *= uMetallic;

  // Mix colors
  vec3 liquidColor = mix(uColor1, uColor2, gradient);
  liquidColor += vec3(edge * 0.5);

  // Internal shading
  float innerShade = smoothstep(-0.15, 0.0, d);
  liquidColor *= 0.7 + 0.3 * innerShade;

  // Specular highlight
  vec2 lightDir = normalize(vec2(1.0, 1.0));
  float specular = pow(max(0.0, dot(normalize(centeredUv - mousePos), lightDir)), 8.0);
  specular *= inside * uMetallic * 0.5;
  liquidColor += vec3(specular);

  // Background
  vec3 bgColor = mix(uColor2 * 0.1, uColor1 * 0.05, uv.y);

  // Final color
  vec3 finalColor = mix(bgColor, liquidColor, inside);

  // Glow around blobs
  float glow = smoothstep(0.1, 0.0, d) * (1.0 - inside);
  finalColor += mix(uColor1, uColor2, 0.5) * glow * 0.3;

  gl_FragColor = vec4(finalColor, 1.0);
}
`

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`

interface Ball {
  id: number
  position: THREE.Vector2
  velocity: THREE.Vector2
  size: number
}

interface LiquidMeshProps {
  balls: Ball[]
  colors: [string, string]
  metallic: number
  smoothness: number
  mouseDown: boolean
}

function LiquidMesh({ balls, colors, metallic, smoothness, mouseDown }: LiquidMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()
  const { mouse } = useShaderContext()

  // Initialize uniform arrays
  const ballPositions = new Array(12).fill(null).map(() => new THREE.Vector2(0, 0))
  const ballSizes = new Float32Array(12).fill(0)

  const uniforms = useRef({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uResolution: { value: new THREE.Vector2(viewport.width, viewport.height) },
    uMouseDown: { value: 0 },
    uColor1: { value: new THREE.Color(colors[0]) },
    uColor2: { value: new THREE.Color(colors[1]) },
    uMetallic: { value: metallic },
    uSmoothness: { value: smoothness },
    uBalls: { value: ballPositions },
    uBallSizes: { value: ballSizes },
    uBallCount: { value: 0 },
  })

  useFrame(({ clock }) => {
    uniforms.current.uTime.value = clock.getElapsedTime()
    uniforms.current.uMouse.value.lerp(mouse, 0.15)
    uniforms.current.uMouseDown.value += (mouseDown ? 1 : 0 - uniforms.current.uMouseDown.value) * 0.1

    // Update ball positions
    balls.forEach((ball, i) => {
      if (i < 12) {
        uniforms.current.uBalls.value[i].copy(ball.position)
        uniforms.current.uBallSizes.value[i] = ball.size
      }
    })
    uniforms.current.uBallCount.value = Math.min(balls.length, 12)
  })

  useEffect(() => {
    uniforms.current.uResolution.value.set(viewport.width, viewport.height)
  }, [viewport])

  useEffect(() => {
    uniforms.current.uColor1.value.set(colors[0])
    uniforms.current.uColor2.value.set(colors[1])
  }, [colors])

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={liquidFragmentShader}
        uniforms={uniforms.current}
      />
    </mesh>
  )
}

interface ShaderLiquidProps {
  initialBalls?: number
  colors?: [string, string]
  metallic?: number
  smoothness?: number
  clickToAdd?: boolean
  tiltToMove?: boolean
  className?: string
  style?: React.CSSProperties
}

export function ShaderLiquid({
  initialBalls = 5,
  colors = ['#667eea', '#764ba2'],
  metallic = 0.7,
  smoothness = 0.15,
  clickToAdd = true,
  tiltToMove = true,
  className = '',
  style,
}: ShaderLiquidProps) {
  const [balls, setBalls] = useState<Ball[]>([])
  const [mouseDown, setMouseDown] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const ballIdRef = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Detect mobile
  useEffect(() => {
    setIsMobile('ontouchstart' in window)
  }, [])

  // Initialize balls
  useEffect(() => {
    const newBalls: Ball[] = []
    for (let i = 0; i < initialBalls; i++) {
      newBalls.push({
        id: ballIdRef.current++,
        position: new THREE.Vector2(
          0.2 + Math.random() * 0.6,
          0.2 + Math.random() * 0.6
        ),
        velocity: new THREE.Vector2(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01
        ),
        size: 0.06 + Math.random() * 0.04,
      })
    }
    setBalls(newBalls)
  }, [initialBalls])

  // Animate balls
  useEffect(() => {
    let animationId: number

    const animate = () => {
      setBalls((prevBalls) =>
        prevBalls.map((ball) => {
          const newPos = ball.position.clone()
          newPos.add(ball.velocity)

          // Bounce off walls
          if (newPos.x < 0.1 || newPos.x > 0.9) {
            ball.velocity.x *= -0.8
          }
          if (newPos.y < 0.1 || newPos.y > 0.9) {
            ball.velocity.y *= -0.8
          }

          // Apply slight friction
          ball.velocity.multiplyScalar(0.995)

          // Add slight random movement
          ball.velocity.x += (Math.random() - 0.5) * 0.0005
          ball.velocity.y += (Math.random() - 0.5) * 0.0005

          newPos.clamp(
            new THREE.Vector2(0.1, 0.1),
            new THREE.Vector2(0.9, 0.9)
          )

          return {
            ...ball,
            position: newPos,
          }
        })
      )

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [])

  // Mobile tilt to move balls
  useEffect(() => {
    if (!isMobile || !tiltToMove) return

    const handleOrientation = (e: DeviceOrientationEvent) => {
      const gamma = (e.gamma || 0) / 45 // -1 to 1
      const beta = (e.beta || 0) / 45

      setBalls((prevBalls) =>
        prevBalls.map((ball) => ({
          ...ball,
          velocity: new THREE.Vector2(
            ball.velocity.x + gamma * 0.001,
            ball.velocity.y - beta * 0.001
          ),
        }))
      )
    }

    window.addEventListener('deviceorientation', handleOrientation)
    return () => window.removeEventListener('deviceorientation', handleOrientation)
  }, [isMobile, tiltToMove])

  // Click/touch to add balls
  const handleClick = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!clickToAdd || !containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      let clientX: number, clientY: number

      if ('touches' in e) {
        const touch = e.touches[0] || e.changedTouches[0]
        clientX = touch.clientX
        clientY = touch.clientY
      } else {
        clientX = e.clientX
        clientY = e.clientY
      }

      const x = (clientX - rect.left) / rect.width
      const y = 1 - (clientY - rect.top) / rect.height

      const newBall: Ball = {
        id: ballIdRef.current++,
        position: new THREE.Vector2(x, y),
        velocity: new THREE.Vector2(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        size: 0.05 + Math.random() * 0.05,
      }

      setBalls((prev) => {
        const updated = [...prev, newBall]
        // Limit total balls
        if (updated.length > 12) {
          return updated.slice(-12)
        }
        return updated
      })
    },
    [clickToAdd]
  )

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '400px',
        cursor: clickToAdd ? 'pointer' : 'default',
        ...style,
      }}
      onClick={handleClick}
      onTouchStart={handleClick}
      onMouseDown={() => setMouseDown(true)}
      onMouseUp={() => setMouseDown(false)}
      onMouseLeave={() => setMouseDown(false)}
      onTouchEnd={() => setMouseDown(false)}
    >
      <ResponsiveShader
        trackMouse
        mobileInteraction="touch"
        pauseWhenHidden
      >
        <LiquidMesh
          balls={balls}
          colors={colors}
          metallic={metallic}
          smoothness={smoothness}
          mouseDown={mouseDown}
        />
      </ResponsiveShader>

      {clickToAdd && (
        <div
          style={{
            position: 'absolute',
            bottom: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            fontSize: '0.875rem',
            opacity: 0.6,
            pointerEvents: 'none',
            textShadow: '0 1px 3px rgba(0,0,0,0.5)',
          }}
        >
          {isMobile ? 'Tap to add blobs • Tilt to move' : 'Click to add blobs'}
        </div>
      )}
    </div>
  )
}

export default ShaderLiquid
