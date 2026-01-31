import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'

interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  className?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

// Premium trigger button base styles
const triggerStyles = `
  relative inline-flex items-center justify-center px-10 py-4 rounded-2xl font-semibold text-white
  backdrop-blur-xl bg-white/10 
  border border-white/20
  shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]
  overflow-hidden cursor-pointer min-w-[140px] whitespace-nowrap
  transition-all duration-300
  hover:scale-[1.02] hover:-translate-y-0.5
  active:scale-[0.98]
`

// Premium tooltip panel styles
const tooltipPanelStyles = `
  px-6 py-4 
  backdrop-blur-xl bg-neutral-900/90
  border border-white/10
  shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(99,102,241,0.15)]
  rounded-xl
  whitespace-nowrap pointer-events-none min-w-[120px] text-center
`

// ============================================================================
// 1. GlassmorphismTooltip - Frosted glass with glow
// ============================================================================
export function GlassmorphismTooltip({ children, content, position = 'top', className = '' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-3',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-3',
    left: 'right-full top-1/2 -translate-y-1/2 mr-3',
    right: 'left-full top-1/2 -translate-y-1/2 ml-3',
  }

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={triggerStyles}
      >
        {/* Inner glow */}
        <span className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50 rounded-2xl" />
        <span 
          className="absolute inset-0 opacity-30 mix-blend-overlay rounded-2xl"
          style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
        />
        <span className="relative z-10">{children}</span>
      </motion.div>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`absolute ${positionStyles[position]} z-50`}
          >
            <div className={tooltipPanelStyles}>
              {/* Glow effect */}
              <span 
                className="absolute inset-0 -z-10 blur-xl opacity-40 rounded-xl"
                style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}
              />
              <span className="text-white/90 text-sm font-medium">{content}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// 2. AuroraTooltip - Flowing gradient animation
// ============================================================================
export function AuroraTooltip({ children, content, position = 'top', className = '' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-3',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-3',
    left: 'right-full top-1/2 -translate-y-1/2 mr-3',
    right: 'left-full top-1/2 -translate-y-1/2 ml-3',
  }

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative px-6 py-3 rounded-2xl font-semibold text-white overflow-hidden cursor-pointer group"
      >
        {/* Aurora gradient background */}
        <span 
          className="absolute inset-0 animate-aurora"
          style={{
            background: `linear-gradient(
              135deg,
              var(--color-primary) 0%,
              var(--color-secondary) 25%,
              var(--color-accent) 50%,
              var(--color-secondary) 75%,
              var(--color-primary) 100%
            )`,
            backgroundSize: '400% 400%',
          }}
        />
        {/* Glass overlay */}
        <span className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
        <span className="relative z-10">{children}</span>
      </motion.div>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`absolute ${positionStyles[position]} z-50`}
          >
            <div className="relative px-4 py-3 rounded-xl overflow-hidden shadow-2xl">
              <span 
                className="absolute inset-0 animate-aurora"
                style={{
                  background: `linear-gradient(135deg, var(--color-primary), var(--color-secondary), var(--color-accent))`,
                  backgroundSize: '200% 200%',
                }}
              />
              <span className="absolute inset-[1px] bg-neutral-900/95 rounded-[10px]" />
              <span className="relative z-10 text-white/90 text-sm font-medium whitespace-nowrap">{content}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        @keyframes aurora {
          0%, 100% { background-position: 0% 50%; }
          25% { background-position: 50% 100%; }
          50% { background-position: 100% 50%; }
          75% { background-position: 50% 0%; }
        }
        .animate-aurora { animation: aurora 8s ease-in-out infinite; }
      `}</style>
    </div>
  )
}

// ============================================================================
// 3. NeumorphicTooltip - Soft 3D pressed effect
// ============================================================================
export function NeumorphicTooltip({ children, content, position = 'top', className = '' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-3',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-3',
    left: 'right-full top-1/2 -translate-y-1/2 mr-3',
    right: 'left-full top-1/2 -translate-y-1/2 ml-3',
  }

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <motion.div
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        animate={{
          boxShadow: isPressed 
            ? 'inset 4px 4px 12px rgba(0,0,0,0.4), inset -4px -4px 12px rgba(255,255,255,0.05)'
            : '8px 8px 20px rgba(0,0,0,0.4), -8px -8px 20px rgba(255,255,255,0.05)',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="relative px-6 py-3 rounded-2xl font-semibold bg-neutral-800 text-white/90 cursor-pointer"
      >
        <span className={`relative z-10 transition-transform duration-150 block ${isPressed ? 'scale-95' : ''}`}>
          {children}
        </span>
      </motion.div>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`absolute ${positionStyles[position]} z-50`}
          >
            <div 
              className="px-4 py-3 rounded-xl bg-neutral-800 text-white/90 text-sm font-medium whitespace-nowrap"
              style={{ boxShadow: '6px 6px 16px rgba(0,0,0,0.4), -6px -6px 16px rgba(255,255,255,0.05)' }}
            >
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// 4. MagneticTooltip - Follows cursor with magnetic effect
// ============================================================================
export function MagneticTooltip({ children, content, className = '' }: Omit<TooltipProps, 'position'>) {
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.4)
    y.set((e.clientY - centerY) * 0.4)
  }, [x, y])

  const handleMouseLeave = () => {
    setIsVisible(false)
    x.set(0)
    y.set(0)
  }

  return (
    <div className="relative">
      {/* Glow that follows */}
      <motion.span
        className="absolute inset-0 rounded-2xl blur-xl opacity-60 pointer-events-none"
        style={{
          x: springX,
          y: springY,
          background: `linear-gradient(135deg, var(--color-primary), var(--color-accent))`,
        }}
      />
      <motion.div
        ref={containerRef}
        style={{ x: springX, y: springY }}
        onMouseEnter={() => setIsVisible(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileTap={{ scale: 0.95 }}
        className={`relative px-6 py-3 rounded-2xl font-semibold text-white overflow-hidden cursor-pointer shadow-lg ${className}`}
      >
        {/* Gradient background */}
        <span 
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
        />
        {/* Shine on top */}
        <span className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
        <span className="relative z-10">{children}</span>
      </motion.div>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{ x: springX }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50"
          >
            <div className={tooltipPanelStyles}>
              <span className="text-white/90 text-sm font-medium">{content}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// 5. HolographicTooltip - Iridescent color-shifting
// ============================================================================
export function HolographicTooltip({ children, content, position = 'top', className = '' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }, [mouseX, mouseY])

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-3',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-3',
    left: 'right-full top-1/2 -translate-y-1/2 mr-3',
    right: 'left-full top-1/2 -translate-y-1/2 ml-3',
  }

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative px-6 py-3 rounded-2xl font-semibold text-white overflow-hidden cursor-pointer shadow-[0_0_30px_rgba(200,100,255,0.3)]"
      >
        {/* Holographic gradient */}
        <motion.span 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              135deg,
              hsl(280, 100%, 70%) 0%,
              hsl(200, 100%, 60%) 33%,
              hsl(160, 100%, 50%) 66%,
              hsl(320, 100%, 65%) 100%
            )`,
          }}
        />
        {/* Shimmer lines */}
        <span className="absolute inset-0 opacity-30">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className="absolute h-px bg-white/50"
              style={{
                top: `${20 + i * 15}%`,
                left: '-10%',
                right: '-10%',
                transform: `rotate(${-15 + i * 5}deg)`,
              }}
            />
          ))}
        </span>
        <span className="relative z-10 mix-blend-difference">{children}</span>
      </motion.div>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`absolute ${positionStyles[position]} z-50`}
          >
            <div 
              className="px-4 py-3 rounded-xl text-white text-sm font-medium whitespace-nowrap overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, hsl(280, 100%, 70%), hsl(200, 100%, 60%), hsl(160, 100%, 50%))',
                boxShadow: '0 0 30px rgba(200,100,255,0.4)',
              }}
            >
              <span className="mix-blend-difference">{content}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Legacy exports for backwards compatibility
export const FadeTooltip = GlassmorphismTooltip
export const ScaleTooltip = AuroraTooltip
export const SlideTooltip = NeumorphicTooltip
export const RichTooltip = HolographicTooltip

// Export all
export const Tooltips = {
  GlassmorphismTooltip,
  AuroraTooltip,
  NeumorphicTooltip,
  MagneticTooltip,
  HolographicTooltip,
  // Legacy
  FadeTooltip,
  ScaleTooltip,
  SlideTooltip,
  RichTooltip,
}
