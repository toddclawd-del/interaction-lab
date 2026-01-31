import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'

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

interface NavItem {
  label: string
  href?: string
}

interface NavProps {
  items: NavItem[]
  className?: string
  onSelect?: (item: NavItem, index: number) => void
}

// ============================================================================
// 1. MagneticNav - nav links with magnetic hover
// ============================================================================
export function MagneticNav({ items, className = '', onSelect }: NavProps) {
  return (
    <nav className={`flex gap-8 ${className}`} role="navigation" aria-label="Main navigation">
      {items.map((item, index) => (
        <MagneticNavItem key={item.label} item={item} onClick={() => onSelect?.(item, index)} />
      ))}
    </nav>
  )
}

function MagneticNavItem({ item, onClick }: { item: NavItem; onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current || prefersReducedMotion) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.2)
    y.set((e.clientY - centerY) * 0.2)
  }, [x, y, prefersReducedMotion])

  return (
    <motion.button
      ref={ref}
      style={prefersReducedMotion ? {} : { x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      onClick={onClick}
      className="text-neutral-400 hover:text-white transition-colors px-2 py-1 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 rounded"
    >
      {item.label}
    </motion.button>
  )
}

// ============================================================================
// 2. UnderlineNav - animated underline follows active
// ============================================================================
export function UnderlineNav({ items, className = '', onSelect }: NavProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const prefersReducedMotion = useReducedMotion()

  const getIndicatorStyle = () => {
    const index = hoverIndex ?? activeIndex
    const el = itemRefs.current[index]
    if (!el) return { left: 0, width: 0 }
    return {
      left: el.offsetLeft,
      width: el.offsetWidth,
    }
  }

  return (
    <nav className={`relative flex gap-1 ${className}`} role="navigation" aria-label="Main navigation">
      {items.map((item, index) => (
        <button
          key={item.label}
          ref={el => itemRefs.current[index] = el}
          onMouseEnter={() => setHoverIndex(index)}
          onMouseLeave={() => setHoverIndex(null)}
          onClick={() => { setActiveIndex(index); onSelect?.(item, index) }}
          aria-current={activeIndex === index ? 'page' : undefined}
          className={`px-4 py-2 transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 rounded ${
            activeIndex === index ? 'text-white' : 'text-neutral-400 hover:text-white'
          }`}
        >
          {item.label}
        </button>
      ))}
      <motion.div
        className="absolute bottom-0 h-0.5 bg-white"
        initial={false}
        animate={getIndicatorStyle()}
        transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 30 }}
      />
    </nav>
  )
}

// ============================================================================
// 3. HighlightNav - background highlight slides between items
// ============================================================================
export function HighlightNav({ items, className = '', onSelect }: NavProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  const getHighlightStyle = () => {
    const el = itemRefs.current[activeIndex]
    if (!el) return { left: 0, width: 0 }
    return {
      left: el.offsetLeft,
      width: el.offsetWidth,
    }
  }

  return (
    <nav className={`relative flex gap-1 bg-neutral-800 rounded-full p-1 ${className}`}>
      <motion.div
        className="absolute inset-y-1 bg-white rounded-full"
        initial={false}
        animate={getHighlightStyle()}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      />
      {items.map((item, index) => (
        <button
          key={item.label}
          ref={el => itemRefs.current[index] = el}
          onClick={() => { setActiveIndex(index); onSelect?.(item, index) }}
          className={`relative z-10 px-4 py-2 rounded-full transition-colors ${
            activeIndex === index ? 'text-black' : 'text-neutral-400'
          }`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}

// ============================================================================
// 4. SplitTextNav - text splits on hover
// ============================================================================
export function SplitTextNav({ items, className = '', onSelect }: NavProps) {
  return (
    <nav className={`flex gap-8 ${className}`}>
      {items.map((item, index) => (
        <SplitTextItem key={item.label} item={item} onClick={() => onSelect?.(item, index)} />
      ))}
    </nav>
  )
}

function SplitTextItem({ item, onClick }: { item: NavItem; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="text-white overflow-hidden"
    >
      <span className="flex">
        {item.label.split('').map((char, i) => (
          <motion.span
            key={i}
            animate={{ y: isHovered ? (i % 2 === 0 ? -4 : 4) : 0 }}
            transition={{ duration: 0.2, delay: i * 0.02 }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </span>
    </motion.button>
  )
}

// ============================================================================
// 5. RotateNav - letters rotate on hover
// ============================================================================
export function RotateNav({ items, className = '', onSelect }: NavProps) {
  return (
    <nav className={`flex gap-8 ${className}`}>
      {items.map((item, index) => (
        <RotateNavItem key={item.label} item={item} onClick={() => onSelect?.(item, index)} />
      ))}
    </nav>
  )
}

function RotateNavItem({ item, onClick }: { item: NavItem; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="text-white overflow-hidden h-6"
    >
      <span className="flex">
        {item.label.split('').map((char, i) => (
          <motion.span
            key={i}
            className="inline-block origin-bottom"
            animate={{ rotateX: isHovered ? 90 : 0 }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </span>
    </motion.button>
  )
}

// ============================================================================
// 6. BlurNav - inactive items blur, active is sharp
// ============================================================================
export function BlurNav({ items, className = '', onSelect }: NavProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  return (
    <nav className={`flex gap-8 ${className}`}>
      {items.map((item, index) => {
        const isActive = (hoverIndex ?? activeIndex) === index
        return (
          <motion.button
            key={item.label}
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
            onClick={() => { setActiveIndex(index); onSelect?.(item, index) }}
            animate={{ 
              filter: isActive ? 'blur(0px)' : 'blur(2px)',
              opacity: isActive ? 1 : 0.5,
            }}
            transition={{ duration: 0.2 }}
            className="text-white"
          >
            {item.label}
          </motion.button>
        )
      })}
    </nav>
  )
}

// ============================================================================
// 7. StaggerNav - items stagger in on load
// ============================================================================
export function StaggerNav({ items, className = '', onSelect }: NavProps) {
  return (
    <motion.nav
      className={`flex gap-8 ${className}`}
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } },
      }}
    >
      {items.map((item, index) => (
        <motion.button
          key={item.label}
          onClick={() => onSelect?.(item, index)}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          whileHover={{ scale: 1.1 }}
          className="text-neutral-400 hover:text-white transition-colors"
        >
          {item.label}
        </motion.button>
      ))}
    </motion.nav>
  )
}

// ============================================================================
// 8. MorphingHamburger - hamburger to X with morphing
// ============================================================================
interface MorphingHamburgerProps {
  isOpen: boolean
  onToggle: () => void
  className?: string
}

export function MorphingHamburger({ isOpen, onToggle, className = '' }: MorphingHamburgerProps) {
  return (
    <button onClick={onToggle} className={`relative w-8 h-8 ${className}`}>
      <motion.span
        className="absolute left-0 top-2 w-8 h-0.5 bg-white origin-center"
        animate={{
          rotate: isOpen ? 45 : 0,
          y: isOpen ? 8 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.span
        className="absolute left-0 top-4 w-8 h-0.5 bg-white"
        animate={{
          opacity: isOpen ? 0 : 1,
          scaleX: isOpen ? 0 : 1,
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.span
        className="absolute left-0 top-6 w-8 h-0.5 bg-white origin-center"
        animate={{
          rotate: isOpen ? -45 : 0,
          y: isOpen ? -8 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
    </button>
  )
}

// ============================================================================
// 9. CircleMenu - radial menu that expands
// ============================================================================
interface CircleMenuProps {
  items: NavItem[]
  isOpen: boolean
  onToggle: () => void
  onSelect?: (item: NavItem, index: number) => void
  className?: string
}

export function CircleMenu({ items, isOpen, onToggle, onSelect, className = '' }: CircleMenuProps) {
  const radius = 80
  const startAngle = -90
  const angleStep = 360 / items.length

  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={onToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold"
      >
        <motion.span animate={{ rotate: isOpen ? 45 : 0 }}>+</motion.span>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && items.map((item, index) => {
          const angle = (startAngle + angleStep * index) * (Math.PI / 180)
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius
          
          return (
            <motion.button
              key={item.label}
              initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
              animate={{ scale: 1, x, y, opacity: 1 }}
              exit={{ scale: 0, x: 0, y: 0, opacity: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => onSelect?.(item, index)}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-neutral-800 hover:bg-neutral-700 rounded-full flex items-center justify-center text-white text-xs"
            >
              {item.label.slice(0, 2)}
            </motion.button>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// 10. SlidingDrawer - drawer nav with stagger items
// ============================================================================
interface SlidingDrawerProps {
  items: NavItem[]
  isOpen: boolean
  onClose: () => void
  onSelect?: (item: NavItem, index: number) => void
}

export function SlidingDrawer({ items, isOpen, onClose, onSelect }: SlidingDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          <motion.nav
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 bottom-0 w-72 bg-neutral-900 z-50 p-8"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
              }}
              className="flex flex-col gap-4 mt-16"
            >
              {items.map((item, index) => (
                <motion.button
                  key={item.label}
                  variants={{
                    hidden: { x: -50, opacity: 0 },
                    visible: { x: 0, opacity: 1 },
                  }}
                  onClick={() => { onSelect?.(item, index); onClose() }}
                  className="text-left text-xl text-neutral-300 hover:text-white transition-colors py-2 border-b border-neutral-800"
                >
                  {item.label}
                </motion.button>
              ))}
            </motion.div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  )
}

// ============================================================================
// 11. GlassHeader - Full header with logo, nav links, and CTA
// ============================================================================
interface FullHeaderProps {
  logo?: React.ReactNode
  items: NavItem[]
  ctaLabel?: string
  onCtaClick?: () => void
  onSelect?: (item: NavItem, index: number) => void
  className?: string
}

export function GlassHeader({ 
  logo = '✦', 
  items, 
  ctaLabel = 'Get Started',
  onCtaClick,
  onSelect,
  className = '' 
}: FullHeaderProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.header
      initial={prefersReducedMotion ? {} : { y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`
        flex items-center justify-between px-6 py-4
        backdrop-blur-xl bg-white/5 
        border border-white/10 rounded-2xl
        ${className}
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
          {typeof logo === 'string' ? logo : logo}
        </div>
        <span className="text-white font-semibold text-lg hidden sm:block">Brand</span>
      </div>

      {/* Nav Links */}
      <nav className="hidden md:flex items-center gap-1">
        {items.map((item, index) => (
          <motion.button
            key={item.label}
            onClick={() => { setActiveIndex(index); onSelect?.(item, index) }}
            whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
            className={`
              px-4 py-2 rounded-lg transition-colors
              ${activeIndex === index 
                ? 'text-white bg-white/10' 
                : 'text-neutral-400 hover:text-white hover:bg-white/5'}
            `}
          >
            {item.label}
          </motion.button>
        ))}
      </nav>

      {/* CTA Button */}
      <motion.button
        onClick={onCtaClick}
        whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
        whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
        className="
          flex items-center gap-3 pl-5 pr-2 py-2 
          rounded-full font-medium text-white
          bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500
        "
      >
        <span>{ctaLabel}</span>
        <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
        </span>
      </motion.button>
    </motion.header>
  )
}

// ============================================================================
// 12. MinimalHeader - Clean minimal header (Vercel-style)
// ============================================================================
export function MinimalHeader({ 
  logo = '▲', 
  items, 
  ctaLabel = 'Sign Up',
  onCtaClick,
  onSelect,
  className = '' 
}: FullHeaderProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const prefersReducedMotion = useReducedMotion()

  return (
    <header className={`flex items-center justify-between py-4 ${className}`}>
      {/* Logo */}
      <div className="flex items-center gap-6">
        <div className="text-white text-2xl font-bold">
          {logo}
        </div>
        
        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          {items.map((item, index) => (
            <motion.button
              key={item.label}
              onClick={() => { setActiveIndex(index); onSelect?.(item, index) }}
              className={`
                text-sm transition-colors
                ${activeIndex === index ? 'text-white' : 'text-neutral-500 hover:text-white'}
              `}
            >
              {item.label}
            </motion.button>
          ))}
        </nav>
      </div>

      {/* CTA */}
      <div className="flex items-center gap-4">
        <button className="text-sm text-neutral-400 hover:text-white transition-colors hidden sm:block">
          Log In
        </button>
        <motion.button
          onClick={onCtaClick}
          whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
          whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
          className="
            px-4 py-2 rounded-lg font-medium text-sm
            bg-white text-black hover:bg-neutral-200 transition-colors
          "
        >
          {ctaLabel}
        </motion.button>
      </div>
    </header>
  )
}

// ============================================================================
// 13. FloatingHeader - Header that appears/transforms on scroll
// ============================================================================
export function FloatingHeader({ 
  logo = '◆', 
  items, 
  ctaLabel = 'Get Started',
  onCtaClick,
  onSelect,
  className = '' 
}: FullHeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={prefersReducedMotion ? {} : { y: -100 }}
      animate={{ y: 0 }}
      className={`
        fixed top-4 left-4 right-4 z-50
        flex items-center justify-between px-6 py-3
        rounded-2xl transition-all duration-300
        ${scrolled 
          ? 'bg-neutral-900/90 backdrop-blur-xl border border-white/10 shadow-2xl' 
          : 'bg-transparent'}
        ${className}
      `}
    >
      {/* Logo */}
      <motion.div 
        className="flex items-center gap-3"
        animate={prefersReducedMotion ? {} : { scale: scrolled ? 0.9 : 1 }}
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xl">
          {logo}
        </div>
        <span className={`text-white font-semibold transition-opacity ${scrolled ? 'opacity-0 w-0' : 'opacity-100'}`}>
          Brand
        </span>
      </motion.div>

      {/* Nav Links */}
      <nav className="hidden md:flex items-center gap-1">
        {items.map((item, index) => (
          <motion.button
            key={item.label}
            onClick={() => { setActiveIndex(index); onSelect?.(item, index) }}
            className={`
              px-4 py-2 rounded-full text-sm transition-all
              ${activeIndex === index 
                ? 'text-white bg-white/10' 
                : 'text-neutral-400 hover:text-white'}
            `}
          >
            {item.label}
          </motion.button>
        ))}
      </nav>

      {/* CTA */}
      <motion.button
        onClick={onCtaClick}
        whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
        whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
        animate={prefersReducedMotion ? {} : { 
          paddingLeft: scrolled ? 16 : 20,
          paddingRight: scrolled ? 16 : 8,
        }}
        className="
          flex items-center gap-2 py-2 
          rounded-full font-medium text-white text-sm
          bg-gradient-to-r from-cyan-500 to-indigo-500
        "
        style={{ paddingLeft: 20, paddingRight: 8 }}
      >
        <span>{ctaLabel}</span>
        <motion.span 
          className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center"
          animate={prefersReducedMotion ? {} : { 
            opacity: scrolled ? 0 : 1,
            width: scrolled ? 0 : 28,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
        </motion.span>
      </motion.button>
    </motion.header>
  )
}

// ============================================================================
// 14. GradientBorderHeader - Header with animated gradient border
// ============================================================================
export function GradientBorderHeader({ 
  logo = '★', 
  items, 
  ctaLabel = 'Get Started',
  onCtaClick,
  onSelect,
  className = '' 
}: FullHeaderProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className={`relative p-[1px] rounded-2xl ${className}`}>
      {/* Animated border */}
      <div 
        className={`absolute inset-0 rounded-2xl ${prefersReducedMotion ? '' : 'animate-border-rotate'}`}
        style={{
          background: 'conic-gradient(from 0deg, #06b6d4, #6366f1, #8b5cf6, #06b6d4)',
          backgroundSize: '400% 400%',
        }}
      />
      
      {/* Inner content */}
      <header className="relative flex items-center justify-between px-6 py-4 bg-neutral-950 rounded-2xl">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-white font-bold">
            {logo}
          </div>
          <span className="text-white font-semibold">Brand</span>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          {items.map((item, index) => (
            <button
              key={item.label}
              onClick={() => { setActiveIndex(index); onSelect?.(item, index) }}
              className={`
                text-sm transition-colors
                ${activeIndex === index ? 'text-white' : 'text-neutral-500 hover:text-white'}
              `}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* CTA */}
        <motion.button
          onClick={onCtaClick}
          whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
          whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
          className="
            px-5 py-2.5 rounded-xl font-medium text-white text-sm
            bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500
          "
        >
          {ctaLabel}
        </motion.button>
      </header>

      <style>{`
        @keyframes border-rotate {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-border-rotate { animation: border-rotate 4s linear infinite; }
      `}</style>
    </div>
  )
}

// Export all
export const Headers = {
  MagneticNav,
  UnderlineNav,
  HighlightNav,
  SplitTextNav,
  RotateNav,
  BlurNav,
  StaggerNav,
  MorphingHamburger,
  CircleMenu,
  SlidingDrawer,
  GlassHeader,
  MinimalHeader,
  FloatingHeader,
  GradientBorderHeader,
}
