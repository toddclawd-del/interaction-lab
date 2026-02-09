import { useCallback, useEffect, useRef, useState } from 'react'
import './PixelCursorTrail.css'

interface PixelCursorTrailProps {
  columns?: number
  fadeDuration?: number
  colorMode?: 'mono' | 'rainbow' | 'gradient'
  baseColor?: string
  text?: string
  subText?: string
}

export function PixelCursorTrail({
  columns = 40,
  fadeDuration = 600,
  colorMode = 'mono',
  baseColor = '#ffffff',
  text = 'PIXELS',
  subText = 'move your cursor'
}: PixelCursorTrailProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const [pixelCount, setPixelCount] = useState(0)
  const hueRef = useRef(0)
  const activeCountRef = useRef(0)
  const [activeCount, setActiveCount] = useState(0)

  // Calculate grid dimensions
  useEffect(() => {
    const calculateGrid = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const pixelWidth = vw / columns
      const rows = Math.ceil(vh / pixelWidth)
      setPixelCount(columns * rows)
    }

    calculateGrid()
    window.addEventListener('resize', calculateGrid)
    return () => window.removeEventListener('resize', calculateGrid)
  }, [columns])

  // Get color based on mode
  const getColor = useCallback((index: number) => {
    switch (colorMode) {
      case 'rainbow': {
        // Position-based hue
        const col = index % columns
        const row = Math.floor(index / columns)
        const hue = ((col + row * 2) * 7) % 360
        return `hsl(${hue}, 100%, 60%)`
      }
      case 'gradient': {
        // Time-based shifting hue
        hueRef.current = (hueRef.current + 3) % 360
        return `hsl(${hueRef.current}, 100%, 60%)`
      }
      default:
        return baseColor
    }
  }, [colorMode, baseColor, columns])

  // Colorize pixel on hover
  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const index = parseInt(el.dataset.index || '0')
    const color = getColor(index)
    
    el.style.backgroundColor = color
    el.classList.add('active')
    
    activeCountRef.current++
    setActiveCount(activeCountRef.current)

    setTimeout(() => {
      el.style.backgroundColor = 'transparent'
      el.classList.remove('active')
      activeCountRef.current--
      setActiveCount(activeCountRef.current)
    }, fadeDuration)
  }, [getColor, fadeDuration])

  // Generate pixel elements
  const pixels = Array.from({ length: pixelCount }, (_, i) => (
    <div
      key={i}
      data-index={i}
      className="pixel"
      onMouseEnter={handleMouseEnter}
    />
  ))

  return (
    <div className="pixel-cursor-trail">
      <div 
        ref={gridRef}
        className="pixel-grid"
        style={{ 
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          '--fade-duration': `${fadeDuration}ms`,
          '--base-color': baseColor,
        } as React.CSSProperties}
      >
        {pixels}
      </div>
      
      {/* Text overlay with blend mode */}
      <div className="content-overlay">
        <h1 className="main-text">{text}</h1>
        <p className="sub-text">{subText}</p>
      </div>

      {/* Counter badge */}
      <div className="pixel-counter">
        <span className="count">{activeCount}</span>
        <span className="label">active</span>
      </div>
    </div>
  )
}
