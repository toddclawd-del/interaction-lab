import { useState } from 'react'
import { Link } from 'react-router-dom'

// Import all components
import {
  MagneticButton,
  RippleButton,
  MorphButton,
  GlowButton,
  ShimmerButton,
  ElasticButton,
  BorderButton,
  GradientButton,
  TextSwapButton,
  IconRevealButton,
  SplitButton,
  LiquidButton,
  NeonButton,
  GlitchButton,
  ThreeDButton,
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

// Section component with premium styling
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-20">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-8 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
        <h2 className="text-2xl font-bold text-white tracking-tight">
          {title}
        </h2>
      </div>
      <div className="space-y-8">{children}</div>
    </section>
  )
}

// Component showcase wrapper with label
function ShowcaseRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800/50">
      <span className="w-36 text-sm text-neutral-400 font-medium shrink-0">{label}</span>
      {children}
    </div>
  )
}

// Component card wrapper for grid items
function ComponentCard({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center p-6 bg-neutral-900/50 rounded-xl border border-neutral-800/50 hover:border-neutral-700/50 transition-colors ${className}`}>
      <div className="flex-1 flex items-center justify-center w-full">
        {children}
      </div>
      <span className="mt-4 text-xs text-neutral-500 font-medium">{label}</span>
    </div>
  )
}

export function UIComponents() {
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
    { id: 'tab1', label: 'Overview', content: <p className="text-neutral-400">Overview content goes here. This is the first tab.</p> },
    { id: 'tab2', label: 'Features', content: <p className="text-neutral-400">Features content goes here. This is the second tab.</p> },
    { id: 'tab3', label: 'Pricing', content: <p className="text-neutral-400">Pricing content goes here. This is the third tab.</p> },
  ]

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-neutral-950/90 backdrop-blur-xl border-b border-neutral-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group">
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              <span>Back</span>
            </Link>
            <div className="h-6 w-px bg-neutral-800" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
              UI Components
            </h1>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 rounded-full border border-indigo-500/20">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            <p className="text-indigo-300 text-sm font-medium">72 micro-interactions</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Buttons Section */}
        <Section title="Buttons (15)">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <ComponentCard label="Magnetic">
              <MagneticButton>Magnetic</MagneticButton>
            </ComponentCard>
            <ComponentCard label="Ripple">
              <RippleButton>Ripple</RippleButton>
            </ComponentCard>
            <ComponentCard label="Morph">
              <MorphButton>Morph</MorphButton>
            </ComponentCard>
            <ComponentCard label="Glow">
              <GlowButton>Glow</GlowButton>
            </ComponentCard>
            <ComponentCard label="Shimmer">
              <ShimmerButton>Shimmer</ShimmerButton>
            </ComponentCard>
            <ComponentCard label="Elastic">
              <ElasticButton>Elastic</ElasticButton>
            </ComponentCard>
            <ComponentCard label="Border Draw">
              <BorderButton>Border Draw</BorderButton>
            </ComponentCard>
            <ComponentCard label="Gradient">
              <GradientButton>Gradient</GradientButton>
            </ComponentCard>
            <ComponentCard label="Text Swap">
              <TextSwapButton hoverText="Nice!">Text Swap</TextSwapButton>
            </ComponentCard>
            <ComponentCard label="Icon Reveal">
              <IconRevealButton icon="→">Icon Reveal</IconRevealButton>
            </ComponentCard>
            <ComponentCard label="Split">
              <SplitButton>Split Me</SplitButton>
            </ComponentCard>
            <ComponentCard label="Liquid">
              <LiquidButton>Liquid</LiquidButton>
            </ComponentCard>
            <ComponentCard label="Neon">
              <NeonButton>Neon</NeonButton>
            </ComponentCard>
            <ComponentCard label="Glitch">
              <GlitchButton>Glitch</GlitchButton>
            </ComponentCard>
            <ComponentCard label="3D Tilt">
              <ThreeDButton>3D Tilt</ThreeDButton>
            </ComponentCard>
          </div>
        </Section>

        {/* Navigation Section */}
        <Section title="Navigation (10)">
          <div className="space-y-4">
            <ShowcaseRow label="Magnetic Nav">
              <MagneticNav items={navItems} />
            </ShowcaseRow>
            
            <ShowcaseRow label="Underline Nav">
              <UnderlineNav items={navItems} />
            </ShowcaseRow>
            
            <ShowcaseRow label="Highlight Nav">
              <HighlightNav items={navItems} />
            </ShowcaseRow>
            
            <ShowcaseRow label="Split Text Nav">
              <SplitTextNav items={navItems} />
            </ShowcaseRow>
            
            <ShowcaseRow label="Rotate Nav">
              <RotateNav items={navItems} />
            </ShowcaseRow>
            
            <ShowcaseRow label="Blur Nav">
              <BlurNav items={navItems} />
            </ShowcaseRow>
            
            <ShowcaseRow label="Stagger Nav">
              <StaggerNav items={navItems} />
            </ShowcaseRow>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ComponentCard label="Hamburger Menu" className="h-24">
                <MorphingHamburger isOpen={hamburgerOpen} onToggle={() => setHamburgerOpen(!hamburgerOpen)} />
              </ComponentCard>
              
              <ComponentCard label="Circle Menu" className="h-24">
                <div className="relative" style={{ height: 100 }}>
                  <CircleMenu 
                    items={navItems}
                    isOpen={isCircleMenuOpen}
                    onToggle={() => setIsCircleMenuOpen(!isCircleMenuOpen)}
                  />
                </div>
              </ComponentCard>
              
              <ComponentCard label="Sliding Drawer" className="h-24">
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors text-white font-medium"
                >
                  Open Drawer
                </button>
                <SlidingDrawer
                  items={navItems}
                  isOpen={isDrawerOpen}
                  onClose={() => setIsDrawerOpen(false)}
                />
              </ComponentCard>
            </div>
          </div>
        </Section>

        {/* Form Inputs Section */}
        <Section title="Form Inputs (8)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-neutral-900/50 rounded-xl border border-neutral-800/50 space-y-2">
              <p className="text-xs text-neutral-500 font-medium mb-3">Floating Label Input</p>
              <FloatingLabel
                label="Email Address"
                value={inputValues.floating}
                onChange={v => setInputValues(prev => ({ ...prev, floating: v }))}
              />
            </div>
            
            <div className="p-6 bg-neutral-900/50 rounded-xl border border-neutral-800/50 space-y-2">
              <p className="text-xs text-neutral-500 font-medium mb-3">Underline Input</p>
              <UnderlineInput
                placeholder="Type something..."
                value={inputValues.underline}
                onChange={v => setInputValues(prev => ({ ...prev, underline: v }))}
              />
            </div>
            
            <div className="p-6 bg-neutral-900/50 rounded-xl border border-neutral-800/50 space-y-2">
              <p className="text-xs text-neutral-500 font-medium mb-3">Border Draw Input</p>
              <BorderInput
                placeholder="Focus to see border animation"
                value={inputValues.border}
                onChange={v => setInputValues(prev => ({ ...prev, border: v }))}
              />
            </div>
            
            <div className="p-6 bg-neutral-900/50 rounded-xl border border-neutral-800/50 space-y-2">
              <p className="text-xs text-neutral-500 font-medium mb-3">Shake Input (type "error")</p>
              <ShakeInput
                placeholder="Type 'error' to shake"
                value={inputValues.shake}
                onChange={v => {
                  setInputValues(prev => ({ ...prev, shake: v }))
                  setShakeInvalid(v.toLowerCase() === 'error')
                }}
                isInvalid={shakeInvalid}
                errorMessage="This field is invalid!"
              />
            </div>
            
            <div className="p-6 bg-neutral-900/50 rounded-xl border border-neutral-800/50 space-y-2">
              <p className="text-xs text-neutral-500 font-medium mb-3">Success Input (5+ chars)</p>
              <SuccessInput
                placeholder="Type 5+ characters"
                value={inputValues.success}
                onChange={v => setInputValues(prev => ({ ...prev, success: v }))}
                isValid={inputValues.success.length >= 5}
              />
            </div>
            
            <div className="p-6 bg-neutral-900/50 rounded-xl border border-neutral-800/50 space-y-2">
              <p className="text-xs text-neutral-500 font-medium mb-3">Expandable Search</p>
              <SearchExpand
                value={inputValues.search}
                onChange={v => setInputValues(prev => ({ ...prev, search: v }))}
              />
            </div>
            
            <div className="p-6 bg-neutral-900/50 rounded-xl border border-neutral-800/50 space-y-2">
              <p className="text-xs text-neutral-500 font-medium mb-3">Tag Input</p>
              <TagInput
                tags={tags}
                onTagsChange={setTags}
                placeholder="Add tags (press Enter)"
              />
            </div>
            
            <div className="p-6 bg-neutral-900/50 rounded-xl border border-neutral-800/50 space-y-2">
              <p className="text-xs text-neutral-500 font-medium mb-3">Password Strength</p>
              <PasswordStrength
                value={inputValues.password}
                onChange={v => setInputValues(prev => ({ ...prev, password: v }))}
              />
            </div>
          </div>
        </Section>

        {/* Cards Section */}
        <Section title="Cards (8)">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <TiltCard className="h-40 border border-neutral-700/50">
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <span className="text-2xl mb-2">🎯</span>
                  <h3 className="font-bold text-lg">Tilt Card</h3>
                  <p className="text-neutral-400 text-sm mt-1">Move cursor around</p>
                </div>
              </TiltCard>
              <p className="text-xs text-neutral-500 text-center font-medium">Tilt Card</p>
            </div>
            
            <div className="space-y-2">
              <FlipCard
                className="h-40"
                front={
                  <div className="h-full flex flex-col items-center justify-center border border-neutral-700/50 rounded-xl">
                    <span className="text-2xl mb-2">🔄</span>
                    <h3 className="font-bold text-lg">Flip Card</h3>
                    <p className="text-neutral-400 text-sm mt-1">Click to flip</p>
                  </div>
                }
                back={
                  <div className="h-full flex flex-col items-center justify-center text-white">
                    <span className="text-2xl mb-2">✨</span>
                    <h3 className="font-bold text-lg">Back Side!</h3>
                    <p className="text-indigo-200 text-sm mt-1">Click again</p>
                  </div>
                }
              />
              <p className="text-xs text-neutral-500 text-center font-medium">Flip Card</p>
            </div>
            
            <div className="space-y-2">
              <ShineCard className="h-40 border border-neutral-700/50">
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <span className="text-2xl mb-2">✨</span>
                  <h3 className="font-bold text-lg">Shine Card</h3>
                  <p className="text-neutral-400 text-sm mt-1">Hover for shine</p>
                </div>
              </ShineCard>
              <p className="text-xs text-neutral-500 text-center font-medium">Shine Card</p>
            </div>
            
            <div className="space-y-2">
              <LiftCard className="h-40 border border-neutral-700/50">
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <span className="text-2xl mb-2">🚀</span>
                  <h3 className="font-bold text-lg">Lift Card</h3>
                  <p className="text-neutral-400 text-sm mt-1">Hover to lift</p>
                </div>
              </LiftCard>
              <p className="text-xs text-neutral-500 text-center font-medium">Lift Card</p>
            </div>
            
            <div className="space-y-2">
              <BorderCard className="h-40">
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <span className="text-2xl mb-2">🌈</span>
                  <h3 className="font-bold text-lg">Border Card</h3>
                  <p className="text-neutral-400 text-sm mt-1">Gradient border</p>
                </div>
              </BorderCard>
              <p className="text-xs text-neutral-500 text-center font-medium">Border Card</p>
            </div>
            
            <div className="space-y-2">
              <RevealCard
                className="h-40"
                title="Reveal Card"
                description="Hidden content reveals on hover"
                image="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop"
              />
              <p className="text-xs text-neutral-500 text-center font-medium">Reveal Card</p>
            </div>
            
            <div className="space-y-2">
              <StackCard
                className="h-40"
                cards={[
                  { id: 1, content: <div className="flex flex-col items-center justify-center h-full text-center"><span className="text-2xl mb-2">📚</span><h3 className="font-bold">Stack Card</h3><p className="text-neutral-400 text-sm mt-1">Hover to spread</p></div> },
                  { id: 2, content: <div className="flex items-center justify-center h-full">Card 2</div> },
                  { id: 3, content: <div className="flex items-center justify-center h-full">Card 3</div> },
                ]}
              />
              <p className="text-xs text-neutral-500 text-center font-medium">Stack Card</p>
            </div>
            
            <div className="space-y-2">
              <MagneticCard className="h-40 border border-neutral-700/50">
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <span className="text-2xl mb-2">🧲</span>
                  <h3 className="font-bold text-lg">Magnetic Card</h3>
                  <p className="text-neutral-400 text-sm mt-1">Follows cursor</p>
                </div>
              </MagneticCard>
              <p className="text-xs text-neutral-500 text-center font-medium">Magnetic Card</p>
            </div>
          </div>
        </Section>

        {/* Toggles Section */}
        <Section title="Toggles (6)">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <ComponentCard label="Smooth Toggle">
              <SmoothToggle
                checked={toggleStates.smooth}
                onChange={v => setToggleStates(prev => ({ ...prev, smooth: v }))}
              />
            </ComponentCard>
            
            <ComponentCard label="Bounce Toggle">
              <BounceToggle
                checked={toggleStates.bounce}
                onChange={v => setToggleStates(prev => ({ ...prev, bounce: v }))}
              />
            </ComponentCard>
            
            <ComponentCard label="Morph Toggle">
              <MorphToggle
                checked={toggleStates.morph}
                onChange={v => setToggleStates(prev => ({ ...prev, morph: v }))}
              />
            </ComponentCard>
            
            <ComponentCard label="Day/Night Toggle">
              <IconToggle
                checked={toggleStates.icon}
                onChange={v => setToggleStates(prev => ({ ...prev, icon: v }))}
              />
            </ComponentCard>
            
            <ComponentCard label="Liquid Toggle">
              <LiquidToggle
                checked={toggleStates.liquid}
                onChange={v => setToggleStates(prev => ({ ...prev, liquid: v }))}
              />
            </ComponentCard>
          </div>
          
          <div className="mt-4 p-6 bg-neutral-900/50 rounded-xl border border-neutral-800/50">
            <p className="text-sm text-neutral-400 font-medium mb-4">Segmented Toggle</p>
            <SegmentedToggle
              options={['Option 1', 'Option 2', 'Option 3']}
              value={segmentValue}
              onChange={setSegmentValue}
            />
          </div>
        </Section>

        {/* Loaders Section */}
        <Section title="Loaders (8)">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ComponentCard label="Pulse">
              <PulseLoader />
            </ComponentCard>
            <ComponentCard label="Orbit">
              <OrbitLoader />
            </ComponentCard>
            <ComponentCard label="Morph">
              <MorphLoader />
            </ComponentCard>
            <ComponentCard label="Text">
              <TextLoader />
            </ComponentCard>
            <ComponentCard label="Spinner">
              <SpinnerLoader variant="default" />
            </ComponentCard>
            <ComponentCard label="Dots Spinner">
              <SpinnerLoader variant="dots" />
            </ComponentCard>
            <ComponentCard label="Bar">
              <BarLoader />
            </ComponentCard>
            <ComponentCard label="Progress" className="col-span-1">
              <div className="w-full px-2">
                <ProgressLoader progress={65} showPercentage />
              </div>
            </ComponentCard>
          </div>
          
          <div className="p-6 bg-neutral-900/50 rounded-xl border border-neutral-800/50 mt-4">
            <p className="text-sm text-neutral-400 font-medium mb-4">Skeleton Loader</p>
            <div className="flex gap-4 items-start">
              <SkeletonLoader width={48} height={48} rounded />
              <div className="flex-1 space-y-2">
                <SkeletonLoader height={16} />
                <SkeletonLoader width="60%" height={16} />
              </div>
            </div>
          </div>
        </Section>

        {/* Badges Section */}
        <Section title="Badges (7)">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <ComponentCard label="Pulse Badge">
              <PulseBadge count={3}>
                <div className="w-10 h-10 bg-neutral-700 rounded-lg flex items-center justify-center">
                  <span className="text-lg">📬</span>
                </div>
              </PulseBadge>
            </ComponentCard>
            
            <ComponentCard label="Count Badge">
              <div className="flex flex-col items-center gap-2">
                <CountBadge count={badgeCount} />
                <button
                  onClick={() => setBadgeCount(prev => prev + 5)}
                  className="text-xs text-neutral-500 hover:text-indigo-400 transition-colors"
                >
                  Click +5
                </button>
              </div>
            </ComponentCard>
            
            <ComponentCard label="Shimmer Badge">
              <ShimmerBadge>Shimmer</ShimmerBadge>
            </ComponentCard>
            
            <ComponentCard label="Pop Badge">
              <div className="flex flex-col items-center gap-2">
                <div className="h-6">
                  <PopBadge show={showBadge}>Pop!</PopBadge>
                </div>
                <button
                  onClick={() => setShowBadge(!showBadge)}
                  className="text-xs text-neutral-500 hover:text-indigo-400 transition-colors"
                >
                  Toggle
                </button>
              </div>
            </ComponentCard>
            
            <ComponentCard label="Slide Badge">
              <SlideBadge show={true}>Slide</SlideBadge>
            </ComponentCard>
            
            <ComponentCard label="Status Badge">
              <StatusBadge status="online" label="Online" />
            </ComponentCard>
            
            <ComponentCard label="Tag Badge">
              <TagBadge onRemove={() => {}}>Tag Badge</TagBadge>
            </ComponentCard>
          </div>
        </Section>

        {/* Tooltips Section */}
        <Section title="Tooltips (5)">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <ComponentCard label="Fade Tooltip">
              <FadeTooltip content="Fade tooltip appears smoothly">
                <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors text-white font-medium">
                  Hover Me
                </button>
              </FadeTooltip>
            </ComponentCard>
            
            <ComponentCard label="Scale Tooltip">
              <ScaleTooltip content="Scale tooltip pops in">
                <button className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors text-white font-medium">
                  Hover Me
                </button>
              </ScaleTooltip>
            </ComponentCard>
            
            <ComponentCard label="Slide Tooltip">
              <SlideTooltip content="Slide tooltip slides in">
                <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors text-white font-medium">
                  Hover Me
                </button>
              </SlideTooltip>
            </ComponentCard>
            
            <ComponentCard label="Magnetic Tooltip">
              <MagneticTooltip content="I follow your cursor!">
                <button className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors text-white font-medium">
                  Hover Me
                </button>
              </MagneticTooltip>
            </ComponentCard>
            
            <ComponentCard label="Rich Tooltip">
              <RichTooltip title="Rich Tooltip" content="Has title, arrow, and shadow">
                <button className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors text-white font-medium">
                  Hover Me
                </button>
              </RichTooltip>
            </ComponentCard>
          </div>
        </Section>

        {/* Menus Section */}
        <Section title="Dropdown Menus (5)">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <ComponentCard label="Fade Menu">
              <FadeMenu
                items={menuItems}
                trigger={
                  <button className="px-5 py-2.5 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors text-white font-medium flex items-center gap-2">
                    Fade <span className="text-xs">▼</span>
                  </button>
                }
              />
            </ComponentCard>
            
            <ComponentCard label="Slide Menu">
              <SlideMenu
                items={menuItems}
                trigger={
                  <button className="px-5 py-2.5 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors text-white font-medium flex items-center gap-2">
                    Slide <span className="text-xs">▼</span>
                  </button>
                }
              />
            </ComponentCard>
            
            <ComponentCard label="Scale Menu">
              <ScaleMenu
                items={menuItems}
                trigger={
                  <button className="px-5 py-2.5 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors text-white font-medium flex items-center gap-2">
                    Scale <span className="text-xs">▼</span>
                  </button>
                }
              />
            </ComponentCard>
            
            <ComponentCard label="Blur Menu">
              <BlurMenu
                items={menuItems}
                trigger={
                  <button className="px-5 py-2.5 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors text-white font-medium flex items-center gap-2">
                    Blur <span className="text-xs">▼</span>
                  </button>
                }
              />
            </ComponentCard>
            
            <ComponentCard label="Stagger Menu">
              <StaggerMenu
                items={menuItems}
                trigger={
                  <button className="px-5 py-2.5 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors text-white font-medium flex items-center gap-2">
                    Stagger <span className="text-xs">▼</span>
                  </button>
                }
              />
            </ComponentCard>
          </div>
        </Section>

        {/* Tabs Section */}
        <Section title="Tabs (5)">
          <div className="space-y-6">
            <div className="p-6 bg-neutral-900/50 rounded-xl border border-neutral-800/50">
              <p className="text-xs text-neutral-500 font-medium mb-4">Slide Tabs</p>
              <SlideTabs tabs={tabData} />
            </div>
            
            <div className="p-6 bg-neutral-900/50 rounded-xl border border-neutral-800/50">
              <p className="text-xs text-neutral-500 font-medium mb-4">Fade Tabs</p>
              <FadeTabs tabs={tabData} />
            </div>
            
            <div className="p-6 bg-neutral-900/50 rounded-xl border border-neutral-800/50">
              <p className="text-xs text-neutral-500 font-medium mb-4">Underline Tabs</p>
              <UnderlineTabs tabs={tabData} />
            </div>
            
            <div className="p-6 bg-neutral-900/50 rounded-xl border border-neutral-800/50">
              <p className="text-xs text-neutral-500 font-medium mb-4">Pill Tabs</p>
              <PillTabs tabs={tabData} />
            </div>
            
            <div className="p-6 bg-neutral-900/50 rounded-xl border border-neutral-800/50">
              <p className="text-xs text-neutral-500 font-medium mb-4">Vertical Tabs</p>
              <VerticalTabs tabs={tabData} />
            </div>
          </div>
        </Section>

        {/* Component Count */}
        <div className="text-center py-16 border-t border-neutral-800/50">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-full border border-indigo-500/20">
            <span className="text-2xl">✨</span>
            <p className="text-neutral-300">
              Total: <span className="text-white font-bold">72 micro-components</span> across <span className="text-indigo-400 font-semibold">10 categories</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default UIComponents
