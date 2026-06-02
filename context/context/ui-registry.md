# UI Registry

Living document. Updated after every component is built. Read this before building any new component — match existing patterns exactly before inventing new ones.

---

## How to Use

Before building any component:

1. Check if a similar component already exists here
2. If yes — match its exact classes
3. If no — build it following ui-rules.md and ui-tokens.md, then add it here

After building any component — update this file with the component name, file path, and exact classes used.

---

## Components

### Navbar
**File:** `components/layout/Navbar.tsx`
**Classes:** `sticky top-0 z-50 h-16 bg-surface border-b border-border` (header), `max-w-[1440px] mx-auto h-full px-6 flex items-center justify-between` (inner), `text-sm font-medium text-text-dark hover:text-accent transition-colors` (nav link), `px-4 py-2 rounded-lg bg-overlay text-white text-sm font-medium hover:opacity-90 transition-opacity` (CTA button)

### Footer
**File:** `components/layout/Footer.tsx`
**Classes:** `bg-overlay py-7 px-6` (footer), `text-sm text-text-muted hover:text-white transition-colors` (nav link), logo uses `style={{ filter: "brightness(0) invert(1)" }}` for white on dark bg

### Hero
**File:** `components/homepage/Hero.tsx`
**Classes:** `py-24 px-8` + `style={{ background: "var(--gradient-hero)" }}` (section), `text-5xl font-bold text-text-primary leading-tight` (h1), `text-lg text-text-secondary` (sub), `inline-flex items-center gap-1 px-6 py-3 rounded-lg bg-overlay text-white text-sm font-medium` (primary CTA), `inline-flex items-center px-6 py-3 rounded-lg bg-surface border border-border text-text-primary text-sm font-medium` (secondary CTA), `rounded-2xl overflow-hidden shadow-2xl border border-border-light` (image container)

### HowItWorks
**File:** `components/homepage/HowItWorks.tsx`
**Classes:** `py-24 px-8 bg-surface` / `py-24 px-8 bg-background` (alternating sections), `max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center` (layout), `text-3xl font-semibold text-text-primary leading-snug` (h2), `flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-accent` (feature dot), `text-sm font-semibold text-text-primary` (feature title), `text-sm text-text-secondary leading-relaxed` (feature desc), `rounded-2xl border border-border overflow-hidden shadow-sm` (image card)

### Features (Testimonial + Bottom CTA)
**File:** `components/homepage/Features.tsx`
**Classes:** `text-xs font-semibold text-accent uppercase tracking-widest` (label), `text-2xl font-medium text-text-primary leading-relaxed` (blockquote), `text-4xl font-bold text-text-primary leading-tight` (CTA heading), gradient section reuses `var(--gradient-hero)`
