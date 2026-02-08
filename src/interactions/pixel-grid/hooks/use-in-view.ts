import { useState, useEffect, RefObject } from 'react'

/**
 * Detects when an element enters the viewport.
 * Uses IntersectionObserver with a fallback for older browsers.
 */
export function useInView(
  ref: RefObject<HTMLElement>,
  options: { threshold?: number; once?: boolean } = {}
): boolean {
  const { threshold = 0.3, once = true } = options
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Fallback for browsers without IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setIsInView(false)
        }
      },
      { threshold }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, threshold, once])

  return isInView
}

export default useInView
