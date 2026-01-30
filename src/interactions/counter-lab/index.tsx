import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ════════════════════════════════════════════════════════════════
// COUNTER LAB — Number Animations
// Various number counting effects: basic easing, decimals,
// slot machine/odometer, and scroll-triggered stats
// ════════════════════════════════════════════════════════════════

interface CounterProps {
  from?: number
  to: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
  easing?: string
  triggerOnScroll?: boolean
  className?: string
}

// Reusable counter component
function Counter({
  from = 0,
  to,
  duration = 2,
  decimals = 0,
  prefix = '',
  suffix = '',
  easing = 'power2.out',
  triggerOnScroll = false,
  className = '',
}: CounterProps) {
  const counterRef = useRef<HTMLSpanElement>(null)
  const valueRef = useRef({ val: from })

  useEffect(() => {
    const counter = counterRef.current
    if (!counter) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      counter.textContent = `${prefix}${to.toFixed(decimals)}${suffix}`
      return
    }

    const animationConfig = {
      val: to,
      duration,
      ease: easing,
      onUpdate: () => {
        counter.textContent = `${prefix}${valueRef.current.val.toFixed(decimals)}${suffix}`
      },
    }

    if (triggerOnScroll) {
      gsap.to(valueRef.current, {
        ...animationConfig,
        scrollTrigger: {
          trigger: counter,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      })
    } else {
      gsap.to(valueRef.current, animationConfig)
    }

    return () => {
      valueRef.current.val = from
    }
  }, [from, to, duration, decimals, prefix, suffix, easing, triggerOnScroll])

  return (
    <span ref={counterRef} className={className}>
      {prefix}{from.toFixed(decimals)}{suffix}
    </span>
  )
}

// Odometer/Slot Machine digit component
function OdometerDigit({ digit, isActive }: { digit: number; isActive: boolean }) {
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  const columnRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!columnRef.current || !isActive) return
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    gsap.to(columnRef.current, {
      y: `-${digit * 10}%`,
      duration: prefersReducedMotion ? 0 : 0.8 + Math.random() * 0.4,
      ease: 'elastic.out(1, 0.5)',
    })
  }, [digit, isActive])

  return (
    <div style={styles.odometerColumn}>
      <div ref={columnRef} style={styles.odometerDigits}>
        {digits.map((d) => (
          <div key={d} style={styles.odometerDigit}>{d}</div>
        ))}
      </div>
    </div>
  )
}

// Full odometer component
function Odometer({ value, isActive }: { value: number; isActive: boolean }) {
  const digits = value.toString().padStart(6, '0').split('').map(Number)

  return (
    <div style={styles.odometerContainer}>
      {digits.map((digit, index) => (
        <OdometerDigit key={index} digit={digit} isActive={isActive} />
      ))}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════

export function CounterLab() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [basicKey, setBasicKey] = useState(0)
  const [odometerValue, setOdometerValue] = useState(0)
  const [odometerActive, setOdometerActive] = useState(false)

  const replayBasic = () => setBasicKey(prev => prev + 1)
  
  const triggerOdometer = () => {
    const newValue = Math.floor(Math.random() * 999999)
    setOdometerValue(newValue)
    setOdometerActive(true)
  }

  return (
    <div ref={containerRef} style={styles.container}>
      {/* Back button */}
      <Link to="/" style={styles.backButton}>← Back</Link>

      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>Counter Lab</h1>
        <p style={styles.subtitle}>
          Different approaches to animating numbers with GSAP
        </p>
      </header>

      {/* Demos */}
      <div style={styles.demos}>

        {/* 1. Basic Counting with Easing */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionNumber}>01</span>
            <h2 style={styles.sectionTitle}>Basic Counter with Easing</h2>
            <p style={styles.sectionDesc}>
              Smooth count-up using GSAP's easing functions
            </p>
          </div>
          <div style={styles.counterDisplay}>
            <Counter
              key={`basic-${basicKey}`}
              from={0}
              to={1847}
              duration={2.5}
              suffix=" users"
              easing="power2.out"
            />
          </div>
          <div style={styles.controls}>
            <button style={styles.button} onClick={replayBasic} aria-label="Replay counter animation">
              Replay Animation
            </button>
          </div>
          <div style={styles.easingOptions}>
            <span style={styles.label}>Easing: power2.out</span>
          </div>
        </section>

        {/* 2. Decimal Counter */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionNumber}>02</span>
            <h2 style={styles.sectionTitle}>Decimal Precision</h2>
            <p style={styles.sectionDesc}>
              Counting with decimal places for percentages, currencies, etc.
            </p>
          </div>
          <div style={styles.decimalGrid}>
            <div style={styles.decimalCard}>
              <span style={styles.decimalLabel}>Percentage</span>
              <Counter
                key={`pct-${basicKey}`}
                from={0}
                to={98.7}
                duration={2}
                decimals={1}
                suffix="%"
                easing="power3.out"
              />
            </div>
            <div style={styles.decimalCard}>
              <span style={styles.decimalLabel}>Currency</span>
              <Counter
                key={`curr-${basicKey}`}
                from={0}
                to={12499.99}
                duration={2.5}
                decimals={2}
                prefix="$"
                easing="power2.inOut"
              />
            </div>
            <div style={styles.decimalCard}>
              <span style={styles.decimalLabel}>Rating</span>
              <Counter
                key={`rate-${basicKey}`}
                from={0}
                to={4.9}
                duration={1.5}
                decimals={1}
                suffix=" / 5"
                easing="elastic.out(1, 0.5)"
              />
            </div>
          </div>
        </section>

        {/* 3. Slot Machine / Odometer */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionNumber}>03</span>
            <h2 style={styles.sectionTitle}>Slot Machine / Odometer</h2>
            <p style={styles.sectionDesc}>
              Individual digit columns that spin like a mechanical counter
            </p>
          </div>
          <div style={styles.odometerDisplay}>
            <Odometer value={odometerValue} isActive={odometerActive} />
          </div>
          <div style={styles.controls}>
            <button style={styles.button} onClick={triggerOdometer} aria-label="Generate random number for odometer display">
              Generate Random Number
            </button>
          </div>
        </section>

        {/* 4. Scroll-Triggered Stats */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionNumber}>04</span>
            <h2 style={styles.sectionTitle}>Scroll-Triggered Stats</h2>
            <p style={styles.sectionDesc}>
              Numbers animate when they scroll into view (scroll down to trigger)
            </p>
          </div>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statValue}>
                <Counter
                  from={0}
                  to={150}
                  duration={2}
                  suffix="+"
                  easing="power2.out"
                  triggerOnScroll
                />
              </div>
              <div style={styles.statLabel}>Projects Completed</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>
                <Counter
                  from={0}
                  to={2.5}
                  duration={2}
                  decimals={1}
                  suffix="M"
                  easing="power2.out"
                  triggerOnScroll
                />
              </div>
              <div style={styles.statLabel}>Users Reached</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>
                <Counter
                  from={0}
                  to={99}
                  duration={2.5}
                  suffix="%"
                  easing="power2.out"
                  triggerOnScroll
                />
              </div>
              <div style={styles.statLabel}>Client Satisfaction</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>
                <Counter
                  from={0}
                  to={24}
                  duration={1.5}
                  suffix="/7"
                  easing="power2.out"
                  triggerOnScroll
                />
              </div>
              <div style={styles.statLabel}>Support Available</div>
            </div>
          </div>
        </section>

        {/* Code Example */}
        <section style={styles.codeSection}>
          <h2 style={styles.codeSectionTitle}>The Technique</h2>
          <pre style={styles.codeBlock}>
{`// GSAP counter animation technique
// Animate an object property, update DOM in onUpdate

const counter = { val: 0 }

gsap.to(counter, {
  val: 1000,
  duration: 2,
  ease: 'power2.out',
  onUpdate: () => {
    // Update the display on every frame
    element.textContent = Math.round(counter.val)
  }
})

// With ScrollTrigger for scroll-based activation
gsap.to(counter, {
  val: 1000,
  scrollTrigger: {
    trigger: element,
    start: 'top 80%',
    toggleActions: 'play none none none'
  }
})`}
          </pre>
        </section>

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
  },
  subtitle: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.5)',
    lineHeight: 1.6,
  },
  demos: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5rem',
    maxWidth: '900px',
    margin: '0 auto',
  },
  section: {
    padding: '2rem',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
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
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
  },
  sectionDesc: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  counterDisplay: {
    fontSize: 'clamp(3rem, 10vw, 5rem)',
    fontWeight: 700,
    textAlign: 'center',
    padding: '2rem',
    fontVariantNumeric: 'tabular-nums',
    letterSpacing: '-0.02em',
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1rem',
  },
  button: {
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
  easingOptions: {
    textAlign: 'center',
    marginTop: '1.5rem',
  },
  label: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.4)',
    fontFamily: 'monospace',
  },
  decimalGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1.5rem',
    padding: '1rem 0',
  },
  decimalCard: {
    padding: '1.5rem',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    textAlign: 'center',
  },
  decimalLabel: {
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    display: 'block',
    marginBottom: '0.75rem',
  },
  odometerDisplay: {
    display: 'flex',
    justifyContent: 'center',
    padding: '2rem',
  },
  odometerContainer: {
    display: 'flex',
    gap: '4px',
    background: '#111',
    padding: '1rem',
    borderRadius: '12px',
    border: '2px solid rgba(255, 255, 255, 0.1)',
  },
  odometerColumn: {
    width: '48px',
    height: '72px',
    overflow: 'hidden',
    background: '#1a1a1a',
    borderRadius: '6px',
  },
  odometerDigits: {
    display: 'flex',
    flexDirection: 'column',
  },
  odometerDigit: {
    width: '48px',
    height: '72px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.5rem',
    fontWeight: 700,
    fontFamily: 'monospace',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1.5rem',
    marginTop: '2rem',
  },
  statCard: {
    padding: '1.5rem',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.06)',
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
    fontVariantNumeric: 'tabular-nums',
  },
  statLabel: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  codeSection: {
    padding: '2rem',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  codeSectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  codeBlock: {
    background: 'rgba(0, 0, 0, 0.4)',
    padding: '1.5rem',
    borderRadius: '8px',
    fontSize: '0.8rem',
    overflow: 'auto',
    fontFamily: 'monospace',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 1.6,
  },
}

export default CounterLab
