import { useState, useEffect } from 'react'
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

// Categories for sidebar navigation
const categories = [
  { id: 'buttons', label: 'Buttons', count: 17 },
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
        <code className="text-white/70 font-mono">{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded transition-colors text-white/60 hover:text-white focus-visible:ring-2 focus-visible:ring-white/50"
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
    <div className={`bg-neutral-900/50 border border-white/5 rounded-2xl overflow-hidden ${className}`}>
      {/* Preview Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div>
          <h3 className="font-semibold text-white">{name}</h3>
          {description && <p className="text-sm text-white/50 mt-0.5">{description}</p>}
        </div>
        {code && (
          <button
            onClick={() => setShowCode(!showCode)}
            className="px-3 py-1.5 text-xs font-medium bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-white/50"
          >
            <span>{showCode ? '</>' : '</>'}</span>
            {showCode ? 'Hide Code' : 'View Code'}
          </button>
        )}
      </div>
      
      {/* Preview Area */}
      <div className="p-8 min-h-[120px] flex items-center justify-center bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_100%)]">
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
    <div id={id} className="scroll-mt-24 mb-8">
      <div className="flex items-center gap-4 mb-2">
        <h2 className="text-3xl font-bold text-white">{title}</h2>
        <span className="px-2.5 py-1 text-xs font-medium bg-white/10 rounded-full text-white/60">{count} components</span>
      </div>
      <p className="text-white/50 text-lg max-w-2xl">{description}</p>
    </div>
  )
}

// Grid layouts for different component types
function ComponentGrid({ children, cols = 3 }: { children: React.ReactNode; cols?: 2 | 3 | 4 }) {
  const colClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }
  return <div className={`grid ${colClasses[cols]} gap-6`}>{children}</div>
}

// Sidebar Navigation
function Sidebar({ activeSection }: { activeSection: string }) {
  const { setPreset, currentPreset } = useTheme()

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-6 space-y-6">
        {/* Theme selector */}
        <div className="p-4 bg-neutral-900/50 border border-white/5 rounded-xl">
          <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Theme</p>
          <div className="flex flex-wrap gap-2">
            {(['indigo', 'rose', 'cyan', 'emerald', 'orange'] as const).map((preset) => (
              <button
                key={preset}
                onClick={() => setPreset(preset)}
                className={`w-8 h-8 rounded-lg transition-all capitalize focus-visible:ring-2 focus-visible:ring-white/50 ${
                  currentPreset === preset
                    ? 'ring-2 ring-white/30 ring-offset-2 ring-offset-neutral-950'
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
          <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3 px-3">Components</p>
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors focus-visible:ring-2 focus-visible:ring-white/50 ${
                activeSection === cat.id
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{cat.label}</span>
              <span className="text-xs text-white/30">{cat.count}</span>
            </a>
          ))}
        </nav>
      </div>
    </aside>
  )
}

// Mobile category tabs
function MobileTabs({ activeSection }: { activeSection: string }) {
  return (
    <div className="lg:hidden sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-md border-b border-white/5 -mx-6 px-6 py-3 mb-8 overflow-x-auto">
      <div className="flex gap-2 min-w-max">
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`#${cat.id}`}
            className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-white/50 ${
              activeSection === cat.id
                ? 'bg-white/10 text-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            {cat.label}
          </a>
        ))}
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
            <Link to="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors group">
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              <span>Back to Lab</span>
            </Link>
          </div>
          
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent">
              UI Components
            </h1>
            <p className="text-xl text-white/60 mb-6">
              A curated collection of animated, production-ready React components. 
              Beautiful interactions, smooth animations, and clean code.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-primary)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>72 Components</span>
              </div>
              <div className="flex items-center gap-2 text-white/40 text-sm">
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
                <h3 className="text-lg font-semibold text-white/80">Full Headers</h3>
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
                <h3 className="text-lg font-semibold text-white/80">Nav Link Animations</h3>
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
                <h3 className="text-lg font-semibold text-white/80 mt-10">Menu Components</h3>
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
                  className="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded-lg text-white/70"
                >
                  Toggle Badges
                </button>
                <button 
                  onClick={() => setBadgeCount(c => c + 1)}
                  className="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded-lg text-white/70"
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
        <div className="max-w-7xl mx-auto px-6 text-center text-white/40 text-sm">
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
