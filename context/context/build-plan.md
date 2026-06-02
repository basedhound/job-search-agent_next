# Build Plan

## Core Principle

Full page UI built with mock data first — verified visually before any logic is written. Then functionality is built and wired to the UI step by step. Every feature must be visible and testable before moving to the next. No invisible backend phases.

---

## Phase 1 — Foundation

### 01 Homepage

Build the complete homepage UI.

**UI:**

- Navbar — logo, Dashboard, Find Jobs, Profile links, Start for free button
- Hero section — headline, subheadline, Get Started CTA and Find Your First Match CTA
- Dashboard preview screenshot embedded below hero
- Features section — three value props with descriptions
- Testimonial section
- Bottom CTA section
- Footer

**Logic:**

- Get Started and Start for free → /login if not authenticated, /dashboard if authenticated

---

### 02 Auth

InsForge authentication — Google and GitHub OAuth.

**UI:**

- Login page — Google OAuth button, GitHub OAuth button

**Logic:**

- Google OAuth via InsForge
- GitHub OAuth via InsForge
- OAuth callback handler
- Session management
- Middleware protecting /dashboard, /profile, /find-jobs, /find-jobs/[id]

---

### 03 PostHog Initialization

Set up PostHog before any events fire. Must be done before any agent features.

**Logic:**

- Create lib/posthog-client.ts — PostHog browser client, initialized with NEXT_PUBLIC_POSTHOG_KEY and NEXT_PUBLIC_POSTHOG_HOST
- Create lib/posthog-server.ts — PostHog server client with flushAt: 1 and flushInterval: 0
- Initialize PostHog in root app layout — wraps entire app
- posthog.identify() called after successful login with user ID
- posthog.reset() called on logout

---

### 04 Database Schema

All InsForge tables and storage bucket created before any data is written.

**Logic:**

- Create `profiles` table with all columns from architecture.md
- Create `agent_runs` table
- Create `jobs` table with all columns including tailored fields
- Create `agent_logs` table
- Create `resumes` storage bucket with authenticated access only
- Row level security policies on all four tables — always filter by user_id

---

## Phase 2 — Profile Page

### 05 Profile Page — Full UI

Build the complete profile page UI with mock data. No save logic yet.

**UI:**

- Profile needs attention banner at top — completion percentage ring, missing field tags highlighted (e.g. PHONE, LOCATION, EDUCATION)
- Connected Accounts section — LinkedIn row with "Not connected" status and Connect LinkedIn button
- Resume section — drag and drop upload area, "Click to upload or drag and drop" text, PDF only note, Select Resume button, Generate Resume from Profile button below
- Profile Information form with clearly labeled sections:
  - Personal Info — Full Name, Email (pre-filled, not editable), Phone Number, Location, LinkedIn URL, Portfolio/GitHub, Work Authorization dropdown
  - Professional Info — Current Job Title, Experience Level dropdown, Years of Experience, Skills tag input with Add button, Industries tag input with Add button
  - Work Experience — up to 3 roles, each with Company Name, Job Title, Start Date, End Date, Currently working here checkbox, Key Responsibilities textarea. Add role button.
  - Education — Highest Degree dropdown, Field of Study, Institution Name, Graduation Year
  - Job Preferences — Job Titles Seeking, Remote Preference dropdown, Salary Expectation, Preferred Locations, Cover Letter Tone dropdown
- Save Profile button at bottom

---

### 06 Profile Save Logic

Wire profile form to InsForge DB.

**Logic:**

- Server Action in actions/profile.ts saves all form fields to profiles table
- Resume PDF uploaded to InsForge Storage at resumes/{user_id}/resume.pdf with upsert: true
- resume_pdf_url saved to profiles table after upload
- is_complete set to true when all required fields are filled
- Completion percentage and missing fields calculated and saved
- Form pre-fills with existing data on return visits
- revalidatePath('/profile') called after save

---

### 07 AI Profile Extraction from Resume

Extract from Resume button — GPT-4o reads uploaded PDF and auto-fills profile form fields.

**UI:**

- Extract from Resume button appears after resume is uploaded
- Loading state while processing
- Form fields populate automatically after extraction
- User reviews and edits if needed before saving

**Logic:**

- pdf-parse extracts raw text from uploaded PDF buffer
- If extracted text is empty or too short — return error: "Could not extract text from this PDF. Please try a different file."
- GPT-4o reads extracted text and returns structured JSON matching all profile field names
- Form fields populated with extracted data
- User saves manually after reviewing

---

### 08 Resume PDF Generation from Profile

Generate a clean generic PDF resume from current profile data.

**Logic:**

- POST /api/resume/generate
- Reads current profile data from profiles table
- @react-pdf/renderer renders clean single-page PDF from profile fields
- renderToBuffer() used — never write to disk
- Buffer uploaded to InsForge Storage at resumes/{user_id}/resume.pdf with upsert: true
- resume_pdf_url updated in profiles table

---

### 09 LinkedIn Connection via Browserbase Context

User connects LinkedIn account once. Agent reuses this session for all future job searches.

**UI (on Profile page — Connected Accounts section):**

- Connect LinkedIn button
- Clicking opens LinkedIn login page in a new browser tab (Browserbase live view URL)
- After user logs in manually they return to the app
- "I'm Connected" button appears
- Clicking saves the context and updates status to LinkedIn Connected ✅
- Disconnect option shown after connecting

**Logic:**

- POST /api/linkedin/connect:
  - Creates Browserbase Context: bb.contexts.create({ projectId })
  - Creates Browserbase session using that context with persist: true
  - Gets live view URL: bb.sessions.debug(session.id) → debuggerFullscreenUrl
  - Returns contextId and liveViewUrl to client
- Client opens liveViewUrl in new tab
- POST /api/linkedin/save-context:
  - Receives contextId from client
  - Saves to profiles.linkedin_context_id
  - Sets profiles.linkedin_connected to true

---

### 10 Smart Redirect + Profile Completion Check

Route users to the right page based on profile completion.

**Logic:**

- On login — check profiles.is_complete for current user
- is_complete false or profile row missing → redirect to /profile
- is_complete true → redirect to /dashboard
- Dashboard reads profiles.is_complete — if false shows incomplete profile banner with link to /profile
- Banner disappears once is_complete is true

---

## Phase 3 — Find Jobs Page

### 11 Find Jobs Page — Full UI

Build the complete Find Jobs page UI with mock data. No logic yet.

**UI:**

- Search controls card at top:
  - JOB TITLE label + input with search icon placeholder "Frontend Engineer"
  - LOCATION label + input placeholder "Remote, New York..."
  - Find Jobs button with search icon
  - IMPORT BY URL label + full-width URL input placeholder "https://jobs.company.com/..."
  - Import Job button
  - Success message area below controls — green banner: "Found 8 jobs and saved 4 strong matches."
- Job list section below:
  - Filter bar: text search input "Filter by company or role...", All Matches dropdown, Match Score sort dropdown
  - Jobs table with columns: COMPANY, ROLE, MATCH SCORE (color coded progress bar + percentage), SALARY EST., SOURCE (LinkedIn/URL badge), DATE FOUND
  - Tailored badge next to role name for tailored jobs
  - Pagination — "Showing 1 to 6 of 24 results", Previous, page numbers, Next

---

### 12 LinkedIn Browsing + Dual Extraction

Agent opens LinkedIn with saved context and extracts job listings using two strategies merged together.

**Logic:**

- POST /api/agent/find receives jobTitle and location from client
- Load linkedin_context_id from profiles table — if missing return error: "Connect LinkedIn before finding jobs"
- Create Stagehand session via createStagehandSession:
  - contextId: profile.linkedin_context_id
  - persistContext: true — keeps cookies fresh after each run
  - timeout: 600 — 10 minute session
- Navigate to: https://www.linkedin.com/jobs/search/?keywords={jobTitle}&location={location}
- Auth check — if page URL contains 'login' or 'authwall' → context expired → return error: "LinkedIn session expired. Please reconnect."
- Dual extraction on search results page:
  - DOM scraping via page.evaluate() — walks [data-job-id] and a[href*="/jobs/view/"] elements to extract title, company, location, LinkedIn job URL without any LLM call → extractDomLinkedInJobs()
  - Stagehand LLM extract with Zod schema — GPT-4o Vision extracts up to 10 jobs including title, company, location, description snippets → stagehand.extract()
  - mergeJobs() — DOM results anchor the URLs, LLM results enrich apply mode and descriptions
  - Deduplicate merged results by title|company|location key
- Create agent_run record in DB, save run ID

---

### 13 LinkedIn Detail Page Enrichment + Description Cleaning

For each merged job listing — visit its LinkedIn page, detect apply mode, extract and clean full description, save to DB.

**Logic:**

- For each merged job:
  - Navigate to the individual LinkedIn job URL
  - Extract full raw job description from .jobs-description\_\_content or #job-details selectors
- GPT-4o cleans each raw description:
  - Strips LinkedIn chrome — premium upsells, "Use AI to assess this job", language selectors, "See who you know" sections
  - Restructures into clean fields: aboutRole, responsibilities[], requirements[], niceToHave[], benefits[], aboutCompany
- GPT-4o scores each job against user profile:
  - matchScore — integer 0-100
  - matchReason — one paragraph explanation
  - matchedSkills — skills user has that job requires
  - missingSkills — skills job requires that user lacks
- Save complete job record to jobs table — all structured fields + match fields + source: 'linkedin' + run_id
- Write entry to agent_logs for each job processed
- After all jobs saved — update agent_run with total count, return success message to frontend

**PostHog events:** `job_search_started`, `job_found`

---

### 14 URL Input — Fetch + Extract + Score + Save

User pastes any job URL. Agent fetches, structures, scores, and saves complete record.

**Logic:**

- POST /api/agent/fetch-url receives jobUrl from client
- Browserbase Fetch API retrieves raw page content from the URL
- GPT-4o reads raw content and extracts structured job data:
  - title, company, location, salary, jobType
  - aboutRole, responsibilities[], requirements[], niceToHave[], benefits[], aboutCompany
  - externalApplyUrl — same as input URL or more direct URL if found
- GPT-4o scores job against user profile:
  - matchScore, matchReason, matchedSkills[], missingSkills[]
- Save complete record to jobs table:
  - source: 'url'
  - run_id: null — URL imports are never part of an agent run
  - All structured description and match fields saved

**PostHog event:** `job_url_submitted`

---

### 15 Filter + Sort + Pagination

Wire filter tabs, sort dropdown, text search, and pagination to real InsForge DB data.

**Logic:**

- All Matches tab — all jobs for current user
- High Match filter — jobs with match_score >= 70
- Low Match filter — jobs with match_score < 70
- Sort by Match Score — order by match_score descending
- Sort by Newest — order by found_at descending
- Sort by Oldest — order by found_at ascending
- Text search — filter by company name or job title (case insensitive)
- Pagination — 20 jobs per page, total count shown

---

## Phase 4 — Job Details Page

### 16 Job Details Page — Full UI

Build the complete job details page UI. Job data from DB is already available from Phase 3 — wire real data for all job info, match, and description sections immediately. Cover letter and resume sections show empty state only.

**UI:**

- Back to Jobs link
- Job header — company logo placeholder, job title, company name, match score badge with percentage, View Job Post button (links to externalApplyUrl)
- Info cards row — Salary Est., Location, Job Type, Date Found
- AI Match Reasoning section — match reason paragraph from GPT-4o
- Required Skills vs Your Profile — matched skills as green badges, missing skills as red/orange badges
- Job Description section — About the Role, Responsibilities (bullet list), Requirements (bullet list), Nice to Have (bullet list, hidden if empty), Benefits (bullet list, hidden if empty), About the Company
- Targeted Cover Letter card — empty state with Generate Cover Letter button (cover letter text, Copy Text, Regenerate shown after generation)
- Tailored Resume card — empty state with Tailor Resume button (filename, Download, Regenerate, score comparison, Recalculate Score shown after tailoring)
- Apply Now button (links to externalApplyUrl, opens in new tab) + Next Job button

---

### 17 Cover Letter Generation

GPT-4o generates personalized cover letter for this specific job.

**UI:**

- Generate Cover Letter button in empty state card
- Loading state while generating
- Cover letter text appears in card after generation
- Copy Text button — copies cover letter to clipboard
- Regenerate button — generates new version

**Logic:**

- POST /api/cover-letter/generate receives jobId
- Loads job description and user profile from DB
- GPT-4o generates cover letter using job description + profile fields + cover_letter_tone preference from profile
- Cover letter saved to jobs.cover_letter

**PostHog event:** `cover_letter_generated`

---

### 18 Resume Tailoring — GPT-4o Rewrite

Warning modal + GPT-4o rewrites resume content specifically for this job.

**UI:**

- Tailor Resume button in empty state card
- Warning modal on click: "This will replace your current resume PDF. Your profile data will not change." with Confirm and Cancel buttons
- Loading state after confirm — "Tailoring your resume..."

**Logic:**

- User confirms warning modal
- POST /api/resume/tailor receives jobId
- Loads user profile + job description from DB
- GPT-4o rewrites resume content to emphasize skills matching job requirements
- Returns structured tailored resume content — same shape as profile fields but reworded for this job
- Tailored content stored temporarily — PDF generation happens in next feature
- jobs.is_tailored set to true

---

### 19 Tailored Resume PDF Generation + Storage

Generate PDF from tailored content, delete old tailored PDF if exists, upload new one.

**Logic:**

- Receives tailored resume content from feature 18
- Check jobs.tailored_resume_url for this job:
  - If exists — delete old file from InsForge Storage at that path before uploading
- @react-pdf/renderer renders new PDF from tailored content using renderToBuffer()
- Buffer uploaded to InsForge Storage at resumes/{user_id}/{job_id}-tailored.pdf with upsert: false (file was deleted, fresh upload)
- jobs.tailored_resume_url updated with new storage URL

---

### 20 Score Recalculation + Comparison Display

Recalculate match score using tailored resume content, update DB, show comparison.

**UI:**

- Score comparison appears: "Original: 72% → Tailored: 91%"
- Tailored Resume card updates — shows filename, Download button, Regenerate button
- Recalculate Score button — triggers recalculation if user wants to run again

**Logic:**

- GPT-4o rescores job using tailored resume content instead of main profile
- jobs.tailored_match_score updated with new score
- Score comparison calculated: original jobs.match_score vs new jobs.tailored_match_score
- Comparison displayed in UI

**PostHog event:** `resume_tailored`

---

### 21 Previous Job + Next Job Navigation

Navigate between jobs directly from the job details page without going back to the list.

**Logic:**

- Jobs ordered by found_at descending — newest first
- Next Job button — fetches the next job ID in the ordered list for current user
- Previous Job button — fetches the previous job ID in the ordered list
- Navigate to /find-jobs/[nextJobId] or /find-jobs/[prevJobId]
- Next Job button disabled on the most recent job
- Previous Job button disabled on the oldest job

---

## Phase 5 — Dashboard

### 22 Dashboard Page — Full UI

Build the complete dashboard UI with mock data.

**UI:**

- Four stat cards: Total Jobs Found, Avg. Match Rate, Resumes Tailored, Cover Letters Generated — all showing mock numbers with trend indicators
- Recent Activity card — list of 5 activity entries with colored dots and timestamps
- Resume Tailoring Activity — bar chart (mock data, days of week)
- Jobs Found Over Time — line chart (mock data, days of week)
- Match Score Distribution — bar chart (mock data, score ranges 50-60%, 60-70%, 70-80%, 80-90%, 90-100%)
- Incomplete profile banner at top if profile not complete

---

### 23 Stats Bar — Real Data

Wire four stat cards to real InsForge DB data for current user.

**Logic:**

- Total Jobs Found — COUNT of jobs where user_id = current user
- Avg. Match Rate — AVG of match_score across all user jobs
- Resumes Tailored — COUNT of jobs where is_tailored = true and user_id = current user
- Cover Letters Generated — COUNT of jobs where cover_letter IS NOT NULL and user_id = current user

---

### 24 Recent Activity — Real Data

Wire recent activity list to real InsForge DB data for current user.

**Logic:**

- Query agent_runs table — most recent runs for current user
- Query jobs table — most recent tailored and cover letter entries for current user
- Merge and sort all by created_at descending — take last 5-10 entries
- Format each into human readable string:
  - agent_run completed → "Found X jobs for [jobTitle] — [time ago]"
  - is_tailored set to true → "Tailored resume for [title] at [company] — [time ago]"
  - cover_letter populated → "Generated cover letter for [title] at [company] — [time ago]"
- Color coded dot per entry type — info blue, success green, action purple

---

### 25 Analytics Charts — PostHog Data

Wire three dashboard charts to real PostHog event data for current user.

**Logic:**

- Jobs Found Over Time — query PostHog for job_found events where distinctId = current userId, last 30 days, group by day
- Match Score Distribution — query PostHog for job_found events, extract matchScore property, group into ranges: 50-60, 60-70, 70-80, 80-90, 90-100
- Resume Tailoring Activity — query PostHog for resume_tailored events where distinctId = current userId, last 7 days, group by day
- All three charts rendered with recharts
- Empty state shown for each chart when no data exists yet

---

## Feature Count

| Phase                 | Features |
| --------------------- | -------- |
| Phase 1 — Foundation  | 4        |
| Phase 2 — Profile     | 6        |
| Phase 3 — Find Jobs   | 5        |
| Phase 4 — Job Details | 6        |
| Phase 5 — Dashboard   | 4        |
| **Total**             | **25**   |
