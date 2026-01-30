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
  { key: 'glitch', label: 'Glitch' },
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
      data-text={children}
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

// Boot sequence messages
const BOOT_MESSAGES = [
  'SYSTEM INIT...',
  'LOADING KERNEL v3.14.159',
  'MEMORY CHECK: 640K OK',
  'VOLCANIC DATABASE ONLINE',
  'READY_',
]

function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([''])
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const [started, setStarted] = useState(false)
  
  // Start typing after a brief delay (helps mobile)
  useEffect(() => {
    const startDelay = setTimeout(() => setStarted(true), 100)
    return () => clearTimeout(startDelay)
  }, [])
  
  useEffect(() => {
    if (!started) return
    
    if (currentLine >= BOOT_MESSAGES.length) {
      // Boot complete
      const timeout = setTimeout(onComplete, 800)
      return () => clearTimeout(timeout)
    }
    
    const message = BOOT_MESSAGES[currentLine]
    
    if (currentChar < message.length) {
      // Type next character
      const timeout = setTimeout(() => {
        setLines(prev => {
          const newLines = [...prev]
          newLines[currentLine] = message.slice(0, currentChar + 1)
          return newLines
        })
        setCurrentChar(c => c + 1)
      }, 30 + Math.random() * 40)
      return () => clearTimeout(timeout)
    } else {
      // Line complete, move to next
      const timeout = setTimeout(() => {
        setLines(prev => [...prev, ''])
        setCurrentLine(l => l + 1)
        setCurrentChar(0)
      }, 200 + Math.random() * 300)
      return () => clearTimeout(timeout)
    }
  }, [started, currentLine, currentChar, onComplete])
  
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      fontFamily: '"JetBrains Mono", monospace',
      color: '#00ff41',
    }}>
      <div style={{ maxWidth: 500, padding: '2rem' }}>
        {lines.map((line, i) => (
          <div key={i} className="boot-line" style={{ marginBottom: '0.5rem', fontSize: 14 }}>
            <span style={{ color: '#666', marginRight: '1rem' }}>[{String(i).padStart(2, '0')}]</span>
            {line}
            {i === currentLine && <span className="boot-cursor" />}
          </div>
        ))}
      </div>
    </div>
  )
}

export function TerminalTextHover() {
  const [variant, setVariant] = useState<AnimationVariant>('cursor')
  const [crtMode, setCrtMode] = useState(false)
  const [showBoot, setShowBoot] = useState(true)
  
  // Skip boot on subsequent visits (session storage)
  useEffect(() => {
    if (sessionStorage.getItem('terminal-booted')) {
      setShowBoot(false)
    }
  }, [])
  
  const handleBootComplete = () => {
    setShowBoot(false)
    sessionStorage.setItem('terminal-booted', 'true')
  }
  
  if (showBoot) {
    return <BootSequence onComplete={handleBootComplete} />
  }
  
  return (
    <div style={styles.container} className={`demo-${variant} ${crtMode ? 'crt-mode' : ''}`}>
      {/* Scanlines overlay for retro effect */}
      <div style={styles.scanlines} className="scanlines" />
      
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
        
        {/* CRT Mode Toggle */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={styles.navLabel}>CRT:</span>
          <button
            onClick={() => setCrtMode(!crtMode)}
            style={{
              ...styles.variantButton,
              ...(crtMode ? styles.variantButtonActive : {}),
              minWidth: 50,
            }}
          >
            {crtMode ? 'ON' : 'OFF'}
          </button>
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
        
        .demo-glitch {
          --bg-color: #0d0d0d;
          --text-color: #00ff41;
          --accent-color: #003d0f;
        }
        
        /* Glitch effect styles */
        .hover-effect--glitch {
          --glitch-intensity: 0;
          --glitch-x: 0;
          --glitch-skew: 0;
          position: relative;
          transform: translateX(calc(var(--glitch-x) * 1px)) skewX(calc(var(--glitch-skew) * 1deg));
        }
        
        .hover-effect--glitch::before,
        .hover-effect--glitch::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: var(--glitch-intensity);
          pointer-events: none;
        }
        
        .hover-effect--glitch::before {
          color: #ff0040;
          transform: translateX(-2px);
          clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
        }
        
        .hover-effect--glitch::after {
          color: #00ffff;
          transform: translateX(2px);
          clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
        }
        
        /* CRT mode */
        .crt-mode {
          border-radius: 20px;
          overflow: hidden;
        }
        
        .crt-mode::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 90%, rgba(0,0,0,0.6) 100%);
          pointer-events: none;
          z-index: 99;
        }
        
        .crt-mode .scanlines {
          background-image: 
            repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,0.2) 3px, rgba(0,0,0,0.2) 4px),
            repeating-linear-gradient(90deg, rgba(255,0,0,0.03), rgba(0,255,0,0.03) 1px, rgba(0,0,255,0.03) 2px);
        }
        
        /* Boot sequence */
        .boot-line {
          overflow: hidden;
          white-space: nowrap;
        }
        
        .boot-cursor {
          display: inline-block;
          width: 0.6em;
          height: 1.1em;
          background: currentColor;
          margin-left: 2px;
          vertical-align: text-bottom;
          animation: blink 0.7s step-end infinite;
        }
        
        @keyframes blink {
          50% { opacity: 0; }
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
    backgroundImage: 'repeating-linear-gradient(transparent, transparent 4px, rgba(0,0,0,0.1) 5px)',
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
