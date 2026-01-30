import { motion } from 'framer-motion'

interface LoaderProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

const sizeMap = {
  sm: { dot: 8, gap: 4 },
  md: { dot: 12, gap: 6 },
  lg: { dot: 16, gap: 8 },
}

// ============================================================================
// 1. PulseLoader - pulsing dots
// ============================================================================
export function PulseLoader({ className = '', size = 'md', color = '#6366f1' }: LoaderProps) {
  const { dot, gap } = sizeMap[size]
  
  return (
    <div className={`flex items-center ${className}`} style={{ gap }}>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
          style={{
            width: dot,
            height: dot,
            backgroundColor: color,
            borderRadius: '50%',
          }}
        />
      ))}
    </div>
  )
}

// ============================================================================
// 2. OrbitLoader - orbiting circles
// ============================================================================
export function OrbitLoader({ className = '', size = 'md', color = '#6366f1' }: LoaderProps) {
  const containerSize = size === 'sm' ? 32 : size === 'md' ? 48 : 64
  const dotSize = size === 'sm' ? 6 : size === 'md' ? 8 : 12
  
  return (
    <div
      className={`relative ${className}`}
      style={{ width: containerSize, height: containerSize }}
    >
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="absolute"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 0.15,
          }}
          style={{
            width: dotSize,
            height: dotSize,
            backgroundColor: color,
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            marginTop: -dotSize / 2,
            marginLeft: -dotSize / 2,
            transformOrigin: `${containerSize / 2 - dotSize / 2}px center`,
          }}
        />
      ))}
    </div>
  )
}

// ============================================================================
// 3. MorphLoader - morphing shape
// ============================================================================
export function MorphLoader({ className = '', size = 'md', color = '#6366f1' }: LoaderProps) {
  const boxSize = size === 'sm' ? 24 : size === 'md' ? 36 : 48
  
  return (
    <motion.div
      className={className}
      style={{
        width: boxSize,
        height: boxSize,
        backgroundColor: color,
      }}
      animate={{
        borderRadius: ['25%', '50%', '25%'],
        rotate: [0, 180, 360],
        scale: [1, 0.8, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

// ============================================================================
// 4. TextLoader - animated loading text
// ============================================================================
interface TextLoaderProps extends LoaderProps {
  text?: string
}

export function TextLoader({ className = '', text = 'Loading', color = '#6366f1' }: TextLoaderProps) {
  return (
    <div className={`flex items-center ${className}`} style={{ color }}>
      <span>{text}</span>
      <span className="flex ml-1">
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            .
          </motion.span>
        ))}
      </span>
    </div>
  )
}

// ============================================================================
// 5. ProgressLoader - smooth progress bar
// ============================================================================
interface ProgressLoaderProps extends LoaderProps {
  progress?: number // 0-100
  showPercentage?: boolean
}

export function ProgressLoader({
  className = '',
  progress,
  showPercentage = false,
  color = '#6366f1',
}: ProgressLoaderProps) {
  const isIndeterminate = progress === undefined

  return (
    <div className={`w-full ${className}`}>
      <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
        {isIndeterminate ? (
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color, width: '40%' }}
            animate={{ x: ['-100%', '350%'] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ) : (
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>
      {showPercentage && progress !== undefined && (
        <motion.p
          className="text-sm text-neutral-400 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {Math.round(progress)}%
        </motion.p>
      )}
    </div>
  )
}

// ============================================================================
// 6. SkeletonLoader - shimmer skeleton
// ============================================================================
interface SkeletonLoaderProps {
  width?: string | number
  height?: string | number
  rounded?: boolean
  className?: string
}

export function SkeletonLoader({
  width = '100%',
  height = 20,
  rounded = false,
  className = '',
}: SkeletonLoaderProps) {
  return (
    <div
      className={`relative overflow-hidden bg-neutral-800 ${rounded ? 'rounded-full' : 'rounded-md'} ${className}`}
      style={{ width, height }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-700 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  )
}

// ============================================================================
// 7. SpinnerLoader - custom spinner variations
// ============================================================================
interface SpinnerLoaderProps extends LoaderProps {
  variant?: 'default' | 'dots' | 'bars'
}

export function SpinnerLoader({
  className = '',
  size = 'md',
  color = '#6366f1',
  variant = 'default',
}: SpinnerLoaderProps) {
  const spinnerSize = size === 'sm' ? 24 : size === 'md' ? 36 : 48

  if (variant === 'default') {
    return (
      <motion.div
        className={className}
        style={{
          width: spinnerSize,
          height: spinnerSize,
          border: `3px solid ${color}20`,
          borderTopColor: color,
          borderRadius: '50%',
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    )
  }

  if (variant === 'dots') {
    return (
      <div
        className={`relative ${className}`}
        style={{ width: spinnerSize, height: spinnerSize }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width: spinnerSize / 6,
              height: spinnerSize / 6,
              backgroundColor: color,
              borderRadius: '50%',
              top: '50%',
              left: '50%',
              transformOrigin: `0 ${spinnerSize / 2.5}px`,
              transform: `rotate(${i * 45}deg) translateY(-${spinnerSize / 2.5}px)`,
            }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
    )
  }

  // bars variant
  return (
    <div
      className={`flex items-end justify-center gap-1 ${className}`}
      style={{ height: spinnerSize }}
    >
      {[0, 1, 2, 3].map(i => (
        <motion.div
          key={i}
          style={{
            width: spinnerSize / 8,
            backgroundColor: color,
            borderRadius: 2,
          }}
          animate={{
            height: [spinnerSize * 0.3, spinnerSize, spinnerSize * 0.3],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  )
}

// ============================================================================
// 8. BarLoader - bouncing bars
// ============================================================================
export function BarLoader({ className = '', size = 'md', color = '#6366f1' }: LoaderProps) {
  const barHeight = size === 'sm' ? 16 : size === 'md' ? 24 : 32
  const barWidth = size === 'sm' ? 3 : size === 'md' ? 4 : 6

  return (
    <div className={`flex items-end gap-1 ${className}`} style={{ height: barHeight }}>
      {[0, 1, 2, 3, 4].map(i => (
        <motion.div
          key={i}
          style={{
            width: barWidth,
            backgroundColor: color,
            borderRadius: barWidth / 2,
          }}
          animate={{
            height: [barHeight * 0.3, barHeight, barHeight * 0.3],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  )
}

// Export all
export const Loaders = {
  PulseLoader,
  OrbitLoader,
  MorphLoader,
  TextLoader,
  ProgressLoader,
  SkeletonLoader,
  SpinnerLoader,
  BarLoader,
}
