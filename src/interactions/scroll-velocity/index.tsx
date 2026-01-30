import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ════════════════════════════════════════════════════════════════
// SCROLL VELOCITY — Velocity-Based Marquee
// Marquee text that accelerates/decelerates based on scroll speed.
// Direction reverses when scrolling up. Smooth momentum decay.
// ════════════════════════════════════════════════════════════════

const MARQUEE_TEXTS = [
  'SCROLL FASTER • VELOCITY BASED • MOMENTUM DECAY • ',
  'CREATIVE DEVELOPMENT • GSAP ANIMATION • INTERACTION DESIGN • ',
  'REVERSE ON SCROLL UP • SPEED MULTIPLIER • INFINITE LOOP • ',
]

export function ScrollVelocity() {
  const containerRef = useRef<HTMLDivElement>(null)
  const marqueeRefs = useRef<(HTMLDivElement | null)[]>([])
  const velocityRef = useRef(0)
  const directionRef = useRef(1)
  const xPercentRef = useRef([0, 0, 0])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // ────────────────────────────────────────────────────────
      // VELOCITY TRACKING
      // Track scroll velocity using ScrollTrigger's built-in 
      // getVelocity() or by calculating delta ourselves
      // ────────────────────────────────────────────────────────
      
      let lastScroll = window.scrollY
      let scrollVelocity = 0
      
      // Update velocity on scroll
      const updateVelocity = () => {
        const currentScroll = window.scrollY
        const delta = currentScroll - lastScroll
        
        // Determine direction based on scroll
        if (delta > 0) {
          directionRef.current = 1
        } else if (delta < 0) {
          directionRef.current = -1
        }
        
        // Calculate velocity (pixels per frame, roughly)
        scrollVelocity = Math.abs(delta)
        lastScroll = currentScroll
      }
      
      window.addEventListener('scroll', updateVelocity, { passive: true })

      // ────────────────────────────────────────────────────────
      // ANIMATION LOOP
      // Each marquee row moves continuously. Speed is influenced
      // by scroll velocity with smooth momentum decay.
      // ────────────────────────────────────────────────────────
      
      const baseSpeeds = [0.02, -0.015, 0.025] // Different base speeds
      
      gsap.ticker.add(() => {
        // Decay velocity smoothly toward zero
        velocityRef.current += (scrollVelocity * 0.01 - velocityRef.current) * 0.1
        scrollVelocity *= 0.95 // Decay scroll velocity
        
        marqueeRefs.current.forEach((marquee, index) => {
          if (!marquee) return
          
          // Calculate movement: base speed + velocity boost
          const baseSpeed = baseSpeeds[index]
          const velocityBoost = velocityRef.current * 0.5 * (index % 2 === 0 ? 1 : -1)
          const direction = baseSpeed > 0 ? directionRef.current : -directionRef.current
          
          // Update position
          xPercentRef.current[index] += (Math.abs(baseSpeed) + velocityBoost) * direction
          
          // Reset when we've moved a full repeat (50% because we duplicate content)
          if (xPercentRef.current[index] > 0) {
            xPercentRef.current[index] = -50
          } else if (xPercentRef.current[index] < -50) {
            xPercentRef.current[index] = 0
          }
          
          // Apply transform
          gsap.set(marquee, {
            xPercent: xPercentRef.current[index],
          })
        })
      })

      // Cleanup
      return () => {
        window.removeEventListener('scroll', updateVelocity)
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} style={styles.container}>
      {/* Back button */}
      <Link to="/" style={styles.backButton}>← Back</Link>

      {/* Hero section */}
      <section style={styles.hero}>
        <h1 style={styles.title}>Scroll Velocity</h1>
        <p style={styles.subtitle}>
          Scroll up and down to see the marquees respond to your scroll speed and direction
        </p>
        <div style={styles.scrollIndicator}>
          <span style={styles.arrow}>↓</span>
          <span style={styles.scrollText}>Scroll to interact</span>
        </div>
      </section>

      {/* Marquee section */}
      <section style={styles.marqueeSection}>
        {MARQUEE_TEXTS.map((text, index) => (
          <div key={index} style={styles.marqueeWrapper}>
            <div 
              ref={el => { marqueeRefs.current[index] = el }}
              style={{
                ...styles.marqueeTrack,
                // Alternate row styling
                opacity: index === 1 ? 0.5 : 1,
                fontSize: index === 1 ? '3rem' : 'clamp(2rem, 8vw, 5rem)',
              }}
            >
              {/* Duplicate text for seamless loop */}
              <span style={styles.marqueeText}>{text}</span>
              <span style={styles.marqueeText}>{text}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Spacer for scrolling */}
      <section style={styles.spacer}>
        <div style={styles.spacerContent}>
          <p style={styles.spacerText}>
            The faster you scroll, the faster the marquees move.
            <br />
            Scrolling up reverses the direction.
          </p>
        </div>
      </section>

      {/* Second marquee section */}
      <section style={styles.marqueeSection}>
        {MARQUEE_TEXTS.map((text, index) => (
          <div key={`second-${index}`} style={styles.marqueeWrapper}>
            <div 
              style={{
                ...styles.marqueeTrack,
                opacity: index === 1 ? 0.5 : 1,
                fontSize: index === 1 ? '3rem' : 'clamp(2rem, 8vw, 5rem)',
                animation: `marquee-${index} ${20 + index * 5}s linear infinite`,
              }}
            >
              <span style={styles.marqueeText}>{text}</span>
              <span style={styles.marqueeText}>{text}</span>
            </div>
          </div>
        ))}
      </section>

      {/* More spacer */}
      <section style={styles.spacer}>
        <div style={styles.spacerContent}>
          <h2 style={styles.spacerTitle}>Momentum Decay</h2>
          <p style={styles.spacerText}>
            After you stop scrolling, the velocity smoothly decays back to the base speed.
            This creates a natural, physics-based feel.
          </p>
        </div>
      </section>

      {/* Tech notes */}
      <section style={styles.techSection}>
        <h3 style={styles.techTitle}>How It Works</h3>
        <div style={styles.techGrid}>
          <div style={styles.techCard}>
            <span style={styles.techIcon}>📏</span>
            <h4>Velocity Tracking</h4>
            <p>Calculate scroll delta between frames to determine speed</p>
          </div>
          <div style={styles.techCard}>
            <span style={styles.techIcon}>🔄</span>
            <h4>Direction Detection</h4>
            <p>Positive delta = down, negative = up. Marquee reverses accordingly</p>
          </div>
          <div style={styles.techCard}>
            <span style={styles.techIcon}>⚡</span>
            <h4>GSAP Ticker</h4>
            <p>Using gsap.ticker for smooth 60fps updates independent of scroll events</p>
          </div>
          <div style={styles.techCard}>
            <span style={styles.techIcon}>🎯</span>
            <h4>Momentum Decay</h4>
            <p>Exponential decay creates natural deceleration after scroll stops</p>
          </div>
        </div>
      </section>

      {/* End spacer */}
      <section style={{ ...styles.spacer, minHeight: '50vh' }}>
        <div style={styles.spacerContent}>
          <p style={styles.spacerText}>↑ Scroll back up to see it reverse</p>
        </div>
      </section>

      {/* Inline keyframes */}
      <style>{`
        @keyframes marquee-0 {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marquee-1 {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        @keyframes marquee-2 {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// STYLES
// ════════════════════════════════════════════════════════════════

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '400vh',
    background: '#0a0a0a',
    color: '#fff',
    fontFamily: '"Inter", system-ui, sans-serif',
    overflow: 'hidden',
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
  hero: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '2rem',
  },
  title: {
    fontSize: 'clamp(2.5rem, 8vw, 5rem)',
    fontWeight: 700,
    letterSpacing: '-0.04em',
    marginBottom: '1rem',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: 'rgba(255, 255, 255, 0.5)',
    maxWidth: '500px',
    lineHeight: 1.6,
    marginBottom: '3rem',
  },
  scrollIndicator: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    animation: 'bounce 2s infinite',
  },
  arrow: {
    fontSize: '2rem',
    opacity: 0.5,
  },
  scrollText: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  marqueeSection: {
    padding: '4rem 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    overflow: 'hidden',
  },
  marqueeWrapper: {
    overflow: 'hidden',
    width: '100%',
  },
  marqueeTrack: {
    display: 'flex',
    whiteSpace: 'nowrap',
    willChange: 'transform',
  },
  marqueeText: {
    fontWeight: 800,
    letterSpacing: '-0.02em',
    paddingRight: '0.5em',
    background: 'linear-gradient(90deg, #fff 0%, rgba(255,255,255,0.6) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    flexShrink: 0,
  },
  spacer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 2rem',
  },
  spacerContent: {
    textAlign: 'center',
    maxWidth: '600px',
  },
  spacerTitle: {
    fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
    fontWeight: 700,
    marginBottom: '1rem',
  },
  spacerText: {
    fontSize: '1.1rem',
    color: 'rgba(255, 255, 255, 0.5)',
    lineHeight: 1.8,
  },
  techSection: {
    padding: '6rem 2rem',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  techTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    textAlign: 'center',
    marginBottom: '3rem',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  techGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
}

export default ScrollVelocity
