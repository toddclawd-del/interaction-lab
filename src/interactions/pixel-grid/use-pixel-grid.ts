import { useState, useCallback, useRef, useEffect } from 'react'

export interface UsePixelGridOptions {
  autoPlay?: boolean
  delay?: number
  onRevealStart?: () => void
  onRevealComplete?: () => void
}

export interface UsePixelGridReturn {
  isRevealed: boolean
  isAnimating: boolean
  reveal: () => void
  reset: () => void
}

/**
 * Hook for controlling PixelGrid reveal programmatically
 */
export function usePixelGrid(options: UsePixelGridOptions = {}): UsePixelGridReturn {
  const { autoPlay = false, delay = 0, onRevealStart, onRevealComplete } = options
  
  const [isRevealed, setIsRevealed] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const timeoutRef = useRef<number>()

  const reveal = useCallback(() => {
    if (isAnimating || isRevealed) return
    
    setIsAnimating(true)
    onRevealStart?.()
    
    // The actual animation is handled by the component
    // This hook just manages state
    timeoutRef.current = window.setTimeout(() => {
      setIsRevealed(true)
      setIsAnimating(false)
      onRevealComplete?.()
    }, 1000) // Approximate, actual timing from component
  }, [isAnimating, isRevealed, onRevealStart, onRevealComplete])

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsRevealed(false)
    setIsAnimating(false)
  }, [])

  useEffect(() => {
    if (autoPlay) {
      const timer = setTimeout(reveal, delay)
      return () => clearTimeout(timer)
    }
  }, [autoPlay, delay, reveal])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    isRevealed,
    isAnimating,
    reveal,
    reset,
  }
}
