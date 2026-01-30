import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'

// ════════════════════════════════════════════════════════════════
// CURSOR PLAYGROUND — Custom Cursor Effects
// Various cursor effects: trailing, dynamic text, blob morph,
// and spotlight reveal
// ════════════════════════════════════════════════════════════════

export function CursorPlayground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeDemo, setActiveDemo] = useState<'trail' | 'text' | 'blob' | 'spotlight'>('trail')
  
  // Cursor refs
  const trailCursorsRef = useRef<(HTMLDivElement | null)[]>([])
  const textCursorRef = useRef<HTMLDivElement>(null)
  const blobCursorRef = useRef<HTMLDivElement>(null)
  const spotlightRef = useRef<HTMLDivElement>(null)
  
  // Current cursor text
  const [cursorText, setCursorText] = useState('Explore')
  
  // Mouse position
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // Global mouse tracking
      const handleMouseMove = (e: MouseEvent) => {
        mouseRef.current = { x: e.clientX, y: e.clientY }
      }
      
      window.addEventListener('mousemove', handleMouseMove)

      // ────────────────────────────────────────────────────────
      // 1. TRAILING CURSOR
      // Multiple cursors that follow with increasing delay
      // ────────────────────────────────────────────────────────
      if (activeDemo === 'trail') {
        const trailCursors = trailCursorsRef.current.filter(Boolean)
        
        gsap.ticker.add(() => {
          trailCursors.forEach((cursor, index) => {
            if (!cursor) return
            
            // Each cursor has more delay than the previous
            const delay = 0.05 + index * 0.03
            
            gsap.to(cursor, {
              x: mouseRef.current.x,
              y: mouseRef.current.y,
              duration: delay,
              ease: 'power2.out',
            })
          })
        })
      }

      // ────────────────────────────────────────────────────────
      // 2. TEXT CURSOR
      // Cursor with dynamic text that changes on hover
      // ────────────────────────────────────────────────────────
      if (activeDemo === 'text') {
        const textCursor = textCursorRef.current
        if (!textCursor) return
        
        gsap.ticker.add(() => {
          gsap.to(textCursor, {
            x: mouseRef.current.x,
            y: mouseRef.current.y,
            duration: 0.15,
            ease: 'power2.out',
          })
        })
      }

      // ────────────────────────────────────────────────────────
      // 3. BLOB CURSOR
      // Morphing blob that stretches based on velocity
      // ────────────────────────────────────────────────────────
      if (activeDemo === 'blob') {
        const blobCursor = blobCursorRef.current
        if (!blobCursor) return
        
        let lastX = 0
        let lastY = 0
        
        gsap.ticker.add(() => {
          const { x, y } = mouseRef.current
          
          // Calculate velocity
          const dx = x - lastX
          const dy = y - lastY
          const velocity = Math.sqrt(dx * dx + dy * dy)
          const angle = Math.atan2(dy, dx) * (180 / Math.PI)
          
          // Stretch based on velocity
          const scaleX = 1 + Math.min(velocity * 0.02, 0.8)
          const scaleY = 1 - Math.min(velocity * 0.01, 0.3)
          
          gsap.to(blobCursor, {
            x,
            y,
            scaleX,
            scaleY,
            rotation: angle,
            duration: 0.15,
            ease: 'power2.out',
          })
          
          lastX = x
          lastY = y
        })
      }

      // ────────────────────────────────────────────────────────
      // 4. SPOTLIGHT
      // Reveals hidden content underneath
      // ────────────────────────────────────────────────────────
      if (activeDemo === 'spotlight') {
        const spotlight = spotlightRef.current
        if (!spotlight) return
        
        gsap.ticker.add(() => {
          gsap.to(spotlight, {
            x: mouseRef.current.x,
            y: mouseRef.current.y,
            duration: 0.1,
            ease: 'none',
          })
        })
      }

      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
      }
    }, containerRef)

    return () => ctx.revert()
  }, [activeDemo])

  return (
    <div ref={containerRef} style={styles.container}>
      {/* Back button */}
      <Link to="/" style={styles.backButton}>← Back</Link>

      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>Cursor Playground</h1>
        <p style={styles.subtitle}>
          Select a cursor effect and move your mouse around
        </p>
      </header>

      {/* Demo selector */}
      <div style={styles.selector} role="tablist" aria-label="Cursor effect demos">
        {[
          { key: 'trail', label: 'Trailing' },
          { key: 'text', label: 'Dynamic Text' },
          { key: 'blob', label: 'Blob Morph' },
          { key: 'spotlight', label: 'Spotlight' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveDemo(key as typeof activeDemo)}
            style={{
              ...styles.selectorButton,
              ...(activeDemo === key ? styles.selectorButtonActive : {}),
            }}
            role="tab"
            aria-selected={activeDemo === key}
            aria-label={`Select ${label} cursor effect`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Demo area */}
      <div style={{ ...styles.demoArea, cursor: 'none' }}>
        
        {/* Trail Demo */}
        {activeDemo === 'trail' && (
          <>
            <div style={styles.demoContent}>
              <h2 style={styles.demoTitle}>Trailing Cursor</h2>
              <p style={styles.demoDesc}>
                Multiple circles follow your cursor with increasing delay
              </p>
            </div>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                ref={el => { trailCursorsRef.current[i] = el }}
                style={{
                  ...styles.trailCursor,
                  width: 20 - i * 2,
                  height: 20 - i * 2,
                  opacity: 1 - i * 0.1,
                  background: `hsl(${i * 30 + 200}, 70%, 60%)`,
                }}
              />
            ))}
          </>
        )}

        {/* Text Demo */}
        {activeDemo === 'text' && (
          <>
            <div style={styles.demoContent}>
              <h2 style={styles.demoTitle}>Dynamic Text Cursor</h2>
              <p style={styles.demoDesc}>
                Hover over the buttons to change cursor text
              </p>
              <div style={styles.hoverTargets}>
                <div 
                  style={styles.hoverTarget}
                  onMouseEnter={() => setCursorText('View')}
                  onMouseLeave={() => setCursorText('Explore')}
                >
                  Project 1
                </div>
                <div 
                  style={styles.hoverTarget}
                  onMouseEnter={() => setCursorText('Play')}
                  onMouseLeave={() => setCursorText('Explore')}
                >
                  Video
                </div>
                <div 
                  style={styles.hoverTarget}
                  onMouseEnter={() => setCursorText('Drag')}
                  onMouseLeave={() => setCursorText('Explore')}
                >
                  Slider
                </div>
              </div>
            </div>
            <div
              ref={textCursorRef}
              style={styles.textCursor}
            >
              <span style={styles.cursorTextContent}>{cursorText}</span>
            </div>
          </>
        )}

        {/* Blob Demo */}
        {activeDemo === 'blob' && (
          <>
            <div style={styles.demoContent}>
              <h2 style={styles.demoTitle}>Blob Cursor</h2>
              <p style={styles.demoDesc}>
                Move faster to see the blob stretch based on velocity
              </p>
            </div>
            <div
              ref={blobCursorRef}
              style={styles.blobCursor}
            />
          </>
        )}

        {/* Spotlight Demo */}
        {activeDemo === 'spotlight' && (
          <>
            {/* Hidden content layer */}
            <div style={styles.spotlightBackground}>
              <div style={styles.spotlightHiddenContent}>
                <h2 style={{ fontSize: '4rem', fontWeight: 800 }}>HIDDEN</h2>
                <p style={{ fontSize: '1.5rem', opacity: 0.7 }}>
                  Move cursor to reveal
                </p>
                <div style={styles.spotlightEmojis}>
                  🎯 🚀 ✨ 🌟 💎
                </div>
              </div>
            </div>
            {/* Overlay with hole */}
            <div 
              ref={spotlightRef}
              style={styles.spotlightOverlay}
            />
            {/* Foreground instructions */}
            <div style={{ ...styles.demoContent, zIndex: 5, pointerEvents: 'none' }}>
              <p style={{ ...styles.demoDesc, color: 'rgba(255,255,255,0.7)' }}>
                Move your cursor to reveal the hidden content
              </p>
            </div>
          </>
        )}

      </div>

      {/* Code notes */}
      <div style={styles.codeNotes}>
        <h3>Key Techniques</h3>
        <ul>
          <li><strong>Trail:</strong> Multiple elements with staggered gsap.to() duration</li>
          <li><strong>Text:</strong> State-driven text + smooth position following</li>
          <li><strong>Blob:</strong> Calculate velocity, apply scaleX/scaleY + rotation</li>
          <li><strong>Spotlight:</strong> Radial gradient mask follows cursor position</li>
        </ul>
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
    marginBottom: '2rem',
    maxWidth: '600px',
    margin: '0 auto 2rem',
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
  },
  selector: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  selectorButton: {
    padding: '0.875rem 1.5rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minHeight: '48px',
  },
  selectorButtonActive: {
    background: 'rgba(255, 255, 255, 0.15)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    color: '#fff',
  },
  demoArea: {
    position: 'relative',
    minHeight: '60vh',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  demoContent: {
    textAlign: 'center',
    zIndex: 1,
  },
  demoTitle: {
    fontSize: '2rem',
    fontWeight: 600,
    marginBottom: '1rem',
  },
  demoDesc: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: '2rem',
  },
  
  // Trail cursor styles
  trailCursor: {
    position: 'fixed',
    borderRadius: '50%',
    pointerEvents: 'none',
    zIndex: 9999,
    transform: 'translate(-50%, -50%)',
    mixBlendMode: 'difference',
  },
  
  // Text cursor styles
  textCursor: {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 9999,
    transform: 'translate(-50%, -50%)',
  },
  cursorTextContent: {
    display: 'block',
    padding: '0.5rem 1rem',
    background: '#fff',
    color: '#000',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  hoverTargets: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  hoverTarget: {
    padding: '2rem 3rem',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    fontSize: '1.1rem',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    cursor: 'none',
    minHeight: '80px',
    minWidth: '120px',
  },
  
  // Blob cursor styles
  blobCursor: {
    position: 'fixed',
    width: '50px',
    height: '50px',
    background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
    borderRadius: '50%',
    pointerEvents: 'none',
    zIndex: 9999,
    transform: 'translate(-50%, -50%)',
    mixBlendMode: 'difference',
  },
  
  // Spotlight styles
  spotlightBackground: {
    position: 'absolute',
    inset: 0,
    background: '#0a0a0a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  spotlightHiddenContent: {
    textAlign: 'center',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    padding: '4rem',
    borderRadius: '20px',
    border: '2px solid #6366f1',
  },
  spotlightEmojis: {
    fontSize: '3rem',
    marginTop: '1rem',
    letterSpacing: '0.5rem',
  },
  spotlightOverlay: {
    position: 'fixed',
    width: '250px',
    height: '250px',
    background: 'radial-gradient(circle, transparent 0%, transparent 40%, #0a0a0a 40%)',
    pointerEvents: 'none',
    zIndex: 10,
    transform: 'translate(-50%, -50%)',
    boxShadow: '0 0 0 9999px #0a0a0a',
  },
  
  codeNotes: {
    maxWidth: '600px',
    margin: '3rem auto 0',
    padding: '1.5rem',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    fontSize: '0.9rem',
    lineHeight: 1.7,
  },
}

export default CursorPlayground
