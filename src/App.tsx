import { HashRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { InfiniteCanvas } from './interactions/infinite-canvas'
import { DualWaveText } from './interactions/dual-wave-text'
import { CylinderText } from './interactions/cylinder-text'
import { GridFlip } from './interactions/grid-flip'
import { WavyCarousel } from './interactions/wavy-carousel'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/infinite-canvas" element={<InfiniteCanvas />} />
        <Route path="/dual-wave-text" element={<DualWaveText />} />
        <Route path="/cylinder-text" element={<CylinderText />} />
        <Route path="/grid-flip" element={<GridFlip />} />
        <Route path="/wavy-carousel" element={<WavyCarousel />} />
      </Routes>
    </HashRouter>
  )
}
