# Linear.app Homepage - Technical Assessment

> Analysis performed to inform the Gymsense landing page redesign

## Overview

Linear's homepage is a **Next.js** application with a **dark theme** by default (`data-theme="dark"`), using:
- **styled-components** (v6.1.18) for CSS-in-JS
- **CSS Modules** with hashed class names (e.g., `Header-module__PXV_2W__header`)
- **CSS Custom Properties** (design tokens) for typography, colors, and spacing
- **Server-side rendering** with client-side hydration

---

## Key Sections Identified

### 1. Header/Navigation
- **Sticky header** with transparent background
- **Left**: Linear logo (SVG with full wordmark)
- **Center**: Nav items with dropdown triggers (`Product`, `Resources`) + direct links (`Pricing`, `Customers`, `Now`, `Contact`)
- **Right**: `Log in` text link + `Sign up` pill button (inverted style)
- **Mobile**: Hamburger menu
- **Responsive hiding**: Uses `.hide-mobile`, `.hide-tablet`, `.hide-laptop` utility classes

### 2. Hero Section
- **Text animation**: Each word wrapped in `<span>` with inline blur+translateY animation (staggered reveal)
- **Desktop headline**: "Linear is a purpose-built tool for planning and building products"
- **Mobile headline**: Shorter version - "Plan and build your product"
- **Subtitle**: Different text for mobile vs desktop
- **CTAs**: 
  - Primary: "Start building" (inverted button)
  - Secondary: "New: Linear agent for Slack" (ghost button with arrow)
- **Spacers**: Uses Spacer components with `--height` CSS variable

### 3. Hero Illustration
- **Complex 3D app mockup** with perspective transforms
- Multiple nested elements with 3D and animateIn classes
- Shows a simulated Linear UI with:
  - Traffic lights (window controls)
  - Sidebar with navigation
  - Issue lists with avatars
  - Inbox notifications

### 4. Customer Logos
- **Headline**: "Powering the world's best product teams. From next-gen startups to established enterprises."
- **Logo grid**: 8 SVG logos (OpenAI, CashApp, Scale, Ramp, Vercel, Coinbase, Boom, Cursor)
- **Mobile**: Marquee/carousel animation
- **Link**: "Meet our customers" with chevron icon

### 5. "Made for Modern Product Teams" Section
- **12-column grid** with responsive areas
- **Carousel** of cards with images
- Each card is a button that opens a dialog
- Cards: "Purpose-built for product development", "Designed to move fast", etc.

### 6. Feature Sections
Each follows a similar pattern:
- **Grid layout** with 12-column system
- **Section title** (h2) + description
- **Feature cards** with images
- **Subsections** with h3 titles

Identified sections:
- **Tracking** (`sectionTracking`)
- **Planning** (`sectionPlanning`)
- **Workflows** (`sectionWorkflows`)
- **Under the Hood** (`sectionUnderTheHood`)

### 7. Pre-footer CTA
- **Headline**: "Plan the present. Build the future."
- **Buttons**: "Contact sales" (secondary) + "Get started" (inverted)
- Uses grid layout with responsive areas

### 8. Footer
- **Logo** (icon only, not wordmark)
- **Link columns**: Features, Product, Company, Resources, Connect
- **Social links**: X/Twitter, GitHub, YouTube, LinkedIn

---

## Technical Patterns

### 1. Typography System
Linear uses CSS custom properties for consistent typography:
```css
--title-8-size, --title-6-size, --title-5-size  /* For responsive headlines */
--text-large-size, --text-regular-size, --text-small-size
--font-weight-medium
--color-text-primary, --color-text-tertiary, --color-text-quaternary
```

### 2. Responsive Utility Classes
```html
<span class="hide-mobile">Desktop only content</span>
<span class="show-mobile">Mobile only content</span>
<span class="hide-tablet">...</span>
```

### 3. Spacer Components
```html
<div class="Spacer-module__root" style="--height: 80px"></div>
```

### 4. Grid System
Uses CSS Grid with named areas that change per breakpoint:
```html
<div style="
  --grid-areas-default: 'a a a a a a b b b b b b';
  --grid-areas-laptop: 'a a a a a a a a a a a a' 'b b b b b b b b . . . .';
  --grid-areas-tablet: 'a a a a a a a a' 'b b b b b b b b';
  --grid-areas-mobile: 'a a a a' 'b b b b';
">
```

### 5. Text Animation (Hero)
Each word is wrapped and animated individually:
```html
<span style="display: inline-block; opacity: 0; filter: blur(10px); transform: translateY(20%);">
  Linear
</span>
```

**Framer Motion equivalent:**
```tsx
{words.map((word, i) => (
  <motion.span
    key={i}
    initial={{ opacity: 0, filter: 'blur(10px)', y: '20%' }}
    animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
    transition={{ delay: i * 0.08, duration: 0.5 }}
  >
    {word}{' '}
  </motion.span>
))}
```

### 6. Button Variants
```html
<!-- Inverted (primary) -->
<a class="Button-module__variant-invert Button-module__size-default">Sign up</a>

<!-- Ghost (secondary text) -->
<a class="Button-module__variant-ghost">Learn more</a>

<!-- Border (outline) -->
<button class="Button-module__variant-border Button-module__shape-circle">+</button>
```

### 7. Dark Theme Colors
From `<meta name="theme-color" content="#08090a">`:
- Background: Very dark gray (`#08090a`)
- Text primary: White
- Text tertiary: Muted gray
- Text quaternary: Even more muted

### 8. Font
Uses **Inter Variable** font.

---

## Replication Difficulty Assessment

| Element | Difficulty | Notes |
|---------|------------|-------|
| Header | Easy | Standard sticky nav pattern |
| Text animations | Easy | Framer Motion handles this well |
| Grid layouts | Easy | CSS Grid / Tailwind |
| Button styles | Easy | Component variants |
| Customer logos | Easy | SVG strip |
| Feature cards | Medium | Layout + images |
| Hero 3D mockup | Hard | Custom artwork/3D CSS - need app screenshots |
| Dropdown menus | Medium | Radix UI or similar |
| Marquee animation | Medium | CSS animation or library |

---

## Gymsense Implementation Plan

### Phase 1: Foundation
- [x] Use existing dark theme from Pro app
- [x] Use existing font from apps
- [x] Reuse button components where possible
- [ ] Create responsive utilities

### Phase 2: Header
- [ ] Sticky transparent header
- [ ] Logo wordmark
- [ ] Nav items with hover states
- [ ] Mobile hamburger with slide-out drawer

### Phase 3: Hero
- [ ] Word-by-word animation using Framer Motion
- [ ] Responsive text (shorter headline on mobile)
- [ ] CTA buttons
- [ ] Hero illustration (app screenshots/mockup)

### Phase 4: Content Sections
- [ ] Customer/user logos or testimonials
- [ ] Feature sections with alternating layouts
- [ ] Cards with images

### Phase 5: Footer
- [ ] Link columns
- [ ] Social links
- [ ] Pre-footer CTA

