import { ReactNode } from 'react'
import './styles.css'

export interface MarqueeMenuProps {
  /** Menu items (should be MarqueeMenuItem components) */
  children: ReactNode
  /** Additional CSS class */
  className?: string
  /** Theme variant */
  theme?: 'dark' | 'light'
  /** Animation duration for all items (seconds) */
  animationDuration?: number
  /** GSAP easing for all items */
  animationEase?: string
  /** Marquee scroll speed for all items (seconds) */
  marqueeSpeed?: number
}

export function MarqueeMenu({
  children,
  className = '',
  theme = 'dark',
}: MarqueeMenuProps) {
  return (
    <nav 
      className={`marquee-menu ${className}`}
      data-theme={theme}
      role="navigation"
    >
      {children}
    </nav>
  )
}

// Re-export types for convenience
export type { MarqueeMenuItemProps, MarqueeContent } from './MarqueeMenuItem'
