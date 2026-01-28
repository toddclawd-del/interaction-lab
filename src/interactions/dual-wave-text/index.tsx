/**
 * Dual Wave Text Animation
 * 
 * Reference: https://tympanus.net/codrops/2026/01/15/building-a-scroll-driven-dual-wave-text-animation-with-gsap/
 * 
 * A scroll-driven animation where two columns of text move in opposing
 * wave patterns, with a centered image that updates based on the focused item.
 * 
 * Key techniques:
 * - Sine wave mathematics for smooth wave motion
 * - GSAP quickTo for 60fps animation performance
 * - Lenis for smooth scrolling
 * - ScrollTrigger for scroll-linked animations
 */

import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { DualWaveAnimation } from './DualWaveAnimation'

gsap.registerPlugin(ScrollTrigger)

// ============================================
// Sample Data
// ============================================

interface Item {
  product: string
  brand: string
  image: string
}

const ITEMS: Item[] = [
  { product: 'Volt R2', brand: 'Tesla', image: 'https://picsum.photos/seed/tesla/400/500' },
  { product: 'Éclat', brand: 'Chanel', image: 'https://picsum.photos/seed/chanel/400/500' },
  { product: 'Project Ion', brand: 'Apple', image: 'https://picsum.photos/seed/apple/400/500' },
  { product: 'AeroLine', brand: 'BMW', image: 'https://picsum.photos/seed/bmw/400/500' },
  { product: 'Série Noir', brand: 'Saint Laurent', image: 'https://picsum.photos/seed/ysl/400/500' },
  { product: 'UltraRun', brand: 'Nike', image: 'https://picsum.photos/seed/nike/400/500' },
  { product: 'Atelier 03', brand: 'Hermès', image: 'https://picsum.photos/seed/hermes/400/500' },
  { product: 'Pulse One', brand: 'Adidas', image: 'https://picsum.photos/seed/adidas/400/500' },
  { product: 'Linea 24', brand: 'Prada', image: 'https://picsum.photos/seed/prada/400/500' },
  { product: 'Echo Series', brand: 'Google', image: 'https://picsum.photos/seed/google/400/500' },
  { product: 'Zero', brand: 'Polestar', image: 'https://picsum.photos/seed/polestar/400/500' },
  { product: 'Shift/Black', brand: 'Balenciaga', image: 'https://picsum.photos/seed/balenciaga/400/500' },
  { product: 'Solar Drift', brand: 'Audi', image: 'https://picsum.photos/seed/audi/400/500' },
  { product: 'Nº 27', brand: 'Valentino', image: 'https://picsum.photos/seed/valentino/400/500' },
  { product: 'Mode/3', brand: 'Samsung', image: 'https://picsum.photos/seed/samsung/400/500' },
  { product: 'Pure Form', brand: 'Bottega Veneta', image: 'https://picsum.photos/seed/bottega/400/500' },
  { product: 'Edge', brand: 'Sony', image: 'https://picsum.photos/seed/sony/400/500' },
  { product: 'Stillwater', brand: 'Aesop', image: 'https://picsum.photos/seed/aesop/400/500' },
  { product: 'Parfum Nº8', brand: 'Dior', image: 'https://picsum.photos/seed/dior/400/500' },
  { product: 'Vantage', brand: 'Porsche', image: 'https://picsum.photos/seed/porsche/400/500' },
]

// ============================================
// Main Component
// ============================================

export function DualWaveText() {
  const containerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const animationRef = useRef<DualWaveAnimation | null>(null)

  useEffect(() => {
    // Initialize Lenis smooth scroll
    lenisRef.current = new Lenis({
      duration: 1.5,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    })

    // Sync Lenis with GSAP ScrollTrigger
    lenisRef.current.on('scroll', ScrollTrigger.update)

    // Add Lenis to GSAP ticker
    gsap.ticker.add((time) => {
      lenisRef.current?.raf(time * 1000)
    })

    // Disable GSAP lag smoothing for immediate response
    gsap.ticker.lagSmoothing(0)

    // Initialize wave animation
    if (wrapperRef.current) {
      animationRef.current = new DualWaveAnimation(wrapperRef.current, {
        waveNumber: 12,
        waveSpeed: 1,
      })
      animationRef.current.init()
    }

    // Cleanup
    return () => {
      animationRef.current?.destroy()
      lenisRef.current?.destroy()
      gsap.ticker.remove(() => {})
    }
  }, [])

  return (
    <div ref={containerRef} style={styles.container}>
      {/* Back button */}
      <Link to="/" style={styles.backButton}>
        ← Back
      </Link>

      {/* Spacer before animation */}
      <div style={styles.spacer} />

      {/* Main animation wrapper */}
      <div
        ref={wrapperRef}
        className="dual-wave-wrapper"
        data-wave-number="12"
        data-wave-speed="1"
        style={styles.waveWrapper}
      >
        {/* Left column - Product names */}
        <div className="wave-column wave-column-left" style={styles.columnLeft}>
          {ITEMS.map((item) => (
            <div
              key={item.product}
              className="animated-text"
              data-image={item.image}
              style={styles.animatedText}
            >
              {item.product}
            </div>
          ))}
        </div>

        {/* Center image thumbnail */}
        <div style={styles.thumbnailWrapper}>
          <img
            src={ITEMS[0].image}
            alt="Campaign"
            className="image-thumbnail"
            style={styles.thumbnail}
          />
        </div>

        {/* Right column - Brand names */}
        <div className="wave-column wave-column-right" style={styles.columnRight}>
          {ITEMS.map((item) => (
            <div
              key={item.brand}
              className="animated-text"
              style={styles.animatedText}
            >
              {item.brand}
            </div>
          ))}
        </div>
      </div>

      {/* Spacer after animation */}
      <div style={styles.spacer} />

      {/* Branding */}
      <div style={styles.branding}>DUAL WAVE TEXT</div>

      {/* Global styles for focus state */}
      <style>{`
        .animated-text {
          color: #4d4d4d;
          transition: color 300ms ease-out;
        }
        .animated-text.focused {
          color: #fff;
        }
        
        /* Mobile adjustments */
        @media (max-width: 768px) {
          .wave-column {
            font-size: 5vw !important;
            gap: 2rem !important;
          }
          .dual-wave-wrapper {
            gap: 8vw !important;
          }
        }
      `}</style>
    </div>
  )
}

// ============================================
// Styles
// ============================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: '#0a0a0a',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    position: 'relative',
    overflowX: 'hidden',
  },
  backButton: {
    position: 'fixed',
    top: 24,
    left: 24,
    color: 'rgba(255,255,255,0.5)',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
    zIndex: 100,
    transition: 'color 0.2s ease',
  },
  spacer: {
    height: '75vh',
  },
  waveWrapper: {
    display: 'flex',
    width: '100%',
    position: 'relative',
    gap: '20vw',
    padding: '0 4vw',
    boxSizing: 'border-box',
  },
  columnLeft: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    fontSize: 'clamp(1.5rem, 4vw, 3rem)',
    fontWeight: 400,
    lineHeight: 0.9,
    position: 'relative',
    zIndex: 10,
    alignItems: 'flex-start',
    textTransform: 'uppercase',
    letterSpacing: '-0.02em',
  },
  columnRight: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    fontSize: 'clamp(1.5rem, 4vw, 3rem)',
    fontWeight: 400,
    lineHeight: 0.9,
    position: 'relative',
    zIndex: 10,
    alignItems: 'flex-end',
    textTransform: 'uppercase',
    letterSpacing: '-0.02em',
  },
  animatedText: {
    width: 'max-content',
    cursor: 'default',
    userSelect: 'none',
  },
  thumbnailWrapper: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '15vw',
    minWidth: 120,
    maxWidth: 200,
    height: 'auto',
    zIndex: 1,
    pointerEvents: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  thumbnail: {
    width: '100%',
    height: 'auto',
    maxHeight: '30vh',
    objectFit: 'cover',
    borderRadius: 8,
    opacity: 0.9,
  },
  branding: {
    position: 'fixed',
    top: 24,
    right: 24,
    color: 'rgba(255,255,255,0.3)',
    fontFamily: 'monospace',
    fontSize: 10,
    letterSpacing: '0.1em',
    pointerEvents: 'none',
    userSelect: 'none',
  },
}

export default DualWaveText
