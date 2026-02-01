import { useRef, useEffect, useState, useCallback } from 'react'
import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(MotionPathPlugin, ScrollTrigger)

/**
 * Curved Path Animation
 * 
 * Scroll-triggered animation where an element follows a smooth Bezier curve
 * between multiple positions. Based on GSAP MotionPath + ScrollTrigger.
 * 
 * Source: https://tympanus.net/codrops/2025/12/17/building-responsive-scroll-triggered-curved-path-animations-with-gsap/
 */

interface Position {
  x: number
  y: number
  width: number
  height: number
}

interface ControlPoint {
  x: number
  y: number
}

interface CurvedPathProps {
  /** Show debug visualization (path, control points) */
  debug?: boolean
  /** Custom content for the animated element */
  children?: React.ReactNode
  /** Custom image URL for the animated element */
  imageSrc?: string
  /** Number of positions (waypoints) - 2 or 3 supported */
  positions?: 2 | 3
  /** Custom class for the container */
  className?: string
  /** Scroll section height multiplier (controls animation length) */
  scrollMultiplier?: number
}

// Build an SVG path string from positions and control points
function buildPathString(positions: Position[], controlPoints: ControlPoint[]): string {
  if (positions.length === 2) {
    // Two positions = one curve
    return `M${positions[0].x},${positions[0].y} ` +
      `C${controlPoints[0].x},${controlPoints[0].y} ` +
      `${controlPoints[1].x},${controlPoints[1].y} ` +
      `${positions[1].x},${positions[1].y}`
  }
  // Three positions = two curves (S-curve)
  return `M${positions[0].x},${positions[0].y} ` +
    `C${controlPoints[0].x},${controlPoints[0].y} ` +
    `${controlPoints[1].x},${controlPoints[1].y} ` +
    `${positions[1].x},${positions[1].y} ` +
    `C${controlPoints[2].x},${controlPoints[2].y} ` +
    `${controlPoints[3].x},${controlPoints[3].y} ` +
    `${positions[2].x},${positions[2].y}`
}

// Calculate default control points for smooth curves
function calculateControlPoints(positions: Position[]): ControlPoint[] {
  if (positions.length === 2) {
    // Simple curve between two points
    const midY = (positions[0].y + positions[1].y) / 2
    return [
      { x: positions[0].x, y: midY },
      { x: positions[1].x, y: midY }
    ]
  }

  // S-curve between three points
  return [
    // CP1: Extends from position 1 toward position 2
    {
      x: positions[0].x,
      y: positions[0].y + (positions[1].y - positions[0].y) * 0.75
    },
    // CP2: Approaches position 2 from above
    {
      x: positions[1].x,
      y: positions[1].y - Math.min(200, (positions[1].y - positions[0].y) * 0.3)
    },
    // CP3: Extends from position 2 toward position 3
    {
      x: positions[1].x,
      y: positions[1].y + Math.min(100, (positions[2].y - positions[1].y) * 0.25)
    },
    // CP4: Approaches position 3 from above
    {
      x: positions[1].x + (positions[2].x - positions[1].x) * 0.5,
      y: positions[2].y - (positions[2].y - positions[1].y) * 0.25
    }
  ]
}

// Interpolate size between two positions
function interpolateSize(
  positions: Position[],
  progress: number
): { width: number; height: number } {
  if (positions.length === 2) {
    return {
      width: positions[0].width + (positions[1].width - positions[0].width) * progress,
      height: positions[0].height + (positions[1].height - positions[0].height) * progress
    }
  }

  // Three positions: split at 50%
  if (progress <= 0.5) {
    const p = progress * 2
    return {
      width: positions[0].width + (positions[1].width - positions[0].width) * p,
      height: positions[0].height + (positions[1].height - positions[0].height) * p
    }
  } else {
    const p = (progress - 0.5) * 2
    return {
      width: positions[1].width + (positions[2].width - positions[1].width) * p,
      height: positions[1].height + (positions[2].height - positions[1].height) * p
    }
  }
}

export function CurvedPath({
  debug = false,
  children,
  imageSrc = 'https://picsum.photos/seed/curved/400/500',
  positions: numPositions = 3,
  className = '',
  scrollMultiplier = 2.5
}: CurvedPathProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const animatedRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const [controlPoints, setControlPoints] = useState<ControlPoint[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  // Measure positions of waypoint elements
  const measurePositions = useCallback(() => {
    if (!sectionRef.current) return

    const section = sectionRef.current
    const rectSection = section.getBoundingClientRect()
    const posEls = section.querySelectorAll<HTMLElement>('[data-pos]')

    const newPositions: Position[] = []
    posEls.forEach((el) => {
      const r = el.getBoundingClientRect()
      newPositions.push({
        x: r.left - rectSection.left + r.width / 2,
        y: r.top - rectSection.top + r.height / 2,
        width: r.width,
        height: r.height
      })
    })

    if (newPositions.length >= 2) {
      setPositions(newPositions.slice(0, numPositions))
      setControlPoints(calculateControlPoints(newPositions.slice(0, numPositions)))
    }
  }, [numPositions])

  // Build animation
  const buildAnimation = useCallback(() => {
    if (!sectionRef.current || !animatedRef.current || positions.length < 2) return

    // Kill existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill()
    }

    const img = animatedRef.current
    const pathString = buildPathString(positions, controlPoints)

    // Set initial position
    gsap.set(img, {
      x: positions[0].x,
      y: positions[0].y,
      width: positions[0].width,
      height: positions[0].height,
      xPercent: -50,
      yPercent: -50
    })

    // Create timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.8,
        invalidateOnRefresh: true
      }
    })

    tl.to(img, {
      duration: 1,
      motionPath: {
        path: pathString,
        autoRotate: false
      },
      ease: 'none',
      onUpdate: function() {
        const progress = this.progress()
        const size = interpolateSize(positions, progress)
        img.style.width = `${size.width}px`
        img.style.height = `${size.height}px`
      }
    })

    timelineRef.current = tl

    // Update debug path
    if (pathRef.current) {
      pathRef.current.setAttribute('d', pathString)
    }
  }, [positions, controlPoints])

  // Handle dragging control points
  const handlePointerDown = (index: number) => (e: React.PointerEvent) => {
    if (!debug) return
    setDragIndex(index)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragIndex === null || !sectionRef.current) return

    const rect = sectionRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setControlPoints(prev => {
      const updated = [...prev]
      updated[dragIndex] = { x, y }
      return updated
    })
  }

  const handlePointerUp = () => {
    setDragIndex(null)
  }

  // Copy control points to clipboard
  const copyControlPoints = () => {
    const values = controlPoints.map((cp, i) =>
      `{ x: ${Math.round(cp.x)}, y: ${Math.round(cp.y)} } // CP${i + 1}`
    ).join(',\n')
    navigator.clipboard.writeText(`[\n${values}\n]`)
    alert('Control points copied to clipboard!')
  }

  // Initialize
  useEffect(() => {
    measurePositions()

    const handleResize = () => {
      measurePositions()
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [measurePositions])

  // Rebuild animation when positions or control points change
  useEffect(() => {
    if (positions.length >= 2 && controlPoints.length >= 2) {
      buildAnimation()
    }
  }, [positions, controlPoints, buildAnimation])

  return (
    <div
      ref={sectionRef}
      className={`curved-path-section ${className}`}
      style={{
        position: 'relative',
        height: `${scrollMultiplier * 100}vh`,
        background: 'linear-gradient(to bottom, #0a0a12, #1a1a2e, #0a0a12)',
        overflow: 'hidden'
      }}
      onPointerMove={debug ? handlePointerMove : undefined}
      onPointerUp={debug ? handlePointerUp : undefined}
    >
      {/* Position markers */}
      <div
        data-pos="1"
        className="curved-path-pos"
        style={{
          position: 'absolute',
          top: '10%',
          left: '20%',
          width: 'clamp(180px, 20vw, 280px)',
          height: 'clamp(220px, 25vw, 350px)',
          background: debug ? 'rgba(255,0,64,0.2)' : 'transparent',
          border: debug ? '2px dashed rgba(255,0,64,0.5)' : 'none',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255,0,64,0.7)',
          fontWeight: 600
        }}
      >
        {debug && 'Pos 1'}
      </div>

      <div
        data-pos="2"
        className="curved-path-pos"
        style={{
          position: 'absolute',
          top: '45%',
          right: '15%',
          width: 'clamp(220px, 25vw, 350px)',
          height: 'clamp(280px, 32vw, 420px)',
          background: debug ? 'rgba(255,0,64,0.2)' : 'transparent',
          border: debug ? '2px dashed rgba(255,0,64,0.5)' : 'none',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255,0,64,0.7)',
          fontWeight: 600
        }}
      >
        {debug && 'Pos 2'}
      </div>

      {numPositions >= 3 && (
        <div
          data-pos="3"
          className="curved-path-pos"
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '30%',
            width: 'clamp(260px, 30vw, 400px)',
            height: 'clamp(330px, 38vw, 500px)',
            background: debug ? 'rgba(255,0,64,0.2)' : 'transparent',
            border: debug ? '2px dashed rgba(255,0,64,0.5)' : 'none',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255,0,64,0.7)',
            fontWeight: 600
          }}
        >
          {debug && 'Pos 3'}
        </div>
      )}

      {/* Debug SVG overlay */}
      {debug && (
        <svg
          ref={svgRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 15
          }}
        >
          {/* The animated path */}
          <path
            ref={pathRef}
            stroke="#ff0040"
            strokeWidth="3"
            fill="none"
            strokeDasharray="8,4"
          />

          {/* Anchor points (positions) */}
          {positions.map((pos, i) => (
            <circle
              key={`anchor-${i}`}
              cx={pos.x}
              cy={pos.y}
              r="10"
              fill="#ff0040"
            />
          ))}

          {/* Control points (draggable) */}
          {controlPoints.map((cp, i) => (
            <g key={`cp-${i}`}>
              {/* Handle line connecting to anchor */}
              <line
                x1={cp.x}
                y1={cp.y}
                x2={positions[Math.floor(i / 2)]?.x || 0}
                y2={positions[Math.floor(i / 2)]?.y || 0}
                stroke="#00ff88"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
              <circle
                cx={cp.x}
                cy={cp.y}
                r="10"
                fill="#00ff88"
                style={{ pointerEvents: 'all', cursor: 'grab' }}
                onPointerDown={handlePointerDown(i)}
              />
              <text
                x={cp.x + 14}
                y={cp.y + 5}
                fill="#00ff88"
                fontSize="12"
                fontWeight="600"
              >
                CP{i + 1}
              </text>
            </g>
          ))}
        </svg>
      )}

      {/* Copy button */}
      {debug && (
        <button
          onClick={copyControlPoints}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '12px 24px',
            background: '#00ff88',
            color: '#000',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            zIndex: 100
          }}
        >
          Copy Control Points
        </button>
      )}

      {/* Animated element */}
      <div
        ref={animatedRef}
        className="curved-path-animated"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          zIndex: 10,
          willChange: 'transform'
        }}
      >
        {children || (
          <img
            src={imageSrc}
            alt="Animated content"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
          />
        )}
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255,255,255,0.5)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          animation: 'bounce 2s infinite'
        }}
      >
        <span style={{ fontSize: '14px', letterSpacing: '2px' }}>SCROLL</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
          40% { transform: translateX(-50%) translateY(-10px); }
          60% { transform: translateX(-50%) translateY(-5px); }
        }
        
        @media (max-width: 768px) {
          .curved-path-pos[data-pos="1"] {
            left: 5% !important;
            top: 5% !important;
            width: clamp(120px, 40vw, 160px) !important;
            height: clamp(150px, 50vw, 200px) !important;
          }
          .curved-path-pos[data-pos="2"] {
            right: 5% !important;
            left: auto !important;
            top: 35% !important;
            width: clamp(140px, 45vw, 180px) !important;
            height: clamp(180px, 55vw, 230px) !important;
          }
          .curved-path-pos[data-pos="3"] {
            left: 10% !important;
            bottom: 8% !important;
            width: clamp(160px, 50vw, 200px) !important;
            height: clamp(200px, 60vw, 260px) !important;
          }
        }
        
        @media (max-width: 480px) {
          .curved-path-pos[data-pos="1"] {
            left: 3% !important;
            top: 3% !important;
            width: 100px !important;
            height: 130px !important;
          }
          .curved-path-pos[data-pos="2"] {
            right: 3% !important;
            top: 32% !important;
            width: 120px !important;
            height: 150px !important;
          }
          .curved-path-pos[data-pos="3"] {
            left: 5% !important;
            bottom: 5% !important;
            width: 140px !important;
            height: 180px !important;
          }
        }
      `}</style>
    </div>
  )
}

// Demo page with full example
export function CurvedPathDemo() {
  const [showDebug, setShowDebug] = useState(false)

  return (
    <div style={{ background: '#0a0a12' }}>
      {/* Header */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          padding: '20px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 100,
          background: 'linear-gradient(to bottom, rgba(10,10,18,0.9), transparent)'
        }}
      >
        <a
          href="#/"
          style={{
            color: '#fff',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span style={{ fontSize: '20px' }}>←</span>
          <span>Back to Lab</span>
        </a>
        <button
          onClick={() => setShowDebug(!showDebug)}
          style={{
            padding: '10px 20px',
            background: showDebug ? '#ff0040' : 'rgba(255,255,255,0.1)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          {showDebug ? 'Debug ON' : 'Debug OFF'}
        </button>
      </header>

      {/* Intro section */}
      <section
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '40px'
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            fontWeight: 700,
            color: '#fff',
            margin: 0,
            letterSpacing: '-0.02em',
            lineHeight: 1.1
          }}
        >
          Curved Path
          <br />
          <span style={{ color: '#ff0040' }}>Animation</span>
        </h1>
        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'rgba(255,255,255,0.6)',
            maxWidth: '500px',
            marginTop: '24px',
            lineHeight: 1.6
          }}
        >
          Scroll-triggered Bezier curves using GSAP MotionPath.
          Elements follow smooth paths between positions.
        </p>
        <div
          style={{
            marginTop: '60px',
            color: 'rgba(255,255,255,0.4)',
            fontSize: '14px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>Scroll to begin</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Curved path animation */}
      <CurvedPath
        debug={showDebug}
        imageSrc="https://picsum.photos/seed/curved-demo/600/750"
        scrollMultiplier={3}
      />

      {/* Content section */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '80px 40px',
          textAlign: 'center'
        }}
      >
        <h2
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            color: '#fff',
            marginBottom: '24px'
          }}
        >
          How it works
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '32px',
            maxWidth: '900px',
            width: '100%',
            marginTop: '40px'
          }}
        >
          {[
            { title: 'Position Markers', desc: 'Define waypoints where the element should travel' },
            { title: 'Bezier Curves', desc: 'Control points shape the path between positions' },
            { title: 'Scroll Sync', desc: 'GSAP ScrollTrigger scrubs through the animation' },
            { title: 'Size Interpolation', desc: 'Element scales smoothly between positions' }
          ].map((item, i) => (
            <div
              key={i}
              style={{
                padding: '32px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              <h3 style={{ color: '#ff0040', marginBottom: '12px', fontSize: '1.1rem' }}>
                {item.title}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '60px' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
            Toggle debug mode to see and drag control points
          </p>
        </div>
      </section>
    </div>
  )
}

export default CurvedPathDemo
