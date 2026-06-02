# Memory — Homepage Build (Feature 01)

Last updated: 2026-06-02

## What was built

**Feature 01 — Homepage** fully complete and visually verified.

Files created:
- `components/layout/Navbar.tsx` — sticky white navbar, logo, 3 nav links, dark "Start for free" CTA
- `components/layout/Footer.tsx` — dark overlay footer, white logo via CSS filter, Privacy Policy + Terms links
- `components/homepage/Hero.tsx` — gradient hero, headline, sub, dual CTAs, dashboard screenshot
- `components/homepage/HowItWorks.tsx` — two alternating 2-col feature sections with public images
- `components/homepage/Features.tsx` — testimonial + bottom CTA (same gradient as hero)
- `app/page.tsx` — composes Navbar + Hero + HowItWorks + Features + Footer

Files modified:
- `app/globals.css` — added `--gradient-hero` CSS variable at the bottom of `@theme` block
- `context/context/progress-tracker.md` — 01 Homepage marked complete
- `context/context/ui-registry.md` — all 5 new components documented with exact classes

## Decisions made

- **Context files are at `context/context/`** (double-nested) — not `context/` as the architecture.md diagram implies. Always use the full path.
- **Gradient via CSS variable** — `--gradient-hero` defined in `globals.css` @theme, referenced in components as `style={{ background: "var(--gradient-hero)" }}`. This is the correct pattern for gradients — not inline hex, not Tailwind arbitrary values.
- **Footer logo white** — uses `style={{ filter: "brightness(0) invert(1)" }}` to render the purple logo.png as white on dark background. Only one logo asset exists.
- **All CTAs link to `/login`** — auth not built yet (Feature 02 is next). "Get Started", "Start for free", "Find Your First Match" all point to `/login`.
- **All components are Server Components** — no `"use client"` needed anywhere on the homepage.
- **Tailwind radius classes** — used Tailwind default scale (`rounded-lg` = 8px, `rounded-2xl` = 16px, `rounded-full`) because the custom `@theme` radius tokens may not correctly override built-in utility names in Tailwind v4.

## Problems solved

- **Context files nested** — the path `context/context/` not `context/` — caught when first Read attempt failed.
- **playwright for visual verification** — installed temporarily as devDependency, then uninstalled after screenshots. Build + browser verified clean.
- **public/public directory** — exists but is empty. Ignore it.

## Current state

- Homepage is fully built and visually matches the design (`context/context/designs/landing-page.png`).
- All links go to `/login` (which doesn't exist yet — will 404 until Feature 02).
- Dev server confirmed working at port 3000.
- Build (`next build`) compiles cleanly with no TypeScript errors.
- 0 other packages installed yet — only Next.js 16, React 19, Tailwind v4 in the project.

## Next session starts with

**Feature 02 — Auth** (InsForge Google + GitHub OAuth).

Per build-plan.md:
- Login page UI at `app/(auth)/login/page.tsx` — Google OAuth button, GitHub OAuth button
- OAuth callback handler at `app/(auth)/callback/page.tsx`
- Middleware at `middleware.ts` protecting `/dashboard`, `/profile`, `/find-jobs`, `/find-jobs/[id]`
- On login: check `profiles.is_complete` → redirect to `/profile` if false, `/dashboard` if true

Before writing any auth code: check AGENTS.md for an InsForge skill, then check `context/context/library-docs.md` InsForge section. Install `@insforge/ssr` package first.

Also check the Next.js 16 docs in `node_modules/next/dist/docs/` for middleware API before writing `middleware.ts` — it may differ from standard knowledge.

## Open questions

- What InsForge project URL and anon key will go in `.env.local`? The `.env.local` file exists but is empty. User needs to provide these before auth can be wired up.
- Design file for the login page is at `context/context/designs/` — there is no login page design file listed. Check if one exists before building login UI.
