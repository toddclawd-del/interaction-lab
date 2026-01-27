# Infinite Canvas

An infinitely pannable image grid using React Three Fiber. Drag in any direction to explore an endless space of images.

![Infinite Canvas Demo](https://via.placeholder.com/800x400/0a0a0a/ffffff?text=Infinite+Canvas)

## Features

- 🔄 **Infinite scrolling** — Pan forever in any direction
- 📦 **Chunk-based rendering** — Only renders visible chunks for performance
- 🖱️ **Smooth drag** — Natural feel with momentum/inertia after release
- ✨ **Hover effects** — Images scale up on hover
- 📱 **Touch support** — Works on mobile devices

## Installation

This component requires React Three Fiber and its dependencies:

```bash
npm install @react-three/fiber @react-three/drei three
```

## Usage

### Basic

```tsx
import { InfiniteCanvas } from './interactions/infinite-canvas'

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <InfiniteCanvas />
    </div>
  )
}
```

### With Custom Images

```tsx
const myImages = [
  '/images/photo1.jpg',
  '/images/photo2.jpg',
  '/images/photo3.jpg',
  // ... more images
]

<InfiniteCanvas 
  images={myImages}
  imageSize={3}
  gap={0.5}
/>
```

### Full Props Example

```tsx
<InfiniteCanvas 
  images={myImages}        // Array of image URLs
  gridSize={4}             // 4x4 images per chunk
  imageSize={2.5}          // Each image is 2.5 world units
  gap={0.4}                // 0.4 units between images
  backgroundColor="#1a1a2e" // Custom background
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `string[]` | Sample Picsum images | Array of image URLs to display |
| `gridSize` | `number` | `3` | Images per row/column in each chunk |
| `imageSize` | `number` | `2` | Size of each image in world units |
| `gap` | `number` | `0.3` | Gap between images in world units |
| `backgroundColor` | `string` | `#0a0a0a` | Canvas background color |

## How It Works

### Chunk-Based Rendering

The canvas is divided into "chunks" — groups of `gridSize × gridSize` images. Only chunks visible on screen (plus a buffer) are rendered. As you pan, new chunks appear and old ones disappear.

```
┌─────────┬─────────┬─────────┐
│ Chunk   │ Chunk   │ Chunk   │
│ (-1,1)  │ (0,1)   │ (1,1)   │
├─────────┼─────────┼─────────┤
│ Chunk   │ VISIBLE │ Chunk   │
│ (-1,0)  │ (0,0)   │ (1,0)   │
├─────────┼─────────┼─────────┤
│ Chunk   │ Chunk   │ Chunk   │
│ (-1,-1) │ (0,-1)  │ (1,-1)  │
└─────────┴─────────┴─────────┘
```

### Momentum Physics

When you release after dragging, the canvas continues moving with decreasing velocity:

```typescript
velocity.current.x *= 0.95  // 5% friction per frame
velocity.current.y *= 0.95
```

This creates a natural "throw" feeling.

## Customization Ideas

- **Different aspect ratios** — Modify `planeGeometry` args for non-square images
- **Loading states** — Add a `Suspense` fallback while images load
- **Click to expand** — Add onClick handler to zoom into an image
- **Masonry layout** — Vary image sizes for a Pinterest-style grid
- **Parallax depth** — Give images different Z positions

## Browser Support

Requires WebGL support. Works in all modern browsers:
- Chrome 56+
- Firefox 51+
- Safari 15+
- Edge 79+

## Credits

Inspired by [Codrops: Infinite Canvas](https://tympanus.net/codrops/2026/01/07/infinite-canvas-building-a-seamless-pan-anywhere-image-space/)

## License

MIT — Use freely in personal and commercial projects.
