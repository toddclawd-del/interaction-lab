import { useState, useEffect, createContext, useContext, useCallback } from 'react'
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
interface AccordionItem {
  id: string
  title: string
  content: React.ReactNode
  icon?: React.ReactNode
  disabled?: boolean
}

type AccordionVariant = 'default' | 'bordered' | 'separated' | 'ghost'

// Context for accordion group
interface AccordionContextValue {
  expandedIds: string[]
  toggleItem: (id: string) => void
  allowMultiple: boolean
  variant: AccordionVariant
}

const AccordionContext = createContext<AccordionContextValue | null>(null)

// ============================================================================
// Accordion Item Component
// ============================================================================
interface AccordionItemProps {
  item: AccordionItem
  isFirst?: boolean
  isLast?: boolean
}

function AccordionItemComponent({ item, isFirst, isLast }: AccordionItemProps) {
  const context = useContext(AccordionContext)
  const prefersReducedMotion = useReducedMotion()
  
  if (!context) {
    throw new Error('AccordionItem must be used within an Accordion')
  }

  const { expandedIds, toggleItem, variant } = context
  const isExpanded = expandedIds.includes(item.id)

  const variantStyles = {
    default: `
      border-b border-white/10
      ${isFirst ? 'rounded-t-xl' : ''}
      ${isLast && !isExpanded ? 'rounded-b-xl border-b-0' : ''}
    `,
    bordered: `
      border border-white/10
      ${isFirst ? 'rounded-t-xl' : 'border-t-0'}
      ${isLast ? 'rounded-b-xl' : ''}
    `,
    separated: `
      border border-white/10 rounded-xl mb-3 last:mb-0
    `,
    ghost: `
      ${!isLast ? 'border-b border-white/5' : ''}
    `,
  }

  const headerStyles = {
    default: 'hover:bg-white/5',
    bordered: 'hover:bg-white/5',
    separated: 'hover:bg-white/5',
    ghost: 'hover:bg-white/5',
  }

  return (
    <div className={variantStyles[variant]}>
      {/* Header */}
      <button
        onClick={() => !item.disabled && toggleItem(item.id)}
        disabled={item.disabled}
        className={`
          w-full px-6 py-4 flex items-center justify-between gap-4
          text-left transition-colors duration-200
          ${headerStyles[variant]}
          ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${variant === 'separated' ? (isExpanded ? 'rounded-t-xl' : 'rounded-xl') : ''}
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50 focus-visible:ring-inset
        `}
        aria-expanded={isExpanded}
        aria-controls={`accordion-content-${item.id}`}
      >
        <div className="flex items-center gap-3 min-w-0">
          {item.icon && (
            <span className="shrink-0 text-white/60">{item.icon}</span>
          )}
          <span className={`font-medium truncate ${isExpanded ? 'text-white' : 'text-white/80'}`}>
            {item.title}
          </span>
        </div>
        
        {/* Chevron */}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
          className="shrink-0"
        >
          <svg 
            className={`w-5 h-5 transition-colors ${isExpanded ? 'text-[var(--color-primary)]' : 'text-white/40'}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id={`accordion-content-${item.id}`}
            initial={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-4 pt-0 text-white/60">
              {item.content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// 1. Basic Accordion
// ============================================================================
interface AccordionProps {
  items: AccordionItem[]
  defaultExpanded?: string[]
  allowMultiple?: boolean
  variant?: AccordionVariant
  className?: string
  onChange?: (expandedIds: string[]) => void
}

export function Accordion({
  items,
  defaultExpanded = [],
  allowMultiple = false,
  variant = 'default',
  className = '',
  onChange,
}: AccordionProps) {
  const [expandedIds, setExpandedIds] = useState<string[]>(defaultExpanded)

  const toggleItem = useCallback((id: string) => {
    setExpandedIds(prev => {
      let next: string[]
      if (prev.includes(id)) {
        next = prev.filter(i => i !== id)
      } else {
        next = allowMultiple ? [...prev, id] : [id]
      }
      onChange?.(next)
      return next
    })
  }, [allowMultiple, onChange])

  const containerStyles = {
    default: 'bg-neutral-900/50 border border-white/10 rounded-xl overflow-hidden',
    bordered: 'bg-neutral-900/50 overflow-hidden',
    separated: '',
    ghost: 'bg-transparent',
  }

  return (
    <AccordionContext.Provider value={{ expandedIds, toggleItem, allowMultiple, variant }}>
      <div className={`${containerStyles[variant]} ${className}`}>
        {items.map((item, index) => (
          <AccordionItemComponent
            key={item.id}
            item={item}
            isFirst={index === 0}
            isLast={index === items.length - 1}
          />
        ))}
      </div>
    </AccordionContext.Provider>
  )
}

// ============================================================================
// 2. Nested Accordion
// ============================================================================
interface NestedAccordionItem extends AccordionItem {
  children?: NestedAccordionItem[]
}

interface NestedAccordionProps {
  items: NestedAccordionItem[]
  defaultExpanded?: string[]
  className?: string
  level?: number
}

export function NestedAccordion({
  items,
  defaultExpanded = [],
  className = '',
  level = 0,
}: NestedAccordionProps) {
  const [expandedIds, setExpandedIds] = useState<string[]>(defaultExpanded)
  const prefersReducedMotion = useReducedMotion()

  const toggleItem = (id: string) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  return (
    <div className={`${level === 0 ? 'bg-neutral-900/50 border border-white/10 rounded-xl overflow-hidden' : ''} ${className}`}>
      {items.map((item, index) => {
        const isExpanded = expandedIds.includes(item.id)
        const hasChildren = item.children && item.children.length > 0
        const isLast = index === items.length - 1

        return (
          <div 
            key={item.id}
            className={`${!isLast ? 'border-b border-white/10' : ''}`}
          >
            <button
              onClick={() => !item.disabled && toggleItem(item.id)}
              disabled={item.disabled}
              className={`
                w-full px-6 py-4 flex items-center justify-between gap-4
                text-left transition-colors duration-200 hover:bg-white/5
                ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50 focus-visible:ring-inset
              `}
              style={{ paddingLeft: `${24 + level * 20}px` }}
            >
              <div className="flex items-center gap-3 min-w-0">
                {hasChildren && (
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                    className="shrink-0"
                  >
                    <svg 
                      className="w-4 h-4 text-white/40"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                )}
                {item.icon && (
                  <span className="shrink-0 text-white/60">{item.icon}</span>
                )}
                <span className={`font-medium truncate ${isExpanded ? 'text-white' : 'text-white/80'}`}>
                  {item.title}
                </span>
              </div>
              
              {!hasChildren && (
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                  className="shrink-0"
                >
                  <svg 
                    className={`w-5 h-5 transition-colors ${isExpanded ? 'text-[var(--color-primary)]' : 'text-white/40'}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              )}
            </button>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  animate={prefersReducedMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  {hasChildren ? (
                    <NestedAccordion
                      items={item.children!}
                      level={level + 1}
                    />
                  ) : (
                    <div 
                      className="pb-4 pt-0 text-white/60"
                      style={{ paddingLeft: `${24 + level * 20}px`, paddingRight: '24px' }}
                    >
                      {item.content}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

// ============================================================================
// 3. Controlled Accordion - for external state management
// ============================================================================
interface ControlledAccordionProps extends Omit<AccordionProps, 'defaultExpanded' | 'onChange'> {
  expandedIds: string[]
  onExpandedChange: (ids: string[]) => void
}

export function ControlledAccordion({
  items,
  expandedIds,
  onExpandedChange,
  allowMultiple = false,
  variant = 'default',
  className = '',
}: ControlledAccordionProps) {
  const toggleItem = useCallback((id: string) => {
    if (expandedIds.includes(id)) {
      onExpandedChange(expandedIds.filter(i => i !== id))
    } else {
      onExpandedChange(allowMultiple ? [...expandedIds, id] : [id])
    }
  }, [expandedIds, allowMultiple, onExpandedChange])

  const containerStyles = {
    default: 'bg-neutral-900/50 border border-white/10 rounded-xl overflow-hidden',
    bordered: 'bg-neutral-900/50 overflow-hidden',
    separated: '',
    ghost: 'bg-transparent',
  }

  return (
    <AccordionContext.Provider value={{ expandedIds, toggleItem, allowMultiple, variant }}>
      <div className={`${containerStyles[variant]} ${className}`}>
        {items.map((item, index) => (
          <AccordionItemComponent
            key={item.id}
            item={item}
            isFirst={index === 0}
            isLast={index === items.length - 1}
          />
        ))}
      </div>
    </AccordionContext.Provider>
  )
}

// ============================================================================
// 4. FAQ Accordion - Styled for FAQ sections
// ============================================================================
interface FAQItem {
  question: string
  answer: React.ReactNode
}

interface FAQAccordionProps {
  items: FAQItem[]
  allowMultiple?: boolean
  className?: string
}

export function FAQAccordion({
  items,
  allowMultiple = false,
  className = '',
}: FAQAccordionProps) {
  const [expandedIds, setExpandedIds] = useState<string[]>([])
  const prefersReducedMotion = useReducedMotion()

  const toggleItem = (index: number) => {
    const id = `faq-${index}`
    setExpandedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id)
      } else {
        return allowMultiple ? [...prev, id] : [id]
      }
    })
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item, index) => {
        const id = `faq-${index}`
        const isExpanded = expandedIds.includes(id)

        return (
          <motion.div
            key={index}
            initial={false}
            className={`
              rounded-2xl overflow-hidden
              backdrop-blur-xl bg-neutral-900/80 border border-white/10
              shadow-[0_4px_20px_rgba(0,0,0,0.3)]
              ${isExpanded ? 'ring-2 ring-[var(--color-primary)]/30' : ''}
            `}
          >
            <button
              onClick={() => toggleItem(index)}
              className="
                w-full px-6 py-5 flex items-start justify-between gap-4
                text-left transition-colors duration-200 hover:bg-white/5
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50 focus-visible:ring-inset
              "
            >
              <span className={`font-semibold ${isExpanded ? 'text-white' : 'text-white/90'}`}>
                {item.question}
              </span>
              
              <motion.div
                animate={{ rotate: isExpanded ? 45 : 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                className={`
                  shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                  transition-colors duration-200
                  ${isExpanded 
                    ? 'bg-[var(--color-primary)] text-white' 
                    : 'bg-white/10 text-white/60'
                  }
                `}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  animate={prefersReducedMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-5 pt-0 text-white/60 leading-relaxed">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}

// ============================================================================
// Demo Component for Showcase
// ============================================================================
export function AccordionsDemo() {
  const [variant, setVariant] = useState<AccordionVariant>('default')

  const basicItems: AccordionItem[] = [
    {
      id: '1',
      title: 'What is React?',
      icon: '⚛️',
      content: 'React is a JavaScript library for building user interfaces. It was developed by Facebook and is maintained by a community of developers.',
    },
    {
      id: '2',
      title: 'Why use TypeScript?',
      icon: '📘',
      content: 'TypeScript adds static typing to JavaScript, helping catch errors early in development and improving code maintainability and IDE support.',
    },
    {
      id: '3',
      title: 'What is Framer Motion?',
      icon: '🎬',
      content: 'Framer Motion is a production-ready motion library for React that makes it easy to create animations and gestures.',
    },
    {
      id: '4',
      title: 'How does Tailwind CSS work?',
      icon: '🎨',
      disabled: true,
      content: 'Tailwind CSS is a utility-first CSS framework that provides low-level utility classes to build custom designs without writing CSS.',
    },
  ]

  const nestedItems: NestedAccordionItem[] = [
    {
      id: 'frontend',
      title: 'Frontend',
      icon: '🖥️',
      content: null,
      children: [
        {
          id: 'react',
          title: 'React',
          content: 'A JavaScript library for building user interfaces with component-based architecture.',
        },
        {
          id: 'vue',
          title: 'Vue',
          content: 'A progressive JavaScript framework for building user interfaces.',
        },
      ],
    },
    {
      id: 'backend',
      title: 'Backend',
      icon: '⚙️',
      content: null,
      children: [
        {
          id: 'node',
          title: 'Node.js',
          content: 'A JavaScript runtime built on Chrome\'s V8 JavaScript engine.',
        },
        {
          id: 'python',
          title: 'Python',
          content: 'A versatile programming language known for its simplicity and readability.',
        },
      ],
    },
  ]

  const faqItems: FAQItem[] = [
    {
      question: 'How do I get started?',
      answer: 'Getting started is easy! Simply sign up for an account, complete the onboarding process, and you\'ll be ready to go in minutes.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise accounts.',
    },
    {
      question: 'Can I cancel my subscription?',
      answer: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.',
    },
  ]

  return (
    <div className="space-y-10 max-w-xl mx-auto">
      {/* Variant selector */}
      <div className="flex flex-wrap gap-2 justify-center">
        {(['default', 'bordered', 'separated', 'ghost'] as AccordionVariant[]).map((v) => (
          <button
            key={v}
            onClick={() => setVariant(v)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors
              ${variant === v 
                ? 'bg-[var(--color-primary)] text-white' 
                : 'bg-white/10 text-white/70 hover:bg-white/20'
              }
            `}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Basic Accordion */}
      <div>
        <p className="text-sm text-white/50 mb-3 font-medium">Basic Accordion (Single Expand)</p>
        <Accordion items={basicItems} variant={variant} />
      </div>

      {/* Multi-expand Accordion */}
      <div>
        <p className="text-sm text-white/50 mb-3 font-medium">Multi-expand Accordion</p>
        <Accordion items={basicItems.slice(0, 3)} variant={variant} allowMultiple defaultExpanded={['1']} />
      </div>

      {/* Nested Accordion */}
      <div>
        <p className="text-sm text-white/50 mb-3 font-medium">Nested Accordion</p>
        <NestedAccordion items={nestedItems} />
      </div>

      {/* FAQ Accordion */}
      <div>
        <p className="text-sm text-white/50 mb-3 font-medium">FAQ Style</p>
        <FAQAccordion items={faqItems} />
      </div>
    </div>
  )
}

// Export all
export const Accordions = {
  Accordion,
  NestedAccordion,
  ControlledAccordion,
  FAQAccordion,
  AccordionsDemo,
}
