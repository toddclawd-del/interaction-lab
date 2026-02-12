import { useRef, useCallback, useState, useEffect } from 'react'
import gsap from 'gsap'
import { Direction, getClosestEdge } from './useDirectionAware'

export type MarqueeContent = 
  | { type: 'text'; content: string }
  | { type: 'image'; src: string; alt?: string }

export interface MarqueeMenuItemProps {
  /** Display label for the menu item */
  label: string
  /** Link destination */
  href: string
  /** Content to display in the marquee on hover */
  marqueeContent: MarqueeContent[]
  /** Background color of the marquee */
  backgroundColor?: string
  /** Text color of the marquee */
  textColor?: string
  /** Click handler */
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
  /** Animation duration in seconds */
  animationDuration?: number
  /** GSAP easing string */
  animationEase?: string
  /** Marquee scroll speed in seconds */
  marqueeSpeed?: number
}

export function MarqueeMenuItem({
  label,
  href,
  marqueeContent,
  backgroundColor,
  textColor,
  onClick,
  animationDuration = 0.6,
  animationEase = 'expo.out',
  marqueeSpeed = 15,
}: MarqueeMenuItemProps) {
  const itemRef = useRef<HTMLDivElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Animate in based on entry direction
  const animateIn = useCallback((direction: Direction) => {
    if (!marqueeRef.current || !innerRef.current) return
    
    if (prefersReducedMotion) {
      // Simple fade for reduced motion
      gsap.set([marqueeRef.current, innerRef.current], { y: 0 })
      marqueeRef.current.setAttribute('data-state', 'visible')
      return
    }

    // Kill any existing animations
    gsap.killTweensOf([marqueeRef.current, innerRef.current])

    // Set initial positions based on entry direction
    const fromY = direction === 'top' ? '-101%' : '101%'
    const innerFromY = direction === 'top' ? '101%' : '-101%'

    gsap.set(marqueeRef.current, { y: fromY })
    gsap.set(innerRef.current, { y: innerFromY })

    // Animate to center
    gsap.to(marqueeRef.current, {
      y: '0%',
      duration: animationDuration,
      ease: animationEase,
    })
    gsap.to(innerRef.current, {
      y: '0%',
      duration: animationDuration,
      ease: animationEase,
    })
  }, [animationDuration, animationEase, prefersReducedMotion])

  // Animate out based on exit direction
  const animateOut = useCallback((direction: Direction) => {
    if (!marqueeRef.current || !innerRef.current) return

    if (prefersReducedMotion) {
      marqueeRef.current.setAttribute('data-state', 'hidden')
      return
    }

    // Kill any existing animations
    gsap.killTweensOf([marqueeRef.current, innerRef.current])

    // Animate out in the direction of exit
    const toY = direction === 'top' ? '-101%' : '101%'
    const innerToY = direction === 'top' ? '101%' : '-101%'

    gsap.to(marqueeRef.current, {
      y: toY,
      duration: animationDuration,
      ease: animationEase,
    })
    gsap.to(innerRef.current, {
      y: innerToY,
      duration: animationDuration,
      ease: animationEase,
    })
  }, [animationDuration, animationEase, prefersReducedMotion])

  // Mouse event handlers
  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    if (!itemRef.current) return
    const rect = itemRef.current.getBoundingClientRect()
    const direction = getClosestEdge(e.clientY, rect)
    setIsHovered(true)
    animateIn(direction)
  }, [animateIn])

  const handleMouseLeave = useCallback((e: React.MouseEvent) => {
    if (!itemRef.current) return
    const rect = itemRef.current.getBoundingClientRect()
    const direction = getClosestEdge(e.clientY, rect)
    setIsHovered(false)
    animateOut(direction)
  }, [animateOut])

  // Focus handler - animate from top
  const handleFocus = useCallback(() => {
    setIsHovered(true)
    animateIn('top')
  }, [animateIn])

  const handleBlur = useCallback(() => {
    setIsHovered(false)
    animateOut('top')
  }, [animateOut])

  // If no marquee content, fall back to simple hover
  if (!marqueeContent || marqueeContent.length === 0) {
    console.warn(`MarqueeMenuItem "${label}" has no marqueeContent. Using simple hover state.`)
    return (
      <div className="marquee-menu-item marquee-menu-item--simple">
        <a 
          href={href} 
          className="marquee-menu-item__link"
          onClick={onClick}
        >
          {label}
        </a>
      </div>
    )
  }

  // Duplicate content for seamless loop
  const renderTrackContent = () => {
    const items = marqueeContent.map((item, i) => (
      <span key={i}>
        {item.type === 'text' ? (
          <span className="marquee-menu-item__text">{item.content}</span>
        ) : (
          <img 
            className="marquee-menu-item__image" 
            src={item.src} 
            alt={item.alt || ''} 
            loading="lazy"
          />
        )}
        {i < marqueeContent.length - 1 && (
          <span className="marquee-menu-item__separator" aria-hidden="true" />
        )}
      </span>
    ))

    // Return doubled content for seamless loop
    return (
      <>
        {items}
        <span className="marquee-menu-item__separator" aria-hidden="true" />
        {items}
      </>
    )
  }

  return (
    <div 
      ref={itemRef}
      className="marquee-menu-item"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a 
        href={href} 
        className="marquee-menu-item__link"
        onClick={onClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        {label}
      </a>
      
      <div 
        ref={marqueeRef}
        className="marquee-menu-item__marquee"
        style={{
          backgroundColor: backgroundColor,
          transform: 'translateY(-101%)', // Hidden by default
        }}
        data-state="hidden"
        aria-hidden="true"
      >
        <div 
          ref={innerRef}
          className="marquee-menu-item__marquee-inner"
          style={{
            color: textColor,
            transform: 'translateY(101%)', // Counter-translate
            ['--marquee-speed' as string]: `${marqueeSpeed}s`,
          }}
        >
          <div className={`marquee-menu-item__track ${isHovered ? 'marquee-menu-item__track--animate' : ''}`}>
            {renderTrackContent()}
          </div>
        </div>
      </div>
    </div>
  )
}
