import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Tab {
  id: string
  label: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  className?: string
  onChange?: (tabId: string) => void
}

// ============================================================================
// 1. SlideTabs - background slides between tabs
// ============================================================================
export function SlideTabs({ tabs, defaultTab, className = '', onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const activeIndex = tabs.findIndex(t => t.id === activeTab)

  const getIndicatorStyle = () => {
    const el = tabRefs.current[activeIndex]
    if (!el) return { left: 0, width: 0 }
    return {
      left: el.offsetLeft,
      width: el.offsetWidth,
    }
  }

  return (
    <div className={className}>
      <div className="relative flex bg-neutral-800 rounded-lg p-1">
        <motion.div
          className="absolute inset-y-1 bg-neutral-700 rounded-md"
          initial={false}
          animate={getIndicatorStyle()}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={el => tabRefs.current[index] = el}
            onClick={() => { setActiveTab(tab.id); onChange?.(tab.id) }}
            className={`relative z-10 px-4 py-2 rounded-md transition-colors ${
              activeTab === tab.id ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabs.find(t => t.id === activeTab)?.content}
      </div>
    </div>
  )
}

// ============================================================================
// 2. FadeTabs - content cross-fades
// ============================================================================
export function FadeTabs({ tabs, defaultTab, className = '', onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  return (
    <div className={className}>
      <div className="flex border-b border-neutral-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); onChange?.(tab.id) }}
            className={`px-4 py-3 transition-colors border-b-2 -mb-[2px] ${
              activeTab === tab.id
                ? 'text-white border-indigo-500'
                : 'text-neutral-400 border-transparent hover:text-neutral-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4 relative">
        <AnimatePresence mode="wait">
          {tabs.map((tab) => (
            tab.id === activeTab && (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {tab.content}
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ============================================================================
// 3. UnderlineTabs - underline animates between
// ============================================================================
export function UnderlineTabs({ tabs, defaultTab, className = '', onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)
  const [hoverTab, setHoverTab] = useState<string | null>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const getUnderlineStyle = () => {
    const targetTab = hoverTab || activeTab
    const index = tabs.findIndex(t => t.id === targetTab)
    const el = tabRefs.current[index]
    if (!el) return { left: 0, width: 0 }
    return {
      left: el.offsetLeft,
      width: el.offsetWidth,
    }
  }

  return (
    <div className={className}>
      <div className="relative flex">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={el => tabRefs.current[index] = el}
            onClick={() => { setActiveTab(tab.id); onChange?.(tab.id) }}
            onMouseEnter={() => setHoverTab(tab.id)}
            onMouseLeave={() => setHoverTab(null)}
            className={`px-4 py-3 transition-colors ${
              activeTab === tab.id ? 'text-white' : 'text-neutral-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
        <motion.div
          className="absolute bottom-0 h-0.5 bg-indigo-500"
          initial={false}
          animate={getUnderlineStyle()}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      </div>
      <div className="mt-4">
        <AnimatePresence mode="wait">
          {tabs.find(t => t.id === activeTab) && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {tabs.find(t => t.id === activeTab)?.content}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ============================================================================
// 4. PillTabs - pill background morphs
// ============================================================================
export function PillTabs({ tabs, defaultTab, className = '', onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  return (
    <div className={className}>
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); onChange?.(tab.id) }}
            animate={{
              backgroundColor: activeTab === tab.id ? '#6366f1' : '#262626',
              color: activeTab === tab.id ? '#ffffff' : '#9ca3af',
            }}
            transition={{ duration: 0.2 }}
            className="px-4 py-2 rounded-full"
          >
            {tab.label}
          </motion.button>
        ))}
      </div>
      <div className="mt-4">
        <AnimatePresence mode="wait">
          {tabs.map((tab) => (
            tab.id === activeTab && (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                {tab.content}
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ============================================================================
// 5. VerticalTabs - vertical with slide indicator
// ============================================================================
export function VerticalTabs({ tabs, defaultTab, className = '', onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const activeIndex = tabs.findIndex(t => t.id === activeTab)

  const getIndicatorStyle = () => {
    const el = tabRefs.current[activeIndex]
    if (!el) return { top: 0, height: 0 }
    return {
      top: el.offsetTop,
      height: el.offsetHeight,
    }
  }

  return (
    <div className={`flex gap-6 ${className}`}>
      <div className="relative flex flex-col w-48 shrink-0">
        <motion.div
          className="absolute left-0 w-0.5 bg-indigo-500 rounded-full"
          initial={false}
          animate={getIndicatorStyle()}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={el => tabRefs.current[index] = el}
            onClick={() => { setActiveTab(tab.id); onChange?.(tab.id) }}
            className={`px-4 py-3 text-left transition-colors ${
              activeTab === tab.id ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {tabs.map((tab) => (
            tab.id === activeTab && (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {tab.content}
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Export all
export const Tabs = {
  SlideTabs,
  FadeTabs,
  UnderlineTabs,
  PillTabs,
  VerticalTabs,
}
