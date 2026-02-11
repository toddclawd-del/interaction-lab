# Morphing Grid Gallery

A production-ready grid gallery that smoothly morphs between different layout densities using GSAP Flip plugin.

![Risk Level](https://img.shields.io/badge/risk-bold-yellow)

## Features

- 🎬 Buttery smooth layout transitions
- 🎛️ Density controls (50% - 150%)
- ✨ Optional blur/brightness transition effect
- ⌨️ Full keyboard accessibility
- ♿ Reduced motion support
- 🎨 Custom render prop for items
- 📱 Responsive breakpoints

## Installation

```bash
npm install gsap
```

Requires GSAP's Flip plugin (included in npm package).

## Usage

```tsx
import { MorphingGrid, GridItem } from './morphing-grid/MorphingGrid'

const items: GridItem[] = [
  { id: '1', image: '/photo1.jpg', aspectRatio: '4/5', label: 'Photo 1' },
  { id: '2', image: '/photo2.jpg', aspectRatio: '1/1' },
  { id: '3', image: '/photo3.jpg', aspectRatio: '16/9' },
  // ...
]

function Gallery() {
  return (
    <MorphingGrid
      items={items}
      defaultDensity={75}
      enhancedTransition={true}
      onDensityChange={(density) => console.log(`Now at ${density}%`)}
    />
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `GridItem[]` | required | Array of items to display |
| `densityLevels` | `number[]` | `[50, 75, 100, 125, 150]` | Available density options |
| `defaultDensity` | `number` | `75` | Starting density |
| `enhancedTransition` | `boolean` | `true` | Enable blur/brightness effect |
| `renderItem` | `(item, index) => ReactNode` | - | Custom item renderer |
| `onDensityChange` | `(density: number) => void` | - | Callback on density change |
| `gap` | `string` | `'1.5rem'` | Gap between items |
| `className` | `string` | - | Container class |
| `gridClassName` | `string` | - | Grid element class |

## GridItem Interface

```tsx
interface GridItem {
  id: string          // Unique identifier
  image: string       // Image URL
  aspectRatio?: string // e.g., '4/5', '16/9' (default: '1/1')
  label?: string      // Optional label overlay
}
```

## Custom Renderer

```tsx
<MorphingGrid
  items={items}
  renderItem={(item, index) => (
    <div className="custom-card">
      <img src={item.image} alt="" />
      <div className="overlay">
        <span>{String(index + 1).padStart(2, '0')}</span>
      </div>
    </div>
  )}
/>
```

## Keyboard Navigation

- **Arrow keys**: Cycle through density options
- **Enter/Space**: Select density
- **Home/End**: Jump to first/last option

## Accessibility

- Density buttons use `aria-pressed` state
- Screen readers announce density changes via live region
- Reduced motion preference is respected (instant layout swap)

## Column Breakdown

| Density | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| 50% | 16 cols | 10 cols | 3 cols |
| 75% | 10 cols | 8 cols | 3 cols |
| 100% | 8 cols | 6 cols | 3 cols |
| 125% | 6 cols | 5 cols | 3 cols |
| 150% | 4 cols | 3 cols | 3 cols |

## Animation Timings

**Simple mode** (`enhancedTransition={false}`):
- Duration: 0.8s
- Ease: expo.inOut

**Enhanced mode** (`enhancedTransition={true}`):
- Flip duration: 1s
- Stagger: 0.3s (random order)
- Blur: 0px → 10px → 0px
- Brightness: 100% → 200% → 100%

## Reference

[Codrops: Animating Responsive Grid Layout Transitions with GSAP Flip](https://tympanus.net/Tutorials/GridLayoutTransitions/)
