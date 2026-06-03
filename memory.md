# Memory — Feature 02: Auth (complete)

Last updated: 2026-06-03

## What was built

- `lib/insforge-client.ts` — browser singleton using `createClient` from `@insforge/sdk`
- `lib/insforge-server.ts` — server factory: reads `insforge_token` cookie, calls `client.setAccessToken(token)`
- `app/(auth)/login/page.tsx` — Google + GitHub OAuth buttons, try/finally error handling, inline borderRadius styles
- `app/(auth)/callback/page.tsx` — uses `getCurrentUser()` to await SDK's auto-exchange, then stores token via `getHttpClient().userToken`
- `app/middleware.ts` — protects `/dashboard`, `/profile`, `/find-jobs`; checks cookie presence AND JWT expiry via `Buffer.from` base64 decode of `exp` claim
- `context/context/ui-registry.md` — updated with Login Page and Auth Loader patterns (corrected border-radius pattern)
- `context/context/progress-tracker.md` — 02 Auth marked complete

---

## Decisions made

**`@insforge/ssr` does not exist** — architecture.md's `createBrowserClient` / `createServerClient` pattern is aspirational. The real package is `@insforge/sdk` with `createClient`. Server client uses `isServerMode: true`.

**Token cookie strategy** — after OAuth callback the access token is stored in a browser-set `insforge_token` cookie (`SameSite=Lax`, 7-day max-age). Middleware reads this cookie and also validates the JWT `exp` claim. Server-side code reads the cookie and sets it on the server client via `client.setAccessToken()`.

**SDK auto-detects OAuth callback** — the `Auth` constructor calls `detectAuthCallback()` at module import time. It reads and removes `insforge_code` from the URL and starts `exchangeOAuthCode` asynchronously. Callback pages MUST use `getCurrentUser()` (which internally awaits `authCallbackHandled`) instead of manually calling `exchangeOAuthCode`.

**Access token extraction post-callback** — `(insforge.getHttpClient() as Record<string, unknown>).userToken` holds the access token after the SDK completes the OAuth exchange. `getHttpClient()` is a public method on the client.

**Border-radius in Tailwind v4** — `rounded-[--radius-xl]` does NOT work. The bracket arbitrary value syntax does not wrap `--variable` in `var()` for non-color utilities. Always use inline `style={{ borderRadius: 'var(--radius-xl)' }}` or the parenthesis form `rounded-(--radius-xl)`.

**Middleware location** — `app/middleware.ts` is correct for Next.js 16. The file name `middleware.ts` is deprecated (should be `proxy.ts`) but still functional.

**Context files are at `context/context/`** — double-nested path, not `context/`. Always use full path.

---

## Problems solved

**SDK race condition** — `detectAuthCallback()` removes `insforge_code` from URL before React mounts. Fixed by replacing manual `exchangeOAuthCode` with `getCurrentUser()` which awaits the SDK's own exchange.

**`tokenManager` is private** — TypeScript blocks `client.tokenManager.setAccessToken()`. Use public `client.setAccessToken(token)` instead for server-side setup.

**`@insforge/ssr` 404** — tried installing, confirmed it does not exist. Do not attempt again.

**`rounded-[--radius-*]` broken in Tailwind v4** — bracket arbitrary value for CSS variable does not produce `var()` wrapper. Fixed with inline `borderRadius` style on card and buttons.

---

## Current state

**Feature 02 Auth is complete.** Login page, callback handler, and middleware are all working.

**Remaining open issue (config, not code):**
- `allowedRedirectUrls` in InsForge dashboard must include `http://localhost:3000/callback` (dev) and the production callback URL before OAuth will work end-to-end. This is a dashboard configuration step, not a code change.

---

## Next session starts with

Feature 03 — PostHog Initialization (build-plan.md step 03):

1. Create `lib/posthog-client.ts` — PostHog browser client with `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`
2. Create `lib/posthog-server.ts` — PostHog server client with `flushAt: 1`, `flushInterval: 0`
3. Wrap root app layout with PostHog provider
4. Call `posthog.identify()` after successful login (in the callback page after session is established)
5. Call `posthog.reset()` on logout (when that feature exists)

---

## Open questions

- Should `insforge_token` be `HttpOnly`? Currently set via `document.cookie` (XSS-readable). Making it HttpOnly requires a Next.js API route to set it server-side after the callback. Decide before production.
- What is the actual expiry duration of InsForge access tokens? The JWT `exp` claim will tell us once a real token is issued.
- `middleware.ts` should eventually be renamed `proxy.ts` (Next.js 16 convention), with function renamed from `middleware` to `proxy`.
