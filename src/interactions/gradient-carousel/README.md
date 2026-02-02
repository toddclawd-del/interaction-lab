# 3D Gradient Carousel

An infinite looping 3D card carousel where the background gradient dynamically adapts to the colors of the active image.

## Source

[Codrops Tutorial - Building a 3D Infinite Carousel with Reactive Background Gradients](https://tympanus.net/codrops/2025/11/11/building-a-3d-infinite-carousel-with-reactive-background-gradients/)

## Features

- **3D Perspective**: Cards rotate and scale based on distance from center
- **Reactive Gradients**: Background colors extracted from active image
- **Momentum Physics**: Natural inertia when dragging/scrolling
- **Infinite Loop**: Seamless wrapping in either direction
- **Canvas Painting**: Smooth gradient transitions without layout thrashing

## Key Techniques

### CSS 3D Transforms
```css
.stage {
  perspective: 1800px;
}

.card {
  transform-style: preserve-3d;
  backface-visibility: hidden;
  transform: translate3d(Xpx, -50%, Zpx) rotateY(Rdeg) scale(S);
}
```

### Color Extraction
Uses a small offscreen canvas to sample dominant colors from images:
```typescript
const canvas = document.createElement('canvas')
canvas.width = 48
ctx.drawImage(img, 0, 0, 48, 32)
const data = ctx.getImageData(0, 0, 48, 32).data
// Sample regions for primary/secondary colors
```

### Momentum Physics
```typescript
// Apply velocity to scroll position
scrollX = mod(scrollX + velocity * deltaTime, trackLength)

// Apply friction
velocity *= Math.pow(FRICTION, deltaTime * 60)
if (Math.abs(velocity) < 0.5) velocity = 0
```

### Canvas Gradients
```typescript
const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.7)`)
gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
ctx.fillStyle = gradient
ctx.fillRect(0, 0, w, h)
```

## Configuration

```typescript
const CONFIG = {
  MAX_ROTATION: 28,    // Rotation angle for side cards
  MAX_DEPTH: 140,      // Z-depth in pixels
  MIN_SCALE: 0.80,     // Scale for side cards
  FRICTION: 0.92,      // Velocity decay (lower = more friction)
  WHEEL_SENS: 0.6,     // Scroll sensitivity
  DRAG_SENS: 1.2,      // Drag sensitivity
  BG_BLUR: 32,         // Background blur amount
}
```

## Usage

```tsx
import { GradientCarousel } from './interactions/gradient-carousel'

function App() {
  return <GradientCarousel />
}
```

## Customization

- **Images**: Replace `IMAGES` array with your own URLs
- **Card size**: Adjust `CARD_WIDTH` and `CARD_HEIGHT`
- **3D intensity**: Tune `MAX_ROTATION`, `MAX_DEPTH`, `MIN_SCALE`
- **Feel**: Adjust `FRICTION`, `WHEEL_SENS`, `DRAG_SENS`
- **Background**: Change `BG_BLUR` and gradient opacity values

## Dependencies

- React
- GSAP (for smooth color transitions)
- react-router-dom (for navigation)

## Browser Support

- Modern browsers with CSS 3D transform support
- Canvas API support required
- Pointer Events API for drag handling

## Performance Notes

- Cards use `contain: layout paint` for isolation
- Canvas redraws at ~60fps with organic movement
- Gradient colors tween smoothly via GSAP
- Images loaded with `crossOrigin` for color extraction
