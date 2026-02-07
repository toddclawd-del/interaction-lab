# Pixel Grid Reveal

A React component that renders content behind an animated grid of pixels that reveal on scroll, focus, or programmatic trigger. Each pixel can respond to mouse movement with distortion effects.

## Installation

```tsx
import { PixelGrid } from './interactions/pixel-grid'
```

No external dependencies required — uses native CSS Grid and React.

## Basic Usage

```tsx
// Text reveal
<PixelGrid text="HELLO" />

// Content reveal
<PixelGrid>
  <img src="/hero.jpg" alt="Hero" />
</PixelGrid>

// With custom configuration
<PixelGrid
  pixelSize={8}
  gap={2}
  revealPattern="radial"
  distortionMode="repel"
  backgroundColor="#000"
  pixelColor="#1a1a1a"
>
  <YourContent />
</PixelGrid>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Content to reveal |
| `text` | string | - | Text to display (alternative to children) |
| `src` | string | - | Image source (alternative to children) |
| `pixelSize` | number | 8 | Size of each pixel in px |
| `gap` | number | 2 | Gap between pixels in px |
| `shape` | 'square' \| 'circle' | 'square' | Pixel shape |
| `borderRadius` | number | 0 | Corner radius for square pixels |
| `animationSpeed` | number | 1 | Animation speed multiplier (0.1-2) |
| `revealPattern` | 'radial' \| 'directional' \| 'random' \| 'typewriter' | 'radial' | How pixels reveal |
| `revealDirection` | 'top' \| 'bottom' \| 'left' \| 'right' | 'top' | Direction for directional pattern |
| `staggerDelay` | number | 20 | Delay between each pixel (ms) |
| `interactive` | boolean | true | Enable mouse distortion |
| `distortionMode` | 'repel' \| 'attract' \| 'swirl' \| 'none' | 'repel' | Mouse distortion effect |
| `distortionStrength` | number | 3 | Distortion intensity (0-10) |
| `distortionRadius` | number | 80 | Mouse effect radius in px |
| `triggerOnView` | boolean | true | Animate when scrolled into view |
| `triggerThreshold` | number | 0.3 | Visibility threshold for trigger (0-1) |
| `autoPlay` | boolean | false | Start animation immediately |
| `delay` | number | 0 | Delay before animation starts (ms) |
| `backgroundColor` | string | '#000' | Container background |
| `pixelColor` | string | '#1a1a1a' | Pixel overlay color |
| `className` | string | '' | Additional CSS classes |
| `onRevealStart` | () => void | - | Callback when reveal starts |
| `onRevealComplete` | () => void | - | Callback when reveal finishes |

## Reveal Patterns

- **radial**: Pixels reveal outward from center
- **directional**: Pixels reveal in a direction (top/bottom/left/right)
- **random**: Pixels reveal in random order
- **typewriter**: Row by row, left to right

## Distortion Modes

- **repel**: Pixels push away from cursor
- **attract**: Pixels pull toward cursor  
- **swirl**: Pixels rotate around cursor
- **none**: No mouse interaction

## Accessibility

- Keyboard: Tab to focus, Enter/Space to trigger reveal
- Screen readers: Uses `aria-busy` during animation, `aria-live="polite"`
- Reduced motion: Respects `prefers-reduced-motion`, skips animation and shows content immediately

## Performance Notes

- Uses CSS `will-change` for optimized animations
- RAF-based distortion runs at 60fps
- For very large grids (>5000 pixels), consider reducing `pixelSize` or using fewer rows/cols
- Distortion calculations are throttled and use quadratic falloff

## Example: Hero Section

```tsx
<div style={{ height: '100vh' }}>
  <PixelGrid
    pixelSize={12}
    gap={3}
    revealPattern="radial"
    distortionMode="repel"
    distortionStrength={4}
    staggerDelay={8}
    triggerOnView
  >
    <div className="hero-content">
      <h1>Welcome</h1>
      <p>Your hero content here</p>
    </div>
  </PixelGrid>
</div>
```

## Inspiration

- [Vercel Geist Font](https://vercel.com/font) — Pixel mode transitions
- [Aceternity Canvas Reveal](https://ui.aceternity.com/components/canvas-reveal-effect)
