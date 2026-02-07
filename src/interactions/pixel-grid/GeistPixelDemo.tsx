import { useState, useEffect, useCallback } from 'react'
import './geist-pixel.css'

type PixelVariant = 'square' | 'grid' | 'circle' | 'triangle' | 'line'
type FontState = PixelVariant | 'sans'

const VARIANTS: PixelVariant[] = ['square', 'grid', 'circle', 'triangle', 'line']

// Variant showcase cards
const VariantShowcase = () => (
  <section className="demo-section">
    <h2>Five Variants</h2>
    <p>Each variant has a distinct pixel shape, all built on the same grid for consistent rhythm.</p>
    <div className="variant-grid">
      {VARIANTS.map(variant => (
        <div key={variant} className="variant-card">
          <div className="variant-label">{variant}</div>
          <div className={`variant-text ${variant}`}>Aa</div>
        </div>
      ))}
    </div>
  </section>
)

// Font transition demo
const TransitionDemo = () => {
  const [font, setFont] = useState<FontState>('square')
  const [autoCycle, setAutoCycle] = useState(true)

  useEffect(() => {
    if (!autoCycle) return
    
    const fonts: FontState[] = [...VARIANTS, 'sans']
    let index = 0
    
    const interval = setInterval(() => {
      index = (index + 1) % fonts.length
      setFont(fonts[index])
    }, 1500)
    
    return () => clearInterval(interval)
  }, [autoCycle])

  const allFonts: FontState[] = [...VARIANTS, 'sans']

  return (
    <section className="demo-section">
      <h2>Font Transitions</h2>
      <p>Smooth transitions between Geist Pixel variants and Geist Sans. Click to select or let it auto-cycle.</p>
      
      <div className="transition-demo">
        <div className={`transition-text pixel-${font === 'sans' ? '' : font} ${font === 'sans' ? 'sans' : ''}`}>
          PIXELS
        </div>
      </div>
      
      <div className="controls">
        {allFonts.map(f => (
          <button
            key={f}
            className={font === f ? 'active' : ''}
            onClick={() => { setFont(f); setAutoCycle(false); }}
          >
            {f}
          </button>
        ))}
        <button
          className={autoCycle ? 'active' : ''}
          onClick={() => setAutoCycle(true)}
        >
          auto
        </button>
      </div>
      
      <div className="cycle-indicator">
        {allFonts.map(f => (
          <div key={f} className={`cycle-dot ${font === f ? 'active' : ''}`} />
        ))}
      </div>
    </section>
  )
}

// Hover to reveal demo
const HoverReveal = () => (
  <section className="demo-section">
    <h2>Hover to Reveal</h2>
    <p>Pixel text transforms to clean Sans on hover. Great for interactive moments.</p>
    
    <div className="hover-demo">
      <div className="hover-text">HOVER ME</div>
    </div>
  </section>
)

// Staggered character reveal
const StaggeredReveal = () => {
  const [revealed, setRevealed] = useState(false)
  const text = "GEIST PIXEL"
  
  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="demo-section">
      <h2>Staggered Reveal</h2>
      <p>Each character transitions from pixel to sans with a stagger delay.</p>
      
      <div className="transition-demo">
        <div className="hero-text">
          {text.split('').map((char, i) => (
            <span
              key={i}
              className="stagger-char"
              style={{
                fontFamily: revealed 
                  ? 'var(--font-geist-sans)' 
                  : 'var(--font-pixel-square)',
                transitionDelay: revealed ? `${i * 80}ms` : '0ms',
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </div>
      </div>
      
      <div className="controls" style={{ marginTop: '1.5rem' }}>
        <button onClick={() => setRevealed(false)}>Reset</button>
        <button onClick={() => setRevealed(true)}>Reveal</button>
      </div>
    </section>
  )
}

// Typing effect with pixel font
const TypingDemo = () => {
  const [text, setText] = useState('')
  const fullText = "Hello, Vercel"
  const [isTyping, setIsTyping] = useState(true)

  const startTyping = useCallback(() => {
    setText('')
    setIsTyping(true)
    let i = 0
    
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setText(fullText.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
        setIsTyping(false)
      }
    }, 120)
    
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const cleanup = startTyping()
    return cleanup
  }, [startTyping])

  return (
    <section className="demo-section">
      <h2>Typewriter Effect</h2>
      <p>Classic typing animation with Geist Pixel Square.</p>
      
      <div className="typing-container">
        <div className="typing-text">
          {text}
          {isTyping && <span className="typing-cursor" />}
        </div>
      </div>
      
      <div className="controls" style={{ marginTop: '1.5rem' }}>
        <button onClick={startTyping}>Replay</button>
      </div>
    </section>
  )
}

// Hero section with scroll-triggered reveal
const HeroDemo = () => {
  const [variant, setVariant] = useState<PixelVariant>('square')

  return (
    <section className="demo-section">
      <h2>Hero Section</h2>
      <p>Large display text cycling through all five pixel variants.</p>
      
      <div className="hero-reveal">
        <div 
          className="hero-text"
          style={{ fontFamily: `var(--font-pixel-${variant})` }}
        >
          BUILD<br/>FASTER
        </div>
        <div className="hero-subtitle">
          Geist Pixel {variant.charAt(0).toUpperCase() + variant.slice(1)}
        </div>
      </div>
      
      <div className="controls" style={{ marginTop: '1.5rem' }}>
        {VARIANTS.map(v => (
          <button
            key={v}
            className={variant === v ? 'active' : ''}
            onClick={() => setVariant(v)}
          >
            {v}
          </button>
        ))}
      </div>
    </section>
  )
}

// Comparison section
const ComparisonDemo = () => (
  <section className="demo-section">
    <h2>Side by Side</h2>
    <p>Geist Pixel Square vs Geist Sans at the same size.</p>
    
    <div className="variant-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
      <div className="variant-card">
        <div className="variant-label">Geist Pixel Square</div>
        <div className="variant-text square" style={{ fontSize: 'clamp(1.5rem, 6vw, 3rem)' }}>
          The quick brown fox
        </div>
      </div>
      <div className="variant-card">
        <div className="variant-label">Geist Sans</div>
        <div className="variant-text" style={{ 
          fontSize: 'clamp(1.5rem, 6vw, 3rem)',
          fontFamily: 'var(--font-geist-sans)'
        }}>
          The quick brown fox
        </div>
      </div>
    </div>
  </section>
)

// Main demo page
export function GeistPixelDemo() {
  return (
    <div className="geist-pixel-demo">
      <h1>Geist Pixel</h1>
      <a href="#/">← Back to Home</a>
      
      <VariantShowcase />
      <TransitionDemo />
      <HeroDemo />
      <StaggeredReveal />
      <HoverReveal />
      <TypingDemo />
      <ComparisonDemo />
      
      <section className="demo-section" style={{ marginBottom: '4rem' }}>
        <h2>Credits</h2>
        <p>
          Geist Pixel by <a href="https://vercel.com/font" style={{ color: '#667eea' }}>Vercel</a>. 
          Five variants: Square, Grid, Circle, Triangle, Line. 
          Designed to ship in real products.
        </p>
      </section>
    </div>
  )
}

export default GeistPixelDemo
