import { useRef, useCallback, useState, useEffect } from 'react'

export interface UseSpotlightTiltOptions {
  enableTilt?: boolean
  enableSpotlight?: boolean
  tiltStrength?: number // 0-1, maps to max 15°
  maxTilt?: number // max rotation in degrees
}

export interface SpotlightTiltState {
  isHovered: boolean
  isPressed: boolean
  isFocused: boolean
  spotlightX: string
  spotlightY: string
  rotateX: number
  rotateY: number
}

const DEFAULT_MAX_TILT = 12

export function useSpotlightTilt<T extends HTMLElement>(
  options: UseSpotlightTiltOptions = {}
) {
  const {
    enableTilt = true,
    enableSpotlight = true,
    tiltStrength = 0.5,
    maxTilt = DEFAULT_MAX_TILT,
  } = options

  const ref = useRef<T>(null)
  const rafRef = useRef<number | null>(null)
  const [state, setState] = useState<SpotlightTiltState>({
    isHovered: false,
    isPressed: false,
    isFocused: false,
    spotlightX: '50%',
    spotlightY: '50%',
    rotateX: 0,
    rotateY: 0,
  })

  // Check for reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  const updatePosition = useCallback((clientX: number, clientY: number) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    
    // Calculate spotlight position as percentage
    const x = ((clientX - rect.left) / rect.width) * 100
    const y = ((clientY - rect.top) / rect.height) * 100
    
    // Clamp to bounds
    const clampedX = Math.max(0, Math.min(100, x))
    const clampedY = Math.max(0, Math.min(100, y))

    // Calculate tilt (normalized -0.5 to 0.5 from center)
    const normalizedX = (clientX - rect.left) / rect.width - 0.5
    const normalizedY = (clientY - rect.top) / rect.height - 0.5

    // Apply tilt strength and max tilt
    const effectiveMaxTilt = maxTilt * tiltStrength
    
    // Invert Y for natural tilt direction
    const rotateX = prefersReducedMotion || !enableTilt 
      ? 0 
      : normalizedY * -effectiveMaxTilt
    const rotateY = prefersReducedMotion || !enableTilt 
      ? 0 
      : normalizedX * effectiveMaxTilt

    setState(prev => ({
      ...prev,
      spotlightX: enableSpotlight ? `${clampedX}%` : '50%',
      spotlightY: enableSpotlight ? `${clampedY}%` : '50%',
      rotateX,
      rotateY,
    }))
  }, [enableTilt, enableSpotlight, tiltStrength, maxTilt, prefersReducedMotion])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    // Cancel any pending frame
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }
    
    // Schedule update on next frame for smooth 60fps
    rafRef.current = requestAnimationFrame(() => {
      updatePosition(e.clientX, e.clientY)
    })
  }, [updatePosition])

  const handleMouseEnter = useCallback(() => {
    setState(prev => ({ ...prev, isHovered: true }))
  }, [])

  const handleMouseLeave = useCallback(() => {
    // Cancel any pending animation frame
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    
    setState(prev => ({
      ...prev,
      isHovered: false,
      isPressed: false,
      rotateX: 0,
      rotateY: 0,
    }))
  }, [])

  const handleMouseDown = useCallback(() => {
    setState(prev => ({ ...prev, isPressed: true }))
  }, [])

  const handleMouseUp = useCallback(() => {
    setState(prev => ({ ...prev, isPressed: false }))
  }, [])

  const handleFocus = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      isFocused: true,
      // Center spotlight on keyboard focus
      spotlightX: '50%',
      spotlightY: '50%',
    }))
  }, [])

  const handleBlur = useCallback(() => {
    setState(prev => ({ ...prev, isFocused: false }))
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  const handlers = {
    onMouseMove: handleMouseMove,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onFocus: handleFocus,
    onBlur: handleBlur,
  }

  const style: React.CSSProperties = {
    '--spotlight-x': state.spotlightX,
    '--spotlight-y': state.spotlightY,
    '--rotate-x': `${state.rotateX}deg`,
    '--rotate-y': `${state.rotateY}deg`,
  } as React.CSSProperties

  return {
    ref,
    state,
    handlers,
    style,
    prefersReducedMotion,
  }
}
