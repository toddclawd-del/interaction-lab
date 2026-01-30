import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'

gsap.registerPlugin(ScrollTrigger)

// ════════════════════════════════════════════════════════════════
// TEXT REVEAL — SplitText Showcase
// Multiple text reveal variations: char-by-char, word-by-word,
// line-by-line, scramble effect, and gradient clip-path reveal
// ════════════════════════════════════════════════════════════════

const SAMPLE_TEXTS = {
  hero: "Typography in Motion",
  chars: "Characters rise and rotate into view",
  words: "Each word fades and slides gracefully",
  lines: "Lines reveal\nwith perfect\nstaggered timing",
  scramble: "Decode the message",
  gradient: "Gradient Reveal Effect",
}

// Scramble effect characters
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'

export function TextReveal() {
  const containerRef = useRef<HTMLDivElement>(null)
  // Track active demo (not currently used in UI but could be for visual feedback)
  const [, setActiveDemo] = useState<string | null>(null)
  
  // Refs for each text element
  const charRef = useRef<HTMLDivElement>(null)
  const wordRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const scrambleRef = useRef<HTMLDivElement>(null)
  const gradientRef = useRef<HTMLDivElement>(null)
  
  // Timeline refs to replay animations
  const timelines = useRef<Record<string, gsap.core.Timeline>>({})

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // ────────────────────────────────────────────────────────
      // 1. CHARACTER-BY-CHARACTER with rotation from bottom
      // ────────────────────────────────────────────────────────
      if (charRef.current) {
        const split = new SplitType(charRef.current, { types: 'chars' })
        
        // Set initial state
        gsap.set(split.chars, {
          y: 100,
          opacity: 0,
          rotateX: -90,
          transformOrigin: 'bottom center',
        })
        
        timelines.current.chars = gsap.timeline({ paused: true })
          .to(split.chars, {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.8,
            ease: 'back.out(1.7)',
            stagger: {
              amount: 0.6,
              from: 'start',
            },
          })
      }

      // ────────────────────────────────────────────────────────
      // 2. WORD-BY-WORD fade + slide
      // ────────────────────────────────────────────────────────
      if (wordRef.current) {
        const split = new SplitType(wordRef.current, { types: 'words' })
        
        gsap.set(split.words, {
          y: 40,
          opacity: 0,
          filter: 'blur(10px)',
        })
        
        timelines.current.words = gsap.timeline({ paused: true })
          .to(split.words, {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.1,
          })
      }

      // ────────────────────────────────────────────────────────
      // 3. LINE-BY-LINE with stagger
      // ────────────────────────────────────────────────────────
      if (lineRef.current) {
        const split = new SplitType(lineRef.current, { types: 'lines' })
        
        // Wrap each line for clip-path reveal
        split.lines?.forEach(line => {
          const wrapper = document.createElement('div')
          wrapper.style.overflow = 'hidden'
          wrapper.style.display = 'block'
          line.parentNode?.insertBefore(wrapper, line)
          wrapper.appendChild(line)
        })
        
        gsap.set(split.lines, {
          y: '100%',
        })
        
        timelines.current.lines = gsap.timeline({ paused: true })
          .to(split.lines, {
            y: '0%',
            duration: 0.9,
            ease: 'power4.out',
            stagger: 0.15,
          })
      }

      // ────────────────────────────────────────────────────────
      // 4. SCRAMBLE text effect
      // ────────────────────────────────────────────────────────
      if (scrambleRef.current) {
        const originalText = SAMPLE_TEXTS.scramble
        const el = scrambleRef.current
        
        timelines.current.scramble = gsap.timeline({ paused: true })
        
        // Custom scramble animation using onUpdate
        const scrambleTl = gsap.timeline({ paused: true })
        scrambleTl.to({ progress: 0 }, {
          progress: 1,
          duration: 1.5,
          ease: 'power2.out',
          onUpdate: function() {
            const progress = this.progress()
            const revealedCount = Math.floor(progress * originalText.length)
            
            let displayText = ''
            for (let i = 0; i < originalText.length; i++) {
              if (originalText[i] === ' ') {
                displayText += ' '
              } else if (i < revealedCount) {
                displayText += originalText[i]
              } else {
                displayText += CHARS[Math.floor(Math.random() * CHARS.length)]
              }
            }
            el.textContent = displayText
          },
          onComplete: () => {
            el.textContent = originalText
          }
        })
        
        timelines.current.scramble = scrambleTl
      }

      // ────────────────────────────────────────────────────────
      // 5. GRADIENT clip-path reveal
      // ────────────────────────────────────────────────────────
      if (gradientRef.current) {
        gsap.set(gradientRef.current, {
          clipPath: 'inset(0 100% 0 0)',
        })
        
        timelines.current.gradient = gsap.timeline({ paused: true })
          .to(gradientRef.current, {
            clipPath: 'inset(0 0% 0 0)',
            duration: 1.2,
            ease: 'power3.inOut',
          })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const playAnimation = (key: string) => {
    setActiveDemo(key)
    const tl = timelines.current[key]
    if (tl) {
      tl.restart()
    }
  }

  const resetAnimation = (key: string) => {
    const tl = timelines.current[key]
    if (tl) {
      tl.pause().progress(0)
    }
  }

  return (
    <div ref={containerRef} style={styles.container}>
      {/* Back button */}
      <Link to="/" style={styles.backButton}>← Back</Link>
      
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>Text Reveal</h1>
        <p style={styles.subtitle}>
          Click each button to trigger the animation. Click again to replay.
        </p>
      </header>

      {/* Demo sections */}
      <div style={styles.demos}>
        
        {/* Character reveal */}
        <section style={styles.demoSection}>
          <div style={styles.demoHeader}>
            <span style={styles.demoNumber}>01</span>
            <h2 style={styles.demoTitle}>Character Rotation</h2>
            <p style={styles.demoDesc}>Each character rotates up from below with a back ease</p>
          </div>
          <div style={styles.textContainer}>
            <div 
              ref={charRef} 
              style={{ ...styles.demoText, ...styles.charText }}
            >
              {SAMPLE_TEXTS.chars}
            </div>
          </div>
          <button 
            style={styles.triggerButton}
            onClick={() => {
              resetAnimation('chars')
              setTimeout(() => playAnimation('chars'), 50)
            }}
            aria-label="Play character rotation animation"
          >
            Play Animation
          </button>
        </section>

        {/* Word reveal */}
        <section style={styles.demoSection}>
          <div style={styles.demoHeader}>
            <span style={styles.demoNumber}>02</span>
            <h2 style={styles.demoTitle}>Word Fade + Blur</h2>
            <p style={styles.demoDesc}>Words fade in while deblurring and sliding up</p>
          </div>
          <div style={styles.textContainer}>
            <div 
              ref={wordRef} 
              style={{ ...styles.demoText, ...styles.wordText }}
            >
              {SAMPLE_TEXTS.words}
            </div>
          </div>
          <button 
            style={styles.triggerButton}
            onClick={() => {
              resetAnimation('words')
              setTimeout(() => playAnimation('words'), 50)
            }}
            aria-label="Play word fade animation"
          >
            Play Animation
          </button>
        </section>

        {/* Line reveal */}
        <section style={styles.demoSection}>
          <div style={styles.demoHeader}>
            <span style={styles.demoNumber}>03</span>
            <h2 style={styles.demoTitle}>Line Reveal</h2>
            <p style={styles.demoDesc}>Lines slide up from masked containers with stagger</p>
          </div>
          <div style={styles.textContainer}>
            <div 
              ref={lineRef} 
              style={{ ...styles.demoText, ...styles.lineText, whiteSpace: 'pre-line' }}
            >
              {SAMPLE_TEXTS.lines}
            </div>
          </div>
          <button 
            style={styles.triggerButton}
            onClick={() => {
              resetAnimation('lines')
              setTimeout(() => playAnimation('lines'), 50)
            }}
            aria-label="Play line reveal animation"
          >
            Play Animation
          </button>
        </section>

        {/* Scramble effect */}
        <section style={styles.demoSection}>
          <div style={styles.demoHeader}>
            <span style={styles.demoNumber}>04</span>
            <h2 style={styles.demoTitle}>Scramble Decode</h2>
            <p style={styles.demoDesc}>Random characters resolve into the final text</p>
          </div>
          <div style={styles.textContainer}>
            <div 
              ref={scrambleRef} 
              style={{ ...styles.demoText, ...styles.scrambleText, fontFamily: 'monospace' }}
            >
              {SAMPLE_TEXTS.scramble}
            </div>
          </div>
          <button 
            style={styles.triggerButton}
            onClick={() => {
              if (scrambleRef.current) {
                scrambleRef.current.textContent = CHARS.slice(0, SAMPLE_TEXTS.scramble.length)
              }
              setTimeout(() => playAnimation('scramble'), 50)
            }}
            aria-label="Play scramble decode animation"
          >
            Play Animation
          </button>
        </section>

        {/* Gradient reveal */}
        <section style={styles.demoSection}>
          <div style={styles.demoHeader}>
            <span style={styles.demoNumber}>05</span>
            <h2 style={styles.demoTitle}>Gradient Wipe</h2>
            <p style={styles.demoDesc}>Clip-path reveals gradient text from left to right</p>
          </div>
          <div style={styles.textContainer}>
            <div 
              ref={gradientRef} 
              style={{ ...styles.demoText, ...styles.gradientText }}
            >
              {SAMPLE_TEXTS.gradient}
            </div>
          </div>
          <button 
            style={styles.triggerButton}
            onClick={() => {
              resetAnimation('gradient')
              setTimeout(() => playAnimation('gradient'), 50)
            }}
            aria-label="Play gradient wipe animation"
          >
            Play Animation
          </button>
        </section>

      </div>

      {/* Code hint */}
      <div style={styles.codeHint}>
        <code style={styles.code}>
          Uses: SplitType + GSAP for text splitting and animation
        </code>
      </div>
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
    transition: 'color 0.2s',
  },
  header: {
    textAlign: 'center',
    marginBottom: '4rem',
    maxWidth: '600px',
    margin: '0 auto 4rem',
  },
  title: {
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    fontWeight: 700,
    letterSpacing: '-0.03em',
    marginBottom: '1rem',
    background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.5)',
    lineHeight: 1.6,
  },
  demos: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4rem',
    maxWidth: '900px',
    margin: '0 auto',
  },
  demoSection: {
    padding: '2rem',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  demoHeader: {
    marginBottom: '2rem',
  },
  demoNumber: {
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.3)',
    fontFamily: 'monospace',
    letterSpacing: '0.1em',
    display: 'block',
    marginBottom: '0.5rem',
  },
  demoTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
  },
  demoDesc: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  textContainer: {
    minHeight: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',
    perspective: '1000px',
  },
  demoText: {
    fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
    fontWeight: 600,
    textAlign: 'center',
    lineHeight: 1.3,
  },
  charText: {
    color: '#fff',
  },
  wordText: {
    color: '#fff',
  },
  lineText: {
    color: '#fff',
    fontSize: 'clamp(1.25rem, 3vw, 2rem)',
  },
  scrambleText: {
    color: '#22c55e',
    letterSpacing: '0.05em',
  },
  gradientText: {
    background: 'linear-gradient(90deg, #6366f1 0%, #ec4899 50%, #f59e0b 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  triggerButton: {
    display: 'block',
    margin: '0 auto',
    padding: '0.875rem 1.75rem',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minHeight: '48px',
    minWidth: '140px',
  },
  codeHint: {
    textAlign: 'center',
    marginTop: '4rem',
    paddingTop: '2rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  },
  code: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.4)',
    fontFamily: 'monospace',
  },
}

export default TextReveal
