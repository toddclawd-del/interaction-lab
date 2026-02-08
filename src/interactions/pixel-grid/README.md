# Geist Pixel Components

Production-ready, drag-and-drop text components for Geist Pixel typography effects.

## Installation

1. Install the fonts via npm or self-host:

```bash
npm install geist
```

2. Add the CSS variables to your root:

```css
:root {
  --font-pixel-square: 'Geist Pixel Square', monospace;
  --font-pixel-grid: 'Geist Pixel Grid', monospace;
  --font-pixel-circle: 'Geist Pixel Circle', monospace;
  --font-pixel-triangle: 'Geist Pixel Triangle', monospace;
  --font-pixel-line: 'Geist Pixel Line', monospace;
  --font-geist-sans: 'Geist Sans', system-ui, sans-serif;
}
```

3. Copy the components you need from `components/`.

## Components

### PixelText

Static text in a Geist Pixel variant.

```tsx
import { PixelText } from './pixel-grid'

<PixelText variant="square">HELLO</PixelText>
<PixelText variant="grid" as="h1">Title</PixelText>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | string | required | Text to display |
| variant | 'square' \| 'grid' \| 'circle' \| 'triangle' \| 'line' | 'square' | Pixel variant |
| as | 'span' \| 'div' \| 'h1' \| 'h2' \| 'h3' \| 'p' | 'span' | HTML element |
| className | string | - | CSS class |

---

### PixelMorph

Text that transitions between variants. Auto-cycles or controlled.

```tsx
import { PixelMorph } from './pixel-grid'

// Auto-cycling
<PixelMorph variants={['square', 'grid', 'sans']} interval={2000}>
  VERCEL
</PixelMorph>

// Controlled
const [variant, setVariant] = useState('square')
<PixelMorph activeVariant={variant} auto={false}>
  MORPH
</PixelMorph>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | string | required | Text to display |
| variants | FontState[] | all variants | Variants to cycle through |
| interval | number | 1500 | ms between transitions |
| auto | boolean | true | Auto-cycle mode |
| activeVariant | FontState | - | Controlled mode |
| onVariantChange | (variant) => void | - | Callback on change |

---

### PixelReveal

Text that reveals character-by-character with stagger.

```tsx
import { PixelReveal } from './pixel-grid'

// Reveal on scroll
<PixelReveal from="grid" to="sans" trigger="inView" staggerMs={80}>
  BUILD FASTER
</PixelReveal>

// Manual trigger
const [revealed, setRevealed] = useState(false)
<PixelReveal isRevealed={revealed} trigger="manual" onComplete={() => console.log('done')}>
  REVEAL ME
</PixelReveal>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | string | required | Text to display |
| from | PixelVariant | 'square' | Starting font |
| to | FontState | 'sans' | Target font |
| staggerMs | number | 60 | Delay between chars |
| trigger | 'mount' \| 'inView' \| 'manual' | 'mount' | When to start |
| isRevealed | boolean | - | For manual trigger |
| onComplete | () => void | - | Callback when done |

---

### PixelScramble

Decode effect — random characters lock in one by one.

```tsx
import { PixelScramble } from './pixel-grid'

<PixelScramble trigger="mount" targetVariant="sans" onComplete={() => console.log('decoded')}>
  DECODED
</PixelScramble>

// Trigger on scroll
<PixelScramble trigger="inView" scrambleSpeed={40} lockInDelay={200}>
  SECRET
</PixelScramble>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | string | required | Text to decode |
| targetVariant | FontState | 'sans' | Final font |
| scrambleSpeed | number | 50 | ms per random swap |
| lockInDelay | number | 180 | ms between lock-ins |
| trigger | 'mount' \| 'inView' \| 'manual' | 'mount' | When to start |
| isActive | boolean | - | For manual trigger |
| onComplete | () => void | - | Callback when done |

---

### PixelHover

Text morphs on hover (and focus for a11y).

```tsx
import { PixelHover } from './pixel-grid'

// Simple hover
<PixelHover pixelVariant="triangle" hoverVariant="sans">
  HOVER ME
</PixelHover>

// Staggered character effect
<PixelHover staggered>
  WAVE EFFECT
</PixelHover>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | string | required | Text to display |
| pixelVariant | PixelVariant | 'square' | Default font |
| hoverVariant | FontState | 'sans' | Hover font |
| staggered | boolean | false | Character-by-character |

---

## Accessibility

All components:
- Detect `prefers-reduced-motion: reduce` and skip animations
- Keep text visible to screen readers at all times
- PixelHover responds to keyboard focus (not just mouse)

## Hooks

### useReducedMotion

```tsx
import { useReducedMotion } from './pixel-grid'

const prefersReduced = useReducedMotion()
```

### useInView

```tsx
import { useInView } from './pixel-grid'

const ref = useRef<HTMLDivElement>(null)
const isInView = useInView(ref, { threshold: 0.3, once: true })
```

## Font Setup (Self-Hosted)

Download from https://vercel.com/font and add to `/public/fonts/`:

```
public/fonts/
├── geist-pixel/
│   ├── GeistPixel-Square.woff2
│   ├── GeistPixel-Grid.woff2
│   ├── GeistPixel-Circle.woff2
│   ├── GeistPixel-Triangle.woff2
│   └── GeistPixel-Line.woff2
└── geist-sans/
    ├── Geist-Regular.woff2
    ├── Geist-Medium.woff2
    └── Geist-Bold.woff2
```

Then import `geist-pixel.css` for the @font-face declarations.

---

**Credits:** Geist Pixel by [Vercel](https://vercel.com/font). Components by Interaction Lab.
