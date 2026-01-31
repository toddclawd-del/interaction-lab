import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ════════════════════════════════════════════════════════════════
// IMAGE REVEAL — Multiple Image Reveal Effects
// Various ways to reveal images: clip-path wipes, scale + blur,
// parallax zoom, mask shapes, and before/after comparison
// ════════════════════════════════════════════════════════════════

const IMAGES = {
  reveal1: 'https://picsum.photos/seed/reveal1/800/600',
  reveal2: 'https://picsum.photos/seed/reveal2/800/600',
  reveal3: 'https://picsum.photos/seed/reveal3/800/600',
  reveal4: 'https://picsum.photos/seed/reveal4/800/600',
  reveal5: 'https://picsum.photos/seed/reveal5/800/600',
  before: 'https://picsum.photos/seed/before/800/600?grayscale',
  after: 'https://picsum.photos/seed/before/800/600',
}

export function ImageReveal() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [sliderPosition, setSliderPosition] = useState(50)
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // ────────────────────────────────────────────────────────
      // 1. CLIP-PATH WIPE (Left to Right) - SCRUB BASED
      // ────────────────────────────────────────────────────────
      gsap.fromTo('.reveal-clip-ltr', 
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          ease: 'none',
          scrollTrigger: {
            trigger: '.reveal-clip-ltr',
            start: 'top 85%',
            end: 'top 30%',
            scrub: 0.5,
          },
        }
      )

      // ────────────────────────────────────────────────────────
      // 2. CLIP-PATH DIAGONAL WIPE - SCRUB BASED
      // ────────────────────────────────────────────────────────
      gsap.fromTo('.reveal-clip-diagonal',
        { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' },
        {
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          ease: 'none',
          scrollTrigger: {
            trigger: '.reveal-clip-diagonal',
            start: 'top 85%',
            end: 'top 30%',
            scrub: 0.5,
          },
        }
      )

      // ────────────────────────────────────────────────────────
      // 3. SCALE + BLUR REVEAL - SCRUB BASED
      // ────────────────────────────────────────────────────────
      gsap.fromTo('.reveal-scale-blur',
        { 
          scale: 1.3, 
          opacity: 0,
          filter: 'blur(30px)',
        },
        {
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          ease: 'none',
          scrollTrigger: {
            trigger: '.reveal-scale-blur',
            start: 'top 85%',
            end: 'top 30%',
            scrub: 0.5,
          },
        }
      )

      // ────────────────────────────────────────────────────────
      // 4. PARALLAX ZOOM (scrubbed)
      // ────────────────────────────────────────────────────────
      gsap.fromTo('.reveal-parallax img',
        { scale: 1.5, y: 100 },
        {
          scale: 1,
          y: -100,
          ease: 'none',
          scrollTrigger: {
            trigger: '.reveal-parallax',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      )

      // ────────────────────────────────────────────────────────
      // 5. CIRCLE MASK REVEAL - SCRUB BASED
      // ────────────────────────────────────────────────────────
      gsap.fromTo('.reveal-circle',
        { clipPath: 'circle(0% at 50% 50%)' },
        {
          clipPath: 'circle(75% at 50% 50%)',
          ease: 'none',
          scrollTrigger: {
            trigger: '.reveal-circle',
            start: 'top 85%',
            end: 'top 30%',
            scrub: 0.5,
          },
        }
      )

    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Before/After slider handler
  const handleSliderMove = (e: React.MouseEvent | React.TouchEvent) => {
    const slider = sliderRef.current
    if (!slider) return

    const rect = slider.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const x = clientX - rect.left
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100)
    setSliderPosition(percentage)
  }

  return (
    <div ref={containerRef} style={styles.container}>
      {/* Back button */}
      <Link to="/" style={styles.backButton}>← Back</Link>

      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>Image Reveal Effects</h1>
        <p style={styles.subtitle}>
          Scroll down to see various reveal animations trigger as images enter the viewport
        </p>
      </header>

      {/* Demo sections */}
      <div style={styles.demos}>

        {/* 1. Clip-path Left to Right */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionNumber}>01</span>
            <h2 style={styles.sectionTitle}>Clip-Path Wipe</h2>
            <p style={styles.sectionDesc}>
              Uses <code>clip-path: inset()</code> to reveal from left to right
            </p>
          </div>
          <div style={styles.imageContainer}>
            <img 
              className="reveal-clip-ltr"
              src={IMAGES.reveal1} 
              alt="Clip path reveal"
              style={styles.image}
            />
          </div>
        </section>

        {/* 2. Diagonal Wipe */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionNumber}>02</span>
            <h2 style={styles.sectionTitle}>Diagonal Wipe</h2>
            <p style={styles.sectionDesc}>
              Uses <code>clip-path: polygon()</code> for diagonal reveal
            </p>
          </div>
          <div style={styles.imageContainer}>
            <img 
              className="reveal-clip-diagonal"
              src={IMAGES.reveal2} 
              alt="Diagonal reveal"
              style={styles.image}
            />
          </div>
        </section>

        {/* 3. Scale + Blur */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionNumber}>03</span>
            <h2 style={styles.sectionTitle}>Scale + Blur</h2>
            <p style={styles.sectionDesc}>
              Image scales down from 1.3x while deblurring and fading in
            </p>
          </div>
          <div style={styles.imageContainer}>
            <img 
              className="reveal-scale-blur"
              src={IMAGES.reveal3} 
              alt="Scale blur reveal"
              style={styles.image}
            />
          </div>
        </section>

        {/* 4. Parallax Zoom */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionNumber}>04</span>
            <h2 style={styles.sectionTitle}>Parallax Zoom</h2>
            <p style={styles.sectionDesc}>
              Scrub-based: image scales and translates as you scroll
            </p>
          </div>
          <div className="reveal-parallax" style={styles.parallaxContainer}>
            <img 
              src={IMAGES.reveal4} 
              alt="Parallax reveal"
              style={styles.parallaxImage}
            />
          </div>
        </section>

        {/* 5. Circle Mask */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionNumber}>05</span>
            <h2 style={styles.sectionTitle}>Circle Mask</h2>
            <p style={styles.sectionDesc}>
              Uses <code>clip-path: circle()</code> to expand from center
            </p>
          </div>
          <div style={styles.imageContainer}>
            <img 
              className="reveal-circle"
              src={IMAGES.reveal5} 
              alt="Circle reveal"
              style={styles.image}
            />
          </div>
        </section>

        {/* 6. Before/After Slider (interactive, no scroll trigger) */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionNumber}>06</span>
            <h2 style={styles.sectionTitle}>Before/After Comparison</h2>
            <p style={styles.sectionDesc}>
              Drag the slider to compare before and after (interactive, not scroll-based)
            </p>
          </div>
          <div 
            ref={sliderRef}
            style={styles.comparisonContainer}
            onMouseMove={handleSliderMove}
            onTouchMove={handleSliderMove}
          >
            {/* After image (full width) */}
            <img 
              src={IMAGES.after} 
              alt="After"
              style={styles.comparisonImage}
            />
            {/* Before image (clipped) */}
            <div 
              style={{
                ...styles.comparisonOverlay,
                clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
              }}
            >
              <img 
                src={IMAGES.before} 
                alt="Before"
                style={styles.comparisonImage}
              />
            </div>
            {/* Slider handle */}
            <div 
              style={{
                ...styles.sliderHandle,
                left: `${sliderPosition}%`,
              }}
            >
              <div style={styles.sliderLine} />
              <div style={styles.sliderKnob}>
                <span style={styles.sliderArrows}>◀▶</span>
              </div>
            </div>
            {/* Labels */}
            <span style={{ ...styles.comparisonLabel, left: '1rem' }}>Before</span>
            <span style={{ ...styles.comparisonLabel, right: '1rem' }}>After</span>
          </div>
        </section>

      </div>

      {/* Code samples */}
      <section style={styles.codeSection}>
        <h2 style={styles.codeSectionTitle}>Key Code Patterns</h2>
        <div style={styles.codeGrid}>
          <div style={styles.codeCard}>
            <h3>Clip-Path Wipe</h3>
            <pre style={styles.code}>
{`gsap.fromTo(element, 
  { clipPath: 'inset(0 100% 0 0)' },
  { clipPath: 'inset(0 0% 0 0)' }
)`}
            </pre>
          </div>
          <div style={styles.codeCard}>
            <h3>Circle Expand</h3>
            <pre style={styles.code}>
{`gsap.fromTo(element, 
  { clipPath: 'circle(0% at 50% 50%)' },
  { clipPath: 'circle(75% at 50% 50%)' }
)`}
            </pre>
          </div>
          <div style={styles.codeCard}>
            <h3>Scale + Blur</h3>
            <pre style={styles.code}>
{`gsap.fromTo(element, 
  { scale: 1.3, filter: 'blur(30px)' },
  { scale: 1, filter: 'blur(0px)' }
)`}
            </pre>
          </div>
        </div>
      </section>
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
    marginBottom: '6rem',
    maxWidth: '600px',
    margin: '0 auto 6rem',
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
    gap: '8rem',
    maxWidth: '900px',
    margin: '0 auto',
  },
  section: {
    // Each reveal section
  },
  sectionHeader: {
    marginBottom: '2rem',
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
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
  },
  sectionDesc: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  imageContainer: {
    overflow: 'hidden',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.03)',
  },
  image: {
    width: '100%',
    height: 'auto',
    display: 'block',
    objectFit: 'cover',
  },
  parallaxContainer: {
    overflow: 'hidden',
    borderRadius: '12px',
    height: '400px',
    background: 'rgba(255, 255, 255, 0.03)',
  },
  parallaxImage: {
    width: '100%',
    height: '150%',
    objectFit: 'cover',
    willChange: 'transform',
  },
  comparisonContainer: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '12px',
    cursor: 'ew-resize',
    userSelect: 'none',
  },
  comparisonImage: {
    width: '100%',
    height: 'auto',
    display: 'block',
    objectFit: 'cover',
  },
  comparisonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sliderHandle: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '4px',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  sliderLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '2px',
    background: '#fff',
    boxShadow: '0 0 10px rgba(0,0,0,0.5)',
  },
  sliderKnob: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    zIndex: 10,
  },
  sliderArrows: {
    fontSize: '10px',
    color: '#000',
    letterSpacing: '-2px',
  },
  comparisonLabel: {
    position: 'absolute',
    bottom: '1rem',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    background: 'rgba(0,0,0,0.7)',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
  },
  codeSection: {
    marginTop: '8rem',
    padding: '3rem 0',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    maxWidth: '900px',
    margin: '8rem auto 0',
  },
  codeSectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: '2rem',
    textAlign: 'center',
  },
  codeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  codeCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    padding: '1.5rem',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  code: {
    background: 'rgba(0, 0, 0, 0.3)',
    padding: '1rem',
    borderRadius: '8px',
    fontSize: '0.75rem',
    overflow: 'auto',
    fontFamily: 'monospace',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 1.6,
    marginTop: '1rem',
  },
}

export default ImageReveal
