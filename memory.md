# Memory — Feature 06: Profile Save Logic (complete)

Last updated: 2026-06-03

## What was built

**Feature 06 — Profile Save Logic (complete):**
- `lib/profile-completion.ts` — pure function `calculateCompletion(profile)` → `{ percentage, missingFields, isComplete }`. 8 required fields: FULL NAME, PHONE, LOCATION, JOB TITLE, SKILLS, EXPERIENCE, EDUCATION, JOB TITLES.
- `actions/profile.ts` — `saveProfile(data)` Server Action. Upsert via check-then-insert/update. Fires `profile_completed` PostHog event when `is_complete` transitions false → true. Calls `revalidatePath('/profile')`.
- `app/api/resume/upload/route.ts` — POST route. Validates PDF + 3MB limit. Uploads via `insforge.storage.from('resumes').uploadAuto(file)`. Updates `resume_pdf_url` in profiles. Calls `revalidatePath('/profile')`.
- `app/profile/page.tsx` — now async Server Component. Fetches user via `getCurrentUser()`, redirects to `/login` if unauthenticated. Fetches profile row from DB. Calculates completion and passes real data to all children. `CompletionIndicator` hidden when `percentage === 100`.
- `components/profile/ProfileForm.tsx` — accepts `initialData` (raw DB profile row) and `userEmail` props. Pre-fills all form state from DB data on load. Save button wired to `saveProfile` with Saving.../Saved!/error state cycle.
- `components/profile/ResumeUpload.tsx` — real upload via `POST /api/resume/upload`. Shows `ResumePreview` when `resumeUrl` exists (from DB or after fresh upload). Drop zone replaced by preview post-upload. "Replace resume" plain text link.

**Context files updated:**
- `context/context/progress-tracker.md` — Feature 06 checked, decisions and notes updated
- `context/context/ui-registry.md` — ResumeUpload and ProfileForm entries updated with new UI states (uploading, uploaded, save cycle)

---

## Decisions made

**Resume upload is server-side** — `POST /api/resume/upload` uses `createInsforgeServer()`. Browser client auth for storage is unreliable with the custom `insforge_token` cookie setup. Never attempt storage uploads from the browser client directly.

**No `resume_pdf_key` column** — using `uploadAuto()` and just saving the URL. Old files accumulate on re-upload. Acceptable for MVP. To fix later: add `resume_pdf_key` column, fetch key before new upload, call `insforge.storage.from('resumes').remove(key)`.

**Profile upsert pattern** — `.maybeSingle()` to check existence, then `.update()` or `.insert([...])`. No SDK upsert available. Always use this check-then-write pattern for profiles.

**Completion calculation is shared** — `lib/profile-completion.ts` is used both in `actions/profile.ts` (to set `is_complete`) and in `app/profile/page.tsx` (to render `CompletionIndicator`). Never inline this logic elsewhere.

**Save button state cycle** — idle → "Saving..." (disabled, `opacity-60`) → "Saved!" (3 sec timeout) → idle. On error: idle → error text shown above button. This is the canonical pattern for all primary save actions in the app (documented in ui-registry.md).

**`job_titles_seeking` and `preferred_locations`** — stored as `text[]` in DB. Form displays as comma-separated string. Split on save (`.split(',').map(t => t.trim()).filter(Boolean)`), join on load (`.join(', ')`).

**`education` is JSONB** — stored as `{ degree, fieldOfStudy, institution, graduationYear }`. Cast from `unknown` on read via local `Education` type. Never flatten into separate columns.

**`work_experience` is JSONB array** — saved as the raw `WorkExperience[]` from form state. Read back and cast to `WorkExperience[]`. Shape must stay consistent with the form type.

All decisions from prior sessions remain in effect (see previous memory entries):
- Tailwind v4 arbitrary values unreliable — use inline `style={}` for all sizing/radius/token values
- `@insforge/ssr` does not exist — use `@insforge/sdk` only
- Context files at `context/context/` (double-nested)
- No lucide-react, no shadcn/ui — inline SVGs only
- `app/middleware.ts` inside `app/` — correct for this Next.js version

---

## Problems solved

No new bugs encountered this session. All code was written correctly first pass.

---

## Current state

**Feature 01 Homepage** — complete
**Feature 02 Auth** — complete. Known deferred: `insforge_token` cookie lacks `Secure`/`HttpOnly` flags.
**Feature 03 PostHog** — complete. Minor open: `ui_host` hardcoded; `posthog.reset()` not called on logout.
**Feature 04 Database Schema** — complete. All 4 tables + resumes bucket exist.
**Feature 05 Profile Page Full UI** — complete.
**Feature 06 Profile Save Logic** — complete. All save/upload flows wired. Real data throughout.

**Config still needed for OAuth to work end-to-end:**
- `allowedRedirectUrls` in InsForge dashboard must include `http://localhost:3000/callback`

---

## Next session starts with

**Feature 07 — AI Profile Extraction from Resume:**
1. Run `/architect feature 07` FIRST before writing any code
2. Call `mcp__insforge__fetch-docs` with `"ai-integration-sdk"` to get current OpenRouter/AI patterns
3. When resume is uploaded, extract profile fields from PDF text using AI
4. Pre-fill `ProfileForm` fields from extracted data (full_name, phone, location, skills, work_experience, education, etc.)
5. User reviews and saves — do not auto-save extracted data

---

## Open questions

- Should `insforge_token` cookie be `HttpOnly`? Currently XSS-readable. Requires API route to set server-side. Deferred to production hardening.
- `middleware.ts` should eventually be renamed `proxy.ts` with `export function proxy` (Next.js 16 convention). Currently `app/middleware.ts`.
- Resume re-upload: old files accumulate in storage. Add `resume_pdf_key` column when this becomes a concern.
