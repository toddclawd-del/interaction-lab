/**
 * 3D Gradient Carousel
 * 
 * Reference: https://tympanus.net/codrops/2025/11/11/building-a-3d-infinite-carousel-with-reactive-background-gradients/
 * 
 * An infinite looping 3D card carousel where the background gradient
 * dynamically adapts to the colors of the active image.
 * 
 * Key techniques:
 * - CSS 3D transforms with perspective for depth
 * - Canvas for smooth reactive gradient backgrounds
 * - Color extraction from images using canvas
 * - Inertia/momentum physics for natural drag feel
 * - GSAP for smooth color transitions
 */

import { useEffect, useRef, useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'

// ============================================
// Configuration Constants
// ============================================

const CONFIG = {
  // 3D look
  MAX_ROTATION: 28,      // Higher = stronger "page-flip" effect
  MAX_DEPTH: 140,        // translateZ depth in pixels
  MIN_SCALE: 0.80,       // Minimum scale for side cards
  SCALE_RANGE: 0.20,     // Scale boost at center
  
  // Layout & spacing
  CARD_WIDTH: 280,       // Base card width
  CARD_HEIGHT: 380,      // Base card height
  GAP: 28,               // Gap between cards
  
  // Motion feel
  FRICTION: 0.92,        // Velocity decay (0-1, lower = more friction)
  WHEEL_SENS: 0.6,       // Mouse wheel sensitivity
  DRAG_SENS: 1.2,        // Drag sensitivity
  
  // Background
  BG_BLUR: 32,           // Background blur amount
  GRADIENT_TRANSITION: 800, // ms for gradient color transition
}

// Sample images from picsum.photos
const IMAGES = [
  'https://picsum.photos/seed/carousel1/600/800',
  'https://picsum.photos/seed/carousel2/600/800',
  'https://picsum.photos/seed/carousel3/600/800',
  'https://picsum.photos/seed/carousel4/600/800',
  'https://picsum.photos/seed/carousel5/600/800',
  'https://picsum.photos/seed/carousel6/600/800',
  'https://picsum.photos/seed/carousel7/600/800',
  'https://picsum.photos/seed/carousel8/600/800',
]

// ============================================
// Color Extraction Utilities
// ============================================

interface RGB {
  r: number
  g: number
  b: number
}

interface Palette {
  primary: RGB
  secondary: RGB
}

/**
 * Extract dominant colors from an image using canvas
 */
function extractColors(img: HTMLImageElement): Palette {
  const MAX = 48
  const ratio = img.naturalWidth && img.naturalHeight 
    ? img.naturalWidth / img.naturalHeight 
    : 1
  const tw = ratio >= 1 ? MAX : Math.max(16, Math.round(MAX * ratio))
  const th = ratio >= 1 ? Math.max(16, Math.round(MAX / ratio)) : MAX

  const canvas = document.createElement('canvas')
  canvas.width = tw
  canvas.height = th
  
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return { primary: { r: 100, g: 100, b: 150 }, secondary: { r: 150, g: 100, b: 100 } }
  }
  
  ctx.drawImage(img, 0, 0, tw, th)
  const data = ctx.getImageData(0, 0, tw, th).data

  // Simple color extraction: sample regions of the image
  const colors: RGB[] = []
  
  // Sample from center
  const centerIdx = (Math.floor(th / 2) * tw + Math.floor(tw / 2)) * 4
  colors.push({ r: data[centerIdx], g: data[centerIdx + 1], b: data[centerIdx + 2] })
  
  // Sample from corners
  const corners = [
    0, // top-left
    (tw - 1) * 4, // top-right
    ((th - 1) * tw) * 4, // bottom-left
    ((th - 1) * tw + tw - 1) * 4, // bottom-right
  ]
  
  corners.forEach(idx => {
    colors.push({ r: data[idx], g: data[idx + 1], b: data[idx + 2] })
  })

  // Calculate average for primary
  const primary = colors.reduce((acc, c) => ({
    r: acc.r + c.r / colors.length,
    g: acc.g + c.g / colors.length,
    b: acc.b + c.b / colors.length,
  }), { r: 0, g: 0, b: 0 })

  // Secondary: sample from edge regions
  const edgeIdx = Math.floor(tw / 4) * 4
  const secondary = { r: data[edgeIdx], g: data[edgeIdx + 1], b: data[edgeIdx + 2] }

  return {
    primary: { r: Math.round(primary.r), g: Math.round(primary.g), b: Math.round(primary.b) },
    secondary,
  }
}

// ============================================
// Transform Calculation
// ============================================

/**
 * Calculate 3D transform for a card based on its screen position
 */
function transformForScreenX(screenX: number, vwHalf: number): { transform: string; z: number } {
  const norm = Math.max(-1, Math.min(1, screenX / vwHalf))
  const absNorm = Math.abs(norm)
  const invNorm = 1 - absNorm

  const ry = -norm * CONFIG.MAX_ROTATION
  const tz = invNorm * CONFIG.MAX_DEPTH
  const scale = CONFIG.MIN_SCALE + invNorm * CONFIG.SCALE_RANGE

  return {
    transform: `translate3d(${screenX}px, -50%, ${tz}px) rotateY(${ry}deg) scale(${scale})`,
    z: tz,
  }
}

// ============================================
// Modulo helper (handles negative numbers)
// ============================================

function mod(n: number, m: number): number {
  return ((n % m) + m) % m
}

// ============================================
// Main Component
// ============================================

export function GradientCarousel() {
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<{ el: HTMLElement; x: number; img: HTMLImageElement }[]>([])
  const palettesRef = useRef<Palette[]>([])
  
  // Animation state
  const scrollXRef = useRef(0)
  const velocityRef = useRef(0)
  const rafIdRef = useRef<number>(0)
  const lastTimeRef = useRef(0)
  const activeIndexRef = useRef(0)
  const isDraggingRef = useRef(false)
  const lastPointerXRef = useRef(0)
  
  // Gradient animation state
  const gradientRef = useRef({
    r1: 100, g1: 100, b1: 150,
    r2: 150, g2: 100, b2: 100,
    x1: 0.3, y1: 0.3,
    x2: 0.7, y2: 0.7,
  })
  
  const [isLoading, setIsLoading] = useState(true)
  const [vwHalf, setVwHalf] = useState(window.innerWidth * 0.5)

  // Calculate total track length
  const STEP = CONFIG.CARD_WIDTH + CONFIG.GAP
  const TRACK = IMAGES.length * STEP

  // ============================================
  // Background Canvas Rendering
  // ============================================
  
  const drawBackground = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const w = canvas.width
    const h = canvas.height
    const g = gradientRef.current
    
    // Clear
    ctx.fillStyle = '#f6f7f9'
    ctx.fillRect(0, 0, w, h)
    
    // Add animated offset for organic movement
    const time = Date.now() * 0.0003
    const xOff1 = Math.sin(time) * 0.1
    const yOff1 = Math.cos(time * 0.8) * 0.1
    const xOff2 = Math.cos(time * 1.2) * 0.1
    const yOff2 = Math.sin(time * 0.9) * 0.1
    
    // First gradient blob
    const x1 = (g.x1 + xOff1) * w
    const y1 = (g.y1 + yOff1) * h
    const r1 = Math.max(w, h) * 0.6
    
    const grad1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, r1)
    grad1.addColorStop(0, `rgba(${g.r1}, ${g.g1}, ${g.b1}, 0.7)`)
    grad1.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = grad1
    ctx.fillRect(0, 0, w, h)
    
    // Second gradient blob
    const x2 = (g.x2 + xOff2) * w
    const y2 = (g.y2 + yOff2) * h
    const r2 = Math.max(w, h) * 0.5
    
    const grad2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, r2)
    grad2.addColorStop(0, `rgba(${g.r2}, ${g.g2}, ${g.b2}, 0.5)`)
    grad2.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = grad2
    ctx.fillRect(0, 0, w, h)
  }, [])

  // ============================================
  // Update Card Transforms
  // ============================================
  
  const updateTransforms = useCallback(() => {
    const items = itemsRef.current
    const scrollX = scrollXRef.current
    const half = TRACK / 2
    
    let closestIdx = 0
    let closestDist = Infinity
    
    items.forEach((item, i) => {
      // Calculate wrapped position
      let pos = item.x - scrollX
      if (pos < -half) pos += TRACK
      if (pos > half) pos -= TRACK
      
      const { transform, z } = transformForScreenX(pos, vwHalf)
      item.el.style.transform = transform
      item.el.style.zIndex = String(Math.round(z))
      
      // Track closest to center
      const dist = Math.abs(pos)
      if (dist < closestDist) {
        closestDist = dist
        closestIdx = i
      }
    })
    
    // Update active card gradient if changed
    if (closestIdx !== activeIndexRef.current) {
      activeIndexRef.current = closestIdx
      setActiveGradient(closestIdx)
    }
  }, [TRACK, vwHalf])

  // ============================================
  // Set Active Gradient
  // ============================================
  
  const setActiveGradient = useCallback((index: number) => {
    const palette = palettesRef.current[index]
    if (!palette) return
    
    const g = gradientRef.current
    
    gsap.to(g, {
      r1: palette.primary.r,
      g1: palette.primary.g,
      b1: palette.primary.b,
      r2: palette.secondary.r,
      g2: palette.secondary.g,
      b2: palette.secondary.b,
      duration: CONFIG.GRADIENT_TRANSITION / 1000,
      ease: 'power2.out',
    })
  }, [])

  // ============================================
  // Animation Loop
  // ============================================
  
  const tick = useCallback((t: number) => {
    const dt = lastTimeRef.current ? (t - lastTimeRef.current) / 1000 : 0
    lastTimeRef.current = t
    
    // Apply velocity to scroll position
    scrollXRef.current = mod(scrollXRef.current + velocityRef.current * dt, TRACK)
    
    // Apply friction to velocity
    const decay = Math.pow(CONFIG.FRICTION, dt * 60)
    velocityRef.current *= decay
    if (Math.abs(velocityRef.current) < 0.5) velocityRef.current = 0
    
    updateTransforms()
    drawBackground()
    
    rafIdRef.current = requestAnimationFrame(tick)
  }, [TRACK, updateTransforms, drawBackground])

  // ============================================
  // Input Handlers
  // ============================================
  
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
    velocityRef.current += delta * CONFIG.WHEEL_SENS * 20
  }, [])
  
  const handlePointerDown = useCallback((e: PointerEvent) => {
    isDraggingRef.current = true
    lastPointerXRef.current = e.clientX
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [])
  
  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!isDraggingRef.current) return
    const dx = e.clientX - lastPointerXRef.current
    lastPointerXRef.current = e.clientX
    velocityRef.current -= dx * CONFIG.DRAG_SENS * 60
  }, [])
  
  const handlePointerUp = useCallback(() => {
    isDraggingRef.current = false
  }, [])

  // ============================================
  // Resize Handler
  // ============================================
  
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current
    if (canvas) {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setVwHalf(window.innerWidth * 0.5)
  }, [])

  // ============================================
  // Initialization
  // ============================================
  
  useEffect(() => {
    const stage = stageRef.current
    const cardsContainer = cardsRef.current
    const canvas = canvasRef.current
    
    if (!stage || !cardsContainer || !canvas) return
    
    // Setup canvas
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    // Load images and create cards
    const loadImages = async () => {
      const items: typeof itemsRef.current = []
      const palettes: Palette[] = []
      
      await Promise.all(IMAGES.map((src, i) => {
        return new Promise<void>((resolve) => {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          img.onload = () => {
            // Extract colors
            const palette = extractColors(img)
            palettes[i] = palette
            
            // Create card element
            const card = document.createElement('article')
            card.className = 'gradient-carousel__card'
            card.style.cssText = `
              position: absolute;
              top: 50%;
              left: 50%;
              width: ${CONFIG.CARD_WIDTH}px;
              height: ${CONFIG.CARD_HEIGHT}px;
              transform-style: preserve-3d;
              backface-visibility: hidden;
              contain: layout paint;
              transform-origin: center center;
              cursor: grab;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            `
            
            img.style.cssText = `
              width: 100%;
              height: 100%;
              object-fit: cover;
              pointer-events: none;
              user-select: none;
            `
            img.draggable = false
            
            card.appendChild(img)
            cardsContainer.appendChild(card)
            
            items[i] = { el: card, x: i * STEP, img }
            resolve()
          }
          img.onerror = () => {
            // Fallback palette for failed images
            palettes[i] = { 
              primary: { r: 100 + i * 20, g: 100, b: 150 }, 
              secondary: { r: 150, g: 100 + i * 20, b: 100 } 
            }
            resolve()
          }
          img.src = src
        })
      }))
      
      itemsRef.current = items.filter(Boolean)
      palettesRef.current = palettes
      
      // Initialize with first card's colors
      if (palettes[0]) {
        const g = gradientRef.current
        g.r1 = palettes[0].primary.r
        g.g1 = palettes[0].primary.g
        g.b1 = palettes[0].primary.b
        g.r2 = palettes[0].secondary.r
        g.g2 = palettes[0].secondary.g
        g.b2 = palettes[0].secondary.b
      }
      
      setIsLoading(false)
      
      // Start animation loop
      rafIdRef.current = requestAnimationFrame(tick)
    }
    
    loadImages()
    
    // Event listeners
    stage.addEventListener('wheel', handleWheel, { passive: false })
    stage.addEventListener('pointerdown', handlePointerDown)
    stage.addEventListener('pointermove', handlePointerMove)
    stage.addEventListener('pointerup', handlePointerUp)
    stage.addEventListener('pointercancel', handlePointerUp)
    window.addEventListener('resize', handleResize)
    
    return () => {
      cancelAnimationFrame(rafIdRef.current)
      stage.removeEventListener('wheel', handleWheel)
      stage.removeEventListener('pointerdown', handlePointerDown)
      stage.removeEventListener('pointermove', handlePointerMove)
      stage.removeEventListener('pointerup', handlePointerUp)
      stage.removeEventListener('pointercancel', handlePointerUp)
      window.removeEventListener('resize', handleResize)
    }
  }, [STEP, tick, handleWheel, handlePointerDown, handlePointerMove, handlePointerUp, handleResize])

  return (
    <div style={styles.container}>
      {/* Back button */}
      <Link to="/" style={styles.backButton}>
        ← Back
      </Link>
      
      {/* Main stage */}
      <main ref={stageRef} style={styles.stage}>
        {/* Background canvas */}
        <canvas 
          ref={canvasRef} 
          style={styles.canvas}
          aria-hidden="true"
        />
        
        {/* Cards container */}
        <section 
          ref={cardsRef} 
          style={styles.cards}
          aria-label="Infinite image carousel"
        />
        
        {/* Loading indicator */}
        {isLoading && (
          <div style={styles.loader}>
            <div style={styles.loaderSpinner} />
          </div>
        )}
      </main>
      
      {/* Instructions */}
      <div style={styles.instructions}>
        Drag or scroll to navigate
      </div>
      
      {/* Branding */}
      <div style={styles.branding}>GRADIENT CAROUSEL</div>
      
      {/* Loader animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// ============================================
// Styles
// ============================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
    background: '#f6f7f9',
    fontFamily: "'Inter', system-ui, sans-serif",
    position: 'relative',
  },
  stage: {
    position: 'relative',
    width: '100%',
    height: '100%',
    perspective: '1800px',
    overflow: 'hidden',
    cursor: 'grab',
  },
  canvas: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    filter: `blur(${CONFIG.BG_BLUR}px) saturate(1.1)`,
    pointerEvents: 'none',
  },
  cards: {
    position: 'absolute',
    inset: 0,
    transformStyle: 'preserve-3d',
  },
  backButton: {
    position: 'fixed',
    top: 24,
    left: 24,
    color: 'rgba(0, 0, 0, 0.4)',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
    zIndex: 100,
    transition: 'color 0.2s ease',
    mixBlendMode: 'multiply',
  },
  branding: {
    position: 'fixed',
    top: 24,
    right: 24,
    color: 'rgba(0, 0, 0, 0.2)',
    fontFamily: 'monospace',
    fontSize: 10,
    letterSpacing: '0.1em',
    pointerEvents: 'none',
    userSelect: 'none',
  },
  instructions: {
    position: 'fixed',
    bottom: 32,
    left: '50%',
    transform: 'translateX(-50%)',
    color: 'rgba(0, 0, 0, 0.4)',
    fontSize: 14,
    fontWeight: 400,
    letterSpacing: '0.02em',
    pointerEvents: 'none',
  },
  loader: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(246, 247, 249, 0.9)',
    zIndex: 50,
  },
  loaderSpinner: {
    width: 40,
    height: 40,
    border: '3px solid rgba(0,0,0,0.1)',
    borderTopColor: 'rgba(0,0,0,0.4)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
}

export default GradientCarousel
