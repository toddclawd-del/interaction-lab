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

// Section component
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold text-white mb-6 pb-2 border-b border-neutral-800">
        {title}
      </h2>
      <div className="space-y-8">{children}</div>
    </section>
  )
}

// Component showcase wrapper
function ShowcaseRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <span className="w-36 text-sm text-neutral-500 shrink-0">{label}</span>
      {children}
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
      <header className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-lg border-b border-neutral-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-neutral-500 hover:text-white transition-colors">
              ← Back
            </Link>
            <h1 className="text-xl font-bold">UI Components</h1>
          </div>
          <p className="text-neutral-500 text-sm">50+ micro-interactions</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Buttons Section */}
        <Section title="Buttons (15)">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <MagneticButton>Magnetic</MagneticButton>
            <RippleButton>Ripple</RippleButton>
            <MorphButton>Morph</MorphButton>
            <GlowButton>Glow</GlowButton>
            <ShimmerButton>Shimmer</ShimmerButton>
            <ElasticButton>Elastic</ElasticButton>
            <BorderButton>Border Draw</BorderButton>
            <GradientButton>Gradient</GradientButton>
            <TextSwapButton hoverText="Nice!">Text Swap</TextSwapButton>
            <IconRevealButton icon="→">Icon Reveal</IconRevealButton>
            <SplitButton>Split Me</SplitButton>
            <LiquidButton>Liquid</LiquidButton>
            <NeonButton>Neon</NeonButton>
            <GlitchButton>Glitch</GlitchButton>
            <ThreeDButton>3D Tilt</ThreeDButton>
          </div>
        </Section>

        {/* Navigation Section */}
        <Section title="Navigation (10)">
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
          
          <ShowcaseRow label="Hamburger Menu">
            <MorphingHamburger isOpen={hamburgerOpen} onToggle={() => setHamburgerOpen(!hamburgerOpen)} />
          </ShowcaseRow>
          
          <ShowcaseRow label="Circle Menu">
            <CircleMenu 
              items={navItems}
              isOpen={isCircleMenuOpen}
              onToggle={() => setIsCircleMenuOpen(!isCircleMenuOpen)}
            />
          </ShowcaseRow>
          
          <ShowcaseRow label="Sliding Drawer">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
            >
              Open Drawer
            </button>
            <SlidingDrawer
              items={navItems}
              isOpen={isDrawerOpen}
              onClose={() => setIsDrawerOpen(false)}
            />
          </ShowcaseRow>
        </Section>

        {/* Form Inputs Section */}
        <Section title="Form Inputs (8)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <FloatingLabel
              label="Floating Label"
              value={inputValues.floating}
              onChange={v => setInputValues(prev => ({ ...prev, floating: v }))}
            />
            
            <UnderlineInput
              placeholder="Underline Input"
              value={inputValues.underline}
              onChange={v => setInputValues(prev => ({ ...prev, underline: v }))}
            />
            
            <BorderInput
              placeholder="Border Draw Input"
              value={inputValues.border}
              onChange={v => setInputValues(prev => ({ ...prev, border: v }))}
            />
            
            <div>
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
            
            <SuccessInput
              placeholder="Type 5+ chars for success"
              value={inputValues.success}
              onChange={v => setInputValues(prev => ({ ...prev, success: v }))}
              isValid={inputValues.success.length >= 5}
            />
            
            <SearchExpand
              value={inputValues.search}
              onChange={v => setInputValues(prev => ({ ...prev, search: v }))}
            />
            
            <TagInput
              tags={tags}
              onTagsChange={setTags}
              placeholder="Add tags (press Enter)"
            />
            
            <PasswordStrength
              value={inputValues.password}
              onChange={v => setInputValues(prev => ({ ...prev, password: v }))}
            />
          </div>
        </Section>

        {/* Cards Section */}
        <Section title="Cards (8)">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <TiltCard className="h-40">
              <h3 className="font-bold text-lg">Tilt Card</h3>
              <p className="text-neutral-400 text-sm mt-2">Move your cursor around</p>
            </TiltCard>
            
            <FlipCard
              className="h-40"
              front={
                <div className="h-full flex flex-col items-center justify-center">
                  <h3 className="font-bold text-lg">Flip Card</h3>
                  <p className="text-neutral-400 text-sm mt-2">Click to flip</p>
                </div>
              }
              back={
                <div className="h-full flex flex-col items-center justify-center text-white">
                  <h3 className="font-bold text-lg">Back Side!</h3>
                  <p className="text-indigo-200 text-sm mt-2">Click again</p>
                </div>
              }
            />
            
            <ShineCard className="h-40">
              <h3 className="font-bold text-lg">Shine Card</h3>
              <p className="text-neutral-400 text-sm mt-2">Hover for shine sweep</p>
            </ShineCard>
            
            <LiftCard className="h-40">
              <h3 className="font-bold text-lg">Lift Card</h3>
              <p className="text-neutral-400 text-sm mt-2">Hover to lift</p>
            </LiftCard>
            
            <BorderCard className="h-40">
              <h3 className="font-bold text-lg">Border Card</h3>
              <p className="text-neutral-400 text-sm mt-2">Animated gradient border</p>
            </BorderCard>
            
            <RevealCard
              className="h-40"
              title="Reveal Card"
              description="Hidden content reveals on hover with smooth animation"
              image="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop"
            />
            
            <StackCard
              className="h-40"
              cards={[
                { id: 1, content: <div><h3 className="font-bold">Stack Card</h3><p className="text-neutral-400 text-sm mt-2">Hover to spread</p></div> },
                { id: 2, content: <div>Card 2</div> },
                { id: 3, content: <div>Card 3</div> },
              ]}
            />
            
            <MagneticCard className="h-40">
              <h3 className="font-bold text-lg">Magnetic Card</h3>
              <p className="text-neutral-400 text-sm mt-2">Follows cursor slightly</p>
            </MagneticCard>
          </div>
        </Section>

        {/* Toggles Section */}
        <Section title="Toggles (6)">
          <div className="flex flex-wrap gap-8 items-center">
            <ShowcaseRow label="Smooth">
              <SmoothToggle
                checked={toggleStates.smooth}
                onChange={v => setToggleStates(prev => ({ ...prev, smooth: v }))}
              />
            </ShowcaseRow>
            
            <ShowcaseRow label="Bounce">
              <BounceToggle
                checked={toggleStates.bounce}
                onChange={v => setToggleStates(prev => ({ ...prev, bounce: v }))}
              />
            </ShowcaseRow>
            
            <ShowcaseRow label="Morph">
              <MorphToggle
                checked={toggleStates.morph}
                onChange={v => setToggleStates(prev => ({ ...prev, morph: v }))}
              />
            </ShowcaseRow>
            
            <ShowcaseRow label="Icon (Day/Night)">
              <IconToggle
                checked={toggleStates.icon}
                onChange={v => setToggleStates(prev => ({ ...prev, icon: v }))}
              />
            </ShowcaseRow>
            
            <ShowcaseRow label="Liquid">
              <LiquidToggle
                checked={toggleStates.liquid}
                onChange={v => setToggleStates(prev => ({ ...prev, liquid: v }))}
              />
            </ShowcaseRow>
          </div>
          
          <div className="mt-8">
            <ShowcaseRow label="Segmented">
              <SegmentedToggle
                options={['Option 1', 'Option 2', 'Option 3']}
                value={segmentValue}
                onChange={setSegmentValue}
              />
            </ShowcaseRow>
          </div>
        </Section>

        {/* Loaders Section */}
        <Section title="Loaders (8)">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center gap-4">
              <PulseLoader />
              <span className="text-sm text-neutral-500">Pulse</span>
            </div>
            <div className="flex flex-col items-center gap-4">
              <OrbitLoader />
              <span className="text-sm text-neutral-500">Orbit</span>
            </div>
            <div className="flex flex-col items-center gap-4">
              <MorphLoader />
              <span className="text-sm text-neutral-500">Morph</span>
            </div>
            <div className="flex flex-col items-center gap-4">
              <TextLoader />
              <span className="text-sm text-neutral-500">Text</span>
            </div>
            <div className="flex flex-col items-center gap-4">
              <SpinnerLoader variant="default" />
              <span className="text-sm text-neutral-500">Spinner</span>
            </div>
            <div className="flex flex-col items-center gap-4">
              <SpinnerLoader variant="dots" />
              <span className="text-sm text-neutral-500">Dots Spinner</span>
            </div>
            <div className="flex flex-col items-center gap-4">
              <BarLoader />
              <span className="text-sm text-neutral-500">Bar</span>
            </div>
            <div className="flex flex-col items-center gap-4 w-full">
              <ProgressLoader progress={65} showPercentage />
              <span className="text-sm text-neutral-500">Progress</span>
            </div>
          </div>
          
          <div className="mt-8">
            <p className="text-sm text-neutral-500 mb-4">Skeleton Loader:</p>
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
          <div className="flex flex-wrap gap-8 items-center">
            <div className="flex flex-col items-center gap-2">
              <PulseBadge count={3}>
                <div className="w-10 h-10 bg-neutral-800 rounded-lg" />
              </PulseBadge>
              <span className="text-sm text-neutral-500">Pulse Badge</span>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <CountBadge count={badgeCount} />
              <button
                onClick={() => setBadgeCount(prev => prev + 5)}
                className="text-sm text-neutral-500 hover:text-white"
              >
                +5 Count Badge
              </button>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <ShimmerBadge>Shimmer</ShimmerBadge>
              <span className="text-sm text-neutral-500">Shimmer Badge</span>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <PopBadge show={showBadge}>Pop!</PopBadge>
              <button
                onClick={() => setShowBadge(!showBadge)}
                className="text-sm text-neutral-500 hover:text-white"
              >
                Toggle Pop Badge
              </button>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <SlideBadge show={true}>Slide</SlideBadge>
              <span className="text-sm text-neutral-500">Slide Badge</span>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <StatusBadge status="online" label="Online" />
              <span className="text-sm text-neutral-500">Status Badge</span>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <TagBadge onRemove={() => {}}>Tag Badge</TagBadge>
              <span className="text-sm text-neutral-500">Tag Badge</span>
            </div>
          </div>
        </Section>

        {/* Tooltips Section */}
        <Section title="Tooltips (5)">
          <div className="flex flex-wrap gap-8">
            <FadeTooltip content="Fade tooltip">
              <button className="px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors">
                Fade
              </button>
            </FadeTooltip>
            
            <ScaleTooltip content="Scale tooltip">
              <button className="px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors">
                Scale
              </button>
            </ScaleTooltip>
            
            <SlideTooltip content="Slide tooltip">
              <button className="px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors">
                Slide
              </button>
            </SlideTooltip>
            
            <MagneticTooltip content="I follow your cursor!">
              <button className="px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors">
                Magnetic
              </button>
            </MagneticTooltip>
            
            <RichTooltip title="Rich Tooltip" content="This has a title, arrow, and shadow">
              <button className="px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors">
                Rich
              </button>
            </RichTooltip>
          </div>
        </Section>

        {/* Menus Section */}
        <Section title="Dropdown Menus (5)">
          <div className="flex flex-wrap gap-8">
            <FadeMenu
              items={menuItems}
              trigger={
                <button className="px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors">
                  Fade Menu ▼
                </button>
              }
            />
            
            <SlideMenu
              items={menuItems}
              trigger={
                <button className="px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors">
                  Slide Menu ▼
                </button>
              }
            />
            
            <ScaleMenu
              items={menuItems}
              trigger={
                <button className="px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors">
                  Scale Menu ▼
                </button>
              }
            />
            
            <BlurMenu
              items={menuItems}
              trigger={
                <button className="px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors">
                  Blur Menu ▼
                </button>
              }
            />
            
            <StaggerMenu
              items={menuItems}
              trigger={
                <button className="px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors">
                  Stagger Menu ▼
                </button>
              }
            />
          </div>
        </Section>

        {/* Tabs Section */}
        <Section title="Tabs (5)">
          <div className="space-y-12">
            <div>
              <p className="text-sm text-neutral-500 mb-4">Slide Tabs:</p>
              <SlideTabs tabs={tabData} />
            </div>
            
            <div>
              <p className="text-sm text-neutral-500 mb-4">Fade Tabs:</p>
              <FadeTabs tabs={tabData} />
            </div>
            
            <div>
              <p className="text-sm text-neutral-500 mb-4">Underline Tabs:</p>
              <UnderlineTabs tabs={tabData} />
            </div>
            
            <div>
              <p className="text-sm text-neutral-500 mb-4">Pill Tabs:</p>
              <PillTabs tabs={tabData} />
            </div>
            
            <div>
              <p className="text-sm text-neutral-500 mb-4">Vertical Tabs:</p>
              <VerticalTabs tabs={tabData} />
            </div>
          </div>
        </Section>

        {/* Component Count */}
        <div className="text-center py-12 border-t border-neutral-800">
          <p className="text-neutral-500">
            Total: <span className="text-white font-bold">72 micro-components</span> across 10 categories
          </p>
        </div>
      </main>
    </div>
  )
}

export default UIComponents
