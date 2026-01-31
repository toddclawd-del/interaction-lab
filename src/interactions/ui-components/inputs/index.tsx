import { useState, useRef, useEffect } from 'react'
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

interface InputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  className?: string
  type?: string
}

// ============================================================================
// 1. FloatingLabel - label floats up on focus
// ============================================================================
export function FloatingLabel({ value, onChange, label = 'Label', className = '', type = 'text' }: InputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const isActive = isFocused || value.length > 0

  return (
    <div className={`relative ${className}`}>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full px-4 pt-6 pb-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus-visible:ring-2 focus-visible:ring-indigo-500/50 transition-colors min-h-[56px]"
        aria-label={label}
      />
      <motion.label
        initial={false}
        animate={prefersReducedMotion ? {} : {
          y: isActive ? -12 : 0,
          scale: isActive ? 0.85 : 1,
          color: isFocused ? '#6366f1' : '#9ca3af',
        }}
        className={`absolute left-4 origin-left pointer-events-none ${prefersReducedMotion ? (isActive ? 'top-2 text-xs text-indigo-500' : 'top-4 text-neutral-400') : 'top-4'}`}
      >
        {label}
      </motion.label>
    </div>
  )
}

// ============================================================================
// 2. UnderlineInput - line expands from center on focus
// ============================================================================
export function UnderlineInput({ value, onChange, placeholder = '', className = '' }: InputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full px-2 py-3 bg-transparent text-white outline-none border-b border-neutral-700 placeholder:text-neutral-600 min-h-[48px] focus-visible:ring-2 focus-visible:ring-indigo-500/50"
        aria-label={placeholder || 'Text input'}
      />
      <motion.div
        className="absolute bottom-0 left-1/2 h-0.5 bg-indigo-500"
        initial={false}
        animate={prefersReducedMotion ? {
          width: isFocused ? '100%' : '0%',
          x: '-50%',
        } : {
          width: isFocused ? '100%' : '0%',
          x: '-50%',
        }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
      />
    </div>
  )
}

// ============================================================================
// 3. BorderInput - border draws around on focus
// ============================================================================
export function BorderInput({ value, onChange, placeholder = '', className = '' }: InputProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        aria-label={placeholder || 'Text input'}
        className="w-full px-4 py-3 bg-neutral-800 text-white outline-none rounded-lg placeholder:text-neutral-600 focus-visible:ring-2 focus-visible:ring-indigo-500/50"
      />
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <motion.rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="8"
          fill="none"
          stroke="#6366f1"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: isFocused ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
      </svg>
    </div>
  )
}

// ============================================================================
// 4. ShakeInput - shakes on invalid
// ============================================================================
interface ShakeInputProps extends InputProps {
  isInvalid?: boolean
  errorMessage?: string
}

export function ShakeInput({ value, onChange, placeholder = '', isInvalid = false, errorMessage = '', className = '' }: ShakeInputProps) {
  return (
    <div className={className}>
      <motion.div
        animate={isInvalid ? { x: [0, -10, 10, -10, 10, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder || 'Text input'}
          aria-invalid={isInvalid}
          className={`w-full px-4 py-3 bg-neutral-800 text-white outline-none rounded-lg border-2 transition-colors placeholder:text-neutral-600 focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${
            isInvalid ? 'border-red-500' : 'border-transparent focus:border-indigo-500'
          }`}
        />
      </motion.div>
      <AnimatePresence>
        {isInvalid && errorMessage && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 text-sm mt-2"
          >
            {errorMessage}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// 5. SuccessInput - checkmark animation on valid
// ============================================================================
interface SuccessInputProps extends InputProps {
  isValid?: boolean
}

export function SuccessInput({ value, onChange, placeholder = '', isValid = false, className = '' }: SuccessInputProps) {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder || 'Text input'}
        className={`w-full px-4 py-3 pr-12 bg-neutral-800 text-white outline-none rounded-lg border-2 transition-colors placeholder:text-neutral-600 focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${
          isValid ? 'border-green-500' : 'border-transparent focus:border-indigo-500'
        }`}
      />
      <AnimatePresence>
        {isValid && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <svg className="w-6 h-6 text-green-500" viewBox="0 0 24 24">
              <motion.path
                d="M5 13l4 4L19 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3 }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// 6. SearchExpand - search icon expands to full input
// ============================================================================
interface SearchExpandProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchExpand({ value, onChange, placeholder = 'Search...', className = '' }: SearchExpandProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExpanded])

  return (
    <div className={`relative ${className}`}>
      <motion.div
        initial={false}
        animate={{ width: isExpanded ? 240 : 40 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="flex items-center bg-neutral-800 rounded-full overflow-hidden h-10"
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? 'Close search' : 'Open search'}
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-white focus-visible:ring-2 focus-visible:ring-indigo-500/50 rounded-full"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <AnimatePresence>
          {isExpanded && (
            <motion.input
              ref={inputRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              type="text"
              value={value}
              onChange={e => onChange(e.target.value)}
              onBlur={() => !value && setIsExpanded(false)}
              placeholder={placeholder}
              aria-label="Search"
              className="flex-1 bg-transparent text-white outline-none pr-4 placeholder:text-neutral-600"
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

// ============================================================================
// 7. TagInput - input with animated tag pills
// ============================================================================
interface TagInputProps {
  tags: string[]
  onTagsChange: (tags: string[]) => void
  placeholder?: string
  className?: string
}

export function TagInput({ tags, onTagsChange, placeholder = 'Add tag...', className = '' }: TagInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      if (!tags.includes(inputValue.trim())) {
        onTagsChange([...tags, inputValue.trim()])
      }
      setInputValue('')
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onTagsChange(tags.slice(0, -1))
    }
  }

  const removeTag = (index: number) => {
    onTagsChange(tags.filter((_, i) => i !== index))
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 p-3 bg-neutral-800 rounded-lg min-h-[52px] ${className}`}>
      <AnimatePresence mode="popLayout">
        {tags.map((tag, index) => (
          <motion.span
            key={tag}
            layout
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="flex items-center gap-1 px-3 py-1 bg-indigo-500 text-white rounded-full text-sm"
          >
            {tag}
            <button onClick={() => removeTag(index)} aria-label={`Remove ${tag}`} className="hover:text-indigo-200 focus-visible:ring-1 focus-visible:ring-white/50 rounded">
              ×
            </button>
          </motion.span>
        ))}
      </AnimatePresence>
      <input
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ''}
        aria-label="Add tag"
        className="flex-1 min-w-[100px] bg-transparent text-white outline-none placeholder:text-neutral-600"
      />
    </div>
  )
}

// ============================================================================
// 8. PasswordStrength - animated strength meter
// ============================================================================
interface PasswordStrengthProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  if (score <= 1) return { score, label: 'Weak', color: '#ef4444' }
  if (score <= 2) return { score, label: 'Fair', color: '#f97316' }
  if (score <= 3) return { score, label: 'Good', color: '#eab308' }
  if (score <= 4) return { score, label: 'Strong', color: '#22c55e' }
  return { score, label: 'Very Strong', color: '#10b981' }
}

export function PasswordStrength({ value, onChange, className = '' }: PasswordStrengthProps) {
  const [showPassword, setShowPassword] = useState(false)
  const strength = getPasswordStrength(value)

  return (
    <div className={className}>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Enter password"
          aria-label="Password"
          className="w-full px-4 py-3 pr-12 bg-neutral-800 text-white outline-none rounded-lg border-2 border-transparent focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/50 placeholder:text-neutral-600"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white focus-visible:ring-2 focus-visible:ring-indigo-500/50 rounded"
        >
          {showPassword ? '🙈' : '👁️'}
        </button>
      </div>
      {value && (
        <div className="mt-3">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <motion.div
                key={i}
                className="h-1.5 flex-1 rounded-full bg-neutral-700 overflow-hidden"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: i <= strength.score ? '100%' : '0%',
                  }}
                  transition={{ duration: 0.3 }}
                  style={{ backgroundColor: strength.color }}
                  className="h-full"
                />
              </motion.div>
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm mt-2"
            style={{ color: strength.color }}
          >
            {strength.label}
          </motion.p>
        </div>
      )}
    </div>
  )
}

// Export all
export const Inputs = {
  FloatingLabel,
  UnderlineInput,
  BorderInput,
  ShakeInput,
  SuccessInput,
  SearchExpand,
  TagInput,
  PasswordStrength,
}
