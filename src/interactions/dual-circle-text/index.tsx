/**
 * Dual Circle Text - Counter-Rotating Orbital Text Animation
 * 
 * Reference: https://tympanus.net/codrops/2025/11/04/creating-3d-scroll-driven-text-animations-with-css-and-gsap/
 * 
 * Two columns of text items positioned along circular paths on opposite
 * sides of the viewport. As you scroll, the circles rotate in opposite
 * directions, creating a mesmerizing mirrored orbital motion.
 * 
 * Key techniques:
 * - Trigonometric positioning for circular layout (sin/cos)
 * - GSAP ScrollTrigger for scroll-linked animation
 * - Mirrored rotation (clockwise vs counterclockwise)
 * - Dynamic text rotation to keep items readable
 */

import { useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ============================================
// Configuration
// ============================================

interface CircleConfig {
  items: HTMLElement[]
  centerX: number
  centerY: number
  radius: number
  direction: 1 | -1 // 1 = clockwise, -1 = counterclockwise
}

const ITEMS = [
  'Design',
  'Development',
  'Branding',
  'Marketing',
  'Copywriting',
  'Content',
  'Illustration',
  'Video',
  'Photography',
  '3D Graphics',
  'Animation',
  'Strategy',
  'Research',
  'Testing',
  'Planning',
  'Execution',
  'Analysis',
  'Growth',
  'Optimization',
  'Innovation',
  'Leadership',
  'Vision',
  'Culture',
  'Impact',
]

// ============================================
// Main Component
// ============================================

export function DualCircleText() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const leftWrapperRef = useRef<HTMLUListElement>(null)
  const rightWrapperRef = useRef<HTMLUListElement>(null)
  const leftItemsRef = useRef<(HTMLLIElement | null)[]>([])
  const rightItemsRef = useRef<(HTMLLIElement | null)[]>([])
  
  const leftConfigRef = useRef<CircleConfig | null>(null)
  const rightConfigRef = useRef<CircleConfig | null>(null)

  // Update items position along circular path
  const updateItemsPosition = useCallback((config: CircleConfig, scrollY: number) => {
    const { items, centerX, centerY, radius, direction } = config
    const totalItems = items.length
    const spacing = Math.PI / totalItems // Distribute across half circle

    items.forEach((item, index) => {
      // Calculate angle with scroll offset
      const angle = index * spacing - scrollY * direction * Math.PI * 2

      // Position using polar to cartesian conversion
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius

      // Keep text readable by adding rotation offset for right circle
      const rotationOffset = direction === -1 ? 180 : 0
      const rotation = (angle * 180) / Math.PI + rotationOffset

      // Use left/top for positioning (no transform conflicts)
      item.style.left = `${x}px`
      item.style.top = `${y}px`
      item.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`
    })
  }, [])

  useEffect(() => {
    const wrapper = wrapperRef.current
    const leftWrapper = leftWrapperRef.current
    const rightWrapper = rightWrapperRef.current
    const leftItems = leftItemsRef.current.filter(Boolean) as HTMLLIElement[]
    const rightItems = rightItemsRef.current.filter(Boolean) as HTMLLIElement[]

    if (!wrapper || !leftWrapper || !rightWrapper || 
        leftItems.length === 0 || rightItems.length === 0) return

    // Calculate dimensions and create configs
    const updateDimensions = () => {
      const leftRect = leftWrapper.getBoundingClientRect()
      const rightRect = rightWrapper.getBoundingClientRect()
      
      // Center points relative to their wrappers
      const leftCenterX = leftRect.width / 2
      const leftCenterY = leftRect.height / 2
      const rightCenterX = rightRect.width / 2
      const rightCenterY = rightRect.height / 2
      
      // Radius based on wrapper size
      const leftRadius = Math.min(leftRect.width, leftRect.height) * 0.4
      const rightRadius = Math.min(rightRect.width, rightRect.height) * 0.4

      leftConfigRef.current = {
        items: leftItems,
        centerX: leftCenterX,
        centerY: leftCenterY,
        radius: leftRadius,
        direction: 1, // clockwise
      }

      rightConfigRef.current = {
        items: rightItems,
        centerX: rightCenterX,
        centerY: rightCenterY,
        radius: rightRadius,
        direction: -1, // counterclockwise
      }
    }

    // Initial setup
    updateDimensions()

    // Set initial positions
    if (leftConfigRef.current && rightConfigRef.current) {
      updateItemsPosition(leftConfigRef.current, 0)
      updateItemsPosition(rightConfigRef.current, 0)
    }

    // Create scroll animation
    const trigger = ScrollTrigger.create({
      trigger: wrapper,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const scrollY = self.progress * 0.5

        if (leftConfigRef.current && rightConfigRef.current) {
          updateItemsPosition(leftConfigRef.current, scrollY)
          updateItemsPosition(rightConfigRef.current, scrollY)
        }
      },
    })

    // Handle resize
    const handleResize = () => {
      updateDimensions()
      const currentProgress = trigger.progress * 0.5
      if (leftConfigRef.current && rightConfigRef.current) {
        updateItemsPosition(leftConfigRef.current, currentProgress)
        updateItemsPosition(rightConfigRef.current, currentProgress)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      trigger.kill()
      window.removeEventListener('resize', handleResize)
    }
  }, [updateItemsPosition])

  return (
    <div style={styles.outerContainer}>
      {/* Back button */}
      <Link to="/" style={styles.backButton}>
        ← Back
      </Link>

      {/* Scroll indicator */}
      <div style={styles.scrollIndicator}>
        <span style={styles.scrollText}>Scroll to animate</span>
        <div style={styles.scrollLine} />
      </div>

      <section ref={wrapperRef} style={styles.wrapper}>
        {/* Left circle - rotates clockwise */}
        <ul ref={leftWrapperRef} style={styles.leftWrapper}>
          {ITEMS.map((item, index) => (
            <li
              key={`left-${item}`}
              ref={(el) => { leftItemsRef.current[index] = el }}
              style={styles.textItem}
            >
              {item}
            </li>
          ))}
        </ul>

        {/* Right circle - rotates counterclockwise */}
        <ul ref={rightWrapperRef} style={styles.rightWrapper}>
          {ITEMS.map((item, index) => (
            <li
              key={`right-${item}`}
              ref={(el) => { rightItemsRef.current[index] = el }}
              style={{ ...styles.textItem, textAlign: 'right' }}
            >
              {item}
            </li>
          ))}
        </ul>

        {/* Center branding */}
        <div style={styles.centerBranding}>
          <div style={styles.brandingCircle}>
            <span style={styles.brandingText}>DUAL</span>
            <span style={styles.brandingText}>CIRCLE</span>
          </div>
        </div>
      </section>

      {/* Spacer for scroll length */}
      <div style={styles.spacer}>
        <div style={styles.spacerContent}>
          <h2 style={styles.spacerTitle}>The Motion Continues</h2>
          <p style={styles.spacerText}>
            Keep scrolling to see the circles rotate in opposite directions,
            creating a mesmerizing orbital dance of typography.
          </p>
        </div>
      </div>

      {/* Branding */}
      <div style={styles.branding}>DUAL CIRCLE TEXT</div>

      {/* Font import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  )
}

// ============================================
// Styles
// ============================================

const styles: Record<string, React.CSSProperties> = {
  outerContainer: {
    minHeight: '300vh',
    background: 'linear-gradient(180deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%)',
    fontFamily: "'Space Grotesk', system-ui, sans-serif",
    color: '#ffffff',
    overflow: 'hidden',
  },
  wrapper: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftWrapper: {
    position: 'absolute',
    top: '50%',
    left: '25%',
    transform: 'translate(-50%, -50%)',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    width: 'min(500px, 40vw)',
    height: 'min(500px, 40vw)',
  },
  rightWrapper: {
    position: 'absolute',
    top: '50%',
    left: '75%',
    transform: 'translate(-50%, -50%)',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    width: 'min(500px, 40vw)',
    height: 'min(500px, 40vw)',
  },
  textItem: {
    position: 'absolute',
    fontSize: 'clamp(0.7rem, 1.2vw, 1rem)',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
    opacity: 0.85,
    // left and top will be set dynamically
    // transform will be set dynamically for centering + rotation
  },
  centerBranding: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
    pointerEvents: 'none',
  },
  brandingCircle: {
    width: 'clamp(80px, 10vw, 140px)',
    height: 'clamp(80px, 10vw, 140px)',
    borderRadius: '50%',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
    backdropFilter: 'blur(4px)',
  },
  brandingText: {
    fontSize: 'clamp(0.5rem, 1vw, 0.7rem)',
    fontWeight: 700,
    letterSpacing: '0.3em',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  scrollIndicator: {
    position: 'fixed',
    bottom: 40,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    zIndex: 100,
    opacity: 0.5,
  },
  scrollText: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  scrollLine: {
    width: 1,
    height: 40,
    background: 'linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)',
  },
  spacer: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 2rem',
  },
  spacerContent: {
    textAlign: 'center',
    maxWidth: 600,
  },
  spacerTitle: {
    fontSize: 'clamp(1.5rem, 4vw, 3rem)',
    fontWeight: 700,
    marginBottom: '1rem',
    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  spacerText: {
    fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)',
    lineHeight: 1.7,
    color: 'rgba(255, 255, 255, 0.6)',
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
    transition: 'color 0.2s ease',
  },
  branding: {
    position: 'fixed',
    top: 24,
    right: 24,
    color: 'rgba(255, 255, 255, 0.3)',
    fontFamily: 'monospace',
    fontSize: 10,
    letterSpacing: '0.1em',
    pointerEvents: 'none',
    userSelect: 'none',
  },
}

export default DualCircleText
