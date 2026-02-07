import { useRef, useEffect, useMemo, useCallback, useState } from 'react'
import { 
  calculateGrid, 
  getRevealOrder, 
  calculateDistortion,
  type RevealPattern 
} from './utils/grid-math'
import './pixel-grid.css'

export interface PixelGridProps {
  // Content
  children?: React.ReactNode
  src?: string
  text?: string
  
  // Grid configuration
  pixelSize?: number
  gap?: number
  shape?: 'square' | 'circle'
  borderRadius?: number
  
  // Animation
  animationSpeed?: number
  revealPattern?: RevealPattern
  revealDirection?: 'top' | 'bottom' | 'left' | 'right'
  staggerDelay?: number
  
  // Interactivity
  interactive?: boolean
  distortionMode?: 'repel' | 'attract' | 'swirl' | 'none'
  distortionStrength?: number
  distortionRadius?: number
  
  // Trigger
  triggerOnView?: boolean
  triggerThreshold?: number
  autoPlay?: boolean
  delay?: number
  
  // Styling
  backgroundColor?: string
  pixelColor?: string
  className?: string
  
  // Callbacks
  onRevealStart?: () => void
  onRevealComplete?: () => void
}

export function PixelGrid({
  children,
  src,
  text,
  pixelSize = 8,
  gap = 2,
  shape = 'square',
  borderRadius = 0,
  animationSpeed = 1,
  revealPattern = 'radial',
  revealDirection = 'top',
  staggerDelay = 20,
  interactive = true,
  distortionMode = 'repel',
  distortionStrength = 3,
  distortionRadius = 80,
  triggerOnView = true,
  triggerThreshold = 0.3,
  autoPlay = false,
  delay = 0,
  backgroundColor = '#000',
  pixelColor = '#1a1a1a',
  className = '',
  onRevealStart,
  onRevealComplete,
}: PixelGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const pixelsRef = useRef<HTMLDivElement[]>([])
  const mouseRef = useRef({ x: 0, y: 0, active: false })
  const rafRef = useRef<number>()
  
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isRevealed, setIsRevealed] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  
  // Reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  // Calculate grid based on dimensions
  const grid = useMemo(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return null
    return calculateGrid({
      width: dimensions.width,
      height: dimensions.height,
      pixelSize,
      gap,
    })
  }, [dimensions, pixelSize, gap])

  // Get reveal order based on pattern
  const revealOrder = useMemo(() => {
    if (!grid) return []
    return getRevealOrder(grid, revealPattern, revealDirection)
  }, [grid, revealPattern, revealDirection])

  // Measure container
  useEffect(() => {
    if (!containerRef.current) return
    
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        })
      }
    })
    
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Intersection Observer for trigger on view
  useEffect(() => {
    if (!triggerOnView || !containerRef.current || isRevealed || autoPlay) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => triggerReveal(), delay)
          observer.disconnect()
        }
      },
      { threshold: triggerThreshold }
    )
    
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [triggerOnView, triggerThreshold, isRevealed, autoPlay, delay])

  // Auto-play trigger
  useEffect(() => {
    if (autoPlay && grid && !isRevealed) {
      setTimeout(() => triggerReveal(), delay)
    }
  }, [autoPlay, grid, delay])

  // The main reveal animation
  const triggerReveal = useCallback(() => {
    if (isAnimating || isRevealed) return
    
    setIsAnimating(true)
    onRevealStart?.()
    
    if (prefersReducedMotion) {
      // Skip animation, just reveal
      setIsRevealed(true)
      setIsAnimating(false)
      onRevealComplete?.()
      return
    }
    
    const baseDuration = 300 / animationSpeed
    const baseStagger = staggerDelay / animationSpeed
    
    revealOrder.forEach((index, i) => {
      const pixel = pixelsRef.current[index]
      if (!pixel) return
      
      const revealDelay = i * baseStagger
      
      setTimeout(() => {
        pixel.classList.add('pixel-revealed')
      }, revealDelay)
    })
    
    // Mark complete after all animations
    const totalDuration = revealOrder.length * baseStagger + baseDuration
    setTimeout(() => {
      setIsRevealed(true)
      setIsAnimating(false)
      onRevealComplete?.()
    }, totalDuration)
  }, [isAnimating, isRevealed, revealOrder, animationSpeed, staggerDelay, prefersReducedMotion, onRevealStart, onRevealComplete])

  // Mouse interaction for distortion
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!interactive || distortionMode === 'none' || !containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    }
  }, [interactive, distortionMode])

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.active = false
  }, [])

  // RAF loop for smooth distortion
  useEffect(() => {
    if (!interactive || distortionMode === 'none' || prefersReducedMotion) return
    
    const animate = () => {
      const { x, y, active } = mouseRef.current
      
      pixelsRef.current.forEach((pixel, i) => {
        if (!pixel || !grid) return
        
        const row = Math.floor(i / grid.cols)
        const col = i % grid.cols
        const pixelX = col * (pixelSize + gap) + pixelSize / 2
        const pixelY = row * (pixelSize + gap) + pixelSize / 2
        
        if (active) {
          const { offsetX, offsetY } = calculateDistortion(
            pixelX,
            pixelY,
            x,
            y,
            distortionRadius,
            distortionStrength,
            distortionMode
          )
          
          pixel.style.transform = `translate(${offsetX}px, ${offsetY}px)`
        } else {
          // Lerp back to origin
          const currentTransform = pixel.style.transform
          if (currentTransform && currentTransform !== 'translate(0px, 0px)') {
            const match = currentTransform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/)
            if (match) {
              const currentX = parseFloat(match[1]) * 0.9
              const currentY = parseFloat(match[2]) * 0.9
              if (Math.abs(currentX) < 0.1 && Math.abs(currentY) < 0.1) {
                pixel.style.transform = ''
              } else {
                pixel.style.transform = `translate(${currentX}px, ${currentY}px)`
              }
            }
          }
        }
      })
      
      rafRef.current = requestAnimationFrame(animate)
    }
    
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [interactive, distortionMode, distortionRadius, distortionStrength, grid, pixelSize, gap, prefersReducedMotion])

  // Focus trigger for accessibility
  const handleFocus = useCallback(() => {
    if (!isRevealed && !isAnimating) {
      triggerReveal()
    }
  }, [isRevealed, isAnimating, triggerReveal])

  // Keyboard trigger
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (!isRevealed && !isAnimating) {
        triggerReveal()
      }
    }
  }, [isRevealed, isAnimating, triggerReveal])

  if (!grid) {
    return (
      <div 
        ref={containerRef} 
        className={`pixel-grid-container ${className}`}
        style={{ backgroundColor }}
      >
        {children}
      </div>
    )
  }

  const totalPixels = grid.rows * grid.cols
  const pixelStyle = {
    '--pixel-size': `${pixelSize}px`,
    '--pixel-gap': `${gap}px`,
    '--pixel-color': pixelColor,
    '--pixel-radius': shape === 'circle' ? '50%' : `${borderRadius}px`,
    '--animation-duration': `${300 / animationSpeed}ms`,
  } as React.CSSProperties

  return (
    <div
      ref={containerRef}
      className={`pixel-grid-container ${className}`}
      style={{ backgroundColor, ...pixelStyle }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="img"
      aria-busy={isAnimating}
      aria-live="polite"
      aria-label={text || 'Pixel grid reveal animation'}
    >
      {/* Content layer (revealed) */}
      <div 
        ref={contentRef}
        className="pixel-grid-content"
        aria-hidden={!isRevealed}
      >
        {text ? (
          <span className="pixel-grid-text">{text}</span>
        ) : src ? (
          <img src={src} alt="" className="pixel-grid-image" />
        ) : (
          children
        )}
      </div>
      
      {/* Pixel overlay */}
      <div 
        className="pixel-grid-overlay"
        style={{
          gridTemplateColumns: `repeat(${grid.cols}, ${pixelSize}px)`,
          gridTemplateRows: `repeat(${grid.rows}, ${pixelSize}px)`,
          gap: `${gap}px`,
        }}
        aria-hidden="true"
      >
        {Array.from({ length: totalPixels }).map((_, i) => (
          <div
            key={i}
            ref={(el) => { if (el) pixelsRef.current[i] = el }}
            className={`pixel ${prefersReducedMotion || isRevealed ? 'pixel-revealed' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}
