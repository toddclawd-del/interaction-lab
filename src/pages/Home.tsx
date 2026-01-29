import { Link } from 'react-router-dom'
import { useState, useEffect, useRef, useCallback } from 'react'

interface Experiment {
  slug: string
  title: string
  description: string
  date: string
  size: 'hero' | 'large' | 'medium' | 'small'
  accent: string
  icon: string
  tags: string[]
}

const experiments: Experiment[] = [
  {
    slug: 'wavy-carousel',
    title: 'Wavy Infinite Carousel',
    description: 'Scroll-driven 3D carousel with GLSL shader wave distortion. Images flow infinitely with velocity-based stretch.',
    date: '2025-01-29',
    size: 'hero',
    accent: '#6366f1',
    icon: '🌊',
    tags: ['Three.js', 'GLSL', 'Scroll']
  },
  {
    slug: 'grid-flip',
    title: 'Grid Flip',
    description: 'Smooth grid layout animations with GSAP Flip plugin',
    date: '2025-01-28',
    size: 'large',
    accent: '#f59e0b',
    icon: '🔲',
    tags: ['GSAP', 'Animation']
  },
  {
    slug: 'cylinder-text',
    title: '3D Cylinder Text',
    description: 'Scroll-driven 3D text rotation with CSS transforms',
    date: '2025-01-28',
    size: 'medium',
    accent: '#10b981',
    icon: '🔄',
    tags: ['CSS', '3D']
  },
  {
    slug: 'dual-wave-text',
    title: 'Dual Wave',
    description: 'Opposing wave columns with synced center image',
    date: '2025-01-28',
    size: 'medium',
    accent: '#ec4899',
    icon: '〰️',
    tags: ['Animation', 'Scroll']
  },
  {
    slug: 'infinite-canvas',
    title: 'Infinite Canvas',
    description: 'Pannable, zoomable infinite canvas with smooth controls',
    date: '2025-01-27',
    size: 'small',
    accent: '#8b5cf6',
    icon: '∞',
    tags: ['Canvas', 'Gestures']
  }
]

// Animated background particles
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
    
    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.3 + 0.1
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

// Interactive card component with hover effects
function BentoCard({ experiment, index }: { experiment: Experiment; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const cardRef = useRef<HTMLAnchorElement>(null)
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    })
  }, [])
  
  const getSizeStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      gridRow: experiment.size === 'hero' ? 'span 2' : experiment.size === 'large' ? 'span 2' : 'span 1',
      gridColumn: experiment.size === 'hero' ? 'span 2' : 'span 1',
    }
    return base
  }
  
  // Subtle 3D tilt on hover
  const tiltStyle: React.CSSProperties = isHovered ? {
    transform: `perspective(1000px) rotateX(${(mousePos.y - 0.5) * -8}deg) rotateY(${(mousePos.x - 0.5) * 8}deg) scale(1.02)`,
  } : {
    transform: 'perspective(1000px) rotateX(0) rotateY(0) scale(1)',
  }
  
  // Dynamic gradient based on mouse position
  const gradientStyle: React.CSSProperties = {
    background: isHovered 
      ? `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, ${experiment.accent}22 0%, transparent 50%)`
      : 'transparent',
  }
  
  return (
    <Link
      ref={cardRef}
      to={`/${experiment.slug}`}
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
      {/* Hover gradient overlay */}
      <div style={{ ...styles.gradientOverlay, ...gradientStyle }} />
      
      {/* Animated icon */}
      <div style={{
        ...styles.iconContainer,
        transform: isHovered ? 'scale(1.15) rotate(5deg)' : 'scale(1) rotate(0deg)',
        filter: isHovered ? `drop-shadow(0 0 20px ${experiment.accent})` : 'none',
      }}>
        <span style={{ fontSize: experiment.size === 'hero' ? '4rem' : experiment.size === 'large' ? '3rem' : '2.5rem' }}>
          {experiment.icon}
        </span>
      </div>
      
      {/* Content */}
      <div style={styles.cardContent}>
        {/* Tags */}
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
        
        {/* Title */}
        <h2 style={{
          ...styles.cardTitle,
          fontSize: experiment.size === 'hero' ? '2rem' : experiment.size === 'large' ? '1.5rem' : '1.25rem',
          color: isHovered ? '#fff' : 'rgba(255,255,255,0.95)',
        }}>
          {experiment.title}
        </h2>
        
        {/* Description - only show on larger cards */}
        {(experiment.size === 'hero' || experiment.size === 'large') && (
          <p style={{
            ...styles.cardDesc,
            opacity: isHovered ? 0.9 : 0.6,
          }}>
            {experiment.description}
          </p>
        )}
        
        {/* Date */}
        <span style={styles.date}>{experiment.date}</span>
      </div>
      
      {/* Animated arrow */}
      <div style={{
        ...styles.arrow,
        transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
        opacity: isHovered ? 1 : 0.4,
        color: isHovered ? experiment.accent : 'rgba(255,255,255,0.4)',
      }}>
        →
      </div>
      
      {/* Corner accent */}
      <div style={{
        ...styles.cornerAccent,
        background: experiment.accent,
        opacity: isHovered ? 0.6 : 0.2,
        transform: isHovered ? 'scale(1.5)' : 'scale(1)',
      }} />
    </Link>
  )
}

export function Home() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  return (
    <div style={styles.container}>
      <Particles />
      
      {/* Gradient orbs for visual interest */}
      <div style={styles.orbContainer}>
        <div style={{ ...styles.orb, ...styles.orb1 }} />
        <div style={{ ...styles.orb, ...styles.orb2 }} />
        <div style={{ ...styles.orb, ...styles.orb3 }} />
      </div>
      
      <header style={{
        ...styles.header,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
      }}>
        <div style={styles.badge}>
          <span style={styles.badgeDot} />
          Interaction Lab
        </div>
        <h1 style={styles.title}>UI Experiments</h1>
        <p style={styles.subtitle}>
          Exploring the boundaries of web interactions. Each experiment pushes creative boundaries with modern techniques.
        </p>
      </header>
      
      <div 
        className="bento-grid"
        style={{
          ...styles.grid,
          opacity: mounted ? 1 : 0,
        }}
      >
        {experiments.map((exp, i) => (
          <BentoCard key={exp.slug} experiment={exp} index={i} />
        ))}
      </div>
      
      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <span style={styles.footerText}>Built with React, Three.js, and ✨</span>
          <div style={styles.footerLinks}>
            <a href="https://github.com/toddclawd-del/interaction-lab" target="_blank" rel="noopener noreferrer" style={styles.footerLink}>
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: '#050505',
    color: '#fff',
    fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
    padding: '3rem 1rem 6rem',
    overflowX: 'hidden',
    position: 'relative',
    boxSizing: 'border-box',
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
  orbContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 0,
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(100px)',
    opacity: 0.4,
  },
  orb1: {
    width: '600px',
    height: '600px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    top: '-200px',
    right: '-100px',
    animation: 'float 20s ease-in-out infinite',
  },
  orb2: {
    width: '400px',
    height: '400px',
    background: 'linear-gradient(135deg, #ec4899 0%, #f59e0b 100%)',
    bottom: '10%',
    left: '-100px',
    animation: 'float 25s ease-in-out infinite reverse',
  },
  orb3: {
    width: '300px',
    height: '300px',
    background: 'linear-gradient(135deg, #10b981 0%, #6366f1 100%)',
    top: '50%',
    right: '10%',
    animation: 'float 18s ease-in-out infinite',
  },
  header: {
    maxWidth: '900px',
    margin: '0 auto 4rem',
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 14px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '100px',
    fontSize: '0.85rem',
    fontWeight: 500,
    letterSpacing: '0.02em',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: '1.5rem',
  },
  badgeDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#10b981',
    boxShadow: '0 0 10px #10b981',
  },
  title: {
    fontSize: 'clamp(3rem, 8vw, 5rem)',
    fontWeight: 700,
    letterSpacing: '-0.04em',
    marginBottom: '1.25rem',
    background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    lineHeight: 1.1,
  },
  subtitle: {
    fontSize: 'clamp(1rem, 2vw, 1.25rem)',
    color: 'rgba(255,255,255,0.5)',
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: 1.6,
  },
  grid: {
    maxWidth: '1000px',
    width: '100%',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.25rem',
    position: 'relative',
    zIndex: 1,
    transition: 'opacity 0.6s ease 0.3s',
    boxSizing: 'border-box',
  },
  card: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '1.75rem',
    background: 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    textDecoration: 'none',
    color: '#fff',
    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    overflow: 'hidden',
    minHeight: '220px',
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
    borderRadius: '20px',
    transition: 'background 0.3s ease',
    pointerEvents: 'none',
  },
  iconContainer: {
    position: 'absolute',
    top: '1.5rem',
    right: '1.5rem',
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
    padding: '4px 10px',
    fontSize: '0.7rem',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderRadius: '6px',
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
    fontSize: '0.95rem',
    lineHeight: 1.5,
    transition: 'opacity 0.3s ease',
    margin: '0.25rem 0',
    color: 'rgba(255,255,255,0.6)',
  },
  date: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.35)',
    fontFamily: 'monospace',
    marginTop: '0.5rem',
  },
  arrow: {
    position: 'absolute',
    bottom: '1.75rem',
    right: '1.75rem',
    fontSize: '1.5rem',
    transition: 'all 0.3s ease',
    fontWeight: 300,
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
  footer: {
    maxWidth: '1000px',
    margin: '5rem auto 0',
    padding: '2rem 0',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    position: 'relative',
    zIndex: 1,
  },
  footerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  footerText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '0.9rem',
  },
  footerLinks: {
    display: 'flex',
    gap: '1.5rem',
  },
  footerLink: {
    color: 'rgba(255,255,255,0.5)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'color 0.2s ease',
  },
}

// Add keyframes via style tag (will be injected)
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = `
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
    
    @keyframes float {
      0%, 100% {
        transform: translate(0, 0) scale(1);
      }
      33% {
        transform: translate(30px, -30px) scale(1.05);
      }
      66% {
        transform: translate(-20px, 20px) scale(0.95);
      }
    }
    
    @media (max-width: 640px) {
      .bento-grid {
        grid-template-columns: 1fr !important;
        padding: 0 !important;
        gap: 1rem !important;
      }
      .bento-grid > * {
        grid-column: span 1 !important;
        grid-row: span 1 !important;
      }
    }
    
    @media (min-width: 641px) and (max-width: 900px) {
      .bento-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }
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
  `
  document.head.appendChild(styleSheet)
}
