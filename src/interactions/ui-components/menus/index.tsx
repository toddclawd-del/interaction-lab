import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MenuItem {
  label: string
  icon?: React.ReactNode
  onClick?: () => void
  disabled?: boolean
}

interface MenuProps {
  items: MenuItem[]
  trigger: React.ReactNode
  className?: string
}

// Premium menu panel styles
const menuPanelStyles = `
  absolute top-full left-0 mt-3 min-w-[220px]
  backdrop-blur-xl bg-neutral-900/95
  border border-white/10
  shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_40px_rgba(99,102,241,0.1)]
  rounded-2xl overflow-hidden z-50
`

// Premium menu item styles
const menuItemStyles = `
  w-full px-5 py-4 text-left flex items-center gap-4
  transition-all duration-200
  hover:bg-white/10
  group
`

// ============================================================================
// 1. GlassmorphismMenu - Frosted glass with glow
// ============================================================================
export function GlassmorphismMenu({ items, trigger, className = '' }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <motion.div 
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="relative px-6 py-3 rounded-2xl font-semibold text-white backdrop-blur-xl bg-white/10 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] overflow-hidden cursor-pointer"
      >
        <span className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50" />
        <span 
          className="absolute inset-0 opacity-30 mix-blend-overlay"
          style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
        />
        <span className="relative z-10 flex items-center gap-2">
          {trigger}
          <motion.svg 
            animate={{ rotate: isOpen ? 180 : 0 }}
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </span>
      </motion.div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={menuPanelStyles}
          >
            {/* Glow effect */}
            <span 
              className="absolute inset-0 -z-10 blur-2xl opacity-30"
              style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}
            />
            {items.map((item, index) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => { item.onClick?.(); setIsOpen(false) }}
                disabled={item.disabled}
                className={`${menuItemStyles} ${item.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                {item.icon && (
                  <span 
                    className="text-white/60 group-hover:text-white/90 transition-colors"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {item.icon}
                  </span>
                )}
                <span className="text-white/80 group-hover:text-white font-medium">{item.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// 2. AuroraMenu - Flowing gradient animation
// ============================================================================
export function AuroraMenu({ items, trigger, className = '' }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <motion.div 
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative px-6 py-3 rounded-2xl font-semibold text-white overflow-hidden cursor-pointer"
      >
        <span 
          className="absolute inset-0 animate-aurora"
          style={{
            background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 25%, var(--color-accent) 50%, var(--color-secondary) 75%, var(--color-primary) 100%)`,
            backgroundSize: '400% 400%',
          }}
        />
        <span className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
        <span className="relative z-10 flex items-center gap-2">
          {trigger}
          <motion.svg 
            animate={{ rotate: isOpen ? 180 : 0 }}
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </span>
      </motion.div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-3 min-w-[220px] rounded-2xl overflow-hidden z-50 shadow-2xl"
          >
            {/* Aurora border */}
            <span 
              className="absolute inset-0 animate-aurora"
              style={{
                background: `linear-gradient(135deg, var(--color-primary), var(--color-secondary), var(--color-accent))`,
                backgroundSize: '200% 200%',
              }}
            />
            <div className="absolute inset-[1px] bg-neutral-900/98 rounded-[15px]">
              {items.map((item, index) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => { item.onClick?.(); setIsOpen(false) }}
                  disabled={item.disabled}
                  className={`${menuItemStyles} ${item.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  {item.icon && <span className="text-white/60 group-hover:text-white/90 transition-colors">{item.icon}</span>}
                  <span className="text-white/80 group-hover:text-white font-medium">{item.label}</span>
                </motion.button>
              ))}
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
// 3. NeumorphicMenu - Soft 3D depth
// ============================================================================
export function NeumorphicMenu({ items, trigger, className = '' }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <motion.div 
        onClick={() => setIsOpen(!isOpen)}
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
        <span className={`relative z-10 flex items-center gap-2 transition-transform duration-150 ${isPressed ? 'scale-95' : ''}`}>
          {trigger}
          <motion.svg 
            animate={{ rotate: isOpen ? 180 : 0 }}
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </span>
      </motion.div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute top-full left-0 mt-3 min-w-[220px] bg-neutral-800 rounded-2xl overflow-hidden z-50"
            style={{ boxShadow: '10px 10px 30px rgba(0,0,0,0.4), -10px -10px 30px rgba(255,255,255,0.05)' }}
          >
            {items.map((item, index) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => { item.onClick?.(); setIsOpen(false) }}
                disabled={item.disabled}
                className={`${menuItemStyles} hover:bg-neutral-700/50 ${item.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                {item.icon && <span className="text-white/50 group-hover:text-white/80">{item.icon}</span>}
                <span className="text-white/80 group-hover:text-white font-medium">{item.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// 4. CyberpunkMenu - Neon with scan lines
// ============================================================================
export function CyberpunkMenu({ items, trigger, className = '' }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <motion.div 
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative px-6 py-3 font-bold uppercase tracking-wider overflow-hidden cursor-pointer group"
        style={{
          background: 'linear-gradient(135deg, #0a0a0a, #1a1a2e)',
          border: '2px solid var(--color-primary)',
          color: 'var(--color-primary)',
          clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
          boxShadow: '0 0 10px var(--color-primary), 0 0 20px var(--color-primary)',
        }}
      >
        {/* Corner accents */}
        <span 
          className="absolute top-0 right-0 w-2.5 h-2.5"
          style={{ background: 'var(--color-primary)', clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }}
        />
        <span 
          className="absolute bottom-0 left-0 w-2.5 h-2.5"
          style={{ background: 'var(--color-primary)', clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }}
        />
        {/* Scan line */}
        <span className="absolute inset-0 pointer-events-none">
          <span className="absolute inset-x-0 h-px bg-white/30 animate-scan" />
        </span>
        <span className="relative z-10 flex items-center gap-2 group-hover:animate-flicker">
          {trigger}
          <motion.svg 
            animate={{ rotate: isOpen ? 180 : 0 }}
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </span>
      </motion.div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-3 min-w-[220px] origin-top z-50"
            style={{
              background: 'linear-gradient(180deg, #0a0a0a, #1a1a2e)',
              border: '2px solid var(--color-primary)',
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
              boxShadow: '0 0 20px var(--color-primary)',
            }}
          >
            {items.map((item, index) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                onClick={() => { item.onClick?.(); setIsOpen(false) }}
                disabled={item.disabled}
                className={`w-full px-5 py-4 text-left flex items-center gap-4 transition-all uppercase tracking-wider text-sm hover:bg-white/5 ${item.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                style={{ color: 'var(--color-primary)' }}
              >
                {item.icon && <span className="opacity-70">{item.icon}</span>}
                <span className="font-semibold">{item.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
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
    </div>
  )
}

// ============================================================================
// 5. LayeredMenu - 3D stacked depth effect
// ============================================================================
export function LayeredMenu({ items, trigger, className = '' }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <motion.div 
        onClick={() => setIsOpen(!isOpen)}
        whileHover="hover"
        whileTap={{ scale: 0.98 }}
        className="relative cursor-pointer"
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
        {/* Top layer */}
        <motion.span
          className="relative block px-6 py-3 rounded-xl font-semibold text-white"
          style={{ backgroundColor: 'var(--color-primary)' }}
          variants={{ hover: { y: -2 } }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <span className="flex items-center gap-2">
            {trigger}
            <motion.svg 
              animate={{ rotate: isOpen ? 180 : 0 }}
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </span>
        </motion.span>
      </motion.div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute top-full left-0 mt-4 min-w-[220px] z-50"
          >
            {/* Shadow layers for menu */}
            <span 
              className="absolute inset-0 rounded-xl opacity-30"
              style={{ backgroundColor: 'var(--color-secondary)', transform: 'translate(6px, 6px)' }}
            />
            <span 
              className="absolute inset-0 rounded-xl opacity-50"
              style={{ backgroundColor: 'var(--color-secondary)', transform: 'translate(3px, 3px)' }}
            />
            <div 
              className="relative bg-neutral-900 rounded-xl overflow-hidden border"
              style={{ borderColor: 'var(--color-primary)' }}
            >
              {items.map((item, index) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -30, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: index * 0.08 }}
                  onClick={() => { item.onClick?.(); setIsOpen(false) }}
                  disabled={item.disabled}
                  className={`${menuItemStyles} hover:bg-white/10 ${item.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  {item.icon && (
                    <span style={{ color: 'var(--color-primary)' }}>{item.icon}</span>
                  )}
                  <span className="text-white font-medium">{item.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Legacy exports for backwards compatibility
export const FadeMenu = GlassmorphismMenu
export const SlideMenu = AuroraMenu
export const ScaleMenu = NeumorphicMenu
export const BlurMenu = CyberpunkMenu
export const StaggerMenu = LayeredMenu

// Export all
export const Menus = {
  GlassmorphismMenu,
  AuroraMenu,
  NeumorphicMenu,
  CyberpunkMenu,
  LayeredMenu,
  // Legacy
  FadeMenu,
  SlideMenu,
  ScaleMenu,
  BlurMenu,
  StaggerMenu,
}
