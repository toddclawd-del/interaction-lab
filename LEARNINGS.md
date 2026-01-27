# 🧠 Learnings Log

Techniques and lessons learned from building interactions. Read this before starting new work to apply past learnings.

---

## 2026-01-27 — Infinite Canvas

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

**Gotchas:**
- Things that tripped me up

**Would Do Differently:**
- Improvements for next time
```
