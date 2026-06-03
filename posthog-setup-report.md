# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into JobPilot. The following changes were made:

- **`instrumentation-client.ts`**: Initializes PostHog using the `posthog-js` library at the Next.js instrumentation layer (Next.js 15.3+ recommended approach). Configured with a reverse proxy via `/ingest`, error tracking (`capture_exceptions: true`), and EU region host.
- **`next.config.ts`**: Rewrites for the PostHog reverse proxy (`/ingest/*` → EU PostHog endpoints), preventing ad-blockers from interfering with event delivery.
- **`app/(auth)/login/page.tsx`**: `sign_in_initiated` and `sign_in_error` capture on the OAuth sign-in handler; `posthog.captureException()` for unhandled exceptions.
- **`app/(auth)/callback/page.tsx`**: `posthog.identify()` with the user's ID and email after successful OAuth, and `user_signed_in` event capture with the provider used.
- **`components/homepage/Hero.tsx`**: `cta_clicked` events on both CTA buttons with `cta_label` and `cta_section` properties.
- **`components/homepage/Features.tsx`**: `cta_clicked` events on both footer CTA buttons.
- **`components/layout/Navbar.tsx`**: Converted to a client component; `navbar_cta_clicked` event added to the "Start for free" navigation CTA.
- **`.env.local`**: `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables set.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `sign_in_initiated` | User clicked a sign-in provider button. Properties: `provider` | `app/(auth)/login/page.tsx` |
| `sign_in_error` | OAuth sign-in attempt returned an error. Properties: `provider`, `error` | `app/(auth)/login/page.tsx` |
| `user_signed_in` | User successfully completed OAuth sign-in. Properties: `provider`. Also calls `posthog.identify()` | `app/(auth)/callback/page.tsx` |
| `cta_clicked` | User clicked a hero or features-footer CTA. Properties: `cta_label`, `cta_section` | `components/homepage/Hero.tsx`, `components/homepage/Features.tsx` |
| `navbar_cta_clicked` | User clicked the "Start for free" button in the navbar. Properties: `cta_label` | `components/layout/Navbar.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://eu.posthog.com/project/192787/dashboard/721564)
- [Sign-in conversion funnel](https://eu.posthog.com/project/192787/insights/suYh9TTH)
- [Total sign-ins (last 30 days)](https://eu.posthog.com/project/192787/insights/E7c0T2Bs)
- [Homepage CTA clicks over time](https://eu.posthog.com/project/192787/insights/DpbFBosn)
- [Sign-in attempts by provider](https://eu.posthog.com/project/192787/insights/Ip0ebn2g)
- [CTA clicks by entry point](https://eu.posthog.com/project/192787/insights/UqLEjbQ9)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
