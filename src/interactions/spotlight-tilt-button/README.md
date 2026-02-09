# Spotlight Tilt Button

Cursor-reactive buttons with radial highlight + 3D perspective tilt. Creates a premium, tactile feel — like brushed metal responding to light and pressure.

## Features

- 🎯 **Cursor-aware spotlight** — Radial highlight follows cursor position
- 🎪 **3D tilt effect** — Subtle perspective tilt toward cursor
- ✨ **Border glow** — Optional gradient border glow
- 🎨 **4 variants** — subtle, glossy, neon, glass
- ♿ **Accessible** — Keyboard nav, focus states, reduced motion
- 📱 **Touch-friendly** — Graceful fallback on touch devices
- 🚀 **60fps** — RAF-based updates, no jank

## Installation

Copy the `spotlight-tilt-button/` folder to your project:

```
spotlight-tilt-button/
├── index.tsx           # Main component + demo
├── variants.ts         # Variant configurations
├── use-spotlight-tilt.ts  # Reusable hook
└── README.md
```

Dependencies: React 18+ (no external deps required)

## Usage

```tsx
import { SpotlightTiltButton } from './spotlight-tilt-button'

// Basic
<SpotlightTiltButton>
  Click me
</SpotlightTiltButton>

// With variant
<SpotlightTiltButton variant="neon">
  Neon Style
</SpotlightTiltButton>

// With border glow
<SpotlightTiltButton variant="glossy" enableBorderGlow>
  Premium CTA
</SpotlightTiltButton>

// As a link
<SpotlightTiltButton as="a" href="/signup">
  Sign Up →
</SpotlightTiltButton>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'subtle' \| 'glossy' \| 'neon' \| 'glass'` | `'subtle'` | Visual style variant |
| `enableTilt` | `boolean` | `true` | Enable 3D tilt effect |
| `enableSpotlight` | `boolean` | `true` | Enable spotlight highlight |
| `enableBorderGlow` | `boolean` | `false` | Enable border glow effect |
| `tiltStrength` | `number` | `0.5` | Tilt intensity (0-1, maps to max 15°) |
| `spotlightSize` | `number` | `180` | Spotlight diameter in pixels |
| `spotlightIntensity` | `number` | `0.5` | Spotlight opacity (0-1) |
| `as` | `'button' \| 'a'` | `'button'` | Render as button or anchor |
| `href` | `string` | — | URL when `as="a"` |
| `disabled` | `boolean` | `false` | Disabled state |
| `className` | `string` | — | Additional CSS class |
| `style` | `CSSProperties` | — | Custom inline styles |

Plus all standard `<button>` attributes (`onClick`, `type`, etc.)

## Variants

### Subtle (default)
Clean, professional. White spotlight with low opacity. Best for dark UIs where you want understated elegance.

### Glossy
Premium product feel. White highlight with gradient falloff. Optional subtle white edge glow.

### Neon
Bold, eye-catching. Colored spotlight (purple/blue gradient). High-contrast border glow option. Gaming/creative vibes.

### Glass
Glassmorphism compatible. Frosted white spotlight on semi-transparent background.

## Accessibility

- **Tab navigation** — Full keyboard support
- **Focus state** — Centered spotlight glow (no tilt since no cursor)
- **Reduced motion** — Respects `prefers-reduced-motion`, disables tilt/transitions
- **ARIA** — Standard button semantics, `aria-disabled` when disabled

## Hook API

For advanced use cases, the underlying hook is exported:

```tsx
import { useSpotlightTilt } from './spotlight-tilt-button/use-spotlight-tilt'

function CustomComponent() {
  const { ref, state, handlers, style } = useSpotlightTilt({
    enableTilt: true,
    enableSpotlight: true,
    tiltStrength: 0.5,
  })

  return (
    <div ref={ref} style={style} {...handlers}>
      {/* state.isHovered, state.spotlightX, etc. */}
    </div>
  )
}
```

## Performance Notes

- Uses `requestAnimationFrame` for smooth 60fps updates
- No throttling needed (RAF is sufficient)
- Spring-back animation uses CSS transitions (GPU-accelerated)
- Spotlight is a single pseudo-element with gradient (minimal DOM)

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile: Touch devices get spotlight but no tilt (no cursor to track)
