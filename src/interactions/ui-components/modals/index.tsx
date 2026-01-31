import { useState, useEffect, useCallback } from 'react'
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

// Lock body scroll when modal is open
function useBodyScrollLock(isOpen: boolean) {
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalStyle
      }
    }
  }, [isOpen])
}

// Close on escape key
function useEscapeKey(onClose: () => void, isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])
}

// Shared types
type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

interface BaseModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  size?: ModalSize
  className?: string
  showCloseButton?: boolean
  closeOnBackdropClick?: boolean
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
  full: 'max-w-[90vw] max-h-[90vh]',
}

// Premium backdrop styles
const backdropStyles = `
  fixed inset-0 z-50
  bg-black/60 backdrop-blur-sm
  flex items-center justify-center
  p-4
`

// Premium modal panel styles
const modalPanelStyles = `
  relative w-full
  backdrop-blur-xl bg-neutral-900/95
  border border-white/10
  shadow-[0_25px_80px_rgba(0,0,0,0.6),0_0_60px_rgba(99,102,241,0.15)]
  rounded-2xl overflow-hidden
`

// ============================================================================
// 1. BasicModal - Scale-in with backdrop blur
// ============================================================================
export function BasicModal({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  className = '',
  showCloseButton = true,
  closeOnBackdropClick = true,
}: BaseModalProps) {
  const prefersReducedMotion = useReducedMotion()
  useBodyScrollLock(isOpen)
  useEscapeKey(onClose, isOpen)

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose()
    }
  }, [closeOnBackdropClick, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
          className={backdropStyles}
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
        >
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`${modalPanelStyles} ${sizeClasses[size]} ${className}`}
          >
            {/* Glow effect */}
            <span 
              className="absolute inset-0 -z-10 blur-3xl opacity-20 pointer-events-none"
              style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}
            />
            
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                {title && (
                  <h2 id="modal-title" className="text-lg font-semibold text-white">
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                    aria-label="Close modal"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            )}
            
            {/* Content */}
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ============================================================================
// 2. ConfirmationDialog - With cancel/confirm buttons
// ============================================================================
interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'danger'
  isLoading?: boolean
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  isLoading = false,
}: ConfirmationDialogProps) {
  const prefersReducedMotion = useReducedMotion()
  useBodyScrollLock(isOpen)
  useEscapeKey(onClose, isOpen)

  const confirmButtonColor = variant === 'danger' 
    ? 'bg-red-500 hover:bg-red-600' 
    : 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]'

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
          className={backdropStyles}
          onClick={(e) => e.target === e.currentTarget && onClose()}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          aria-describedby="confirm-message"
        >
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`${modalPanelStyles} max-w-sm text-center`}
          >
            {/* Icon */}
            <div className="pt-8 pb-4 flex justify-center">
              <motion.div
                initial={prefersReducedMotion ? {} : { scale: 0 }}
                animate={prefersReducedMotion ? {} : { scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 20 }}
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  variant === 'danger' ? 'bg-red-500/20' : 'bg-white/10'
                }`}
              >
                {variant === 'danger' ? (
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-primary)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </motion.div>
            </div>
            
            {/* Content */}
            <div className="px-6 pb-4">
              <h2 id="confirm-title" className="text-xl font-semibold text-white mb-2">
                {title}
              </h2>
              <p id="confirm-message" className="text-white/60">
                {message}
              </p>
            </div>
            
            {/* Actions */}
            <div className="flex gap-3 p-6 pt-2">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-6 py-3 rounded-xl font-medium text-white/80 bg-white/10 hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`flex-1 px-6 py-3 rounded-xl font-medium text-white ${confirmButtonColor} transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 relative overflow-hidden`}
              >
                {isLoading ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ============================================================================
// 3. SlideDrawer - Slides in from right
// ============================================================================
interface SlideDrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  position?: 'left' | 'right'
}

const drawerSizeClasses: Record<string, string> = {
  sm: 'w-80',
  md: 'w-96',
  lg: 'w-[480px]',
  xl: 'w-[600px]',
}

export function SlideDrawer({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  position = 'right',
}: SlideDrawerProps) {
  const prefersReducedMotion = useReducedMotion()
  useBodyScrollLock(isOpen)
  useEscapeKey(onClose, isOpen)

  const slideFrom = position === 'right' ? { x: '100%' } : { x: '-100%' }
  const positionClass = position === 'right' ? 'right-0' : 'left-0'

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : slideFrom}
            animate={prefersReducedMotion ? { opacity: 1 } : { x: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : slideFrom}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className={`fixed top-0 ${positionClass} z-50 h-full ${drawerSizeClasses[size]} max-w-[90vw]`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'drawer-title' : undefined}
          >
            <div className="h-full backdrop-blur-xl bg-neutral-900/95 border-l border-white/10 shadow-[-20px_0_60px_rgba(0,0,0,0.5)] flex flex-col">
              {/* Glow effect */}
              <span 
                className="absolute inset-0 -z-10 blur-3xl opacity-10 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}
              />
              
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
                {title && (
                  <h2 id="drawer-title" className="text-lg font-semibold text-white">
                    {title}
                  </h2>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ml-auto"
                  aria-label="Close drawer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ============================================================================
// 4. AlertModal - Attention-grabbing alert with shake animation
// ============================================================================
interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  buttonText?: string
}

const alertTypeConfig = {
  success: {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    color: 'bg-emerald-500/20 text-emerald-400',
    buttonColor: 'bg-emerald-500 hover:bg-emerald-600',
  },
  error: {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    color: 'bg-red-500/20 text-red-400',
    buttonColor: 'bg-red-500 hover:bg-red-600',
  },
  warning: {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    color: 'bg-amber-500/20 text-amber-400',
    buttonColor: 'bg-amber-500 hover:bg-amber-600',
  },
  info: {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'bg-blue-500/20 text-blue-400',
    buttonColor: 'bg-blue-500 hover:bg-blue-600',
  },
}

export function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  buttonText = 'OK',
}: AlertModalProps) {
  const prefersReducedMotion = useReducedMotion()
  const config = alertTypeConfig[type]
  useBodyScrollLock(isOpen)
  useEscapeKey(onClose, isOpen)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
          className={backdropStyles}
          onClick={(e) => e.target === e.currentTarget && onClose()}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="alert-title"
          aria-describedby="alert-message"
        >
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: -20 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`${modalPanelStyles} max-w-sm text-center`}
          >
            {/* Icon */}
            <div className="pt-8 pb-4 flex justify-center">
              <motion.div
                initial={prefersReducedMotion ? {} : { scale: 0, rotate: -180 }}
                animate={prefersReducedMotion ? {} : { scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 15 }}
                className={`w-16 h-16 rounded-full flex items-center justify-center ${config.color}`}
              >
                {config.icon}
              </motion.div>
            </div>
            
            {/* Content */}
            <div className="px-6 pb-4">
              <h2 id="alert-title" className="text-xl font-semibold text-white mb-2">
                {title}
              </h2>
              <p id="alert-message" className="text-white/60">
                {message}
              </p>
            </div>
            
            {/* Action */}
            <div className="p-6 pt-2">
              <button
                onClick={onClose}
                className={`w-full px-6 py-3 rounded-xl font-medium text-white ${config.buttonColor} transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50`}
              >
                {buttonText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ============================================================================
// 5. FullScreenModal - Full viewport modal with slide animation
// ============================================================================
interface FullScreenModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export function FullScreenModal({
  isOpen,
  onClose,
  children,
  title,
}: FullScreenModalProps) {
  const prefersReducedMotion = useReducedMotion()
  useBodyScrollLock(isOpen)
  useEscapeKey(onClose, isOpen)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: '100%' }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed inset-0 z-50 bg-neutral-950"
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'fullscreen-title' : undefined}
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                background: [
                  'radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)',
                  'radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)',
                  'radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)',
                ],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0"
            />
          </div>
          
          {/* Header */}
          <div className="relative flex items-center justify-between px-6 py-4 border-b border-white/10">
            {title && (
              <h2 id="fullscreen-title" className="text-xl font-semibold text-white">
                {title}
              </h2>
            )}
            <button
              onClick={onClose}
              className="p-3 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ml-auto"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Content */}
          <div className="relative h-[calc(100vh-73px)] overflow-y-auto p-6">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ============================================================================
// Demo Component for Showcase
// ============================================================================
export function ModalsDemo() {
  const [basicOpen, setBasicOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [fullscreenOpen, setFullscreenOpen] = useState(false)

  return (
    <div className="flex flex-wrap gap-4 items-center justify-center">
      {/* Triggers */}
      <button
        onClick={() => setBasicOpen(true)}
        className="px-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] hover:opacity-90 transition-opacity"
      >
        Basic Modal
      </button>
      
      <button
        onClick={() => setConfirmOpen(true)}
        className="px-6 py-3 rounded-xl font-medium text-white bg-white/10 hover:bg-white/20 transition-colors"
      >
        Confirm Dialog
      </button>
      
      <button
        onClick={() => setDrawerOpen(true)}
        className="px-6 py-3 rounded-xl font-medium text-white bg-white/10 hover:bg-white/20 transition-colors"
      >
        Slide Drawer
      </button>
      
      <button
        onClick={() => setAlertOpen(true)}
        className="px-6 py-3 rounded-xl font-medium text-white bg-white/10 hover:bg-white/20 transition-colors"
      >
        Alert Modal
      </button>
      
      <button
        onClick={() => setFullscreenOpen(true)}
        className="px-6 py-3 rounded-xl font-medium text-white bg-white/10 hover:bg-white/20 transition-colors"
      >
        Fullscreen
      </button>

      {/* Modals */}
      <BasicModal
        isOpen={basicOpen}
        onClose={() => setBasicOpen(false)}
        title="Basic Modal"
        size="md"
      >
        <p className="text-white/70 mb-4">
          This is a basic modal with backdrop blur, scale-in animation, and close button. 
          Press ESC or click outside to close.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setBasicOpen(false)}
            className="px-4 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => setBasicOpen(false)}
            className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]"
          >
            Save Changes
          </button>
        </div>
      </BasicModal>

      <ConfirmationDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => setConfirmOpen(false)}
        title="Delete Item?"
        message="This action cannot be undone. Are you sure you want to delete this item?"
        variant="danger"
        confirmText="Delete"
        cancelText="Keep"
      />

      <SlideDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Settings"
        size="md"
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">Profile</h3>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-white/5 text-white/70">Account Settings</div>
              <div className="p-4 rounded-xl bg-white/5 text-white/70">Privacy</div>
              <div className="p-4 rounded-xl bg-white/5 text-white/70">Notifications</div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">Appearance</h3>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-white/5 text-white/70">Theme</div>
              <div className="p-4 rounded-xl bg-white/5 text-white/70">Display</div>
            </div>
          </div>
        </div>
      </SlideDrawer>

      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        title="Success!"
        message="Your changes have been saved successfully."
        type="success"
      />

      <FullScreenModal
        isOpen={fullscreenOpen}
        onClose={() => setFullscreenOpen(false)}
        title="Full Screen Experience"
      >
        <div className="max-w-2xl mx-auto text-center py-20">
          <h2 className="text-4xl font-bold text-white mb-4">Welcome</h2>
          <p className="text-xl text-white/60 mb-8">
            This is a full-screen modal that slides up from the bottom. 
            Perfect for immersive experiences, wizards, or detailed content.
          </p>
          <button
            onClick={() => setFullscreenOpen(false)}
            className="px-8 py-4 rounded-2xl font-medium text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]"
          >
            Get Started
          </button>
        </div>
      </FullScreenModal>
    </div>
  )
}

// Export all
export const Modals = {
  BasicModal,
  ConfirmationDialog,
  SlideDrawer,
  AlertModal,
  FullScreenModal,
  ModalsDemo,
}
