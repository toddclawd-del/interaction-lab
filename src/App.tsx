import { lazy, Suspense } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'

// Lazy load heavy Three.js components to avoid crashing on mobile
const InfiniteCanvas = lazy(() => import('./interactions/infinite-canvas').then(m => ({ default: m.InfiniteCanvas })))
const DualWaveText = lazy(() => import('./interactions/dual-wave-text').then(m => ({ default: m.DualWaveText })))
const CylinderText = lazy(() => import('./interactions/cylinder-text').then(m => ({ default: m.CylinderText })))
const GridFlip = lazy(() => import('./interactions/grid-flip').then(m => ({ default: m.GridFlip })))
const WavyCarousel = lazy(() => import('./interactions/wavy-carousel').then(m => ({ default: m.WavyCarousel })))
const TerminalTextHover = lazy(() => import('./interactions/terminal-text-hover').then(m => ({ default: m.TerminalTextHover })))

// GSAP-powered interactions
const TextReveal = lazy(() => import('./interactions/text-reveal').then(m => ({ default: m.TextReveal })))
const ScrollVelocity = lazy(() => import('./interactions/scroll-velocity').then(m => ({ default: m.ScrollVelocity })))
const MagneticElements = lazy(() => import('./interactions/magnetic-elements').then(m => ({ default: m.MagneticElements })))
const HorizontalScroll = lazy(() => import('./interactions/horizontal-scroll').then(m => ({ default: m.HorizontalScroll })))
const ImageReveal = lazy(() => import('./interactions/image-reveal').then(m => ({ default: m.ImageReveal })))
const CounterLab = lazy(() => import('./interactions/counter-lab').then(m => ({ default: m.CounterLab })))
const CursorPlayground = lazy(() => import('./interactions/cursor-playground').then(m => ({ default: m.CursorPlayground })))
const StaggerPatterns = lazy(() => import('./interactions/stagger-patterns').then(m => ({ default: m.StaggerPatterns })))
const ParallaxDepth = lazy(() => import('./interactions/parallax-depth').then(m => ({ default: m.ParallaxDepth })))
const ElasticPhysics = lazy(() => import('./interactions/elastic-physics').then(m => ({ default: m.ElasticPhysics })))
const ScrollScrub = lazy(() => import('./interactions/scroll-scrub').then(m => ({ default: m.ScrollScrub })))
const ThreeDCards = lazy(() => import('./interactions/3d-cards').then(m => ({ default: m.ThreeDCards })))

// Shader-based interactions
const ShaderHero = lazy(() => import('./interactions/shader-hero').then(m => ({ default: m.ShaderHero })))
const ShaderCards = lazy(() => import('./interactions/shader-cards').then(m => ({ default: m.ShaderCards })))
const ShaderGradient = lazy(() => import('./interactions/shader-gradient').then(m => ({ default: m.ShaderGradient })))
const ShaderReveal = lazy(() => import('./interactions/shader-reveal').then(m => ({ default: m.ShaderReveal })))
const ShaderCursorDemo = lazy(() => import('./interactions/shader-cursor').then(m => ({ default: m.ShaderCursorDemo })))
const ShaderNoise = lazy(() => import('./interactions/shader-noise').then(m => ({ default: m.ShaderNoise })))
const ShaderLiquid = lazy(() => import('./interactions/shader-liquid').then(m => ({ default: m.ShaderLiquid })))
const ShaderDistortion = lazy(() => import('./interactions/shader-distortion').then(m => ({ default: m.ShaderDistortion })))
const ShaderTransition = lazy(() => import('./interactions/shader-transition').then(m => ({ default: m.TransitionShowcase })))
const ShaderParticles = lazy(() => import('./interactions/shader-particles').then(m => ({ default: m.ParticleDemo })))

// UI Components micro-interaction library
const UIComponents = lazy(() => import('./interactions/ui-components').then(m => ({ default: m.UIComponents })))

// Loading fallback
const Loading = () => (
  <div style={{ 
    minHeight: '100vh', 
    background: '#0a0a0a', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    color: '#666'
  }}>
    Loading interaction...
  </div>
)

// Demo wrapper for shader components that need full page
const ShaderDemoWrapper = ({ children, title }: { children: React.ReactNode, title: string }) => (
  <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '2rem' }}>
    <h1 style={{ color: 'white', marginBottom: '1rem', fontSize: '2rem' }}>{title}</h1>
    <a href="#/" style={{ color: '#667eea', marginBottom: '2rem', display: 'block' }}>← Back to Home</a>
    {children}
  </div>
)

export default function App() {
  return (
    <HashRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Three.js interactions */}
          <Route path="/infinite-canvas" element={<InfiniteCanvas />} />
          <Route path="/dual-wave-text" element={<DualWaveText />} />
          <Route path="/cylinder-text" element={<CylinderText />} />
          <Route path="/grid-flip" element={<GridFlip />} />
          <Route path="/wavy-carousel" element={<WavyCarousel />} />
          <Route path="/terminal-text-hover" element={<TerminalTextHover />} />
          
          {/* GSAP-powered interactions */}
          <Route path="/text-reveal" element={<TextReveal />} />
          <Route path="/scroll-velocity" element={<ScrollVelocity />} />
          <Route path="/magnetic-elements" element={<MagneticElements />} />
          <Route path="/horizontal-scroll" element={<HorizontalScroll />} />
          <Route path="/image-reveal" element={<ImageReveal />} />
          <Route path="/counter-lab" element={<CounterLab />} />
          <Route path="/cursor-playground" element={<CursorPlayground />} />
          <Route path="/stagger-patterns" element={<StaggerPatterns />} />
          <Route path="/parallax-depth" element={<ParallaxDepth />} />
          <Route path="/elastic-physics" element={<ElasticPhysics />} />
          <Route path="/scroll-scrub" element={<ScrollScrub />} />
          <Route path="/3d-cards" element={<ThreeDCards />} />
          
          {/* Shader interactions */}
          <Route path="/shader-hero" element={
            <div>
              <ShaderHero title="Shader Hero" subtitle="Move your mouse • Scroll to see parallax" colors={['#0f0c29', '#302b63', '#24243e']} />
              <div style={{ height: '100vh', background: '#0a0a0a', padding: '4rem', color: 'white' }}>
                <h2>Content Below</h2>
                <p>Scroll back up to see the parallax effect on the shader.</p>
                <a href="#/" style={{ color: '#667eea' }}>← Back to Home</a>
              </div>
            </div>
          } />
          <Route path="/shader-cards" element={
            <ShaderDemoWrapper title="Shader Cards">
              <ShaderCards columns={2} />
            </ShaderDemoWrapper>
          } />
          <Route path="/shader-gradient" element={
            <ShaderDemoWrapper title="Shader Gradient">
              <div style={{ height: '70vh', borderRadius: '12px', overflow: 'hidden' }}>
                <ShaderGradient preset="neon" />
              </div>
            </ShaderDemoWrapper>
          } />
          <Route path="/shader-reveal" element={
            <div style={{ background: '#0a0a0a' }}>
              <div style={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h1 style={{ color: 'white', fontSize: '3rem' }}>Scroll Down</h1>
              </div>
              <ShaderReveal direction="center" colors={['#667eea', '#764ba2', '#f093fb']}>
                <div style={{ height: '400px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <h2>Content Revealed!</h2>
                </div>
              </ShaderReveal>
              <div style={{ height: '100vh', padding: '4rem' }}>
                <a href="#/" style={{ color: '#667eea' }}>← Back to Home</a>
              </div>
            </div>
          } />
          <Route path="/shader-cursor" element={<ShaderCursorDemo />} />
          <Route path="/shader-noise" element={
            <ShaderDemoWrapper title="Shader Noise">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div style={{ height: '300px', borderRadius: '8px', overflow: 'hidden' }}>
                  <ShaderNoise type="perlin" colors={['#1a1a2e', '#4cc9f0']} />
                </div>
                <div style={{ height: '300px', borderRadius: '8px', overflow: 'hidden' }}>
                  <ShaderNoise type="organic" colors={['#f72585', '#7209b7', '#3a0ca3']} />
                </div>
                <div style={{ height: '300px', borderRadius: '8px', overflow: 'hidden' }}>
                  <ShaderNoise type="turbulence" colors={['#43e97b', '#38f9d7']} turbulence={1} />
                </div>
                <div style={{ height: '300px', borderRadius: '8px', overflow: 'hidden' }}>
                  <ShaderNoise type="simplex" colors={['#ff6b6b', '#feca57']} />
                </div>
              </div>
            </ShaderDemoWrapper>
          } />
          <Route path="/shader-liquid" element={
            <ShaderDemoWrapper title="Shader Liquid">
              <div style={{ height: '70vh', borderRadius: '12px', overflow: 'hidden' }}>
                <ShaderLiquid initialBalls={6} colors={['#f72585', '#4cc9f0']} metallic={0.8} />
              </div>
            </ShaderDemoWrapper>
          } />
          <Route path="/shader-distortion" element={
            <ShaderDemoWrapper title="Shader Distortion">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <ShaderDistortion mode="ripple" style={{ height: '300px' }} />
                <ShaderDistortion mode="twist" style={{ height: '300px' }} />
                <ShaderDistortion mode="wave" style={{ height: '300px' }} />
                <ShaderDistortion mode="bulge" style={{ height: '300px' }} />
              </div>
              <p style={{ color: '#888', marginTop: '1rem' }}>Hover over each to see the distortion effect</p>
            </ShaderDemoWrapper>
          } />
          <Route path="/shader-transition" element={
            <ShaderDemoWrapper title="Shader Transitions">
              <ShaderTransition />
            </ShaderDemoWrapper>
          } />
          <Route path="/shader-particles" element={
            <ShaderDemoWrapper title="GPU Particles">
              <ShaderParticles />
            </ShaderDemoWrapper>
          } />
          
          {/* UI Components Library */}
          <Route path="/ui-components" element={<UIComponents />} />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}
