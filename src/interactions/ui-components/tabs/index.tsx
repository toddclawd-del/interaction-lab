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
// 1. GlassmorphismTabs - Frosted glass with glow indicator
// ============================================================================
export function GlassmorphismTabs({ tabs, defaultTab, className = '', onChange }: TabsProps) {
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
      <div className="relative flex backdrop-blur-xl bg-white/5 rounded-2xl p-1.5 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        {/* Animated indicator with glow */}
        <motion.div
          className="absolute inset-y-1.5 rounded-xl"
          style={{ 
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            boxShadow: '0 0 20px var(--color-primary), 0 4px 12px rgba(0,0,0,0.3)',
          }}
          initial={false}
          animate={getIndicatorStyle()}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={el => tabRefs.current[index] = el}
            onClick={() => { setActiveTab(tab.id); onChange?.(tab.id) }}
            className={`relative z-10 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === tab.id 
                ? 'text-white' 
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-6">
        <AnimatePresence mode="wait">
          {tabs.map((tab) => (
            tab.id === activeTab && (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
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
// 2. AuroraTabs - Flowing gradient animation on active
// ============================================================================
export function AuroraTabs({ tabs, defaultTab, className = '', onChange }: TabsProps) {
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
      <div className="relative flex bg-neutral-900/80 rounded-2xl p-1.5 border border-white/5">
        {/* Aurora animated indicator */}
        <motion.div
          className="absolute inset-y-1.5 rounded-xl overflow-hidden"
          initial={false}
          animate={getIndicatorStyle()}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          <span 
            className="absolute inset-0 animate-aurora"
            style={{
              background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 25%, var(--color-accent) 50%, var(--color-secondary) 75%, var(--color-primary) 100%)`,
              backgroundSize: '400% 400%',
            }}
          />
          <span className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
        </motion.div>
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={el => tabRefs.current[index] = el}
            onClick={() => { setActiveTab(tab.id); onChange?.(tab.id) }}
            className={`relative z-10 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === tab.id 
                ? 'text-white' 
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-6">
        <AnimatePresence mode="wait">
          {tabs.map((tab) => (
            tab.id === activeTab && (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
              >
                {tab.content}
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>
      <style>{`
        @keyframes aurora {
          0%, 100% { background-position: 0% 50%; }
          25% { background-position: 50% 100%; }
          50% { background-position: 100% 50%; }
          75% { background-position: 50% 0%; }
        }
        .animate-aurora { animation: aurora 8s ease-in-out infinite; }
      `}</style>
    </div>
  )
}

// ============================================================================
// 3. NeumorphicTabs - Soft 3D pressed effect
// ============================================================================
export function NeumorphicTabs({ tabs, defaultTab, className = '', onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  return (
    <div className={className}>
      <div 
        className="flex gap-2 p-2 rounded-2xl bg-neutral-800"
        style={{ boxShadow: 'inset 4px 4px 12px rgba(0,0,0,0.3), inset -4px -4px 12px rgba(255,255,255,0.05)' }}
      >
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); onChange?.(tab.id) }}
            animate={{
              boxShadow: activeTab === tab.id 
                ? 'inset 3px 3px 8px rgba(0,0,0,0.4), inset -3px -3px 8px rgba(255,255,255,0.05)'
                : '4px 4px 12px rgba(0,0,0,0.3), -4px -4px 12px rgba(255,255,255,0.05)',
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`px-6 py-3 rounded-xl font-semibold bg-neutral-800 transition-colors ${
              activeTab === tab.id 
                ? 'text-white' 
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            <motion.span
              animate={{ scale: activeTab === tab.id ? 0.95 : 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="block"
            >
              {tab.label}
            </motion.span>
          </motion.button>
        ))}
      </div>
      <div className="mt-6">
        <AnimatePresence mode="wait">
          {tabs.map((tab) => (
            tab.id === activeTab && (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-6 rounded-2xl bg-neutral-800"
                style={{ boxShadow: '8px 8px 20px rgba(0,0,0,0.3), -8px -8px 20px rgba(255,255,255,0.05)' }}
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
// 4. CyberpunkTabs - Neon with scan lines and cut corners
// ============================================================================
export function CyberpunkTabs({ tabs, defaultTab, className = '', onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  return (
    <div className={className}>
      <div className="flex gap-1">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); onChange?.(tab.id) }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative px-6 py-3 font-bold uppercase tracking-wider text-sm overflow-hidden group ${
              activeTab === tab.id ? '' : 'opacity-60 hover:opacity-100'
            }`}
            style={{
              background: activeTab === tab.id 
                ? 'linear-gradient(135deg, #0a0a0a, #1a1a2e)' 
                : 'transparent',
              border: '2px solid',
              borderColor: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-primary)',
              color: 'var(--color-primary)',
              clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
              boxShadow: activeTab === tab.id 
                ? '0 0 15px var(--color-primary), 0 0 30px var(--color-primary)' 
                : 'none',
            }}
          >
            {activeTab === tab.id && (
              <>
                {/* Corner accents */}
                <span 
                  className="absolute top-0 right-0 w-2 h-2"
                  style={{ background: 'var(--color-primary)', clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }}
                />
                <span 
                  className="absolute bottom-0 left-0 w-2 h-2"
                  style={{ background: 'var(--color-primary)', clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }}
                />
                {/* Scan line */}
                <span className="absolute inset-0 pointer-events-none">
                  <span className="absolute inset-x-0 h-px bg-white/40 animate-scan" />
                </span>
              </>
            )}
            <span className={activeTab === tab.id ? 'animate-flicker' : ''}>{tab.label}</span>
          </motion.button>
        ))}
      </div>
      <div className="mt-6">
        <AnimatePresence mode="wait">
          {tabs.map((tab) => (
            tab.id === activeTab && (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="p-6 relative"
                style={{
                  background: 'linear-gradient(180deg, #0a0a0a, #1a1a2e)',
                  border: '2px solid var(--color-primary)',
                  clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                  boxShadow: '0 0 20px var(--color-primary)',
                }}
              >
                {tab.content}
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 1; }
          100% { top: 100%; opacity: 0.3; }
        }
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
          52% { opacity: 1; }
          54% { opacity: 0.9; }
        }
        .animate-scan { animation: scan 2s linear infinite; }
        .animate-flicker { animation: flicker 0.15s ease-in-out infinite; }
      `}</style>
    </div>
  )
}

// ============================================================================
// 5. LayeredTabs - 3D stacked depth effect
// ============================================================================
export function LayeredTabs({ tabs, defaultTab, className = '', onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  return (
    <div className={className}>
      <div className="flex gap-4">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); onChange?.(tab.id) }}
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
            className="relative"
          >
            {/* Bottom layer */}
            <motion.span
              className="absolute inset-0 rounded-xl"
              style={{ backgroundColor: 'var(--color-secondary)', opacity: 0.5 }}
              variants={{ hover: { y: 6, x: 3 } }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              initial={{ y: activeTab === tab.id ? 6 : 4, x: activeTab === tab.id ? 3 : 2 }}
              animate={{ y: activeTab === tab.id ? 6 : 4, x: activeTab === tab.id ? 3 : 2 }}
            />
            {/* Middle layer */}
            <motion.span
              className="absolute inset-0 rounded-xl"
              style={{ backgroundColor: 'var(--color-secondary)', opacity: 0.7 }}
              variants={{ hover: { y: 3, x: 1.5 } }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              initial={{ y: activeTab === tab.id ? 3 : 2, x: activeTab === tab.id ? 1.5 : 1 }}
              animate={{ y: activeTab === tab.id ? 3 : 2, x: activeTab === tab.id ? 1.5 : 1 }}
            />
            {/* Top layer */}
            <motion.span
              className="relative block px-6 py-3 rounded-xl font-semibold text-white"
              style={{ 
                backgroundColor: activeTab === tab.id ? 'var(--color-primary)' : '#374151',
              }}
              variants={{ hover: { y: -2 } }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              {tab.label}
            </motion.span>
          </motion.button>
        ))}
      </div>
      <div className="mt-6">
        <AnimatePresence mode="wait">
          {tabs.map((tab) => (
            tab.id === activeTab && (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
                className="relative"
              >
                {/* Shadow layers */}
                <span 
                  className="absolute inset-0 rounded-xl opacity-30"
                  style={{ backgroundColor: 'var(--color-secondary)', transform: 'translate(6px, 6px)' }}
                />
                <span 
                  className="absolute inset-0 rounded-xl opacity-50"
                  style={{ backgroundColor: 'var(--color-secondary)', transform: 'translate(3px, 3px)' }}
                />
                <div 
                  className="relative p-6 rounded-xl bg-neutral-900 border"
                  style={{ borderColor: 'var(--color-primary)' }}
                >
                  {tab.content}
                </div>
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ============================================================================
// 6. VerticalPremiumTabs - Vertical with animated indicator
// ============================================================================
export function VerticalPremiumTabs({ tabs, defaultTab, className = '', onChange }: TabsProps) {
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
    <div className={`flex gap-8 ${className}`}>
      <div className="relative flex flex-col w-56 shrink-0 backdrop-blur-xl bg-white/5 rounded-2xl p-2 border border-white/10">
        {/* Animated indicator */}
        <motion.div
          className="absolute left-2 right-2 rounded-xl"
          style={{ 
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            boxShadow: '0 0 20px var(--color-primary)',
          }}
          initial={false}
          animate={getIndicatorStyle()}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={el => tabRefs.current[index] = el}
            onClick={() => { setActiveTab(tab.id); onChange?.(tab.id) }}
            className={`relative z-10 px-5 py-4 text-left rounded-xl font-semibold transition-colors ${
              activeTab === tab.id 
                ? 'text-white' 
                : 'text-white/50 hover:text-white/80'
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
                transition={{ duration: 0.25 }}
                className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
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

// Legacy exports for backwards compatibility
export const SlideTabs = GlassmorphismTabs
export const FadeTabs = AuroraTabs
export const UnderlineTabs = NeumorphicTabs
export const PillTabs = CyberpunkTabs
export const VerticalTabs = VerticalPremiumTabs

// Export all
export const Tabs = {
  GlassmorphismTabs,
  AuroraTabs,
  NeumorphicTabs,
  CyberpunkTabs,
  LayeredTabs,
  VerticalPremiumTabs,
  // Legacy
  SlideTabs,
  FadeTabs,
  UnderlineTabs,
  PillTabs,
  VerticalTabs,
}
