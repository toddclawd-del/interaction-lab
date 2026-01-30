import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ════════════════════════════════════════════════════════════════
// HORIZONTAL SCROLL — Pinned Horizontal Gallery
// Pinned section with horizontal scroll, cards scale and rotate
// as they move through the viewport. Smooth scrub animation.
// ════════════════════════════════════════════════════════════════

const GALLERY_ITEMS = [
  { id: 1, title: 'Alpine Vista', category: 'Landscape', color: '#6366f1', image: 'https://picsum.photos/seed/alpine/600/800' },
  { id: 2, title: 'Urban Jungle', category: 'Architecture', color: '#22c55e', image: 'https://picsum.photos/seed/urban/600/800' },
  { id: 3, title: 'Ocean Depths', category: 'Nature', color: '#0ea5e9', image: 'https://picsum.photos/seed/ocean/600/800' },
  { id: 4, title: 'Desert Bloom', category: 'Landscape', color: '#f59e0b', image: 'https://picsum.photos/seed/desert/600/800' },
  { id: 5, title: 'Night City', category: 'Urban', color: '#ec4899', image: 'https://picsum.photos/seed/night/600/800' },
  { id: 6, title: 'Forest Path', category: 'Nature', color: '#10b981', image: 'https://picsum.photos/seed/forest/600/800' },
  { id: 7, title: 'Crystal Cave', category: 'Abstract', color: '#8b5cf6', image: 'https://picsum.photos/seed/crystal/600/800' },
]

export function HorizontalScroll() {
  const containerRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      const gallery = galleryRef.current
      const track = trackRef.current
      const progress = progressRef.current
      const cards = cardRefs.current.filter(Boolean)

      if (!gallery || !track || !progress) return

      // ────────────────────────────────────────────────────────
      // HORIZONTAL SCROLL SETUP
      // Calculate total scroll distance based on track width
      // ────────────────────────────────────────────────────────
      
      const getScrollAmount = () => {
        return track.scrollWidth - window.innerWidth
      }

      // Main horizontal scroll animation
      const horizontalScroll = gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: 'none',
        scrollTrigger: {
          trigger: gallery,
          start: 'top top',
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          // Update progress bar
          onUpdate: (self) => {
            gsap.set(progress, {
              scaleX: self.progress,
            })
          },
        },
      })

      // ────────────────────────────────────────────────────────
      // CARD ANIMATIONS
      // Each card scales and rotates based on its position
      // ────────────────────────────────────────────────────────
      
      cards.forEach((card, index) => {
        if (!card) return

        // Create individual scroll trigger for each card
        ScrollTrigger.create({
          trigger: card,
          containerAnimation: horizontalScroll,
          start: 'left 80%',
          end: 'left 20%',
          scrub: 1,
          onUpdate: (self) => {
            // Progress goes from 0 to 1 as card moves through viewport
            const progress = self.progress
            
            // Scale: start small, peak at center, end small
            const scale = 0.8 + (0.2 * Math.sin(progress * Math.PI))
            
            // Rotation: start rotated, normalize at center, rotate opposite at end
            const rotate = (progress - 0.5) * -10
            
            gsap.set(card, {
              scale,
              rotate,
              opacity: 0.5 + (0.5 * Math.sin(progress * Math.PI)),
            })
          },
        })
      })

      // Handle resize
      ScrollTrigger.addEventListener('refreshInit', () => {
        gsap.set(track, { x: 0 })
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} style={styles.container}>
      {/* Back button */}
      <Link to="/" style={styles.backButton}>← Back</Link>

      {/* Hero section */}
      <section style={styles.hero}>
        <h1 style={styles.title}>Horizontal Scroll</h1>
        <p style={styles.subtitle}>
          Scroll down to experience a pinned horizontal gallery.
          Cards scale and rotate as they pass through the viewport.
        </p>
        <div style={styles.scrollHint}>
          <span>↓</span>
          <span style={styles.hintText}>Scroll to begin</span>
        </div>
      </section>

      {/* Horizontal gallery section */}
      <section ref={galleryRef} style={styles.gallery}>
        {/* Progress bar */}
        <div style={styles.progressBar}>
          <div ref={progressRef} style={styles.progressFill} />
        </div>

        {/* Gallery track */}
        <div ref={trackRef} style={styles.track}>
          {/* Intro card */}
          <div style={styles.introCard}>
            <span style={styles.introNumber}>01</span>
            <h2 style={styles.introTitle}>The Gallery</h2>
            <p style={styles.introText}>
              A collection of moments, each one carefully composed and waiting to be discovered.
            </p>
          </div>

          {/* Gallery cards */}
          {GALLERY_ITEMS.map((item, index) => (
            <div
              key={item.id}
              ref={el => { cardRefs.current[index] = el }}
              style={{
                ...styles.card,
                borderColor: item.color + '33',
              }}
            >
              <div 
                style={{
                  ...styles.cardImage,
                  backgroundImage: `url(${item.image})`,
                }}
              />
              <div style={styles.cardContent}>
                <span style={{ ...styles.cardCategory, color: item.color }}>
                  {item.category}
                </span>
                <h3 style={styles.cardTitle}>{item.title}</h3>
                <span style={styles.cardNumber}>
                  {String(index + 2).padStart(2, '0')}
                </span>
              </div>
            </div>
          ))}

          {/* Outro card */}
          <div style={styles.outroCard}>
            <span style={styles.outroNumber}>
              {String(GALLERY_ITEMS.length + 2).padStart(2, '0')}
            </span>
            <h2 style={styles.outroTitle}>End of Gallery</h2>
            <p style={styles.outroText}>
              Continue scrolling to exit the horizontal section.
            </p>
          </div>
        </div>

        {/* Gallery navigation hints */}
        <div style={styles.navHints}>
          <span style={styles.navHint}>← Scroll to navigate →</span>
        </div>
      </section>

      {/* After gallery content */}
      <section style={styles.afterSection}>
        <h2 style={styles.afterTitle}>How It Works</h2>
        <div style={styles.techGrid}>
          <div style={styles.techCard}>
            <span style={styles.techIcon}>📌</span>
            <h3>ScrollTrigger Pin</h3>
            <p>The gallery section is pinned while you scroll, creating the horizontal movement effect.</p>
          </div>
          <div style={styles.techCard}>
            <span style={styles.techIcon}>↔️</span>
            <h3>X Translation</h3>
            <p>The track moves left as you scroll down. Distance = track width - viewport width.</p>
          </div>
          <div style={styles.techCard}>
            <span style={styles.techIcon}>🎭</span>
            <h3>Card Animations</h3>
            <p>Each card has its own ScrollTrigger linked to the container animation for individual effects.</p>
          </div>
          <div style={styles.techCard}>
            <span style={styles.techIcon}>📊</span>
            <h3>Progress Scrubbing</h3>
            <p>Scrub: 1 means the animation takes 1 second to catch up, creating smoothness.</p>
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
    background: '#0a0a0a',
    color: '#fff',
    fontFamily: '"Inter", system-ui, sans-serif',
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
  hero: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '2rem',
  },
  title: {
    fontSize: 'clamp(2.5rem, 8vw, 5rem)',
    fontWeight: 700,
    letterSpacing: '-0.04em',
    marginBottom: '1rem',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: 'rgba(255, 255, 255, 0.5)',
    maxWidth: '500px',
    lineHeight: 1.6,
    marginBottom: '3rem',
  },
  scrollHint: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    animation: 'bounce 2s infinite',
    fontSize: '1.5rem',
    opacity: 0.5,
  },
  hintText: {
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  gallery: {
    height: '100vh',
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    position: 'absolute',
    bottom: 40,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '200px',
    height: '3px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '2px',
    zIndex: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: '#fff',
    transformOrigin: 'left center',
    transform: 'scaleX(0)',
  },
  track: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    gap: '3rem',
    padding: '0 10vw',
    willChange: 'transform',
  },
  introCard: {
    flexShrink: 0,
    width: '400px',
    padding: '3rem',
  },
  introNumber: {
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.3)',
    fontFamily: 'monospace',
    letterSpacing: '0.1em',
  },
  introTitle: {
    fontSize: '3rem',
    fontWeight: 700,
    marginBottom: '1rem',
    letterSpacing: '-0.03em',
  },
  introText: {
    fontSize: '1.1rem',
    color: 'rgba(255, 255, 255, 0.5)',
    lineHeight: 1.7,
  },
  card: {
    flexShrink: 0,
    width: '350px',
    height: '500px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '16px',
    border: '1px solid',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    willChange: 'transform',
  },
  cardImage: {
    flex: 1,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  cardContent: {
    padding: '1.5rem',
    position: 'relative',
  },
  cardCategory: {
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '0.5rem',
    display: 'block',
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    letterSpacing: '-0.02em',
  },
  cardNumber: {
    position: 'absolute',
    right: '1.5rem',
    bottom: '1.5rem',
    fontSize: '0.75rem',
    fontFamily: 'monospace',
    color: 'rgba(255, 255, 255, 0.3)',
  },
  outroCard: {
    flexShrink: 0,
    width: '400px',
    padding: '3rem',
    textAlign: 'right',
  },
  outroNumber: {
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.3)',
    fontFamily: 'monospace',
    letterSpacing: '0.1em',
  },
  outroTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: '1rem',
    letterSpacing: '-0.03em',
  },
  outroText: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.5)',
    lineHeight: 1.7,
  },
  navHints: {
    position: 'absolute',
    top: 40,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10,
  },
  navHint: {
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.3)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  afterSection: {
    minHeight: '100vh',
    padding: '6rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  afterTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: '3rem',
    textAlign: 'center',
  },
  techGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    maxWidth: '1000px',
  },
  techCard: {
    padding: '2rem',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  techIcon: {
    fontSize: '2rem',
    display: 'block',
    marginBottom: '1rem',
  },
}

export default HorizontalScroll
