import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ════════════════════════════════════════════════════════════════
// SCROLL SCRUB — Scrub-Based Animations
// Animations that respond directly to scroll position:
// progress bar, transforming elements, content swapping, timeline
// ════════════════════════════════════════════════════════════════

const TIMELINE_ITEMS = [
  { year: '2020', title: 'The Beginning', desc: 'First line of code written' },
  { year: '2021', title: 'Growth', desc: 'Expanded to new markets' },
  { year: '2022', title: 'Milestone', desc: 'Reached 1M users' },
  { year: '2023', title: 'Innovation', desc: 'Launched new platform' },
  { year: '2024', title: 'Today', desc: 'Building the future' },
]

export function ScrollScrub() {
  const containerRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const transformBoxRef = useRef<HTMLDivElement>(null)
  const pinnedContentRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // ────────────────────────────────────────────────────────
      // 1. PROGRESS BAR
      // Tracks overall page scroll progress
      // ────────────────────────────────────────────────────────
      if (progressBarRef.current) {
        gsap.to(progressBarRef.current, {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3,
          },
        })
      }

      // ────────────────────────────────────────────────────────
      // 2. TRANSFORMING ELEMENT
      // Multiple properties animate as you scroll
      // ────────────────────────────────────────────────────────
      if (transformBoxRef.current) {
        gsap.to(transformBoxRef.current, {
          rotation: 360,
          scale: 1.5,
          borderRadius: '50%',
          backgroundColor: '#ec4899',
          ease: 'none',
          scrollTrigger: {
            trigger: transformBoxRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1,
          },
        })
      }

      // ────────────────────────────────────────────────────────
      // 3. PINNED CONTENT SWAP
      // Content changes while section stays pinned
      // ────────────────────────────────────────────────────────
      if (pinnedContentRef.current) {
        const slides = pinnedContentRef.current.querySelectorAll('.swap-slide')
        const totalSlides = slides.length
        
        // Set initial states
        gsap.set(slides, { opacity: 0, y: 50 })
        gsap.set(slides[0], { opacity: 1, y: 0 })

        // Create timeline for content swapping
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinnedContentRef.current,
            start: 'top top',
            end: `+=${totalSlides * 100}%`,
            pin: true,
            scrub: 1,
          },
        })

        slides.forEach((slide, i) => {
          if (i < totalSlides - 1) {
            tl.to(slide, { opacity: 0, y: -50, duration: 0.5 }, i)
              .to(slides[i + 1], { opacity: 1, y: 0, duration: 0.5 }, i + 0.3)
          }
        })
      }

      // ────────────────────────────────────────────────────────
      // 4. TIMELINE VISUALIZATION
      // Progress line and items reveal on scroll
      // ────────────────────────────────────────────────────────
      if (timelineRef.current) {
        const line = timelineRef.current.querySelector('.timeline-line-fill')
        const items = timelineRef.current.querySelectorAll('.timeline-item')

        // Animate line
        gsap.to(line, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: 1,
          },
        })

        // Animate items
        items.forEach((item, i) => {
          const dot = item.querySelector('.timeline-dot')
          const content = item.querySelector('.timeline-content')

          gsap.from(dot, {
            scale: 0,
            scrollTrigger: {
              trigger: item,
              start: 'top 70%',
              end: 'top 50%',
              scrub: 1,
            },
          })

          gsap.from(content, {
            opacity: 0,
            x: i % 2 === 0 ? -50 : 50,
            scrollTrigger: {
              trigger: item,
              start: 'top 70%',
              end: 'top 50%',
              scrub: 1,
            },
          })
        })
      }

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} style={styles.container}>
      {/* Fixed progress bar */}
      <div style={styles.progressBarContainer}>
        <div 
          ref={progressBarRef}
          style={styles.progressBar}
        />
      </div>

      {/* Back button */}
      <Link to="/" style={styles.backButton}>← Back</Link>

      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>Scroll Scrub</h1>
        <p style={styles.subtitle}>
          Animations that respond directly to your scroll position
        </p>
        <div style={styles.scrollHint}>↓ Scroll to see effects</div>
      </header>

      {/* Section 1: Progress explanation */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>1. Progress Bar</h2>
        <p style={styles.sectionDesc}>
          The bar at the top tracks your scroll progress through the entire page.
          Uses <code>scrub: 0.3</code> for smooth catching up.
        </p>
      </section>

      {/* Section 2: Transform Box */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>2. Transform on Scroll</h2>
        <p style={styles.sectionDesc}>
          This box rotates, scales, and changes shape as you scroll past it.
          Multiple properties animated with <code>scrub: 1</code>.
        </p>
        <div style={styles.transformContainer}>
          <div 
            ref={transformBoxRef}
            style={styles.transformBox}
          />
        </div>
      </section>

      {/* Section 3: Pinned Content Swap */}
      <section 
        ref={pinnedContentRef}
        style={styles.pinnedSection}
      >
        <h2 style={styles.pinnedTitle}>3. Pinned Content Swap</h2>
        <div style={styles.swapContainer}>
          {['First', 'Second', 'Third', 'Fourth'].map((text, i) => (
            <div key={text} className="swap-slide" style={styles.swapSlide}>
              <span style={styles.swapNumber}>{String(i + 1).padStart(2, '0')}</span>
              <h3 style={styles.swapHeading}>{text} Section</h3>
              <p style={styles.swapText}>
                Content changes while the section stays pinned in place.
                Keep scrolling to see more.
              </p>
            </div>
          ))}
        </div>
        <div style={styles.pinnedHint}>
          Keep scrolling — section is pinned
        </div>
      </section>

      {/* Section 4: Timeline */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>4. Timeline Visualization</h2>
        <p style={styles.sectionDesc}>
          Progress line and items reveal as you scroll through the timeline.
        </p>
        
        <div ref={timelineRef} style={styles.timeline}>
          {/* Timeline line */}
          <div style={styles.timelineLine}>
            <div 
              className="timeline-line-fill"
              style={styles.timelineLineFill}
            />
          </div>
          
          {/* Timeline items */}
          {TIMELINE_ITEMS.map((item, i) => (
            <div 
              key={item.year}
              className="timeline-item"
              style={{
                ...styles.timelineItem,
                flexDirection: i % 2 === 0 ? 'row' : 'row-reverse',
              }}
            >
              <div 
                className="timeline-content"
                style={{
                  ...styles.timelineContent,
                  textAlign: i % 2 === 0 ? 'right' : 'left',
                }}
              >
                <span style={styles.timelineYear}>{item.year}</span>
                <h4 style={styles.timelineTitle}>{item.title}</h4>
                <p style={styles.timelineDesc}>{item.desc}</p>
              </div>
              <div className="timeline-dot" style={styles.timelineDot} />
              <div style={styles.timelineSpacer} />
            </div>
          ))}
        </div>
      </section>

      {/* Code section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Key Scrub Values</h2>
        <div style={styles.codeGrid}>
          <div style={styles.codeCard}>
            <h4>scrub: true</h4>
            <p>Animation directly follows scroll (1:1)</p>
          </div>
          <div style={styles.codeCard}>
            <h4>scrub: 0.5</h4>
            <p>Animation takes 0.5s to catch up</p>
          </div>
          <div style={styles.codeCard}>
            <h4>scrub: 1</h4>
            <p>Animation takes 1s to catch up (smooth)</p>
          </div>
          <div style={styles.codeCard}>
            <h4>scrub: 2</h4>
            <p>Animation takes 2s to catch up (very smooth)</p>
          </div>
        </div>
      </section>

      {/* Footer spacer */}
      <section style={styles.footer}>
        <p>You've reached the end! Scroll back up to replay.</p>
      </section>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// STYLES
// ════════════════════════════════════════════════════════════════

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '400vh',
    background: '#0a0a0a',
    color: '#fff',
    fontFamily: '"Inter", system-ui, sans-serif',
  },
  progressBarContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'rgba(255, 255, 255, 0.1)',
    zIndex: 1000,
  },
  progressBar: {
    height: '100%',
    background: 'linear-gradient(90deg, #6366f1 0%, #ec4899 100%)',
    transformOrigin: 'left center',
    transform: 'scaleX(0)',
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
    marginBottom: '2rem',
  },
  scrollHint: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.4)',
    animation: 'bounce 2s infinite',
  },
  section: {
    padding: '6rem 2rem',
    maxWidth: '800px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: '1rem',
  },
  sectionDesc: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 1.7,
    marginBottom: '2rem',
  },
  transformContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '4rem',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '16px',
  },
  transformBox: {
    width: '100px',
    height: '100px',
    background: '#6366f1',
    borderRadius: '8px',
  },
  pinnedSection: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 100%)',
    position: 'relative',
  },
  pinnedTitle: {
    position: 'absolute',
    top: '2rem',
    fontSize: '1rem',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  swapContainer: {
    position: 'relative',
    width: '100%',
    maxWidth: '600px',
    height: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swapSlide: {
    position: 'absolute',
    textAlign: 'center',
    padding: '2rem',
  },
  swapNumber: {
    fontSize: '5rem',
    fontWeight: 800,
    color: 'rgba(255, 255, 255, 0.1)',
    display: 'block',
  },
  swapHeading: {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: '1rem',
  },
  swapText: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.6)',
    maxWidth: '400px',
    margin: '0 auto',
  },
  pinnedHint: {
    position: 'absolute',
    bottom: '2rem',
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.3)',
  },
  timeline: {
    position: 'relative',
    padding: '2rem 0',
    maxWidth: '600px',
    margin: '0 auto',
  },
  timelineLine: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: '2px',
    background: 'rgba(255, 255, 255, 0.1)',
    transform: 'translateX(-50%)',
  },
  timelineLineFill: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(180deg, #6366f1 0%, #ec4899 100%)',
    transformOrigin: 'top center',
    transform: 'scaleY(0)',
  },
  timelineItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '3rem',
    position: 'relative',
  },
  timelineContent: {
    flex: 1,
    padding: '0 2rem',
  },
  timelineYear: {
    fontSize: '0.75rem',
    color: '#6366f1',
    fontWeight: 600,
    letterSpacing: '0.1em',
  },
  timelineTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
  },
  timelineDesc: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  timelineDot: {
    width: '16px',
    height: '16px',
    background: '#fff',
    borderRadius: '50%',
    flexShrink: 0,
    zIndex: 1,
    border: '4px solid #0a0a0a',
    boxShadow: '0 0 0 2px #6366f1',
  },
  timelineSpacer: {
    flex: 1,
  },
  codeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem',
  },
  codeCard: {
    padding: '1.5rem',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  footer: {
    padding: '4rem 2rem',
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.4)',
  },
}

export default ScrollScrub
