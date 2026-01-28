# Dual Wave Text Animation

A scroll-driven animation where two columns of text move in opposing wave patterns, with a centered image that updates based on the focused item.

## Reference

**Source:** [Codrops Tutorial](https://tympanus.net/codrops/2026/01/15/building-a-scroll-driven-dual-wave-text-animation-with-gsap/)  
**Author:** Valentin Descombes  
**Live Demo:** [tympanus.net/Tutorials/DualWaveTextAnimation](https://tympanus.net/Tutorials/DualWaveTextAnimation/)

## Key Techniques

### 1. Sine Wave Mathematics
The core of the animation uses sine waves to position elements:

```typescript
// Phase calculation
const phase = waveNumber * index + waveSpeed * progress * 2π - π/2

// Sine gives -1 to 1, normalize to 0 to 1
const wave = Math.sin(phase)
const progress = (wave + 1) / 2

// Map to pixel position
const position = minX + progress * rangeSize
```

- `waveNumber` — How many wave cycles across all elements
- `waveSpeed` — Animation speed as scroll progresses
- `index` — Element's position in the list
- `progress` — Scroll progress (0 to 1)

### 2. GSAP quickTo for Performance
Instead of creating new tweens every frame:

```typescript
// Pre-create setter once
const setter = gsap.quickTo(element, 'x', { 
  duration: 0.6, 
  ease: 'power4.out' 
})

// Call it 60 times per second
setter(newValue) // No new tween creation!
```

### 3. Lenis Smooth Scrolling
Synchronized with GSAP for butter-smooth scroll:

```typescript
const lenis = new Lenis({ duration: 1.5 })

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})
```

## Usage

```tsx
import { DualWaveText } from './interactions/dual-wave-text'

// Basic usage
<DualWaveText />
```

### Customization

Modify the `DualWaveAnimation` options:

```typescript
new DualWaveAnimation(wrapper, {
  waveNumber: 12,  // More = tighter waves
  waveSpeed: 1,    // Higher = faster animation
})
```

Or via data attributes:

```html
<div 
  class="dual-wave-wrapper" 
  data-wave-number="8" 
  data-wave-speed="0.5"
>
```

## Dependencies

- `gsap` — Animation engine
- `gsap/ScrollTrigger` — Scroll-linked animations
- `lenis` — Smooth scrolling

## Files

```
dual-wave-text/
├── index.tsx            # React component
├── DualWaveAnimation.ts # Core animation class
└── README.md            # This file
```

## Browser Support

Works in all modern browsers. Smooth scrolling gracefully degrades in older browsers.

## Performance Notes

- Uses `quickTo` for 60fps animation updates
- Single scroll listener via ScrollTrigger
- Minimal DOM updates (only class toggles for focus state)
- Hardware-accelerated transforms
