import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

// Custom hook for reduced motion preference
function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])
  
  return prefersReducedMotion
}

// Shared types
interface ButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
}

// ============================================================================
// 1. MagneticButton - follows cursor slightly
// ============================================================================
export function MagneticButton({ children, className = '', onClick }: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const springConfig = { stiffness: 150, damping: 15 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current || prefersReducedMotion) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.3)
    y.set((e.clientY - centerY) * 0.3)
  }, [x, y, prefersReducedMotion])

  const handleMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  return (
    <motion.button
      ref={ref}
      style={prefersReducedMotion ? {} : { x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`px-6 py-3 bg-white text-black rounded-lg font-medium transition-colors hover:bg-neutral-200 min-h-[48px] ${className}`}
    >
      {children}
    </motion.button>
  )
}

// ============================================================================
// 2. RippleButton - material design ripple on click
// ============================================================================
interface Ripple {
  id: number
  x: number
  y: number
}

export function RippleButton({ children, className = '', onClick }: ButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([])
  const prefersReducedMotion = useReducedMotion()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!prefersReducedMotion) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const id = Date.now()
      
      setRipples(prev => [...prev, { id, x, y }])
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== id))
      }, 600)
    }
    
    onClick?.()
  }

  return (
    <button
      onClick={handleClick}
      className={`relative overflow-hidden px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium min-h-[48px] ${className}`}
    >
      {!prefersReducedMotion && ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute w-12 h-12 bg-white/30 rounded-full pointer-events-none"
          style={{
            left: ripple.x - 24,
            top: ripple.y - 24,
          }}
        />
      ))}
      <span className="relative z-10">{children}</span>
    </button>
  )
}

// ============================================================================
// 3. MorphButton - morphs shape on hover (pill to square)
// ============================================================================
export function MorphButton({ children, className = '', onClick }: ButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={prefersReducedMotion ? {} : {
        borderRadius: isHovered ? 4 : 50,
        scale: isHovered ? 1.05 : 1,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`px-6 py-3 bg-emerald-500 text-white font-medium min-h-[48px] rounded-full ${className}`}
    >
      {children}
    </motion.button>
  )
}

// ============================================================================
// 4. GlowButton - animated glow border
// ============================================================================
export function GlowButton({ children, className = '', onClick }: ButtonProps) {
  const prefersReducedMotion = useReducedMotion()
  
  return (
    <motion.button
      onClick={onClick}
      whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
      className={`relative px-6 py-3 rounded-lg font-medium group min-h-[48px] ${className}`}
    >
      <span className={`absolute inset-0 rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-75 blur-md group-hover:opacity-100 transition-opacity ${prefersReducedMotion ? '' : 'animate-pulse'}`} />
      <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500" />
      <span className="absolute inset-[2px] rounded-lg bg-neutral-900" />
      <span className="relative z-10 text-white">{children}</span>
    </motion.button>
  )
}

// ============================================================================
// 5. ShimmerButton - shimmer sweep effect
// ============================================================================
export function ShimmerButton({ children, className = '', onClick }: ButtonProps) {
  const prefersReducedMotion = useReducedMotion()
  
  return (
    <motion.button
      onClick={onClick}
      whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
      className={`relative overflow-hidden px-6 py-3 bg-neutral-800 text-white rounded-lg font-medium group min-h-[48px] ${className}`}
    >
      {!prefersReducedMotion && (
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}

// ============================================================================
// 6. ElasticButton - bouncy press effect
// ============================================================================
export function ElasticButton({ children, className = '', onClick }: ButtonProps) {
  const prefersReducedMotion = useReducedMotion()
  
  return (
    <motion.button
      onClick={onClick}
      whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.85 }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 15,
      }}
      className={`px-6 py-3 bg-orange-500 text-white rounded-xl font-medium min-h-[48px] ${className}`}
    >
      {children}
    </motion.button>
  )
}

// ============================================================================
// 7. BorderButton - animated border draw on hover
// ============================================================================
export function BorderButton({ children, className = '', onClick }: ButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative px-6 py-3 bg-transparent text-white font-medium min-h-[48px] ${className}`}
    >
      <svg className="absolute inset-0 w-full h-full">
        <motion.rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="8"
          fill="none"
          stroke="white"
          strokeWidth="2"
          initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
          animate={{ pathLength: prefersReducedMotion ? 1 : (isHovered ? 1 : 0) }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: 'easeInOut' }}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: 0,
          }}
        />
      </svg>
      <span className="relative z-10">{children}</span>
    </button>
  )
}

// ============================================================================
// 8. GradientButton - shifting gradient background
// ============================================================================
export function GradientButton({ children, className = '', onClick }: ButtonProps) {
  const prefersReducedMotion = useReducedMotion()
  
  return (
    <motion.button
      onClick={onClick}
      whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
      className={`relative px-6 py-3 rounded-lg font-medium overflow-hidden group min-h-[48px] ${className}`}
    >
      <span className={`absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-[length:200%_100%] ${prefersReducedMotion ? '' : 'animate-gradient'}`} />
      <span className="relative z-10 text-white">{children}</span>
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient { animation: gradient 3s ease infinite; }
      `}</style>
    </motion.button>
  )
}

// ============================================================================
// 9. TextSwapButton - text changes on hover with animation
// ============================================================================
interface TextSwapButtonProps extends ButtonProps {
  hoverText?: string
}

export function TextSwapButton({ children, hoverText = 'Clicked!', className = '', onClick }: TextSwapButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative px-6 py-3 bg-cyan-600 text-white rounded-lg font-medium overflow-hidden min-h-[48px] ${className}`}
    >
      <span className="block relative h-6">
        {prefersReducedMotion ? (
          <span className="flex items-center justify-center">{isHovered ? hoverText : children}</span>
        ) : (
          <>
            <motion.span
              className="absolute inset-0 flex items-center justify-center"
              initial={false}
              animate={{ y: isHovered ? -30 : 0, opacity: isHovered ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.span>
            <motion.span
              className="absolute inset-0 flex items-center justify-center"
              initial={false}
              animate={{ y: isHovered ? 0 : 30, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {hoverText}
            </motion.span>
          </>
        )}
      </span>
    </motion.button>
  )
}

// ============================================================================
// 10. IconRevealButton - icon slides in on hover
// ============================================================================
interface IconRevealButtonProps extends ButtonProps {
  icon?: React.ReactNode
}

export function IconRevealButton({ children, icon = '→', className = '', onClick }: IconRevealButtonProps) {
  const prefersReducedMotion = useReducedMotion()
  
  return (
    <motion.button
      onClick={onClick}
      whileHover={prefersReducedMotion ? undefined : 'hover'}
      className={`group relative px-6 py-3 bg-violet-600 text-white rounded-lg font-medium overflow-hidden min-h-[48px] ${className}`}
    >
      <span className="flex items-center gap-2">
        <span>{children}</span>
        {prefersReducedMotion ? (
          <span className="inline-block group-hover:opacity-100 opacity-0 transition-opacity">{icon}</span>
        ) : (
          <motion.span
            variants={{
              hover: { x: 0, opacity: 1 }
            }}
            initial={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="inline-block"
          >
            {icon}
          </motion.span>
        )}
      </span>
    </motion.button>
  )
}

// ============================================================================
// 11. SplitButton - splits apart on hover
// ============================================================================
export function SplitButton({ children, className = '', onClick }: ButtonProps) {
  const text = String(children)
  const midpoint = Math.ceil(text.length / 2)
  const leftText = text.slice(0, midpoint)
  const rightText = text.slice(midpoint)
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.button
      onClick={onClick}
      whileHover={prefersReducedMotion ? undefined : 'hover'}
      className={`relative px-6 py-3 bg-rose-600 text-white rounded-lg font-medium min-h-[48px] ${className}`}
    >
      <span className="flex items-center justify-center">
        {prefersReducedMotion ? (
          <span>{children}</span>
        ) : (
          <>
            <motion.span
              variants={{ hover: { x: -4 } }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              {leftText}
            </motion.span>
            <motion.span
              variants={{ hover: { x: 4 } }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              {rightText}
            </motion.span>
          </>
        )}
      </span>
    </motion.button>
  )
}

// ============================================================================
// 12. LiquidButton - SVG liquid fill effect
// ============================================================================
export function LiquidButton({ children, className = '', onClick }: ButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative px-6 py-3 rounded-lg font-medium overflow-hidden border-2 border-blue-500 min-h-[48px] ${className}`}
    >
      {!prefersReducedMotion && (
        <>
          <motion.div
            className="absolute inset-0 bg-blue-500"
            initial={{ y: '100%' }}
            animate={{ y: isHovered ? '0%' : '100%' }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          />
          <motion.div
            className="absolute inset-0 bg-blue-400"
            initial={{ y: '100%' }}
            animate={{ y: isHovered ? '0%' : '100%' }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: 0.05 }}
            style={{ clipPath: 'ellipse(80% 50% at 50% 100%)' }}
          />
        </>
      )}
      {prefersReducedMotion && isHovered && (
        <div className="absolute inset-0 bg-blue-500" />
      )}
      <span className={`relative z-10 transition-colors duration-300 ${isHovered ? 'text-white' : 'text-blue-500'}`}>
        {children}
      </span>
    </motion.button>
  )
}

// ============================================================================
// 13. NeonButton - neon glow with flicker
// ============================================================================
export function NeonButton({ children, className = '', onClick }: ButtonProps) {
  const prefersReducedMotion = useReducedMotion()
  
  return (
    <motion.button
      onClick={onClick}
      whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
      className={`relative px-6 py-3 bg-transparent border-2 border-green-400 text-green-400 rounded-lg font-medium group min-h-[48px] ${className}`}
      style={{
        textShadow: '0 0 5px #4ade80, 0 0 10px #4ade80, 0 0 20px #4ade80',
        boxShadow: '0 0 5px #4ade80, 0 0 10px #4ade80, inset 0 0 10px rgba(74, 222, 128, 0.1)',
      }}
    >
      <span className={`relative z-10 ${prefersReducedMotion ? '' : 'group-hover:animate-pulse'}`}>{children}</span>
      {!prefersReducedMotion && (
        <motion.span
          className="absolute inset-0 bg-green-400/10 rounded-lg"
          animate={{
            opacity: [0.5, 1, 0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'loop',
          }}
        />
      )}
    </motion.button>
  )
}

// ============================================================================
// 14. GlitchButton - glitch effect on hover
// ============================================================================
export function GlitchButton({ children, className = '', onClick }: ButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative px-6 py-3 bg-red-600 text-white rounded-lg font-medium min-h-[48px] ${className}`}
    >
      <span className="relative">
        {isHovered && !prefersReducedMotion && (
          <>
            <span className="absolute inset-0 text-cyan-400 animate-glitch-1 clip-glitch-1">
              {children}
            </span>
            <span className="absolute inset-0 text-red-400 animate-glitch-2 clip-glitch-2">
              {children}
            </span>
          </>
        )}
        <span className={isHovered && !prefersReducedMotion ? 'opacity-0' : ''}>{children}</span>
      </span>
      <style>{`
        @keyframes glitch-1 {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }
        @keyframes glitch-2 {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(2px, -2px); }
          40% { transform: translate(2px, 2px); }
          60% { transform: translate(-2px, -2px); }
          80% { transform: translate(-2px, 2px); }
        }
        .animate-glitch-1 { animation: glitch-1 0.3s infinite; }
        .animate-glitch-2 { animation: glitch-2 0.3s infinite; }
        .clip-glitch-1 { clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%); }
        .clip-glitch-2 { clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%); }
      `}</style>
    </motion.button>
  )
}

// ============================================================================
// 15. ThreeDButton - perspective tilt on hover
// ============================================================================
export function ThreeDButton({ children, className = '', onClick }: ButtonProps) {
  const prefersReducedMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(y, [-50, 50], [15, -15])
  const rotateY = useTransform(x, [-50, 50], [-15, 15])

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set(e.clientX - centerX)
    y.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={prefersReducedMotion ? {} : {
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`px-6 py-3 bg-gradient-to-br from-amber-400 to-orange-600 text-white rounded-xl font-medium shadow-lg min-h-[48px] ${className}`}
    >
      <span style={prefersReducedMotion ? {} : { transform: 'translateZ(20px)', display: 'block' }}>{children}</span>
    </motion.button>
  )
}

// Export all buttons
export const Buttons = {
  MagneticButton,
  RippleButton,
  MorphButton,
  GlowButton,
  ShimmerButton,
  ElasticButton,
  BorderButton,
  GradientButton,
  TextSwapButton,
  IconRevealButton,
  SplitButton,
  LiquidButton,
  NeonButton,
  GlitchButton,
  ThreeDButton,
}
