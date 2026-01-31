import { useState, useEffect, useRef, useCallback } from 'react'
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
// 1. BasicSlider - Simple range slider with tooltip
// ============================================================================
interface BasicSliderProps {
  value: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  showTooltip?: boolean
  showValue?: boolean
  disabled?: boolean
  className?: string
}

export function BasicSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  showTooltip = true,
  showValue = false,
  disabled = false,
  className = '',
}: BasicSliderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const percentage = ((value - min) / (max - min)) * 100

  const updateValue = useCallback((clientX: number) => {
    if (!trackRef.current || disabled) return
    
    const rect = trackRef.current.getBoundingClientRect()
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const rawValue = min + percent * (max - min)
    const steppedValue = Math.round(rawValue / step) * step
    const clampedValue = Math.max(min, Math.min(max, steppedValue))
    
    onChange?.(clampedValue)
  }, [min, max, step, disabled, onChange])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return
    setIsDragging(true)
    updateValue(e.clientX)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return
    setIsDragging(true)
    updateValue(e.touches[0].clientX)
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      updateValue(e.clientX)
    }

    const handleTouchMove = (e: TouchEvent) => {
      updateValue(e.touches[0].clientX)
    }

    const handleEnd = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleEnd)
    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleEnd)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleEnd)
    }
  }, [isDragging, updateValue])

  const showTooltipNow = showTooltip && (isDragging || isHovered)

  return (
    <div className={`relative ${className}`}>
      {showValue && (
        <div className="flex justify-between mb-2 text-sm">
          <span className="text-white/60">{min}</span>
          <span className="text-white font-medium">{value}</span>
          <span className="text-white/60">{max}</span>
        </div>
      )}
      
      <div
        ref={trackRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative h-2 bg-white/10 rounded-full cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        role="slider"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
      >
        {/* Filled track */}
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{ 
            width: `${percentage}%`,
            background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
          }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.1 }}
        />
        
        {/* Thumb */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
          style={{ left: `${percentage}%` }}
          animate={{ 
            scale: isDragging ? 1.2 : 1,
            left: `${percentage}%`
          }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.1 }}
        >
          <div
            className={`
              w-5 h-5 rounded-full bg-white
              shadow-[0_2px_10px_rgba(0,0,0,0.3)]
              ${isDragging ? 'ring-4 ring-[var(--color-primary)]/30' : ''}
              transition-shadow
            `}
          />
          
          {/* Tooltip */}
          <AnimatePresence>
            {showTooltipNow && (
              <motion.div
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 5, scale: 0.9 }}
                animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 5, scale: 0.9 }}
                className="
                  absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                  px-2 py-1 rounded-lg
                  bg-neutral-800 text-white text-xs font-medium
                  whitespace-nowrap
                "
              >
                {value}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. RangeSlider - Dual-handle for range selection
// ============================================================================
interface RangeSliderProps {
  value: [number, number]
  onChange?: (value: [number, number]) => void
  min?: number
  max?: number
  step?: number
  showTooltip?: boolean
  minDistance?: number
  disabled?: boolean
  className?: string
}

export function RangeSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  showTooltip = true,
  minDistance = 0,
  disabled = false,
  className = '',
}: RangeSliderProps) {
  const [activeHandle, setActiveHandle] = useState<'start' | 'end' | null>(null)
  const [hoveredHandle, setHoveredHandle] = useState<'start' | 'end' | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const percentageStart = ((value[0] - min) / (max - min)) * 100
  const percentageEnd = ((value[1] - min) / (max - min)) * 100

  const updateValue = useCallback((clientX: number) => {
    if (!trackRef.current || disabled || !activeHandle) return
    
    const rect = trackRef.current.getBoundingClientRect()
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const rawValue = min + percent * (max - min)
    const steppedValue = Math.round(rawValue / step) * step
    
    if (activeHandle === 'start') {
      const newStart = Math.max(min, Math.min(value[1] - minDistance, steppedValue))
      onChange?.([newStart, value[1]])
    } else {
      const newEnd = Math.min(max, Math.max(value[0] + minDistance, steppedValue))
      onChange?.([value[0], newEnd])
    }
  }, [min, max, step, minDistance, disabled, activeHandle, value, onChange])

  const handleMouseDown = (handle: 'start' | 'end') => (e: React.MouseEvent) => {
    if (disabled) return
    e.stopPropagation()
    setActiveHandle(handle)
  }

  useEffect(() => {
    if (!activeHandle) return

    const handleMouseMove = (e: MouseEvent) => {
      updateValue(e.clientX)
    }

    const handleEnd = () => {
      setActiveHandle(null)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleEnd)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleEnd)
    }
  }, [activeHandle, updateValue])

  return (
    <div className={`relative ${className}`}>
      <div className="flex justify-between mb-2 text-sm">
        <span className="text-white font-medium">{value[0]}</span>
        <span className="text-white/40">to</span>
        <span className="text-white font-medium">{value[1]}</span>
      </div>
      
      <div
        ref={trackRef}
        className={`
          relative h-2 bg-white/10 rounded-full
          ${disabled ? 'opacity-50' : ''}
        `}
      >
        {/* Filled track */}
        <div
          className="absolute top-0 h-full rounded-full"
          style={{ 
            left: `${percentageStart}%`,
            width: `${percentageEnd - percentageStart}%`,
            background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
          }}
        />
        
        {/* Start handle */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
          style={{ left: `${percentageStart}%` }}
          onMouseDown={handleMouseDown('start')}
          onMouseEnter={() => setHoveredHandle('start')}
          onMouseLeave={() => setHoveredHandle(null)}
          animate={{ scale: activeHandle === 'start' ? 1.2 : 1 }}
        >
          <div
            className={`
              w-5 h-5 rounded-full bg-white cursor-grab
              shadow-[0_2px_10px_rgba(0,0,0,0.3)]
              ${activeHandle === 'start' ? 'cursor-grabbing ring-4 ring-[var(--color-primary)]/30' : ''}
            `}
          />
          
          <AnimatePresence>
            {showTooltip && (activeHandle === 'start' || hoveredHandle === 'start') && (
              <motion.div
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 5 }}
                animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 5 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-lg bg-neutral-800 text-white text-xs"
              >
                {value[0]}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* End handle */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
          style={{ left: `${percentageEnd}%` }}
          onMouseDown={handleMouseDown('end')}
          onMouseEnter={() => setHoveredHandle('end')}
          onMouseLeave={() => setHoveredHandle(null)}
          animate={{ scale: activeHandle === 'end' ? 1.2 : 1 }}
        >
          <div
            className={`
              w-5 h-5 rounded-full bg-white cursor-grab
              shadow-[0_2px_10px_rgba(0,0,0,0.3)]
              ${activeHandle === 'end' ? 'cursor-grabbing ring-4 ring-[var(--color-primary)]/30' : ''}
            `}
          />
          
          <AnimatePresence>
            {showTooltip && (activeHandle === 'end' || hoveredHandle === 'end') && (
              <motion.div
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 5 }}
                animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 5 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-lg bg-neutral-800 text-white text-xs"
              >
                {value[1]}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. SteppedSlider - Slider with discrete steps
// ============================================================================
interface SteppedSliderProps {
  value: number
  onChange?: (value: number) => void
  steps: Array<{ value: number; label?: string }>
  showLabels?: boolean
  disabled?: boolean
  className?: string
}

export function SteppedSlider({
  value,
  onChange,
  steps,
  showLabels = true,
  disabled = false,
  className = '',
}: SteppedSliderProps) {
  const isDragging = false // SteppedSlider uses click, not drag
  const trackRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const currentIndex = steps.findIndex(s => s.value === value)
  const percentage = (currentIndex / (steps.length - 1)) * 100

  const handleClick = (stepValue: number) => {
    if (!disabled) {
      onChange?.(stepValue)
    }
  }

  const handleTrackClick = (e: React.MouseEvent) => {
    if (!trackRef.current || disabled) return
    
    const rect = trackRef.current.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const nearestIndex = Math.round(percent * (steps.length - 1))
    const clampedIndex = Math.max(0, Math.min(steps.length - 1, nearestIndex))
    
    onChange?.(steps[clampedIndex].value)
  }

  return (
    <div className={className}>
      <div
        ref={trackRef}
        onClick={handleTrackClick}
        className={`
          relative h-2 bg-white/10 rounded-full cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {/* Filled track */}
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: [0.4, 0, 0.2, 1] }}
        />
        
        {/* Step markers */}
        {steps.map((step, index) => {
          const stepPercent = (index / (steps.length - 1)) * 100
          const isActive = index <= currentIndex
          
          return (
            <div
              key={step.value}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
              style={{ left: `${stepPercent}%` }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleClick(step.value)
                }}
                disabled={disabled}
                className={`
                  w-4 h-4 rounded-full border-2 transition-all duration-200
                  ${isActive 
                    ? 'bg-white border-[var(--color-primary)]' 
                    : 'bg-neutral-800 border-white/30 hover:border-white/50'
                  }
                  ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}
              />
            </div>
          )
        })}
        
        {/* Thumb */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
          animate={{ 
            left: `${percentage}%`,
            scale: isDragging ? 1.2 : 1 
          }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <div
            className={`
              w-6 h-6 rounded-full bg-white
              shadow-[0_2px_10px_rgba(0,0,0,0.3)]
              ${isDragging ? 'ring-4 ring-[var(--color-primary)]/30' : ''}
            `}
          />
        </motion.div>
      </div>
      
      {/* Labels */}
      {showLabels && (
        <div className="relative mt-3 h-6">
          {steps.map((step, index) => {
            const stepPercent = (index / (steps.length - 1)) * 100
            return (
              <span
                key={step.value}
                className={`
                  absolute -translate-x-1/2 text-xs whitespace-nowrap
                  ${index === currentIndex ? 'text-white font-medium' : 'text-white/50'}
                `}
                style={{ left: `${stepPercent}%` }}
              >
                {step.label || step.value}
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// 4. VerticalSlider - Vertical orientation slider
// ============================================================================
interface VerticalSliderProps {
  value: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  height?: number
  showTooltip?: boolean
  disabled?: boolean
  className?: string
}

export function VerticalSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  height = 200,
  showTooltip = true,
  disabled = false,
  className = '',
}: VerticalSliderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const percentage = ((value - min) / (max - min)) * 100

  const updateValue = useCallback((clientY: number) => {
    if (!trackRef.current || disabled) return
    
    const rect = trackRef.current.getBoundingClientRect()
    // Invert because we want bottom to be min
    const percent = 1 - Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))
    const rawValue = min + percent * (max - min)
    const steppedValue = Math.round(rawValue / step) * step
    const clampedValue = Math.max(min, Math.min(max, steppedValue))
    
    onChange?.(clampedValue)
  }, [min, max, step, disabled, onChange])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return
    setIsDragging(true)
    updateValue(e.clientY)
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      updateValue(e.clientY)
    }

    const handleEnd = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleEnd)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleEnd)
    }
  }, [isDragging, updateValue])

  const showTooltipNow = showTooltip && (isDragging || isHovered)

  return (
    <div 
      className={`inline-flex flex-col items-center ${className}`}
      style={{ height }}
    >
      <span className="text-xs text-white/50 mb-2">{max}</span>
      
      <div
        ref={trackRef}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative w-2 flex-1 bg-white/10 rounded-full cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {/* Filled track (from bottom) */}
        <motion.div
          className="absolute bottom-0 left-0 w-full rounded-full"
          style={{ background: 'linear-gradient(0deg, var(--color-primary), var(--color-accent))' }}
          animate={{ height: `${percentage}%` }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.1 }}
        />
        
        {/* Thumb */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 translate-y-1/2"
          style={{ bottom: `${percentage}%` }}
          animate={{ 
            scale: isDragging ? 1.2 : 1,
            bottom: `${percentage}%`
          }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.1 }}
        >
          <div
            className={`
              w-5 h-5 rounded-full bg-white
              shadow-[0_2px_10px_rgba(0,0,0,0.3)]
              ${isDragging ? 'ring-4 ring-[var(--color-primary)]/30' : ''}
            `}
          />
          
          <AnimatePresence>
            {showTooltipNow && (
              <motion.div
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -5 }}
                animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -5 }}
                className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1 rounded-lg bg-neutral-800 text-white text-xs whitespace-nowrap"
              >
                {value}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      
      <span className="text-xs text-white/50 mt-2">{min}</span>
    </div>
  )
}

// ============================================================================
// 5. ColorSlider - Hue/color picker slider
// ============================================================================
interface ColorSliderProps {
  value: number // 0-360 for hue
  onChange?: (value: number) => void
  disabled?: boolean
  className?: string
}

export function ColorSlider({
  value,
  onChange,
  disabled = false,
  className = '',
}: ColorSliderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const percentage = (value / 360) * 100

  const updateValue = useCallback((clientX: number) => {
    if (!trackRef.current || disabled) return
    
    const rect = trackRef.current.getBoundingClientRect()
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const hue = Math.round(percent * 360)
    
    onChange?.(hue)
  }, [disabled, onChange])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return
    setIsDragging(true)
    updateValue(e.clientX)
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      updateValue(e.clientX)
    }

    const handleEnd = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleEnd)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleEnd)
    }
  }, [isDragging, updateValue])

  return (
    <div className={className}>
      <div
        ref={trackRef}
        onMouseDown={handleMouseDown}
        className={`
          relative h-4 rounded-full cursor-pointer overflow-hidden
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        style={{
          background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
        }}
      >
        {/* Thumb */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
          style={{ left: `${percentage}%` }}
          animate={{ 
            scale: isDragging ? 1.2 : 1,
            left: `${percentage}%`
          }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.1 }}
        >
          <div
            className={`
              w-6 h-6 rounded-full border-4 border-white
              shadow-[0_2px_10px_rgba(0,0,0,0.4)]
              ${isDragging ? 'ring-4 ring-white/30' : ''}
            `}
            style={{ backgroundColor: `hsl(${value}, 100%, 50%)` }}
          />
        </motion.div>
      </div>
      
      {/* Color preview */}
      <div className="flex items-center gap-3 mt-3">
        <div
          className="w-8 h-8 rounded-lg border border-white/20"
          style={{ backgroundColor: `hsl(${value}, 100%, 50%)` }}
        />
        <span className="text-sm text-white/60 font-mono">
          HSL({value}, 100%, 50%)
        </span>
      </div>
    </div>
  )
}

// ============================================================================
// Demo Component for Showcase
// ============================================================================
export function SlidersDemo() {
  const [basicValue, setBasicValue] = useState(40)
  const [rangeValue, setRangeValue] = useState<[number, number]>([20, 80])
  const [steppedValue, setSteppedValue] = useState(50)
  const [verticalValue, setVerticalValue] = useState(60)
  const [colorValue, setColorValue] = useState(200)

  const steppedSteps = [
    { value: 0, label: '0%' },
    { value: 25, label: '25%' },
    { value: 50, label: '50%' },
    { value: 75, label: '75%' },
    { value: 100, label: '100%' },
  ]

  return (
    <div className="space-y-12 max-w-md mx-auto">
      {/* Basic Slider */}
      <div>
        <p className="text-sm text-white/50 mb-4 font-medium">Basic Slider</p>
        <BasicSlider
          value={basicValue}
          onChange={setBasicValue}
          showValue
        />
      </div>

      {/* Range Slider */}
      <div>
        <p className="text-sm text-white/50 mb-4 font-medium">Range Slider</p>
        <RangeSlider
          value={rangeValue}
          onChange={setRangeValue}
          minDistance={10}
        />
      </div>

      {/* Stepped Slider */}
      <div>
        <p className="text-sm text-white/50 mb-4 font-medium">Stepped Slider</p>
        <SteppedSlider
          value={steppedValue}
          onChange={setSteppedValue}
          steps={steppedSteps}
        />
      </div>

      {/* Vertical Slider */}
      <div>
        <p className="text-sm text-white/50 mb-4 font-medium">Vertical Slider</p>
        <div className="flex justify-center">
          <VerticalSlider
            value={verticalValue}
            onChange={setVerticalValue}
            height={150}
          />
        </div>
      </div>

      {/* Color Slider */}
      <div>
        <p className="text-sm text-white/50 mb-4 font-medium">Color/Hue Slider</p>
        <ColorSlider
          value={colorValue}
          onChange={setColorValue}
        />
      </div>
    </div>
  )
}

// Export all
export const Sliders = {
  BasicSlider,
  RangeSlider,
  SteppedSlider,
  VerticalSlider,
  ColorSlider,
  SlidersDemo,
}
