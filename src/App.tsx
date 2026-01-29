import { lazy, Suspense } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'

// Lazy load heavy Three.js components to avoid crashing on mobile
const InfiniteCanvas = lazy(() => import('./interactions/infinite-canvas').then(m => ({ default: m.InfiniteCanvas })))
const DualWaveText = lazy(() => import('./interactions/dual-wave-text').then(m => ({ default: m.DualWaveText })))
const CylinderText = lazy(() => import('./interactions/cylinder-text').then(m => ({ default: m.CylinderText })))
const GridFlip = lazy(() => import('./interactions/grid-flip').then(m => ({ default: m.GridFlip })))
const WavyCarousel = lazy(() => import('./interactions/wavy-carousel').then(m => ({ default: m.WavyCarousel })))

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
        </Routes>
      </Suspense>
    </HashRouter>
  )
}
