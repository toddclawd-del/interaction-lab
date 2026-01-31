import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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

// ============================================================================
// 1. LinearProgress - Animated progress bar
// ============================================================================
interface LinearProgressProps {
  value: number // 0-100
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'gradient' | 'striped'
  color?: string
  className?: string
}

export function LinearProgress({
  value,
  showLabel = false,
  size = 'md',
  variant = 'default',
  color,
  className = '',
}: LinearProgressProps) {
  const prefersReducedMotion = useReducedMotion()
  const clampedValue = Math.min(100, Math.max(0, value))

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  const getBackground = () => {
    if (color) return color
    switch (variant) {
      case 'gradient':
        return 'linear-gradient(90deg, var(--color-primary), var(--color-accent))'
      default:
        return 'var(--color-primary)'
    }
  }

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between mb-2 text-sm">
          <span className="text-white/60">Progress</span>
          <span className="text-white font-medium">{Math.round(clampedValue)}%</span>
        </div>
      )}
      <div 
        className={`
          relative w-full ${sizeClasses[size]} 
          bg-white/10 rounded-full overflow-hidden
        `}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ 
            duration: prefersReducedMotion ? 0 : 0.5, 
            ease: [0.4, 0, 0.2, 1] 
          }}
          className={`
            h-full rounded-full relative
            ${variant === 'striped' ? 'animate-stripes' : ''}
          `}
          style={{ background: getBackground() }}
        >
          {/* Shimmer effect */}
          {!prefersReducedMotion && variant !== 'striped' && (
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          )}
        </motion.div>
      </div>
      <style>{`
        @keyframes stripes {
          from { background-position: 0 0; }
          to { background-position: 40px 0; }
        }
        @keyframes shimmer {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }
        .animate-stripes {
          background-image: linear-gradient(
            45deg,
            rgba(255,255,255,0.15) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255,255,255,0.15) 50%,
            rgba(255,255,255,0.15) 75%,
            transparent 75%,
            transparent
          );
          background-size: 40px 40px;
          animation: stripes 1s linear infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

// ============================================================================
// 2. CircularProgress - Circular progress indicator
// ============================================================================
interface CircularProgressProps {
  value: number // 0-100
  size?: number
  strokeWidth?: number
  showLabel?: boolean
  className?: string
}

export function CircularProgress({
  value,
  size = 80,
  strokeWidth = 8,
  showLabel = true,
  className = '',
}: CircularProgressProps) {
  const prefersReducedMotion = useReducedMotion()
  const clampedValue = Math.min(100, Math.max(0, value))
  
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (clampedValue / 100) * circumference

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-white/10"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ 
            duration: prefersReducedMotion ? 0 : 0.8, 
            ease: [0.4, 0, 0.2, 1] 
          }}
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="var(--color-accent)" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center label */}
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            key={Math.round(clampedValue)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-lg font-bold text-white"
          >
            {Math.round(clampedValue)}%
          </motion.span>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// 3. Stepper - Multi-step indicator
// ============================================================================
interface Step {
  id: string
  title: string
  description?: string
  icon?: React.ReactNode
}

interface StepperProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (index: number) => void
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export function Stepper({
  steps,
  currentStep,
  onStepClick,
  orientation = 'horizontal',
  className = '',
}: StepperProps) {
  const prefersReducedMotion = useReducedMotion()
  const isVertical = orientation === 'vertical'

  return (
    <div 
      className={`
        ${isVertical ? 'flex flex-col' : 'flex items-start justify-between'}
        ${className}
      `}
    >
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep
        const isClickable = onStepClick && index <= currentStep

        return (
          <div
            key={step.id}
            className={`
              ${isVertical ? 'flex items-start' : 'flex flex-col items-center flex-1'}
              ${index < steps.length - 1 ? 'relative' : ''}
            `}
          >
            {/* Step indicator */}
            <div className={isVertical ? 'flex flex-col items-center mr-4' : ''}>
              <motion.button
                onClick={() => isClickable && onStepClick(index)}
                disabled={!isClickable}
                whileHover={isClickable && !prefersReducedMotion ? { scale: 1.1 } : undefined}
                whileTap={isClickable && !prefersReducedMotion ? { scale: 0.95 } : undefined}
                className={`
                  relative w-10 h-10 rounded-full flex items-center justify-center
                  font-semibold text-sm transition-all duration-300
                  ${isClickable ? 'cursor-pointer' : 'cursor-default'}
                  ${isCompleted 
                    ? 'bg-[var(--color-primary)] text-white' 
                    : isCurrent 
                      ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)] ring-2 ring-[var(--color-primary)]'
                      : 'bg-white/10 text-white/40'
                  }
                `}
                aria-label={`Step ${index + 1}: ${step.title}`}
              >
                <AnimatePresence mode="wait">
                  {isCompleted ? (
                    <motion.svg
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </motion.svg>
                  ) : step.icon ? (
                    <motion.span
                      key="icon"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      {step.icon}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="number"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      {index + 1}
                    </motion.span>
                  )}
                </AnimatePresence>
                
                {/* Pulse effect for current step */}
                {isCurrent && !prefersReducedMotion && (
                  <motion.span
                    className="absolute inset-0 rounded-full bg-[var(--color-primary)]"
                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </motion.button>

              {/* Connector line (vertical) */}
              {isVertical && index < steps.length - 1 && (
                <div className="w-px h-16 my-2 bg-white/10 relative overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 w-full bg-[var(--color-primary)]"
                    initial={{ height: 0 }}
                    animate={{ height: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: 0.2 }}
                  />
                </div>
              )}
            </div>

            {/* Step content */}
            <div className={`
              ${isVertical ? 'pt-1 pb-8' : 'mt-3 text-center'}
              ${!isVertical && index < steps.length - 1 ? 'flex-1' : ''}
            `}>
              <p className={`
                font-medium text-sm
                ${isCurrent || isCompleted ? 'text-white' : 'text-white/50'}
              `}>
                {step.title}
              </p>
              {step.description && (
                <p className="text-xs text-white/40 mt-0.5 max-w-[120px]">
                  {step.description}
                </p>
              )}
            </div>

            {/* Connector line (horizontal) */}
            {!isVertical && index < steps.length - 1 && (
              <div className="flex-1 h-px bg-white/10 mt-5 mx-3 relative overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-[var(--color-primary)]"
                  initial={{ width: 0 }}
                  animate={{ width: isCompleted ? '100%' : '0%' }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: 0.2 }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ============================================================================
// 4. ProgressSteps - Simple numbered progress steps
// ============================================================================
interface ProgressStepsProps {
  totalSteps: number
  currentStep: number
  onStepChange?: (step: number) => void
  className?: string
}

export function ProgressSteps({
  totalSteps,
  currentStep,
  onStepChange,
  className = '',
}: ProgressStepsProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {Array.from({ length: totalSteps }, (_, i) => {
        const isCompleted = i < currentStep
        const isCurrent = i === currentStep

        return (
          <motion.button
            key={i}
            onClick={() => onStepChange?.(i)}
            disabled={!onStepChange}
            whileHover={onStepChange && !prefersReducedMotion ? { scale: 1.2 } : undefined}
            className={`
              w-2.5 h-2.5 rounded-full transition-all duration-300
              ${onStepChange ? 'cursor-pointer' : 'cursor-default'}
              ${isCompleted || isCurrent 
                ? 'bg-[var(--color-primary)]' 
                : 'bg-white/20'
              }
              ${isCurrent ? 'w-8' : ''}
            `}
            aria-label={`Step ${i + 1} of ${totalSteps}`}
          />
        )
      })}
    </div>
  )
}

// ============================================================================
// 5. AnimatedCounter - Animated number display
// ============================================================================
interface AnimatedCounterProps {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
}

export function AnimatedCounter({
  value,
  duration = 1000,
  prefix = '',
  suffix = '',
  className = '',
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const prefersReducedMotion = useReducedMotion()
  const previousValue = useRef(0)

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayValue(value)
      return
    }

    const startValue = previousValue.current
    const difference = value - startValue
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      
      setDisplayValue(Math.round(startValue + difference * easeOut))

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        previousValue.current = value
      }
    }

    requestAnimationFrame(animate)
  }, [value, duration, prefersReducedMotion])

  return (
    <span className={className}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  )
}

// ============================================================================
// 6. SegmentedProgress - Multi-segment progress bar
// ============================================================================
interface SegmentedProgressProps {
  segments: Array<{
    value: number
    color?: string
    label?: string
  }>
  total?: number
  showLabels?: boolean
  className?: string
}

export function SegmentedProgress({
  segments,
  total,
  showLabels = true,
  className = '',
}: SegmentedProgressProps) {
  const prefersReducedMotion = useReducedMotion()
  const calculatedTotal = total || segments.reduce((sum, seg) => sum + seg.value, 0)
  
  const defaultColors = [
    'var(--color-primary)',
    'var(--color-secondary)',
    'var(--color-accent)',
    '#10b981',
    '#f97316',
  ]

  return (
    <div className={className}>
      {showLabels && (
        <div className="flex flex-wrap gap-4 mb-3">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: segment.color || defaultColors[index % defaultColors.length] }}
              />
              <span className="text-xs text-white/60">
                {segment.label || `Segment ${index + 1}`}: {Math.round((segment.value / calculatedTotal) * 100)}%
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden flex">
        {segments.map((segment, index) => {
          const percentage = (segment.value / calculatedTotal) * 100
          return (
            <motion.div
              key={index}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ 
                duration: prefersReducedMotion ? 0 : 0.5, 
                delay: index * 0.1,
                ease: [0.4, 0, 0.2, 1] 
              }}
              className="h-full"
              style={{ backgroundColor: segment.color || defaultColors[index % defaultColors.length] }}
            />
          )
        })}
      </div>
    </div>
  )
}

// ============================================================================
// Demo Component for Showcase
// ============================================================================
export function ProgressDemo() {
  const [progress, setProgress] = useState(65)
  const [currentStep, setCurrentStep] = useState(1)

  const steps: Step[] = [
    { id: '1', title: 'Account', description: 'Create account' },
    { id: '2', title: 'Profile', description: 'Add details' },
    { id: '3', title: 'Verify', description: 'Confirm email' },
    { id: '4', title: 'Complete', description: 'All done!' },
  ]

  const segments = [
    { value: 40, label: 'Completed', color: '#10b981' },
    { value: 25, label: 'In Progress', color: 'var(--color-primary)' },
    { value: 35, label: 'Remaining', color: '#6b7280' },
  ]

  return (
    <div className="space-y-12 max-w-xl mx-auto">
      {/* Progress control */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setProgress(p => Math.max(0, p - 10))}
          className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          -10%
        </button>
        <span className="text-white font-medium w-16 text-center">{progress}%</span>
        <button
          onClick={() => setProgress(p => Math.min(100, p + 10))}
          className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          +10%
        </button>
      </div>

      {/* Linear Progress variants */}
      <div className="space-y-6">
        <p className="text-sm text-white/50 font-medium">Linear Progress</p>
        <div className="space-y-4">
          <LinearProgress value={progress} showLabel />
          <LinearProgress value={progress} variant="gradient" size="lg" />
          <LinearProgress value={progress} variant="striped" />
        </div>
      </div>

      {/* Circular Progress */}
      <div>
        <p className="text-sm text-white/50 mb-4 font-medium">Circular Progress</p>
        <div className="flex justify-center gap-8">
          <CircularProgress value={progress} size={80} />
          <CircularProgress value={progress} size={100} strokeWidth={10} />
          <CircularProgress value={progress} size={60} showLabel={false} />
        </div>
      </div>

      {/* Stepper */}
      <div>
        <p className="text-sm text-white/50 mb-4 font-medium">Stepper</p>
        <Stepper
          steps={steps}
          currentStep={currentStep}
          onStepClick={setCurrentStep}
        />
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentStep(s => Math.min(steps.length, s + 1))}
            disabled={currentStep >= steps.length}
            className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Progress Steps (dots) */}
      <div>
        <p className="text-sm text-white/50 mb-4 font-medium">Progress Dots</p>
        <div className="flex justify-center">
          <ProgressSteps
            totalSteps={5}
            currentStep={Math.floor(progress / 25)}
          />
        </div>
      </div>

      {/* Animated Counter */}
      <div>
        <p className="text-sm text-white/50 mb-4 font-medium">Animated Counter</p>
        <div className="flex justify-center items-center gap-8">
          <div className="text-center">
            <AnimatedCounter value={progress * 10} className="text-4xl font-bold text-white" />
            <p className="text-xs text-white/50 mt-1">Points</p>
          </div>
          <div className="text-center">
            <AnimatedCounter value={progress} prefix="$" suffix="K" className="text-4xl font-bold text-white" />
            <p className="text-xs text-white/50 mt-1">Revenue</p>
          </div>
        </div>
      </div>

      {/* Segmented Progress */}
      <div>
        <p className="text-sm text-white/50 mb-4 font-medium">Segmented Progress</p>
        <SegmentedProgress segments={segments} />
      </div>
    </div>
  )
}

// Export all
export const Progress = {
  LinearProgress,
  CircularProgress,
  Stepper,
  ProgressSteps,
  AnimatedCounter,
  SegmentedProgress,
  ProgressDemo,
}
