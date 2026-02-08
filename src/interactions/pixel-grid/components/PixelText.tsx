import { CSSProperties } from 'react'

export type PixelVariant = 'square' | 'grid' | 'circle' | 'triangle' | 'line'

export interface PixelTextProps {
  children: string
  variant?: PixelVariant
  className?: string
  as?: 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'p'
  style?: CSSProperties
}

const FONT_MAP: Record<PixelVariant, string> = {
  square: 'var(--font-pixel-square)',
  grid: 'var(--font-pixel-grid)',
  circle: 'var(--font-pixel-circle)',
  triangle: 'var(--font-pixel-triangle)',
  line: 'var(--font-pixel-line)',
}

/**
 * Static text rendered in a Geist Pixel variant.
 * The simplest building block for pixel typography.
 */
export function PixelText({
  children,
  variant = 'square',
  className,
  as: Component = 'span',
  style,
}: PixelTextProps) {
  if (!children) return null

  return (
    <Component
      className={className}
      style={{
        fontFamily: FONT_MAP[variant],
        ...style,
      }}
    >
      {children}
    </Component>
  )
}

export default PixelText
