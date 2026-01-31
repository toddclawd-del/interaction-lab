# Layered Zoom Scroll Effect

A cinematic scroll-triggered zoom effect with floating images that fly toward the camera, text that splits apart, and stacked image layers creating a depth illusion.

**Source:** [Building a Layered Zoom Scroll Effect with GSAP ScrollSmoother and ScrollTrigger](https://tympanus.net/codrops/2025/10/29/building-a-layered-zoom-scroll-effect-with-gsap-scrollsmoother-and-scrolltrigger/) — Inspired by [Telescope](https://telescope.fyi/)

## Features

- 🎬 Cinematic scroll-pinned animation
- 🖼️ Floating images with 3D perspective (fly toward camera)
- ✂️ Split text that moves apart revealing the main image
- 🔮 Stacked image layers with blur → sharp trailing zoom
- 📱 Fully responsive (mobile vertical text split)
- ♿ Respects `prefers-reduced-motion`

## Usage

```tsx
import { LayeredZoomScroll } from './interactions/layered-zoom-scroll';

function App() {
  return (
    <LayeredZoomScroll
      leftText="explore the"
      rightText="unknown"
      layerCount={6}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `leftText` | `string` | `"explore the"` | Text on the left side |
| `rightText` | `string` | `"unknown"` | Text on the right side |
| `layerCount` | `number` | `6` | Number of stacked zoom layers |

## How It Works

1. **Floating Images Grid** — Small images positioned organically around the viewport, animated along the Z-axis to create a "flying toward camera" effect

2. **CSS Variable Progress** — A `--progress` variable (0 → 1) drives the main image scale and text movement, animated by GSAP ScrollTrigger

3. **Split Text** — Uses CSS `transform` with `calc()` to move text apart based on scroll progress

4. **Trailing Zoom Layers** — Multiple image copies with decreasing initial scales and blur, animated back to `scale(1)` and `blur(0)` with staggered timing

5. **Radial Mask** — Front layers use a radial gradient mask to create the "subject popping out" illusion

## Dependencies

- `gsap` with `ScrollTrigger` plugin

## Customization

### Change Floating Images
Edit the `floatingImages` array in the component to use your own images.

### Adjust Mask Shape
Modify the `mask-image` radial gradient in CSS:
```css
mask-image: radial-gradient(
  ellipse 40% 50% at 50% 50%,  /* size x% y% at position */
  black 0%,
  black 70%,      /* solid area */
  transparent 100%
);
```

### Change Layer Timing
Adjust timeline positions in the `useEffect`:
```ts
timeline.to(frontLayers, { scale: 1, ... }, 0.4);  // Start time
```

## Browser Support

Works in all modern browsers. Uses:
- CSS `perspective` and `transform-style: preserve-3d`
- CSS `mask-image` with radial gradients
- GSAP ScrollTrigger (scrub, pin)
