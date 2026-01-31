import { Link } from 'react-router-dom'
import { useState, useEffect, useRef, useCallback } from 'react'

// ════════════════════════════════════════════════════════════════
// INTERACTION LAB - Landing Page
// ════════════════════════════════════════════════════════════════

interface Experiment {
  slug: string
  title: string
  description: string
  date: string
  size: 'hero' | 'large' | 'medium' | 'small'
  accent: string
  icon: string
  tags: string[]
  github?: string
}

const experiments: Experiment[] = [
  {
    slug: 'ui-components',
    title: 'UI Components',
    description: '72 micro-interaction components: buttons, inputs, toggles, cards, loaders, badges, tooltips, menus, tabs, and navigation. Copy-paste ready.',
    date: '2025-02-01',
    size: 'hero',
    accent: '#6366f1',
    icon: '🧩',
    tags: ['Components'],
    github: 'https://github.com/toddclawd-del/interaction-lab/tree/main/src/interactions/ui-components'
  },
  {
    slug: 'terminal-text-hover',
    title: 'Terminal Text Hover',
    description: 'Retro terminal-style character scramble effect. Characters briefly become random symbols before settling.',
    date: '2025-01-30',
    size: 'large',
    accent: '#22c55e',
    icon: '⌨️',
    tags: ['Typography'],
    github: 'https://github.com/toddclawd-del/interaction-lab/tree/main/src/interactions/terminal-text-hover'
  },
  {
    slug: 'text-reveal',
    title: 'Text Reveal',
    description: 'SplitText showcase with 5 reveal styles: character rotation, word fade, line reveal, scramble decode, and gradient wipe.',
    date: '2025-01-31',
    size: 'large',
    accent: '#a855f7',
    icon: '✨',
    tags: ['Typography'],
    github: 'https://github.com/toddclawd-del/interaction-lab/tree/main/src/interactions/text-reveal'
  },
  {
    slug: 'wavy-carousel',
    title: 'Wavy Infinite Carousel',
    description: 'Scroll-driven 3D carousel with GLSL shader wave distortion. Images flow infinitely with velocity-based stretch.',
    date: '2025-01-29',
    size: 'medium',
    accent: '#6366f1',
    icon: '🌊',
    tags: ['Shaders', 'Scroll'],
    github: 'https://github.com/toddclawd-del/interaction-lab/tree/main/src/interactions/wavy-carousel'
  },
  {
    slug: 'scroll-velocity',
    title: 'Scroll Velocity Marquee',
    description: 'Marquee text that accelerates based on scroll speed and reverses direction when scrolling up.',
    date: '2025-01-31',
    size: 'medium',
    accent: '#f97316',
    icon: '⚡',
    tags: ['Scroll'],
    github: 'https://github.com/toddclawd-del/interaction-lab/tree/main/src/interactions/scroll-velocity'
  },
  {
    slug: 'magnetic-elements',
    title: 'Magnetic Elements',
    description: 'Buttons and elements that follow cursor with magnetic pull and elastic snap-back effect.',
    date: '2025-01-31',
    size: 'medium',
    accent: '#14b8a6',
    icon: '🧲',
    tags: ['Cursor'],
    github: 'https://github.com/toddclawd-del/interaction-lab/tree/main/src/interactions/magnetic-elements'
  },
  {
    slug: 'horizontal-scroll',
    title: 'Horizontal Scroll Gallery',
    description: 'Pinned section with horizontal scroll. Cards scale and rotate as they move through viewport.',
    date: '2025-01-31',
    size: 'medium',
    accent: '#6366f1',
    icon: '↔️',
    tags: ['Scroll'],
    github: 'https://github.com/toddclawd-del/interaction-lab/tree/main/src/interactions/horizontal-scroll'
  },
  {
    slug: 'grid-flip',
    title: 'Grid Flip',
    description: 'Smooth grid layout animations with GSAP Flip plugin',
    date: '2025-01-28',
    size: 'small',
    accent: '#f59e0b',
    icon: '🔲',
    tags: ['Animation'],
    github: 'https://github.com/toddclawd-del/interaction-lab/tree/main/src/interactions/grid-flip'
  },
  {
    slug: 'image-reveal',
    title: 'Image Reveal Effects',
    description: 'Multiple reveal effects: clip-path wipes, scale+blur, parallax zoom, circle mask, and before/after slider.',
    date: '2025-01-31',
    size: 'small',
    accent: '#ec4899',
    icon: '🖼️',
    tags: ['Scroll'],
    github: 'https://github.com/toddclawd-del/interaction-lab/tree/main/src/interactions/image-reveal'
  },
  {
    slug: 'counter-lab',
    title: 'Counter Lab',
    description: 'Number animations: smooth counting, decimals, slot machine odometer, and scroll-triggered stats.',
    date: '2025-01-31',
    size: 'small',
    accent: '#22c55e',
    icon: '🔢',
    tags: ['Animation'],
    github: 'https://github.com/toddclawd-del/interaction-lab/tree/main/src/interactions/counter-lab'
  },
  {
    slug: 'cursor-playground',
    title: 'Cursor Playground',
    description: 'Custom cursor effects: trailing, dynamic text, blob morph, and spotlight reveal.',
    date: '2025-01-31',
    size: 'small',
    accent: '#8b5cf6',
    icon: '🖱️',
    tags: ['Cursor'],
    github: 'https://github.com/toddclawd-del/interaction-lab/tree/main/src/interactions/cursor-playground'
  },
  {
    slug: 'stagger-patterns',
    title: 'Stagger Patterns',
    description: 'Grid stagger animations: cascade, ripple from center, random order, and neighbor-affecting hover.',
    date: '2025-01-31',
    size: 'small',
    accent: '#0ea5e9',
    icon: '🎯',
    tags: ['Animation'],
    github: 'https://github.com/toddclawd-del/interaction-lab/tree/main/src/interactions/stagger-patterns'
  },
  {
    slug: 'parallax-depth',
    title: 'Parallax Depth',
    description: '6-layer parallax with mouse + scroll movement. 3D perspective creates depth illusion.',
    date: '2025-01-31',
    size: 'small',
    accent: '#6366f1',
    icon: '🎭',
    tags: ['Animation'],
    github: 'https://github.com/toddclawd-del/interaction-lab/tree/main/src/interactions/parallax-depth'
  },
  {
    slug: 'elastic-physics',
    title: 'Elastic Physics',
    description: 'Bouncy animations: elastic buttons, bounce cards, jelly text wobble, and rubber band scroll.',
    date: '2025-01-31',
    size: 'small',
    accent: '#f43f5e',
    icon: '🪀',
    tags: ['Animation'],
    github: 'https://github.com/toddclawd-del/interaction-lab/tree/main/src/interactions/elastic-physics'
  },
  {
    slug: 'scroll-scrub',
    title: 'Scroll Scrub',
    description: 'Scrub-based animations: progress bar, transforming elements, pinned content swap, and timeline.',
    date: '2025-01-31',
    size: 'small',
    accent: '#0891b2',
    icon: '📜',
    tags: ['Scroll'],
    github: 'https://github.com/toddclawd-del/interaction-lab/tree/main/src/interactions/scroll-scrub'
  },
  {
    slug: '3d-cards',
    title: '3D Cards',
    description: 'CSS 3D + GSAP: card flip, cursor-following tilt, spreading stack, and perspective carousel.',
    date: '2025-01-31',
    size: 'small',
    accent: '#d946ef',
    icon: '🃏',
    tags: ['Animation'],
    github: 'https://github.com/toddclawd-del/interaction-lab/tree/main/src/interactions/3d-cards'
  },
  {
    slug: 'cylinder-text',
    title: '3D Cylinder Text',
    description: 'Scroll-driven 3D text rotation with CSS transforms',
    date: '2025-01-28',
    size: 'small',
    accent: '#10b981',
    icon: '🔄',
    tags: ['Animation'],
    github: 'https://github.com/toddclawd-del/interaction-lab/tree/main/src/interactions/cylinder-text'
  },
  {
    slug: 'dual-wave-text',
    title: 'Dual Wave',
    description: 'Opposing wave columns with synced center image',
    date: '2025-01-28',
    size: 'small',
    accent: '#ec4899',
    icon: '〰️',
    tags: ['Scroll'],
    github: 'https://github.com/toddclawd-del/interaction-lab/tree/main/src/interactions/dual-wave-text'
  },
  {
    slug: 'infinite-canvas',
    title: 'Infinite Canvas',
    description: 'Pannable, zoomable infinite canvas with smooth controls',
    date: '2025-01-27',
    size: 'small',
    accent: '#8b5cf6',
    icon: '∞',
    tags: ['Animation'],
    github: 'https://github.com/toddclawd-del/interaction-lab/tree/main/src/interactions/infinite-canvas'
  },
  // Shader-based interactions
  {
    slug: 'shader-hero',
    title: 'Shader Hero',
    description: 'Full-viewport shader background with mouse interaction and scroll parallax. Aurora-inspired flowing patterns.',
    date: '2025-01-31',
    size: 'medium',
    accent: '#7c3aed',
    icon: '✨',
    tags: ['Shaders'],
    github: 'https://github.com/toddclawd-del/interaction-lab/tree/main/src/interactions/shader-hero'
  },
  {
    slug: 'shader-particles',
    title: 'GPU Particles',
    description: 'Thousands of GPU-computed particles with mouse attraction/repulsion. Multiple presets.',
    date: '2025-01-31',
    size: 'medium',
    accent: '#f72585',
    icon: '🌟',
    tags: ['Shaders'],
    github: 'https://github.com/toddclawd-del/interaction-lab/tree/main/src/interactions/shader-particles'
  },
  {
    slug: 'shader-liquid',
    title: 'Liquid Metaballs',
    description: 'Interactive metaballs that follow mouse. Click to add blobs, tilt to move on mobile.',
    date: '2025-01-31',
    size: 'medium',
    accent: '#4cc9f0',
    icon: '💧',
    tags: ['Shaders'],
    github: 'https://github.com/toddclawd-del/interaction-lab/tree/main/src/interactions/shader-liquid'
  },
  {
    slug: 'shader-cards',
    title: 'Shader Cards',
    description: 'Grid of cards with unique shader backgrounds. Hover to interact, click to expand full screen.',
    date: '2025-01-31',
    size: 'small',
    accent: '#667eea',
    icon: '🎴',
    tags: ['Shaders'],
    github: 'https://github.com/toddclawd-del/interaction-lab/tree/main/src/interactions/shader-cards'
  },
  {
    slug: 'shader-gradient',
    title: 'Animated Gradient',
    description: 'Beautiful aurora/mesh gradient backgrounds with mouse influence. Multiple color presets.',
    date: '2025-01-31',
    size: 'small',
    accent: '#f093fb',
    icon: '🌈',
    tags: ['Shaders'],
    github: 'https://github.com/toddclawd-del/interaction-lab/tree/main/src/interactions/shader-gradient'
  },
  {
    slug: 'shader-noise',
    title: 'Noise Effects',
    description: 'Perlin, simplex, and turbulent noise patterns. Mouse adds turbulence.',
    date: '2025-01-31',
    size: 'small',
    accent: '#38f9d7',
    icon: '📺',
    tags: ['Shaders'],
    github: 'https://github.com/toddclawd-del/interaction-lab/tree/main/src/interactions/shader-noise'
  },
  {
    slug: 'shader-transition',
    title: 'Page Transitions',
    description: 'Shader-based page wipe transitions. Dissolve, wipe, circle, pixelate effects.',
    date: '2025-01-31',
    size: 'small',
    accent: '#1a1a2e',
    icon: '🔃',
    tags: ['Shaders'],
    github: 'https://github.com/toddclawd-del/interaction-lab/tree/main/src/interactions/shader-transition'
  },
  {
    slug: 'shader-distortion',
    title: 'Image Distortion',
    description: 'Ripple, wave, twist, and bulge distortion effects on hover.',
    date: '2025-01-31',
    size: 'small',
    accent: '#ff6b6b',
    icon: '🌀',
    tags: ['Shaders'],
    github: 'https://github.com/toddclawd-del/interaction-lab/tree/main/src/interactions/shader-distortion'
  },
  {
    slug: 'shader-reveal',
    title: 'Scroll Reveal',
    description: 'Scroll-triggered shader reveal with multiple directions and noise edges.',
    date: '2025-01-31',
    size: 'small',
    accent: '#764ba2',
    icon: '👁️',
    tags: ['Shaders', 'Scroll'],
    github: 'https://github.com/toddclawd-del/interaction-lab/tree/main/src/interactions/shader-reveal'
  },
  {
    slug: 'shader-cursor',
    title: 'Shader Cursor',
    description: 'Custom cursor with shader effects. Ripple, glow, vortex modes. Mobile touch ripples.',
    date: '2025-01-31',
    size: 'small',
    accent: '#f72585',
    icon: '👆',
    tags: ['Shaders', 'Cursor'],
    github: 'https://github.com/toddclawd-del/interaction-lab/tree/main/src/interactions/shader-cursor'
  }
]

const stats = [
  { value: '28', label: 'Experiments' },
  { value: '100%', label: 'Open Source' },
  { value: '0', label: 'Dependencies*' },
]

// ════════════════════════════════════════════════════════════════
// COMPONENTS
// ════════════════════════════════════════════════════════════════

function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    let animationId: number
    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = []
    
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resize()
    window.addEventListener('resize', resize)
    
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.2 + 0.05
      })
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`
        ctx.fill()
      })
      
      animationId = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])
  
  return <canvas ref={canvasRef} style={styles.particles} />
}

// ─────────────────────────────────────────────────────────────────
// HEADER / NAV
// ─────────────────────────────────────────────────────────────────
function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return (
    <header style={{
      ...styles.nav,
      background: scrolled ? 'rgba(5,5,5,0.95)' : 'transparent',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
    }}>
      <div style={styles.navInner}>
        {/* Logo */}
        <a href="#" style={styles.logo}>
          <span style={styles.logoIcon}>⚡</span>
          <span style={styles.logoText}>Interaction Lab</span>
        </a>
        
        {/* Desktop Nav */}
        <nav style={styles.navLinks}>
          <a href="#experiments" style={styles.navLink}>Experiments</a>
          <a href="#about" style={styles.navLink}>About</a>
          <a 
            href="https://github.com/toddclawd-del/interaction-lab" 
            target="_blank" 
            rel="noopener noreferrer"
            style={styles.navLink}
          >
            GitHub
          </a>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          style={styles.menuButton}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span style={{
            ...styles.menuLine,
            transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
          }} />
          <span style={{
            ...styles.menuLine,
            opacity: menuOpen ? 0 : 1,
          }} />
          <span style={{
            ...styles.menuLine,
            transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
          }} />
        </button>
      </div>
      
      {/* Mobile Menu */}
      <div style={{
        ...styles.mobileMenu,
        maxHeight: menuOpen ? '300px' : '0',
        opacity: menuOpen ? 1 : 0,
        padding: menuOpen ? '1rem 1.5rem' : '0 1.5rem',
      }}>
        <a href="#experiments" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Experiments</a>
        <a href="#about" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>About</a>
        <a 
          href="https://github.com/toddclawd-del/interaction-lab" 
          target="_blank" 
          rel="noopener noreferrer"
          style={styles.mobileLink}
        >
          GitHub →
        </a>
      </div>
    </header>
  )
}

// ─────────────────────────────────────────────────────────────────
// HERO SECTION
// ─────────────────────────────────────────────────────────────────
function Hero() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  return (
    <section style={styles.hero}>
      <div style={{
        ...styles.heroContent,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(30px)',
      }}>
        <div style={styles.badge}>
          <span style={styles.badgeDot} />
          Open Source UI Experiments
        </div>
        
        <h1 style={styles.heroTitle}>
          Creative Web
          <br />
          <span style={styles.heroHighlight}>Interactions</span>
        </h1>
        
        <p style={styles.heroSubtitle}>
          A collection of experimental UI interactions built with React, Three.js, and GSAP. 
          Each experiment explores new techniques for modern web experiences.
        </p>
        
        <div style={styles.heroCtas}>
          <a href="#experiments" style={styles.primaryCta}>
            Explore Experiments
          </a>
          <a 
            href="https://github.com/toddclawd-del/interaction-lab" 
            target="_blank" 
            rel="noopener noreferrer"
            style={styles.secondaryCta}
          >
            View on GitHub →
          </a>
        </div>
        
        {/* Stats */}
        <div style={styles.statsRow}>
          {stats.map((stat, i) => (
            <div key={i} style={styles.stat}>
              <span style={styles.statValue}>{stat.value}</span>
              <span style={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
        <p style={styles.statsNote}>*just kidding, there are dependencies</p>
      </div>
      
      {/* Gradient orbs */}
      <div style={{ ...styles.orb, ...styles.orb1 }} />
      <div style={{ ...styles.orb, ...styles.orb2 }} />
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────
// EXPERIMENT CARD
// ─────────────────────────────────────────────────────────────────
function BentoCard({ experiment, index }: { experiment: Experiment; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const cardRef = useRef<HTMLDivElement>(null)
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    })
  }, [])
  
  const getSizeStyles = (): React.CSSProperties => ({
    gridRow: experiment.size === 'hero' ? 'span 2' : experiment.size === 'large' ? 'span 2' : 'span 1',
    gridColumn: experiment.size === 'hero' ? 'span 2' : 'span 1',
  })
  
  const tiltStyle: React.CSSProperties = isHovered ? {
    transform: `perspective(1000px) rotateX(${(mousePos.y - 0.5) * -6}deg) rotateY(${(mousePos.x - 0.5) * 6}deg) scale(1.02)`,
  } : {
    transform: 'perspective(1000px) rotateX(0) rotateY(0) scale(1)',
  }
  
  const gradientStyle: React.CSSProperties = {
    background: isHovered 
      ? `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, ${experiment.accent}22 0%, transparent 50%)`
      : 'transparent',
  }
  
  return (
    <div
      ref={cardRef}
      style={{
        ...styles.card,
        ...getSizeStyles(),
        ...tiltStyle,
        animationDelay: `${index * 0.1}s`,
        borderColor: isHovered ? `${experiment.accent}44` : 'rgba(255,255,255,0.08)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <div style={{ ...styles.gradientOverlay, ...gradientStyle }} />
      
      {/* Icon */}
      <div style={{
        ...styles.iconContainer,
        transform: isHovered ? 'scale(1.15) rotate(5deg)' : 'scale(1) rotate(0deg)',
        filter: isHovered ? `drop-shadow(0 0 20px ${experiment.accent})` : 'none',
      }}>
        <span style={{ fontSize: experiment.size === 'hero' ? '3.5rem' : experiment.size === 'large' ? '2.5rem' : '2rem' }}>
          {experiment.icon}
        </span>
      </div>
      
      {/* Content */}
      <div style={styles.cardContent}>
        <div style={styles.tags}>
          {experiment.tags.map(tag => (
            <span key={tag} style={{
              ...styles.tag,
              background: isHovered ? `${experiment.accent}33` : 'rgba(255,255,255,0.08)',
              borderColor: isHovered ? `${experiment.accent}66` : 'rgba(255,255,255,0.1)',
            }}>
              {tag}
            </span>
          ))}
        </div>
        
        <h2 style={{
          ...styles.cardTitle,
          fontSize: experiment.size === 'hero' ? '1.75rem' : experiment.size === 'large' ? '1.4rem' : '1.15rem',
          color: isHovered ? '#fff' : 'rgba(255,255,255,0.95)',
        }}>
          {experiment.title}
        </h2>
        
        {(experiment.size === 'hero' || experiment.size === 'large') && (
          <p style={{
            ...styles.cardDesc,
            opacity: isHovered ? 0.9 : 0.6,
          }}>
            {experiment.description}
          </p>
        )}
        
        {/* Actions */}
        <div style={styles.cardActions}>
          <Link 
            to={`/${experiment.slug}`} 
            style={{
              ...styles.cardButton,
              background: isHovered ? experiment.accent : 'rgba(255,255,255,0.1)',
              color: isHovered ? '#000' : '#fff',
            }}
          >
            View Demo
          </Link>
          {experiment.github && (
            <a 
              href={experiment.github}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.cardGithub}
              onClick={(e) => e.stopPropagation()}
            >
              Code →
            </a>
          )}
        </div>
      </div>
      
      <div style={{
        ...styles.cornerAccent,
        background: experiment.accent,
        opacity: isHovered ? 0.5 : 0.15,
        transform: isHovered ? 'scale(1.5)' : 'scale(1)',
      }} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// EXPERIMENTS SECTION
// ─────────────────────────────────────────────────────────────────

// Extract all unique tags
const allTags = Array.from(new Set(experiments.flatMap(exp => exp.tags))).sort()

function Experiments() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  
  const filteredExperiments = selectedTag 
    ? experiments.filter(exp => exp.tags.includes(selectedTag))
    : experiments
  
  return (
    <section id="experiments" style={styles.experimentsSection}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>Experiments</h2>
        <p style={styles.sectionSubtitle}>
          Click any card to see the live demo, or view the source code on GitHub.
        </p>
      </div>
      
      {/* Tag Filter Nav */}
      <div style={styles.filterNav}>
        <button
          onClick={() => setSelectedTag(null)}
          style={{
            ...styles.filterButton,
            background: selectedTag === null ? 'rgba(99, 102, 241, 0.9)' : 'rgba(255,255,255,0.08)',
            color: selectedTag === null ? '#fff' : 'rgba(255,255,255,0.7)',
            borderColor: selectedTag === null ? 'rgba(99, 102, 241, 0.5)' : 'rgba(255,255,255,0.1)',
          }}
        >
          All ({experiments.length})
        </button>
        {allTags.map(tag => {
          const count = experiments.filter(exp => exp.tags.includes(tag)).length
          return (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              style={{
                ...styles.filterButton,
                background: selectedTag === tag ? 'rgba(99, 102, 241, 0.9)' : 'rgba(255,255,255,0.08)',
                color: selectedTag === tag ? '#fff' : 'rgba(255,255,255,0.7)',
                borderColor: selectedTag === tag ? 'rgba(99, 102, 241, 0.5)' : 'rgba(255,255,255,0.1)',
              }}
            >
              {tag} ({count})
            </button>
          )
        })}
      </div>
      
      <div className="bento-grid" style={styles.grid}>
        {filteredExperiments.map((exp, i) => (
          <BentoCard key={exp.slug} experiment={exp} index={i} />
        ))}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────
// ABOUT SECTION
// ─────────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" style={styles.aboutSection}>
      <div style={styles.aboutContent}>
        <h2 style={styles.aboutTitle}>About This Lab</h2>
        
        <div style={styles.aboutGrid}>
          <div style={styles.aboutCard}>
            <span style={styles.aboutIcon}>🔬</span>
            <h3 style={styles.aboutCardTitle}>Experimental</h3>
            <p style={styles.aboutCardText}>
              Each interaction pushes boundaries. Some are practical, 
              some are just for fun. All are learning opportunities.
            </p>
          </div>
          
          <div style={styles.aboutCard}>
            <span style={styles.aboutIcon}>📖</span>
            <h3 style={styles.aboutCardTitle}>Open Source</h3>
            <p style={styles.aboutCardText}>
              Every experiment is fully open source. Explore the code, 
              fork it, learn from it, or contribute your own ideas.
            </p>
          </div>
          
          <div style={styles.aboutCard}>
            <span style={styles.aboutIcon}>⚡</span>
            <h3 style={styles.aboutCardTitle}>Modern Stack</h3>
            <p style={styles.aboutCardText}>
              Built with React, Three.js, GSAP, and vanilla shaders. 
              No heavy frameworks — just the tools needed.
            </p>
          </div>
        </div>
        
        <div style={styles.techStack}>
          <span style={styles.techLabel}>Built with:</span>
          <div style={styles.techLogos}>
            {['React', 'Three.js', 'GSAP', 'TypeScript', 'Vite'].map(tech => (
              <span key={tech} style={styles.techBadge}>{tech}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerInner}>
        <div style={styles.footerBrand}>
          <span style={styles.footerLogo}>⚡ Interaction Lab</span>
          <p style={styles.footerTagline}>
            Exploring the boundaries of web interactions.
          </p>
        </div>
        
        <div style={styles.footerLinks}>
          <div style={styles.footerCol}>
            <h4 style={styles.footerColTitle}>Links</h4>
            <a href="#experiments" style={styles.footerLink}>Experiments</a>
            <a href="#about" style={styles.footerLink}>About</a>
          </div>
          
          <div style={styles.footerCol}>
            <h4 style={styles.footerColTitle}>Source</h4>
            <a 
              href="https://github.com/toddclawd-del/interaction-lab" 
              target="_blank" 
              rel="noopener noreferrer"
              style={styles.footerLink}
            >
              GitHub Repo
            </a>
            <a 
              href="https://github.com/toddclawd-del/interaction-lab/issues" 
              target="_blank" 
              rel="noopener noreferrer"
              style={styles.footerLink}
            >
              Report Issue
            </a>
          </div>
          
          <div style={styles.footerCol}>
            <h4 style={styles.footerColTitle}>More Labs</h4>
            <a 
              href="https://toddclawd-del.github.io/shader-playground" 
              target="_blank" 
              rel="noopener noreferrer"
              style={styles.footerLink}
            >
              Shader Playground
            </a>
            <a 
              href="https://toddclawd-del.github.io/landing-lab" 
              target="_blank" 
              rel="noopener noreferrer"
              style={styles.footerLink}
            >
              Landing Lab
            </a>
          </div>
        </div>
      </div>
      
      <div style={styles.footerBottom}>
        <span style={styles.footerCopy}>
          © 2025 Interaction Lab. Open source under MIT.
        </span>
        <span style={styles.footerBuilt}>
          Built with React & ☕
        </span>
      </div>
    </footer>
  )
}

// ════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ════════════════════════════════════════════════════════════════
export function Home() {
  return (
    <div style={styles.container}>
      <Particles />
      <Header />
      <Hero />
      <Experiments />
      <About />
      <Footer />
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// STYLES
// ════════════════════════════════════════════════════════════════
const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: '#050505',
    color: '#fff',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    overflowX: 'hidden',
    position: 'relative',
  },
  particles: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 0,
  },
  
  // NAV
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    transition: 'all 0.3s ease',
  },
  navInner: {
    maxWidth: '1200px',
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
    color: '#fff',
  },
  logoIcon: {
    fontSize: '1.5rem',
  },
  logoText: {
    fontSize: '1.1rem',
    fontWeight: 600,
    letterSpacing: '-0.02em',
  },
  navLinks: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
  },
  navLink: {
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
    transition: 'color 0.2s',
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
    width: '24px',
    height: '2px',
    background: '#fff',
    transition: 'all 0.3s ease',
  },
  mobileMenu: {
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    background: 'rgba(5,5,5,0.98)',
    borderTop: '1px solid rgba(255,255,255,0.08)',
  },
  mobileLink: {
    color: 'rgba(255,255,255,0.8)',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: 500,
    padding: '0.5rem 0',
  },
  
  // HERO
  hero: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6rem 1.5rem 4rem',
    position: 'relative',
    overflow: 'hidden',
  },
  heroContent: {
    maxWidth: '800px',
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '100px',
    fontSize: '0.85rem',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: '2rem',
  },
  badgeDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#10b981',
    boxShadow: '0 0 10px #10b981',
  },
  heroTitle: {
    fontSize: 'clamp(2.5rem, 8vw, 5rem)',
    fontWeight: 700,
    letterSpacing: '-0.04em',
    lineHeight: 1.1,
    marginBottom: '1.5rem',
  },
  heroHighlight: {
    background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #f59e0b 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroSubtitle: {
    fontSize: 'clamp(1rem, 2vw, 1.2rem)',
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 1.7,
    marginBottom: '2.5rem',
    maxWidth: '600px',
    margin: '0 auto 2.5rem',
  },
  heroCtas: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '3rem',
  },
  primaryCta: {
    padding: '0.9rem 2rem',
    background: '#fff',
    color: '#000',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '0.95rem',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  secondaryCta: {
    padding: '0.9rem 2rem',
    background: 'transparent',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: '0.95rem',
    transition: 'border-color 0.2s',
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '3rem',
    flexWrap: 'wrap',
  },
  stat: {
    textAlign: 'center',
  },
  statValue: {
    display: 'block',
    fontSize: '2rem',
    fontWeight: 700,
    color: '#fff',
  },
  statLabel: {
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  statsNote: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.3)',
    marginTop: '1rem',
    fontStyle: 'italic',
  },
  orb: {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(120px)',
    opacity: 0.4,
    pointerEvents: 'none',
  },
  orb1: {
    width: '500px',
    height: '500px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    top: '-150px',
    right: '-100px',
  },
  orb2: {
    width: '400px',
    height: '400px',
    background: 'linear-gradient(135deg, #ec4899 0%, #f59e0b 100%)',
    bottom: '-100px',
    left: '-100px',
  },
  
  // EXPERIMENTS
  experimentsSection: {
    padding: '6rem 1.5rem',
    position: 'relative',
    zIndex: 1,
  },
  sectionHeader: {
    maxWidth: '600px',
    margin: '0 auto 3rem',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 'clamp(2rem, 4vw, 2.5rem)',
    fontWeight: 700,
    letterSpacing: '-0.03em',
    marginBottom: '0.75rem',
  },
  sectionSubtitle: {
    fontSize: '1rem',
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 1.6,
  },
  filterNav: {
    maxWidth: '1000px',
    margin: '0 auto 2rem',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    justifyContent: 'center',
  },
  filterButton: {
    padding: '0.5rem 1rem',
    fontSize: '0.8rem',
    fontWeight: 500,
    border: '1px solid',
    borderRadius: '9999px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  grid: {
    maxWidth: '1000px',
    width: '100%',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.25rem',
  },
  card: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '1.5rem',
    background: 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    overflow: 'hidden',
    minHeight: '200px',
    animation: 'fadeInUp 0.6s ease forwards',
    opacity: 0,
    transformStyle: 'preserve-3d',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '16px',
    transition: 'background 0.3s ease',
    pointerEvents: 'none',
  },
  iconContainer: {
    position: 'absolute',
    top: '1.25rem',
    right: '1.25rem',
    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    position: 'relative',
    zIndex: 1,
    marginTop: 'auto',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '0.5rem',
  },
  tag: {
    padding: '3px 8px',
    fontSize: '0.65rem',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderRadius: '4px',
    border: '1px solid',
    transition: 'all 0.3s ease',
  },
  cardTitle: {
    fontWeight: 600,
    letterSpacing: '-0.02em',
    transition: 'color 0.3s ease',
    margin: 0,
  },
  cardDesc: {
    fontSize: '0.9rem',
    lineHeight: 1.5,
    transition: 'opacity 0.3s ease',
    margin: '0.25rem 0',
    color: 'rgba(255,255,255,0.6)',
  },
  cardActions: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
    marginTop: '0.75rem',
  },
  cardButton: {
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '0.8rem',
    fontWeight: 600,
    transition: 'all 0.3s ease',
  },
  cardGithub: {
    color: 'rgba(255,255,255,0.5)',
    textDecoration: 'none',
    fontSize: '0.8rem',
    fontWeight: 500,
    transition: 'color 0.2s',
  },
  cornerAccent: {
    position: 'absolute',
    top: '-20px',
    right: '-20px',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    filter: 'blur(40px)',
    transition: 'all 0.4s ease',
    pointerEvents: 'none',
  },
  
  // ABOUT
  aboutSection: {
    padding: '6rem 1.5rem',
    background: 'rgba(255,255,255,0.02)',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  aboutContent: {
    maxWidth: '1000px',
    margin: '0 auto',
    textAlign: 'center',
  },
  aboutTitle: {
    fontSize: 'clamp(2rem, 4vw, 2.5rem)',
    fontWeight: 700,
    letterSpacing: '-0.03em',
    marginBottom: '3rem',
  },
  aboutGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem',
  },
  aboutCard: {
    padding: '2rem',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    textAlign: 'left',
  },
  aboutIcon: {
    fontSize: '2rem',
    marginBottom: '1rem',
    display: 'block',
  },
  aboutCardTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
  },
  aboutCardText: {
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 1.6,
    margin: 0,
  },
  techStack: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  techLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.9rem',
  },
  techLogos: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  techBadge: {
    padding: '0.4rem 0.8rem',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.8)',
  },
  
  // FOOTER
  footer: {
    padding: '4rem 1.5rem 2rem',
    borderTop: '1px solid rgba(255,255,255,0.08)',
  },
  footerInner: {
    maxWidth: '1000px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '2fr 3fr',
    gap: '3rem',
    marginBottom: '3rem',
  },
  footerBrand: {},
  footerLogo: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
    display: 'block',
  },
  footerTagline: {
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.5)',
    margin: 0,
    lineHeight: 1.6,
  },
  footerLinks: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2rem',
  },
  footerCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  footerColTitle: {
    fontSize: '0.8rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: '0.25rem',
  },
  footerLink: {
    color: 'rgba(255,255,255,0.5)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'color 0.2s',
  },
  footerBottom: {
    maxWidth: '1000px',
    margin: '0 auto',
    paddingTop: '2rem',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  footerCopy: {
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.4)',
  },
  footerBuilt: {
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.4)',
  },
}

// Inject keyframes and responsive styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    /* Mobile nav */
    @media (max-width: 768px) {
      nav > div:first-child > nav {
        display: none !important;
      }
      nav button[aria-label="Toggle menu"] {
        display: flex !important;
      }
      footer > div:first-child {
        grid-template-columns: 1fr !important;
      }
      footer > div:first-child > div:last-child {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }
    
    @media (max-width: 640px) {
      .bento-grid {
        grid-template-columns: 1fr !important;
      }
      .bento-grid > * {
        grid-column: span 1 !important;
        grid-row: span 1 !important;
      }
    }
    
    @media (min-width: 641px) and (max-width: 900px) {
      .bento-grid > *:first-child {
        grid-column: span 2;
        grid-row: span 2;
      }
    }
    
    @media (min-width: 901px) {
      .bento-grid > *:first-child {
        grid-column: span 2;
        grid-row: span 2;
      }
      .bento-grid > *:nth-child(2) {
        grid-row: span 2;
      }
    }
    
    a:hover {
      color: rgba(255,255,255,0.9) !important;
    }
  `
  document.head.appendChild(styleSheet)
}
