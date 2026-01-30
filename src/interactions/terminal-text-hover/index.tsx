/**
 * Terminal Text Hover - Character Scramble Animation
 * 
 * Reference: https://tympanus.net/codrops/2024/06/19/hover-animations-for-terminal-like-typography/
 * 
 * A retro terminal-inspired hover effect that scrambles characters
 * into random symbols before settling back to the original text.
 * Perfect for menus, lists, and navigation elements.
 * 
 * Variations:
 * - Cursor: Shows a blinking cursor indicator during animation
 * - Background: Reveals a sliding background element
 * - Color: Characters flash random colors during scramble
 * - Blur: Background with frosted glass effect
 * 
 * Key techniques:
 * - SplitType for character-level DOM access
 * - GSAP for staggered timeline animations
 * - CSS custom properties for cursor/background effects
 * - repeatRefresh for random values on each cycle
 */

import { useRef, useEffect, useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { TextAnimator, AnimationVariant } from './text-animator'

// ============================================
// Types
// ============================================

interface DataRow {
  id: number
  name: string
  location: string
  date: string
  code: string
}

// ============================================
// Sample Data - Sci-fi aesthetic
// ============================================

const VOLCANIC_DATA: DataRow[] = [
  { id: 1, name: 'Mount Vespera', location: 'Planet Thalassa', date: '2157-03-14', code: 'V6' },
  { id: 2, name: 'Kraxion', location: 'Exo-Planet Zyra', date: '2243-11-09', code: 'K7' },
  { id: 3, name: 'Helion Peak', location: 'Planet Elara', date: '2180-05-18', code: 'H5' },
  { id: 4, name: 'Pyrosphere', location: 'Moon Xanthe', date: '2291-06-15', code: 'P6' },
  { id: 5, name: 'Vulcanus', location: 'Asteroid B-612', date: '2312-08-22', code: 'V5' },
  { id: 6, name: 'Tarkon Fury', location: 'Planet Drakonis', date: '2455-12-01', code: 'T8' },
  { id: 7, name: 'Aether Plume', location: 'Planet Ganymede', date: '2379-04-10', code: 'A4' },
  { id: 8, name: 'Mount Zenith', location: 'Planet Lumina', date: '2392-09-21', code: 'Z6' },
]

const VARIANTS: { key: AnimationVariant; label: string }[] = [
  { key: 'cursor', label: 'Cursor' },
  { key: 'background', label: 'Background' },
  { key: 'color', label: 'Color' },
  { key: 'blur', label: 'Blur' },
]

// ============================================
// HoverText Component - Reusable animated text
// ============================================

interface HoverTextProps {
  children: string
  variant: AnimationVariant
  className?: string
}

function HoverText({ children, variant, className = '' }: HoverTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const animatorRef = useRef<TextAnimator | null>(null)
  
  useEffect(() => {
    if (!ref.current) return
    
    // Create animator instance
    animatorRef.current = new TextAnimator(ref.current, { variant })
    
    return () => {
      animatorRef.current?.destroy()
    }
  }, [variant])
  
  const handleMouseEnter = useCallback(() => {
    animatorRef.current?.animate()
  }, [])
  
  const handleMouseLeave = useCallback(() => {
    animatorRef.current?.animateOut()
  }, [])
  
  return (
    <span
      ref={ref}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={styles.hoverText}
    >
      {children}
    </span>
  )
}

// ============================================
// ListRow Component
// ============================================

interface ListRowProps {
  data: DataRow
  variant: AnimationVariant
  index: number
}

function ListRow({ data, variant, index }: ListRowProps) {
  return (
    <li style={styles.listItem} className="terminal-list-item">
      <span style={styles.listNumber}>
        {String(index + 1).padStart(2, '0')}
      </span>
      <HoverText variant={variant}>{data.name}</HoverText>
      <HoverText variant={variant}>{data.location}</HoverText>
      <HoverText variant={variant}>{data.date}</HoverText>
      <HoverText variant={variant}>{data.code}</HoverText>
    </li>
  )
}

// ============================================
// Main Component
// ============================================

export function TerminalTextHover() {
  const [variant, setVariant] = useState<AnimationVariant>('cursor')
  
  return (
    <div style={styles.container} className={`demo-${variant}`}>
      {/* Scanlines overlay for retro effect */}
      <div style={styles.scanlines} />
      
      {/* Back button */}
      <Link to="/" style={styles.backButton}>
        ← Back
      </Link>
      
      {/* Variant selector */}
      <nav style={styles.nav}>
        <span style={styles.navLabel}>Variant:</span>
        <div style={styles.variantButtons}>
          {VARIANTS.map(v => (
            <button
              key={v.key}
              onClick={() => setVariant(v.key)}
              style={{
                ...styles.variantButton,
                ...(variant === v.key ? styles.variantButtonActive : {}),
              }}
            >
              {v.label}
            </button>
          ))}
        </div>
      </nav>
      
      {/* Content */}
      <main style={styles.content}>
        <h2 style={styles.sectionTitle}>Volcanic Eruptions Database</h2>
        
        <ul style={styles.list}>
          {VOLCANIC_DATA.map((row, i) => (
            <ListRow key={row.id} data={row} variant={variant} index={i} />
          ))}
        </ul>
        
        {/* Demo links */}
        <div style={styles.linksSection}>
          <h3 style={styles.linksTitle}>Navigation Links</h3>
          <div style={styles.links}>
            <HoverText variant={variant}>Projects</HoverText>
            <HoverText variant={variant}>About</HoverText>
            <HoverText variant={variant}>Contact</HoverText>
            <HoverText variant={variant}>Archive</HoverText>
          </div>
        </div>
      </main>
      
      {/* Branding */}
      <div style={styles.branding}>TERMINAL_V1.0</div>
      
      {/* CSS for hover effects - injected as style tag */}
      <style>{`
        /* Base hover effect styles */
        .hover-effect {
          font-kerning: none;
          position: relative;
          white-space: nowrap;
          display: inline-block;
        }
        
        .hover-effect .word {
          white-space: nowrap;
        }
        
        .hover-effect .char {
          position: relative;
          display: inline-block;
        }
        
        /* Cursor variant - blinking cursor indicator */
        .hover-effect--cursor .char {
          --cursor-opacity: 0;
        }
        
        .hover-effect--cursor .char::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 1ch;
          height: 100%;
          background: currentColor;
          opacity: var(--cursor-opacity);
        }
        
        /* Background variant - sliding bg reveal */
        .hover-effect--bg {
          --bg-scale: 0;
        }
        
        .hover-effect--bg::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: calc(100% + 4px);
          background-color: rgba(255, 255, 255, 0.15);
          mix-blend-mode: difference;
          transform-origin: 0% 50%;
          transform: scaleX(var(--bg-scale));
          pointer-events: none;
        }
        
        /* Blur variant - frosted glass background */
        .hover-effect--blur {
          --bg-scale: 0;
        }
        
        .hover-effect--blur::before {
          content: '';
          position: absolute;
          left: -8px;
          right: -8px;
          top: -6px;
          bottom: -6px;
          background-color: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-radius: 4px;
          transform-origin: 50% 100%;
          transform: scaleY(var(--bg-scale));
          pointer-events: none;
          z-index: -1;
        }
        
        /* Demo-specific color schemes */
        .demo-cursor {
          --bg-color: #fff;
          --text-color: #000;
          --accent-color: #000;
        }
        
        .demo-background {
          --bg-color: #252a33;
          --text-color: #c7c0b3;
          --accent-color: #5b6b85;
        }
        
        .demo-color {
          --bg-color: #1d2619;
          --text-color: #c5c5c5;
          --accent-color: #41483e;
        }
        
        .demo-blur {
          --bg-color: #0a0a0a;
          --text-color: rgba(255, 255, 255, 0.9);
          --accent-color: #2d2d2d;
        }
        
        /* Responsive list */
        @media (max-width: 768px) {
          .terminal-list-item {
            grid-template-columns: 40px 1fr !important;
            gap: 0.5rem 1rem !important;
          }
          .terminal-list-item > span:nth-child(n+4) {
            display: none;
          }
        }
        
        @media (min-width: 769px) and (max-width: 1024px) {
          .terminal-list-item {
            grid-template-columns: 50px 1fr 1fr auto !important;
          }
          .terminal-list-item > span:nth-child(5) {
            display: none;
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
    backgroundColor: 'var(--bg-color, #0a0a0a)',
    color: 'var(--text-color, #fff)',
    fontFamily: '"JetBrains Mono", "SF Mono", "Fira Code", monospace',
    textTransform: 'uppercase',
    padding: '2rem',
    paddingTop: '100px',
    position: 'relative',
    transition: 'background-color 0.4s ease, color 0.4s ease',
  },
  scanlines: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,0.15) 3px)',
    backgroundSize: 'auto 100%',
    pointerEvents: 'none',
    zIndex: 100,
  },
  backButton: {
    position: 'fixed',
    top: 24,
    left: 24,
    color: 'var(--text-color)',
    opacity: 0.5,
    textDecoration: 'none',
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: '0.05em',
    zIndex: 101,
    fontFamily: '"JetBrains Mono", monospace',
    textTransform: 'uppercase',
  },
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 2rem',
    paddingLeft: '100px',
    background: 'var(--bg-color)',
    borderBottom: '1px solid rgba(128, 128, 128, 0.2)',
    zIndex: 50,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: '0.1em',
    opacity: 0.5,
  },
  variantButtons: {
    display: 'flex',
    gap: '0.5rem',
  },
  variantButton: {
    padding: '0.4rem 0.75rem',
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: 'var(--text-color)',
    opacity: 0.5,
    background: 'transparent',
    border: '1px solid rgba(128, 128, 128, 0.3)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: '"JetBrains Mono", monospace',
  },
  variantButtonActive: {
    opacity: 1,
    background: 'rgba(128, 128, 128, 0.2)',
    borderColor: 'rgba(128, 128, 128, 0.5)',
  },
  content: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: '0.15em',
    color: 'var(--accent-color, rgba(255,255,255,0.4))',
    marginBottom: '1.5rem',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  listItem: {
    display: 'grid',
    gridTemplateColumns: '50px 1fr 1fr 120px 60px',
    gap: '1rem 2rem',
    alignItems: 'baseline',
    padding: '0.75rem 0',
    borderBottom: '1px solid rgba(128, 128, 128, 0.1)',
    fontSize: 14,
  },
  listNumber: {
    fontSize: 12,
    fontWeight: 600,
    opacity: 0.4,
  },
  hoverText: {
    cursor: 'pointer',
    lineHeight: 1.4,
  },
  linksSection: {
    marginTop: '4rem',
  },
  linksTitle: {
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: '0.15em',
    color: 'var(--accent-color, rgba(255,255,255,0.4))',
    marginBottom: '1.5rem',
  },
  links: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '2rem',
    fontSize: 18,
  },
  branding: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    fontSize: 10,
    letterSpacing: '0.15em',
    opacity: 0.25,
    fontFamily: '"JetBrains Mono", monospace',
    zIndex: 101,
  },
}

export default TerminalTextHover
