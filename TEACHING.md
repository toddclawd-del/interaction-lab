# 🧠 Learnings Log

Techniques and lessons learned from building interactions. **Read this before starting new work** to apply past learnings.

> **Format Note:** Each interaction includes two sections:
> 1. **Concepts & Techniques** — The "why" and "how it works" for learning
> 2. **Implementation Notes** — The "what I built" for future reference

---

## 2026-01-27 — Infinite Canvas (v5/v6: Instancing + Bloom)

**Reference:** https://tympanus.net/codrops/2026/01/07/infinite-canvas-building-a-seamless-pan-anywhere-image-space/

### 🎓 Concepts & Techniques

#### **Instanced Rendering** — Draw 1000 objects in 1 call
When you render many similar objects (like placeholder rectangles), each one normally requires a "draw call" to the GPU. Draw calls are expensive — they're the main bottleneck in 3D performance.

**Instanced rendering** lets you say: "Here's one shape. Now draw it 1000 times at these different positions/scales." One draw call, many copies.

*When to use it:* Lots of identical geometry (particles, grass, crowds, placeholder shapes). Doesn't work well when each object needs a different texture — that's why we only instance the placeholders, not the actual images.

*Key insight:* The geometry is shared, but each instance can have its own transformation matrix (position/rotation/scale). You set these via `setMatrixAt(index, matrix)`.

---

#### **Texture Disposal** — Don't leak GPU memory
Textures (images loaded into WebGL) live in GPU memory. Unlike regular JavaScript objects, they don't get garbage collected automatically. If you load 100 images, navigate away, and load 100 more — you now have 200 textures eating VRAM.

*Fix:* When a component unmounts, explicitly call `texture.dispose()`. This tells Three.js to free that GPU memory.

*When it matters:* Any time images/textures are dynamic (loaded/unloaded based on user navigation). Less important for static scenes.

---

#### **Spring Physics** — Why UIs feel good
Linear movement (constant speed, instant stop) feels robotic. Humans expect physics: acceleration, momentum, overshoot, settle.

A **spring** simulates this with three values:
- `current` — where you are
- `target` — where you want to be  
- `velocity` — how fast you're moving

Each frame:
1. Calculate force: `(target - current) * stiffness`
2. Add force to velocity
3. Apply damping: `velocity *= damping`
4. Update position: `current += velocity`

*Stiffness* = how snappy (high = fast catch-up)  
*Damping* = how bouncy (low = more overshoot)

This is the foundation of libraries like Framer Motion, react-spring, and smooth scrolling.

---

#### **Post-Processing & Bloom** — The "Hollywood" look
Post-processing means rendering your scene to a texture first, then applying effects to that texture before displaying it. Like Instagram filters, but for 3D.

**Bloom** specifically:
1. Render the scene
2. Extract bright areas (above a luminance threshold)
3. Blur those bright areas
4. Add the blur back on top of the original

Result: bright things "glow" and bleed light into surroundings. Makes images feel luminous, adds depth, creates that cinematic/ethereal vibe.

*Performance note:* Each post-processing effect adds a render pass. Bloom requires multiple blur passes. Skip on mobile where GPU is weaker.

---

#### **Pinch Gesture Math**
Two-finger gestures track the distance between touch points:

```
distance = √((x1-x2)² + (y1-y2)²)
delta = previousDistance - currentDistance
```

- `delta > 0` = fingers moved closer = "pinch in" = zoom out / move forward
- `delta < 0` = fingers moved apart = "pinch out" = zoom in / move back

*Key UX insight:* Add a "deadzone" (ignore tiny movements) to filter finger jitter, and a "minimum impulse" so each gesture feels meaningful even if the actual pinch was small.

---

### 📋 Implementation Notes

**v5 changes:**
- `InstancedMesh` for placeholder loading states
- `texture.dispose()` in useEffect cleanup
- Pinch sensitivity 0.03 → 0.12 (4x)
- Added minimum impulse (0.5) per pinch gesture
- Reduced planes per chunk, lower mobile DPR

**v6 changes:**
- Added `@react-three/postprocessing` 
- Bloom effect (desktop only): intensity 0.4, threshold 0.6
- mipmapBlur for better quality

**Self-Score: 84/100**

| Category | Score | Notes |
|----------|-------|-------|
| Visual Fidelity | 22/25 | Bloom adds polish |
| Interaction Feel | 17/20 | Pinch is snappy now |
| Code Quality | 13/15 | Clean, could abstract more |
| Portability | 12/15 | Self-contained |
| Performance | 7/10 | Instancing helps, still room for optimization |
| Responsiveness | 13/15 | Good mobile feel |

---

## 2026-01-27 — Infinite Canvas (v4: Polished)

**Reference:** https://tympanus.net/codrops/2026/01/07/infinite-canvas-building-a-seamless-pan-anywhere-image-space/

**Interaction:** Polished 3D infinite space with loading states and spring physics

**Improvements from v3:**

### 1. Blur Placeholder Loading States
- Wrapped `ImagePlane` in `<Suspense>` with `PlaceholderPlane` fallback
- Placeholder is subtle dark rect that fades based on distance
- Once texture loads, fade in smoothly over 300ms
- Prevents jarring pop-in of images

### 2. Spring Physics for Z Navigation
- Created `SpringValue` class with target/current/velocity
- Z movement applies to `target`, spring catches up smoothly
- `stiffness` controls how fast (0.08 = gentle)
- `damping` controls overshoot (0.85 = slight bounce)
- Result: scroll feels organic, not mechanical

### 3. Pinch Sensitivity Tuning
- Reduced multiplier from 0.05 to 0.03
- Added deadzone (5px) to filter jitter
- Separate `isPinching` state to prevent drag interference
- Reset pinch tracking properly on touch end

### 4. Code Quality
- Separated touch start/move/end handlers
- Cleaner state management for pinch vs drag
- Better event listener cleanup

**Self-Score:**

| Category | Max | Score | Notes |
|----------|-----|-------|-------|
| Visual Fidelity | 25 | 20 | Placeholders help, still no bloom/glow |
| Interaction Feel | 20 | 17 | Spring Z is buttery, pinch improved |
| Code Quality | 15 | 13 | Clean but not instanced yet |
| Portability | 15 | 12 | Same as v3 |
| Performance | 10 | 6 | Still no instancing |
| Responsiveness | 15 | 13 | Pinch deadzone helps mobile |
| **TOTAL** | **100** | **81** | Solid improvement |

**Still TODO:**
- Instanced meshes (big perf win)
- Subtle glow/bloom on images
- Better image loading (blur hash instead of solid placeholder)

---

## 2026-01-27 — Infinite Canvas (v3: True 3D)

**Reference:** https://tympanus.net/codrops/2026/01/07/infinite-canvas-building-a-seamless-pan-anywhere-image-space/

**Interaction:** True 3D infinite image space — navigate X, Y, AND Z axes

**Key Upgrade from v2:**
The flat 2D version was missing the entire point of the Codrops reference. The magic is in **depth navigation** — scrolling/pinching to dive through layers of images creates that spatial, exploratory feel.

**Techniques Learned:**

### 3D Chunk System
- Chunks are now **cubes**, not tiles: 3×3×3 = 27 active chunks
- Chunk key includes Z: `${cx},${cy},${cz}`
- Images distributed throughout 3D space within each chunk
- Camera moves through space; world stays static

### Z-Axis Navigation
- **Desktop:** Scroll wheel controls Z movement
- **Mobile:** Pinch gesture controls Z (detect 2-finger touch, measure distance delta)
- Apply to velocity for momentum, not instant position change
- Z velocity gets same friction treatment as X/Y

### Distance-Based Fading
- Calculate distance from camera to each image plane
- Fade opacity: `1 - (dist - FADE_START) / (FADE_END - FADE_START)`
- Use Three.js fog for additional depth atmosphere
- Hide planes entirely when opacity < 0.01 (performance)

### Billboarding
- Images always face camera: `mesh.lookAt(cameraPosition)`
- Essential when images exist at varied Z depths
- Without this, images viewed from side are invisible slivers

### Camera vs World Movement
- v2 moved the world, camera stayed put
- v3 moves the camera through static world
- More intuitive for 3D: "you" are exploring the space
- Chunk visibility calculated from camera position

### Pinch Gesture Detection
```typescript
if (e.touches.length === 2) {
  const dx = e.touches[0].clientX - e.touches[1].clientX
  const dy = e.touches[0].clientY - e.touches[1].clientY
  const dist = Math.sqrt(dx * dx + dy * dy)
  // Compare to lastPinchDist for delta
}
```

**Gotchas:**
- Must track `lastPinchDist` separately from drag state
- Reset pinch distance on touchend (not just touchstart)
- Wheel event needs `{ passive: false }` to preventDefault
- Camera Z offset needed to see content (camera at z=30, content around z=0)

**Self-Score (honest):**

| Category | Max | Score | Notes |
|----------|-----|-------|-------|
| Visual Fidelity | 25 | 18 | Matches reference spatially, but lacks polish (no image loading states, no subtle glow) |
| Interaction Feel | 20 | 15 | Z-nav works but could be smoother, pinch needs tuning |
| Code Quality | 15 | 13 | Clean separation, could use more perf optimization |
| Portability | 15 | 12 | Self-contained but chunk config is hardcoded |
| Performance | 10 | 6 | 27 chunks is heavy, no instancing, no LOD |
| Responsiveness | 15 | 12 | Works on mobile but pinch is finicky |
| **TOTAL** | **100** | **76** | Functional 3D, needs polish pass |

**Would Do Differently:**
- Add loading states for images (blur placeholders)
- Implement instanced meshes for better perf
- Add subtle glow/bloom on images
- Smoother easing on Z navigation
- Better pinch-to-zoom sensitivity curve

---

## 2026-01-27 — Infinite Canvas (v2: Responsive Update)

**Interaction:** Pannable infinite image grid — now fully responsive

**Techniques Learned:**

### Responsive 3D Viewport Calculations
- **Don't use magic numbers** for viewport-to-world-unit conversions
- Use proper camera frustum math:
  ```typescript
  const vFov = (camera.fov * Math.PI) / 180
  const worldHeight = 2 * Math.tan(vFov / 2) * camera.position.z
  const worldWidth = worldHeight * (width / height)
  ```
- This ensures consistent behavior from 375px mobile to 2560px ultrawide

### Responsive Drag Sensitivity
- Calculate sensitivity based on viewport: `worldWidth / screenWidth`
- This makes "1 pixel of drag" feel the same regardless of screen size
- Without this, dragging feels sluggish on large screens and twitchy on mobile

### Touch Support
- Add both pointer events AND touch events for best compatibility
- Use `{ passive: true }` for touch listeners when possible
- Set `touchAction: 'none'` on container to prevent browser scroll/zoom
- Reduce momentum multiplier on touch (0.6 vs 0.8) — fingers are less precise

### Mobile-Specific Adjustments
- Detect mobile via `window.innerWidth < 768` (not user agent)
- Disable hover effects on mobile — they cause sticky states
- Reduce image sizes on mobile for better visual density
- Adjust friction (0.92 vs 0.95) — shorter momentum feels better on touch
- Change helper text: "Swipe to explore" vs "Drag to explore"

### Responsive UI Elements
- Scale padding/margins based on screen size
- Scale font sizes: 11px mobile, 13px desktop for helper text
- Keep UI elements away from edges on mobile (notches, gesture areas)

**Gotchas:**
- R3F's pointer events work fine but touch events need DOM listeners
- Always add `touchAction: 'none'` or gestures will fight with browser
- `useThree()` returns `camera` as `Camera` type — cast to `PerspectiveCamera`
- Re-listen on resize since sensitivity values change

**Would Do Differently:**
- Consider using `@react-three/drei`'s `useGesture` for cleaner drag handling
- Could add pinch-to-zoom on mobile
- Could lazy-load images that aren't in initial viewport

---

## 2026-01-27 — Infinite Canvas (v1: Initial Build)

**Interaction:** Pannable infinite image grid

**Techniques Learned:**
- **Chunk-based rendering** — Don't render everything, only what's visible + buffer. Calculate visible chunks from camera/viewport position.
- **Pointer events in R3F** — Use native DOM events via `gl.domElement` for reliable drag, not R3F's built-in pointer events (they don't track outside canvas).
- **Momentum physics** — Store velocity during drag, apply with friction (0.95 multiplier) after release for natural feel.
- **Deterministic randomness** — Use position-based seed (`x * 7 + y * 13 + ...`) for consistent but varied image distribution.

**Gotchas:**
- R3F's `useThree` hook returns `size` in pixels, need to convert to world units for chunk calculations
- Always `stopPropagation()` on hover events to prevent parent elements catching them
- Set cursor styles on `document.body`, not the canvas element

**Would Do Differently:**
- Could use instanced meshes for better performance with many images
- Could add image preloading for smoother experience

---

## 🚨 Cross-Cutting Gotchas

Issues that apply across multiple interactions — read this to avoid repeating mistakes.

### RAF Loop Memory Leaks (Mobile Killer)
When using `requestAnimationFrame` in a recursive loop (common for smooth scroll libraries like Lenis), you MUST cancel it on unmount.

**Bad:**
```typescript
useEffect(() => {
  function raf(time: number) {
    doStuff(time)
    requestAnimationFrame(raf) // This keeps running forever!
  }
  requestAnimationFrame(raf)
  
  return () => {
    // RAF still running in background, intercepting events
  }
}, [])
```

**Good:**
```typescript
useEffect(() => {
  let rafId: number
  
  function raf(time: number) {
    doStuff(time)
    rafId = requestAnimationFrame(raf)
  }
  rafId = requestAnimationFrame(raf)
  
  return () => {
    cancelAnimationFrame(rafId) // Actually stops the loop
  }
}, [])
```

*Symptom:* Page scroll stops working after navigating away from an interaction (especially on mobile).

### iOS Touch Scroll
iOS Safari needs explicit permission to scroll smoothly:
- Add `-webkit-overflow-scrolling: touch` to scrollable containers
- Use `touch-action: pan-y` (or `pan-x`) to allow specific gestures
- `touch-action: none` blocks ALL touch — only use on canvases you fully control

---

## Template for Future Entries

```markdown
## YYYY-MM-DD — [Interaction Name]

**Interaction:** Brief description

**Techniques Learned:**
- Bullet points of actual techniques
- Include code snippets for complex stuff

**Gotchas:**
- Things that tripped me up

**Would Do Differently:**
- Improvements for next time
```
