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

export default function App() {
  return (
    <HashRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/infinite-canvas" element={<InfiniteCanvas />} />
          <Route path="/dual-wave-text" element={<DualWaveText />} />
          <Route path="/cylinder-text" element={<CylinderText />} />
          <Route path="/grid-flip" element={<GridFlip />} />
          <Route path="/wavy-carousel" element={<WavyCarousel />} />
          <Route path="/terminal-text-hover" element={<TerminalTextHover />} />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}
