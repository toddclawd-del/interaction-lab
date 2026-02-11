/**
 * Morphing Grid Gallery
 * 
 * A grid gallery that smoothly morphs between different layout densities.
 * Uses GSAP Flip plugin for buttery layout animations.
 * 
 * Features:
 * - Density controls (50% - 150%)
 * - Staggered animations with random order
 * - Optional blur/brightness transition effect
 * - Full keyboard accessibility
 * - Reduced motion support
 * - Custom render prop for items
 * 
 * Reference: https://tympanus.net/Tutorials/GridLayoutTransitions/
 */

import { useRef, useState, useCallback, useId } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import { Flip } from 'gsap/dist/Flip'

gsap.registerPlugin(Flip)

// ============================================
// Types
// ============================================

export interface GridItem {
  id: string
  image: string
  aspectRatio?: string
  label?: string
}

export interface MorphingGridProps {
  /** Array of items to display */
  items: GridItem[]
  
  /** Available density options */
  densityLevels?: number[]
  
  /** Starting density */
  defaultDensity?: number
  
  /** Enable blur/brightness transition effect */
  enhancedTransition?: boolean
  
  /** Custom render function for grid items */
  renderItem?: (item: GridItem, index: number) => React.ReactNode
  
  /** Callback when density changes */
  onDensityChange?: (density: number) => void
  
  /** Custom gap between items */
  gap?: string
  
  /** Custom className for the container */
  className?: string
  
  /** Custom className for the grid */
  gridClassName?: string
}

// ============================================
// Column Config by Density + Breakpoint
// ============================================

const COLUMNS_CONFIG: Record<number, { desktop: number; tablet: number; mobile: number }> = {
  50: { desktop: 16, tablet: 10, mobile: 3 },
  75: { desktop: 10, tablet: 8, mobile: 3 },
  100: { desktop: 8, tablet: 6, mobile: 3 },
  125: { desktop: 6, tablet: 5, mobile: 3 },
  150: { desktop: 4, tablet: 3, mobile: 3 },
}

const DEFAULT_DENSITIES = [50, 75, 100, 125, 150]

// ============================================
// Default Item Renderer
// ============================================

const DefaultItem = ({ item, index }: { item: GridItem; index: number }) => (
  <div 
    className="morphing-grid-item-inner"
    style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: '#1a1a1a',
    }}
  >
    <img
      src={item.image}
      alt={item.label || `Item ${index + 1}`}
      loading="lazy"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
      }}
    />
    {item.label && (
      <span
        style={{
          position: 'absolute',
          bottom: '0.5rem',
          left: '0.5rem',
          background: 'rgba(0,0,0,0.7)',
          color: '#fff',
          padding: '0.25rem 0.5rem',
          borderRadius: '4px',
          fontSize: '0.75rem',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {item.label}
      </span>
    )}
  </div>
)

// ============================================
// Main Component
// ============================================

export function MorphingGrid({
  items,
  densityLevels = DEFAULT_DENSITIES,
  defaultDensity = 75,
  enhancedTransition = true,
  renderItem,
  onDensityChange,
  gap = '1.5rem',
  className = '',
  gridClassName = '',
}: MorphingGridProps) {
  const [currentDensity, setCurrentDensity] = useState(defaultDensity)
  const gridRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const isAnimating = useRef(false)
  const controlsId = useId()
  const gridId = useId()
  const liveRegionRef = useRef<HTMLDivElement>(null)

  // Check for reduced motion preference
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' 
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
      : false
  )

  // Get columns for current density
  const getColumns = useCallback((density: number) => {
    const config = COLUMNS_CONFIG[density] || COLUMNS_CONFIG[100]
    return config
  }, [])

  // Announce to screen readers
  const announce = useCallback((message: string) => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = message
    }
  }, [])

  // Handle density change
  const handleDensityChange = useCallback((newDensity: number) => {
    if (isAnimating.current || newDensity === currentDensity) return
    if (!gridRef.current) return
    if (!items.length) return

    isAnimating.current = true

    // Get all item elements
    const itemElements = itemRefs.current.filter(Boolean) as HTMLDivElement[]
    
    if (prefersReducedMotion.current) {
      // Skip animation for reduced motion
      setCurrentDensity(newDensity)
      isAnimating.current = false
      announce(`Gallery updated to ${newDensity}% density`)
      onDensityChange?.(newDensity)
      return
    }

    // Capture current state BEFORE any changes
    const state = Flip.getState(itemElements)

    // Update state synchronously to ensure DOM is ready before animation
    flushSync(() => {
      setCurrentDensity(newDensity)
    })

    // Fallback to reset animation lock if something goes wrong
    const maxAnimDuration = enhancedTransition ? 2000 : 1500
    const fallbackTimer = setTimeout(() => {
      if (isAnimating.current) {
        console.warn('Animation timeout - force unlocking')
        isAnimating.current = false
      }
    }, maxAnimDuration)

    // Wait for layout to be calculated before animating
    requestAnimationFrame(() => {
      // Animate - DOM is now updated with new layout
      if (enhancedTransition) {
        // Version 2: With stagger and blur effect
        const flipDuration = 1
        const staggerAmount = 0.3

        Flip.from(state, {
          absolute: true,
          duration: flipDuration,
          ease: 'expo.inOut',
          stagger: {
            amount: staggerAmount,
            from: 'random',
          },
          onComplete: () => {
            clearTimeout(fallbackTimer)
            isAnimating.current = false
            announce(`Gallery updated to ${newDensity}% density`)
          },
        })

        // Blur/brightness effect on container
        if (gridRef.current) {
          gsap.fromTo(
            gridRef.current,
            { filter: 'blur(0px) brightness(100%)' },
            {
              duration: flipDuration + staggerAmount,
              keyframes: [
                {
                  filter: 'blur(10px) brightness(200%)',
                  duration: (flipDuration + staggerAmount) * 0.5,
                  ease: 'power2.in',
                },
                {
                  filter: 'blur(0px) brightness(100%)',
                  duration: (flipDuration + staggerAmount) * 0.5,
                  ease: 'power2.out',
                },
              ],
            }
          )
        }
      } else {
        // Version 1: Simple flip
        Flip.from(state, {
          absolute: true,
          duration: 0.8,
          ease: 'expo.inOut',
          onComplete: () => {
            clearTimeout(fallbackTimer)
            isAnimating.current = false
            announce(`Gallery updated to ${newDensity}% density`)
          },
        })
      }

      onDensityChange?.(newDensity)
    })
  }, [currentDensity, items.length, enhancedTransition, onDensityChange, announce])

  // Keyboard navigation for density controls
  const handleKeyDown = useCallback((e: React.KeyboardEvent, _density: number) => {
    const currentIndex = densityLevels.indexOf(_density)
    let newIndex = currentIndex

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault()
        newIndex = currentIndex > 0 ? currentIndex - 1 : densityLevels.length - 1
        break
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault()
        newIndex = currentIndex < densityLevels.length - 1 ? currentIndex + 1 : 0
        break
      case 'Home':
        e.preventDefault()
        newIndex = 0
        break
      case 'End':
        e.preventDefault()
        newIndex = densityLevels.length - 1
        break
      default:
        return
    }

    // Focus and activate the new button
    const buttons = document.querySelectorAll(`[data-density-control="${controlsId}"]`)
    const targetButton = buttons[newIndex] as HTMLButtonElement
    if (targetButton) {
      targetButton.focus()
      handleDensityChange(densityLevels[newIndex])
    }
  }, [densityLevels, controlsId, handleDensityChange])

  // Empty state
  if (!items.length) {
    return (
      <div 
        className={`morphing-grid-empty ${className}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '300px',
          color: '#666',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        No items to display
      </div>
    )
  }

  const columns = getColumns(currentDensity)

  return (
    <div className={`morphing-grid-container ${className}`}>
      {/* Screen reader live region */}
      <div
        ref={liveRegionRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      />

      {/* Density Controls */}
      {items.length >= 4 && (
        <div
          role="group"
          aria-label="Gallery density controls"
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          {densityLevels.map((density) => {
            const isActive = density === currentDensity
            return (
              <button
                key={density}
                data-density-control={controlsId}
                onClick={() => handleDensityChange(density)}
                onKeyDown={(e) => handleKeyDown(e, density)}
                disabled={isAnimating.current}
                aria-pressed={isActive}
                aria-label={`Set gallery density to ${density}%`}
                tabIndex={isActive ? 0 : -1}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '6px',
                  background: isActive ? '#fff' : 'rgba(255,255,255,0.1)',
                  color: isActive ? '#000' : '#888',
                  cursor: isAnimating.current ? 'not-allowed' : 'pointer',
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.2s ease',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(255,255,255,0.5)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {density}%
              </button>
            )
          })}
        </div>
      )}

      {/* Grid */}
      <div
        ref={gridRef}
        id={gridId}
        role="grid"
        aria-label={`Gallery at ${currentDensity}% density`}
        data-density={currentDensity}
        className={`morphing-grid ${gridClassName}`}
        style={{
          display: 'grid',
          gap,
          gridTemplateColumns: `repeat(var(--grid-cols, ${columns.desktop}), 1fr)`,
          ['--grid-cols' as string]: columns.desktop,
          ['--grid-cols-tablet' as string]: columns.tablet,
          ['--grid-cols-mobile' as string]: columns.mobile,
        }}
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => { itemRefs.current[index] = el }}
            role="gridcell"
            className="morphing-grid-item"
            data-flip-id={`item-${item.id}`}
            style={{
              aspectRatio: item.aspectRatio || '1/1',
            }}
          >
            {renderItem ? renderItem(item, index) : <DefaultItem item={item} index={index} />}
          </div>
        ))}
      </div>

      {/* Responsive styles injected */}
      <style>{`
        .morphing-grid {
          grid-template-columns: repeat(var(--grid-cols), 1fr) !important;
        }
        
        @media (max-width: 1024px) {
          .morphing-grid {
            --grid-cols: var(--grid-cols-tablet) !important;
          }
        }
        
        @media (max-width: 640px) {
          .morphing-grid {
            --grid-cols: var(--grid-cols-mobile) !important;
          }
        }
        
        .morphing-grid-item {
          will-change: transform;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .morphing-grid,
          .morphing-grid-item {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}

export default MorphingGrid
