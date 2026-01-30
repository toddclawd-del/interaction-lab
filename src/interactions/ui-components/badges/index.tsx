import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface BadgeProps {
  children: React.ReactNode
  className?: string
}

// ============================================================================
// 1. PulseBadge - pulsing notification dot
// ============================================================================
interface PulseBadgeProps extends BadgeProps {
  count?: number
  color?: string
}

export function PulseBadge({ children, count, color = '#ef4444', className = '' }: PulseBadgeProps) {
  return (
    <div className={`relative inline-flex ${className}`}>
      {children}
      {(count === undefined || count > 0) && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <motion.span
            animate={{ scale: [1, 1.5, 1], opacity: [0.75, 0, 0.75] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inline-flex h-full w-full rounded-full"
            style={{ backgroundColor: color, opacity: 0.75 }}
          />
          <span
            className="relative inline-flex rounded-full h-4 w-4 items-center justify-center text-[10px] font-bold text-white"
            style={{ backgroundColor: color }}
          >
            {count !== undefined && count <= 9 ? count : count !== undefined ? '9+' : ''}
          </span>
        </span>
      )}
    </div>
  )
}

// ============================================================================
// 2. CountBadge - number counts up animation
// ============================================================================
interface CountBadgeProps {
  count: number
  className?: string
  color?: string
}

export function CountBadge({ count, className = '', color = '#6366f1' }: CountBadgeProps) {
  const [displayCount, setDisplayCount] = useState(0)
  
  useEffect(() => {
    const duration = 500
    const steps = 20
    const stepDuration = duration / steps
    const increment = count / steps
    
    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      if (currentStep >= steps) {
        setDisplayCount(count)
        clearInterval(interval)
      } else {
        setDisplayCount(Math.round(increment * currentStep))
      }
    }, stepDuration)
    
    return () => clearInterval(interval)
  }, [count])

  return (
    <motion.span
      key={count}
      initial={{ scale: 1.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-white text-sm font-bold ${className}`}
      style={{ backgroundColor: color }}
    >
      {displayCount}
    </motion.span>
  )
}

// ============================================================================
// 3. ShimmerBadge - shimmer effect
// ============================================================================
export function ShimmerBadge({ children, className = '' }: BadgeProps) {
  return (
    <span className={`relative inline-flex items-center px-3 py-1 bg-neutral-800 rounded-full text-white text-sm font-medium overflow-hidden ${className}`}>
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />
      <span className="relative z-10">{children}</span>
    </span>
  )
}

// ============================================================================
// 4. PopBadge - pops in with spring
// ============================================================================
interface PopBadgeProps extends BadgeProps {
  show?: boolean
  color?: string
}

export function PopBadge({ children, show = true, color = '#22c55e', className = '' }: PopBadgeProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-medium ${className}`}
          style={{ backgroundColor: color }}
        >
          {children}
        </motion.span>
      )}
    </AnimatePresence>
  )
}

// ============================================================================
// 5. SlideBadge - slides in from side
// ============================================================================
interface SlideBadgeProps extends BadgeProps {
  show?: boolean
  direction?: 'left' | 'right' | 'top' | 'bottom'
  color?: string
}

export function SlideBadge({
  children,
  show = true,
  direction = 'right',
  color = '#f59e0b',
  className = '',
}: SlideBadgeProps) {
  const directionMap = {
    left: { x: -50, y: 0 },
    right: { x: 50, y: 0 },
    top: { x: 0, y: -50 },
    bottom: { x: 0, y: 50 },
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.span
          initial={{ ...directionMap[direction], opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          exit={{ ...directionMap[direction], opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-medium ${className}`}
          style={{ backgroundColor: color }}
        >
          {children}
        </motion.span>
      )}
    </AnimatePresence>
  )
}

// ============================================================================
// Bonus: StatusBadge - colored dot with label
// ============================================================================
interface StatusBadgeProps {
  status: 'online' | 'offline' | 'away' | 'busy'
  label?: string
  className?: string
}

const statusColors = {
  online: '#22c55e',
  offline: '#6b7280',
  away: '#f59e0b',
  busy: '#ef4444',
}

export function StatusBadge({ status, label, className = '' }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 bg-neutral-800 rounded-full text-sm ${className}`}>
      <motion.span
        animate={status === 'online' ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: statusColors[status] }}
      />
      <span className="text-neutral-300">{label || status}</span>
    </span>
  )
}

// ============================================================================
// Bonus: TagBadge - removable tag
// ============================================================================
interface TagBadgeProps extends BadgeProps {
  onRemove?: () => void
  color?: string
}

export function TagBadge({ children, onRemove, color = '#6366f1', className = '' }: TagBadgeProps) {
  return (
    <motion.span
      layout
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-white text-sm font-medium ${className}`}
      style={{ backgroundColor: color }}
    >
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 w-4 h-4 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        >
          ×
        </button>
      )}
    </motion.span>
  )
}

// Export all
export const Badges = {
  PulseBadge,
  CountBadge,
  ShimmerBadge,
  PopBadge,
  SlideBadge,
  StatusBadge,
  TagBadge,
}
