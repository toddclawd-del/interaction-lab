/**
 * 3D Cylinder Text Scroll Animation
 * 
 * Reference: https://tympanus.net/codrops/2025/11/04/creating-3d-scroll-driven-text-animations-with-css-and-gsap/
 * 
 * Text items positioned around an invisible cylinder that reveals itself 
 * as you scroll. Uses CSS 3D transforms with GSAP ScrollTrigger.
 * 
 * Key techniques:
 * - CSS perspective and transform-style: preserve-3d
 * - Trigonometric positioning (sin/cos) for cylindrical layout
 * - GSAP ScrollTrigger for scroll-linked rotation
 * - backface-visibility: hidden for clean 3D effect
 */

import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ============================================
// Sample Data - Creative Agency Services
// ============================================

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
]

// ============================================
// Main Component
// ============================================

export function CylinderText() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const textWrapperRef = useRef<HTMLUListElement>(null)
  const titleRef = useRef<HTMLParagraphElement>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    const wrapper = wrapperRef.current
    const textWrapper = textWrapperRef.current
    const title = titleRef.current
    const items = itemRefs.current.filter(Boolean) as HTMLLIElement[]

    if (!wrapper || !textWrapper || !title || items.length === 0) return

    // Calculate and apply 3D positions
    const calculatePositions = () => {
      const offset = 0.4
      const radius = Math.min(window.innerWidth, window.innerHeight) * offset
      const spacing = 180 / items.length

      items.forEach((item, index) => {
        const angle = (index * spacing * Math.PI) / 180
        const rotationAngle = index * -spacing

        const x = 0
        const y = Math.sin(angle) * radius
        const z = Math.cos(angle) * radius

        item.style.transform = `translate3d(-50%, -50%, 0) translate3d(${x}px, ${y}px, ${z}px) rotateX(${rotationAngle}deg)`
      })
    }

    calculatePositions()

    // Create scroll-triggered rotation
    const trigger = ScrollTrigger.create({
      trigger: title,
      start: 'center center',
      end: '+=2000vh',
      pin: wrapper,
      scrub: 2,
      animation: gsap.fromTo(
        textWrapper,
        { rotateX: -80 },
        { rotateX: 270, ease: 'none' }
      ),
    })

    // Handle resize
    const handleResize = () => calculatePositions()
    window.addEventListener('resize', handleResize)

    return () => {
      trigger.kill()
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div style={styles.outerContainer}>
      {/* Back button */}
      <Link to="/" style={styles.backButton}>
        ← Back
      </Link>

      <div ref={wrapperRef} style={styles.wrapper}>
        <p ref={titleRef} style={styles.title}>
          Keep scrolling to see the animation
        </p>

        <ul ref={textWrapperRef} style={styles.textWrapper}>
          {ITEMS.map((item, index) => (
            <li
              key={item}
              ref={(el) => { itemRefs.current[index] = el }}
              style={styles.textItem}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Branding */}
      <div style={styles.branding}>CYLINDER TEXT</div>

      {/* Global styles for backface visibility */}
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
    background: 'linear-gradient(180deg, #5046e4 0%, #3730a3 100%)',
    fontFamily: "'Space Grotesk', system-ui, sans-serif",
  },
  wrapper: {
    width: '100%',
    height: '100vh',
    position: 'relative',
    perspective: '70vw',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10rem',
  },
  title: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 'clamp(0.875rem, 2vw, 1.125rem)',
    fontWeight: 400,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    margin: 0,
  },
  textWrapper: {
    position: 'absolute',
    fontSize: 'clamp(2rem, 5vw, 4rem)',
    lineHeight: 1,
    width: '100%',
    height: '100%',
    transformStyle: 'preserve-3d',
    transformOrigin: 'center center',
    fontWeight: 700,
    textAlign: 'center',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  textItem: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: '100%',
    backfaceVisibility: 'hidden',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: '-0.02em',
    textShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
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

export default CylinderText
