# Wavy Infinite Carousel

Scroll-driven infinite carousel with wavy distortion effects using React Three Fiber and custom GLSL shaders.

## Reference

**Source:** [Codrops Tutorial](https://tympanus.net/codrops/2025/11/26/creating-wavy-infinite-carousels-in-react-three-fiber-with-glsl-shaders/)  
**Author:** Colin Demouge  
**Live Demo:** [tympanus.net/Tutorials/R3FExperimentalCarousels](https://tympanus.net/Tutorials/R3FExperimentalCarousels)

## Key Techniques

### 1. Custom GLSL Shaders

The vertex shader handles two displacement effects:

```glsl
// Wave curve based on world Y position
float xDisplacement = uCurveStrength * cos(worldPosition.y * uCurveFrequency);

// Stretch effect based on scroll velocity
float yDisplacement = -sin(uv.x * PI) * uScrollSpeed;
```

The fragment shader provides object-fit cover behavior:

```glsl
vec2 ratio = vec2(
  min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
  min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
);
```

### 2. Infinite Scroll via Modulo

The carousel wraps positions seamlessly using modulo arithmetic:

```typescript
function mod(n: number, m: number): number {
  return ((n % m) + m) % m
}

// Wrap position for infinite effect
ref.position.y = mod(ref.position.y + totalSize / 2, totalSize) - totalSize / 2
```

### 3. Lenis Smooth Scrolling

Uses Lenis for buttery smooth scroll with velocity access:

```typescript
const lenis = new Lenis({
  duration: 1.2,
  smoothWheel: true,
  infinite: true,
})

lenis.on('scroll', ({ velocity }) => {
  // Use velocity for shader effects
})
```

## Usage

```tsx
import { WavyCarousel } from './interactions/wavy-carousel'

// Full-page carousel experience
<WavyCarousel />
```

### Carousel Props

The internal `<Carousel>` component accepts:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `imageSize` | `[number, number]` | Required | Width and height of each image |
| `gap` | `number` | Required | Space between images |
| `curveStrength` | `number` | `0.8` | How far the wave curves (negative inverts) |
| `curveFrequency` | `number` | `0.5` | How many wave cycles across viewport |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | Scroll direction |
| `scrollMultiplier` | `number` | `0.01` | Scroll sensitivity |
| `position` | `[x, y, z]` | `[0, 0, 0]` | 3D position in scene |

## Variants

The demo includes four variants:

1. **Single** — One centered carousel with wave effect
2. **Dual** — Two carousels moving opposite directions
3. **Triple** — Three layered carousels with depth
4. **Horizontal** — Horizontal scrolling layout

## Dependencies

- `@react-three/fiber` — React renderer for Three.js
- `@react-three/drei` — Useful R3F helpers (useTexture)
- `three` — 3D graphics library
- `lenis` — Smooth scroll library

## Files

```
wavy-carousel/
├── index.tsx                # Main component
├── shaders/
│   ├── vertex.glsl          # Vertex displacement shader
│   └── fragment.glsl        # Texture + cover shader
└── README.md                # This file
```

## Customization Ideas

- **Add noise displacement** — Add Perlin noise to fragment for organic texture warping on scroll
- **Color grading** — Add uniform for brightness/contrast during scroll
- **Click interaction** — Scale up image on click with GSAP
- **Masking** — Add circular or custom shape masks in fragment shader
- **Depth of field** — Blur images based on Z position

## Browser Support

WebGL required. Works in all modern browsers:
- Chrome 56+
- Firefox 51+
- Safari 15+
- Edge 79+

## Performance Notes

- Uses shared `PlaneGeometry` across all images
- Shader materials are memoized
- Modulo positioning prevents accumulating position values
- Velocity decay prevents jitter when idle
