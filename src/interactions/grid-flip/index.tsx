/**
 * Grid Layout Transitions with GSAP Flip
 * 
 * Reference: https://tympanus.net/codrops/2026/01/20/animating-responsive-grid-layout-transitions-with-gsap-flip/
 * 
 * Smooth grid layout transitions triggered by density buttons.
 * GSAP Flip captures element positions and animates between layouts.
 * 
 * Key techniques:
 * - GSAP Flip plugin for layout state capture and animation
 * - CSS Grid with dynamic column counts via data attributes
 * - Staggered animations with random order for visual interest
 * - Blur/brightness effects during transition
 */

import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { Flip } from 'gsap/dist/Flip'

gsap.registerPlugin(Flip)

// ============================================
// Sample Images - Using picsum.photos
// ============================================

interface GridItem {
  id: number
  aspectRatio: string
  image: string
}

const ITEMS: GridItem[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  aspectRatio: ['1/1', '4/5', '16/9', '3/4', '5/4', '9/16'][i % 6],
  image: `https://picsum.photos/seed/grid${i + 1}/400/500`,
}))

const GRID_SIZES = ['50%', '75%', '100%', '125%', '150%'] as const
type GridSize = typeof GRID_SIZES[number]

// ============================================
// Main Component
// ============================================

export function GridFlip() {
  const [currentSize, setCurrentSize] = useState<GridSize>('75%')
  const [useStagger, setUseStagger] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const isAnimating = useRef(false)

  const handleSizeChange = (newSize: GridSize) => {
    if (isAnimating.current || newSize === currentSize) return
    if (!gridRef.current) return

    isAnimating.current = true

    // Capture current state of all grid items
    const items = itemRefs.current.filter(Boolean) as HTMLDivElement[]
    const state = Flip.getState(items)

    // Update size (triggers CSS change)
    setCurrentSize(newSize)

    // Wait for React to update DOM, then animate
    requestAnimationFrame(() => {
      if (useStagger) {
        // Version 2: With stagger and blur effect
        const flipDuration = 1
        const staggerAmount = 0.3

        Flip.from(state, {
          absolute: true,
          duration: flipDuration,
          ease: 'expo.inOut',
          stagger: {
            amount: staggerAmount,
            from: 'random',
          },
          onComplete: () => {
            isAnimating.current = false
          },
        })

        // Blur effect on container
        gsap.fromTo(
          gridRef.current,
          { filter: 'blur(0px) brightness(100%)' },
          {
            duration: flipDuration + staggerAmount,
            keyframes: [
              {
                filter: 'blur(10px) brightness(150%)',
                duration: (flipDuration + staggerAmount) * 0.5,
                ease: 'power2.in',
              },
              {
                filter: 'blur(0px) brightness(100%)',
                duration: (flipDuration + staggerAmount) * 0.5,
                ease: 'power2.out',
              },
            ],
          }
        )
      } else {
        // Version 1: Simple smooth transition
        Flip.from(state, {
          duration: 0.8,
          ease: 'expo.inOut',
          onComplete: () => {
            isAnimating.current = false
          },
        })
      }
    })
  }

  return (
    <div style={styles.container}>
      {/* Back button */}
      <Link to="/" style={styles.backButton}>
        ← Back
      </Link>

      {/* Controls */}
      <nav style={styles.nav}>
        <div style={styles.modeToggle}>
          <button
            style={{
              ...styles.modeButton,
              ...(useStagger ? {} : styles.modeButtonActive),
            }}
            onClick={() => setUseStagger(false)}
          >
            Default
          </button>
          <button
            style={{
              ...styles.modeButton,
              ...(useStagger ? styles.modeButtonActive : {}),
            }}
            onClick={() => setUseStagger(true)}
          >
            Filter + Stagger
          </button>
        </div>

        <div style={styles.sizeButtons}>
          {GRID_SIZES.map((size) => (
            <button
              key={size}
              style={{
                ...styles.sizeButton,
                ...(currentSize === size ? styles.sizeButtonActive : {}),
              }}
              onClick={() => handleSizeChange(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </nav>

      {/* Grid Gallery */}
      <div
        ref={gridRef}
        style={{
          ...styles.grid,
          gridTemplateColumns: getGridColumns(currentSize),
        }}
      >
        {ITEMS.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => { itemRefs.current[index] = el }}
            style={styles.gridItem}
          >
            <div
              style={{
                ...styles.image,
                backgroundImage: `url(${item.image})`,
                aspectRatio: item.aspectRatio,
              }}
            />
            <p style={styles.itemNumber}>
              {String(item.id).padStart(2, '0')}
            </p>
          </div>
        ))}
      </div>

      {/* Branding */}
      <div style={styles.branding}>GRID FLIP</div>
    </div>
  )
}

// Helper to get grid columns based on size
function getGridColumns(size: GridSize): string {
  const columns: Record<GridSize, number> = {
    '50%': 16,
    '75%': 10,
    '100%': 8,
    '125%': 6,
    '150%': 4,
  }
  return `repeat(${columns[size]}, 1fr)`
}

// ============================================
// Styles
// ============================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: '#0a0a0a',
    fontFamily: 'Inter, system-ui, sans-serif',
    padding: '1rem',
    paddingTop: '120px',
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
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    paddingLeft: '100px',
    background: 'rgba(10, 10, 10, 0.9)',
    backdropFilter: 'blur(10px)',
    zIndex: 50,
  },
  modeToggle: {
    display: 'flex',
    gap: '0.5rem',
  },
  modeButton: {
    padding: '0.5rem 1rem',
    fontSize: '0.75rem',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'rgba(255, 255, 255, 0.5)',
    background: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  modeButtonActive: {
    color: '#fff',
    background: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  sizeButtons: {
    display: 'flex',
    gap: '0.25rem',
  },
  sizeButton: {
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.5)',
    background: 'rgba(255, 255, 255, 0.05)',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  sizeButtonActive: {
    color: '#fff',
    background: 'rgba(255, 255, 255, 0.15)',
  },
  grid: {
    display: 'grid',
    gap: '1.5rem',
    width: '100%',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  gridItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  image: {
    width: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'brightness(0.8)',
    transition: 'filter 0.3s ease',
    borderRadius: '2px',
  },
  itemNumber: {
    fontSize: '0.675rem',
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: '0.5rem',
    fontFamily: 'monospace',
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

export default GridFlip
