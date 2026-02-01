import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ThemeProvider, useTheme } from './ThemeContext'

// Import all components
import {
  GlassmorphismButton,
  NeumorphicButton,
  AuroraButton,
  HolographicButton,
  UnderlineTextButton,
  GhostOutlineButton,
  LayeredDepthButton,
  MagneticPremiumButton,
  LiquidMetalButton,
  MorphingBlobButton,
  CyberpunkNeonButton,
  ParticleBurstButton,
  TextScrambleButton,
  BorderFlowButton,
  DepthShadowButton,
  PillIndicatorButton,
  PillGradientButton,
} from './buttons'

import {
  MagneticNav,
  UnderlineNav,
  HighlightNav,
  SplitTextNav,
  RotateNav,
  BlurNav,
  StaggerNav,
  MorphingHamburger,
  CircleMenu,
  SlidingDrawer,
  GlassHeader,
  MinimalHeader,
  GradientBorderHeader,
} from './headers'

import {
  FloatingLabel,
  UnderlineInput,
  BorderInput,
  ShakeInput,
  SuccessInput,
  SearchExpand,
  TagInput,
  PasswordStrength,
} from './inputs'

import {
  TiltCard,
  FlipCard,
  ShineCard,
  LiftCard,
  BorderCard,
  RevealCard,
  StackCard,
  MagneticCard,
} from './cards'

import {
  SmoothToggle,
  BounceToggle,
  MorphToggle,
  IconToggle,
  LiquidToggle,
  SegmentedToggle,
} from './toggles'

import {
  PulseLoader,
  OrbitLoader,
  MorphLoader,
  TextLoader,
  ProgressLoader,
  SkeletonLoader,
  SpinnerLoader,
  BarLoader,
} from './loaders'

import {
  PulseBadge,
  CountBadge,
  ShimmerBadge,
  PopBadge,
  SlideBadge,
  StatusBadge,
  TagBadge,
} from './badges'

import {
  FadeTooltip,
  ScaleTooltip,
  SlideTooltip,
  MagneticTooltip,
  RichTooltip,
} from './tooltips'

import {
  FadeMenu,
  SlideMenu,
  ScaleMenu,
  BlurMenu,
  StaggerMenu,
} from './menus'

import {
  SlideTabs,
  FadeTabs,
  UnderlineTabs,
  PillTabs,
  VerticalTabs,
} from './tabs'

// New component imports
import { BasicModal, ConfirmationDialog, SlideDrawer, AlertModal, FullScreenModal } from './modals'
import { ToastProvider, ToastsShowcase } from './toasts'
import { BasicSelect, SearchableSelect, MultiSelect, GroupedSelect } from './selects'
import { Accordion, FAQAccordion } from './accordions'
import { Avatar, AvatarGroup, AvatarWithBadge, AvatarWithName, InteractiveAvatar, EditableAvatar } from './avatars'
import { LinearProgress, CircularProgress, Stepper, AnimatedCounter, SegmentedProgress } from './progress'
import { BasicSlider, RangeSlider, SteppedSlider, VerticalSlider, ColorSlider } from './sliders'
import { CardSkeleton, ListItemSkeleton, TableSkeleton, ProfileSkeleton, MediaGridSkeleton, ArticleSkeleton, CommentSkeleton, FormSkeleton } from './skeletons'

// Categories for sidebar navigation
const categories = [
  { id: 'buttons', label: 'Buttons', count: 17 },
  { id: 'modals', label: 'Modals', count: 5 },
  { id: 'toasts', label: 'Toasts', count: 4 },
  { id: 'selects', label: 'Selects', count: 4 },
  { id: 'accordions', label: 'Accordions', count: 4 },
  { id: 'avatars', label: 'Avatars', count: 6 },
  { id: 'progress', label: 'Progress', count: 6 },
  { id: 'sliders', label: 'Sliders', count: 5 },
  { id: 'skeletons', label: 'Skeletons', count: 10 },
  { id: 'headers', label: 'Headers', count: 14 },
  { id: 'inputs', label: 'Form Inputs', count: 8 },
  { id: 'cards', label: 'Cards', count: 8 },
  { id: 'toggles', label: 'Toggles', count: 6 },
  { id: 'loaders', label: 'Loaders', count: 8 },
  { id: 'badges', label: 'Badges', count: 7 },
  { id: 'tooltips', label: 'Tooltips', count: 5 },
  { id: 'menus', label: 'Menus', count: 5 },
  { id: 'tabs', label: 'Tabs', count: 5 },
]

// Copy to clipboard helper
function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
}

// Simple JSX syntax highlighter - CSS-based, no dependencies
function highlightJSX(code: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = []
  let remaining = code
  let key = 0
  
  const patterns: [RegExp, string][] = [
    // JSX tags (component names and HTML elements)
    [/^(<\/?[A-Z][a-zA-Z0-9]*|<\/?[a-z][a-z0-9-]*)/, 'text-pink-400'],
    // Closing bracket
    [/^(\s*\/?>)/, 'text-pink-400'],
    // Props/attributes
    [/^(\s[a-zA-Z][a-zA-Z0-9]*)(=)/, 'text-cyan-300'],
    // Strings (double and single quotes)
    [/^("[^"]*"|'[^']*')/, 'text-green-400'],
    // Template literals
    [/^(`[^`]*`)/, 'text-green-400'],
    // Braces for JSX expressions
    [/^([{}])/, 'text-yellow-300'],
    // Keywords
    [/^(const|let|var|function|return|import|export|from|default|if|else|true|false|null|undefined)\b/, 'text-purple-400'],
    // Numbers
    [/^(\d+\.?\d*)/, 'text-orange-400'],
    // Arrow functions
    [/^(=>)/, 'text-yellow-300'],
    // Parentheses and brackets
    [/^([[\](),:])/, 'text-white/60'],
    // Spread operator
    [/^(\.\.\.)/, 'text-yellow-300'],
    // Comments
    [/^(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/, 'text-white/50'],
    // Regular text/identifiers
    [/^([a-zA-Z_$][a-zA-Z0-9_$]*)/, 'text-white/70'],
    // Whitespace
    [/^(\s+)/, ''],
    // Any other character
    [/^(.)/, 'text-white/70'],
  ]
  
  while (remaining.length > 0) {
    let matched = false
    
    for (const [pattern, className] of patterns) {
      const match = remaining.match(pattern)
      if (match) {
        const text = match[1] || match[0]
        if (className) {
          tokens.push(<span key={key++} className={className}>{text}</span>)
        } else {
          tokens.push(<span key={key++}>{text}</span>)
        }
        remaining = remaining.slice(text.length)
        matched = true
        break
      }
    }
    
    if (!matched) {
      tokens.push(<span key={key++}>{remaining[0]}</span>)
      remaining = remaining.slice(1)
    }
  }
  
  return tokens
}

// Code Block Component
function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    copyToClipboard(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group">
      <pre className="bg-neutral-900/80 border border-white/5 rounded-lg p-4 overflow-x-auto text-sm">
        <code className="font-mono">{highlightJSX(code)}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded transition-colors text-white/60 hover:text-white focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
      >
        {copied ? '✓ Copied' : 'Copy'}
      </button>
    </div>
  )
}

// Component Preview Card - larger, more breathing room
function ComponentPreview({ 
  name, 
  description, 
  code, 
  children,
  className = '' 
}: { 
  name: string
  description?: string
  code?: string
  children: React.ReactNode
  className?: string 
}) {
  const [showCode, setShowCode] = useState(false)

  return (
    <div className={`bg-neutral-900/50 border border-white/5 rounded-2xl overflow-hidden transition-all duration-200 hover:border-white/10 border-l-2 border-l-transparent hover:border-l-[var(--color-primary)] group ${className}`}>
      {/* Preview Header */}
      <div className="flex items-start justify-between px-6 py-5 border-b border-white/5 gap-4">
        <div>
          <h3 className="font-semibold text-white text-lg">{name}</h3>
          {description && <p className="text-sm text-white/60 mt-1 leading-relaxed">{description}</p>}
        </div>
        {code && (
          <button
            onClick={() => setShowCode(!showCode)}
            className="shrink-0 px-3 py-1.5 text-xs font-medium bg-white/5 border border-white/10 rounded-lg transition-all text-white/70 hover:text-white hover:bg-[var(--color-primary)] hover:border-transparent flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
          >
            <span className="opacity-60">&lt;/&gt;</span>
            {showCode ? 'Hide' : 'Code'}
          </button>
        )}
      </div>
      
      {/* Preview Area */}
      <div className="p-8 min-h-[140px] flex items-center justify-center">
        {children}
      </div>

      {/* Code Area */}
      {showCode && code && (
        <div className="border-t border-white/5 p-4">
          <CodeBlock code={code} />
        </div>
      )}
    </div>
  )
}

// Section Header
function SectionHeader({ id, title, description, count }: { id: string; title: string; description: string; count: number }) {
  return (
    <div id={id} className="scroll-mt-24 mb-10 pb-4 border-b border-white/10">
      <div className="flex items-baseline gap-4 mb-3">
        <h2 className="text-4xl font-bold text-white tracking-tight">{title}</h2>
        <span 
          className="px-3 py-1 text-sm font-semibold rounded-full"
          style={{ 
            backgroundColor: 'rgba(var(--color-primary-rgb), 0.15)',
            color: 'var(--color-primary)' 
          }}
        >
          {count}
        </span>
      </div>
      <p className="text-white/70 text-lg max-w-2xl leading-relaxed">{description}</p>
    </div>
  )
}

// Grid layouts for different component types
function ComponentGrid({ children, cols = 3, className = '' }: { children: React.ReactNode; cols?: 2 | 3 | 4; className?: string }) {
  const colClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }
  return <div className={`grid ${colClasses[cols]} gap-6 ${className}`}>{children}</div>
}

// Sidebar Navigation
function Sidebar({ activeSection }: { activeSection: string }) {
  const { setPreset, currentPreset } = useTheme()

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-6 space-y-6">
        {/* Theme selector */}
        <div className="p-4 bg-neutral-900/50 border border-white/5 rounded-xl">
          <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3">Theme</p>
          <div className="flex flex-wrap gap-2">
            {(['indigo', 'rose', 'cyan', 'emerald', 'orange'] as const).map((preset) => (
              <button
                key={preset}
                onClick={() => setPreset(preset)}
                className={`w-8 h-8 rounded-lg transition-all capitalize focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 ${
                  currentPreset === preset
                    ? 'ring-2 ring-white/40 ring-offset-2 ring-offset-neutral-950 scale-110'
                    : 'hover:scale-110'
                }`}
                style={{ 
                  backgroundColor: preset === 'indigo' ? '#6366f1' 
                    : preset === 'rose' ? '#f43f5e'
                    : preset === 'cyan' ? '#06b6d4'
                    : preset === 'emerald' ? '#10b981'
                    : '#f97316'
                }}
                title={preset}
              />
            ))}
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3 px-3">Components</p>
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 ${
                activeSection === cat.id
                  ? 'text-white border-l-2 border-l-[var(--color-primary)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
              style={activeSection === cat.id ? { backgroundColor: 'rgba(var(--color-primary-rgb), 0.15)' } : undefined}
            >
              <span className="font-medium">{cat.label}</span>
              <span 
                className={`text-xs px-2 py-0.5 rounded-full ${
                  activeSection === cat.id
                    ? 'text-[var(--color-primary)]'
                    : 'bg-white/10 text-white/50'
                }`}
                style={activeSection === cat.id ? { backgroundColor: 'rgba(var(--color-primary-rgb), 0.25)' } : undefined}
              >
                {cat.count}
              </span>
            </a>
          ))}
        </nav>
      </div>
    </aside>
  )
}

// Mobile category tabs with scroll indicators
function MobileTabs({ activeSection }: { activeSection: string }) {
  const [showLeftFade, setShowLeftFade] = useState(false)
  const [showRightFade, setShowRightFade] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setShowLeftFade(scrollLeft > 10)
    setShowRightFade(scrollLeft < scrollWidth - clientWidth - 10)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    handleScroll()
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="lg:hidden sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-md border-b border-white/5 -mx-6 mb-8 relative">
      {/* Left fade indicator */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-neutral-950/95 to-transparent z-10 pointer-events-none transition-opacity duration-200"
        style={{ opacity: showLeftFade ? 1 : 0 }}
      />
      {/* Right fade indicator */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-neutral-950/95 to-transparent z-10 pointer-events-none transition-opacity duration-200"
        style={{ opacity: showRightFade ? 1 : 0 }}
      />
      <div 
        ref={scrollRef}
        className="overflow-x-auto px-6 py-3 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex gap-2 min-w-max">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 ${
                activeSection === cat.id
                  ? 'text-white font-medium'
                  : 'text-white/60 hover:text-white'
              }`}
              style={activeSection === cat.id ? { backgroundColor: 'rgba(var(--color-primary-rgb), 0.15)' } : undefined}
            >
              {cat.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

function UIComponentsContent() {
  const [activeSection, setActiveSection] = useState('buttons')
  
  // State for interactive demos
  const [toggleStates, setToggleStates] = useState({
    smooth: false,
    bounce: true,
    morph: false,
    icon: false,
    liquid: true,
  })
  const [segmentValue, setSegmentValue] = useState('Option 1')
  const [inputValues, setInputValues] = useState({
    floating: '',
    underline: '',
    border: '',
    shake: '',
    success: '',
    search: '',
    password: '',
  })
  const [tags, setTags] = useState(['React', 'TypeScript'])
  const [shakeInvalid, setShakeInvalid] = useState(false)
  const [showBadge, setShowBadge] = useState(true)
  const [badgeCount, setBadgeCount] = useState(5)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isCircleMenuOpen, setIsCircleMenuOpen] = useState(false)
  const [hamburgerOpen, setHamburgerOpen] = useState(false)
  
  // New component states
  const [isBasicModalOpen, setIsBasicModalOpen] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isSlideDrawerOpen, setIsSlideDrawerOpen] = useState(false)
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false)
  const [isFullScreenModalOpen, setIsFullScreenModalOpen] = useState(false)
  
  const [selectValue, setSelectValue] = useState('')
  const [searchSelectValue, setSearchSelectValue] = useState('')
  const [multiSelectValue, setMultiSelectValue] = useState<string[]>([])
  const [groupedSelectValue, setGroupedSelectValue] = useState('')
  
  const [sliderValue, setSliderValue] = useState(50)
  const [rangeValue, setRangeValue] = useState<[number, number]>([25, 75])
  const [steppedValue, setSteppedValue] = useState(50)
  const [verticalValue, setVerticalValue] = useState(50)
  const [colorValue, setColorValue] = useState(180)
  
  const [progressValue, setProgressValue] = useState(65)
  const [counterValue, setCounterValue] = useState(1234)
  const [activeStep, setActiveStep] = useState(1)

  const navItems = [
    { label: 'Home' },
    { label: 'About' },
    { label: 'Services' },
    { label: 'Contact' },
  ]

  const menuItems = [
    { label: 'Edit', icon: '✏️' },
    { label: 'Duplicate', icon: '📋' },
    { label: 'Delete', icon: '🗑️' },
    { label: 'Share', icon: '🔗' },
  ]

  const tabData = [
    { id: 'tab1', label: 'Overview', content: <p className="text-white/60">Overview content goes here.</p> },
    { id: 'tab2', label: 'Features', content: <p className="text-white/60">Features content goes here.</p> },
    { id: 'tab3', label: 'Pricing', content: <p className="text-white/60">Pricing content goes here.</p> },
  ]

  // Select options
  const selectOptions = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' },
    { value: 'svelte', label: 'Svelte' },
  ]

  const groupedOptions = [
    { label: 'Frontend', options: [
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue' },
    ]},
    { label: 'Backend', options: [
      { value: 'node', label: 'Node.js' },
      { value: 'python', label: 'Python' },
    ]},
  ]

  // Accordion data
  const accordionItems = [
    { id: '1', title: 'What is this component library?', content: <p className="text-white/60">A collection of beautiful, animated React components built with Framer Motion and Tailwind CSS.</p> },
    { id: '2', title: 'How do I use it?', content: <p className="text-white/60">Simply import the components you need and customize them with props and styles.</p> },
    { id: '3', title: 'Is it production-ready?', content: <p className="text-white/60">Yes! All components follow accessibility best practices and are fully tested.</p> },
  ]

  const faqItems = [
    { id: 'faq1', question: 'Do you offer support?', answer: <p className="text-white/60">Yes, we provide comprehensive documentation and community support.</p> },
    { id: 'faq2', question: 'Can I customize the styles?', answer: <p className="text-white/60">Absolutely. All components accept className props and use CSS variables.</p> },
    { id: 'faq3', question: 'Is there a free tier?', answer: <p className="text-white/60">The entire library is free and open source.</p> },
  ]

  // Stepper data
  const stepperSteps = [
    { id: '1', title: 'Account', description: 'Create your account' },
    { id: '2', title: 'Profile', description: 'Set up your profile' },
    { id: '3', title: 'Preferences', description: 'Configure settings' },
    { id: '4', title: 'Done', description: 'All set!' },
  ]

  // Stepped slider data
  const sliderSteps = [
    { value: 0, label: '0%' },
    { value: 25, label: '25%' },
    { value: 50, label: '50%' },
    { value: 75, label: '75%' },
    { value: 100, label: '100%' },
  ]

  // Segmented progress data  
  const segmentData = [
    { value: 20, color: 'var(--color-primary)', label: 'Design' },
    { value: 30, color: '#10b981', label: 'Dev' },
    { value: 15, color: '#f59e0b', label: 'QA' },
  ]

  // Intersection observer for active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )

    categories.forEach((cat) => {
      const element = document.getElementById(cat.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Hero Header */}
      <header className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group rounded-lg px-2 py-1 -ml-2 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950">
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              <span>Back to Lab</span>
            </Link>
          </div>
          
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent">
              UI Components
            </h1>
            <p className="text-xl text-white/70 mb-6 leading-relaxed">
              A curated collection of animated, production-ready React components. 
              Beautiful interactions, smooth animations, and clean code.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-primary)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>116 Components</span>
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <span>React</span>
                <span>•</span>
                <span>TypeScript</span>
                <span>•</span>
                <span>Tailwind</span>
                <span>•</span>
                <span>Framer Motion</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex gap-12">
          {/* Sidebar */}
          <Sidebar activeSection={activeSection} />

          {/* Content */}
          <main className="flex-1 min-w-0">
            <MobileTabs activeSection={activeSection} />

            {/* Buttons Section */}
            <section className="mb-20">
              <SectionHeader 
                id="buttons"
                title="Buttons" 
                description="Interactive button components with hover effects, animations, and unique visual styles."
                count={17}
              />
              <ComponentGrid cols={3}>
                <ComponentPreview 
                  name="Pill Indicator" 
                  description="Gradient pill with ring indicator"
                  code={`<PillIndicatorButton>Get Started</PillIndicatorButton>`}
                >
                  <PillIndicatorButton>Get Started</PillIndicatorButton>
                </ComponentPreview>
                <ComponentPreview 
                  name="Pill Gradient" 
                  description="Flowing gradient animation"
                  code={`<PillGradientButton>Explore</PillGradientButton>`}
                >
                  <PillGradientButton>Explore</PillGradientButton>
                </ComponentPreview>
                <ComponentPreview 
                  name="Glassmorphism" 
                  description="Frosted glass effect"
                  code={`<GlassmorphismButton>Glass</GlassmorphismButton>`}
                >
                  <GlassmorphismButton>Glass</GlassmorphismButton>
                </ComponentPreview>
                <ComponentPreview 
                  name="Neumorphic" 
                  description="Soft UI pressed effect"
                  code={`<NeumorphicButton>Soft UI</NeumorphicButton>`}
                >
                  <NeumorphicButton>Soft UI</NeumorphicButton>
                </ComponentPreview>
                <ComponentPreview 
                  name="Aurora" 
                  description="Northern lights gradient"
                  code={`<AuroraButton>Aurora</AuroraButton>`}
                >
                  <AuroraButton>Aurora</AuroraButton>
                </ComponentPreview>
                <ComponentPreview 
                  name="Holographic" 
                  description="Iridescent shimmer"
                  code={`<HolographicButton>Holo</HolographicButton>`}
                >
                  <HolographicButton>Holo</HolographicButton>
                </ComponentPreview>
                <ComponentPreview 
                  name="Underline Text" 
                  description="Animated underline on hover"
                  code={`<UnderlineTextButton>Underline</UnderlineTextButton>`}
                >
                  <UnderlineTextButton>Underline</UnderlineTextButton>
                </ComponentPreview>
                <ComponentPreview 
                  name="Ghost Outline" 
                  description="Fills on hover"
                  code={`<GhostOutlineButton>Ghost</GhostOutlineButton>`}
                >
                  <GhostOutlineButton>Ghost</GhostOutlineButton>
                </ComponentPreview>
                <ComponentPreview 
                  name="3D Layers" 
                  description="Stacked depth effect"
                  code={`<LayeredDepthButton>Layers</LayeredDepthButton>`}
                >
                  <LayeredDepthButton>Layers</LayeredDepthButton>
                </ComponentPreview>
                <ComponentPreview 
                  name="Magnetic" 
                  description="Follows cursor"
                  code={`<MagneticPremiumButton>Magnetic</MagneticPremiumButton>`}
                >
                  <MagneticPremiumButton>Magnetic</MagneticPremiumButton>
                </ComponentPreview>
                <ComponentPreview 
                  name="Liquid Metal" 
                  description="Chrome reflection"
                  code={`<LiquidMetalButton>Chrome</LiquidMetalButton>`}
                >
                  <LiquidMetalButton>Chrome</LiquidMetalButton>
                </ComponentPreview>
                <ComponentPreview 
                  name="Blob Morph" 
                  description="Organic shape animation"
                  code={`<MorphingBlobButton>Blob</MorphingBlobButton>`}
                >
                  <MorphingBlobButton>Blob</MorphingBlobButton>
                </ComponentPreview>
                <ComponentPreview 
                  name="Cyberpunk" 
                  description="Neon glow effect"
                  code={`<CyberpunkNeonButton>Neon</CyberpunkNeonButton>`}
                >
                  <CyberpunkNeonButton>Neon</CyberpunkNeonButton>
                </ComponentPreview>
                <ComponentPreview 
                  name="Particles" 
                  description="Burst on click"
                  code={`<ParticleBurstButton>Burst</ParticleBurstButton>`}
                >
                  <ParticleBurstButton>Burst</ParticleBurstButton>
                </ComponentPreview>
                <ComponentPreview 
                  name="Text Scramble" 
                  description="Decode animation"
                  code={`<TextScrambleButton>Decode</TextScrambleButton>`}
                >
                  <TextScrambleButton>Decode</TextScrambleButton>
                </ComponentPreview>
                <ComponentPreview 
                  name="Border Flow" 
                  description="Animated gradient border"
                  code={`<BorderFlowButton>Flow</BorderFlowButton>`}
                >
                  <BorderFlowButton>Flow</BorderFlowButton>
                </ComponentPreview>
                <ComponentPreview 
                  name="Depth Shadow" 
                  description="3D press effect"
                  code={`<DepthShadowButton>Depth</DepthShadowButton>`}
                >
                  <DepthShadowButton>Depth</DepthShadowButton>
                </ComponentPreview>
              </ComponentGrid>
            </section>

            {/* Modals Section */}
            <section className="mb-20">
              <SectionHeader 
                id="modals"
                title="Modals" 
                description="Dialog and modal components with smooth animations and accessible interactions."
                count={5}
              />
              <ComponentGrid cols={3}>
                <ComponentPreview 
                  name="Basic Modal" 
                  description="Simple animated modal"
                  code={`<BasicModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Modal Title">Content</BasicModal>`}
                >
                  <button onClick={() => setIsBasicModalOpen(true)} className="px-16 py-5 min-w-[180px] rounded-lg font-medium text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
                    Open Modal
                  </button>
                  <BasicModal isOpen={isBasicModalOpen} onClose={() => setIsBasicModalOpen(false)} title="Basic Modal">
                    <p className="text-white/60">This is a basic modal with smooth entrance and exit animations.</p>
                  </BasicModal>
                </ComponentPreview>
                <ComponentPreview 
                  name="Confirmation Dialog" 
                  description="Confirm/cancel actions"
                  code={`<ConfirmationDialog isOpen={isOpen} onClose={onClose} onConfirm={onConfirm} title="Confirm" />`}
                >
                  <button onClick={() => setIsConfirmDialogOpen(true)} className="px-16 py-5 min-w-[180px] rounded-lg font-medium text-white bg-red-500/80 hover:bg-red-500">
                    Delete Item
                  </button>
                  <ConfirmationDialog 
                    isOpen={isConfirmDialogOpen} 
                    onClose={() => setIsConfirmDialogOpen(false)} 
                    onConfirm={() => setIsConfirmDialogOpen(false)}
                    title="Delete Item?"
                    message="This action cannot be undone. Are you sure you want to continue?"
                    confirmText="Delete"
                    cancelText="Cancel"
                    variant="danger"
                  />
                </ComponentPreview>
                <ComponentPreview 
                  name="Slide Drawer" 
                  description="Side panel drawer"
                  code={`<SlideDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="Menu">Content</SlideDrawer>`}
                >
                  <button onClick={() => setIsSlideDrawerOpen(true)} className="px-16 py-5 min-w-[180px] rounded-lg font-medium text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
                    Open Drawer
                  </button>
                  <SlideDrawer isOpen={isSlideDrawerOpen} onClose={() => setIsSlideDrawerOpen(false)} title="Settings">
                    <div className="space-y-4">
                      <p className="text-white/60">Drawer content slides in from the side with a smooth animation.</p>
                      <div className="flex items-center justify-between py-2 border-b border-white/10">
                        <span className="text-white/80">Dark Mode</span>
                        <span className="text-white/40">On</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-white/10">
                        <span className="text-white/80">Notifications</span>
                        <span className="text-white/40">Off</span>
                      </div>
                    </div>
                  </SlideDrawer>
                </ComponentPreview>
                <ComponentPreview 
                  name="Alert Modal" 
                  description="Alert/notification modal"
                  code={`<AlertModal isOpen={isOpen} onClose={onClose} type="success" title="Success!" />`}
                >
                  <button onClick={() => setIsAlertModalOpen(true)} className="px-16 py-5 min-w-[180px] rounded-lg font-medium text-white bg-emerald-500/80 hover:bg-emerald-500">
                    Show Alert
                  </button>
                  <AlertModal 
                    isOpen={isAlertModalOpen} 
                    onClose={() => setIsAlertModalOpen(false)}
                    type="success"
                    title="Success!"
                    message="Your changes have been saved successfully."
                  />
                </ComponentPreview>
                <ComponentPreview 
                  name="Full Screen Modal" 
                  description="Immersive full screen"
                  code={`<FullScreenModal isOpen={isOpen} onClose={onClose}>Content</FullScreenModal>`}
                >
                  <button onClick={() => setIsFullScreenModalOpen(true)} className="px-16 py-5 min-w-[180px] rounded-lg font-medium text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
                    Full Screen
                  </button>
                  <FullScreenModal isOpen={isFullScreenModalOpen} onClose={() => setIsFullScreenModalOpen(false)}>
                    <div className="flex flex-col items-center justify-center h-full">
                      <h2 className="text-4xl font-bold text-white mb-4">Full Screen Modal</h2>
                      <p className="text-white/60 mb-8">Press Escape or click the close button to exit.</p>
                      <button onClick={() => setIsFullScreenModalOpen(false)} className="px-6 py-3 rounded-lg font-medium text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
                        Close Modal
                      </button>
                    </div>
                  </FullScreenModal>
                </ComponentPreview>
              </ComponentGrid>
            </section>

            {/* Toasts Section */}
            <section className="mb-20">
              <SectionHeader 
                id="toasts"
                title="Toasts" 
                description="Toast notifications with auto-dismiss and various styles."
                count={4}
              />
              <ComponentPreview 
                name="Toast Notifications" 
                description="Click buttons to trigger different toast types"
                code={`<ToastProvider><ToastsShowcase /></ToastProvider>`}
              >
                <ToastProvider>
                  <ToastsShowcase />
                </ToastProvider>
              </ComponentPreview>
            </section>

            {/* Selects Section */}
            <section className="mb-20">
              <SectionHeader 
                id="selects"
                title="Selects" 
                description="Custom select components with search, multi-select, and grouping."
                count={4}
              />
              <ComponentGrid cols={2}>
                <ComponentPreview 
                  name="Basic Select" 
                  description="Animated dropdown select"
                  code={`<BasicSelect options={options} value={value} onChange={setValue} />`}
                >
                  <div className="w-full max-w-xs">
                    <BasicSelect 
                      options={selectOptions} 
                      value={selectValue} 
                      onChange={setSelectValue}
                      placeholder="Select a framework..."
                    />
                  </div>
                </ComponentPreview>
                <ComponentPreview 
                  name="Searchable Select" 
                  description="Type to filter options"
                  code={`<SearchableSelect options={options} value={value} onChange={setValue} />`}
                >
                  <div className="w-full max-w-xs">
                    <SearchableSelect 
                      options={selectOptions} 
                      value={searchSelectValue} 
                      onChange={setSearchSelectValue}
                      placeholder="Search frameworks..."
                    />
                  </div>
                </ComponentPreview>
                <ComponentPreview 
                  name="Multi Select" 
                  description="Select multiple values"
                  code={`<MultiSelect options={options} value={values} onChange={setValues} />`}
                >
                  <div className="w-full max-w-xs">
                    <MultiSelect 
                      options={selectOptions} 
                      value={multiSelectValue} 
                      onChange={setMultiSelectValue}
                      placeholder="Select multiple..."
                    />
                  </div>
                </ComponentPreview>
                <ComponentPreview 
                  name="Grouped Select" 
                  description="Options in groups"
                  code={`<GroupedSelect groups={groups} value={value} onChange={setValue} />`}
                >
                  <div className="w-full max-w-xs">
                    <GroupedSelect 
                      groups={groupedOptions} 
                      value={groupedSelectValue} 
                      onChange={setGroupedSelectValue}
                      placeholder="Select technology..."
                    />
                  </div>
                </ComponentPreview>
              </ComponentGrid>
            </section>

            {/* Accordions Section */}
            <section className="mb-20">
              <SectionHeader 
                id="accordions"
                title="Accordions" 
                description="Expandable content sections with smooth animations."
                count={4}
              />
              <div className="space-y-6">
                <ComponentPreview 
                  name="Basic Accordion" 
                  description="Single or multiple expand"
                  code={`<Accordion items={items} allowMultiple />`}
                >
                  <div className="w-full max-w-lg">
                    <Accordion items={accordionItems} />
                  </div>
                </ComponentPreview>
                <ComponentPreview 
                  name="FAQ Accordion" 
                  description="Styled for FAQ sections"
                  code={`<FAQAccordion items={faqItems} />`}
                >
                  <div className="w-full max-w-lg">
                    <FAQAccordion items={faqItems} />
                  </div>
                </ComponentPreview>
                <ComponentGrid cols={2}>
                  <ComponentPreview 
                    name="Bordered Variant" 
                    description="With visible borders"
                  >
                    <div className="w-full">
                      <Accordion items={accordionItems.slice(0, 2)} variant="bordered" />
                    </div>
                  </ComponentPreview>
                  <ComponentPreview 
                    name="Separated Variant" 
                    description="Spaced apart items"
                  >
                    <div className="w-full">
                      <Accordion items={accordionItems.slice(0, 2)} variant="separated" />
                    </div>
                  </ComponentPreview>
                </ComponentGrid>
              </div>
            </section>

            {/* Avatars Section */}
            <section className="mb-20">
              <SectionHeader 
                id="avatars"
                title="Avatars" 
                description="User avatars with status indicators, groups, and interactions."
                count={6}
              />
              <ComponentGrid cols={3}>
                <ComponentPreview 
                  name="Basic Avatar" 
                  description="Image or initials"
                  code={`<Avatar src="url" name="Name" size="lg" />`}
                >
                  <div className="flex gap-4 items-center">
                    <Avatar src="https://i.pravatar.cc/150?img=1" name="John Doe" size="sm" />
                    <Avatar src="https://i.pravatar.cc/150?img=2" name="Jane Doe" size="md" />
                    <Avatar src="https://i.pravatar.cc/150?img=3" name="Bob Smith" size="lg" />
                    <Avatar name="Todd Smith" size="lg" />
                  </div>
                </ComponentPreview>
                <ComponentPreview 
                  name="Avatar Group" 
                  description="Stacked avatars"
                  code={`<AvatarGroup users={[...]} max={4} />`}
                >
                  <AvatarGroup 
                    users={[
                      { src: 'https://i.pravatar.cc/150?img=1', name: 'User 1' },
                      { src: 'https://i.pravatar.cc/150?img=2', name: 'User 2' },
                      { src: 'https://i.pravatar.cc/150?img=3', name: 'User 3' },
                      { src: 'https://i.pravatar.cc/150?img=4', name: 'User 4' },
                      { src: 'https://i.pravatar.cc/150?img=5', name: 'User 5' },
                    ]}
                    max={4}
                  />
                </ComponentPreview>
                <ComponentPreview 
                  name="With Badge" 
                  description="Status indicator"
                  code={`<AvatarWithBadge src="url" name="Name" status="online" />`}
                >
                  <div className="flex gap-6 items-center">
                    <AvatarWithBadge src="https://i.pravatar.cc/150?img=6" name="Online" status="online" />
                    <AvatarWithBadge src="https://i.pravatar.cc/150?img=7" name="Away" status="away" />
                    <AvatarWithBadge src="https://i.pravatar.cc/150?img=8" name="Busy" status="busy" />
                    <AvatarWithBadge src="https://i.pravatar.cc/150?img=9" name="Offline" status="offline" />
                  </div>
                </ComponentPreview>
                <ComponentPreview 
                  name="With Name" 
                  description="Avatar and text"
                  code={`<AvatarWithName src="url" name="John" subtitle="Admin" />`}
                >
                  <AvatarWithName 
                    src="https://i.pravatar.cc/150?img=10" 
                    name="John Doe" 
                    subtitle="Product Designer"
                  />
                </ComponentPreview>
                <ComponentPreview 
                  name="Interactive" 
                  description="Hover effects"
                  code={`<InteractiveAvatar src="url" name="Name" onClick={fn} />`}
                >
                  <InteractiveAvatar 
                    src="https://i.pravatar.cc/150?img=11" 
                    name="Click me"
                    onClick={() => {}}
                  />
                </ComponentPreview>
                <ComponentPreview 
                  name="Editable" 
                  description="Upload new image"
                  code={`<EditableAvatar src="url" name="Name" onEdit={fn} />`}
                >
                  <EditableAvatar 
                    src="https://i.pravatar.cc/150?img=12"
                    name="Edit Avatar"
                    onEdit={() => {}}
                  />
                </ComponentPreview>
              </ComponentGrid>
            </section>

            {/* Progress Section */}
            <section className="mb-20">
              <SectionHeader 
                id="progress"
                title="Progress" 
                description="Progress indicators, steppers, and animated counters."
                count={6}
              />
              <div className="space-y-6">
                <ComponentGrid cols={2}>
                  <ComponentPreview 
                    name="Linear Progress" 
                    description="Horizontal bar"
                    code={`<LinearProgress value={65} />`}
                  >
                    <div className="w-full max-w-xs space-y-4">
                      <LinearProgress value={progressValue} />
                      <div className="flex gap-2">
                        <button onClick={() => setProgressValue(Math.max(0, progressValue - 10))} className="px-3 py-1 text-sm bg-white/10 rounded">-10</button>
                        <button onClick={() => setProgressValue(Math.min(100, progressValue + 10))} className="px-3 py-1 text-sm bg-white/10 rounded">+10</button>
                      </div>
                    </div>
                  </ComponentPreview>
                  <ComponentPreview 
                    name="Circular Progress" 
                    description="Ring indicator"
                    code={`<CircularProgress value={65} />`}
                  >
                    <div className="flex gap-6 items-center">
                      <CircularProgress value={progressValue} size={60} />
                      <CircularProgress value={progressValue} size={80} showLabel />
                    </div>
                  </ComponentPreview>
                </ComponentGrid>
                <ComponentPreview 
                  name="Stepper" 
                  description="Multi-step progress"
                  code={`<Stepper steps={steps} currentStep={1} />`}
                >
                  <div className="w-full max-w-2xl">
                    <Stepper steps={stepperSteps} currentStep={activeStep} />
                    <div className="flex gap-2 mt-6 justify-center">
                      <button onClick={() => setActiveStep(Math.max(0, activeStep - 1))} className="px-4 py-2 text-sm bg-white/10 rounded-lg">Previous</button>
                      <button onClick={() => setActiveStep(Math.min(3, activeStep + 1))} className="px-4 py-2 text-sm rounded-lg text-white" style={{ backgroundColor: 'var(--color-primary)' }}>Next</button>
                    </div>
                  </div>
                </ComponentPreview>
                <ComponentGrid cols={2}>
                  <ComponentPreview 
                    name="Animated Counter" 
                    description="Counting animation"
                    code={`<AnimatedCounter value={1234} />`}
                  >
                    <div className="text-center">
                      <AnimatedCounter value={counterValue} className="text-4xl font-bold" />
                      <div className="flex gap-2 mt-4 justify-center">
                        <button onClick={() => setCounterValue(counterValue + 100)} className="px-3 py-1 text-sm bg-white/10 rounded">+100</button>
                        <button onClick={() => setCounterValue(Math.floor(Math.random() * 10000))} className="px-3 py-1 text-sm bg-white/10 rounded">Random</button>
                      </div>
                    </div>
                  </ComponentPreview>
                  <ComponentPreview 
                    name="Segmented Progress" 
                    description="Multi-segment bar"
                    code={`<SegmentedProgress segments={[{value: 20}, {value: 30}]} />`}
                  >
                    <div className="w-full max-w-xs">
                      <SegmentedProgress segments={segmentData} showLabels />
                    </div>
                  </ComponentPreview>
                </ComponentGrid>
              </div>
            </section>

            {/* Sliders Section */}
            <section className="mb-20">
              <SectionHeader 
                id="sliders"
                title="Sliders" 
                description="Range inputs with various styles and interactions."
                count={5}
              />
              <ComponentGrid cols={2}>
                <ComponentPreview 
                  name="Basic Slider" 
                  description="Single value slider"
                  code={`<BasicSlider value={50} onChange={setValue} />`}
                >
                  <div className="w-full max-w-xs">
                    <BasicSlider value={sliderValue} onChange={setSliderValue} />
                    <p className="text-center text-white/40 mt-2">Value: {sliderValue}</p>
                  </div>
                </ComponentPreview>
                <ComponentPreview 
                  name="Range Slider" 
                  description="Min/max range"
                  code={`<RangeSlider value={[25, 75]} onChange={setRange} />`}
                >
                  <div className="w-full max-w-xs">
                    <RangeSlider 
                      value={rangeValue}
                      onChange={setRangeValue} 
                    />
                    <p className="text-center text-white/40 mt-2">{rangeValue[0]} - {rangeValue[1]}</p>
                  </div>
                </ComponentPreview>
                <ComponentPreview 
                  name="Stepped Slider" 
                  description="Discrete steps"
                  code={`<SteppedSlider value={50} steps={[...]} onChange={setValue} />`}
                >
                  <div className="w-full max-w-xs">
                    <SteppedSlider value={steppedValue} steps={sliderSteps} onChange={setSteppedValue} showLabels />
                    <p className="text-center text-white/40 mt-2">Value: {steppedValue}</p>
                  </div>
                </ComponentPreview>
                <ComponentPreview 
                  name="Color Slider" 
                  description="Hue picker"
                  code={`<ColorSlider value={180} onChange={setHue} />`}
                >
                  <div className="w-full max-w-xs">
                    <ColorSlider value={colorValue} onChange={setColorValue} />
                    <div className="mt-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: `hsl(${colorValue}, 70%, 50%)` }} />
                      <span className="text-white/40">hsl({colorValue}, 70%, 50%)</span>
                    </div>
                  </div>
                </ComponentPreview>
              </ComponentGrid>
              <div className="mt-6">
                <ComponentPreview 
                  name="Vertical Slider" 
                  description="Vertical orientation"
                  code={`<VerticalSlider value={50} onChange={setValue} />`}
                >
                  <div className="h-48">
                    <VerticalSlider value={verticalValue} onChange={setVerticalValue} />
                  </div>
                </ComponentPreview>
              </div>
            </section>

            {/* Skeletons Section */}
            <section className="mb-20">
              <SectionHeader 
                id="skeletons"
                title="Skeletons" 
                description="Loading placeholders for various content types."
                count={10}
              />
              <ComponentGrid cols={2}>
                <ComponentPreview 
                  name="Card Skeleton" 
                  description="Card loading state"
                  code={`<CardSkeleton />`}
                >
                  <CardSkeleton />
                </ComponentPreview>
                <ComponentPreview 
                  name="Profile Skeleton" 
                  description="User profile loading"
                  code={`<ProfileSkeleton />`}
                >
                  <ProfileSkeleton />
                </ComponentPreview>
                <ComponentPreview 
                  name="List Item Skeleton" 
                  description="List row loading"
                  code={`<ListItemSkeleton />`}
                >
                  <div className="space-y-3 w-full">
                    <ListItemSkeleton />
                    <ListItemSkeleton />
                    <ListItemSkeleton />
                  </div>
                </ComponentPreview>
                <ComponentPreview 
                  name="Article Skeleton" 
                  description="Blog post loading"
                  code={`<ArticleSkeleton />`}
                >
                  <ArticleSkeleton />
                </ComponentPreview>
              </ComponentGrid>
              <div className="mt-6">
                <ComponentPreview 
                  name="Table Skeleton" 
                  description="Data table loading"
                  code={`<TableSkeleton rows={4} columns={4} />`}
                >
                  <div className="w-full">
                    <TableSkeleton rows={4} columns={4} />
                  </div>
                </ComponentPreview>
              </div>
              <ComponentGrid cols={3} className="mt-6">
                <ComponentPreview 
                  name="Media Grid" 
                  description="Image grid loading"
                  code={`<MediaGridSkeleton />`}
                >
                  <MediaGridSkeleton />
                </ComponentPreview>
                <ComponentPreview 
                  name="Form Skeleton" 
                  description="Form fields loading"
                  code={`<FormSkeleton />`}
                >
                  <FormSkeleton />
                </ComponentPreview>
                <ComponentPreview 
                  name="Comment Skeleton" 
                  description="Comment loading"
                  code={`<CommentSkeleton />`}
                >
                  <CommentSkeleton />
                </ComponentPreview>
              </ComponentGrid>
            </section>

            {/* Headers Section */}
            <section className="mb-20">
              <SectionHeader 
                id="headers"
                title="Headers & Navigation" 
                description="Full header components and nav link animations for websites and applications."
                count={14}
              />
              
              {/* Full Headers - Larger previews */}
              <div className="space-y-6 mb-10">
                <h3 className="text-lg font-semibold text-white">Full Headers</h3>
                <ComponentPreview 
                  name="Glass Header" 
                  description="Frosted glass with logo, nav links, and CTA"
                  code={`<GlassHeader items={[{ label: 'Home' }, { label: 'About' }]} />`}
                >
                  <div className="w-full">
                    <GlassHeader items={navItems} />
                  </div>
                </ComponentPreview>
                <ComponentPreview 
                  name="Minimal Header" 
                  description="Clean Vercel-inspired style"
                  code={`<MinimalHeader items={[{ label: 'Home' }, { label: 'About' }]} />`}
                >
                  <div className="w-full">
                    <MinimalHeader items={navItems} />
                  </div>
                </ComponentPreview>
                <ComponentPreview 
                  name="Gradient Border Header" 
                  description="Animated gradient border accent"
                  code={`<GradientBorderHeader items={[{ label: 'Home' }]} />`}
                >
                  <div className="w-full">
                    <GradientBorderHeader items={navItems} />
                  </div>
                </ComponentPreview>
              </div>

              {/* Nav Link Animations */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Nav Link Animations</h3>
                <ComponentGrid cols={2}>
                  <ComponentPreview name="Magnetic" description="Links follow cursor">
                    <MagneticNav items={navItems} />
                  </ComponentPreview>
                  <ComponentPreview name="Underline" description="Animated underline">
                    <UnderlineNav items={navItems} />
                  </ComponentPreview>
                  <ComponentPreview name="Highlight" description="Background highlight">
                    <HighlightNav items={navItems} />
                  </ComponentPreview>
                  <ComponentPreview name="Split Text" description="Text splits on hover">
                    <SplitTextNav items={navItems} />
                  </ComponentPreview>
                  <ComponentPreview name="Rotate" description="3D rotation">
                    <RotateNav items={navItems} />
                  </ComponentPreview>
                  <ComponentPreview name="Blur" description="Focus blur effect">
                    <BlurNav items={navItems} />
                  </ComponentPreview>
                  <ComponentPreview name="Stagger" description="Staggered animation">
                    <StaggerNav items={navItems} />
                  </ComponentPreview>
                </ComponentGrid>

                {/* Menu Components */}
                <h3 className="text-lg font-semibold text-white mt-10">Menu Components</h3>
                <ComponentGrid cols={3}>
                  <ComponentPreview name="Hamburger" description="Morphing icon">
                    <MorphingHamburger isOpen={hamburgerOpen} onToggle={() => setHamburgerOpen(!hamburgerOpen)} />
                  </ComponentPreview>
                  <ComponentPreview name="Circle Menu" description="Radial expand">
                    <div className="relative h-24 w-24">
                      <CircleMenu items={navItems} isOpen={isCircleMenuOpen} onToggle={() => setIsCircleMenuOpen(!isCircleMenuOpen)} />
                    </div>
                  </ComponentPreview>
                  <ComponentPreview name="Sliding Drawer" description="Side panel">
                    <button onClick={() => setIsDrawerOpen(true)} className="px-4 py-2 rounded-lg font-medium text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
                      Open Drawer
                    </button>
                    <SlidingDrawer items={navItems} isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
                  </ComponentPreview>
                </ComponentGrid>
              </div>
            </section>

            {/* Form Inputs Section */}
            <section className="mb-20">
              <SectionHeader 
                id="inputs"
                title="Form Inputs" 
                description="Animated form inputs with validation states, floating labels, and micro-interactions."
                count={8}
              />
              <ComponentGrid cols={2}>
                <ComponentPreview name="Floating Label" description="Label animates up on focus">
                  <div className="w-full max-w-xs">
                    <FloatingLabel label="Email address" value={inputValues.floating} onChange={v => setInputValues(p => ({ ...p, floating: v }))} />
                  </div>
                </ComponentPreview>
                <ComponentPreview name="Underline" description="Animated underline">
                  <div className="w-full max-w-xs">
                    <UnderlineInput placeholder="Type something..." value={inputValues.underline} onChange={v => setInputValues(p => ({ ...p, underline: v }))} />
                  </div>
                </ComponentPreview>
                <ComponentPreview name="Border Draw" description="Border draws on focus">
                  <div className="w-full max-w-xs">
                    <BorderInput placeholder="Focus me" value={inputValues.border} onChange={v => setInputValues(p => ({ ...p, border: v }))} />
                  </div>
                </ComponentPreview>
                <ComponentPreview name="Shake Error" description="Shakes on invalid (type 'error')">
                  <div className="w-full max-w-xs">
                    <ShakeInput placeholder="Type 'error'" value={inputValues.shake} onChange={v => { setInputValues(p => ({ ...p, shake: v })); setShakeInvalid(v.toLowerCase() === 'error') }} isInvalid={shakeInvalid} errorMessage="Invalid input!" />
                  </div>
                </ComponentPreview>
                <ComponentPreview name="Success State" description="Checkmark on valid (5+ chars)">
                  <div className="w-full max-w-xs">
                    <SuccessInput placeholder="Type 5+ characters" value={inputValues.success} onChange={v => setInputValues(p => ({ ...p, success: v }))} isValid={inputValues.success.length >= 5} />
                  </div>
                </ComponentPreview>
                <ComponentPreview name="Search Expand" description="Expands on focus">
                  <div className="w-full max-w-xs">
                    <SearchExpand value={inputValues.search} onChange={v => setInputValues(p => ({ ...p, search: v }))} />
                  </div>
                </ComponentPreview>
                <ComponentPreview name="Tag Input" description="Add/remove tags">
                  <div className="w-full max-w-xs">
                    <TagInput tags={tags} onTagsChange={setTags} placeholder="Add tag..." />
                  </div>
                </ComponentPreview>
                <ComponentPreview name="Password Strength" description="Visual strength meter">
                  <div className="w-full max-w-xs">
                    <PasswordStrength value={inputValues.password} onChange={v => setInputValues(p => ({ ...p, password: v }))} />
                  </div>
                </ComponentPreview>
              </ComponentGrid>
            </section>

            {/* Cards Section */}
            <section className="mb-20">
              <SectionHeader 
                id="cards"
                title="Cards" 
                description="Interactive card components with 3D effects, reveals, and hover animations."
                count={8}
              />
              <ComponentGrid cols={4}>
                <ComponentPreview name="Tilt Card" description="3D tilt on hover">
                  <TiltCard className="h-32 w-full">
                    <div className="flex flex-col items-center justify-center h-full">
                      <span className="text-2xl mb-1">🎯</span>
                      <span className="text-sm text-white/60">Move cursor</span>
                    </div>
                  </TiltCard>
                </ComponentPreview>
                <ComponentPreview name="Flip Card" description="Click to flip">
                  <FlipCard 
                    className="h-32 w-full" 
                    front={<div className="h-full flex flex-col items-center justify-center"><span className="text-2xl mb-1">🔄</span><span className="text-sm text-white/60">Click me</span></div>} 
                    back={<div className="h-full flex items-center justify-center"><span className="text-2xl">✨ Back!</span></div>} 
                  />
                </ComponentPreview>
                <ComponentPreview name="Shine Card" description="Shine on hover">
                  <ShineCard className="h-32 w-full">
                    <div className="flex flex-col items-center justify-center h-full">
                      <span className="text-2xl mb-1">✨</span>
                      <span className="text-sm text-white/60">Hover</span>
                    </div>
                  </ShineCard>
                </ComponentPreview>
                <ComponentPreview name="Lift Card" description="Lifts on hover">
                  <LiftCard className="h-32 w-full">
                    <div className="flex flex-col items-center justify-center h-full">
                      <span className="text-2xl mb-1">🚀</span>
                      <span className="text-sm text-white/60">Hover</span>
                    </div>
                  </LiftCard>
                </ComponentPreview>
                <ComponentPreview name="Border Card" description="Gradient border">
                  <BorderCard className="h-32 w-full">
                    <div className="flex flex-col items-center justify-center h-full">
                      <span className="text-2xl mb-1">🌈</span>
                      <span className="text-sm text-white/60">Gradient</span>
                    </div>
                  </BorderCard>
                </ComponentPreview>
                <ComponentPreview name="Reveal Card" description="Content reveal">
                  <RevealCard className="h-32 w-full" title="Reveal" description="Hidden content" image="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop" />
                </ComponentPreview>
                <ComponentPreview name="Stack Card" description="Stacked cards">
                  <StackCard className="h-32 w-full" cards={[
                    { id: 1, content: <div className="flex items-center justify-center h-full"><span className="text-xl">📚 Stack</span></div> },
                    { id: 2, content: <div className="flex items-center justify-center h-full">2</div> },
                    { id: 3, content: <div className="flex items-center justify-center h-full">3</div> }
                  ]} />
                </ComponentPreview>
                <ComponentPreview name="Magnetic Card" description="Follows cursor">
                  <MagneticCard className="h-32 w-full">
                    <div className="flex flex-col items-center justify-center h-full">
                      <span className="text-2xl mb-1">🧲</span>
                      <span className="text-sm text-white/60">Follow</span>
                    </div>
                  </MagneticCard>
                </ComponentPreview>
              </ComponentGrid>
            </section>

            {/* Toggles Section */}
            <section className="mb-20">
              <SectionHeader 
                id="toggles"
                title="Toggles" 
                description="Switch components with smooth animations and visual feedback."
                count={6}
              />
              <ComponentGrid cols={3}>
                <ComponentPreview name="Smooth" description="Smooth slide">
                  <SmoothToggle checked={toggleStates.smooth} onChange={v => setToggleStates(p => ({ ...p, smooth: v }))} />
                </ComponentPreview>
                <ComponentPreview name="Bounce" description="Bouncy animation">
                  <BounceToggle checked={toggleStates.bounce} onChange={v => setToggleStates(p => ({ ...p, bounce: v }))} />
                </ComponentPreview>
                <ComponentPreview name="Morph" description="Shape morph">
                  <MorphToggle checked={toggleStates.morph} onChange={v => setToggleStates(p => ({ ...p, morph: v }))} />
                </ComponentPreview>
                <ComponentPreview name="Day/Night" description="Icon toggle">
                  <IconToggle checked={toggleStates.icon} onChange={v => setToggleStates(p => ({ ...p, icon: v }))} />
                </ComponentPreview>
                <ComponentPreview name="Liquid" description="Liquid animation">
                  <LiquidToggle checked={toggleStates.liquid} onChange={v => setToggleStates(p => ({ ...p, liquid: v }))} />
                </ComponentPreview>
                <ComponentPreview name="Segmented" description="Multiple options">
                  <SegmentedToggle options={['A', 'B', 'C']} value={segmentValue} onChange={setSegmentValue} />
                </ComponentPreview>
              </ComponentGrid>
            </section>

            {/* Loaders Section */}
            <section className="mb-20">
              <SectionHeader 
                id="loaders"
                title="Loaders" 
                description="Loading indicators and progress animations."
                count={8}
              />
              <ComponentGrid cols={4}>
                <ComponentPreview name="Pulse" description="Pulsing dots">
                  <PulseLoader />
                </ComponentPreview>
                <ComponentPreview name="Orbit" description="Orbiting dots">
                  <OrbitLoader />
                </ComponentPreview>
                <ComponentPreview name="Morph" description="Shape morphing">
                  <MorphLoader />
                </ComponentPreview>
                <ComponentPreview name="Text" description="Loading text">
                  <TextLoader />
                </ComponentPreview>
                <ComponentPreview name="Progress" description="Progress bar">
                  <div className="w-full max-w-xs">
                    <ProgressLoader progress={65} />
                  </div>
                </ComponentPreview>
                <ComponentPreview name="Skeleton" description="Content skeleton">
                  <div className="w-full max-w-xs">
                    <SkeletonLoader />
                  </div>
                </ComponentPreview>
                <ComponentPreview name="Spinner" description="Classic spinner">
                  <SpinnerLoader />
                </ComponentPreview>
                <ComponentPreview name="Bar" description="Bar animation">
                  <BarLoader />
                </ComponentPreview>
              </ComponentGrid>
            </section>

            {/* Badges Section */}
            <section className="mb-20">
              <SectionHeader 
                id="badges"
                title="Badges" 
                description="Notification badges and status indicators with animations."
                count={7}
              />
              <div className="mb-4 flex items-center gap-4">
                <button 
                  onClick={() => setShowBadge(!showBadge)}
                  className="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded-lg text-white/80 transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
                >
                  Toggle Badges
                </button>
                <button 
                  onClick={() => setBadgeCount(c => c + 1)}
                  className="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded-lg text-white/80 transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
                >
                  + Count
                </button>
              </div>
              <ComponentGrid cols={4}>
                <ComponentPreview name="Pulse" description="Pulsing indicator">
                  <PulseBadge>
                    <div className="w-10 h-10 bg-white/10 rounded-lg" />
                  </PulseBadge>
                </ComponentPreview>
                <ComponentPreview name="Count" description="Animated count">
                  <div className="relative">
                    <div className="w-10 h-10 bg-white/10 rounded-lg" />
                    <CountBadge count={badgeCount} />
                  </div>
                </ComponentPreview>
                <ComponentPreview name="Shimmer" description="Shimmer effect">
                  <ShimmerBadge>New</ShimmerBadge>
                </ComponentPreview>
                <ComponentPreview name="Pop" description="Pop animation">
                  <PopBadge show={showBadge}>!</PopBadge>
                </ComponentPreview>
                <ComponentPreview name="Slide" description="Slide in">
                  <SlideBadge show={showBadge}>Update</SlideBadge>
                </ComponentPreview>
                <ComponentPreview name="Status" description="Status dot">
                  <div className="flex gap-4">
                    <StatusBadge status="online" />
                    <StatusBadge status="away" />
                    <StatusBadge status="offline" />
                  </div>
                </ComponentPreview>
                <ComponentPreview name="Tag" description="Removable tag">
                  <TagBadge onRemove={() => {}}>React</TagBadge>
                </ComponentPreview>
              </ComponentGrid>
            </section>

            {/* Tooltips Section */}
            <section className="mb-20">
              <SectionHeader 
                id="tooltips"
                title="Tooltips" 
                description="Informational tooltips with various animation styles."
                count={5}
              />
              <ComponentGrid cols={3}>
                <ComponentPreview name="Fade" description="Fade in/out">
                  <FadeTooltip content="Fade tooltip">
                    <button className="px-4 py-2 bg-white/10 rounded-lg">Hover me</button>
                  </FadeTooltip>
                </ComponentPreview>
                <ComponentPreview name="Scale" description="Scale animation">
                  <ScaleTooltip content="Scale tooltip">
                    <button className="px-4 py-2 bg-white/10 rounded-lg">Hover me</button>
                  </ScaleTooltip>
                </ComponentPreview>
                <ComponentPreview name="Slide" description="Slide in">
                  <SlideTooltip content="Slide tooltip">
                    <button className="px-4 py-2 bg-white/10 rounded-lg">Hover me</button>
                  </SlideTooltip>
                </ComponentPreview>
                <ComponentPreview name="Magnetic" description="Follows cursor">
                  <MagneticTooltip content="Magnetic tooltip">
                    <button className="px-4 py-2 bg-white/10 rounded-lg">Hover me</button>
                  </MagneticTooltip>
                </ComponentPreview>
                <ComponentPreview name="Rich" description="Rich content">
                  <RichTooltip content={<div><strong>Rich Tooltip</strong><p className="text-xs text-white/60 mt-1">With formatted content</p></div>}>
                    <button className="px-4 py-2 bg-white/10 rounded-lg">Hover me</button>
                  </RichTooltip>
                </ComponentPreview>
              </ComponentGrid>
            </section>

            {/* Menus Section */}
            <section className="mb-20">
              <SectionHeader 
                id="menus"
                title="Menus" 
                description="Dropdown and context menus with smooth animations."
                count={5}
              />
              <ComponentGrid cols={3}>
                <ComponentPreview name="Fade" description="Fade animation">
                  <FadeMenu items={menuItems} trigger={<button className="px-4 py-2 bg-white/10 rounded-lg">Open Menu</button>} />
                </ComponentPreview>
                <ComponentPreview name="Slide" description="Slide down">
                  <SlideMenu items={menuItems} trigger={<button className="px-4 py-2 bg-white/10 rounded-lg">Open Menu</button>} />
                </ComponentPreview>
                <ComponentPreview name="Scale" description="Scale from origin">
                  <ScaleMenu items={menuItems} trigger={<button className="px-4 py-2 bg-white/10 rounded-lg">Open Menu</button>} />
                </ComponentPreview>
                <ComponentPreview name="Blur" description="Blur backdrop">
                  <BlurMenu items={menuItems} trigger={<button className="px-4 py-2 bg-white/10 rounded-lg">Open Menu</button>} />
                </ComponentPreview>
                <ComponentPreview name="Stagger" description="Staggered items">
                  <StaggerMenu items={menuItems} trigger={<button className="px-4 py-2 bg-white/10 rounded-lg">Open Menu</button>} />
                </ComponentPreview>
              </ComponentGrid>
            </section>

            {/* Tabs Section */}
            <section className="mb-20">
              <SectionHeader 
                id="tabs"
                title="Tabs" 
                description="Tab components with different animation styles."
                count={5}
              />
              <div className="space-y-6">
                <ComponentPreview name="Slide Tabs" description="Sliding indicator">
                  <div className="w-full max-w-md">
                    <SlideTabs tabs={tabData} />
                  </div>
                </ComponentPreview>
                <ComponentPreview name="Fade Tabs" description="Fade transition">
                  <div className="w-full max-w-md">
                    <FadeTabs tabs={tabData} />
                  </div>
                </ComponentPreview>
                <ComponentPreview name="Underline Tabs" description="Underline indicator">
                  <div className="w-full max-w-md">
                    <UnderlineTabs tabs={tabData} />
                  </div>
                </ComponentPreview>
                <ComponentPreview name="Pill Tabs" description="Pill-shaped indicator">
                  <div className="w-full max-w-md">
                    <PillTabs tabs={tabData} />
                  </div>
                </ComponentPreview>
                <ComponentPreview name="Vertical Tabs" description="Vertical layout">
                  <div className="w-full max-w-md">
                    <VerticalTabs tabs={tabData} />
                  </div>
                </ComponentPreview>
              </div>
            </section>

          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-white/60 text-sm">
          <p>Built with React, TypeScript, Tailwind CSS, and Framer Motion</p>
        </div>
      </footer>
    </div>
  )
}

export function UIComponents() {
  return (
    <ThemeProvider>
      <UIComponentsContent />
    </ThemeProvider>
  )
}

export default UIComponents
