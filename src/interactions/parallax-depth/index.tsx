import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ════════════════════════════════════════════════════════════════
// PARALLAX DEPTH — Layered Parallax Effects
// Multi-layer depth with scroll + mouse movement for a 3D feel
// ════════════════════════════════════════════════════════════════

// Layer configuration: deeper layers move slower
const LAYERS = [
  { depth: 0.1, color: '#1a1a2e', shapes: 3, size: 'large' },
  { depth: 0.25, color: '#16213e', shapes: 4, size: 'medium' },
  { depth: 0.4, color: '#0f3460', shapes: 5, size: 'medium' },
  { depth: 0.6, color: '#533483', shapes: 4, size: 'small' },
  { depth: 0.8, color: '#6366f1', shapes: 6, size: 'small' },
  { depth: 1.0, color: '#ec4899', shapes: 3, size: 'tiny' },
]

export function ParallaxDepth() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const layerRefs = useRef<(HTMLDivElement | null)[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const [perspective, setPerspective] = useState(true)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      const scene = sceneRef.current
      const layers = layerRefs.current.filter(Boolean)

      if (!scene) return

      // ────────────────────────────────────────────────────────
      // MOUSE PARALLAX
      // Each layer moves based on its depth multiplier
      // ────────────────────────────────────────────────────────
      const handleMouseMove = (e: MouseEvent) => {
        // Normalize mouse position to -1 to 1
        const rect = scene.getBoundingClientRect()
        mouseRef.current = {
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
        }
      }

      scene.addEventListener('mousemove', handleMouseMove)

      // Animation loop for smooth mouse following
      gsap.ticker.add(() => {
        layers.forEach((layer, index) => {
          if (!layer) return
          
          const depth = LAYERS[index].depth
          const moveX = mouseRef.current.x * 50 * depth
          const moveY = mouseRef.current.y * 30 * depth

          gsap.to(layer, {
            x: moveX,
            y: moveY,
            duration: 0.5,
            ease: 'power2.out',
          })
        })
      })

      // ────────────────────────────────────────────────────────
      // SCROLL PARALLAX
      // Layers translate at different speeds as you scroll
      // ────────────────────────────────────────────────────────
      layers.forEach((layer, index) => {
        if (!layer) return
        
        const depth = LAYERS[index].depth
        const scrollSpeed = 100 * (1 - depth) // Deeper = slower

        gsap.to(layer, {
          yPercent: -scrollSpeed,
          ease: 'none',
          scrollTrigger: {
            trigger: sceneRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        })
      })

      return () => {
        scene.removeEventListener('mousemove', handleMouseMove)
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Generate random positions for shapes
  const getShapePositions = (count: number) => {
    return Array.from({ length: count }, () => ({
      left: `${Math.random() * 80 + 10}%`,
      top: `${Math.random() * 80 + 10}%`,
      rotate: Math.random() * 360,
    }))
  }

  const getSizePixels = (size: string) => {
    switch (size) {
      case 'large': return Math.random() * 100 + 150
      case 'medium': return Math.random() * 60 + 80
      case 'small': return Math.random() * 40 + 40
      case 'tiny': return Math.random() * 20 + 20
      default: return 50
    }
  }

  return (
    <div ref={containerRef} style={styles.container}>
      {/* Back button */}
      <Link to="/" style={styles.backButton}>← Back</Link>

      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>Parallax Depth</h1>
        <p style={styles.subtitle}>
          Move your mouse and scroll to see 6 layers of parallax depth
        </p>
        <label style={styles.toggle}>
          <input
            type="checkbox"
            checked={perspective}
            onChange={(e) => setPerspective(e.target.checked)}
            style={{ marginRight: '0.5rem' }}
          />
          3D Perspective
        </label>
      </header>

      {/* Parallax scene */}
      <section 
        ref={sceneRef}
        style={{
          ...styles.scene,
          perspective: perspective ? '1000px' : 'none',
        }}
      >
        {/* Layers */}
        {LAYERS.map((layer, layerIndex) => (
          <div
            key={layerIndex}
            ref={el => { layerRefs.current[layerIndex] = el }}
            style={{
              ...styles.layer,
              zIndex: layerIndex,
              transform: perspective ? `translateZ(${-layerIndex * 50}px)` : 'none',
            }}
          >
            {/* Shapes in layer */}
            {getShapePositions(layer.shapes).map((pos, shapeIndex) => {
              const size = getSizePixels(layer.size)
              const isCircle = Math.random() > 0.5
              
              return (
                <div
                  key={shapeIndex}
                  style={{
                    position: 'absolute',
                    left: pos.left,
                    top: pos.top,
                    width: size,
                    height: size,
                    background: layer.color,
                    borderRadius: isCircle ? '50%' : '8px',
                    transform: `rotate(${pos.rotate}deg)`,
                    opacity: 0.8 - layerIndex * 0.1,
                    boxShadow: `0 10px 40px ${layer.color}66`,
                  }}
                />
              )
            })}
            
            {/* Layer label */}
            <div style={{
              ...styles.layerLabel,
              color: layer.color,
            }}>
              Layer {layerIndex + 1} • Depth: {layer.depth}
            </div>
          </div>
        ))}

        {/* Center content */}
        <div style={styles.centerContent}>
          <h2 style={styles.centerTitle}>Depth</h2>
          <p style={styles.centerSubtitle}>Move your mouse around</p>
        </div>
      </section>

      {/* Scroll space */}
      <section style={styles.scrollSpace}>
        <div style={styles.scrollContent}>
          <h2>Keep Scrolling</h2>
          <p>
            Watch how each layer moves at different speeds as you scroll.
            Background layers move slower, creating depth.
          </p>
        </div>
      </section>

      {/* Tech explanation */}
      <section style={styles.techSection}>
        <h2 style={styles.techTitle}>The Technique</h2>
        
        <div style={styles.techGrid}>
          <div style={styles.techCard}>
            <span style={styles.techIcon}>🖱️</span>
            <h3>Mouse Parallax</h3>
            <p>
              Track mouse position, normalize to -1 to 1 range, 
              multiply by depth factor for each layer.
            </p>
            <pre style={styles.code}>
{`moveX = mouse.x * 50 * depth
moveY = mouse.y * 30 * depth`}
            </pre>
          </div>
          
          <div style={styles.techCard}>
            <span style={styles.techIcon}>📜</span>
            <h3>Scroll Parallax</h3>
            <p>
              Use ScrollTrigger scrub to move layers at different 
              rates. Deeper layers (lower depth) move slower.
            </p>
            <pre style={styles.code}>
{`scrollSpeed = 100 * (1 - depth)
// depth 0.1 → speed 90
// depth 1.0 → speed 0`}
            </pre>
          </div>
          
          <div style={styles.techCard}>
            <span style={styles.techIcon}>🎭</span>
            <h3>3D Perspective</h3>
            <p>
              CSS perspective on container + translateZ on layers 
              creates true 3D depth stacking.
            </p>
            <pre style={styles.code}>
{`container: perspective: 1000px
layer: translateZ(-n * 50px)`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// STYLES
// ════════════════════════════════════════════════════════════════

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '300vh',
    background: '#0a0a0a',
    color: '#fff',
    fontFamily: '"Inter", system-ui, sans-serif',
  },
  backButton: {
    position: 'fixed',
    top: 24,
    left: 24,
    color: 'rgba(255, 255, 255, 0.5)',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
    zIndex: 100,
  },
  header: {
    textAlign: 'center',
    padding: '80px 2rem 2rem',
    maxWidth: '600px',
    margin: '0 auto',
  },
  title: {
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    fontWeight: 700,
    letterSpacing: '-0.03em',
    marginBottom: '1rem',
  },
  subtitle: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.5)',
    lineHeight: 1.6,
    marginBottom: '1rem',
  },
  toggle: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.6)',
    cursor: 'pointer',
  },
  scene: {
    position: 'relative',
    height: '100vh',
    overflow: 'hidden',
    transformStyle: 'preserve-3d',
  },
  layer: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
  },
  layerLabel: {
    position: 'absolute',
    bottom: '1rem',
    left: '1rem',
    fontSize: '0.7rem',
    fontFamily: 'monospace',
    opacity: 0.5,
  },
  centerContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    zIndex: 100,
    pointerEvents: 'none',
  },
  centerTitle: {
    fontSize: 'clamp(4rem, 15vw, 10rem)',
    fontWeight: 800,
    letterSpacing: '-0.05em',
    background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.4) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 20px 60px rgba(0,0,0,0.5)',
  },
  centerSubtitle: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: '1rem',
  },
  scrollSpace: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 2rem',
  },
  scrollContent: {
    textAlign: 'center',
    maxWidth: '600px',
  },
  techSection: {
    padding: '6rem 2rem',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  techTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: '3rem',
  },
  techGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  techCard: {
    padding: '1.5rem',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  techIcon: {
    fontSize: '2rem',
    display: 'block',
    marginBottom: '1rem',
  },
  code: {
    background: 'rgba(0, 0, 0, 0.3)',
    padding: '0.75rem',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontFamily: 'monospace',
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: '1rem',
    overflow: 'auto',
  },
}

export default ParallaxDepth
