import { HashRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { InfiniteCanvas } from './interactions/infinite-canvas'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/infinite-canvas" element={<InfiniteCanvas />} />
      </Routes>
    </HashRouter>
  )
}
