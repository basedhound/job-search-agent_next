# Architecture

## Stack

| Layer                          | Tool                     | Purpose                                               |
| ------------------------------ | ------------------------ | ----------------------------------------------------- |
| Framework                      | Next.js 16 (App Router)  | Full stack framework                                  |
| Auth + DB + Storage + Realtime | InsForge                 | Entire backend                                        |
| Cloud browser                  | Browserbase              | LinkedIn browsing + Fetch API for URL input           |
| AI browser control             | Stagehand                | LinkedIn page interaction and extraction              |
| AI model                       | OpenAI GPT-4o            | Matching, cover letters, resume tailoring, extraction |
| Analytics                      | PostHog                  | Event tracking and dashboard charts                   |
| PDF generation                 | @react-pdf/renderer      | Resume PDF rendering                                  |
| Styling                        | Tailwind CSS + shadcn/ui | UI components and styling                             |
| Language                       | TypeScript strict        | Throughout                                            |

---

## Folder Structure

```
/
├── AGENTS.md
├── context/
│   ├── project-overview.md
│   ├── architecture.md
│   ├── ui-tokens.md
│   ├── ui-rules.md
│   ├── ui-registry.md
│   ├── code-standards.md
│   ├── library-docs.md
│   ├── build-plan.md
│   └── progress-tracker.md
├── app/
│   ├── layout.tsx                          → Root layout, PostHog provider
│   ├── page.tsx                            → Homepage
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx                   → Login page
│   │   └── callback/
│   │       └── page.tsx                   → OAuth callback handler
│   ├── dashboard/
│   │   └── page.tsx                       → Main dashboard
│   ├── profile/
│   │   └── page.tsx                       → Profile form + resume management
│   ├── find-jobs/
│   │   ├── page.tsx                       → Find Jobs page — search controls + jobs list
│   │   └── [id]/
│   │       └── page.tsx                   → Individual job details page
│   └── api/
│       ├── agent/
│       │   ├── find/route.ts              → Trigger LinkedIn job discovery
│       │   └── fetch-url/route.ts         → Fetch and score a single job URL
│       ├── linkedin/
│       │   ├── connect/route.ts           → Create Browserbase Context + return live view URL
│       │   └── save-context/route.ts      → Save context ID to profiles table
│       ├── resume/
│       │   ├── generate/route.ts          → Generate base resume PDF from profile
│       │   ├── extract/route.ts           → Extract profile data from uploaded resume PDF
│       │   └── tailor/route.ts            → Generate tailored resume PDF for specific job
│       └── cover-letter/
│           └── generate/route.ts          → Generate cover letter for a job
├── agent/
│   ├── linkedin.ts                        → LinkedIn browsing + dual extraction + detail enrichment
│   ├── matcher.ts                         → GPT-4o job matching logic
│   ├── extractor.ts                       → GPT-4o job description extraction + structuring
│   ├── cover-letter.ts                    → GPT-4o cover letter generation
│   ├── resume.ts                          → Resume tailoring + PDF generation
│   └── types.ts                           → Agent-specific TypeScript types
├── actions/
│   ├── profile.ts                         → Profile save + update
│   └── jobs.ts                            → Job status updates
├── components/
│   ├── ui/                                → shadcn/ui components only
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── homepage/
│   │   ├── Hero.tsx
│   │   ├── HowItWorks.tsx
│   │   └── Features.tsx
│   ├── dashboard/
│   │   ├── StatsBar.tsx
│   │   ├── RecentActivity.tsx
│   │   └── AnalyticsCharts.tsx
│   ├── profile/
│   │   ├── ProfileForm.tsx
│   │   ├── ResumeUpload.tsx
│   │   ├── ResumePreview.tsx
│   │   ├── ConnectedAccounts.tsx
│   │   └── CompletionIndicator.tsx
│   ├── find-jobs/
│   │   ├── SearchControls.tsx
│   │   ├── UrlInput.tsx
│   │   ├── JobsTable.tsx
│   │   ├── JobFilters.tsx
│   │   └── JobsPagination.tsx
│   └── job-details/
│       ├── JobInfo.tsx
│       ├── MatchScore.tsx
│       ├── JobDescription.tsx
│       ├── ResumeSection.tsx
│       ├── CoverLetter.tsx
│       └── JobActions.tsx
├── lib/
│   ├── insforge-client.ts                 → InsForge browser client instance
│   ├── insforge-server.ts                 → InsForge server client
│   ├── browserbase.ts                     → Browserbase session creation + management
│   ├── stagehand.ts                       → Stagehand initialisation with Browserbase session
│   ├── posthog-client.ts                  → PostHog browser client
│   ├── posthog-server.ts                  → PostHog server client
│   └── utils.ts                           → Shared utility functions
└── types/
    └── index.ts                           → Global TypeScript types
```

---

## System Boundaries

| Folder        | Owns                                                                                                                  |
| ------------- | --------------------------------------------------------------------------------------------------------------------- |
| `app/`        | Pages and API routes only. No business logic.                                                                         |
| `agent/`      | All agent logic. LinkedIn browsing, matching, extraction, cover letter, resume tailoring. Nothing here touches React. |
| `actions/`    | Server Actions for UI-triggered mutations only. Profile save, profile update.                                         |
| `components/` | UI only. No data fetching logic. No direct DB calls.                                                                  |
| `lib/`        | Third party client initialisation and shared utilities only.                                                          |
| `types/`      | TypeScript types shared across the project.                                                                           |

---

## Data Flow

### UI Mutations (Server Actions)

```
User interaction in component
        ↓
Server Action in actions/
        ↓
InsForge DB write
        ↓
Revalidate or redirect
```

### Agent Operations (API Routes)

```
User clicks Find Jobs or submits URL
        ↓
API route in app/api/agent/
        ↓
Calls agent/ functions
        ↓
Agent writes results to InsForge DB
        ↓
Page data revalidated
```

### Resume Operations (API Routes)

```
User uploads resume or clicks Generate/Tailor
        ↓
API route in app/api/resume/
        ↓
GPT-4o processes content
        ↓
@react-pdf/renderer renders PDF buffer
        ↓
Old tailored PDF deleted from storage if exists (tailor only)
        ↓
New PDF uploaded to InsForge Storage
        ↓
URL saved to profiles or jobs table
```

### LinkedIn Connection

```
User clicks Connect LinkedIn
        ↓
POST /api/linkedin/connect
        ↓
Browserbase Context created
        ↓
Live view URL returned — opens in new tab
        ↓
User logs in manually
        ↓
POST /api/linkedin/save-context
        ↓
context ID saved to profiles.linkedin_context_id
profiles.linkedin_connected set to true
```

---

## InsForge Database Schema

### `profiles`

| Column              | Type        | Notes                                        |
| ------------------- | ----------- | -------------------------------------------- |
| id                  | uuid        | References auth.users                        |
| full_name           | text        |                                              |
| email               | text        | Pre-filled from auth                         |
| phone               | text        |                                              |
| location            | text        | City, country                                |
| current_title       | text        | Most recent job title                        |
| experience_level    | text        | junior / mid / senior / lead                 |
| years_experience    | integer     |                                              |
| skills              | text[]      | Array of skill tags                          |
| industries          | text[]      | Industries worked in                         |
| work_experience     | jsonb       | Array of up to 3 roles                       |
| education           | jsonb       | Degree, field, institution, year             |
| job_titles_seeking  | text[]      | Roles they want                              |
| remote_preference   | text        | remote / onsite / hybrid / any               |
| preferred_locations | text[]      | Optional preferred locations                 |
| salary_expectation  | text        | Optional                                     |
| cover_letter_tone   | text        | formal / casual / enthusiastic               |
| linkedin_url        | text        |                                              |
| portfolio_url       | text        |                                              |
| work_authorization  | text        | citizen / permanent_resident / visa_required |
| resume_pdf_url      | text        | InsForge Storage URL of current resume       |
| linkedin_context_id | text        | Browserbase Context ID for LinkedIn session  |
| linkedin_connected  | boolean     | True when LinkedIn context is saved          |
| is_complete         | boolean     | True when all required fields filled         |
| created_at          | timestamptz |                                              |
| updated_at          | timestamptz |                                              |

### `agent_runs`

| Column             | Type        | Notes                        |
| ------------------ | ----------- | ---------------------------- |
| id                 | uuid        |                              |
| user_id            | uuid        | References profiles          |
| status             | text        | running / completed / failed |
| job_title_searched | text        |                              |
| location_searched  | text        |                              |
| jobs_found         | integer     | Total jobs discovered        |
| started_at         | timestamptz |                              |
| completed_at       | timestamptz |                              |

### `jobs`

| Column               | Type        | Notes                                                |
| -------------------- | ----------- | ---------------------------------------------------- |
| id                   | uuid        |                                                      |
| run_id               | uuid        | References agent_runs — null if from URL input       |
| user_id              | uuid        | References profiles                                  |
| source               | text        | linkedin / url                                       |
| source_url           | text        | Original job listing URL                             |
| external_apply_url   | text        | Direct company apply URL                             |
| title                | text        |                                                      |
| company              | text        |                                                      |
| location             | text        |                                                      |
| salary               | text        | If available                                         |
| job_type             | text        | fulltime / parttime / contract                       |
| about_role           | text        | 2-3 sentence summary                                 |
| responsibilities     | text[]      | Bullet points                                        |
| requirements         | text[]      | Bullet points                                        |
| nice_to_have         | text[]      | Optional                                             |
| benefits             | text[]      | Optional                                             |
| about_company        | text        | Brief company description                            |
| match_score          | integer     | 0-100 scored against main profile                    |
| match_reason         | text        | GPT-4o explanation                                   |
| matched_skills       | text[]      | Skills user has that match                           |
| missing_skills       | text[]      | Skills user lacks                                    |
| cover_letter         | text        | Generated cover letter                               |
| tailored_resume_url  | text        | InsForge Storage URL of tailored resume for this job |
| tailored_match_score | integer     | Score after tailoring                                |
| is_tailored          | boolean     | Default false                                        |
| found_at             | timestamptz |                                                      |

### `agent_logs`

| Column     | Type        | Notes                            |
| ---------- | ----------- | -------------------------------- |
| id         | uuid        |                                  |
| run_id     | uuid        | References agent_runs            |
| user_id    | uuid        | References profiles              |
| message    | text        | Human readable log entry         |
| level      | text        | info / success / warning / error |
| job_id     | uuid        | Optional — related job           |
| created_at | timestamptz |                                  |

---

## InsForge Storage

| Bucket  | Path                                    | Contents                         |
| ------- | --------------------------------------- | -------------------------------- |
| resumes | resumes/{user_id}/resume.pdf            | Current active resume PDF        |
| resumes | resumes/{user_id}/{job_id}-tailored.pdf | Tailored resume for specific job |

Access: authenticated users only, own files only.

**Tailored PDF rule:** Before uploading a new tailored PDF for a job — always check if `jobs.tailored_resume_url` is set for that job. If it is, delete the existing file from storage first, then upload the new one.

---

## Authentication

- Provider: InsForge Auth
- Methods: Google OAuth, GitHub OAuth
- Protected routes: /dashboard, /profile, /find-jobs, /find-jobs/[id]
- Public routes: /, /login
- Middleware in middleware.ts checks session on every protected route
- On login: check profiles.is_complete → redirect to /profile if false, /dashboard if true

---

## InsForge Client Pattern

Two separate InsForge instances — never mix them:

```typescript
// lib/insforge-client.ts
// Browser-side — used in client components for auth state
import { createBrowserClient } from "@insforge/ssr";
export const insforge = createBrowserClient(
  process.env.NEXT_PUBLIC_INSFORGE_URL!,
  process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
);

// lib/insforge-server.ts
// Server-side — used in API routes, Server Actions, agent code
import { createServerClient } from "@insforge/ssr";
import { cookies } from "next/headers";

export const createInsforgeServer = async () => {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_INSFORGE_URL!,
    process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );
};
```

---

## Browserbase Session Pattern

```typescript
// Standard session for URL fetch
const session = await bb.sessions.create({
  projectId: process.env.BROWSERBASE_PROJECT_ID!,
});

// LinkedIn session — uses saved context
const session = await bb.sessions.create({
  projectId: process.env.BROWSERBASE_PROJECT_ID!,
  browserSettings: {
    context: {
      id: profile.linkedin_context_id,
      persist: true, // keeps cookies fresh after each run
    },
  },
  timeout: 600, // 10 minute session for LinkedIn browsing
});

// LinkedIn Context creation (connect flow)
const context = await bb.contexts.create({
  projectId: process.env.BROWSERBASE_PROJECT_ID!,
});
const session = await bb.sessions.create({
  projectId: process.env.BROWSERBASE_PROJECT_ID!,
  browserSettings: { context: { id: context.id, persist: true } },
});
const { debuggerFullscreenUrl } = await bb.sessions.debug(session.id);
// Return debuggerFullscreenUrl — opens in new tab for user to log in
```

---

## Job Discovery Pattern

**Method 1 — LinkedIn (automated, requires connected account)**

```typescript
// Check connection before starting
if (!profile.linkedin_connected || !profile.linkedin_context_id) {
  return { error: "Connect LinkedIn before finding jobs" };
}

// Auth check after navigation
await page.goto(
  `https://www.linkedin.com/jobs/search/?keywords=...&location=...`,
);
if (page.url().includes("login") || page.url().includes("authwall")) {
  return { error: "LinkedIn session expired. Please reconnect." };
}

// Dual extraction — DOM + Stagehand merged
const domJobs = await extractDomLinkedInJobs(page); // no LLM
const llmJobs = await stagehand.extract({ schema }); // with LLM
const merged = mergeJobs(domJobs, llmJobs); // deduplicate by title|company|location
```

**Method 2 — URL input (manual, any platform)**

```typescript
const response = await bb.fetchAPI.create({ url: jobUrl });
// GPT-4o extracts structured job data from response.content
// GPT-4o scores against user profile
// Saved with source: 'url', run_id: null
```

---

## Invariants

Rules the AI agent must never violate:

- API routes contain no UI logic. Components contain no DB logic.
- Agent code in `/agent` never imports from `/components` or `/actions`.
- Server Actions never call agent functions. Agent functions are only called from API routes.
- All InsForge server-side writes use `createInsforgeServer()` — never the browser client.
- No hardcoded hex values or raw Tailwind color classes in components — use CSS variables from ui-tokens.md.
- Every Stagehand action is wrapped in try/catch. Failures are logged to agent_logs, never thrown to crash the run.
- `profiles` table is never modified by resume tailoring. Tailoring only writes to `jobs.tailored_resume_url` and `jobs.tailored_match_score`.
- Before uploading a new tailored PDF — always delete the existing tailored PDF for that job from InsForge Storage first.
- `run_id` is null on jobs created from URL input — always handle this null case.
- LinkedIn context is only used when `profiles.linkedin_connected` is true AND `profiles.linkedin_context_id` is not null — always check both before creating a session.
- Always scope InsForge queries to the current user_id — never query without a user filter.
