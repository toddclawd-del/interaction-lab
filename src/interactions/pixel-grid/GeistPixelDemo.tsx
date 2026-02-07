import { useState, useEffect, useCallback } from 'react'
import './geist-pixel.css'

type PixelVariant = 'square' | 'grid' | 'circle' | 'triangle' | 'line'
type FontState = PixelVariant | 'sans'

const VARIANTS: PixelVariant[] = ['square', 'grid', 'circle', 'triangle', 'line']
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*'

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

// ════════════════════════════════════════════════════════════════
// NEW ANIMATED DEMOS
// ════════════════════════════════════════════════════════════════

// Glitch effect - random letters flicker between variants
const GlitchDemo = () => {
  const text = "GLITCH"
  const [chars, setChars] = useState(text.split(''))
  const [variants, setVariants] = useState<PixelVariant[]>(
    text.split('').map(() => 'square')
  )

  useEffect(() => {
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * text.length)
      const newVariants = [...variants]
      newVariants[idx] = VARIANTS[Math.floor(Math.random() * VARIANTS.length)]
      setVariants(newVariants)
      
      // Occasionally glitch a character
      if (Math.random() > 0.7) {
        const newChars = [...chars]
        const charIdx = Math.floor(Math.random() * text.length)
        newChars[charIdx] = CHARS[Math.floor(Math.random() * CHARS.length)]
        setChars(newChars)
        setTimeout(() => {
          setChars(text.split(''))
        }, 100)
      }
    }, 150)

    return () => clearInterval(interval)
  }, [variants, chars])

  return (
    <section className="demo-section">
      <h2>Glitch Effect</h2>
      <p>Random characters flicker between variants with occasional character swaps.</p>
      
      <div className="transition-demo" style={{ background: '#000' }}>
        <div className="hero-text" style={{ color: '#0f0' }}>
          {chars.map((char, i) => (
            <span
              key={i}
              style={{
                fontFamily: `var(--font-pixel-${variants[i]})`,
                display: 'inline-block',
                textShadow: '0 0 10px currentColor',
              }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

// Wave animation - characters animate in a wave through variants
const WaveDemo = () => {
  const text = "WAVE MOTION"
  const [time, setTime] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => t + 1)
    }, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="demo-section">
      <h2>Wave Animation</h2>
      <p>Characters cycle through variants in a wave pattern.</p>
      
      <div className="transition-demo">
        <div className="hero-text">
          {text.split('').map((char, i) => {
            const wave = Math.sin((time + i * 2) * 0.3)
            const variantIdx = Math.floor((wave + 1) * 2.5) % VARIANTS.length
            const scale = 1 + wave * 0.1
            const y = wave * 10
            
            return (
              <span
                key={i}
                style={{
                  fontFamily: `var(--font-pixel-${VARIANTS[variantIdx]})`,
                  display: 'inline-block',
                  transform: `translateY(${y}px) scale(${scale})`,
                  transition: 'transform 0.1s ease-out',
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Scramble decode effect
const ScrambleDemo = () => {
  const targetText = "DECODED"
  const [displayText, setDisplayText] = useState(
    targetText.split('').map(() => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')
  )
  const [revealed, setRevealed] = useState<boolean[]>(
    targetText.split('').map(() => false)
  )

  const startScramble = useCallback(() => {
    setRevealed(targetText.split('').map(() => false))
    
    // Scramble continuously
    const scrambleInterval = setInterval(() => {
      setDisplayText(prev => 
        prev.split('').map((_, i) => 
          revealed[i] ? targetText[i] : CHARS[Math.floor(Math.random() * CHARS.length)]
        ).join('')
      )
    }, 50)

    // Reveal one character at a time
    targetText.split('').forEach((_, i) => {
      setTimeout(() => {
        setRevealed(prev => {
          const next = [...prev]
          next[i] = true
          return next
        })
      }, 300 + i * 200)
    })

    // Stop scrambling after all revealed
    setTimeout(() => {
      clearInterval(scrambleInterval)
      setDisplayText(targetText)
    }, 300 + targetText.length * 200 + 100)

    return () => clearInterval(scrambleInterval)
  }, [])

  useEffect(() => {
    startScramble()
  }, [])

  return (
    <section className="demo-section">
      <h2>Scramble Decode</h2>
      <p>Text scrambles through random characters before decoding letter by letter.</p>
      
      <div className="transition-demo">
        <div className="hero-text" style={{ fontFamily: 'var(--font-pixel-grid)' }}>
          {displayText.split('').map((char, i) => (
            <span
              key={i}
              style={{
                color: revealed[i] ? '#fff' : '#667eea',
                transition: 'color 0.2s',
              }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>
      
      <div className="controls" style={{ marginTop: '1.5rem' }}>
        <button onClick={startScramble}>Replay</button>
      </div>
    </section>
  )
}

// Loading pulse animation
const PulseDemo = () => {
  const text = "LOADING"
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(p => (p + 1) % 360)
    }, 30)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="demo-section">
      <h2>Loading Pulse</h2>
      <p>Text pulses with scale and opacity, perfect for loading states.</p>
      
      <div className="transition-demo">
        <div className="hero-text">
          {text.split('').map((char, i) => {
            const offset = i * 30
            const pulse = Math.sin((phase + offset) * Math.PI / 180)
            const scale = 1 + pulse * 0.15
            const opacity = 0.5 + pulse * 0.5
            
            return (
              <span
                key={i}
                style={{
                  fontFamily: 'var(--font-pixel-circle)',
                  display: 'inline-block',
                  transform: `scale(${scale})`,
                  opacity,
                }}
              >
                {char}
              </span>
            )
          })}
        </div>
        <div style={{ 
          marginTop: '1rem', 
          width: '200px', 
          height: '4px', 
          background: '#222', 
          borderRadius: '2px',
          overflow: 'hidden',
          margin: '1.5rem auto 0'
        }}>
          <div style={{
            width: `${((phase % 180) / 180) * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #667eea, #764ba2)',
            borderRadius: '2px',
            transition: phase % 180 < 5 ? 'none' : 'width 0.1s linear',
          }} />
        </div>
      </div>
    </section>
  )
}

// Countdown timer
const CountdownDemo = () => {
  const [count, setCount] = useState(10)
  const [variant, setVariant] = useState<PixelVariant>('square')

  useEffect(() => {
    if (count <= 0) return
    
    const timeout = setTimeout(() => {
      setCount(c => c - 1)
      setVariant(VARIANTS[Math.floor(Math.random() * VARIANTS.length)])
    }, 1000)

    return () => clearTimeout(timeout)
  }, [count])

  const reset = () => {
    setCount(10)
    setVariant('square')
  }

  return (
    <section className="demo-section">
      <h2>Countdown</h2>
      <p>Animated countdown with variant changes on each tick.</p>
      
      <div className="transition-demo">
        <div 
          className="hero-text"
          style={{ 
            fontFamily: `var(--font-pixel-${variant})`,
            fontSize: 'clamp(6rem, 20vw, 12rem)',
            transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transform: count > 0 ? 'scale(1)' : 'scale(1.2)',
            color: count === 0 ? '#22c55e' : '#fff',
          }}
        >
          {count === 0 ? 'GO!' : count}
        </div>
      </div>
      
      <div className="controls" style={{ marginTop: '1.5rem' }}>
        <button onClick={reset}>Reset</button>
      </div>
    </section>
  )
}

// Continuous morph through all variants
const MorphDemo = () => {
  const [variantIdx, setVariantIdx] = useState(0)
  const allFonts: FontState[] = [...VARIANTS, 'sans']

  useEffect(() => {
    const interval = setInterval(() => {
      setVariantIdx(i => (i + 1) % allFonts.length)
    }, 800)
    return () => clearInterval(interval)
  }, [])

  const current = allFonts[variantIdx]
  const fontFamily = current === 'sans' 
    ? 'var(--font-geist-sans)' 
    : `var(--font-pixel-${current})`

  return (
    <section className="demo-section">
      <h2>Continuous Morph</h2>
      <p>Text continuously morphs through all variants in a loop.</p>
      
      <div className="transition-demo">
        <div 
          className="hero-text"
          style={{ 
            fontFamily,
            transition: 'font-family 0.4s ease-out, letter-spacing 0.4s ease-out',
            letterSpacing: current === 'sans' ? '-0.03em' : '0',
          }}
        >
          MORPH
        </div>
        <div style={{ 
          marginTop: '1rem', 
          color: '#666',
          fontFamily: 'var(--font-geist-sans)',
          fontSize: '0.875rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}>
          {current}
        </div>
      </div>
    </section>
  )
}

// Split reveal - top pixel, bottom sans
const SplitDemo = () => {
  const [split, setSplit] = useState(50)
  const text = "SPLIT"

  return (
    <section className="demo-section">
      <h2>Split Reveal</h2>
      <p>Drag to reveal the transition between pixel and sans.</p>
      
      <div className="transition-demo" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Pixel layer */}
        <div 
          className="hero-text"
          style={{ 
            fontFamily: 'var(--font-pixel-square)',
            position: 'relative',
            clipPath: `inset(0 0 ${100 - split}% 0)`,
          }}
        >
          {text}
        </div>
        
        {/* Sans layer */}
        <div 
          className="hero-text"
          style={{ 
            fontFamily: 'var(--font-geist-sans)',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            clipPath: `inset(${split}% 0 0 0)`,
            width: '100%',
            letterSpacing: '-0.03em',
          }}
        >
          {text}
        </div>
        
        {/* Drag line */}
        <div style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: `${split}%`,
          height: '2px',
          background: '#667eea',
          cursor: 'ns-resize',
        }} />
      </div>
      
      <input
        type="range"
        min="0"
        max="100"
        value={split}
        onChange={(e) => setSplit(Number(e.target.value))}
        style={{ 
          width: '200px', 
          marginTop: '1.5rem',
          accentColor: '#667eea',
        }}
      />
    </section>
  )
}

// Bouncing letters
const BounceDemo = () => {
  const text = "BOUNCE"
  const [bouncing, setBouncing] = useState<number | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setBouncing(Math.floor(Math.random() * text.length))
      setTimeout(() => setBouncing(null), 300)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="demo-section">
      <h2>Bounce Effect</h2>
      <p>Random characters bounce with a playful spring animation.</p>
      
      <div className="transition-demo">
        <div className="hero-text">
          {text.split('').map((char, i) => (
            <span
              key={i}
              style={{
                fontFamily: bouncing === i ? 'var(--font-pixel-circle)' : 'var(--font-pixel-square)',
                display: 'inline-block',
                transform: bouncing === i ? 'translateY(-20px) scale(1.2)' : 'translateY(0) scale(1)',
                transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), font-family 0.15s',
                color: bouncing === i ? '#667eea' : '#fff',
              }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

// Flip animation
const FlipDemo = () => {
  const text = "FLIP"
  const [flipped, setFlipped] = useState<boolean[]>(text.split('').map(() => false))

  useEffect(() => {
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * text.length)
      setFlipped(prev => {
        const next = [...prev]
        next[idx] = !next[idx]
        return next
      })
    }, 600)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="demo-section">
      <h2>3D Flip</h2>
      <p>Characters flip between pixel and sans with a 3D rotation.</p>
      
      <div className="transition-demo" style={{ perspective: '1000px' }}>
        <div className="hero-text">
          {text.split('').map((char, i) => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                transformStyle: 'preserve-3d',
                transform: flipped[i] ? 'rotateY(180deg)' : 'rotateY(0)',
                transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <span style={{
                fontFamily: flipped[i] ? 'var(--font-geist-sans)' : 'var(--font-pixel-triangle)',
                display: 'inline-block',
                transform: flipped[i] ? 'rotateY(180deg)' : 'none',
              }}>
                {char}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

// Main demo page
export function GeistPixelDemo() {
  return (
    <div className="geist-pixel-demo">
      <h1>Geist Pixel</h1>
      <a href="#/">← Back to Home</a>
      
      {/* Explainer sections */}
      <VariantShowcase />
      <TransitionDemo />
      <ComparisonDemo />
      
      {/* Animated demos */}
      <div style={{ 
        borderTop: '1px solid #222', 
        marginTop: '4rem', 
        paddingTop: '4rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{ 
          fontSize: '0.875rem', 
          color: '#666', 
          textTransform: 'uppercase', 
          letterSpacing: '0.1em',
          marginBottom: '3rem',
          textAlign: 'center'
        }}>
          Animation Showcase
        </h2>
      </div>
      
      <WaveDemo />
      <GlitchDemo />
      <MorphDemo />
      <BounceDemo />
      <FlipDemo />
      <PulseDemo />
      <ScrambleDemo />
      <CountdownDemo />
      <SplitDemo />
      <StaggeredReveal />
      <HoverReveal />
      <TypingDemo />
      <HeroDemo />
      
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
