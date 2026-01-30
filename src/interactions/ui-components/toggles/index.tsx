import { motion, AnimatePresence } from 'framer-motion'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
  disabled?: boolean
}

// ============================================================================
// 1. SmoothToggle - smooth slide with color transition
// ============================================================================
export function SmoothToggle({ checked, onChange, className = '', disabled = false }: ToggleProps) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
        checked ? 'bg-indigo-600' : 'bg-neutral-700'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      <motion.div
        initial={false}
        animate={{ x: checked ? 24 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
      />
    </button>
  )
}

// ============================================================================
// 2. BounceToggle - bouncy toggle animation
// ============================================================================
export function BounceToggle({ checked, onChange, className = '' }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
        checked ? 'bg-emerald-500' : 'bg-neutral-700'
      } ${className}`}
    >
      <motion.div
        initial={false}
        animate={{ x: checked ? 24 : 2 }}
        transition={{
          type: 'spring',
          stiffness: 700,
          damping: 15,
        }}
        className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
      />
    </button>
  )
}

// ============================================================================
// 3. MorphToggle - shape morphs (circle to square)
// ============================================================================
export function MorphToggle({ checked, onChange, className = '' }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
        checked ? 'bg-rose-500' : 'bg-neutral-700'
      } ${className}`}
    >
      <motion.div
        initial={false}
        animate={{
          x: checked ? 24 : 2,
          borderRadius: checked ? 4 : 12,
          rotate: checked ? 180 : 0,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="absolute top-1 w-6 h-6 bg-white shadow-md"
      />
    </button>
  )
}

// ============================================================================
// 4. IconToggle - sun/moon icon toggle
// ============================================================================
export function IconToggle({ checked, onChange, className = '' }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-16 h-9 rounded-full overflow-hidden transition-colors duration-500 ${
        checked ? 'bg-indigo-900' : 'bg-amber-400'
      } ${className}`}
    >
      {/* Stars (visible when dark mode) */}
      <AnimatePresence>
        {checked && (
          <>
            {[1, 2, 3].map(i => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ delay: i * 0.1 }}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${10 + i * 8}%`,
                  top: `${20 + (i % 2) * 30}%`,
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{ x: checked ? 30 : 4 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1.5 w-6 h-6 flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {checked ? (
            <motion.span
              key="moon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              className="text-lg"
            >
              🌙
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="text-lg"
            >
              ☀️
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </button>
  )
}

// ============================================================================
// 5. LiquidToggle - liquid blob animation
// ============================================================================
export function LiquidToggle({ checked, onChange, className = '' }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-14 h-8 rounded-full transition-colors duration-300 overflow-hidden ${
        checked ? 'bg-cyan-500' : 'bg-neutral-700'
      } ${className}`}
    >
      {/* Liquid blob background */}
      <motion.div
        initial={false}
        animate={{
          x: checked ? 0 : -40,
        }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="absolute -left-4 -right-4 -top-4 -bottom-4 bg-cyan-400 rounded-full"
        style={{
          clipPath: 'ellipse(60% 100% at 50% 50%)',
        }}
      />
      
      <motion.div
        initial={false}
        animate={{ x: checked ? 24 : 2 }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
        }}
        className="relative z-10 top-1 w-6 h-6 bg-white rounded-full shadow-md"
      />
    </button>
  )
}

// ============================================================================
// 6. SegmentedToggle - segmented control with sliding background
// ============================================================================
interface SegmentedToggleProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export function SegmentedToggle({ options, value, onChange, className = '' }: SegmentedToggleProps) {
  const activeIndex = options.indexOf(value)

  return (
    <div className={`relative flex bg-neutral-800 rounded-lg p-1 ${className}`}>
      <motion.div
        className="absolute inset-y-1 bg-indigo-600 rounded-md"
        initial={false}
        animate={{
          left: `calc(${(100 / options.length) * activeIndex}% + 4px)`,
          width: `calc(${100 / options.length}% - 8px)`,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      />
      
      {options.map(option => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`relative z-10 flex-1 py-2 px-4 rounded-md transition-colors ${
            value === option ? 'text-white' : 'text-neutral-400'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

// Export all
export const Toggles = {
  SmoothToggle,
  BounceToggle,
  MorphToggle,
  IconToggle,
  LiquidToggle,
  SegmentedToggle,
}
