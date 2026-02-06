# Text Dissolve - WebGPU Gommage Effect

A dramatic text disintegration effect using Three.js WebGPU renderer and TSL shaders. Text dissolves with noise-driven particles (dust + petals) and selective bloom.

## Features

- **WebGPU Renderer**: Uses Three.js's experimental WebGPU backend for modern GPU access
- **TSL Shaders**: Three.js Shading Language for GPU-side material logic
- **MSDF Text**: Multi-channel Signed Distance Field fonts for crisp text at any scale
- **Instanced Particles**: Efficient GPU-driven dust and petal particles
- **Selective Bloom**: MRT (Multiple Render Target) for per-object bloom intensity
- **Noise-driven Dissolve**: Perlin noise creates organic, unpredictable dissolve patterns

## Tech Stack

- Three.js 0.181.0+ with WebGPU renderer
- TSL (Three.js Shading Language)
- three-msdf-text-utils for MSDF text
- GSAP for animation orchestration

## Browser Requirements

WebGPU is required. Current support:
- ✅ Chrome 113+
- ✅ Edge 113+
- ⚠️ Firefox (behind flag `dom.webgpu.enabled`)
- ⚠️ Safari (experimental, Technology Preview)

## Usage

```tsx
import { TextDissolve } from './interactions/text-dissolve'

function App() {
  return <TextDissolve />
}
```

## Techniques Learned

### 1. WebGPU + TSL Shaders
- TSL replaces GLSL for shader logic in WebGPU mode
- Uniforms, attributes, and math ops use node-based API
- MRT nodes enable per-object post-processing effects

### 2. MSDF Text Rendering
- Font atlas + JSON metadata for crisp text at any scale
- `glyphUv` and `center` attributes for per-character effects
- Text geometry scaling from pixel units to world units

### 3. Noise-Driven Dissolve
- Perlin texture sampled per-glyph for organic variation
- Progress uniform threshold compared against noise
- Remap noise range for consistent timing

### 4. Instanced Particle Systems
- Single geometry + InstancedBufferAttributes for efficiency
- Birth time + lifetime + seed packed into vec4
- Wind + rise + swirl for natural motion
- Scale-in and fade-out over lifetime

### 5. Selective Bloom with MRT
- MRT node outputs `bloomIntensity` per-material
- Post-processing samples intensity channel
- Bloom only affects desired elements

## Credits

- **Inspiration**: [Clair Obscur: Expedition 33](https://en.wikipedia.org/wiki/Clair_Obscur:_Expedition_33) "Gommage" effect
- **Tutorial**: [Codrops](https://tympanus.net/codrops/2026/01/28/webgpu-gommage-effect-dissolving-msdf-text-into-dust-and-petals-with-three-js-tsl/) by Thibault Introvigne
- **Font**: Cinzel (Google Fonts)
