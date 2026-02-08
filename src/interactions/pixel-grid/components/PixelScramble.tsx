import { useState, useEffect, useRef, useCallback, CSSProperties } from 'react'
import { useReducedMotion } from '../hooks/use-reduced-motion'
import { useInView } from '../hooks/use-in-view'

export type PixelVariant = 'square' | 'grid' | 'circle' | 'triangle' | 'line'
export type FontState = PixelVariant | 'sans'

export interface PixelScrambleProps {
  children: string
  targetVariant?: FontState
  scrambleSpeed?: number
  lockInDelay?: number
  trigger?: 'mount' | 'inView' | 'manual'
  isActive?: boolean
  onComplete?: () => void
  className?: string
  as?: 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'p'
  style?: CSSProperties
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*'
const FONT_MAP: Record<FontState, string> = {
  square: 'var(--font-pixel-square)',
  grid: 'var(--font-pixel-grid)',
  circle: 'var(--font-pixel-circle)',
  triangle: 'var(--font-pixel-triangle)',
  line: 'var(--font-pixel-line)',
  sans: 'var(--font-geist-sans)',
}

/**
 * Text that scrambles through random characters before decoding.
 * Creates a satisfying reveal effect.
 */
export function PixelScramble({
  children,
  targetVariant = 'sans',
  scrambleSpeed = 50,
  lockInDelay = 180,
  trigger = 'mount',
  isActive: manualActive,
  onComplete,
  className,
  as: Component = 'span',
  style,
}: PixelScrambleProps) {
  const ref = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const inView = useInView(ref as React.RefObject<HTMLElement>, { threshold: 0.3 })
  
  const [display, setDisplay] = useState(() => 
    children.split('').map(() => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')
  )
  const [locked, setLocked] = useState<boolean[]>(() => children.split('').map(() => false))
  const [started, setStarted] = useState(false)

  const shouldStart =
    trigger === 'mount' ? true :
    trigger === 'inView' ? inView :
    manualActive ?? false

  const runScramble = useCallback(() => {
    if (reducedMotion) {
      setDisplay(children)
      setLocked(children.split('').map(() => true))
      onComplete?.()
      return
    }

    setStarted(true)
    setLocked(children.split('').map(() => false))

    // Scramble interval
    const scrambleInterval = setInterval(() => {
      setDisplay(prev => 
        prev.split('').map((_, i) => 
          locked[i] ? children[i] : CHARS[Math.floor(Math.random() * CHARS.length)]
        ).join('')
      )
    }, scrambleSpeed)

    // Lock in characters one by one
    children.split('').forEach((_, i) => {
      setTimeout(() => {
        setLocked(prev => {
          const next = [...prev]
          next[i] = true
          return next
        })
        setDisplay(prev => {
          const chars = prev.split('')
          chars[i] = children[i]
          return chars.join('')
        })
      }, 200 + i * lockInDelay)
    })

    // Cleanup after all done
    const totalTime = 200 + children.length * lockInDelay + 100
    setTimeout(() => {
      clearInterval(scrambleInterval)
      setDisplay(children)
      onComplete?.()
    }, totalTime)

    return () => clearInterval(scrambleInterval)
  }, [children, scrambleSpeed, lockInDelay, reducedMotion, onComplete])

  useEffect(() => {
    if (shouldStart && !started) {
      runScramble()
    }
  }, [shouldStart, started, runScramble])

  if (!children) return null

  return (
    <Component
      ref={ref as any}
      className={className}
      style={{
        fontFamily: FONT_MAP[targetVariant],
        letterSpacing: targetVariant === 'sans' ? '-0.03em' : '0',
        ...style,
      }}
    >
      {display.split('').map((char, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            opacity: locked[i] ? 1 : 0.7,
            transition: 'opacity 0.2s',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </Component>
  )
}

export default PixelScramble
