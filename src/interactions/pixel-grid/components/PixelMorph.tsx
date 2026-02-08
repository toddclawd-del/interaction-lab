import { useState, useEffect, CSSProperties } from 'react'
import { useReducedMotion } from '../hooks/use-reduced-motion'

export type PixelVariant = 'square' | 'grid' | 'circle' | 'triangle' | 'line'
export type FontState = PixelVariant | 'sans'

export interface PixelMorphProps {
  children: string
  variants?: FontState[]
  interval?: number
  auto?: boolean
  activeVariant?: FontState
  onVariantChange?: (variant: FontState) => void
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
 * Text that transitions between pixel variants and/or sans.
 * Supports auto-cycling or controlled mode.
 */
export function PixelMorph({
  children,
  variants = ['square', 'grid', 'circle', 'triangle', 'line', 'sans'],
  interval = 1500,
  auto = true,
  activeVariant,
  onVariantChange,
  className,
  as: Component = 'span',
  style,
}: PixelMorphProps) {
  const [internalVariant, setInternalVariant] = useState<FontState>(variants[0] || 'square')
  const reducedMotion = useReducedMotion()

  const current = activeVariant ?? internalVariant
  const isControlled = activeVariant !== undefined

  useEffect(() => {
    if (!auto || isControlled || reducedMotion || variants.length < 2) return

    let index = variants.indexOf(current)
    const timer = setInterval(() => {
      index = (index + 1) % variants.length
      const next = variants[index]
      setInternalVariant(next)
      onVariantChange?.(next)
    }, interval)

    return () => clearInterval(timer)
  }, [auto, isControlled, variants, interval, current, reducedMotion, onVariantChange])

  if (!children) return null

  return (
    <Component
      className={className}
      style={{
        fontFamily: FONT_MAP[current],
        letterSpacing: current === 'sans' ? '-0.03em' : '0',
        transition: reducedMotion ? 'none' : 'font-family 0.4s ease-out, letter-spacing 0.4s ease-out',
        ...style,
      }}
    >
      {children}
    </Component>
  )
}

export default PixelMorph
