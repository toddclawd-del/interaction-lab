# Parallax Tilt Card

Premium 3D cards that tilt toward the cursor with internal parallax layers. Uses Framer Motion for spring-based physics.

## Features

- 🎯 Cursor-tracking tilt with configurable max angle
- 🌊 Independent parallax layers with customizable depth
- ✨ Optional shine/glare overlay that follows cursor
- 🧲 Optional magnetic pull toward cursor
- ⚡ Spring-based animations for organic feel
- ♿ Respects `prefers-reduced-motion`
- 📱 Static fallback for touch devices

## Installation

```tsx
import { ParallaxTiltCard, ParallaxLayer } from '@/interactions/parallax-tilt-card'
```

**Dependency:** Requires `framer-motion` (included in project).

## Usage

```tsx
<ParallaxTiltCard maxTilt={12} shine magnetic>
  {/* Background layer - no movement */}
  <ParallaxLayer depth={0}>
    <img src="/background.jpg" alt="" />
  </ParallaxLayer>
  
  {/* Content - subtle movement */}
  <ParallaxLayer depth={0.5}>
    <h3>Project Title</h3>
    <p>Description here</p>
  </ParallaxLayer>
  
  {/* Floating badge - more movement, appears closer */}
  <ParallaxLayer depth={1.5}>
    <div className="badge">Featured</div>
  </ParallaxLayer>
</ParallaxTiltCard>
```

## API

### ParallaxTiltCard

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxTilt` | `number` | `15` | Maximum rotation in degrees |
| `tiltReverse` | `boolean` | `false` | Tilt away from cursor instead of toward |
| `perspective` | `number` | `1000` | CSS perspective value (px) |
| `parallaxMultiplier` | `number` | `10` | Pixels of movement per depth unit |
| `shine` | `boolean` | `true` | Enable shine/glare overlay |
| `shineOpacity` | `number` | `0.15` | Shine overlay opacity |
| `shineColor` | `string` | `'rgba(255,255,255,0.5)'` | Shine gradient color |
| `springConfig` | `{ damping, stiffness }` | `{ damping: 20, stiffness: 150 }` | Spring physics config |
| `magnetic` | `boolean` | `false` | Enable magnetic pull toward cursor |
| `magneticStrength` | `number` | `0.1` | Strength of magnetic effect |
| `disabled` | `boolean` | `false` | Disable all interactions |
| `className` | `string` | - | Container class |
| `style` | `CSSProperties` | - | Container styles |

### ParallaxLayer

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `depth` | `number` | `1` | Movement multiplier. `0` = static, `2+` = extreme |
| `className` | `string` | - | Layer class |
| `style` | `CSSProperties` | - | Layer styles |

## Depth Guide

| Depth | Effect |
|-------|--------|
| `0` | No movement (background) |
| `0.3-0.5` | Subtle movement (main content) |
| `1` | Standard movement |
| `1.5-2` | Enhanced movement (floating elements) |
| `2.5+` | Extreme movement (decorative accents) |

## Accessibility

- **`prefers-reduced-motion`**: All animations disabled, static display
- **Keyboard**: Focus ring displays, no tilt (mouse-only interaction)
- No special ARIA required — decorative motion only

## Performance

- 60fps thanks to Framer Motion's spring system
- GPU-accelerated transforms only
- No layout thrashing
- Resize-safe via bounding rect recalculation

## Examples

### Reverse Tilt (Push Effect)
```tsx
<ParallaxTiltCard tiltReverse maxTilt={10}>
  {/* Content tilts away from cursor */}
</ParallaxTiltCard>
```

### Stiffer Spring
```tsx
<ParallaxTiltCard springConfig={{ damping: 30, stiffness: 200 }}>
  {/* Snappier return animation */}
</ParallaxTiltCard>
```

### Subtle Corporate
```tsx
<ParallaxTiltCard maxTilt={5} shine={false}>
  {/* Minimal tilt, no shine — professional */}
</ParallaxTiltCard>
```
