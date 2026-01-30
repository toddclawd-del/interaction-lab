import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'

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
    <nav className={`flex gap-8 ${className}`}>
      {items.map((item, index) => (
        <MagneticNavItem key={item.label} item={item} onClick={() => onSelect?.(item, index)} />
      ))}
    </nav>
  )
}

function MagneticNavItem({ item, onClick }: { item: NavItem; onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.2)
    y.set((e.clientY - centerY) * 0.2)
  }, [x, y])

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      onClick={onClick}
      className="text-neutral-400 hover:text-white transition-colors px-2 py-1"
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
    <nav className={`relative flex gap-1 ${className}`}>
      {items.map((item, index) => (
        <button
          key={item.label}
          ref={el => itemRefs.current[index] = el}
          onMouseEnter={() => setHoverIndex(index)}
          onMouseLeave={() => setHoverIndex(null)}
          onClick={() => { setActiveIndex(index); onSelect?.(item, index) }}
          className={`px-4 py-2 transition-colors ${
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
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
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
          y: isOpen ? 6 : 0,
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
          y: isOpen ? -6 : 0,
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
}
