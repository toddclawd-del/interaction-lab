import { useState, useEffect, useRef, CSSProperties } from 'react'
import { useReducedMotion } from '../hooks/use-reduced-motion'
import { useInView } from '../hooks/use-in-view'

export type PixelVariant = 'square' | 'grid' | 'circle' | 'triangle' | 'line'
export type FontState = PixelVariant | 'sans'

export interface PixelRevealProps {
  children: string
  from?: PixelVariant
  to?: FontState
  staggerMs?: number
  trigger?: 'mount' | 'inView' | 'manual'
  isRevealed?: boolean
  onComplete?: () => void
  className?: string
  as?: 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'p'
  style?: CSSProperties
}

const FONT_MAP: Record<FontState, string> = {
  square: 'var(--font-pixel-square)',
  grid: 'var(--font-pixel-grid)',
  circle: 'var(--font-pixel-circle)',
  triangle: 'var(--font-pixel-triangle)',
  line: 'var(--font-pixel-line)',
  sans: 'var(--font-geist-sans)',
}

/**
 * Text that reveals character-by-character from one font to another.
 * Supports mount, inView, or manual triggers.
 */
export function PixelReveal({
  children,
  from = 'square',
  to = 'sans',
  staggerMs = 60,
  trigger = 'mount',
  isRevealed: manualRevealed,
  onComplete,
  className,
  as: Component = 'span',
  style,
}: PixelRevealProps) {
  const ref = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const inView = useInView(ref as React.RefObject<HTMLElement>, { threshold: 0.3 })
  const [revealed, setRevealed] = useState(false)

  // Determine if animation should start
  const shouldReveal =
    trigger === 'mount' ? true :
    trigger === 'inView' ? inView :
    manualRevealed ?? false

  useEffect(() => {
    if (shouldReveal && !revealed) {
      setRevealed(true)
      
      // Fire onComplete after all characters have transitioned
      if (onComplete && !reducedMotion) {
        const totalTime = children.length * staggerMs + 300
        const timer = setTimeout(onComplete, totalTime)
        return () => clearTimeout(timer)
      }
    }
  }, [shouldReveal, revealed, children.length, staggerMs, onComplete, reducedMotion])

  if (!children) return null

  const chars = children.split('')
  const showFinal = reducedMotion || revealed

  return (
    <Component ref={ref as any} className={className} style={style}>
      {chars.map((char, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            fontFamily: showFinal ? FONT_MAP[to] : FONT_MAP[from],
            letterSpacing: showFinal && to === 'sans' ? '-0.03em' : '0',
            transitionDelay: reducedMotion ? '0ms' : `${i * staggerMs}ms`,
            transition: reducedMotion ? 'none' : 'font-family 0.3s ease-out, letter-spacing 0.3s ease-out',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </Component>
  )
}

export default PixelReveal
