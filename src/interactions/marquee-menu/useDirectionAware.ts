import { useCallback, useRef } from 'react'

export type Direction = 'top' | 'bottom'

/**
 * Determines the closest edge (top or bottom) based on cursor position
 * relative to the element's bounding box
 */
export function getClosestEdge(
  mouseY: number,
  rect: DOMRect
): Direction {
  const relativeY = mouseY - rect.top
  const topDistance = relativeY
  const bottomDistance = rect.height - relativeY
  
  return topDistance < bottomDistance ? 'top' : 'bottom'
}

/**
 * Hook for tracking direction-aware hover states
 */
export function useDirectionAware(
  onEnter?: (direction: Direction) => void,
  onLeave?: (direction: Direction) => void
) {
  const elementRef = useRef<HTMLElement | null>(null)

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    if (!elementRef.current) return
    const rect = elementRef.current.getBoundingClientRect()
    const direction = getClosestEdge(e.clientY, rect)
    onEnter?.(direction)
  }, [onEnter])

  const handleMouseLeave = useCallback((e: React.MouseEvent) => {
    if (!elementRef.current) return
    const rect = elementRef.current.getBoundingClientRect()
    const direction = getClosestEdge(e.clientY, rect)
    onLeave?.(direction)
  }, [onLeave])

  return {
    ref: elementRef,
    handlers: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
  }
}
