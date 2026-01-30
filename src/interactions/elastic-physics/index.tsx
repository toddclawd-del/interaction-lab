import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'

// ════════════════════════════════════════════════════════════════
// ELASTIC PHYSICS — Bouncy/Springy Effects
// GSAP elastic and bounce easing for physics-based animations:
// elastic buttons, bouncy cards, jelly text, rubber band scroll
// ════════════════════════════════════════════════════════════════

export function ElasticPhysics() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [, setCardsAnimated] = useState(false)
  const jellyTextRef = useRef<HTMLDivElement>(null)
  const [overscrollY, setOverscrollY] = useState(0)

  // ────────────────────────────────────────────────────────────
  // ELASTIC BUTTON HOVER
  // ────────────────────────────────────────────────────────────
  const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement>, isEnter: boolean) => {
    const target = e.currentTarget
    
    if (isEnter) {
      gsap.to(target, {
        scale: 1.1,
        duration: 0.6,
        ease: 'elastic.out(1, 0.3)',
      })
    } else {
      gsap.to(target, {
        scale: 1,
        duration: 0.8,
        ease: 'elastic.out(1, 0.3)',
      })
    }
  }

  // ────────────────────────────────────────────────────────────
  // BOUNCY CARD ENTRANCE
  // ────────────────────────────────────────────────────────────
  const animateCards = () => {
    setCardsAnimated(false)
    
    const cards = document.querySelectorAll('.bouncy-card')
    
    // Reset
    gsap.set(cards, { y: 100, opacity: 0, scale: 0.8 })
    
    // Animate with bounce
    gsap.to(cards, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: 'bounce.out',
      stagger: 0.1,
      onComplete: () => setCardsAnimated(true),
    })
  }

  // ────────────────────────────────────────────────────────────
  // JELLY TEXT WOBBLE
  // ────────────────────────────────────────────────────────────
  const wobbleText = () => {
    if (!jellyTextRef.current) return
    
    const chars = jellyTextRef.current.querySelectorAll('.jelly-char')
    
    // Reset first
    gsap.set(chars, { scaleX: 1, scaleY: 1, rotation: 0 })
    
    // Wobble each character
    gsap.to(chars, {
      keyframes: [
        { scaleX: 1.3, scaleY: 0.7, rotation: -5, duration: 0.1 },
        { scaleX: 0.7, scaleY: 1.3, rotation: 5, duration: 0.1 },
        { scaleX: 1.15, scaleY: 0.85, rotation: -3, duration: 0.1 },
        { scaleX: 0.9, scaleY: 1.1, rotation: 2, duration: 0.1 },
        { scaleX: 1, scaleY: 1, rotation: 0, duration: 0.2, ease: 'elastic.out(1, 0.3)' },
      ],
      stagger: 0.03,
    })
  }

  // ────────────────────────────────────────────────────────────
  // RUBBER BAND OVERSCROLL
  // ────────────────────────────────────────────────────────────
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    const { scrollTop, scrollHeight, clientHeight } = target
    
    // Check for overscroll at top or bottom
    if (scrollTop <= 0) {
      // At top, check for overscroll (on mobile this works naturally)
      setOverscrollY(Math.max(0, -scrollTop))
    } else if (scrollTop + clientHeight >= scrollHeight) {
      // At bottom
      setOverscrollY(scrollTop + clientHeight - scrollHeight)
    } else {
      setOverscrollY(0)
    }
  }

  const handleScrollEnd = () => {
    // Snap back with elastic
    gsap.to({ val: overscrollY }, {
      val: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)',
      onUpdate: function() {
        setOverscrollY(this.targets()[0].val)
      },
    })
  }

  return (
    <div ref={containerRef} style={styles.container}>
      {/* Back button */}
      <Link to="/" style={styles.backButton}>← Back</Link>

      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>Elastic Physics</h1>
        <p style={styles.subtitle}>
          GSAP's elastic and bounce easing for natural, springy animations
        </p>
      </header>

      <div style={styles.demos}>

        {/* 1. Elastic Button Hover */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionNumber}>01</span>
            <h2 style={styles.sectionTitle}>Elastic Button Hover</h2>
            <p style={styles.sectionDesc}>
              Hover over buttons to see elastic scale effect
            </p>
          </div>
          <div style={styles.buttonGrid}>
            {['Primary', 'Secondary', 'Outline'].map((label, i) => (
              <button
                key={label}
                style={{
                  ...styles.elasticButton,
                  background: i === 0 ? '#6366f1' : i === 1 ? '#22c55e' : 'transparent',
                  border: i === 2 ? '2px solid #fff' : 'none',
                }}
                onMouseEnter={(e) => handleButtonHover(e, true)}
                onMouseLeave={(e) => handleButtonHover(e, false)}
              >
                {label}
              </button>
            ))}
          </div>
          <pre style={styles.code}>
{`ease: 'elastic.out(1, 0.3)'
// (amplitude, period)
// Higher amplitude = more bounce
// Lower period = faster oscillation`}
          </pre>
        </section>

        {/* 2. Bouncy Card Entrance */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionNumber}>02</span>
            <h2 style={styles.sectionTitle}>Bouncy Card Entrance</h2>
            <p style={styles.sectionDesc}>
              Cards drop in with bounce easing
            </p>
          </div>
          <button style={styles.triggerButton} onClick={animateCards}>
            Replay Animation
          </button>
          <div style={styles.cardGrid}>
            {['📊', '📈', '📉', '💹'].map((emoji, i) => (
              <div key={i} className="bouncy-card" style={styles.bouncyCard}>
                <span style={{ fontSize: '2.5rem' }}>{emoji}</span>
                <span style={styles.cardLabel}>Stat {i + 1}</span>
              </div>
            ))}
          </div>
          <pre style={styles.code}>
{`ease: 'bounce.out'
// Classic bounce effect
// Great for items "landing"`}
          </pre>
        </section>

        {/* 3. Jelly Text Wobble */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionNumber}>03</span>
            <h2 style={styles.sectionTitle}>Jelly Text Wobble</h2>
            <p style={styles.sectionDesc}>
              Click to make the text wobble like jelly
            </p>
          </div>
          <div 
            ref={jellyTextRef}
            style={styles.jellyContainer}
            onClick={wobbleText}
          >
            {'JELLY'.split('').map((char, i) => (
              <span
                key={i}
                className="jelly-char"
                style={styles.jellyChar}
              >
                {char}
              </span>
            ))}
          </div>
          <p style={styles.clickHint}>Click the text!</p>
          <pre style={styles.code}>
{`keyframes: [
  { scaleX: 1.3, scaleY: 0.7 },  // squish
  { scaleX: 0.7, scaleY: 1.3 },  // stretch
  { scaleX: 1, scaleY: 1 }       // settle
]`}
          </pre>
        </section>

        {/* 4. Rubber Band Scroll */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionNumber}>04</span>
            <h2 style={styles.sectionTitle}>Rubber Band Scroll</h2>
            <p style={styles.sectionDesc}>
              Simulating iOS-style overscroll (try scrolling to the top/bottom)
            </p>
          </div>
          <div 
            style={{
              ...styles.scrollContainer,
              transform: `translateY(${overscrollY * 0.3}px)`,
            }}
            onScroll={handleScroll}
            onMouseUp={handleScrollEnd}
            onTouchEnd={handleScrollEnd}
          >
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} style={styles.scrollItem}>
                Item {i + 1}
              </div>
            ))}
          </div>
          <pre style={styles.code}>
{`// On overscroll end:
ease: 'elastic.out(1, 0.5)'
// Snaps back with natural bounce`}
          </pre>
        </section>

        {/* Easing Comparison */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionNumber}>05</span>
            <h2 style={styles.sectionTitle}>Easing Comparison</h2>
            <p style={styles.sectionDesc}>
              Visual comparison of physics-based easings
            </p>
          </div>
          <EasingDemo />
        </section>

      </div>
    </div>
  )
}

// Easing demonstration component
function EasingDemo() {
  const barRefs = useRef<(HTMLDivElement | null)[]>([])
  const [isPlaying, setIsPlaying] = useState(false)

  const easings = [
    { name: 'elastic.out(1, 0.3)', color: '#6366f1' },
    { name: 'bounce.out', color: '#22c55e' },
    { name: 'back.out(1.7)', color: '#f59e0b' },
    { name: 'power4.out', color: '#ec4899' },
  ]

  const playDemo = () => {
    if (isPlaying) return
    setIsPlaying(true)

    // Reset
    barRefs.current.forEach(bar => {
      if (bar) gsap.set(bar, { scaleX: 0 })
    })

    // Animate each bar with its easing
    barRefs.current.forEach((bar, i) => {
      if (!bar) return
      
      gsap.to(bar, {
        scaleX: 1,
        duration: 1.5,
        ease: easings[i].name,
        delay: 0.1,
      })
    })

    setTimeout(() => setIsPlaying(false), 2000)
  }

  return (
    <div>
      <button style={styles.triggerButton} onClick={playDemo} disabled={isPlaying}>
        {isPlaying ? 'Playing...' : 'Play Comparison'}
      </button>
      <div style={styles.easingGrid}>
        {easings.map((easing, i) => (
          <div key={easing.name} style={styles.easingRow}>
            <span style={styles.easingLabel}>{easing.name}</span>
            <div style={styles.easingTrack}>
              <div
                ref={el => { barRefs.current[i] = el }}
                style={{
                  ...styles.easingBar,
                  background: easing.color,
                }}
              />
            </div>
          </div>
        ))}
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
    marginBottom: '3rem',
    maxWidth: '600px',
    margin: '0 auto 3rem',
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
  demos: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4rem',
    maxWidth: '800px',
    margin: '0 auto',
  },
  section: {
    padding: '2rem',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  sectionHeader: {
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  sectionNumber: {
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.3)',
    fontFamily: 'monospace',
    letterSpacing: '0.1em',
    display: 'block',
    marginBottom: '0.5rem',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
  },
  sectionDesc: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  buttonGrid: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
    marginBottom: '1.5rem',
  },
  elasticButton: {
    padding: '1rem 2rem',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    willChange: 'transform',
    minHeight: '48px',
    minWidth: '120px',
    border: 'none',
  },
  triggerButton: {
    display: 'block',
    margin: '0 auto 1.5rem',
    padding: '0.875rem 1.75rem',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    minHeight: '48px',
    minWidth: '140px',
    transition: 'background 0.3s ease, border-color 0.3s ease',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  bouncyCard: {
    padding: '1.5rem',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  cardLabel: {
    display: 'block',
    marginTop: '0.5rem',
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  jellyContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.25rem',
    padding: '2rem',
    cursor: 'pointer',
    userSelect: 'none',
  },
  jellyChar: {
    display: 'inline-block',
    fontSize: 'clamp(3rem, 10vw, 5rem)',
    fontWeight: 800,
    color: '#fff',
    willChange: 'transform',
  },
  clickHint: {
    textAlign: 'center',
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.4)',
    marginBottom: '1rem',
  },
  scrollContainer: {
    height: '200px',
    overflow: 'auto',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    marginBottom: '1.5rem',
    willChange: 'transform',
  },
  scrollItem: {
    padding: '1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    fontSize: '0.9rem',
  },
  code: {
    background: 'rgba(0, 0, 0, 0.3)',
    padding: '1rem',
    borderRadius: '8px',
    fontSize: '0.75rem',
    fontFamily: 'monospace',
    color: 'rgba(255, 255, 255, 0.7)',
    overflow: 'auto',
    lineHeight: 1.5,
  },
  easingGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: '1.5rem',
  },
  easingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  easingLabel: {
    width: '160px',
    fontSize: '0.75rem',
    fontFamily: 'monospace',
    color: 'rgba(255, 255, 255, 0.6)',
    flexShrink: 0,
  },
  easingTrack: {
    flex: 1,
    height: '24px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  easingBar: {
    height: '100%',
    transformOrigin: 'left center',
    transform: 'scaleX(0)',
    borderRadius: '4px',
  },
}

export default ElasticPhysics
