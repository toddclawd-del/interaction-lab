import { useState } from 'react'
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

// Color Controls Component
function ColorControls() {
  const { colors, setColor, setPreset, currentPreset } = useTheme()

  return (
    <div className="sticky top-0 z-50 bg-neutral-950/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center gap-6">
        <span className="text-sm font-medium text-white/50">Theme</span>

        {/* Color pickers */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer">
            Primary
            <input
              type="color"
              value={colors.primary}
              onChange={(e) => setColor('primary', e.target.value)}
              className="w-8 h-8 rounded-md cursor-pointer border-0 bg-transparent"
            />
          </label>
          <label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer">
            Secondary
            <input
              type="color"
              value={colors.secondary}
              onChange={(e) => setColor('secondary', e.target.value)}
              className="w-8 h-8 rounded-md cursor-pointer border-0 bg-transparent"
            />
          </label>
          <label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer">
            Accent
            <input
              type="color"
              value={colors.accent}
              onChange={(e) => setColor('accent', e.target.value)}
              className="w-8 h-8 rounded-md cursor-pointer border-0 bg-transparent"
            />
          </label>
        </div>

        {/* Preset buttons */}
        <div className="flex gap-2">
          {(['indigo', 'rose', 'cyan', 'emerald', 'orange'] as const).map((preset) => (
            <button
              key={preset}
              onClick={() => setPreset(preset)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all capitalize ${
                currentPreset === preset
                  ? 'bg-white/20 text-white ring-1 ring-white/30'
                  : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Section component with premium styling
function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
        <span className="w-1 h-6 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
        {title}
        <span className="text-sm font-normal text-white/40">({count})</span>
      </h2>
      <div className="space-y-6">{children}</div>
    </section>
  )
}

// Component card wrapper for grid items
function ComponentCard({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center p-6 bg-neutral-900 rounded-xl border border-white/5 hover:border-white/10 transition-colors ${className}`}>
      <div className="flex-1 flex items-center justify-center w-full min-h-[60px]">
        {children}
      </div>
      <span className="mt-4 text-xs text-white/40 font-medium">{label}</span>
    </div>
  )
}

// Showcase row for inline components
function ShowcaseRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-4 p-5 bg-neutral-900 rounded-xl border border-white/5">
      <span className="w-32 text-sm text-white/50 font-medium shrink-0">{label}</span>
      {children}
    </div>
  )
}

function UIComponentsContent() {
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

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <ColorControls />

      {/* Header */}
      <header className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back</span>
          </Link>
          <div className="h-6 w-px bg-white/10" />
          <h1 className="text-3xl font-bold">UI Components</h1>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10" style={{ backgroundColor: 'rgba(var(--color-primary-rgb), 0.1)' }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-primary)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>72 micro-interactions</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 pb-16">

        {/* Buttons Section */}
        <Section title="Buttons" count={15}>
          <p className="text-white/50 text-sm mb-6 -mt-2">Hover, click, and interact with each button to see the effects</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <ComponentCard label="Glassmorphism"><GlassmorphismButton>Glass</GlassmorphismButton></ComponentCard>
            <ComponentCard label="Neumorphic"><NeumorphicButton>Soft UI</NeumorphicButton></ComponentCard>
            <ComponentCard label="Aurora"><AuroraButton>Aurora</AuroraButton></ComponentCard>
            <ComponentCard label="Holographic"><HolographicButton>Holo</HolographicButton></ComponentCard>
            <ComponentCard label="Underline"><UnderlineTextButton>Underline</UnderlineTextButton></ComponentCard>
            <ComponentCard label="Ghost Fill"><GhostOutlineButton>Ghost</GhostOutlineButton></ComponentCard>
            <ComponentCard label="3D Layers"><LayeredDepthButton>Layers</LayeredDepthButton></ComponentCard>
            <ComponentCard label="Magnetic"><MagneticPremiumButton>Magnetic</MagneticPremiumButton></ComponentCard>
            <ComponentCard label="Liquid Metal"><LiquidMetalButton>Chrome</LiquidMetalButton></ComponentCard>
            <ComponentCard label="Blob Morph"><MorphingBlobButton>Blob</MorphingBlobButton></ComponentCard>
            <ComponentCard label="Cyberpunk"><CyberpunkNeonButton>Neon</CyberpunkNeonButton></ComponentCard>
            <ComponentCard label="Particles"><ParticleBurstButton>Burst</ParticleBurstButton></ComponentCard>
            <ComponentCard label="Scramble"><TextScrambleButton>Decode</TextScrambleButton></ComponentCard>
            <ComponentCard label="Border Flow"><BorderFlowButton>Flow</BorderFlowButton></ComponentCard>
            <ComponentCard label="Depth"><DepthShadowButton>Depth</DepthShadowButton></ComponentCard>
          </div>
        </Section>

        {/* Navigation Section */}
        <Section title="Navigation" count={10}>
          <div className="space-y-4">
            <ShowcaseRow label="Magnetic"><MagneticNav items={navItems} /></ShowcaseRow>
            <ShowcaseRow label="Underline"><UnderlineNav items={navItems} /></ShowcaseRow>
            <ShowcaseRow label="Highlight"><HighlightNav items={navItems} /></ShowcaseRow>
            <ShowcaseRow label="Split Text"><SplitTextNav items={navItems} /></ShowcaseRow>
            <ShowcaseRow label="Rotate"><RotateNav items={navItems} /></ShowcaseRow>
            <ShowcaseRow label="Blur"><BlurNav items={navItems} /></ShowcaseRow>
            <ShowcaseRow label="Stagger"><StaggerNav items={navItems} /></ShowcaseRow>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ComponentCard label="Hamburger" className="h-28">
                <MorphingHamburger isOpen={hamburgerOpen} onToggle={() => setHamburgerOpen(!hamburgerOpen)} />
              </ComponentCard>
              <ComponentCard label="Circle Menu" className="h-28">
                <div className="relative" style={{ height: 100 }}>
                  <CircleMenu items={navItems} isOpen={isCircleMenuOpen} onToggle={() => setIsCircleMenuOpen(!isCircleMenuOpen)} />
                </div>
              </ComponentCard>
              <ComponentCard label="Drawer" className="h-28">
                <button onClick={() => setIsDrawerOpen(true)} className="px-4 py-2 rounded-lg font-medium text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
                  Open
                </button>
                <SlidingDrawer items={navItems} isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
              </ComponentCard>
            </div>
          </div>
        </Section>

        {/* Form Inputs Section */}
        <Section title="Form Inputs" count={8}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-neutral-900 rounded-xl border border-white/5">
              <p className="text-xs text-white/40 mb-3">Floating Label</p>
              <FloatingLabel label="Email" value={inputValues.floating} onChange={v => setInputValues(p => ({ ...p, floating: v }))} />
            </div>
            <div className="p-6 bg-neutral-900 rounded-xl border border-white/5">
              <p className="text-xs text-white/40 mb-3">Underline</p>
              <UnderlineInput placeholder="Type..." value={inputValues.underline} onChange={v => setInputValues(p => ({ ...p, underline: v }))} />
            </div>
            <div className="p-6 bg-neutral-900 rounded-xl border border-white/5">
              <p className="text-xs text-white/40 mb-3">Border Draw</p>
              <BorderInput placeholder="Focus me" value={inputValues.border} onChange={v => setInputValues(p => ({ ...p, border: v }))} />
            </div>
            <div className="p-6 bg-neutral-900 rounded-xl border border-white/5">
              <p className="text-xs text-white/40 mb-3">Shake (type "error")</p>
              <ShakeInput placeholder="Type error" value={inputValues.shake} onChange={v => { setInputValues(p => ({ ...p, shake: v })); setShakeInvalid(v.toLowerCase() === 'error') }} isInvalid={shakeInvalid} errorMessage="Invalid!" />
            </div>
            <div className="p-6 bg-neutral-900 rounded-xl border border-white/5">
              <p className="text-xs text-white/40 mb-3">Success (5+ chars)</p>
              <SuccessInput placeholder="5+ chars" value={inputValues.success} onChange={v => setInputValues(p => ({ ...p, success: v }))} isValid={inputValues.success.length >= 5} />
            </div>
            <div className="p-6 bg-neutral-900 rounded-xl border border-white/5">
              <p className="text-xs text-white/40 mb-3">Search Expand</p>
              <SearchExpand value={inputValues.search} onChange={v => setInputValues(p => ({ ...p, search: v }))} />
            </div>
            <div className="p-6 bg-neutral-900 rounded-xl border border-white/5">
              <p className="text-xs text-white/40 mb-3">Tag Input</p>
              <TagInput tags={tags} onTagsChange={setTags} placeholder="Add tags" />
            </div>
            <div className="p-6 bg-neutral-900 rounded-xl border border-white/5">
              <p className="text-xs text-white/40 mb-3">Password Strength</p>
              <PasswordStrength value={inputValues.password} onChange={v => setInputValues(p => ({ ...p, password: v }))} />
            </div>
          </div>
        </Section>

        {/* Cards Section */}
        <Section title="Cards" count={8}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <TiltCard className="h-40"><div className="flex flex-col items-center justify-center h-full text-center"><span className="text-2xl mb-2">🎯</span><h3 className="font-bold">Tilt</h3><p className="text-white/50 text-sm">Move cursor</p></div></TiltCard>
              <p className="text-xs text-white/40 text-center">Tilt Card</p>
            </div>
            <div className="space-y-2">
              <FlipCard className="h-40" front={<div className="h-full flex flex-col items-center justify-center"><span className="text-2xl mb-2">🔄</span><h3 className="font-bold">Flip</h3><p className="text-white/50 text-sm">Click me</p></div>} back={<div className="h-full flex flex-col items-center justify-center"><span className="text-2xl mb-2">✨</span><h3 className="font-bold">Back!</h3></div>} />
              <p className="text-xs text-white/40 text-center">Flip Card</p>
            </div>
            <div className="space-y-2">
              <ShineCard className="h-40"><div className="flex flex-col items-center justify-center h-full text-center"><span className="text-2xl mb-2">✨</span><h3 className="font-bold">Shine</h3><p className="text-white/50 text-sm">Hover</p></div></ShineCard>
              <p className="text-xs text-white/40 text-center">Shine Card</p>
            </div>
            <div className="space-y-2">
              <LiftCard className="h-40"><div className="flex flex-col items-center justify-center h-full text-center"><span className="text-2xl mb-2">🚀</span><h3 className="font-bold">Lift</h3><p className="text-white/50 text-sm">Hover</p></div></LiftCard>
              <p className="text-xs text-white/40 text-center">Lift Card</p>
            </div>
            <div className="space-y-2">
              <BorderCard className="h-40"><div className="flex flex-col items-center justify-center h-full text-center"><span className="text-2xl mb-2">🌈</span><h3 className="font-bold">Border</h3><p className="text-white/50 text-sm">Gradient</p></div></BorderCard>
              <p className="text-xs text-white/40 text-center">Border Card</p>
            </div>
            <div className="space-y-2">
              <RevealCard className="h-40" title="Reveal" description="Hidden content" image="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop" />
              <p className="text-xs text-white/40 text-center">Reveal Card</p>
            </div>
            <div className="space-y-2">
              <StackCard className="h-40" cards={[{ id: 1, content: <div className="flex flex-col items-center justify-center h-full"><span className="text-2xl mb-2">📚</span><h3 className="font-bold">Stack</h3></div> }, { id: 2, content: <div className="flex items-center justify-center h-full">2</div> }, { id: 3, content: <div className="flex items-center justify-center h-full">3</div> }]} />
              <p className="text-xs text-white/40 text-center">Stack Card</p>
            </div>
            <div className="space-y-2">
              <MagneticCard className="h-40"><div className="flex flex-col items-center justify-center h-full text-center"><span className="text-2xl mb-2">🧲</span><h3 className="font-bold">Magnetic</h3><p className="text-white/50 text-sm">Follow</p></div></MagneticCard>
              <p className="text-xs text-white/40 text-center">Magnetic Card</p>
            </div>
          </div>
        </Section>

        {/* Toggles Section */}
        <Section title="Toggles" count={6}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <ComponentCard label="Smooth"><SmoothToggle checked={toggleStates.smooth} onChange={v => setToggleStates(p => ({ ...p, smooth: v }))} /></ComponentCard>
            <ComponentCard label="Bounce"><BounceToggle checked={toggleStates.bounce} onChange={v => setToggleStates(p => ({ ...p, bounce: v }))} /></ComponentCard>
            <ComponentCard label="Morph"><MorphToggle checked={toggleStates.morph} onChange={v => setToggleStates(p => ({ ...p, morph: v }))} /></ComponentCard>
            <ComponentCard label="Day/Night"><IconToggle checked={toggleStates.icon} onChange={v => setToggleStates(p => ({ ...p, icon: v }))} /></ComponentCard>
            <ComponentCard label="Liquid"><LiquidToggle checked={toggleStates.liquid} onChange={v => setToggleStates(p => ({ ...p, liquid: v }))} /></ComponentCard>
          </div>
          <div className="p-6 bg-neutral-900 rounded-xl border border-white/5">
            <p className="text-sm text-white/40 mb-4">Segmented Toggle</p>
            <SegmentedToggle options={['Option 1', 'Option 2', 'Option 3']} value={segmentValue} onChange={setSegmentValue} />
          </div>
        </Section>

        {/* Loaders Section */}
        <Section title="Loaders" count={8}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ComponentCard label="Pulse"><PulseLoader /></ComponentCard>
            <ComponentCard label="Orbit"><OrbitLoader /></ComponentCard>
            <ComponentCard label="Morph"><MorphLoader /></ComponentCard>
            <ComponentCard label="Text"><TextLoader /></ComponentCard>
            <ComponentCard label="Spinner"><SpinnerLoader variant="default" /></ComponentCard>
            <ComponentCard label="Dots"><SpinnerLoader variant="dots" /></ComponentCard>
            <ComponentCard label="Bar"><BarLoader /></ComponentCard>
            <ComponentCard label="Progress"><div className="w-full px-2"><ProgressLoader progress={65} showPercentage /></div></ComponentCard>
          </div>
          <div className="p-6 bg-neutral-900 rounded-xl border border-white/5">
            <p className="text-sm text-white/40 mb-4">Skeleton</p>
            <div className="flex gap-4 items-start">
              <SkeletonLoader width={48} height={48} rounded />
              <div className="flex-1 space-y-2"><SkeletonLoader height={16} /><SkeletonLoader width="60%" height={16} /></div>
            </div>
          </div>
        </Section>

        {/* Badges Section */}
        <Section title="Badges" count={7}>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <ComponentCard label="Pulse"><PulseBadge count={3}><div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center">📬</div></PulseBadge></ComponentCard>
            <ComponentCard label="Count"><div className="flex flex-col items-center gap-2"><CountBadge count={badgeCount} /><button onClick={() => setBadgeCount(p => p + 5)} className="text-xs text-white/50">+5</button></div></ComponentCard>
            <ComponentCard label="Shimmer"><ShimmerBadge>Shimmer</ShimmerBadge></ComponentCard>
            <ComponentCard label="Pop"><div className="flex flex-col items-center gap-2"><div className="h-6"><PopBadge show={showBadge}>Pop!</PopBadge></div><button onClick={() => setShowBadge(!showBadge)} className="text-xs text-white/50">Toggle</button></div></ComponentCard>
            <ComponentCard label="Slide"><SlideBadge show>Slide</SlideBadge></ComponentCard>
            <ComponentCard label="Status"><StatusBadge status="online" label="Online" /></ComponentCard>
            <ComponentCard label="Tag"><TagBadge onRemove={() => {}}>Tag</TagBadge></ComponentCard>
          </div>
        </Section>

        {/* Tooltips Section */}
        <Section title="Tooltips" count={5}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <ComponentCard label="Glassmorphism"><FadeTooltip content="Frosted glass effect">Hover me</FadeTooltip></ComponentCard>
            <ComponentCard label="Aurora"><ScaleTooltip content="Flowing gradient">Hover me</ScaleTooltip></ComponentCard>
            <ComponentCard label="Neumorphic"><SlideTooltip content="Soft 3D depth">Hover me</SlideTooltip></ComponentCard>
            <ComponentCard label="Magnetic"><MagneticTooltip content="Follows cursor">Hover me</MagneticTooltip></ComponentCard>
            <ComponentCard label="Holographic"><RichTooltip content="Iridescent effect">Hover me</RichTooltip></ComponentCard>
          </div>
        </Section>

        {/* Menus Section */}
        <Section title="Menus" count={5}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <ComponentCard label="Glassmorphism"><FadeMenu items={menuItems} trigger="Menu" /></ComponentCard>
            <ComponentCard label="Aurora"><SlideMenu items={menuItems} trigger="Menu" /></ComponentCard>
            <ComponentCard label="Neumorphic"><ScaleMenu items={menuItems} trigger="Menu" /></ComponentCard>
            <ComponentCard label="Cyberpunk"><BlurMenu items={menuItems} trigger="Menu" /></ComponentCard>
            <ComponentCard label="Layered"><StaggerMenu items={menuItems} trigger="Menu" /></ComponentCard>
          </div>
        </Section>

        {/* Tabs Section */}
        <Section title="Tabs" count={5}>
          <div className="space-y-4">
            <div className="p-6 bg-neutral-900/50 rounded-2xl border border-white/5"><p className="text-xs text-white/40 mb-4">Glassmorphism Tabs</p><SlideTabs tabs={tabData} /></div>
            <div className="p-6 bg-neutral-900/50 rounded-2xl border border-white/5"><p className="text-xs text-white/40 mb-4">Aurora Tabs</p><FadeTabs tabs={tabData} /></div>
            <div className="p-6 bg-neutral-900/50 rounded-2xl border border-white/5"><p className="text-xs text-white/40 mb-4">Neumorphic Tabs</p><UnderlineTabs tabs={tabData} /></div>
            <div className="p-6 bg-neutral-900/50 rounded-2xl border border-white/5"><p className="text-xs text-white/40 mb-4">Cyberpunk Tabs</p><PillTabs tabs={tabData} /></div>
            <div className="p-6 bg-neutral-900/50 rounded-2xl border border-white/5"><p className="text-xs text-white/40 mb-4">Vertical Premium Tabs</p><VerticalTabs tabs={tabData} /></div>
          </div>
        </Section>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-white/5">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border" style={{ borderColor: 'rgba(var(--color-primary-rgb), 0.2)', background: 'linear-gradient(to right, rgba(var(--color-primary-rgb), 0.1), rgba(var(--color-secondary-rgb), 0.1))' }}>
            <span className="text-2xl">✨</span>
            <p className="text-white/70">Total: <span className="text-white font-bold">72 micro-components</span> across <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>10 categories</span></p>
          </div>
        </div>
      </main>
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
