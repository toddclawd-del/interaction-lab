# QA Standards – Interaction Lab

**Owner:** QA Agent  
**Project:** [interaction-lab](https://toddclawd-del.github.io/interaction-lab/)  
**Last Updated:** 2025-01-31

---

## 🎯 Priority: Visual Bugs

**Primary focus:** Catch visual issues that make the site look unprofessional.

### P0 - Horizontal Overflow (Mobile)

**The #1 bug to catch.** Any horizontal scrollbar on mobile = instant amateur vibes.

```
Test at: 375px, 428px, 768px
Look for: Horizontal scrollbar, content bleeding off-screen
Common culprits:
- Fixed-width elements (px instead of %, vw, or max-w-full)
- Pre/code blocks without overflow-x-auto
- Flex children without min-w-0
- Images without max-w-full
- Animations that move elements off-screen
```

**Quick test:** At each mobile breakpoint, try to scroll horizontally. If you can, it's a bug.

### P1 - Loading Issues

| Issue | What to Look For |
|-------|------------------|
| **Flash of unstyled content (FOUC)** | Page flashes white/raw HTML before styles load |
| **Layout shift** | Elements jump around as page loads |
| **Components not rendering** | Blank spaces, missing interactive elements |
| **Skeleton mismatch** | Loading skeleton doesn't match final content size |

### P2 - Responsive Breakage

Elements that look broken or unprofessional at specific sizes:
- Text overlapping other elements
- Buttons/inputs getting cut off
- Cards with wildly different heights in a grid
- Navigation items wrapping awkwardly
- Images stretched or squished

### P3 - Visual Consistency

| Issue | Example |
|-------|---------|
| **Spacing inconsistency** | 24px gap here, 32px gap there for same pattern |
| **Alignment problems** | Elements not lined up when they should be |
| **Text truncation** | Important text cut off with "..." unexpectedly |
| **Border/radius mismatch** | Some cards rounded-lg, others rounded-xl |

---

## Visual Bug Testing Process

### Step-by-Step

```bash
# 1. Open page in browser
# 2. Open DevTools → Toggle device toolbar (Cmd+Shift+M)
# 3. Test each breakpoint in sequence:
```

| Step | Width | Check |
|------|-------|-------|
| 1 | **375px** | Horizontal scroll? Content cut off? |
| 2 | **428px** | Same checks |
| 3 | **768px** | Tablet layout working? |
| 4 | **1280px** | Desktop layout correct? |
| 5 | **1920px** | Wide layout not stretched weird? |

### At Each Breakpoint, Verify:

- [ ] **No horizontal scrollbar** (scroll right should do nothing)
- [ ] **All text visible** (no truncation unless intentional)
- [ ] **Images contained** (not bleeding outside containers)
- [ ] **Buttons/inputs complete** (not cut off)
- [ ] **Cards balanced** (similar heights in grids)
- [ ] **Navigation usable** (can access all nav items)

### Common Fixes Reference

| Problem | Fix |
|---------|-----|
| Horizontal overflow | `overflow-x-hidden` on container, `max-w-full` on children |
| Image overflow | `max-w-full h-auto` or `object-cover` with fixed container |
| Flex child overflow | Add `min-w-0` to flex children |
| Text overflow | `truncate` or `break-words` |
| Code block overflow | `overflow-x-auto` on pre/code |

---

## What Good Looks Like (Research Summary)

### Professional UI Kit Patterns

After analyzing **Shadcn/ui**, **Radix**, **Aceternity**, and **Chakra UI**, here's what separates "pro" component libraries from amateur ones:

| Quality | What Pros Do | What Amateurs Do |
|---------|--------------|------------------|
| **Consistency** | Unified spacing scale (4px/8px increments), consistent border radii across components | Random spacing, inconsistent corner radii |
| **Typography** | Clear hierarchy, limited font weights (3 max), proper line-height | Too many sizes, cramped text, poor scaling |
| **Color System** | Semantic tokens (--color-primary), proper contrast ratios, dark mode native | Hardcoded hex values, accessibility issues |
| **Interaction Feedback** | Purposeful micro-animations (150-300ms), clear hover/active states | No feedback, or overdone animations |
| **Whitespace** | Generous breathing room, components don't feel cramped | Dense, cluttered layouts |
| **Documentation** | Live examples, variant showcase, code snippets visible | Static screenshots, no interactivity |

### Shadcn/ui Specific Patterns
- **Composable API**: Components share consistent props (`variant`, `size`, `asChild`)
- **Open code philosophy**: Users own the code, not a black box
- **Beautiful defaults**: Works great out-of-the-box, customizable when needed
- **WAI-ARIA first**: Accessibility baked in, not bolted on

### Radix Specific Patterns
- **Unstyled primitives**: Focus on behavior and accessibility
- **Full keyboard support**: Tab, Arrow keys, Escape all work correctly
- **Focus management**: Sensible defaults for focus trapping in modals/menus
- **Screen reader tested**: Practical testing with assistive technologies

### Aceternity Patterns
- **Visual wow factor**: Premium animations that feel high-end
- **Motion with purpose**: Animations enhance UX, not distract
- **Dark mode native**: Designed dark-first, light mode is secondary

---

## Responsive Breakpoints

Test all components at these viewport widths:

| Breakpoint | Width | Device Representation |
|------------|-------|----------------------|
| **Mobile** | 375px | iPhone SE/Mini, small Android |
| **Mobile Large** | 428px | iPhone Pro Max, large phones |
| **Tablet** | 768px | iPad Mini portrait, tablets |
| **Desktop** | 1280px | Standard laptop/desktop |
| **Wide** | 1920px | Full HD monitor |

### Testing Checklist per Breakpoint

- [ ] No horizontal scroll on page
- [ ] Touch targets minimum 44x44px (mobile)
- [ ] Text remains readable (min 14px mobile, 16px desktop)
- [ ] Grid layouts stack appropriately
- [ ] Navigation accessible (hamburger on mobile works)
- [ ] Modals/drawers don't overflow viewport
- [ ] Interactive elements reachable with thumb (mobile)

---

## Browser Targets

| Browser | Version | Priority |
|---------|---------|----------|
| **Chrome** | Latest 2 | Critical |
| **Safari** | Latest 2 | Critical |
| **Firefox** | Latest 2 | High |
| **Edge** | Latest | Medium |
| **Mobile Safari** | iOS 15+ | Critical |
| **Chrome Android** | Latest | High |

### Browser-Specific Gotchas

**Safari:**
- `-webkit-backdrop-filter` required for glassmorphism
- `gap` in flexbox may have older quirks
- Test scroll behavior (momentum, rubber-banding)

**Firefox:**
- No `backdrop-filter` support without flag (use fallback)
- Slightly different font rendering
- Verify mask/clip-path animations

**Mobile Safari:**
- 100vh includes address bar (use `100dvh` or JS workaround)
- Test touch gestures (swipe, long-press)
- Check safe-area insets for notch devices

---

## Visual Quality Checklist

### Layout & Spacing
- [ ] Consistent spacing scale (4px increments: 4, 8, 12, 16, 24, 32, 48, 64)
- [ ] Adequate whitespace between sections
- [ ] Alignment feels intentional, not random
- [ ] Grid columns balanced, not lopsided
- [ ] Cards/containers have consistent padding

### Typography
- [ ] Font hierarchy clear (h1 > h2 > h3 > body > caption)
- [ ] Maximum 3 font weights used
- [ ] Line-height comfortable (1.4-1.6 for body)
- [ ] No orphaned words in important headlines
- [ ] Text contrast meets WCAG AA (4.5:1 body, 3:1 large)

### Color & Contrast
- [ ] Primary/secondary/accent colors consistent throughout
- [ ] Hover states have visible color shift
- [ ] Disabled states clearly muted
- [ ] Focus rings visible on all interactive elements
- [ ] Text readable on all backgrounds

### Interactions
- [ ] All buttons have hover state
- [ ] Click/tap feedback visible
- [ ] Loading states don't feel broken
- [ ] Transitions smooth (150-300ms typical)
- [ ] No jarring layout shifts on interaction
- [ ] Animations respect `prefers-reduced-motion`

### Polish Details
- [ ] Icons consistent style and size
- [ ] Borders/shadows consistent across components
- [ ] No clipped text or truncation issues
- [ ] Images have proper aspect ratios
- [ ] No visible z-index conflicts

---

## Accessibility Requirements (WCAG 2.1 AA)

### Perceivable
- [ ] **1.1.1** All images have alt text (or `alt=""` for decorative)
- [ ] **1.3.1** Proper heading hierarchy (no skipped levels)
- [ ] **1.4.1** Color is not only means of conveying info
- [ ] **1.4.3** Contrast ratio 4.5:1 (text), 3:1 (large text/UI)
- [ ] **1.4.4** Text resizable to 200% without loss

### Operable
- [ ] **2.1.1** All functionality keyboard accessible
- [ ] **2.1.2** No keyboard traps (can always Tab out)
- [ ] **2.4.1** Skip link to main content
- [ ] **2.4.3** Focus order logical
- [ ] **2.4.7** Focus visible on all elements
- [ ] **2.5.5** Touch targets at least 44x44px

### Understandable
- [ ] **3.1.1** Page has `lang` attribute
- [ ] **3.2.1** No unexpected context changes on focus
- [ ] **3.3.1** Error messages clear and specific
- [ ] **3.3.2** Labels present for all inputs

### Robust
- [ ] **4.1.1** Valid HTML (no duplicate IDs)
- [ ] **4.1.2** ARIA roles/states correct

### Quick Keyboard Tests
1. Tab through entire page – can you reach everything?
2. Escape closes modals/dropdowns?
3. Arrow keys work in menus/tabs?
4. Enter/Space activates buttons?
5. Focus trap in modals (can't Tab outside)?

---

## Component-Specific QA

### Buttons
- [ ] All variant styles distinct (primary/secondary/ghost/destructive)
- [ ] Loading state shows spinner
- [ ] Disabled state visually muted, not clickable
- [ ] Icon-only buttons have `aria-label`
- [ ] Focus ring visible on keyboard navigation

### Inputs
- [ ] Labels associated via `id`/`for` or wrapper
- [ ] Placeholder not sole label
- [ ] Error states have red border + icon + message
- [ ] Success states visible
- [ ] Autofill styling not broken

### Cards
- [ ] Entire card clickable if it's a link
- [ ] Content doesn't overflow container
- [ ] Images responsive, not stretched
- [ ] Consistent height in grid layouts

### Navigation
- [ ] Current page indicated
- [ ] Dropdown menus have `aria-expanded`
- [ ] Mobile menu has proper focus trap
- [ ] Hamburger has accessible label

### Modals/Dialogs
- [ ] Focus trapped inside when open
- [ ] Escape closes modal
- [ ] Background scroll locked
- [ ] `aria-modal="true"` and `role="dialog"` present
- [ ] Focus returns to trigger on close

### Tooltips/Popovers
- [ ] Appear on hover AND focus
- [ ] Don't overflow viewport (flip/shift)
- [ ] Keyboard dismissable (Escape)
- [ ] Sufficient delay before appearing (300ms+)

### Tabs
- [ ] `role="tablist"`, `role="tab"`, `role="tabpanel"` present
- [ ] Arrow keys navigate between tabs
- [ ] Active tab indicated visually and via `aria-selected`
- [ ] Panel associated via `aria-labelledby`

### Loaders
- [ ] Animation smooth, not janky
- [ ] `aria-live="polite"` or `aria-busy` for screen readers
- [ ] Progress indicators show actual progress when known

---

## Testing Process

### Before Each QA Review

1. **Pull latest changes**: `git pull origin main`
2. **Fresh build**: `npm run build`
3. **Start local server**: `npm run preview` or `npx serve dist`
4. **Open browser DevTools**: Have Network and Console visible

### Testing Flow

```
1. Desktop First (1280px)
   └── Full visual scan
   └── Keyboard navigation test
   └── Console errors check

2. Wide (1920px)
   └── Check layouts don't stretch awkwardly
   └── Cards/grids still look balanced

3. Tablet (768px)
   └── Verify responsive breakpoints trigger
   └── Navigation collapses appropriately
   └── Touch targets sized correctly

4. Mobile (375px)
   └── No horizontal scroll
   └── Text readable without zooming
   └── Buttons/links easily tappable
   └── Verify real device if possible

5. Cross-browser
   └── Safari: Test animations, backdrop-filter
   └── Firefox: Check any visual discrepancies
```

### QA Report Template

```markdown
## QA Report – [Feature/Page Name]
**Date:** YYYY-MM-DD
**Tested By:** QA Agent
**Build:** [commit hash]

### Summary
- ✅ Pass / ⚠️ Issues Found / ❌ Blocked

### Breakpoint Results
| Breakpoint | Status | Notes |
|------------|--------|-------|
| 375px | ✅ | |
| 768px | ⚠️ | Cards too cramped |
| 1280px | ✅ | |
| 1920px | ✅ | |

### Browser Results  
| Browser | Status | Notes |
|---------|--------|-------|
| Chrome | ✅ | |
| Safari | ⚠️ | Backdrop blur weak |
| Firefox | ✅ | |

### Accessibility
- [ ] Keyboard nav: Pass/Fail
- [ ] Contrast: Pass/Fail
- [ ] Focus visible: Pass/Fail

### Issues Found
1. **[P1]** Description... (screenshot/video)
2. **[P2]** Description...

### Screenshots
(attach relevant images)
```

---

## Issue Priority Levels

| Level | Meaning | Examples |
|-------|---------|----------|
| **P0** | Blocker, ship cannot proceed | Page crashes, critical feature broken |
| **P1** | High, must fix before release | Accessibility failure, broken on mobile |
| **P2** | Medium, should fix soon | Visual inconsistency, minor UX issue |
| **P3** | Low, nice to have | Polish detail, edge case |

---

## Tools

### Browser DevTools
- **Responsive mode**: Test all breakpoints
- **Accessibility panel**: Check ARIA tree
- **Performance panel**: Verify animation FPS
- **Console**: Watch for errors/warnings

### Extensions
- **axe DevTools**: Automated accessibility testing
- **WAVE**: Visual accessibility overlay
- **Lighthouse**: Overall quality audit

### Commands
```bash
# Local preview
npm run build && npm run preview

# Lighthouse audit (requires Chrome)
npx lighthouse https://toddclawd-del.github.io/interaction-lab/ --view

# Check for accessibility issues
npx axe https://toddclawd-del.github.io/interaction-lab/
```

---

## Living Document

This QA standards doc evolves. After each major QA cycle:
1. Note any new gotchas discovered
2. Update checklists with missed items
3. Refine testing process based on learnings

**Ping QA Agent for reviews after changes. Ready when you are!** 🎯
