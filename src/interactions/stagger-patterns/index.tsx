import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'

// ════════════════════════════════════════════════════════════════
// STAGGER PATTERNS — Grid Stagger Animations
// Different stagger patterns: cascade, ripple, random,
// and neighbor-affecting hover effects
// ════════════════════════════════════════════════════════════════

const GRID_SIZE = 8 // 8x8 grid
const GRID_ITEMS = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => i)

type StaggerPattern = 'cascade' | 'ripple' | 'random' | 'neighbor'

export function StaggerPatterns() {
  const containerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const [activePattern, setActivePattern] = useState<StaggerPattern>('cascade')
  const [isAnimating, setIsAnimating] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const playAnimation = useCallback(() => {
    if (isAnimating || !gridRef.current) return
    setIsAnimating(true)

    const items = gridRef.current.querySelectorAll('.grid-item')
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    // Reset all items
    gsap.set(items, { scale: 0, rotation: 0, opacity: 0 })

    if (prefersReducedMotion) {
      gsap.set(items, { scale: 1, opacity: 1 })
      setIsAnimating(false)
      return
    }

    const getStagger = () => {
      switch (activePattern) {
        // ────────────────────────────────────────────────────────
        // CASCADE: From top-left corner diagonally
        // ────────────────────────────────────────────────────────
        case 'cascade':
          return {
            amount: 0.8,
            grid: [GRID_SIZE, GRID_SIZE],
            from: 'start',
            ease: 'power2.inOut',
          }

        // ────────────────────────────────────────────────────────
        // RIPPLE: From center outward
        // ────────────────────────────────────────────────────────
        case 'ripple':
          return {
            amount: 0.6,
            grid: [GRID_SIZE, GRID_SIZE],
            from: 'center',
            ease: 'power1.out',
          }

        // ────────────────────────────────────────────────────────
        // RANDOM: Random order
        // ────────────────────────────────────────────────────────
        case 'random':
          return {
            amount: 1,
            from: 'random',
            ease: 'none',
          }

        default:
          return { amount: 0.5, from: 'start' }
      }
    }

    gsap.to(items, {
      scale: 1,
      rotation: activePattern === 'cascade' ? 360 : 0,
      opacity: 1,
      duration: 0.5,
      ease: 'back.out(1.7)',
      stagger: getStagger(),
      onComplete: () => setIsAnimating(false),
    })
  }, [activePattern, isAnimating])

  // ────────────────────────────────────────────────────────
  // NEIGHBOR EFFECT: Hover affects surrounding cells
  // ────────────────────────────────────────────────────────
  useEffect(() => {
    if (activePattern !== 'neighbor' || hoveredIndex === null || !gridRef.current) return

    const items = gridRef.current.querySelectorAll('.grid-item')
    const row = Math.floor(hoveredIndex / GRID_SIZE)
    const col = hoveredIndex % GRID_SIZE

    items.forEach((item, index) => {
      const itemRow = Math.floor(index / GRID_SIZE)
      const itemCol = index % GRID_SIZE
      
      // Calculate distance from hovered cell
      const distance = Math.sqrt(
        Math.pow(itemRow - row, 2) + Math.pow(itemCol - col, 2)
      )

      // Effect intensity based on distance (closer = stronger)
      const maxDistance = 3
      const intensity = Math.max(0, 1 - distance / maxDistance)

      gsap.to(item, {
        scale: 1 + intensity * 0.5,
        backgroundColor: `hsl(${240 + intensity * 60}, 70%, ${50 + intensity * 20}%)`,
        duration: 0.3,
        ease: 'power2.out',
      })
    })
  }, [hoveredIndex, activePattern])

  // Reset neighbor effect when mouse leaves
  useEffect(() => {
    if (activePattern !== 'neighbor' || hoveredIndex !== null || !gridRef.current) return

    const items = gridRef.current.querySelectorAll('.grid-item')
    gsap.to(items, {
      scale: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      duration: 0.3,
      ease: 'power2.out',
    })
  }, [hoveredIndex, activePattern])

  // Initial animation when pattern changes
  useEffect(() => {
    if (activePattern !== 'neighbor') {
      playAnimation()
    } else {
      // Reset grid for neighbor mode
      if (gridRef.current) {
        const items = gridRef.current.querySelectorAll('.grid-item')
        gsap.set(items, { scale: 1, opacity: 1, rotation: 0 })
      }
    }
  }, [activePattern])

  return (
    <div ref={containerRef} style={styles.container}>
      {/* Back button */}
      <Link to="/" style={styles.backButton}>← Back</Link>

      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>Stagger Patterns</h1>
        <p style={styles.subtitle}>
          Different ways to stagger grid animations in GSAP
        </p>
      </header>

      {/* Pattern selector */}
      <div style={styles.selector}>
        {[
          { key: 'cascade', label: 'Cascade', desc: 'From corner' },
          { key: 'ripple', label: 'Ripple', desc: 'From center' },
          { key: 'random', label: 'Random', desc: 'Random order' },
          { key: 'neighbor', label: 'Neighbor', desc: 'Hover effect' },
        ].map(({ key, label, desc }) => (
          <button
            key={key}
            onClick={() => setActivePattern(key as StaggerPattern)}
            style={{
              ...styles.selectorButton,
              ...(activePattern === key ? styles.selectorButtonActive : {}),
            }}
          >
            <span style={styles.buttonLabel}>{label}</span>
            <span style={styles.buttonDesc}>{desc}</span>
          </button>
        ))}
      </div>

      {/* Play button (not for neighbor mode) */}
      {activePattern !== 'neighbor' && (
        <div style={styles.playButtonContainer}>
          <button 
            style={styles.playButton}
            onClick={playAnimation}
            disabled={isAnimating}
          >
            {isAnimating ? 'Animating...' : 'Play Animation'}
          </button>
        </div>
      )}

      {/* Grid */}
      <div 
        ref={gridRef} 
        style={styles.grid}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {GRID_ITEMS.map((_, index) => (
          <div
            key={index}
            className="grid-item"
            style={styles.gridItem}
            onMouseEnter={() => activePattern === 'neighbor' && setHoveredIndex(index)}
          />
        ))}
      </div>

      {/* Pattern description */}
      <div style={styles.description}>
        {activePattern === 'cascade' && (
          <>
            <h3>Cascade Pattern</h3>
            <p>
              Items animate diagonally from the top-left corner. Uses GSAP's grid stagger 
              with <code>from: "start"</code>.
            </p>
            <pre style={styles.code}>
{`stagger: {
  amount: 0.8,
  grid: [8, 8],
  from: 'start'
}`}
            </pre>
          </>
        )}
        {activePattern === 'ripple' && (
          <>
            <h3>Ripple Pattern</h3>
            <p>
              Items expand outward from the center like a ripple. Uses <code>from: "center"</code>.
            </p>
            <pre style={styles.code}>
{`stagger: {
  amount: 0.6,
  grid: [8, 8],
  from: 'center'
}`}
            </pre>
          </>
        )}
        {activePattern === 'random' && (
          <>
            <h3>Random Pattern</h3>
            <p>
              Items animate in random order. Perfect for confetti-like effects.
            </p>
            <pre style={styles.code}>
{`stagger: {
  amount: 1,
  from: 'random'
}`}
            </pre>
          </>
        )}
        {activePattern === 'neighbor' && (
          <>
            <h3>Neighbor Effect</h3>
            <p>
              Hover over cells. Nearby cells scale and change color based on distance. 
              Calculated using Euclidean distance formula.
            </p>
            <pre style={styles.code}>
{`// Distance from hovered cell
const distance = Math.sqrt(
  (itemRow - hoverRow)² + 
  (itemCol - hoverCol)²
)

// Intensity falloff
const intensity = 1 - distance / maxDistance`}
            </pre>
          </>
        )}
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
    gap: '0.75rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  selectorButton: {
    padding: '0.75rem 1.5rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    color: 'rgba(255, 255, 255, 0.6)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem',
  },
  selectorButtonActive: {
    background: 'rgba(255, 255, 255, 0.15)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    color: '#fff',
  },
  buttonLabel: {
    fontSize: '0.95rem',
    fontWeight: 600,
  },
  buttonDesc: {
    fontSize: '0.7rem',
    opacity: 0.6,
  },
  playButtonContainer: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  playButton: {
    padding: '0.75rem 2rem',
    background: '#6366f1',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
    gap: '8px',
    maxWidth: '500px',
    margin: '0 auto',
    padding: '2rem',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  gridItem: {
    aspectRatio: '1',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  description: {
    maxWidth: '600px',
    margin: '3rem auto 0',
    padding: '1.5rem',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  code: {
    background: 'rgba(0, 0, 0, 0.3)',
    padding: '1rem',
    borderRadius: '8px',
    fontSize: '0.8rem',
    overflow: 'auto',
    fontFamily: 'monospace',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 1.5,
    marginTop: '1rem',
  },
}

export default StaggerPatterns
