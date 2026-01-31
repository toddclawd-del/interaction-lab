import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
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

// Types
interface SelectOption {
  value: string
  label: string
  disabled?: boolean
  icon?: React.ReactNode
}

interface OptionGroup {
  label: string
  options: SelectOption[]
}

// ============================================================================
// 1. BasicSelect - Animated custom select
// ============================================================================
interface BasicSelectProps {
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function BasicSelect({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  className = '',
}: BasicSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const selectedOption = options.find(opt => opt.value === value)

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        } else if (highlightedIndex >= 0) {
          const opt = options[highlightedIndex]
          if (!opt.disabled) {
            onChange?.(opt.value)
            setIsOpen(false)
          }
        }
        break
      case 'ArrowDown':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        } else {
          setHighlightedIndex(prev => {
            const next = prev < options.length - 1 ? prev + 1 : 0
            return options[next]?.disabled ? (next < options.length - 1 ? next + 1 : 0) : next
          })
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (isOpen) {
          setHighlightedIndex(prev => {
            const next = prev > 0 ? prev - 1 : options.length - 1
            return options[next]?.disabled ? (next > 0 ? next - 1 : options.length - 1) : next
          })
        }
        break
      case 'Escape':
        setIsOpen(false)
        break
    }
  }, [disabled, isOpen, highlightedIndex, options, onChange])

  // Scroll highlighted option into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement
      item?.scrollIntoView({ block: 'nearest' })
    }
  }, [highlightedIndex, isOpen])

  return (
    <div ref={containerRef} className={`relative min-w-[200px] ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`
          w-full px-4 py-3 rounded-xl font-medium text-left
          backdrop-blur-xl bg-neutral-900/80 border border-white/10
          shadow-[0_4px_20px_rgba(0,0,0,0.3)]
          transition-all duration-200
          flex items-center justify-between gap-3
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-800/80 hover:border-white/20 cursor-pointer'}
          ${isOpen ? 'ring-2 ring-[var(--color-primary)]/50 border-[var(--color-primary)]/50' : ''}
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={selectedOption ? 'text-white' : 'text-white/50'}>
          {selectedOption ? (
            <span className="flex items-center gap-2">
              {selectedOption.icon}
              {selectedOption.label}
            </span>
          ) : placeholder}
        </span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
          className="w-4 h-4 text-white/50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            ref={listRef}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.95 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="
              absolute z-50 w-full mt-2 py-2
              backdrop-blur-xl bg-neutral-900/95 border border-white/10
              shadow-[0_10px_40px_rgba(0,0,0,0.5)]
              rounded-xl overflow-hidden max-h-60 overflow-y-auto
            "
            role="listbox"
          >
            {options.map((option, index) => (
              <motion.li
                key={option.value}
                initial={prefersReducedMotion ? {} : { opacity: 0, x: -10 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => {
                  if (!option.disabled) {
                    onChange?.(option.value)
                    setIsOpen(false)
                  }
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`
                  px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors
                  ${option.disabled ? 'opacity-40 cursor-not-allowed' : ''}
                  ${highlightedIndex === index ? 'bg-white/10' : ''}
                  ${option.value === value ? 'text-[var(--color-primary)]' : 'text-white/80'}
                `}
                role="option"
                aria-selected={option.value === value}
                aria-disabled={option.disabled}
              >
                {option.icon && <span className="shrink-0">{option.icon}</span>}
                <span className="flex-1">{option.label}</span>
                {option.value === value && (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-4 h-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </motion.svg>
                )}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// 2. SearchableSelect - With search/filter functionality
// ============================================================================
interface SearchableSelectProps extends Omit<BasicSelectProps, 'options'> {
  options: SelectOption[]
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Search...',
  disabled = false,
  className = '',
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const selectedOption = options.find(opt => opt.value === value)
  
  const filteredOptions = useMemo(() => 
    options.filter(opt => 
      opt.label.toLowerCase().includes(search.toLowerCase())
    ),
    [options, search]
  )

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Reset highlight when search changes
  useEffect(() => {
    setHighlightedIndex(filteredOptions.length > 0 ? 0 : -1)
  }, [search, filteredOptions.length])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return

    switch (e.key) {
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          const opt = filteredOptions[highlightedIndex]
          if (!opt.disabled) {
            onChange?.(opt.value)
            setIsOpen(false)
            setSearch('')
          }
        }
        break
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        )
        break
      case 'Escape':
        setIsOpen(false)
        setSearch('')
        break
    }
  }

  // Scroll highlighted into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement
      item?.scrollIntoView({ block: 'nearest' })
    }
  }, [highlightedIndex, isOpen])

  return (
    <div ref={containerRef} className={`relative min-w-[200px] ${className}`}>
      <div
        onClick={() => !disabled && setIsOpen(true)}
        className={`
          w-full px-4 py-3 rounded-xl
          backdrop-blur-xl bg-neutral-900/80 border border-white/10
          shadow-[0_4px_20px_rgba(0,0,0,0.3)]
          transition-all duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-800/80 cursor-pointer'}
          ${isOpen ? 'ring-2 ring-[var(--color-primary)]/50 border-[var(--color-primary)]/50' : ''}
        `}
      >
        {isOpen ? (
          <div className="flex items-center gap-3">
            <svg className="w-4 h-4 text-white/50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="flex-1 bg-transparent text-white outline-none placeholder-white/50"
            />
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <span className={selectedOption ? 'text-white' : 'text-white/50'}>
              {selectedOption?.label || placeholder}
            </span>
            <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            ref={listRef}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="
              absolute z-50 w-full mt-2 py-2
              backdrop-blur-xl bg-neutral-900/95 border border-white/10
              shadow-[0_10px_40px_rgba(0,0,0,0.5)]
              rounded-xl overflow-hidden max-h-60 overflow-y-auto
            "
            role="listbox"
          >
            {filteredOptions.length === 0 ? (
              <li className="px-4 py-3 text-white/50 text-center">No options found</li>
            ) : (
              filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  onClick={() => {
                    if (!option.disabled) {
                      onChange?.(option.value)
                      setIsOpen(false)
                      setSearch('')
                    }
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`
                    px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors
                    ${option.disabled ? 'opacity-40 cursor-not-allowed' : ''}
                    ${highlightedIndex === index ? 'bg-white/10' : ''}
                    ${option.value === value ? 'text-[var(--color-primary)]' : 'text-white/80'}
                  `}
                  role="option"
                  aria-selected={option.value === value}
                >
                  {option.icon && <span className="shrink-0">{option.icon}</span>}
                  <span className="flex-1">{option.label}</span>
                  {option.value === value && (
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </li>
              ))
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// 3. MultiSelect - Multiple selection with chips
// ============================================================================
interface MultiSelectProps {
  options: SelectOption[]
  value: string[]
  onChange?: (value: string[]) => void
  placeholder?: string
  disabled?: boolean
  maxSelections?: number
  className?: string
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = 'Select options',
  disabled = false,
  maxSelections,
  className = '',
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const selectedOptions = options.filter(opt => value.includes(opt.value))
  const canSelectMore = !maxSelections || value.length < maxSelections

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleOption = (optValue: string) => {
    if (value.includes(optValue)) {
      onChange?.(value.filter(v => v !== optValue))
    } else if (canSelectMore) {
      onChange?.([...value, optValue])
    }
  }

  const removeOption = (optValue: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange?.(value.filter(v => v !== optValue))
  }

  return (
    <div ref={containerRef} className={`relative min-w-[250px] ${className}`}>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          w-full px-3 py-2 rounded-xl min-h-[48px]
          backdrop-blur-xl bg-neutral-900/80 border border-white/10
          shadow-[0_4px_20px_rgba(0,0,0,0.3)]
          transition-all duration-200
          flex flex-wrap items-center gap-2
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-800/80 cursor-pointer'}
          ${isOpen ? 'ring-2 ring-[var(--color-primary)]/50 border-[var(--color-primary)]/50' : ''}
        `}
      >
        {selectedOptions.length === 0 ? (
          <span className="text-white/50 px-1">{placeholder}</span>
        ) : (
          <AnimatePresence mode="popLayout">
            {selectedOptions.map((opt) => (
              <motion.span
                key={opt.value}
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                layout
                className="
                  inline-flex items-center gap-1.5 px-3 py-1 rounded-lg
                  bg-[var(--color-primary)]/20 text-[var(--color-primary)]
                  text-sm font-medium
                "
              >
                {opt.icon && <span className="text-xs">{opt.icon}</span>}
                {opt.label}
                <button
                  onClick={(e) => removeOption(opt.value, e)}
                  className="p-0.5 rounded hover:bg-white/20 transition-colors"
                  aria-label={`Remove ${opt.label}`}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
        )}
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
          className="w-4 h-4 text-white/50 ml-auto shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="
              absolute z-50 w-full mt-2 py-2
              backdrop-blur-xl bg-neutral-900/95 border border-white/10
              shadow-[0_10px_40px_rgba(0,0,0,0.5)]
              rounded-xl overflow-hidden max-h-60 overflow-y-auto
            "
          >
            {options.map((option) => {
              const isSelected = value.includes(option.value)
              const isDisabled = option.disabled || (!isSelected && !canSelectMore)
              
              return (
                <li
                  key={option.value}
                  onClick={() => !isDisabled && toggleOption(option.value)}
                  className={`
                    px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors
                    ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/10'}
                    ${isSelected ? 'text-[var(--color-primary)]' : 'text-white/80'}
                  `}
                >
                  <span className={`
                    w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors
                    ${isSelected 
                      ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' 
                      : 'border-white/30'
                    }
                  `}>
                    {isSelected && (
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </motion.svg>
                    )}
                  </span>
                  {option.icon && <span className="shrink-0">{option.icon}</span>}
                  <span className="flex-1">{option.label}</span>
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// 4. GroupedSelect - Options organized in groups
// ============================================================================
interface GroupedSelectProps {
  groups: OptionGroup[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function GroupedSelect({
  groups,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  className = '',
}: GroupedSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const allOptions = groups.flatMap(g => g.options)
  const selectedOption = allOptions.find(opt => opt.value === value)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className={`relative min-w-[200px] ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-4 py-3 rounded-xl font-medium text-left
          backdrop-blur-xl bg-neutral-900/80 border border-white/10
          shadow-[0_4px_20px_rgba(0,0,0,0.3)]
          transition-all duration-200
          flex items-center justify-between gap-3
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-800/80 cursor-pointer'}
          ${isOpen ? 'ring-2 ring-[var(--color-primary)]/50 border-[var(--color-primary)]/50' : ''}
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50
        `}
      >
        <span className={selectedOption ? 'text-white' : 'text-white/50'}>
          {selectedOption?.label || placeholder}
        </span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
          className="w-4 h-4 text-white/50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="
              absolute z-50 w-full mt-2 py-2
              backdrop-blur-xl bg-neutral-900/95 border border-white/10
              shadow-[0_10px_40px_rgba(0,0,0,0.5)]
              rounded-xl overflow-hidden max-h-72 overflow-y-auto
            "
          >
            {groups.map((group, groupIndex) => (
              <div key={group.label}>
                {groupIndex > 0 && <div className="my-2 border-t border-white/10" />}
                <div className="px-4 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider">
                  {group.label}
                </div>
                <ul>
                  {group.options.map((option) => (
                    <li
                      key={option.value}
                      onClick={() => {
                        if (!option.disabled) {
                          onChange?.(option.value)
                          setIsOpen(false)
                        }
                      }}
                      className={`
                        px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors
                        ${option.disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/10'}
                        ${option.value === value ? 'text-[var(--color-primary)]' : 'text-white/80'}
                      `}
                    >
                      {option.icon && <span className="shrink-0">{option.icon}</span>}
                      <span className="flex-1">{option.label}</span>
                      {option.value === value && (
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// Demo Component for Showcase
// ============================================================================
export function SelectsDemo() {
  const [basicValue, setBasicValue] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [multiValue, setMultiValue] = useState<string[]>(['react'])
  const [groupedValue, setGroupedValue] = useState('')

  const basicOptions: SelectOption[] = [
    { value: 'react', label: 'React', icon: '⚛️' },
    { value: 'vue', label: 'Vue', icon: '💚' },
    { value: 'angular', label: 'Angular', icon: '🅰️' },
    { value: 'svelte', label: 'Svelte', icon: '🔥' },
    { value: 'solid', label: 'Solid', icon: '💠' },
  ]

  const groupedOptions: OptionGroup[] = [
    {
      label: 'Frontend',
      options: [
        { value: 'react', label: 'React' },
        { value: 'vue', label: 'Vue' },
        { value: 'angular', label: 'Angular' },
      ],
    },
    {
      label: 'Backend',
      options: [
        { value: 'node', label: 'Node.js' },
        { value: 'python', label: 'Python' },
        { value: 'go', label: 'Go' },
      ],
    },
    {
      label: 'Database',
      options: [
        { value: 'postgres', label: 'PostgreSQL' },
        { value: 'mongodb', label: 'MongoDB' },
        { value: 'redis', label: 'Redis' },
      ],
    },
  ]

  return (
    <div className="flex flex-col gap-8 items-center">
      <div className="w-full max-w-xs space-y-6">
        <div>
          <p className="text-sm text-white/50 mb-2">Basic Select</p>
          <BasicSelect
            options={basicOptions}
            value={basicValue}
            onChange={setBasicValue}
            placeholder="Choose framework"
          />
        </div>
        
        <div>
          <p className="text-sm text-white/50 mb-2">Searchable Select</p>
          <SearchableSelect
            options={basicOptions}
            value={searchValue}
            onChange={setSearchValue}
            placeholder="Search frameworks..."
          />
        </div>
        
        <div>
          <p className="text-sm text-white/50 mb-2">Multi Select</p>
          <MultiSelect
            options={basicOptions}
            value={multiValue}
            onChange={setMultiValue}
            placeholder="Select frameworks"
            maxSelections={3}
          />
        </div>
        
        <div>
          <p className="text-sm text-white/50 mb-2">Grouped Select</p>
          <GroupedSelect
            groups={groupedOptions}
            value={groupedValue}
            onChange={setGroupedValue}
            placeholder="Choose technology"
          />
        </div>
      </div>
    </div>
  )
}

// Export all
export const Selects = {
  BasicSelect,
  SearchableSelect,
  MultiSelect,
  GroupedSelect,
  SelectsDemo,
}
