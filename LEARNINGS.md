# LEARNINGS.md — What I've Learned Building Interactions

This file captures techniques, gotchas, and insights from recreating web interactions.

---

## 2026-01-31 — Layered Zoom Scroll Effect

**Source:** [Codrops Tutorial](https://tympanus.net/codrops/2025/10/29/building-a-layered-zoom-scroll-effect-with-gsap-scrollsmoother-and-scrolltrigger/) — Inspired by [Telescope](https://telescope.fyi/)

### Techniques Learned

1. **CSS Variables as Animation Drivers**
   - Instead of animating multiple properties directly, animate a single `--progress` CSS variable (0 → 1)
   - Multiple elements can reference this variable via `calc()` for synchronized animations
   - Cleaner than managing multiple GSAP tweens for tightly-coupled animations

2. **Perspective + Z-axis for 3D Depth**
   - Set `perspective: 100vh` on parent container
   - Animate `z` property to make elements "fly toward camera"
   - Combined with `stagger` and `from: 'center'` for organic scatter effect

3. **Trailing Zoom with Stacked Layers**
   - Multiple identical images stacked with decreasing initial scales: `[1, 0.85, 0.6, 0.45, 0.3, 0.15]`
   - All layers animate to `scale: 1` with staggered timing
   - Initial `blur(2px)` animating to `blur(0px)` adds atmospheric depth

4. **Radial Gradient Masks for Subject Focus**
   - Use `mask-image: radial-gradient(ellipse at center, ...)` to create "subject popping out" effect
   - Adjust ellipse proportions for responsive design: wider on mobile, taller on ultra-wide

5. **Split Text with calc()**
   - Text elements move apart using `transform: translateX(calc(var(--progress) * offset))`
   - On mobile, switch to vertical split (`translateY`) for better visual balance

### Gotchas

- **Double height for scroll pinning:** Section needs `height: 200vh` (or more) to give ScrollTrigger room to scrub through the animation
- **Floating image positioning:** Use mix of `top/bottom` and `left/right` to avoid conflicts — don't use all four
- **Mobile image count:** Hide some floating images on mobile to prevent crowding

### Would Do Differently

- Add ScrollSmoother for even smoother scroll inertia (requires GSAP premium or Club membership, now free)
- Use actual subject mask (PNG with alpha) instead of radial gradient for more precise "popping out" effect
- Consider lazy-loading the main image for better initial load performance

---

## 2026-01-29 — Wavy Infinite Carousel

**Source:** [Codrops Tutorial](https://tympanus.net/codrops/2025/11/26/creating-wavy-infinite-carousels-in-react-three-fiber-with-glsl-shaders/)

### Techniques Learned

1. **Custom GLSL Shaders in R3F**
   - Import shaders as raw strings with `?raw` suffix
   - Use `shaderMaterial` to apply custom vertex/fragment shaders
   - Pass uniforms via `useMemo` to prevent unnecessary re-renders

2. **World Position for Curves**
   - Calculate `worldPosition` in vertex shader: `(modelMatrix * vec4(position, 1.0)).xyz`
   - Use cosine on world Y for smooth wave: `cos(worldPosition.y * frequency)`
   - The curve peaks where Y=0 since cos(0)=1

3. **Object-Fit Cover in Shaders**
   - Calculate aspect ratio correction in fragment shader
   - Map UVs to maintain proportions regardless of plane size
   - Great for responsive image handling

4. **Infinite Scroll via Modulo**
   - JavaScript modulo can return negative: use `((n % m) + m) % m`
   - Wrap positions around total carousel height
   - Works seamlessly with Lenis velocity

5. **Lenis + R3F Integration**
   - Store Lenis instance in ref, pass to R3F components
   - Subscribe to scroll events outside of useFrame
   - Apply velocity decay (multiply by 0.95) when not actively scrolling

### Gotchas

- **React style warning:** Don't mix shorthand (`border`) with specific properties (`borderColor`) — use separate `borderWidth`, `borderStyle`, `borderColor`
- **Viewport detection:** R3F viewport units differ from CSS pixels — used `viewport.width < 4.5` for mobile detection
- **Triple layout on mobile:** Too cramped — better to fall back to dual layout on small screens
- **Lenis orientation:** Must match variant direction — create new Lenis instance when switching horizontal/vertical

### Would Do Differently

- Add touch/drag support alongside scroll (Lenis handles wheel, but drag would feel more native)
- Implement noise displacement in fragment shader for organic distortion
- Consider lazy loading images with Suspense boundaries for better initial load

---

## 2026-01-28 — Grid Flip Transitions

**Source:** [Codrops Tutorial](https://tympanus.net/codrops/2026/01/20/animating-responsive-grid-layout-transitions-with-gsap-flip/)

### Techniques Learned

1. **GSAP Flip Plugin**
   - Capture state before layout change with `Flip.getState()`
   - Apply DOM/CSS changes, then animate with `Flip.from(state)`
   - Handles position AND size changes automatically

2. **CSS Grid with Data Attributes**
   - Use `data-size-grid` to control column counts
   - Change attribute triggers CSS transition
   - Keep all layout logic in CSS, animation in JS

3. **Animation Locking**
   - Use `isAnimating` ref to prevent overlapping animations
   - Unlock in `onComplete` callback
   - Prevents glitchy state when user clicks rapidly

### Gotchas

- **RequestAnimationFrame timing:** React state updates need a frame before Flip.from() can measure new positions
- **Stagger with absolute:** Use `absolute: true` in Flip config when staggering to prevent layout thrashing

---

## 2026-01-28 — Dual Wave Text

**Source:** [Codrops Tutorial](https://tympanus.net/codrops/2026/01/15/building-a-scroll-driven-dual-wave-text-animation-with-gsap/)

### Techniques Learned

1. **Sine Wave Math**
   - Phase: `waveNumber * index + waveSpeed * progress * 2π - π/2`
   - Normalize: `(sin(phase) + 1) / 2` maps -1..1 to 0..1
   - Multiple columns with phase offsets create opposing waves

2. **GSAP quickTo for Performance**
   - Pre-create setters: `gsap.quickTo(el, 'x', { duration, ease })`
   - Call 60fps without creating new tweens
   - Huge performance boost for scroll-driven animations

3. **Lenis + GSAP Sync**
   - Use `lenis.on('scroll', ScrollTrigger.update)`
   - Add Lenis RAF to GSAP ticker for perfect sync

### Gotchas

- **Mobile responsiveness:** Wave math needs adjustment for narrower viewports
- **Focus state:** Use class toggles for focus, not inline styles (performance)

---

## 2026-01-27 — Infinite Canvas

**Source:** [Codrops Tutorial](https://tympanus.net/codrops/2026/01/07/infinite-canvas-building-a-seamless-pan-anywhere-image-space/)

### Techniques Learned

1. **Chunk-Based Rendering**
   - Divide infinite space into chunks (NxN images each)
   - Only render chunks within viewport + buffer
   - Use chunk coordinates as keys for efficient React reconciliation

2. **Momentum Physics**
   - Store velocity on drag, apply friction per frame (0.95x)
   - Creates natural "throw" feeling
   - Stop when velocity below threshold

3. **R3F Drag Handling**
   - Use `@react-three/drei` drag controls or custom pointer events
   - Track delta between frames for smooth movement

### Gotchas

- **Texture loading:** Wrap images in Suspense for loading states
- **Chunk calculation:** Off-by-one errors when calculating visible chunks — add buffer

---

## 2026-01-30 — Terminal Text Hover

**Source:** [Codrops Tutorial](https://tympanus.net/codrops/2024/06/19/hover-animations-for-terminal-like-typography/)

### Techniques Learned

1. **SplitType for Character-Level DOM Access**
   - Split text into words and characters: `new SplitType(el, { types: 'words,chars' })`
   - Returns `chars` array of individual span elements
   - Call `revert()` on cleanup to restore original DOM
   - Store original innerHTML before animating for accurate reset

2. **GSAP repeatRefresh for Randomization**
   - Use `repeatRefresh: true` to re-evaluate functions on each repeat cycle
   - Combined with `innerHTML: () => randomChar()` creates the scramble effect
   - Each repeat shows a different random character

3. **CSS Custom Properties for Animation State**
   - Use `--cursor-opacity` and `--bg-scale` as animation targets
   - GSAP can tween custom properties with `gsap.to(el, { '--var': value })`
   - CSS pseudo-elements (`::after`, `::before`) reference these vars
   - Enables complex effects without extra DOM elements

4. **Multiple Variant Patterns**
   - Use class-based variants (`hover-effect--cursor`, `hover-effect--bg`)
   - Same animator class handles all variants with conditional logic
   - CSS handles visual differences, JS handles timing

### Gotchas

- **Font kerning:** Set `font-kerning: none` on split text elements to prevent layout shifts during animation
- **Inline styles vs classes:** For responsive breakpoints, need actual class names — can't use `!important` with inline styles
- **Color reset:** Store original computed colors before animation, not just innerHTML
- **Cleanup timing:** Always kill active tweens before destroying the splitter to prevent orphaned animations

### Would Do Differently

- Add touch support for mobile (tap to trigger instead of hover)
- Consider using CSS `@property` for typed custom properties with fallbacks
- Could pre-split all text on mount for faster hover response
- Add accessibility: `aria-live="polite"` on animated regions for screen readers

---

## 2026-02-01 — Curved Path Animation

**Source:** [Codrops Tutorial](https://tympanus.net/codrops/2025/12/17/building-responsive-scroll-triggered-curved-path-animations-with-gsap/) — Inspired by Lando Norris's website

### Techniques Learned

1. **GSAP MotionPath Plugin**
   - Register with `gsap.registerPlugin(MotionPathPlugin)`
   - Pass SVG path string to `motionPath.path` property
   - Automatically interpolates position along the Bezier curve
   - Use `autoRotate: false` for non-rotating elements

2. **Cubic Bezier Path Construction**
   - SVG path syntax: `M start C cp1 cp2 mid C cp3 cp4 end`
   - Two curves for an S-shape (4 control points total)
   - Control points "pull" the curve — further = more dramatic curve
   - Can chain multiple curves for complex paths

3. **Dynamic Control Point Calculation**
   - Measure actual DOM positions with `getBoundingClientRect()`
   - Calculate control points as percentages of segment distances
   - Use multipliers like 0.75, 0.3 to shape the curve feel
   - `Math.min()` prevents extreme values on large screens

4. **Progress-Based Size Interpolation**
   - Use `this.progress()` in GSAP's `onUpdate` callback
   - Split animation at midpoint for three-position paths
   - Normalize progress per segment: `progress * 2` for first half, `(progress - 0.5) * 2` for second
   - Apply interpolated size directly to element style

5. **Debug Visualization Pattern**
   - SVG overlay with pointer-events: none
   - Draw path, anchors, control points, and handle lines
   - Enable pointer-events on control point circles for dragging
   - Use pointer capture for smooth drag handling
   - Export coordinates to clipboard for production use

### Gotchas

- **ScrollTrigger cleanup:** Always kill existing timeline before rebuilding — avoids stacking animations
- **Transform origin:** Use `xPercent: -50, yPercent: -50` to center element on path coordinates
- **Resize handling:** Debounce resize events, recalculate positions and control points
- **Mobile positioning:** Position markers need separate media queries — percentage-based positioning breaks on narrow viewports
- **Path invalidation:** Use `invalidateOnRefresh: true` on ScrollTrigger for responsive paths

### Would Do Differently

- Add option to pass custom control points directly (skip auto-calculation)
- Consider using `gsap.quickTo()` for size interpolation instead of direct style manipulation
- Add Lenis smooth scroll integration for smoother scrubbing
- Could add `ease` curves between waypoints instead of linear interpolation

---

## 2026-02-02 — 3D Gradient Carousel with Reactive Backgrounds

**Source:** [Codrops Tutorial](https://tympanus.net/codrops/2025/11/11/building-a-3d-infinite-carousel-with-reactive-background-gradients/)

### Techniques Learned

1. **CSS 3D Transforms for Carousel**
   - Set `perspective: 1800px` on parent stage for depth
   - Use `transform-style: preserve-3d` on cards container
   - Combine `translateZ`, `rotateY`, and `scale` based on distance from center
   - `backface-visibility: hidden` prevents rendering when rotated away

2. **Normalized Position → Transform Calculation**
   - Normalize screen position to -1..1 range: `screenX / viewportHalf`
   - Inverse of absolute norm (1 - |norm|) drives depth and scale
   - Cards closer to center get larger scale and more Z depth
   - Rotation proportional to raw norm creates natural "page-flip" effect

3. **Canvas Color Extraction from Images**
   - Create small offscreen canvas (48px max dimension)
   - Draw scaled image with `ctx.drawImage()`
   - Use `getImageData()` to access pixel RGBA values
   - Sample from center and corners for representative colors
   - Keep canvas tiny for performance — color data doesn't need resolution

4. **Radial Gradients for Ambient Background**
   - Use `createRadialGradient(x, y, 0, x, y, radius)` for soft blobs
   - Color stop at 0: full color with ~0.7 opacity
   - Color stop at 1: transparent for soft edges
   - Layer multiple gradients with different positions
   - Animate blob positions with sine/cosine for organic drift

5. **Momentum Physics for Drag/Scroll**
   - Store velocity, apply friction each frame: `velocity *= friction^(dt * 60)`
   - Friction 0.92 gives natural deceleration
   - Clamp tiny velocities to zero to prevent micro-jitter
   - Use pointer capture for smooth drag handling across element boundaries

6. **Infinite Loop via Modulo**
   - Custom mod function for negative numbers: `((n % m) + m) % m`
   - Wrap scroll position around track length
   - Wrap individual card positions with half-track offset check

### Gotchas

- **CORS for color extraction:** Images must have `crossOrigin: 'anonymous'` or extraction fails
- **Canvas sizing:** Set canvas width/height attributes (not just CSS) for proper resolution
- **Pointer events:** Use `setPointerCapture` to maintain drag even when cursor leaves card
- **GSAP gradient tweening:** Tween individual RGB components, not color strings
- **Z-index layering:** Set z-index based on calculated Z depth for proper overlap

### Would Do Differently

- Add keyboard navigation (arrow keys to advance)
- Implement lazy loading for images outside visible range
- Consider using WebGL for smoother gradient rendering at scale
- Add touch velocity detection for more natural swipe momentum
- Could add color palette caching to avoid re-extraction

---

*Last updated: 2026-02-02*
