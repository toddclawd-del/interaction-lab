# Shader Reveal Gallery

A scroll-triggered WebGL gallery where images reveal through a randomized grid/pixel shader effect as they enter the viewport.

## Inspiration

Based on the Codrops tutorial ["Building a Scroll-Revealed WebGL Gallery with GSAP, Three.js, Astro and Barba.js"](https://tympanus.net/codrops/2026/02/02/building-a-scroll-revealed-webgl-gallery-with-gsap-three-js-astro-and-barba-js/) by Chakib Mazouni.

## Techniques

### 1. WebGL-DOM Synchronization
- Each DOM image has a corresponding WebGL plane that perfectly overlays it
- Planes are positioned in real-time using `getBoundingClientRect()` converted to Three.js world coordinates
- The viewport is calibrated so WebGL units match screen pixels

### 2. Scroll-Triggered Shader Animation
- GSAP ScrollTrigger controls a `uProgress` uniform (0 → 1)
- Images begin revealing when entering viewport from bottom
- Reveal completes when image reaches center of screen

### 3. Grid-Based Reveal Shader
- Fragment shader divides each image into a grid of cells
- Each cell has a random reveal threshold based on its position
- Cells reveal progressively as `uProgress` increases
- Creates organic, randomized pixel-by-pixel reveal effect

### 4. Object-Fit Cover in Shaders
- Custom UV calculation maintains proper aspect ratio
- Images always fill their container without distortion

## Usage

```tsx
import ShaderRevealGallery from './interactions/shader-reveal-gallery'

function App() {
  return <ShaderRevealGallery />
}
```

## Props

The `WebGLCanvas` component accepts:
- `images`: Array of HTMLImageElement refs
- `lenis`: Lenis smooth scroll instance
- `gridSize`: Number of cells in the reveal grid (default: 25)

## Dependencies

- `@react-three/fiber` — React renderer for Three.js
- `three` — WebGL library
- `gsap` + `ScrollTrigger` — Animation and scroll-based triggers
- `lenis` — Smooth scrolling

## Customization

### Shader Parameters
- `uGridSize`: More cells = finer reveal pattern
- `uColor`: Background color for unrevealed areas

### Reveal Timing
Modify ScrollTrigger settings in `Media.tsx`:
```ts
scrollTrigger: {
  trigger: element,
  start: 'top bottom',      // When to start reveal
  end: 'center center',     // When reveal completes
  scrub: 0.5,               // Smoothing factor
}
```

## Files

```
shader-reveal-gallery/
├── ShaderRevealGallery.tsx  — Main component
├── WebGLCanvas.tsx          — R3F canvas setup
├── Media.tsx                — Individual image plane
├── shaders/
│   ├── vertex.glsl
│   └── fragment.glsl
├── styles.css
└── README.md
```
