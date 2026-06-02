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

---

### Login Page
**File:** `app/(auth)/login/page.tsx`
**Last updated:** 2026-06-02

| Property | Value |
| --- | --- |
| Page background | `style={{ background: 'var(--gradient-hero)' }}` |
| Card background | `style={{ background: 'var(--color-surface)' }}` |
| Card border | `border` + `style={{ borderColor: 'var(--color-border)' }}` |
| Card border radius | `rounded-[--radius-xl]` (16px) |
| Card padding | `p-8` |
| Card shadow | `style={{ boxShadow: '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)' }}` |
| Card max-width | `max-w-[400px]` |
| Heading | `text-[22px] font-semibold leading-tight` + `color: var(--color-text-primary)` |
| Subheading | `text-sm mt-1.5 text-center` + `color: var(--color-text-muted)` |
| Legal / caption text | `text-xs text-center` + `color: var(--color-text-muted)` |
| Button gap | `flex flex-col gap-3` |
| OAuth button — light (Google) | `flex items-center justify-center gap-2.5 w-full py-2.5 px-4 rounded-[--radius-md] border text-sm font-medium` + `background: var(--color-surface)`, `borderColor: var(--color-border)`, `color: var(--color-text-primary)` |
| OAuth button — light hover | JS `onMouseEnter` sets `background: var(--color-surface-secondary)` |
| OAuth button — dark (GitHub) | `flex items-center justify-center gap-2.5 w-full py-2.5 px-4 rounded-[--radius-md] text-sm font-medium hover:opacity-90` + `background: var(--color-overlay-dark)`, `color: #ffffff` |
| Disabled state | `disabled:opacity-50 disabled:cursor-not-allowed` |

**Pattern notes:**
- Page background reuses `var(--gradient-hero)` — same as Hero section. All full-screen auth pages should use this background.
- Card styling uses inline `style` for all color tokens. This is because Tailwind v4 arbitrary-value syntax (`bg-[--color-surface]`) was not used. Future components should prefer `bg-[--color-surface]` class form to avoid mixing patterns.
- The dark OAuth button uses hardcoded `#ffffff`. Should be `var(--color-accent-foreground)` — flag for fix.
- OAuth button hover is done via JS `onMouseEnter/onMouseLeave` instead of CSS. Future auth buttons should use a Tailwind hover class instead.
- `rounded-[--radius-md]` on buttons matches `rounded-lg` used by Navbar CTA — they are the same 8px value.
- Dark button background uses `var(--color-overlay-dark)` (`#131316`). Navbar CTA uses `bg-overlay` (`#111827`). These are visually near-identical but technically different tokens — standardise on `var(--color-overlay-dark)` for dark buttons going forward.

---

### Auth Full-Screen Loader (Callback)
**File:** `app/(auth)/callback/page.tsx`
**Last updated:** 2026-06-02

| Property | Value |
| --- | --- |
| Page background | `style={{ background: 'var(--gradient-hero)' }}` |
| Content layout | `flex flex-col items-center gap-3` |
| Loading text | `text-sm font-medium` + `color: var(--color-text-muted)` |
| Spinner track | `stroke="var(--color-border)"` |
| Spinner fill | `stroke="var(--color-accent)"` |
| Spinner size | `28px` |

**Pattern notes:**
- Full-screen loading states use the same `var(--gradient-hero)` background as the login page. Keeps the auth flow visually unified.
- Spinner uses two strokes: muted border color for the track, accent purple for the moving arc. Use this exact pattern for any auth-flow loading state.
