# Direction-Aware Marquee Menu

A premium menu interaction where hovering reveals a scrolling marquee that slides in from the direction your cursor enters. Inspired by [K72's website](https://k72.ca/en).

## Features

- **Direction-aware**: Marquee slides in from the edge your cursor enters (top or bottom)
- **Double-layer reveal**: Parent and child translate in opposite directions for a "wipe" illusion
- **Infinite marquee**: Text and images scroll seamlessly
- **Dark/light themes**: Built-in theme support
- **Accessible**: Keyboard navigation, focus states, reduced motion support
- **Mobile-friendly**: Graceful fallback to simple tap-to-toggle

## Installation

Copy the `marquee-menu` folder to your project's components directory.

### Dependencies

- GSAP (already included in Interaction Lab)
- React 18+

## Usage

```tsx
import { MarqueeMenu, MarqueeMenuItem } from '@/interactions/marquee-menu'

function Navigation() {
  return (
    <MarqueeMenu theme="dark">
      <MarqueeMenuItem
        label="About"
        href="/about"
        marqueeContent={[
          { type: 'text', content: 'Our Story' },
          { type: 'image', src: '/images/team.jpg', alt: 'Team photo' },
          { type: 'text', content: 'Since 2015' },
          { type: 'image', src: '/images/office.jpg', alt: 'Office' },
        ]}
      />
      <MarqueeMenuItem
        label="Work"
        href="/work"
        marqueeContent={[
          { type: 'text', content: 'Featured Projects' },
          { type: 'image', src: '/images/project-1.jpg' },
          { type: 'text', content: 'Case Studies' },
        ]}
        marqueeSpeed={10}
      />
    </MarqueeMenu>
  )
}
```

## Props

### MarqueeMenu

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | MarqueeMenuItem components |
| `className` | `string` | `''` | Additional CSS class |
| `theme` | `'dark' \| 'light'` | `'dark'` | Color theme |

### MarqueeMenuItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | required | Display text for the menu item |
| `href` | `string` | required | Link destination |
| `marqueeContent` | `MarqueeContent[]` | required | Content items for the marquee |
| `backgroundColor` | `string` | theme default | Custom marquee background |
| `textColor` | `string` | theme default | Custom marquee text color |
| `onClick` | `function` | - | Click handler |
| `animationDuration` | `number` | `0.6` | Reveal animation duration (seconds) |
| `animationEase` | `string` | `'expo.out'` | GSAP easing |
| `marqueeSpeed` | `number` | `15` | Scroll cycle duration (seconds) |

### MarqueeContent

```typescript
type MarqueeContent = 
  | { type: 'text'; content: string }
  | { type: 'image'; src: string; alt?: string }
```

## Customization

### CSS Variables

Override these variables to customize colors:

```css
.marquee-menu {
  --menu-bg: #000;
  --menu-text: #fff;
  --menu-border: rgba(255, 255, 255, 0.1);
  --marquee-bg: #fff;
  --marquee-text: #000;
}
```

### Custom Theme

```tsx
<MarqueeMenuItem
  label="Special"
  href="/special"
  marqueeContent={[{ type: 'text', content: 'VIP Access' }]}
  backgroundColor="#f72585"
  textColor="#fff"
/>
```

## Accessibility

- Menu items are semantic `<a>` elements
- Marquee content is `aria-hidden` (decorative only)
- Focus triggers the marquee from top
- Respects `prefers-reduced-motion`:
  - Disables scrolling animation
  - Uses simple opacity transition instead of directional reveal

## Browser Support

- Chrome, Firefox, Safari, Edge (modern versions)
- Mobile: iOS Safari 14+, Chrome for Android

## Credits

- Original concept: [K72](https://k72.ca/en) by [Locomotive](https://locomotive.ca)
- Tutorial reference: [Codrops](https://tympanus.net/codrops/2021/06/30/how-to-code-the-k72-marquee-hover-animation/)
