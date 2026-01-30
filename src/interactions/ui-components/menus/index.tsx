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

// ============================================================================
// 1. FadeMenu - items fade in staggered
// ============================================================================
export function FadeMenu({ items, trigger, className = '' }: MenuProps) {
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
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-full left-0 mt-2 w-48 bg-neutral-800 rounded-lg shadow-xl overflow-hidden z-50"
          >
            {items.map((item, index) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => { item.onClick?.(); setIsOpen(false) }}
                disabled={item.disabled}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-neutral-700 transition-colors ${
                  item.disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {item.icon && <span className="text-neutral-400">{item.icon}</span>}
                <span className="text-white">{item.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// 2. SlideMenu - slides down with stagger
// ============================================================================
export function SlideMenu({ items, trigger, className = '' }: MenuProps) {
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
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-48 bg-neutral-800 rounded-lg shadow-xl overflow-hidden z-50"
          >
            {items.map((item, index) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => { item.onClick?.(); setIsOpen(false) }}
                disabled={item.disabled}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-neutral-700 transition-colors ${
                  item.disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {item.icon && <span className="text-neutral-400">{item.icon}</span>}
                <span className="text-white">{item.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// 3. ScaleMenu - scales from top
// ============================================================================
export function ScaleMenu({ items, trigger, className = '' }: MenuProps) {
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
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute top-full left-0 mt-2 w-48 bg-neutral-800 rounded-lg shadow-xl overflow-hidden z-50 origin-top-left"
          >
            {items.map((item) => (
              <button
                key={item.label}
                onClick={() => { item.onClick?.(); setIsOpen(false) }}
                disabled={item.disabled}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-neutral-700 transition-colors ${
                  item.disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {item.icon && <span className="text-neutral-400">{item.icon}</span>}
                <span className="text-white">{item.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// 4. BlurMenu - items blur in
// ============================================================================
export function BlurMenu({ items, trigger, className = '' }: MenuProps) {
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
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-full left-0 mt-2 w-48 bg-neutral-800/90 backdrop-blur-lg rounded-lg shadow-xl overflow-hidden z-50"
          >
            {items.map((item, index) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
                onClick={() => { item.onClick?.(); setIsOpen(false) }}
                disabled={item.disabled}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-white/10 transition-colors ${
                  item.disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {item.icon && <span className="text-neutral-400">{item.icon}</span>}
                <span className="text-white">{item.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// 5. StaggerMenu - dramatic stagger animation
// ============================================================================
export function StaggerMenu({ items, trigger, className = '' }: MenuProps) {
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, x: -30, scale: 0.9 },
    show: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -20, scale: 0.9 },
  }

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            exit="exit"
            className="absolute top-full left-0 mt-2 w-56 bg-neutral-800 rounded-lg shadow-xl overflow-hidden z-50"
          >
            {items.map((menuItem) => (
              <motion.button
                key={menuItem.label}
                variants={item}
                onClick={() => { menuItem.onClick?.(); setIsOpen(false) }}
                disabled={menuItem.disabled}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-neutral-700 transition-colors ${
                  menuItem.disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {menuItem.icon && <span className="text-neutral-400">{menuItem.icon}</span>}
                <span className="text-white">{menuItem.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Export all
export const Menus = {
  FadeMenu,
  SlideMenu,
  ScaleMenu,
  BlurMenu,
  StaggerMenu,
}
