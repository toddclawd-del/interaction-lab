/**
 * Terminal Text Hover - Landing Page
 * 
 * A retro terminal-inspired hover effect that scrambles characters
 * into random symbols before settling back to the original text.
 */

import { useRef, useEffect, useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { TextAnimator, AnimationVariant } from './text-animator'

// ════════════════════════════════════════════════════════════════
// TYPES & DATA
// ════════════════════════════════════════════════════════════════

interface DataRow {
  id: number
  name: string
  location: string
  date: string
  code: string
}

const VOLCANIC_DATA: DataRow[] = [
  { id: 1, name: 'Mount Vespera', location: 'Planet Thalassa', date: '2157-03-14', code: 'V6' },
  { id: 2, name: 'Kraxion', location: 'Exo-Planet Zyra', date: '2243-11-09', code: 'K7' },
  { id: 3, name: 'Helion Peak', location: 'Planet Elara', date: '2180-05-18', code: 'H5' },
  { id: 4, name: 'Pyrosphere', location: 'Moon Xanthe', date: '2291-06-15', code: 'P6' },
  { id: 5, name: 'Vulcanus', location: 'Asteroid B-612', date: '2312-08-22', code: 'V5' },
  { id: 6, name: 'Tarkon Fury', location: 'Planet Drakonis', date: '2455-12-01', code: 'T8' },
]

const VARIANTS: { key: AnimationVariant; label: string; desc: string }[] = [
  { key: 'cursor', label: 'Cursor', desc: 'Blinking cursor indicator during animation' },
  { key: 'background', label: 'Background', desc: 'Sliding background reveal effect' },
  { key: 'color', label: 'Color', desc: 'Characters flash random colors' },
  { key: 'blur', label: 'Blur', desc: 'Frosted glass background effect' },
  { key: 'glitch', label: 'Glitch', desc: 'RGB split + displacement distortion' },
]

const FEATURES = [
  { icon: '⌨️', title: 'Character-Level Animation', desc: 'SplitType breaks text into individual characters for precise control' },
  { icon: '🎲', title: 'Randomized Scramble', desc: 'Each character cycles through random symbols before settling' },
  { icon: '🎨', title: '5 Visual Variants', desc: 'Cursor, background, color, blur, and glitch effects' },
  { icon: '📱', title: 'Mobile Ready', desc: 'IntersectionObserver triggers on scroll for touch devices' },
]

const TECH_STACK = ['React', 'TypeScript', 'GSAP', 'SplitType', 'CSS Variables']

const BOOT_MESSAGES = [
  'SYSTEM INIT...',
  'LOADING KERNEL v3.14.159',
  'MEMORY CHECK: 640K OK',
  'TERMINAL_TEXT_HOVER ONLINE',
  'READY_',
]

// ════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ════════════════════════════════════════════════════════════════

// Check if device supports hover
const supportsHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

interface HoverTextProps {
  children: string
  variant: AnimationVariant
  className?: string
}

function HoverText({ children, variant, className = '' }: HoverTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const animatorRef = useRef<TextAnimator | null>(null)
  const hasAnimated = useRef(false)
  
  useEffect(() => {
    if (!ref.current) return
    
    animatorRef.current = new TextAnimator(ref.current, { variant })
    
    if (!supportsHover) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasAnimated.current) {
              hasAnimated.current = true
              setTimeout(() => {
                animatorRef.current?.animate()
              }, Math.random() * 300)
            }
          })
        },
        { threshold: 0.5, rootMargin: '-50px' }
      )
      
      observer.observe(ref.current)
      
      return () => {
        observer.disconnect()
        animatorRef.current?.destroy()
      }
    }
    
    return () => {
      animatorRef.current?.destroy()
    }
  }, [variant])
  
  const handleMouseEnter = useCallback(() => {
    if (supportsHover) animatorRef.current?.animate()
  }, [])
  
  const handleMouseLeave = useCallback(() => {
    if (supportsHover) animatorRef.current?.animateOut()
  }, [])
  
  const handleTap = useCallback(() => {
    if (!supportsHover) animatorRef.current?.animate()
  }, [])
  
  return (
    <span
      ref={ref}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleTap}
      style={styles.hoverText}
      data-text={children}
    >
      {children}
    </span>
  )
}

function ListRow({ data, variant, index }: { data: DataRow; variant: AnimationVariant; index: number }) {
  return (
    <li style={styles.listItem} className="terminal-list-item">
      <span style={styles.listNumber}>{String(index + 1).padStart(2, '0')}</span>
      <HoverText variant={variant}>{data.name}</HoverText>
      <HoverText variant={variant}>{data.location}</HoverText>
      <HoverText variant={variant}>{data.date}</HoverText>
      <HoverText variant={variant}>{data.code}</HoverText>
    </li>
  )
}

// ════════════════════════════════════════════════════════════════
// BOOT SEQUENCE
// ════════════════════════════════════════════════════════════════

function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([''])
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const [started, setStarted] = useState(false)
  
  useEffect(() => {
    const startDelay = setTimeout(() => setStarted(true), 100)
    return () => clearTimeout(startDelay)
  }, [])
  
  useEffect(() => {
    if (!started) return
    
    if (currentLine >= BOOT_MESSAGES.length) {
      const timeout = setTimeout(onComplete, 800)
      return () => clearTimeout(timeout)
    }
    
    const message = BOOT_MESSAGES[currentLine]
    
    if (currentChar < message.length) {
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
      const timeout = setTimeout(() => {
        setLines(prev => [...prev, ''])
        setCurrentLine(l => l + 1)
        setCurrentChar(0)
      }, 200 + Math.random() * 300)
      return () => clearTimeout(timeout)
    }
  }, [started, currentLine, currentChar, onComplete])
  
  return (
    <div style={styles.bootScreen}>
      <div style={{ maxWidth: 500, padding: '2rem' }}>
        {lines.map((line, i) => (
          <div key={i} className="boot-line" style={styles.bootLine}>
            <span style={styles.bootLineNum}>[{String(i).padStart(2, '0')}]</span>
            {line}
            {i === currentLine && <span className="boot-cursor" />}
          </div>
        ))}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// HEADER
// ════════════════════════════════════════════════════════════════

function Header({ crtMode, setCrtMode }: { crtMode: boolean; setCrtMode: (v: boolean) => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return (
    <header style={{
      ...styles.header,
      background: scrolled ? 'rgba(10, 10, 10, 0.95)' : 'transparent',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
    }}>
      <div style={styles.headerInner}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>⌨️</span>
          <span style={styles.logoText}>Terminal Text</span>
        </Link>
        
        <nav style={styles.headerNav}>
          <a href="#demo" style={styles.headerLink}>Demo</a>
          <a href="#features" style={styles.headerLink}>Features</a>
          <a href="#about" style={styles.headerLink}>About</a>
          <a 
            href="https://github.com/toddclawd-del/interaction-lab/tree/main/src/interactions/terminal-text-hover"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.headerLink}
          >
            GitHub
          </a>
          <button
            onClick={() => setCrtMode(!crtMode)}
            style={{
              ...styles.crtToggle,
              background: crtMode ? 'var(--text-color)' : 'transparent',
              color: crtMode ? 'var(--bg-color)' : 'var(--text-color)',
            }}
          >
            CRT {crtMode ? 'ON' : 'OFF'}
          </button>
        </nav>
        
        <button 
          style={styles.menuButton}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span style={{ ...styles.menuLine, transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <span style={{ ...styles.menuLine, opacity: menuOpen ? 0 : 1 }} />
          <span style={{ ...styles.menuLine, transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>
      </div>
      
      {/* Mobile menu */}
      <div style={{
        ...styles.mobileMenu,
        maxHeight: menuOpen ? '400px' : '0',
        padding: menuOpen ? '1rem 1.5rem' : '0 1.5rem',
        opacity: menuOpen ? 1 : 0,
      }}>
        <a href="#demo" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Demo</a>
        <a href="#features" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Features</a>
        <a href="#about" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>About</a>
        <a 
          href="https://github.com/toddclawd-del/interaction-lab/tree/main/src/interactions/terminal-text-hover"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.mobileLink}
        >
          GitHub →
        </a>
        <button
          onClick={() => { setCrtMode(!crtMode); setMenuOpen(false) }}
          style={{ ...styles.mobileLink, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}
        >
          CRT Mode: {crtMode ? 'ON' : 'OFF'}
        </button>
      </div>
    </header>
  )
}

// ════════════════════════════════════════════════════════════════
// HERO SECTION
// ════════════════════════════════════════════════════════════════

function Hero({ variant }: { variant: AnimationVariant }) {
  return (
    <section style={styles.hero}>
      <div style={styles.heroContent}>
        <div style={styles.badge}>
          <span style={styles.badgeDot} />
          Open Source Interaction
        </div>
        
        <h1 style={styles.heroTitle}>
          <HoverText variant={variant}>Terminal</HoverText>
          <br />
          <HoverText variant={variant}>Text Hover</HoverText>
        </h1>
        
        <p style={styles.heroSubtitle}>
          A retro terminal-inspired hover effect. Characters scramble into 
          random symbols before settling back — perfect for menus, lists, 
          and navigation elements.
        </p>
        
        <div style={styles.heroCtas}>
          <a href="#demo" style={styles.primaryCta}>
            Try the Demo ↓
          </a>
          <a 
            href="https://github.com/toddclawd-del/interaction-lab/tree/main/src/interactions/terminal-text-hover"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.secondaryCta}
          >
            View Source →
          </a>
        </div>
      </div>
    </section>
  )
}

// ════════════════════════════════════════════════════════════════
// DEMO SECTION
// ════════════════════════════════════════════════════════════════

function Demo({ variant, setVariant }: { variant: AnimationVariant; setVariant: (v: AnimationVariant) => void }) {
  return (
    <section id="demo" style={styles.demoSection}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>Interactive Demo</h2>
        <p style={styles.sectionSubtitle}>
          Hover over the text below (or scroll on mobile) to see the effect in action.
        </p>
      </div>
      
      {/* Variant Selector */}
      <div style={styles.variantSelector}>
        <span style={styles.variantLabel}>Select Variant:</span>
        <div style={styles.variantGrid}>
          {VARIANTS.map(v => (
            <button
              key={v.key}
              onClick={() => setVariant(v.key)}
              style={{
                ...styles.variantButton,
                ...(variant === v.key ? styles.variantButtonActive : {}),
              }}
            >
              <span style={styles.variantName}>{v.label}</span>
              <span style={styles.variantDesc}>{v.desc}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Demo Content */}
      <div style={styles.demoBox}>
        <h3 style={styles.demoTitle}>Volcanic Eruptions Database</h3>
        
        <ul style={styles.list}>
          {VOLCANIC_DATA.map((row, i) => (
            <ListRow key={row.id} data={row} variant={variant} index={i} />
          ))}
        </ul>
        
        <div style={styles.navDemo}>
          <h4 style={styles.navDemoTitle}>Navigation Links</h4>
          <div style={styles.navLinks}>
            <HoverText variant={variant}>Projects</HoverText>
            <HoverText variant={variant}>About</HoverText>
            <HoverText variant={variant}>Contact</HoverText>
            <HoverText variant={variant}>Archive</HoverText>
          </div>
        </div>
      </div>
    </section>
  )
}

// ════════════════════════════════════════════════════════════════
// FEATURES SECTION
// ════════════════════════════════════════════════════════════════

function Features() {
  return (
    <section id="features" style={styles.featuresSection}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>Features</h2>
        <p style={styles.sectionSubtitle}>What makes this interaction special.</p>
      </div>
      
      <div style={styles.featuresGrid}>
        {FEATURES.map((f, i) => (
          <div key={i} style={styles.featureCard}>
            <span style={styles.featureIcon}>{f.icon}</span>
            <h3 style={styles.featureTitle}>{f.title}</h3>
            <p style={styles.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ════════════════════════════════════════════════════════════════
// ABOUT SECTION
// ════════════════════════════════════════════════════════════════

function About() {
  return (
    <section id="about" style={styles.aboutSection}>
      <div style={styles.aboutContent}>
        <div style={styles.aboutText}>
          <h2 style={styles.sectionTitle}>About This Effect</h2>
          <p style={styles.aboutDesc}>
            Inspired by retro terminal interfaces and the iconic "10 PRINT" one-liner from 1982. 
            This effect uses GSAP's powerful animation engine combined with SplitType for 
            character-level text manipulation.
          </p>
          <p style={styles.aboutDesc}>
            The scramble effect creates that classic hacker aesthetic — characters cycling 
            through random symbols before resolving to their final form. Perfect for adding 
            personality to menus, navigation, and data displays.
          </p>
          
          <div style={styles.techStack}>
            <span style={styles.techLabel}>Built with:</span>
            <div style={styles.techBadges}>
              {TECH_STACK.map(tech => (
                <span key={tech} style={styles.techBadge}>{tech}</span>
              ))}
            </div>
          </div>
        </div>
        
        <div style={styles.codePreview}>
          <div style={styles.codeHeader}>
            <span style={styles.codeDot} />
            <span style={styles.codeDot} />
            <span style={styles.codeDot} />
            <span style={styles.codeFileName}>usage.tsx</span>
          </div>
          <pre style={styles.codeBlock}>
{`import { TextAnimator } from './text-animator'

// Create animator
const animator = new TextAnimator(
  element,
  { variant: 'cursor' }
)

// Trigger on hover
element.onmouseenter = () => {
  animator.animate()
}`}
          </pre>
        </div>
      </div>
    </section>
  )
}

// ════════════════════════════════════════════════════════════════
// FOOTER
// ════════════════════════════════════════════════════════════════

function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerInner}>
        <div style={styles.footerBrand}>
          <span style={styles.footerLogo}>⌨️ Terminal Text Hover</span>
          <p style={styles.footerTagline}>Part of the Interaction Lab collection.</p>
        </div>
        
        <div style={styles.footerLinks}>
          <div style={styles.footerCol}>
            <h4 style={styles.footerColTitle}>Source</h4>
            <a 
              href="https://github.com/toddclawd-del/interaction-lab/tree/main/src/interactions/terminal-text-hover"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.footerLink}
            >
              View Code
            </a>
            <a 
              href="https://github.com/toddclawd-del/interaction-lab"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.footerLink}
            >
              Full Repo
            </a>
          </div>
          
          <div style={styles.footerCol}>
            <h4 style={styles.footerColTitle}>More Labs</h4>
            <Link to="/" style={styles.footerLink}>Interaction Lab</Link>
            <a 
              href="https://toddclawd-del.github.io/shader-playground"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.footerLink}
            >
              Shader Playground
            </a>
          </div>
          
          <div style={styles.footerCol}>
            <h4 style={styles.footerColTitle}>Credits</h4>
            <a 
              href="https://tympanus.net/codrops/2024/06/19/hover-animations-for-terminal-like-typography/"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.footerLink}
            >
              Codrops Tutorial
            </a>
            <a 
              href="https://gsap.com"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.footerLink}
            >
              GSAP
            </a>
          </div>
        </div>
      </div>
      
      <div style={styles.footerBottom}>
        <span style={styles.footerCopy}>© 2025 Open Source under MIT</span>
        <span style={styles.footerVersion}>TERMINAL_V2.0</span>
      </div>
    </footer>
  )
}

// ════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════

export function TerminalTextHover() {
  const [variant, setVariant] = useState<AnimationVariant>('cursor')
  const [crtMode, setCrtMode] = useState(false)
  const [showBoot, setShowBoot] = useState(true)
  
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
      <div style={styles.scanlines} className="scanlines" />
      
      <Header crtMode={crtMode} setCrtMode={setCrtMode} />
      <Hero variant={variant} />
      <Demo variant={variant} setVariant={setVariant} />
      <Features />
      <About />
      <Footer />
      
      <style>{globalStyles}</style>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// STYLES
// ════════════════════════════════════════════════════════════════

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: 'var(--bg-color, #0a0a0a)',
    color: 'var(--text-color, #fff)',
    fontFamily: '"JetBrains Mono", "SF Mono", "Fira Code", monospace',
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
    pointerEvents: 'none',
    zIndex: 100,
  },
  
  // BOOT
  bootScreen: {
    position: 'fixed',
    inset: 0,
    background: '#0a0a0a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    fontFamily: '"JetBrains Mono", monospace',
    color: '#00ff41',
  },
  bootLine: {
    marginBottom: '0.5rem',
    fontSize: 14,
  },
  bootLineNum: {
    color: '#666',
    marginRight: '1rem',
  },
  
  // HEADER
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  },
  headerInner: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '1rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    color: 'var(--text-color)',
  },
  logoIcon: { fontSize: '1.25rem' },
  logoText: { fontSize: '1rem', fontWeight: 600, letterSpacing: '-0.02em' },
  headerNav: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
  },
  headerLink: {
    color: 'var(--text-color)',
    opacity: 0.6,
    textDecoration: 'none',
    fontSize: '0.85rem',
    transition: 'opacity 0.2s',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  crtToggle: {
    padding: '0.4rem 0.75rem',
    border: '1px solid var(--text-color)',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    transition: 'all 0.2s',
  },
  menuButton: {
    display: 'none',
    flexDirection: 'column',
    gap: '5px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '5px',
  },
  menuLine: {
    width: '22px',
    height: '2px',
    background: 'var(--text-color)',
    transition: 'all 0.3s ease',
  },
  mobileMenu: {
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    background: 'var(--bg-color)',
    borderTop: '1px solid rgba(255,255,255,0.1)',
  },
  mobileLink: {
    color: 'var(--text-color)',
    opacity: 0.8,
    textDecoration: 'none',
    fontSize: '0.9rem',
    padding: '0.5rem 0',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  
  // HERO
  hero: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6rem 1.5rem 4rem',
    textAlign: 'center',
  },
  heroContent: {
    maxWidth: '700px',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 14px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 500,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom: '2rem',
  },
  badgeDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#22c55e',
    boxShadow: '0 0 10px #22c55e',
  },
  heroTitle: {
    fontSize: 'clamp(3rem, 12vw, 6rem)',
    fontWeight: 700,
    letterSpacing: '-0.04em',
    lineHeight: 1,
    marginBottom: '1.5rem',
    textTransform: 'uppercase',
  },
  heroSubtitle: {
    fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
    opacity: 0.6,
    lineHeight: 1.7,
    marginBottom: '2.5rem',
    maxWidth: '500px',
    margin: '0 auto 2.5rem',
  },
  heroCtas: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryCta: {
    padding: '0.8rem 1.75rem',
    background: 'var(--text-color)',
    color: 'var(--bg-color)',
    borderRadius: '4px',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    transition: 'transform 0.2s',
  },
  secondaryCta: {
    padding: '0.8rem 1.75rem',
    background: 'transparent',
    color: 'var(--text-color)',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '4px',
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    transition: 'border-color 0.2s',
  },
  
  // DEMO
  demoSection: {
    padding: '6rem 1.5rem',
    borderTop: '1px solid rgba(255,255,255,0.1)',
  },
  sectionHeader: {
    maxWidth: '600px',
    margin: '0 auto 3rem',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    marginBottom: '0.75rem',
    textTransform: 'uppercase',
  },
  sectionSubtitle: {
    fontSize: '0.9rem',
    opacity: 0.5,
    lineHeight: 1.6,
  },
  variantSelector: {
    maxWidth: '900px',
    margin: '0 auto 2rem',
  },
  variantLabel: {
    display: 'block',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    opacity: 0.5,
    marginBottom: '1rem',
    textAlign: 'center',
  },
  variantGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '0.75rem',
  },
  variantButton: {
    padding: '1rem',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    color: 'inherit',
    textAlign: 'left',
    transition: 'all 0.2s',
  },
  variantButtonActive: {
    background: 'rgba(255,255,255,0.1)',
    borderColor: 'var(--text-color)',
  },
  variantName: {
    display: 'block',
    fontWeight: 600,
    fontSize: '0.9rem',
    marginBottom: '0.25rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  variantDesc: {
    display: 'block',
    fontSize: '0.7rem',
    opacity: 0.5,
    lineHeight: 1.4,
  },
  demoBox: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
  },
  demoTitle: {
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    opacity: 0.4,
    marginBottom: '1.5rem',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 2rem',
  },
  listItem: {
    display: 'grid',
    gridTemplateColumns: '40px 1fr 1fr 100px 50px',
    gap: '0.75rem 1.5rem',
    alignItems: 'baseline',
    padding: '0.6rem 0',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    fontSize: '0.85rem',
  },
  listNumber: {
    fontSize: '0.75rem',
    fontWeight: 600,
    opacity: 0.3,
  },
  hoverText: {
    cursor: 'pointer',
    lineHeight: 1.4,
  },
  navDemo: {
    paddingTop: '1rem',
    borderTop: '1px solid rgba(255,255,255,0.1)',
  },
  navDemoTitle: {
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    opacity: 0.4,
    marginBottom: '1rem',
  },
  navLinks: {
    display: 'flex',
    gap: '2rem',
    flexWrap: 'wrap',
    fontSize: '1.1rem',
    textTransform: 'uppercase',
  },
  
  // FEATURES
  featuresSection: {
    padding: '6rem 1.5rem',
    background: 'rgba(255,255,255,0.02)',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  featuresGrid: {
    maxWidth: '900px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
  },
  featureCard: {
    padding: '1.5rem',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '6px',
  },
  featureIcon: {
    fontSize: '1.5rem',
    marginBottom: '0.75rem',
    display: 'block',
  },
  featureTitle: {
    fontSize: '0.9rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
  },
  featureDesc: {
    fontSize: '0.8rem',
    opacity: 0.6,
    lineHeight: 1.5,
    margin: 0,
  },
  
  // ABOUT
  aboutSection: {
    padding: '6rem 1.5rem',
  },
  aboutContent: {
    maxWidth: '900px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3rem',
    alignItems: 'start',
  },
  aboutText: {},
  aboutDesc: {
    fontSize: '0.9rem',
    opacity: 0.7,
    lineHeight: 1.7,
    marginBottom: '1.5rem',
  },
  techStack: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '0.75rem',
    marginTop: '2rem',
  },
  techLabel: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    opacity: 0.5,
  },
  techBadges: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  techBadge: {
    padding: '0.35rem 0.7rem',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  codePreview: {
    background: 'rgba(0,0,0,0.4)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  codeHeader: {
    padding: '0.75rem 1rem',
    background: 'rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  codeDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
  },
  codeFileName: {
    marginLeft: 'auto',
    fontSize: '0.7rem',
    opacity: 0.5,
  },
  codeBlock: {
    padding: '1.25rem',
    margin: 0,
    fontSize: '0.75rem',
    lineHeight: 1.6,
    overflow: 'auto',
    color: '#22c55e',
  },
  
  // FOOTER
  footer: {
    padding: '4rem 1.5rem 2rem',
    borderTop: '1px solid rgba(255,255,255,0.1)',
  },
  footerInner: {
    maxWidth: '900px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1.5fr 2fr',
    gap: '3rem',
    marginBottom: '3rem',
  },
  footerBrand: {},
  footerLogo: {
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
    display: 'block',
  },
  footerTagline: {
    fontSize: '0.8rem',
    opacity: 0.5,
    margin: 0,
  },
  footerLinks: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2rem',
  },
  footerCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  footerColTitle: {
    fontSize: '0.7rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    opacity: 0.4,
    marginBottom: '0.25rem',
  },
  footerLink: {
    color: 'var(--text-color)',
    opacity: 0.6,
    textDecoration: 'none',
    fontSize: '0.8rem',
    transition: 'opacity 0.2s',
  },
  footerBottom: {
    maxWidth: '900px',
    margin: '0 auto',
    paddingTop: '2rem',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    opacity: 0.4,
  },
  footerCopy: {},
  footerVersion: {
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
}

// ════════════════════════════════════════════════════════════════
// GLOBAL STYLES
// ════════════════════════════════════════════════════════════════

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
  
  /* Base hover effect styles */
  .hover-effect {
    font-kerning: none;
    position: relative;
    white-space: nowrap;
    display: inline-block;
  }
  
  .hover-effect .word { white-space: nowrap; }
  .hover-effect .char { position: relative; display: inline-block; }
  
  /* Cursor variant */
  .hover-effect--cursor .char { --cursor-opacity: 0; }
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
  
  /* Background variant */
  .hover-effect--bg { --bg-scale: 0; }
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
  
  /* Blur variant */
  .hover-effect--blur { --bg-scale: 0; }
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
  
  /* Glitch effect */
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
  
  /* Color schemes */
  .demo-cursor { --bg-color: #fff; --text-color: #000; }
  .demo-background { --bg-color: #252a33; --text-color: #c7c0b3; }
  .demo-color { --bg-color: #1d2619; --text-color: #c5c5c5; }
  .demo-blur { --bg-color: #0a0a0a; --text-color: rgba(255, 255, 255, 0.9); }
  .demo-glitch { --bg-color: #0d0d0d; --text-color: #00ff41; }
  
  /* CRT mode */
  .crt-mode { border-radius: 20px; overflow: hidden; }
  .crt-mode::before {
    content: '';
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
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
  .boot-cursor {
    display: inline-block;
    width: 0.6em;
    height: 1.1em;
    background: currentColor;
    margin-left: 2px;
    vertical-align: text-bottom;
    animation: blink 0.7s step-end infinite;
  }
  @keyframes blink { 50% { opacity: 0; } }
  
  /* Responsive */
  @media (max-width: 768px) {
    header nav { display: none !important; }
    header button[aria-label="Toggle menu"] { display: flex !important; }
    
    .terminal-list-item {
      grid-template-columns: 35px 1fr !important;
      gap: 0.4rem 0.75rem !important;
    }
    .terminal-list-item > span:nth-child(n+4) { display: none; }
    
    section > div[style*="grid-template-columns: 1fr 1fr"] {
      grid-template-columns: 1fr !important;
    }
    
    footer > div:first-child {
      grid-template-columns: 1fr !important;
    }
    footer > div:first-child > div:last-child {
      grid-template-columns: repeat(2, 1fr) !important;
    }
  }
  
  a:hover { opacity: 1 !important; }
`

export default TerminalTextHover
