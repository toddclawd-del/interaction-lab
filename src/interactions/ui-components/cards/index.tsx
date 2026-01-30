import { useState, useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

// ============================================================================
// 1. TiltCard - 3D tilt following cursor
// ============================================================================
export function TiltCard({ children, className = '' }: CardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(y, [-0.5, 0.5], [15, -15])
  const rotateY = useTransform(x, [-0.5, 0.5], [-15, 15])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    x.set(px)
    y.set(py)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`p-6 bg-neutral-800 rounded-xl ${className}`}
    >
      <div style={{ transform: 'translateZ(20px)' }}>{children}</div>
    </motion.div>
  )
}

// ============================================================================
// 2. FlipCard - flips to reveal back
// ============================================================================
interface FlipCardProps {
  front: React.ReactNode
  back: React.ReactNode
  className?: string
}

export function FlipCard({ front, back, className = '' }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div
      className={`relative cursor-pointer ${className}`}
      style={{ perspective: 1000 }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 300, damping: 30 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full h-full"
      >
        {/* Front */}
        <div
          className="absolute inset-0 p-6 bg-neutral-800 rounded-xl backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {front}
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 p-6 bg-indigo-600 rounded-xl backface-hidden"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  )
}

// ============================================================================
// 3. ShineCard - shine sweep on hover
// ============================================================================
export function ShineCard({ children, className = '' }: CardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden p-6 bg-neutral-800 rounded-xl ${className}`}
    >
      <motion.div
        initial={{ x: '-100%', rotate: -45 }}
        animate={{ x: isHovered ? '200%' : '-100%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
      />
      {children}
    </motion.div>
  )
}

// ============================================================================
// 4. LiftCard - lifts with shadow on hover
// ============================================================================
export function LiftCard({ children, className = '', onClick }: CardProps) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{
        y: -8,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`p-6 bg-neutral-800 rounded-xl cursor-pointer ${className}`}
    >
      {children}
    </motion.div>
  )
}

// ============================================================================
// 5. BorderCard - animated gradient border
// ============================================================================
export function BorderCard({ children, className = '' }: CardProps) {
  return (
    <div className={`relative p-[2px] rounded-xl overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 animate-gradient-rotate" />
      <div className="relative bg-neutral-900 rounded-xl p-6">{children}</div>
      <style>{`
        @keyframes gradient-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-gradient-rotate {
          animation: gradient-rotate 4s linear infinite;
          background-size: 200% 200%;
        }
      `}</style>
    </div>
  )
}

// ============================================================================
// 6. RevealCard - content reveals on hover
// ============================================================================
interface RevealCardProps {
  title: string
  description: string
  image?: string
  className?: string
}

export function RevealCard({ title, description, image, className = '' }: RevealCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-xl h-64 cursor-pointer ${className}`}
    >
      {image && (
        <motion.img
          src={image}
          alt={title}
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3 }}
          className="text-neutral-300 mt-2"
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  )
}

// ============================================================================
// 7. StackCard - stacked cards that spread
// ============================================================================
interface StackCardProps {
  cards: { id: string | number; content: React.ReactNode }[]
  className?: string
}

export function StackCard({ cards, className = '' }: StackCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {cards.slice(0, 3).map((card, index) => (
        <motion.div
          key={card.id}
          initial={false}
          animate={{
            rotate: isHovered ? (index - 1) * 6 : (index - 1) * 2,
            y: isHovered ? (index - 1) * -8 : index * 4,
            scale: 1 - index * 0.02,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className={`${index === 0 ? '' : 'absolute inset-0'} p-6 bg-neutral-800 rounded-xl shadow-lg`}
          style={{ zIndex: cards.length - index }}
        >
          {card.content}
        </motion.div>
      ))}
    </div>
  )
}

// ============================================================================
// 8. MagneticCard - slight magnetic pull effect
// ============================================================================
export function MagneticCard({ children, className = '' }: CardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const springConfig = { stiffness: 150, damping: 20 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.1)
    y.set((e.clientY - centerY) * 0.1)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`p-6 bg-neutral-800 rounded-xl cursor-pointer transition-shadow hover:shadow-xl ${className}`}
    >
      {children}
    </motion.div>
  )
}

// Export all
export const Cards = {
  TiltCard,
  FlipCard,
  ShineCard,
  LiftCard,
  BorderCard,
  RevealCard,
  StackCard,
  MagneticCard,
}
