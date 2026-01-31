import { useState, useEffect, useCallback, createContext, useContext, useRef } from 'react'
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

// Toast types
type ToastType = 'success' | 'error' | 'warning' | 'info'
type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  dismissible?: boolean
}

interface ToastContextValue {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
  clearAll: () => void
}

// Toast styling configs
const toastTypeConfig = {
  success: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
    progressColor: 'bg-emerald-500',
    borderColor: 'border-emerald-500/30',
  },
  error: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    iconBg: 'bg-red-500/20',
    iconColor: 'text-red-400',
    progressColor: 'bg-red-500',
    borderColor: 'border-red-500/30',
  },
  warning: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-400',
    progressColor: 'bg-amber-500',
    borderColor: 'border-amber-500/30',
  },
  info: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
    progressColor: 'bg-blue-500',
    borderColor: 'border-blue-500/30',
  },
}

const positionClasses: Record<ToastPosition, string> = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
}

// Context for toast management
const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// ============================================================================
// Single Toast Component
// ============================================================================
interface ToastItemProps {
  toast: Toast
  onRemove: (id: string) => void
  position: ToastPosition
}

function ToastItem({ toast, onRemove, position }: ToastItemProps) {
  const prefersReducedMotion = useReducedMotion()
  const config = toastTypeConfig[toast.type]
  const duration = toast.duration ?? 5000
  const [progress, setProgress] = useState(100)
  const intervalRef = useRef<number>()

  // Auto-dismiss with progress
  useEffect(() => {
    if (duration <= 0) return

    const startTime = Date.now()
    const updateProgress = () => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(remaining)
      
      if (remaining <= 0) {
        onRemove(toast.id)
      }
    }

    intervalRef.current = window.setInterval(updateProgress, 50)
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [duration, toast.id, onRemove])

  // Pause on hover
  const handleMouseEnter = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const handleMouseLeave = () => {
    if (duration <= 0) return
    const remainingTime = (progress / 100) * duration
    const startTime = Date.now()
    const startProgress = progress

    const updateProgress = () => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, startProgress - (elapsed / remainingTime) * startProgress)
      setProgress(remaining)
      
      if (remaining <= 0) {
        onRemove(toast.id)
      }
    }

    intervalRef.current = window.setInterval(updateProgress, 50)
  }

  // Animation variants based on position
  const isRight = position.includes('right')
  const isTop = position.includes('top')
  const slideDirection = isRight ? 100 : position.includes('left') ? -100 : 0

  return (
    <motion.div
      layout
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: slideDirection, y: isTop ? -20 : 20 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0, y: 0 }}
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: slideDirection, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        relative w-80 overflow-hidden
        backdrop-blur-xl bg-neutral-900/95
        border ${config.borderColor}
        shadow-[0_10px_40px_rgba(0,0,0,0.4),0_0_20px_rgba(99,102,241,0.1)]
        rounded-xl
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="p-4 flex gap-3">
        {/* Icon */}
        <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${config.iconBg} ${config.iconColor}`}>
          {config.icon}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0 pt-1">
          <p className="font-semibold text-white text-sm">{toast.title}</p>
          {toast.message && (
            <p className="text-white/60 text-sm mt-0.5 line-clamp-2">{toast.message}</p>
          )}
        </div>
        
        {/* Close button */}
        {toast.dismissible !== false && (
          <button
            onClick={() => onRemove(toast.id)}
            className="shrink-0 p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            aria-label="Dismiss"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Progress bar */}
      {duration > 0 && (
        <div className="h-1 bg-white/5">
          <motion.div
            className={`h-full ${config.progressColor}`}
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      )}
    </motion.div>
  )
}

// ============================================================================
// Toast Provider & Container
// ============================================================================
interface ToastProviderProps {
  children: React.ReactNode
  position?: ToastPosition
  maxToasts?: number
}

export function ToastProvider({ 
  children, 
  position = 'top-right',
  maxToasts = 5,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`
    setToasts(prev => {
      const newToasts = [...prev, { ...toast, id }]
      // Keep only the latest maxToasts
      return newToasts.slice(-maxToasts)
    })
    return id
  }, [maxToasts])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setToasts([])
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAll }}>
      {children}
      
      {/* Toast Container */}
      <div 
        className={`fixed z-[100] ${positionClasses[position]} flex flex-col gap-3`}
        style={{ 
          flexDirection: position.includes('bottom') ? 'column-reverse' : 'column'
        }}
      >
        <AnimatePresence mode="popLayout">
          {toasts.map(toast => (
            <ToastItem 
              key={toast.id} 
              toast={toast} 
              onRemove={removeToast}
              position={position}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

// ============================================================================
// Standalone Toast Components (for showcase without context)
// ============================================================================
interface StandaloneToastProps {
  type: ToastType
  title: string
  message?: string
  onDismiss?: () => void
  showProgress?: boolean
  className?: string
}

export function StandaloneToast({
  type,
  title,
  message,
  onDismiss,
  showProgress = true,
  className = '',
}: StandaloneToastProps) {
  const config = toastTypeConfig[type]
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (!showProgress) return
    const interval = setInterval(() => {
      setProgress(p => Math.max(0, p - 2))
    }, 100)
    return () => clearInterval(interval)
  }, [showProgress])

  return (
    <div
      className={`
        relative w-80 overflow-hidden
        backdrop-blur-xl bg-neutral-900/95
        border ${config.borderColor}
        shadow-[0_10px_40px_rgba(0,0,0,0.4),0_0_20px_rgba(99,102,241,0.1)]
        rounded-xl
        ${className}
      `}
    >
      <div className="p-4 flex gap-3">
        <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${config.iconBg} ${config.iconColor}`}>
          {config.icon}
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <p className="font-semibold text-white text-sm">{title}</p>
          {message && (
            <p className="text-white/60 text-sm mt-0.5">{message}</p>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="shrink-0 p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      {showProgress && (
        <div className="h-1 bg-white/5">
          <div className={`h-full ${config.progressColor} transition-all duration-100`} style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Success Toast
// ============================================================================
export function SuccessToast({ title, message, onDismiss }: Omit<StandaloneToastProps, 'type'>) {
  return <StandaloneToast type="success" title={title} message={message} onDismiss={onDismiss} />
}

// ============================================================================
// Error Toast
// ============================================================================
export function ErrorToast({ title, message, onDismiss }: Omit<StandaloneToastProps, 'type'>) {
  return <StandaloneToast type="error" title={title} message={message} onDismiss={onDismiss} />
}

// ============================================================================
// Warning Toast
// ============================================================================
export function WarningToast({ title, message, onDismiss }: Omit<StandaloneToastProps, 'type'>) {
  return <StandaloneToast type="warning" title={title} message={message} onDismiss={onDismiss} />
}

// ============================================================================
// Info Toast
// ============================================================================
export function InfoToast({ title, message, onDismiss }: Omit<StandaloneToastProps, 'type'>) {
  return <StandaloneToast type="info" title={title} message={message} onDismiss={onDismiss} />
}

// ============================================================================
// Demo Component for Showcase
// ============================================================================
function ToastDemoInner() {
  const { addToast, clearAll } = useToast()
  
  return (
    <div className="flex flex-wrap gap-3 items-center justify-center">
      <button
        onClick={() => addToast({ type: 'success', title: 'Success!', message: 'Your action was completed.' })}
        className="px-4 py-2 rounded-lg font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
      >
        Success
      </button>
      <button
        onClick={() => addToast({ type: 'error', title: 'Error', message: 'Something went wrong.' })}
        className="px-4 py-2 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
      >
        Error
      </button>
      <button
        onClick={() => addToast({ type: 'warning', title: 'Warning', message: 'Please review your input.' })}
        className="px-4 py-2 rounded-lg font-medium text-white bg-amber-600 hover:bg-amber-700 transition-colors"
      >
        Warning
      </button>
      <button
        onClick={() => addToast({ type: 'info', title: 'Info', message: 'Here is some information.' })}
        className="px-4 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
      >
        Info
      </button>
      <button
        onClick={clearAll}
        className="px-4 py-2 rounded-lg font-medium text-white/70 bg-white/10 hover:bg-white/20 transition-colors"
      >
        Clear All
      </button>
    </div>
  )
}

export function ToastsDemo() {
  return (
    <ToastProvider position="top-right">
      <ToastDemoInner />
    </ToastProvider>
  )
}

// Static showcase without provider
export function ToastsShowcase() {
  return (
    <div className="flex flex-col gap-4 items-center">
      <StandaloneToast type="success" title="Success!" message="Your changes have been saved." showProgress={false} />
      <StandaloneToast type="error" title="Error" message="Failed to save changes." showProgress={false} />
      <StandaloneToast type="warning" title="Warning" message="Your session will expire soon." showProgress={false} />
      <StandaloneToast type="info" title="Info" message="New features are available." showProgress={false} />
    </div>
  )
}

// Export all
export const Toasts = {
  ToastProvider,
  useToast,
  StandaloneToast,
  SuccessToast,
  ErrorToast,
  WarningToast,
  InfoToast,
  ToastsDemo,
  ToastsShowcase,
}
