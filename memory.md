# Memory — Feature 02: Auth

Last updated: 2026-06-02

## What was built

- `.env.local` — `NEXT_PUBLIC_INSFORGE_URL=https://zz5cad4a.ap-southeast.insforge.app` + anon key populated
- `lib/insforge-client.ts` — browser singleton using `createClient` from `@insforge/sdk`
- `lib/insforge-server.ts` — server factory: reads `insforge_token` cookie, calls `client.setAccessToken(token)`, returns client with `isServerMode: true`
- `app/(auth)/login/page.tsx` — Google + GitHub OAuth buttons, client component
- `app/(auth)/callback/page.tsx` — OAuth callback handler, client component
- `app/middleware.ts` — protects `/dashboard`, `/profile`, `/find-jobs` — redirects to `/login` if no `insforge_token` cookie
- `context/context/ui-registry.md` — updated with Login Page and Auth Loader patterns

`@insforge/sdk` installed. Middleware is at `app/middleware.ts` (Next.js 15+ location — NOT root `middleware.ts`).

---

## Decisions made

**`@insforge/ssr` does not exist** — architecture.md's `createBrowserClient` / `createServerClient` pattern is aspirational. The real package is `@insforge/sdk` with `createClient`. The server client uses `isServerMode: true` config option instead.

**Token cookie strategy** — after OAuth callback the access token is stored in a browser-set `insforge_token` cookie (`SameSite=Lax`, 7-day max-age). Middleware reads this cookie. Server-side code reads it via `cookies()` and sets it on the server client with `client.setAccessToken()`.

**Public SDK internals** — `client.setAccessToken(token)` is the correct public API for setting a token server-side. `client.getHttpClient().userToken` holds the current token at runtime (own property, accessible but not TypeScript-typed). `getCurrentUser()` internally awaits `auth.authCallbackHandled` — use it to wait for the SDK's auto OAuth exchange to complete.

**Context files are at `context/context/`** — double-nested path, not `context/`. Always use full path.

---

## Problems solved

**`tokenManager` is private** — TypeScript blocks `client.tokenManager.setAccessToken()`. Use public `client.setAccessToken(token)` instead.

**SDK auto-detects OAuth callback** — the `Auth` constructor calls `detectAuthCallback()` immediately on client creation. It reads and removes `insforge_code` from the URL and starts `exchangeOAuthCode` before any React code runs. Callback pages must work WITH this auto-detection, not alongside it.

**`@insforge/ssr` 404** — tried installing, confirmed it does not exist. Do not attempt again.

---

## Current state

**Feature 02 is implemented but has critical unfixed bugs. The auth flow does NOT work end-to-end.**

**Critical bug 1 — Callback race condition (all logins will fail)**

The `insforge` singleton calls `auth.detectAuthCallback()` at module import time — before React mounts, before `useEffect` fires. It reads `insforge_code` from the URL and removes it via `history.replaceState`. By the time the callback page's `useEffect` runs, the code is gone. `code` is `null`, the page redirects back to `/login`.

**Fix:** Replace `exchangeOAuthCode` in the callback page with `getCurrentUser()` (which awaits `authCallbackHandled`) then read the token via `insforge.getHttpClient().userToken` (cast to `Record<string, unknown>` to bypass TypeScript).

**Critical bug 2 — Expired tokens bypass middleware**

The `insforge_token` cookie has a 7-day max-age but the JWT inside is short-lived. Middleware only checks cookie presence. After token expiry, users still pass middleware but all server-side calls fail with 401.

**Fix:** Decode the JWT `exp` claim in middleware (no verification needed — just parse the payload) and redirect to `/login` if expired.

**Important bug 3 — Login loading state never resets on error**

If `signInWithOAuth` throws, `setLoading` stays set and buttons are permanently disabled. Needs `try/finally` wrapping.

---

## Next session starts with

Fix the three bugs above before moving to Feature 03. In order:

1. **Fix callback page** — replace `exchangeOAuthCode` call with `getCurrentUser()` + `(insforge.getHttpClient() as Record<string, unknown>).userToken as string` pattern
2. **Fix middleware** — parse JWT `exp` from `insforge_token` cookie, redirect if expired or invalid
3. **Fix login page** — wrap `signInWithOAuth` in `try/finally`, reset `loading` to `null` and show inline error on failure

After all three confirmed, move to **Feature 03 — PostHog Initialization** (build-plan.md step 03).

---

## Open questions

- What is the actual expiry duration of InsForge access tokens? Determines how aggressive middleware expiry check needs to be.
- `allowedRedirectUrls` in InsForge dashboard is currently empty. Must add `http://localhost:3000/callback` (dev) and the production URL before OAuth will work at all.
- Should `insforge_token` be `HttpOnly`? Currently set via `document.cookie` (XSS-readable). Making it HttpOnly requires a Next.js API route to set the cookie server-side after the callback. Decide before production.
