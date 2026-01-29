# LEARNINGS.md — What I've Learned Building Interactions

This file captures techniques, gotchas, and insights from recreating web interactions.

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

*Last updated: 2026-01-29*
