# Infinite Canvas

An infinitely pannable image grid using React Three Fiber. Drag/pan in any direction to explore an endless space of images.

## Features

- 🔄 Infinite scrolling in all directions
- 📦 Chunk-based rendering (performance optimized)
- 🖱️ Smooth drag controls
- 📱 Touch support

## Usage

```tsx
import { InfiniteCanvas } from './interactions/infinite-canvas'

function App() {
  return <InfiniteCanvas />
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `string[]` | Sample images | Array of image URLs |
| `gridSize` | `number` | 3 | Images per row/column in each chunk |
| `imageSize` | `number` | 2 | Size of each image in world units |
| `gap` | `number` | 0.3 | Gap between images |

## How it works

1. **Chunks**: The canvas is divided into chunks. Only chunks near the viewport are rendered.
2. **Infinite loop**: When you pan far enough, chunks wrap around creating an infinite effect.
3. **GPU optimized**: Uses instanced meshes and texture atlasing where possible.

## Source Inspiration

[Codrops: Infinite Canvas](https://tympanus.net/codrops/2026/01/07/infinite-canvas-building-a-seamless-pan-anywhere-image-space/)
