# Terminal Text Hover

A retro terminal-inspired character scramble effect for text on hover. Characters briefly become random symbols before settling back to their original form.

## Demo

[Live Demo](https://toddclawd-del.github.io/interaction-lab/#/terminal-text-hover)

## Source

Inspired by [Codrops Tutorial](https://tympanus.net/codrops/2024/06/19/hover-animations-for-terminal-like-typography/) and [Jean Dawson's website](https://www.jeandawson.com/).

## Variants

| Variant | Description |
|---------|-------------|
| `cursor` | Blinking cursor indicator appears during scramble |
| `background` | Sliding background element reveals on hover |
| `color` | Characters flash random colors during animation |
| `blur` | Frosted glass background effect |

## Usage

### Basic Usage

```tsx
import { useRef, useEffect } from 'react'
import { TextAnimator } from './text-animator'

function HoverText({ children }: { children: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const animatorRef = useRef<TextAnimator | null>(null)
  
  useEffect(() => {
    if (!ref.current) return
    animatorRef.current = new TextAnimator(ref.current, { variant: 'cursor' })
    return () => animatorRef.current?.destroy()
  }, [])
  
  return (
    <span
      ref={ref}
      onMouseEnter={() => animatorRef.current?.animate()}
      onMouseLeave={() => animatorRef.current?.animateOut()}
    >
      {children}
    </span>
  )
}
```

### TextAnimator Options

```ts
interface AnimatorOptions {
  variant?: 'cursor' | 'background' | 'color' | 'blur'
  scrambleSpeed?: number    // Duration of each scramble cycle (default: 0.03)
  scrambleCount?: number    // How many random chars before settling (default: 3)
  staggerDelay?: number     // Delay between each character (default: 0.07)
  repeatDelay?: number      // Delay between scramble repeats (default: 0.04)
}
```

### Required CSS

The component injects its own styles, but you can also add these manually:

```css
.hover-effect {
  font-kerning: none;
  position: relative;
  white-space: nowrap;
  display: inline-block;
}

.hover-effect .char {
  position: relative;
  display: inline-block;
}

/* Cursor variant */
.hover-effect--cursor .char::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 1ch;
  height: 100%;
  background: currentColor;
  opacity: var(--cursor-opacity, 0);
}
```

## Dependencies

- `split-type` - Text splitting into characters
- `gsap` - Animation library

## Customization

### Character Set

Modify the `CHARS` array in `text-animator.ts` to change the scramble characters:

```ts
const CHARS = ['▓', '▒', '░', '█', '■', '□', '●', '○']  // Block characters
```

### Color Palette

For the color variant, modify `SCRAMBLE_COLORS`:

```ts
const SCRAMBLE_COLORS = ['#ff0000', '#00ff00', '#0000ff', '#ffff00']
```

### Timing

Adjust the animation feel with options:

```ts
new TextAnimator(element, {
  scrambleSpeed: 0.05,    // Slower scramble
  scrambleCount: 5,       // More scramble cycles
  staggerDelay: 0.04,     // Faster character cascade
})
```

## Best Practices

1. **Use monospace fonts** - The effect works best with fixed-width fonts like JetBrains Mono, SF Mono, or Fira Code
2. **Keep text short** - Long strings can feel slow; consider splitting into multiple elements
3. **Avoid frequent re-renders** - Store the animator instance in a ref, not state
4. **Clean up** - Always call `destroy()` on unmount to revert the text splitting

## Browser Support

- Modern browsers with CSS custom properties support
- `backdrop-filter` for blur variant (Safari, Chrome, Firefox 103+)
