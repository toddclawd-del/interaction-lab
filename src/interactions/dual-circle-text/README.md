# Dual Circle Text

Counter-rotating orbital text animation where two circles of text items rotate in opposite directions as you scroll.

## Inspiration

- [Codrops Tutorial: Creating 3D Scroll-Driven Text Animations with CSS and GSAP](https://tympanus.net/codrops/2025/11/04/creating-3d-scroll-driven-text-animations-with-css-and-gsap/)
- [Demo](https://tympanus.net/Tutorials/3DTextScroll/index2.html)

## Features

- Two text circles positioned on opposite sides of the viewport
- Counter-rotating animation (left = clockwise, right = counterclockwise)
- Scroll-linked animation using GSAP ScrollTrigger
- Text items rotate to stay readable as they orbit
- Center branding element with glass morphism effect

## Techniques Used

1. **Trigonometric Positioning**
   - `Math.cos(angle) * radius` for X position
   - `Math.sin(angle) * radius` for Y position
   - Items distributed across half circle (π radians)

2. **Scroll-Linked Animation**
   - GSAP ScrollTrigger with `scrub: 1` for smooth motion
   - Progress mapped to rotation angle: `scrollY * direction * Math.PI * 2`
   - Direction value (1 or -1) creates mirrored rotation

3. **Text Readability**
   - Rotation offset of 180° for right circle keeps text right-side up
   - `translate(-50%, -50%)` centers text on calculated position

## Usage

```tsx
import { DualCircleText } from './interactions/dual-circle-text'

<DualCircleText />
```

## Customization

- **Items**: Modify the `ITEMS` array to change displayed text
- **Radius**: Adjust `radius` calculation (currently 40% of wrapper size)
- **Speed**: Modify the progress multiplier in `onUpdate` (currently `0.5`)
- **Position**: Adjust `left: 25%` and `left: 75%` in wrapper styles

## Limitations

- Best viewed on desktop/tablet (768px+)
- On mobile, circles overlap - would need vertical stacking or single circle mode
- No touch/drag interaction - scroll only

## Dependencies

- GSAP (with ScrollTrigger plugin)
- React

## Browser Support

Works in all modern browsers that support CSS transforms and GSAP.
