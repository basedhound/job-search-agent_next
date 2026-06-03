# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** Phase 2 — Profile Page
**Last completed:** 06 Profile Save Logic
**Next:** 07 AI Profile Extraction from Resume

---

## Progress

### Phase 1 — Foundation

- [x] 01 Homepage
- [x] 02 Auth
- [x] 03 PostHog Initialization
- [x] 04 Database Schema

### Phase 2 — Profile Page

- [x] 05 Profile Page — Full UI
- [x] 06 Profile Save Logic
- [ ] 07 AI Profile Extraction from Resume
- [ ] 08 Resume PDF Generation from Profile
- [ ] 09 LinkedIn Connection via Browserbase Context
- [ ] 10 Smart Redirect + Profile Completion Check

### Phase 3 — Find Jobs Page

- [ ] 11 Find Jobs Page — Full UI
- [ ] 12 LinkedIn Browsing + Dual Extraction
- [ ] 13 LinkedIn Detail Page Enrichment + Description Cleaning
- [ ] 14 URL Input — Fetch + Extract + Score + Save
- [ ] 15 Filter + Sort + Pagination

### Phase 4 — Job Details Page

- [ ] 16 Job Details Page — Full UI
- [ ] 17 Cover Letter Generation
- [ ] 18 Resume Tailoring — GPT-4o Rewrite
- [ ] 19 Tailored Resume PDF Generation + Storage
- [ ] 20 Score Recalculation + Comparison Display
- [ ] 21 Previous + Next Job Navigation

### Phase 5 — Dashboard

- [ ] 22 Dashboard Page — Full UI
- [ ] 23 Stats Bar — Real Data
- [ ] 24 Recent Activity — Real Data
- [ ] 25 Analytics Charts — PostHog Data

---

## Decisions Made During Build

- **Navbar active state** — `usePathname()` used to highlight current nav link in accent color. Checks `pathname === href || pathname.startsWith(href + '/')` to handle nested routes (e.g. `/find-jobs/[id]`).
- **Profile page max-width** — `860px` for the content column. Narrower than the site-wide 1440px to keep the form readable as a single column without stretching inputs across a wide viewport.
- **CompletionIndicator is not a card** — the attention banner uses a warning-tinted background (`rgba(255,137,4,0.05)`) rather than white. All standard content cards remain white. This is the only non-white container in the page.
- **Select arrow** — native `<select>` with `appearance-none` + absolute-positioned `ChevronDownIcon` SVG. Consistent across all dropdowns in the form.
- **Tag input pattern** — skills and industries use an embedded `<input>` inside the tag container. Tags add on Enter or Add button. This pattern should be reused anywhere tag-style input is needed.
- **Work experience entry count** — Remove button is hidden when only one entry exists. The form always shows at least one work experience entry.
- **Profile upsert pattern** — no SDK upsert available. Check `maybeSingle()` first, then update or insert based on result. RLS policies scope both operations to `auth.uid() = id`.
- **Resume upload via API route** — resume file is uploaded via `POST /api/resume/upload` (server-side, uses `createInsforgeServer()`). Browser client auth for storage is unreliable; server route guarantees auth via `insforge_token` cookie.
- **Storage: uploadAuto()** — uses auto-generated key to avoid naming conflicts. Old resume files are not deleted on re-upload (acceptable for MVP; add `resume_pdf_key` column for cleanup in a later feature).
- **Completion calculation** — 8 required fields: FULL NAME, PHONE, LOCATION, JOB TITLE, SKILLS, EXPERIENCE, EDUCATION, JOB TITLES. Calculated in `lib/profile-completion.ts`. `CompletionIndicator` hidden when profile is 100% complete.
- **profile_completed PostHog event** — fired in `actions/profile.ts` when `is_complete` transitions from false → true for the first time. Uses `getPostHogClient()` from `lib/posthog-server.ts`.
- **job_titles_seeking / preferred_locations** — stored as `text[]` in DB, displayed as comma-separated string in the form. Split on save, join on load.
- **education stored as JSONB** — `{ degree, fieldOfStudy, institution, graduationYear }` object. Cast from `unknown` on read.

---

## Notes

- `ResumePreview` is now rendered inside `ResumeUpload` conditionally — shown when a resume URL exists (either from DB on load or after a successful upload).
- Email field is pre-filled from `authData.user.email` passed as `userEmail` prop — no longer hardcoded.
