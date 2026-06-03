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
**Last updated:** 2026-06-03 (redesigned)

| Property | Value |
| --- | --- |
| Page background | `style={{ background: 'var(--gradient-hero)' }}` |
| Card background | `style={{ background: 'var(--color-surface)' }}` |
| Card border | `border` + `style={{ borderColor: 'var(--color-border)' }}` |
| Card border radius | `style={{ borderRadius: 'var(--radius-xl)' }}` (16px) |
| Card padding | `p-8` |
| Card shadow | `style={{ boxShadow: '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)' }}` |
| Card max-width | `max-w-[400px]` |
| Heading | `text-[22px] font-semibold leading-tight` + `color: var(--color-text-primary)` |
| Subheading | `text-sm mt-1.5 text-center` + `color: var(--color-text-muted)` |
| Legal / caption text | `text-xs text-center` + `color: var(--color-text-muted)` |
| Button gap | `flex flex-col gap-3` |
| OAuth button — light (Google) | `flex items-center justify-center gap-2.5 w-full py-2.5 px-4 border text-sm font-medium` + `borderRadius: var(--radius-md)`, `background: var(--color-surface)`, `borderColor: var(--color-border)`, `color: var(--color-text-primary)` |
| OAuth button — light hover | JS `onMouseEnter` sets `background: var(--color-surface-secondary)` |
| OAuth button — dark (GitHub) | `flex items-center justify-center gap-2.5 w-full py-2.5 px-4 text-sm font-medium hover:opacity-90` + `borderRadius: var(--radius-md)`, `background: var(--color-overlay-dark)`, `color: var(--color-accent-foreground)` |
| Disabled state | `disabled:opacity-50 disabled:cursor-not-allowed` |
| Error state | `text-sm text-center mt-4` + `color: var(--color-error)` |

**Pattern notes:**
- All border-radius values use inline `style={{ borderRadius: 'var(--radius-*)' }}` — do NOT use `rounded-[--radius-*]` Tailwind arbitrary value syntax. In Tailwind v4, `[--var]` bracket syntax does not wrap in `var()` and produces invalid CSS. Always use inline style or `rounded-(--radius-*)` parenthesis syntax.
- All full-screen auth pages use `var(--gradient-hero)` as page background.
- Card styling uses inline `style` for all token values throughout.
- OAuth button hover is done via JS `onMouseEnter/onMouseLeave` — acceptable for auth page, but prefer CSS hover classes for other components.
- Dark button background uses `var(--color-overlay-dark)` (`#131316`). Navbar CTA uses `bg-overlay` (`#111827`). Standardise on `var(--color-overlay-dark)` for dark buttons going forward.

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

---

### CompletionIndicator (Profile attention banner)
**File:** `components/profile/CompletionIndicator.tsx`
**Last updated:** 2026-06-03

| Property | Value |
| --- | --- |
| Background | `rgba(255, 137, 4, 0.05)` inline style |
| Border | `rgba(255, 137, 4, 0.2)` inline style |
| Border radius | `borderRadius: 'var(--radius-xl)'` inline style |
| Padding | `20px 24px` inline style |
| Section heading | `text-sm font-semibold text-text-primary` |
| Description | `text-sm text-text-secondary` |
| Missing field tag bg | `rgba(255, 137, 4, 0.12)` |
| Missing field tag text | `var(--color-warning)` |
| Ring track | `stroke="var(--color-border)"` strokeWidth 6 |
| Ring fill | `stroke="var(--color-accent)"` strokeWidth 6, strokeLinecap round |
| Ring size | SVG 80×80, r=36, rotated -90deg from top |
| Percentage text | `text-base font-bold text-text-primary` centered via `absolute inset-0 flex items-center justify-center` |

---

### ConnectedAccounts
**File:** `components/profile/ConnectedAccounts.tsx`
**Last updated:** 2026-06-03

| Property | Value |
| --- | --- |
| Card | `bg-surface border border-border`, radius-xl, standard shadow |
| LinkedIn icon container | `w-9 h-9`, `background: var(--color-linkedin)`, `borderRadius: var(--radius-md)` |
| Account name | `text-sm font-medium text-text-primary` |
| Status text | `text-xs text-text-muted` |
| Connect button | `background: var(--color-linkedin)`, `borderRadius: var(--radius-md)`, white text |
| Disconnect button | secondary style — `border-border text-text-secondary` |

---

### ResumeUpload
**File:** `components/profile/ResumeUpload.tsx`
**Last updated:** 2026-06-03

| Property | Value |
| --- | --- |
| Card | `bg-surface border border-border`, radius-xl, standard shadow |
| Drop zone border | `1.5px dashed var(--color-border-muted)`, dragging: `var(--color-accent)` |
| Drop zone bg | `var(--color-surface-secondary)`, dragging: `var(--color-accent-muted)` |
| Drop zone radius | `var(--radius-lg)` |
| Select Resume btn | secondary — `bg-surface border-border text-text-primary` |
| Generate btn | `background: var(--color-accent)` white text |
| Uploading state | drop zone replaced with centered `text-sm font-medium text-text-secondary` — "Uploading..." |
| Uploaded state | drop zone replaced by `ResumePreview` + "Replace resume" link (`text-xs text-text-secondary hover:text-text-primary`) |
| Upload error | `text-sm text-error mt-2` below the drop zone |

**Pattern notes:**
- Once a resume URL exists (from DB on page load or after upload), the drop zone is replaced by `ResumePreview`. The drop zone is never shown alongside a preview.
- "Replace resume" link is a plain text button (`text-xs`) — keeps the UI minimal post-upload.

---

### ResumePreview
**File:** `components/profile/ResumePreview.tsx`
**Last updated:** 2026-06-03

Shown after a resume is uploaded. Filename, upload date, Download link. File icon uses `bg-accent-light` background with `color-accent` stroke SVG.

---

### ProfileForm
**File:** `components/profile/ProfileForm.tsx`
**Last updated:** 2026-06-03

| Property | Value |
| --- | --- |
| Card | `bg-surface border border-border`, radius-xl, standard shadow |
| Card title | `text-base font-semibold text-text-primary` |
| Section heading | `text-sm font-semibold text-text-primary mb-4` |
| Field label | `text-xs font-medium uppercase tracking-wide text-text-secondary mb-1.5` |
| Input / textarea | `bg-surface border border-border px-3 py-2 text-sm text-text-primary`, `borderRadius: var(--radius-md)` |
| Input focus | `focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-colors` |
| Input placeholder | `placeholder:text-text-muted` |
| Select | same as input + `appearance-none` + `ChevronDownIcon` absolutely positioned right-3 |
| Skill tag pill | `bg-accent-light text-accent rounded-full px-2.5 py-1 text-xs font-medium` |
| Industry tag pill | `bg-surface-secondary text-text-secondary rounded-full px-2.5 py-1 text-xs font-medium` |
| Work exp entry card | `border border-border p-4`, `borderRadius: var(--radius-lg)` |
| Section divider | `border-t border-border mb-6` |
| Save Profile button | full-width `py-3 text-sm font-medium text-white`, `background: var(--color-accent)`, `borderRadius: var(--radius-md)` |
| Save button — saving | label becomes "Saving..." + `disabled:opacity-60` |
| Save button — saved | label becomes "Saved!" for 3 seconds, then resets |
| Save error | `text-sm text-error mb-4` above the button |

**Pattern notes:**
- All selects use `appearance-none` + absolutely-positioned `ChevronDownIcon` SVG for consistent cross-browser styling
- Tag inputs add on Enter key or Add button click; X button removes individual tags
- Work experience entries: last entry cannot be removed (remove button hidden when length === 1)
- Disabled Email input: `opacity-50 cursor-not-allowed` + `bg-surface-secondary` via inline style
- Save button state cycle: idle → "Saving..." (disabled) → "Saved!" (3 sec) → idle. On error: idle → "Saving..." → idle + error text shown above button. Use this exact cycle for any primary save action.
