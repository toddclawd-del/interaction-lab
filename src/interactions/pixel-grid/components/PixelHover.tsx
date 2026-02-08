import { useState, CSSProperties } from 'react'
import { useReducedMotion } from '../hooks/use-reduced-motion'

export type PixelVariant = 'square' | 'grid' | 'circle' | 'triangle' | 'line'
export type FontState = PixelVariant | 'sans'

export interface PixelHoverProps {
  children: string
  pixelVariant?: PixelVariant
  hoverVariant?: FontState
  staggered?: boolean
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
 * Text that morphs from pixel to another variant on hover.
 * Supports whole-word or character-by-character stagger.
 */
export function PixelHover({
  children,
  pixelVariant = 'square',
  hoverVariant = 'sans',
  staggered = false,
  className,
  as: Component = 'span',
  style,
}: PixelHoverProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const reducedMotion = useReducedMotion()

  if (!children) return null

  const active = isHovered || isFocused
  const targetFont = active ? hoverVariant : pixelVariant

  // Simple mode: whole word transitions
  if (!staggered) {
    return (
      <Component
        className={className}
        style={{
          fontFamily: FONT_MAP[targetFont],
          letterSpacing: active && hoverVariant === 'sans' ? '-0.03em' : '0',
          transition: reducedMotion ? 'none' : 'font-family 0.3s ease-out, letter-spacing 0.3s ease-out',
          cursor: 'pointer',
          ...style,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        tabIndex={0}
      >
        {children}
      </Component>
    )
  }

  // Staggered mode: character-by-character
  const chars = children.split('')
  const staggerMs = 40

  return (
    <Component
      className={className}
      style={{ cursor: 'pointer', ...style }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      tabIndex={0}
    >
      {chars.map((char, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            fontFamily: FONT_MAP[targetFont],
            letterSpacing: active && hoverVariant === 'sans' ? '-0.03em' : '0',
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

export default PixelHover
