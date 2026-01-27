# 🧠 Learnings Log

Techniques and lessons learned from building interactions. **Read this before starting new work** to apply past learnings.

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
