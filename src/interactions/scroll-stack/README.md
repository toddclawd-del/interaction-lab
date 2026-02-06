# Scroll Stack

A scroll-driven card stacking interaction where content cards pin to the viewport and stack on top of each other as the user scrolls. Previous cards scale down, blur, and fade — creating a cinematic depth effect.

## Preview

Cards stack with:
- **3D depth scaling** — background cards shrink progressively
- **Progressive blur** — stacked cards gain blur for depth-of-field
- **Opacity fade** — natural attention focus on the active card
- **Progress dots** — clickable navigation on the right side
- **Smooth reverse** — scroll up to unstack cards

## Usage

```tsx
import { ScrollStack } from './ScrollStack';

// Default cards
<ScrollStack />

// Custom cards
<ScrollStack
  cards={[
    {
      title: 'Your Title',
      description: 'Your description text.',
      tags: ['Tag1', 'Tag2'],
      gradient: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
      glow: 'rgba(15, 52, 96, 0.25)',
      cta: { label: 'Learn More' },
    },
    // ...more cards
  ]}
  scaleStep={0.04}
  offsetStep={40}
  enableBlur={true}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `cards` | `StackCard[]` | 5 demo cards | Card data array |
| `scaleStep` | `number` | `0.04` | Scale reduction per stacked card |
| `offsetStep` | `number` | `40` | Y-offset pixels between stacked cards |
| `enableBlur` | `boolean` | `true` | Enable blur on background cards |
| `showHero` | `boolean` | `true` | Show intro hero section |
| `showOutro` | `boolean` | `true` | Show outro section |
| `showProgress` | `boolean` | `true` | Show right-side progress dots |

## Card Data Shape

```ts
interface StackCard {
  title: string;        // Supports \n for line breaks
  description: string;
  tags: string[];
  image?: string;       // Custom image URL
  icon?: string;        // Emoji or icon character
  cta?: { label: string; href?: string };
  gradient: string;     // CSS gradient for background
  glow: string;         // CSS color for box-shadow glow
}
```

## Tech

- **GSAP ScrollTrigger** — pinning + scrub animations
- **CSS** — 3D transforms, blur, gradients
- **React** — refs for direct DOM manipulation with GSAP
- **Zero external deps** beyond GSAP (already in project)

## How It Works

1. Each card section is `100vh` tall
2. GSAP `ScrollTrigger.create()` pins each card with `pinSpacing: false`
3. As the *next* card scrolls into view, the current card's inner container animates:
   - `scale` → shrinks by `scaleStep` per depth layer
   - `y` → shifts up by `offsetStep`
   - `filter: blur()` → progressive blur
   - `opacity` → fades slightly
4. Progress dots update via `onEnter`/`onLeaveBack` callbacks
5. Scrolling up reverses everything naturally via GSAP scrub

## Responsive

- **Desktop** (1280px+): Full two-column layout with image
- **Tablet** (768-1024px): Single column, image hidden
- **Mobile** (375-640px): Compact layout, smaller dots
- **Ultrawide** (2560px+): Wider max-width container

## Browser Support

All modern browsers. GSAP handles vendor prefixes.
