import { 
  createContext, 
  useContext, 
  useRef, 
  useState, 
  useCallback,
  useEffect,
  useMemo,
  type ReactNode, 
  type CSSProperties 
} from 'react'
import { motion, useSpring, useMotionValue, useTransform, type MotionValue } from 'framer-motion'

// ============================================================================
// Types
// ============================================================================

interface SpringConfig {
  damping: number
  stiffness: number
}

interface ParallaxTiltCardProps {
  children: ReactNode
  
  // Tilt config
  maxTilt?: number              // default: 15 (degrees)
  tiltReverse?: boolean         // default: false
  perspective?: number          // default: 1000 (px)
  
  // Parallax
  parallaxMultiplier?: number   // default: 10 (px per depth unit)
  
  // Shine
  shine?: boolean               // default: true
  shineOpacity?: number         // default: 0.15
  shineColor?: string           // default: 'rgba(255,255,255,0.5)'
  
  // Physics
  springConfig?: SpringConfig
  
  // Magnetic pull (optional)
  magnetic?: boolean            // default: false
  magneticStrength?: number     // default: 0.1
  
  // Other
  disabled?: boolean
  className?: string
  style?: CSSProperties
}

interface ParallaxLayerProps {
  children: ReactNode
  depth?: number                // default: 1
  className?: string
  style?: CSSProperties
}

interface ParallaxContextValue {
  // Normalized cursor position (-1 to 1)
  cursorX: MotionValue<number>
  cursorY: MotionValue<number>
  // Multiplier for parallax movement
  parallaxMultiplier: number
  // Is card being hovered
  isHovered: boolean
  // Reduced motion preference
  prefersReducedMotion: boolean
}

// ============================================================================
// Context
// ============================================================================

const ParallaxContext = createContext<ParallaxContextValue | null>(null)

function useParallaxContext() {
  const ctx = useContext(ParallaxContext)
  if (!ctx) {
    throw new Error('ParallaxLayer must be used within a ParallaxTiltCard')
  }
  return ctx
}

// ============================================================================
// Hooks
// ============================================================================

function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])
  
  return prefersReducedMotion
}

// ============================================================================
// ParallaxTiltCard
// ============================================================================

export function ParallaxTiltCard({
  children,
  maxTilt = 15,
  tiltReverse = false,
  perspective = 1000,
  parallaxMultiplier = 10,
  shine = true,
  shineOpacity = 0.15,
  shineColor = 'rgba(255,255,255,0.5)',
  springConfig = { damping: 20, stiffness: 150 },
  magnetic = false,
  magneticStrength = 0.1,
  disabled = false,
  className = '',
  style = {},
}: ParallaxTiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  
  // Raw cursor position (normalized -1 to 1)
  const rawCursorX = useMotionValue(0)
  const rawCursorY = useMotionValue(0)
  
  // Spring-animated cursor for smooth return
  const cursorX = useSpring(rawCursorX, springConfig)
  const cursorY = useSpring(rawCursorY, springConfig)
  
  // Magnetic translation (subtle pull toward cursor)
  const magnetX = useSpring(useMotionValue(0), springConfig)
  const magnetY = useSpring(useMotionValue(0), springConfig)
  
  // Calculate tilt direction
  const tiltMultiplier = tiltReverse ? -1 : 1
  
  // Transform cursor position to rotation
  // Note: rotateX is controlled by Y position (tilting up/down)
  // rotateY is controlled by X position (tilting left/right)
  const rotateX = useTransform(
    cursorY, 
    [-1, 1], 
    [maxTilt * tiltMultiplier, -maxTilt * tiltMultiplier]
  )
  const rotateY = useTransform(
    cursorX, 
    [-1, 1], 
    [-maxTilt * tiltMultiplier, maxTilt * tiltMultiplier]
  )
  
  // Shine position follows cursor
  const shineX = useTransform(cursorX, [-1, 1], [0, 100])
  const shineY = useTransform(cursorY, [-1, 1], [0, 100])
  
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || prefersReducedMotion || !cardRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    
    // Calculate normalized position (-1 to 1)
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1
    
    rawCursorX.set(x)
    rawCursorY.set(y)
    
    // Magnetic effect — subtle translation toward cursor
    if (magnetic) {
      const maxMagnet = Math.min(rect.width, rect.height) * magneticStrength
      magnetX.set(x * maxMagnet)
      magnetY.set(y * maxMagnet)
    }
  }, [disabled, prefersReducedMotion, magnetic, magneticStrength, rawCursorX, rawCursorY, magnetX, magnetY])
  
  const handleMouseEnter = useCallback(() => {
    if (!disabled && !prefersReducedMotion) {
      setIsHovered(true)
    }
  }, [disabled, prefersReducedMotion])
  
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    // Spring back to center
    rawCursorX.set(0)
    rawCursorY.set(0)
    magnetX.set(0)
    magnetY.set(0)
  }, [rawCursorX, rawCursorY, magnetX, magnetY])
  
  // Context value for child layers
  const contextValue = useMemo<ParallaxContextValue>(() => ({
    cursorX,
    cursorY,
    parallaxMultiplier,
    isHovered,
    prefersReducedMotion,
  }), [cursorX, cursorY, parallaxMultiplier, isHovered, prefersReducedMotion])
  
  // Build transform style
  const cardStyle: CSSProperties = {
    perspective: `${perspective}px`,
    ...style,
  }
  
  return (
    <div
      ref={cardRef}
      className={className}
      style={cardStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          rotateX: disabled || prefersReducedMotion ? 0 : rotateX,
          rotateY: disabled || prefersReducedMotion ? 0 : rotateY,
          x: magnetic && !disabled && !prefersReducedMotion ? magnetX : 0,
          y: magnetic && !disabled && !prefersReducedMotion ? magnetY : 0,
          position: 'relative',
        }}
      >
        <ParallaxContext.Provider value={contextValue}>
          {children}
        </ParallaxContext.Provider>
        
        {/* Shine overlay */}
        {shine && !disabled && !prefersReducedMotion && (
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              borderRadius: 'inherit',
              overflow: 'hidden',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              style={{
                position: 'absolute',
                width: '200%',
                height: '200%',
                background: `radial-gradient(circle at center, ${shineColor} 0%, transparent 60%)`,
                opacity: shineOpacity,
                left: useTransform(shineX, (v) => `${v - 100}%`),
                top: useTransform(shineY, (v) => `${v - 100}%`),
              }}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

// ============================================================================
// ParallaxLayer
// ============================================================================

export function ParallaxLayer({
  children,
  depth = 1,
  className = '',
  style = {},
}: ParallaxLayerProps) {
  const { cursorX, cursorY, parallaxMultiplier, prefersReducedMotion } = useParallaxContext()
  
  // Calculate movement based on depth
  // Higher depth = more movement = appears "closer"
  const maxMove = depth * parallaxMultiplier
  
  const x = useTransform(cursorX, [-1, 1], [-maxMove, maxMove])
  const y = useTransform(cursorY, [-1, 1], [-maxMove, maxMove])
  
  if (prefersReducedMotion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    )
  }
  
  return (
    <motion.div
      className={className}
      style={{
        x,
        y,
        ...style,
      }}
    >
      {children}
    </motion.div>
  )
}

// ============================================================================
// Exports
// ============================================================================

export { ParallaxContext, useParallaxContext }
export type { ParallaxTiltCardProps, ParallaxLayerProps, SpringConfig }
