import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'

// ════════════════════════════════════════════════════════════════
// MAGNETIC ELEMENTS — Cursor-Following Interactions
// Buttons and elements that follow the cursor with magnetic pull.
// Elastic snap-back effect when cursor leaves.
// ════════════════════════════════════════════════════════════════

interface MagneticProps {
  children: React.ReactNode
  strength?: number
  radius?: number
  showDebug?: boolean
  style?: React.CSSProperties
}

// Reusable magnetic wrapper component
function MagneticElement({ 
  children, 
  strength = 0.5, 
  radius = 150,
  showDebug = false,
  style = {}
}: MagneticProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [debugInfo, setDebugInfo] = useState({ distance: 0, angle: 0 })

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    let bounds: DOMRect

    const handleMouseMove = (e: MouseEvent) => {
      bounds = element.getBoundingClientRect()
      
      // Calculate center of element
      const centerX = bounds.left + bounds.width / 2
      const centerY = bounds.top + bounds.height / 2
      
      // Calculate distance from cursor to center
      const distanceX = e.clientX - centerX
      const distanceY = e.clientY - centerY
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2)
      
      // Only apply magnetic effect within radius
      if (distance < radius) {
        setIsHovered(true)
        
        // Calculate pull strength based on distance (closer = stronger)
        const pull = 1 - (distance / radius)
        
        // Apply transform
        gsap.to(element, {
          x: distanceX * strength * pull,
          y: distanceY * strength * pull,
          duration: 0.3,
          ease: 'power2.out',
        })

        // Debug info
        if (showDebug) {
          setDebugInfo({
            distance: Math.round(distance),
            angle: Math.round(Math.atan2(distanceY, distanceX) * (180 / Math.PI)),
          })
        }
      } else {
        handleMouseLeave()
      }
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
      // Elastic snap back
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.3)',
      })
    }

    // Listen on document for smoother tracking
    document.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [strength, radius, showDebug])

  return (
    <div 
      ref={elementRef}
      style={{
        ...style,
        position: 'relative',
        display: 'inline-block',
      }}
    >
      {children}
      {showDebug && isHovered && (
        <div style={styles.debugOverlay}>
          <div style={styles.debugRadius} />
          <span style={styles.debugText}>
            d: {debugInfo.distance}px • θ: {debugInfo.angle}°
          </span>
        </div>
      )}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════

export function MagneticElements() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showDebug, setShowDebug] = useState(true)

  return (
    <div ref={containerRef} style={styles.container}>
      {/* Back button */}
      <Link to="/" style={styles.backButton}>← Back</Link>

      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>Magnetic Elements</h1>
        <p style={styles.subtitle}>
          Move your cursor near elements to see them follow. 
          They snap back elastically when you move away.
        </p>
        <label style={styles.debugToggle}>
          <input 
            type="checkbox" 
            checked={showDebug} 
            onChange={(e) => setShowDebug(e.target.checked)}
            style={styles.checkbox}
          />
          Show radius & math
        </label>
      </header>

      {/* Demo sections */}
      <div style={styles.demos}>

        {/* Section 1: Buttons */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Magnetic Buttons</h2>
          <p style={styles.sectionDesc}>
            Strength: 0.5 • Radius: 150px
          </p>
          <div style={styles.buttonGrid}>
            <MagneticElement strength={0.5} radius={150} showDebug={showDebug}>
              <button style={styles.primaryButton}>
                Hover Me
              </button>
            </MagneticElement>
            
            <MagneticElement strength={0.5} radius={150} showDebug={showDebug}>
              <button style={styles.secondaryButton}>
                Get Started
              </button>
            </MagneticElement>
            
            <MagneticElement strength={0.5} radius={150} showDebug={showDebug}>
              <button style={styles.ghostButton}>
                Learn More →
              </button>
            </MagneticElement>
          </div>
        </section>

        {/* Section 2: Nav Links */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Navigation Links</h2>
          <p style={styles.sectionDesc}>
            Strength: 0.3 • Radius: 100px (subtle effect)
          </p>
          <nav style={styles.navDemo}>
            {['Home', 'About', 'Work', 'Contact'].map((item) => (
              <MagneticElement key={item} strength={0.3} radius={100} showDebug={showDebug}>
                <a href="#" style={styles.navLink}>{item}</a>
              </MagneticElement>
            ))}
          </nav>
        </section>

        {/* Section 3: Strong Pull */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Strong Magnetic Pull</h2>
          <p style={styles.sectionDesc}>
            Strength: 1.0 • Radius: 200px (aggressive effect)
          </p>
          <div style={styles.iconGrid}>
            <MagneticElement strength={1.0} radius={200} showDebug={showDebug}>
              <div style={styles.iconButton}>
                <span style={styles.icon}>⚡</span>
              </div>
            </MagneticElement>
            
            <MagneticElement strength={1.0} radius={200} showDebug={showDebug}>
              <div style={styles.iconButton}>
                <span style={styles.icon}>🎯</span>
              </div>
            </MagneticElement>
            
            <MagneticElement strength={1.0} radius={200} showDebug={showDebug}>
              <div style={styles.iconButton}>
                <span style={styles.icon}>🚀</span>
              </div>
            </MagneticElement>
          </div>
        </section>

        {/* Section 4: Cards */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Magnetic Cards</h2>
          <p style={styles.sectionDesc}>
            Larger elements with subtle magnetic effect
          </p>
          <div style={styles.cardGrid}>
            {[
              { title: 'Design', desc: 'UI/UX & Visual', color: '#6366f1' },
              { title: 'Develop', desc: 'Frontend & Backend', color: '#22c55e' },
              { title: 'Deploy', desc: 'Cloud & DevOps', color: '#f59e0b' },
            ].map((card) => (
              <MagneticElement key={card.title} strength={0.2} radius={180} showDebug={false}>
                <div style={{ ...styles.card, borderColor: card.color + '33' }}>
                  <div style={{ ...styles.cardIcon, background: card.color + '22', color: card.color }}>
                    {card.title[0]}
                  </div>
                  <h3 style={styles.cardTitle}>{card.title}</h3>
                  <p style={styles.cardDesc}>{card.desc}</p>
                </div>
              </MagneticElement>
            ))}
          </div>
        </section>

        {/* The Math */}
        <section style={styles.mathSection}>
          <h2 style={styles.sectionTitle}>The Math Behind It</h2>
          <div style={styles.mathContent}>
            <pre style={styles.codeBlock}>
{`// 1. Calculate distance from cursor to element center
const distanceX = mouseX - centerX
const distanceY = mouseY - centerY
const distance = Math.sqrt(distanceX² + distanceY²)

// 2. Check if within magnetic radius
if (distance < radius) {
  // 3. Calculate pull strength (closer = stronger)
  const pull = 1 - (distance / radius)
  
  // 4. Apply transform with easing
  element.x = distanceX * strength * pull
  element.y = distanceY * strength * pull
}`}
            </pre>
            <div style={styles.mathNotes}>
              <p>
                <strong>Strength</strong> controls how far the element moves (0-1+)
              </p>
              <p>
                <strong>Radius</strong> defines the magnetic field size in pixels
              </p>
              <p>
                <strong>Pull</strong> creates falloff — elements pull harder when cursor is closer
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// STYLES
// ════════════════════════════════════════════════════════════════

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: '#0a0a0a',
    color: '#fff',
    fontFamily: '"Inter", system-ui, sans-serif',
    padding: '2rem',
    paddingTop: '80px',
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
    marginBottom: '4rem',
    maxWidth: '600px',
    margin: '0 auto 4rem',
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
    marginBottom: '1.5rem',
  },
  debugToggle: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.6)',
    cursor: 'pointer',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },
  demos: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5rem',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  section: {
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
  },
  sectionDesc: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.4)',
    marginBottom: '2rem',
    fontFamily: 'monospace',
  },
  buttonGrid: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    flexWrap: 'wrap',
  },
  primaryButton: {
    padding: '1rem 2rem',
    background: '#fff',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  secondaryButton: {
    padding: '1rem 2rem',
    background: 'transparent',
    color: '#fff',
    border: '2px solid #fff',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  ghostButton: {
    padding: '1rem 2rem',
    background: 'transparent',
    color: 'rgba(255, 255, 255, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  navDemo: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    flexWrap: 'wrap',
  },
  navLink: {
    color: 'rgba(255, 255, 255, 0.7)',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: 500,
    padding: '0.5rem 1rem',
  },
  iconGrid: {
    display: 'flex',
    justifyContent: 'center',
    gap: '3rem',
    flexWrap: 'wrap',
  },
  iconButton: {
    width: '80px',
    height: '80px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  icon: {
    fontSize: '2rem',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    padding: '2rem',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '16px',
    border: '1px solid',
    textAlign: 'left',
    cursor: 'pointer',
  },
  cardIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
    fontWeight: 700,
    marginBottom: '1rem',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
  },
  cardDesc: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  debugOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    zIndex: 10,
  },
  debugRadius: {
    width: '300px',
    height: '300px',
    border: '1px dashed rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  debugText: {
    position: 'absolute',
    bottom: '-40px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '0.7rem',
    fontFamily: 'monospace',
    color: 'rgba(255, 255, 255, 0.5)',
    whiteSpace: 'nowrap',
    background: 'rgba(0, 0, 0, 0.8)',
    padding: '4px 8px',
    borderRadius: '4px',
  },
  mathSection: {
    textAlign: 'left',
    padding: '2rem',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  mathContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    marginTop: '1.5rem',
  },
  codeBlock: {
    background: 'rgba(0, 0, 0, 0.5)',
    padding: '1.5rem',
    borderRadius: '8px',
    fontSize: '0.8rem',
    lineHeight: 1.6,
    overflow: 'auto',
    fontFamily: 'monospace',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  mathNotes: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    justifyContent: 'center',
  },
}

export default MagneticElements
