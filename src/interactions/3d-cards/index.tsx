import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'

// ════════════════════════════════════════════════════════════════
// 3D CARDS — CSS 3D Transforms + GSAP
// Card flip, tilt following cursor, spreading stack, 
// and perspective carousel
// ════════════════════════════════════════════════════════════════

const CARD_IMAGES = Array.from({ length: 6 }, (_, i) => 
  `https://picsum.photos/seed/card${i + 1}/400/300`
)

export function ThreeDCards() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  return (
    <div ref={containerRef} style={styles.container}>
      {/* Back button */}
      <Link to="/" style={styles.backButton}>← Back</Link>

      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>3D Cards</h1>
        <p style={styles.subtitle}>
          CSS 3D transforms combined with GSAP for interactive card effects
        </p>
      </header>

      <div style={styles.demos}>
        
        {/* 1. Card Flip */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Card Flip on Hover</h2>
          <p style={styles.sectionDesc}>
            Hover over cards to flip them and reveal the back side
          </p>
          <div style={styles.flipGrid}>
            {[1, 2, 3].map((i) => (
              <FlipCard key={i} index={i} />
            ))}
          </div>
        </section>

        {/* 2. Tilt Effect */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Cursor-Following Tilt</h2>
          <p style={styles.sectionDesc}>
            Move your cursor over the cards to see 3D tilt effect
          </p>
          <div style={styles.tiltGrid}>
            {[1, 2, 3].map((i) => (
              <TiltCard key={i} image={CARD_IMAGES[i - 1]} />
            ))}
          </div>
        </section>

        {/* 3. Spreading Stack */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Spreading Card Stack</h2>
          <p style={styles.sectionDesc}>
            Hover over the stack to spread the cards
          </p>
          <SpreadingStack />
        </section>

        {/* 4. Perspective Carousel */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Perspective Carousel</h2>
          <p style={styles.sectionDesc}>
            Click arrows or drag to rotate the carousel
          </p>
          <PerspectiveCarousel />
        </section>

      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// FLIP CARD COMPONENT
// ════════════════════════════════════════════════════════════════

function FlipCard({ index }: { index: number }) {
  const [isFlipped, setIsFlipped] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleFlip = () => {
    if (!cardRef.current) return
    
    gsap.to(cardRef.current, {
      rotateY: isFlipped ? 0 : 180,
      duration: 0.6,
      ease: 'power2.inOut',
    })
    
    setIsFlipped(!isFlipped)
  }

  return (
    <div 
      style={styles.flipContainer}
      onMouseEnter={handleFlip}
      onMouseLeave={handleFlip}
    >
      <div 
        ref={cardRef}
        style={styles.flipCard}
      >
        {/* Front */}
        <div style={{ ...styles.flipFace, ...styles.flipFront }}>
          <img 
            src={CARD_IMAGES[index - 1]} 
            alt={`Card ${index}`}
            style={styles.flipImage}
          />
          <div style={styles.flipOverlay}>
            <span>Card {index}</span>
          </div>
        </div>
        {/* Back */}
        <div style={{ ...styles.flipFace, ...styles.flipBack }}>
          <div style={styles.flipBackContent}>
            <span style={{ fontSize: '3rem' }}>✨</span>
            <h3>Back Side</h3>
            <p>Flip cards reveal hidden content</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// TILT CARD COMPONENT
// ════════════════════════════════════════════════════════════════

function TiltCard({ image }: { image: string }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current
    const glare = glareRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    // Calculate rotation (invert for natural feel)
    const rotateX = (y - 0.5) * -20
    const rotateY = (x - 0.5) * 20

    gsap.to(card, {
      rotateX,
      rotateY,
      duration: 0.3,
      ease: 'power2.out',
    })

    // Move glare
    if (glare) {
      gsap.to(glare, {
        x: `${x * 100}%`,
        y: `${y * 100}%`,
        opacity: 0.3,
        duration: 0.3,
      })
    }
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    const glare = glareRef.current

    if (card) {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)',
      })
    }

    if (glare) {
      gsap.to(glare, {
        opacity: 0,
        duration: 0.3,
      })
    }
  }

  return (
    <div style={styles.tiltContainer}>
      <div
        ref={cardRef}
        style={styles.tiltCard}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img src={image} alt="Tilt card" style={styles.tiltImage} />
        <div ref={glareRef} style={styles.tiltGlare} />
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// SPREADING STACK COMPONENT
// ════════════════════════════════════════════════════════════════

function SpreadingStack() {
  const stackRef = useRef<HTMLDivElement>(null)
  const [, setIsSpread] = useState(false)

  const handleHover = (spread: boolean) => {
    if (!stackRef.current) return
    
    const cards = stackRef.current.querySelectorAll('.stack-card')
    setIsSpread(spread)

    cards.forEach((card, i) => {
      const offset = i - 2 // Center around middle card
      
      if (spread) {
        gsap.to(card, {
          x: offset * 120,
          y: Math.abs(offset) * 20,
          rotation: offset * 5,
          scale: 1,
          duration: 0.4,
          ease: 'back.out(1.7)',
          delay: i * 0.05,
        })
      } else {
        gsap.to(card, {
          x: offset * 3,
          y: 0,
          rotation: offset * 2,
          scale: 1 - Math.abs(offset) * 0.02,
          duration: 0.4,
          ease: 'power3.out',
          delay: (4 - i) * 0.05,
        })
      }
    })
  }

  return (
    <div 
      ref={stackRef}
      style={styles.stackContainer}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="stack-card"
          style={{
            ...styles.stackCard,
            zIndex: 5 - Math.abs(i - 2),
            transform: `translateX(${(i - 2) * 3}px) rotate(${(i - 2) * 2}deg) scale(${1 - Math.abs(i - 2) * 0.02})`,
          }}
        >
          <img 
            src={CARD_IMAGES[i]} 
            alt={`Stack card ${i + 1}`}
            style={styles.stackImage}
          />
        </div>
      ))}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// PERSPECTIVE CAROUSEL COMPONENT
// ════════════════════════════════════════════════════════════════

function PerspectiveCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState(0)
  const itemCount = 6
  const angleStep = 360 / itemCount

  const rotate = (direction: number) => {
    const newRotation = rotation + direction * angleStep
    setRotation(newRotation)

    if (carouselRef.current) {
      gsap.to(carouselRef.current, {
        rotateY: newRotation,
        duration: 0.8,
        ease: 'power2.out',
      })
    }
  }

  return (
    <div style={styles.carouselContainer}>
      <div style={styles.carouselScene}>
        <div ref={carouselRef} style={styles.carousel}>
          {Array.from({ length: itemCount }, (_, i) => {
            const angle = i * angleStep
            const radius = 200 // Distance from center
            
            return (
              <div
                key={i}
                style={{
                  ...styles.carouselItem,
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                }}
              >
                <img 
                  src={CARD_IMAGES[i]} 
                  alt={`Carousel ${i + 1}`}
                  style={styles.carouselImage}
                />
              </div>
            )
          })}
        </div>
      </div>
      <div style={styles.carouselControls}>
        <button 
          style={styles.carouselButton}
          onClick={() => rotate(-1)}
        >
          ← Prev
        </button>
        <button 
          style={styles.carouselButton}
          onClick={() => rotate(1)}
        >
          Next →
        </button>
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
    marginBottom: '3rem',
    maxWidth: '600px',
    margin: '0 auto 3rem',
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
    maxWidth: '1000px',
    margin: '0 auto',
  },
  section: {
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
  },
  sectionDesc: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: '2rem',
  },
  
  // Flip card styles
  flipGrid: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    flexWrap: 'wrap',
  },
  flipContainer: {
    width: '200px',
    height: '250px',
    perspective: '1000px',
  },
  flipCard: {
    width: '100%',
    height: '100%',
    position: 'relative',
    transformStyle: 'preserve-3d',
  },
  flipFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  flipFront: {
    background: '#1a1a2e',
  },
  flipBack: {
    background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
    transform: 'rotateY(180deg)',
  },
  flipImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  flipOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '1rem',
    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
    color: '#fff',
    fontWeight: 600,
  },
  flipBackContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: '1rem',
  },

  // Tilt card styles
  tiltGrid: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    flexWrap: 'wrap',
  },
  tiltContainer: {
    perspective: '1000px',
  },
  tiltCard: {
    width: '250px',
    height: '180px',
    borderRadius: '12px',
    overflow: 'hidden',
    transformStyle: 'preserve-3d',
    cursor: 'pointer',
    position: 'relative',
    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
  },
  tiltImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  tiltGlare: {
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 50%)',
    opacity: 0,
    pointerEvents: 'none',
    transform: 'translate(-50%, -50%)',
  },

  // Stack styles
  stackContainer: {
    position: 'relative',
    width: '300px',
    height: '200px',
    margin: '0 auto',
    cursor: 'pointer',
  },
  stackCard: {
    position: 'absolute',
    width: '200px',
    height: '150px',
    left: '50%',
    top: '50%',
    marginLeft: '-100px',
    marginTop: '-75px',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    willChange: 'transform',
  },
  stackImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  // Carousel styles
  carouselContainer: {
    paddingTop: '2rem',
  },
  carouselScene: {
    width: '100%',
    height: '300px',
    perspective: '1000px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '2rem',
  },
  carousel: {
    width: '200px',
    height: '150px',
    position: 'relative',
    transformStyle: 'preserve-3d',
  },
  carouselItem: {
    position: 'absolute',
    width: '200px',
    height: '150px',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    backfaceVisibility: 'hidden',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  carouselControls: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
  },
  carouselButton: {
    padding: '0.75rem 1.5rem',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
}

export default ThreeDCards
