# Curved Path Animation

Scroll-triggered animation where an element follows smooth Bezier curves between multiple positions. Built with GSAP MotionPath + ScrollTrigger.

## Source

[Codrops Tutorial](https://tympanus.net/codrops/2025/12/17/building-responsive-scroll-triggered-curved-path-animations-with-gsap/) — Original concept for Lando Norris's website.

## Features

- **Bezier Curves** — Smooth S-curves between waypoints using cubic Bezier math
- **Scroll-Driven** — Animation scrubs with scroll position via ScrollTrigger
- **Size Interpolation** — Element smoothly scales as it travels between positions
- **Debug Mode** — Visual configurator with draggable control points
- **Responsive** — Recalculates paths on resize
- **Portable** — Self-contained component, easy to customize

## Usage

```tsx
import { CurvedPath, CurvedPathDemo } from './curved-path'

// Basic usage
<CurvedPath 
  imageSrc="/your-image.jpg"
  scrollMultiplier={2.5}
/>

// With debug mode for fine-tuning curves
<CurvedPath 
  debug={true}
  imageSrc="/your-image.jpg"
  positions={3}  // 2 or 3 waypoints
/>

// Full demo page
<CurvedPathDemo />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `debug` | boolean | false | Show path visualization and draggable control points |
| `imageSrc` | string | picsum photo | URL for the animated image |
| `children` | ReactNode | - | Custom content instead of image |
| `positions` | 2 \| 3 | 3 | Number of waypoints |
| `scrollMultiplier` | number | 2.5 | Height of scroll section (multiplied by 100vh) |
| `className` | string | '' | Additional CSS class |

## How It Works

1. **Position Markers** — Define waypoints using `data-pos` attributes
2. **Measure** — Calculate center points and dimensions of each position
3. **Control Points** — Auto-calculate Bezier control points for smooth curves
4. **SVG Path** — Build path string: `M start C cp1 cp2 mid C cp3 cp4 end`
5. **MotionPath** — GSAP animates element along the path
6. **ScrollTrigger** — Ties animation progress to scroll position
7. **Size Tween** — Interpolate width/height based on progress

## Debug Mode

Enable `debug={true}` to:
- See the path as a dashed red line
- View anchor points (red circles)
- Drag control points (green circles) to reshape the curve
- Click "Copy Control Points" to export coordinates

## Customization

### Custom Waypoint Positions

Modify the `data-pos` elements' CSS to change where the element travels:

```css
.curved-path-pos[data-pos="1"] {
  top: 10%;
  left: 20%;
  width: 200px;
  height: 250px;
}
```

### Custom Control Points

Use debug mode to find your perfect curve, then hardcode the values:

```tsx
const customControlPoints = [
  { x: 150, y: 450 },
  { x: 800, y: 600 },
  { x: 850, y: 900 },
  { x: 600, y: 1100 }
]
```

## Dependencies

- GSAP (with ScrollTrigger and MotionPath plugins)
- React

## Browser Support

All modern browsers. Uses CSS `clamp()` for responsive sizing.

## Credits

- Tutorial: [Codrops](https://tympanus.net/codrops/2025/12/17/building-responsive-scroll-triggered-curved-path-animations-with-gsap/)
- Author: Ross Anderson
- Recreated for Interaction Lab
