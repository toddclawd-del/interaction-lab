import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'

interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  className?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

// ============================================================================
// 1. FadeTooltip - smooth fade in
// ============================================================================
export function FadeTooltip({ children, content, position = 'top', className = '' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${positionStyles[position]} z-50 px-3 py-2 bg-neutral-800 text-white text-sm rounded-lg whitespace-nowrap pointer-events-none`}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// 2. ScaleTooltip - scales from origin point
// ============================================================================
export function ScaleTooltip({ children, content, position = 'top', className = '' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2 origin-bottom',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2 origin-top',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2 origin-right',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2 origin-left',
  }

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`absolute ${positionStyles[position]} z-50 px-3 py-2 bg-neutral-800 text-white text-sm rounded-lg whitespace-nowrap pointer-events-none`}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// 3. SlideTooltip - slides from direction
// ============================================================================
export function SlideTooltip({ children, content, position = 'top', className = '' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  const slideVariants = {
    top: { y: 10 },
    bottom: { y: -10 },
    left: { x: 10 },
    right: { x: -10 },
  }

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ ...slideVariants[position], opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            exit={{ ...slideVariants[position], opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`absolute ${positionStyles[position]} z-50 px-3 py-2 bg-neutral-800 text-white text-sm rounded-lg whitespace-nowrap pointer-events-none`}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// 4. MagneticTooltip - follows cursor slightly
// ============================================================================
export function MagneticTooltip({ children, content, className = '' }: Omit<TooltipProps, 'position'>) {
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 30 })
  const springY = useSpring(y, { stiffness: 300, damping: 30 })

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.3)
    y.set((e.clientY - centerY) * 0.3)
  }, [x, y])

  const handleMouseLeave = () => {
    setIsVisible(false)
    x.set(0)
    y.set(0)
  }

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{ x: springX, y: springY }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 px-3 py-2 bg-neutral-800 text-white text-sm rounded-lg whitespace-nowrap pointer-events-none"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// 5. RichTooltip - with arrow and shadow
// ============================================================================
interface RichTooltipProps extends TooltipProps {
  title?: string
}

export function RichTooltip({ children, content, title, position = 'top', className = '' }: RichTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-3',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-3',
    left: 'right-full top-1/2 -translate-y-1/2 mr-3',
    right: 'left-full top-1/2 -translate-y-1/2 ml-3',
  }

  const arrowStyles = {
    top: 'left-1/2 -translate-x-1/2 -bottom-2 border-l-transparent border-r-transparent border-b-transparent border-t-neutral-700',
    bottom: 'left-1/2 -translate-x-1/2 -top-2 border-l-transparent border-r-transparent border-t-transparent border-b-neutral-700',
    left: 'top-1/2 -translate-y-1/2 -right-2 border-t-transparent border-b-transparent border-r-transparent border-l-neutral-700',
    right: 'top-1/2 -translate-y-1/2 -left-2 border-t-transparent border-b-transparent border-l-transparent border-r-neutral-700',
  }

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${positionStyles[position]} z-50 min-w-[150px] bg-neutral-700 rounded-lg shadow-xl pointer-events-none`}
          >
            {/* Arrow */}
            <span
              className={`absolute border-[6px] ${arrowStyles[position]}`}
            />
            {/* Content */}
            <div className="p-3">
              {title && (
                <p className="text-white font-semibold text-sm mb-1">{title}</p>
              )}
              <p className="text-neutral-300 text-sm">{content}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Export all
export const Tooltips = {
  FadeTooltip,
  ScaleTooltip,
  SlideTooltip,
  MagneticTooltip,
  RichTooltip,
}
