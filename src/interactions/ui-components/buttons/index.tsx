import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'

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
// 1. GlassmorphismButton - Frosted glass effect with depth
// ============================================================================
export function GlassmorphismButton({ children, className = '', onClick }: ButtonProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.button
      onClick={onClick}
      whileHover={prefersReducedMotion ? {} : { scale: 1.02, y: -2 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
      className={`
        relative px-8 py-4 rounded-2xl font-semibold text-white
        backdrop-blur-xl bg-white/10 
        border border-white/20
        shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]
        overflow-hidden group min-h-[56px]
        ${className}
      `}
    >
      {/* Inner glow */}
      <span className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50" />
      
      {/* Hover shine effect */}
      {!prefersReducedMotion && (
        <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </span>
      )}
      
      {/* Subtle color tint from theme */}
      <span 
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
      />
      
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  )
}

// ============================================================================
// 2. NeumorphicButton - Soft UI with realistic shadows
// ============================================================================
export function NeumorphicButton({ children, className = '', onClick }: ButtonProps) {
  const [isPressed, setIsPressed] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.button
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      animate={prefersReducedMotion ? {} : {
        boxShadow: isPressed 
          ? 'inset 4px 4px 12px rgba(0,0,0,0.4), inset -4px -4px 12px rgba(255,255,255,0.05)'
          : '8px 8px 20px rgba(0,0,0,0.4), -8px -8px 20px rgba(255,255,255,0.05), inset 0 0 0 rgba(0,0,0,0)',
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`
        relative px-8 py-4 rounded-2xl font-semibold
        bg-neutral-800 text-white/90
        min-h-[56px]
        ${className}
      `}
    >
      <span className={`relative z-10 transition-transform duration-150 block ${isPressed ? 'scale-95' : ''}`}>
        {children}
      </span>
    </motion.button>
  )
}

// ============================================================================
// 3. AuroraButton - Flowing northern lights gradient
// ============================================================================
export function AuroraButton({ children, className = '', onClick }: ButtonProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.button
      onClick={onClick}
      whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
      className={`
        relative px-8 py-4 rounded-2xl font-semibold text-white
        overflow-hidden min-h-[56px] group
        ${className}
      `}
    >
      {/* Aurora gradient background */}
      <span 
        className={`absolute inset-0 ${prefersReducedMotion ? '' : 'animate-aurora'}`}
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
      
      {/* Glow effect */}
      <span 
        className="absolute inset-0 blur-xl opacity-50 group-hover:opacity-70 transition-opacity"
        style={{
          background: `linear-gradient(135deg, var(--color-primary), var(--color-accent))`,
        }}
      />
      
      {/* Glass overlay */}
      <span className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
      
      <span className="relative z-10">{children}</span>
      
      <style>{`
        @keyframes aurora {
          0%, 100% { background-position: 0% 50%; }
          25% { background-position: 50% 100%; }
          50% { background-position: 100% 50%; }
          75% { background-position: 50% 0%; }
        }
        .animate-aurora { animation: aurora 8s ease-in-out infinite; }
      `}</style>
    </motion.button>
  )
}

// ============================================================================
// 4. HolographicButton - Iridescent color-shifting effect
// ============================================================================
export function HolographicButton({ children, className = '', onClick }: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current || prefersReducedMotion) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width)
    y.set((e.clientY - rect.top) / rect.height)
  }, [x, y, prefersReducedMotion])

  const background = useTransform(
    [x, y],
    ([latestX, latestY]: number[]) => `
      linear-gradient(
        ${135 + latestX * 90}deg,
        hsl(${280 + latestY * 60}, 100%, 70%) 0%,
        hsl(${200 + latestX * 80}, 100%, 60%) 33%,
        hsl(${160 + latestY * 40}, 100%, 50%) 66%,
        hsl(${320 + latestX * 60}, 100%, 65%) 100%
      )
    `
  )

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
      className={`
        relative px-8 py-4 rounded-2xl font-semibold text-white
        overflow-hidden min-h-[56px]
        shadow-[0_0_30px_rgba(200,100,255,0.3)]
        ${className}
      `}
    >
      {/* Holographic gradient */}
      <motion.span 
        className="absolute inset-0"
        style={prefersReducedMotion ? { 
          background: 'linear-gradient(135deg, hsl(280, 100%, 70%), hsl(200, 100%, 60%), hsl(160, 100%, 50%))' 
        } : { background }}
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
    </motion.button>
  )
}

// ============================================================================
// 5. UnderlineTextButton - Minimal text button with animated underline
// ============================================================================
export function UnderlineTextButton({ children, className = '', onClick }: ButtonProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.button
      onClick={onClick}
      whileHover={prefersReducedMotion ? undefined : 'hover'}
      className={`
        relative px-2 py-2 font-semibold text-white
        group min-h-[48px]
        ${className}
      `}
    >
      <span className="relative">
        {children}
        
        {/* Animated underline */}
        <motion.span
          className="absolute -bottom-1 left-0 h-[2px] rounded-full"
          style={{ backgroundColor: 'var(--color-primary)' }}
          initial={{ width: 0 }}
          variants={{
            hover: { width: '100%' }
          }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        />
        
        {/* Dot that travels */}
        {!prefersReducedMotion && (
          <motion.span
            className="absolute -bottom-1 w-1 h-1 rounded-full"
            style={{ backgroundColor: 'var(--color-accent)' }}
            initial={{ left: 0, opacity: 0 }}
            variants={{
              hover: { 
                left: '100%', 
                opacity: [0, 1, 1, 0],
                transition: { duration: 0.5, ease: 'easeOut' }
              }
            }}
          />
        )}
      </span>
    </motion.button>
  )
}

// ============================================================================
// 6. GhostOutlineButton - Outline that fills on hover
// ============================================================================
export function GhostOutlineButton({ children, className = '', onClick }: ButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
      className={`
        relative px-8 py-4 rounded-xl font-semibold
        border-2 overflow-hidden min-h-[56px]
        ${className}
      `}
      style={{ 
        borderColor: 'var(--color-primary)',
        color: isHovered ? 'white' : 'var(--color-primary)',
      }}
    >
      {/* Fill animation from center */}
      <motion.span
        className="absolute inset-0"
        style={{ backgroundColor: 'var(--color-primary)' }}
        initial={{ scale: 0, borderRadius: '100%' }}
        animate={prefersReducedMotion 
          ? { scale: isHovered ? 1 : 0, borderRadius: isHovered ? '0%' : '100%' }
          : { scale: isHovered ? 1.5 : 0, borderRadius: isHovered ? '0%' : '100%' }
        }
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      />
      
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}

// ============================================================================
// 7. LayeredDepthButton - 3D with stacked layers
// ============================================================================
export function LayeredDepthButton({ children, className = '', onClick }: ButtonProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.button
      onClick={onClick}
      whileHover={prefersReducedMotion ? undefined : 'hover'}
      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
      className={`relative min-h-[56px] ${className}`}
    >
      {/* Bottom layer (shadow) */}
      <motion.span
        className="absolute inset-0 rounded-xl"
        style={{ backgroundColor: 'var(--color-secondary)', opacity: 0.5 }}
        variants={{ hover: { y: 8, x: 4 } }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        initial={{ y: 6, x: 3 }}
      />
      
      {/* Middle layer */}
      <motion.span
        className="absolute inset-0 rounded-xl"
        style={{ backgroundColor: 'var(--color-secondary)', opacity: 0.7 }}
        variants={{ hover: { y: 4, x: 2 } }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        initial={{ y: 3, x: 1.5 }}
      />
      
      {/* Top layer (main) */}
      <motion.span
        className="relative block px-8 py-4 rounded-xl font-semibold text-white"
        style={{ backgroundColor: 'var(--color-primary)' }}
        variants={{ hover: { y: -2 } }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {children}
      </motion.span>
    </motion.button>
  )
}

// ============================================================================
// 8. MagneticPremiumButton - Enhanced magnetic with glow trail
// ============================================================================
export function MagneticPremiumButton({ children, className = '', onClick }: ButtonProps) {
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
    x.set((e.clientX - centerX) * 0.4)
    y.set((e.clientY - centerY) * 0.4)
  }, [x, y, prefersReducedMotion])

  const handleMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  // Transform for glow position
  const glowX = useTransform(springX, (v) => v * 0.5)
  const glowY = useTransform(springY, (v) => v * 0.5)

  return (
    <div className="relative">
      {/* Glow that follows slightly behind */}
      {!prefersReducedMotion && (
        <motion.span
          className="absolute inset-0 rounded-2xl blur-xl opacity-60 pointer-events-none"
          style={{
            x: glowX,
            y: glowY,
            background: `linear-gradient(135deg, var(--color-primary), var(--color-accent))`,
          }}
        />
      )}
      
      <motion.button
        ref={ref}
        style={prefersReducedMotion ? {} : { x: springX, y: springY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
        className={`
          relative px-8 py-4 rounded-2xl font-semibold text-white
          min-h-[56px] overflow-hidden
          shadow-lg
          ${className}
        `}
      >
        {/* Gradient background */}
        <span 
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
        />
        
        {/* Shine on top */}
        <span className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
        
        <span className="relative z-10">{children}</span>
      </motion.button>
    </div>
  )
}

// ============================================================================
// 9. LiquidMetalButton - Chrome/liquid metal effect
// ============================================================================
export function LiquidMetalButton({ children, className = '', onClick }: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current || prefersReducedMotion) return
    const rect = ref.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }, [mouseX, mouseY, prefersReducedMotion])

  const background = useTransform(
    [mouseX, mouseY],
    ([x, y]: number[]) => `
      radial-gradient(
        circle at ${x * 100}% ${y * 100}%,
        #e8e8e8 0%,
        #a8a8a8 20%,
        #888888 40%,
        #a8a8a8 60%,
        #c8c8c8 80%,
        #e8e8e8 100%
      )
    `
  )

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
      className={`
        relative px-8 py-4 rounded-2xl font-bold text-neutral-800
        min-h-[56px] overflow-hidden
        shadow-[0_10px_40px_rgba(0,0,0,0.3),inset_0_2px_0_rgba(255,255,255,0.8),inset_0_-2px_0_rgba(0,0,0,0.2)]
        ${className}
      `}
    >
      {/* Metallic gradient that follows cursor */}
      <motion.span 
        className="absolute inset-0"
        style={prefersReducedMotion ? {
          background: 'linear-gradient(135deg, #e8e8e8, #a8a8a8, #c8c8c8, #e8e8e8)'
        } : { background }}
      />
      
      {/* Top highlight */}
      <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent" />
      
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}

// ============================================================================
// 10. MorphingBlobButton - Organic blob shape
// ============================================================================
export function MorphingBlobButton({ children, className = '', onClick }: ButtonProps) {
  const prefersReducedMotion = useReducedMotion()
  const [isHovered, setIsHovered] = useState(false)

  const blobVariants = {
    idle: {
      borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
    },
    hover: {
      borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%',
    }
  }

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
      className={`relative min-h-[56px] ${className}`}
    >
      {/* Blob background */}
      <motion.span
        className="absolute inset-0 -m-2"
        style={{ backgroundColor: 'var(--color-primary)' }}
        animate={prefersReducedMotion ? {} : (isHovered ? 'hover' : 'idle')}
        variants={blobVariants}
        transition={{
          duration: 0.8,
          ease: 'easeInOut',
          repeat: isHovered ? Infinity : 0,
          repeatType: 'reverse',
        }}
      />
      
      {/* Glow */}
      <motion.span
        className="absolute inset-0 -m-2 blur-xl opacity-50"
        style={{ backgroundColor: 'var(--color-primary)' }}
        animate={prefersReducedMotion ? {} : (isHovered ? 'hover' : 'idle')}
        variants={blobVariants}
        transition={{
          duration: 0.8,
          ease: 'easeInOut',
          repeat: isHovered ? Infinity : 0,
          repeatType: 'reverse',
          delay: 0.1,
        }}
      />
      
      <span className="relative z-10 px-8 py-4 text-white font-semibold block">
        {children}
      </span>
    </motion.button>
  )
}

// ============================================================================
// 11. CyberpunkNeonButton - Neon with scan lines
// ============================================================================
export function CyberpunkNeonButton({ children, className = '', onClick }: ButtonProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.button
      onClick={onClick}
      whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
      className={`
        relative px-8 py-4 font-bold uppercase tracking-wider
        min-h-[56px] overflow-hidden group
        ${className}
      `}
      style={{
        background: 'linear-gradient(135deg, #0a0a0a, #1a1a2e)',
        border: '2px solid',
        borderColor: 'var(--color-primary)',
        color: 'var(--color-primary)',
        clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
        boxShadow: `
          0 0 10px var(--color-primary),
          0 0 20px var(--color-primary),
          inset 0 0 10px rgba(var(--color-primary-rgb), 0.1)
        `,
      }}
    >
      {/* Corner accents */}
      <span 
        className="absolute top-0 right-0 w-3 h-3"
        style={{ 
          background: 'var(--color-primary)',
          clipPath: 'polygon(100% 0, 0 100%, 100% 100%)',
        }}
      />
      <span 
        className="absolute bottom-0 left-0 w-3 h-3"
        style={{ 
          background: 'var(--color-primary)',
          clipPath: 'polygon(0 0, 0 100%, 100% 100%)',
        }}
      />
      
      {/* Scan line effect */}
      {!prefersReducedMotion && (
        <span className="absolute inset-0 pointer-events-none">
          <span 
            className="absolute inset-x-0 h-px bg-white/30 animate-scan"
            style={{ top: '0%' }}
          />
        </span>
      )}
      
      {/* Flicker effect on hover */}
      <span className={`relative z-10 ${prefersReducedMotion ? '' : 'group-hover:animate-flicker'}`}>
        {children}
      </span>
      
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 1; }
          100% { top: 100%; opacity: 0.3; }
        }
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
          52% { opacity: 1; }
          54% { opacity: 0.9; }
        }
        .animate-scan { animation: scan 2s linear infinite; }
        .animate-flicker { animation: flicker 0.15s ease-in-out infinite; }
      `}</style>
    </motion.button>
  )
}

// ============================================================================
// 12. ParticleBurstButton - Particles explode on click
// ============================================================================
interface Particle {
  id: number
  x: number
  y: number
  angle: number
  color: string
}

export function ParticleBurstButton({ children, className = '', onClick }: ButtonProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const prefersReducedMotion = useReducedMotion()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!prefersReducedMotion) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: Date.now() + i,
        x,
        y,
        angle: (i * 30) * (Math.PI / 180),
        color: ['var(--color-primary)', 'var(--color-secondary)', 'var(--color-accent)'][i % 3],
      }))
      
      setParticles(prev => [...prev, ...newParticles])
      setTimeout(() => {
        setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)))
      }, 600)
    }
    
    onClick?.()
  }

  return (
    <motion.button
      onClick={handleClick}
      whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
      className={`
        relative px-8 py-4 rounded-2xl font-semibold text-white
        min-h-[56px] overflow-visible
        ${className}
      `}
      style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
    >
      {/* Particles */}
      <AnimatePresence>
        {particles.map(particle => (
          <motion.span
            key={particle.id}
            initial={{ 
              x: particle.x, 
              y: particle.y, 
              scale: 1,
              opacity: 1,
            }}
            animate={{ 
              x: particle.x + Math.cos(particle.angle) * 60,
              y: particle.y + Math.sin(particle.angle) * 60,
              scale: 0,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute w-2 h-2 rounded-full pointer-events-none"
            style={{ 
              backgroundColor: particle.color,
              left: 0,
              top: 0,
              boxShadow: `0 0 6px ${particle.color}`,
            }}
          />
        ))}
      </AnimatePresence>
      
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}

// ============================================================================
// 13. TextScrambleButton - Text decodes on hover
// ============================================================================
export function TextScrambleButton({ children, className = '', onClick }: ButtonProps) {
  const [displayText, setDisplayText] = useState(String(children))
  const [isHovered, setIsHovered] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const originalText = String(children)
  const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?'

  useEffect(() => {
    if (prefersReducedMotion || !isHovered) {
      setDisplayText(originalText)
      return
    }

    let iteration = 0
    const interval = setInterval(() => {
      setDisplayText(
        originalText
          .split('')
          .map((_, index) => {
            if (index < iteration) return originalText[index]
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join('')
      )
      
      if (iteration >= originalText.length) {
        clearInterval(interval)
      }
      iteration += 1/3
    }, 30)

    return () => clearInterval(interval)
  }, [isHovered, originalText, prefersReducedMotion])

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
      className={`
        relative px-8 py-4 rounded-xl font-mono font-bold
        min-h-[56px] uppercase tracking-wider
        ${className}
      `}
      style={{ 
        background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
        color: 'white',
      }}
    >
      {displayText}
    </motion.button>
  )
}

// ============================================================================
// 14. BorderFlowButton - Animated flowing border
// ============================================================================
export function BorderFlowButton({ children, className = '', onClick }: ButtonProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.button
      onClick={onClick}
      whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
      className={`
        relative px-8 py-4 rounded-xl font-semibold text-white
        min-h-[56px] bg-neutral-900
        ${className}
      `}
    >
      {/* Animated border container */}
      <span className="absolute inset-0 rounded-xl overflow-hidden">
        <span 
          className={`absolute inset-[-200%] ${prefersReducedMotion ? '' : 'animate-border-flow'}`}
          style={{
            background: `conic-gradient(
              from 0deg,
              transparent 0deg,
              var(--color-primary) 60deg,
              var(--color-secondary) 120deg,
              var(--color-accent) 180deg,
              var(--color-secondary) 240deg,
              var(--color-primary) 300deg,
              transparent 360deg
            )`,
          }}
        />
      </span>
      
      {/* Inner background */}
      <span className="absolute inset-[2px] rounded-[10px] bg-neutral-900" />
      
      <span className="relative z-10">{children}</span>
      
      <style>{`
        @keyframes border-flow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-border-flow { animation: border-flow 3s linear infinite; }
      `}</style>
    </motion.button>
  )
}

// ============================================================================
// 15. DepthShadowButton - Realistic 3D shadow with hover lift
// ============================================================================
export function DepthShadowButton({ children, className = '', onClick }: ButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={prefersReducedMotion ? {} : {
        y: isHovered ? -6 : 0,
        boxShadow: isHovered 
          ? '0 20px 40px -10px rgba(0,0,0,0.5), 0 10px 20px -10px var(--color-primary)'
          : '0 10px 20px -10px rgba(0,0,0,0.4), 0 4px 10px -5px var(--color-primary)',
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`
        relative px-8 py-4 rounded-2xl font-semibold text-white
        min-h-[56px]
        ${className}
      `}
      style={{ 
        background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
      }}
    >
      {/* Top shine */}
      <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent rounded-t-2xl" />
      
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}

// Legacy exports for backwards compatibility - map old names to new implementations
export const MagneticButton = MagneticPremiumButton
export const RippleButton = ParticleBurstButton
export const MorphButton = MorphingBlobButton
export const GlowButton = AuroraButton
export const ShimmerButton = GlassmorphismButton
export const ElasticButton = NeumorphicButton
export const BorderButton = BorderFlowButton
export const GradientButton = HolographicButton
export const TextSwapButton = TextScrambleButton
export const IconRevealButton = UnderlineTextButton
export const SplitButton = LayeredDepthButton
export const LiquidButton = LiquidMetalButton
export const NeonButton = CyberpunkNeonButton
export const GlitchButton = GhostOutlineButton
export const ThreeDButton = DepthShadowButton

// Export all buttons
export const Buttons = {
  GlassmorphismButton,
  NeumorphicButton,
  AuroraButton,
  HolographicButton,
  UnderlineTextButton,
  GhostOutlineButton,
  LayeredDepthButton,
  MagneticPremiumButton,
  LiquidMetalButton,
  MorphingBlobButton,
  CyberpunkNeonButton,
  ParticleBurstButton,
  TextScrambleButton,
  BorderFlowButton,
  DepthShadowButton,
  // Legacy names
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
