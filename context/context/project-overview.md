# Project Overview

## About the Project

JobPilot is a full stack AI-powered job hunting assistant. The user sets up their profile once, uploads their resume, and the agent automatically discovers relevant jobs from LinkedIn — scoring each one against the user's profile using GPT-4o. For matched jobs the agent generates personalized cover letters and tailors the user's resume specifically for each role. The user reviews everything and applies manually with one click.

Users can also paste any job URL directly into the Find Jobs page — the agent fetches that job, scores it, and adds it to their jobs list exactly like an automatically discovered job.

The entire process is tracked on a dashboard with PostHog-powered analytics and a recent activity feed.

---

## The Problem It Solves

Job hunting is one of the most repetitive and time-consuming tasks a developer faces. Reading dozens of job descriptions, deciding if a role fits, rewriting a resume for each application, writing cover letters from scratch — all of this before even clicking apply.

JobPilot eliminates all of that preparation work. The agent finds the jobs, scores them intelligently against the user's actual skills, tailors the resume, and writes the cover letter. The user just decides which ones to apply to and clicks.

---

## Pages

```
/                  → Homepage
/login             → Auth page (Google + GitHub OAuth)
/dashboard         → Overview, recent activity, analytics
/find-jobs         → Search controls + full jobs list + job URL input
/find-jobs/[id]    → Individual job details page
/profile           → Profile form, resume management, connected accounts
```

---

## Navigation

Top navbar. Clean and minimal. Three navigation items:

```
Dashboard    Find Jobs    Profile
```

Full width layout on all pages. No sidebar.

---

## Core User Flow

### Homepage

- Hero section
- Logged in users → redirect to dashboard
- Logged out users → redirect to login

### Onboarding

- User signs up via InsForge auth (Google or GitHub OAuth)
- On login app checks profiles table for this user
- Profile incomplete → redirect to /profile
- Profile complete → redirect to /dashboard
- Dashboard shows incomplete profile banner if profile not finished

### Profile Setup

- User fills profile form — all standard resume fields
- User uploads their existing resume PDF
- Two options on upload:
  - "Update Profile" → GPT-4o parses resume and auto-fills profile form fields
  - "Skip" → resume stored as-is, profile unchanged
- User can manually edit any profile field at any time
- User can generate a clean generic PDF resume from their current profile data
- User can connect LinkedIn account via Browserbase Context — opens in new tab, user logs in manually

### Finding Jobs — Two Methods

**Method 1 — LinkedIn Discovery**

- User goes to Find Jobs page
- Enters job title and location
- Clicks Find Jobs button
- Agent opens Browserbase session using saved LinkedIn context
- Stagehand browses LinkedIn job search with user's criteria
- GPT-4o extracts and structures job description from each listing
- GPT-4o scores each job 0-100 against user profile
- Jobs appear in the job list below
- After search completes a message shows: "Found 8 jobs and saved 4 strong matches"
- Only works if user has connected their LinkedIn account

**Method 2 — URL Input**

- User pastes any job URL into the URL input field on Find Jobs page
- Browserbase Fetch API retrieves that page
- GPT-4o extracts structured job data — title, company, description, requirements, benefits
- GPT-4o scores job against user profile
- Job added to jobs list with full details and match score
- Works without LinkedIn connection — any job from any platform

### Job Matching

- GPT-4o scores each job 0-100 against user profile
- Returns: score, match reason, matched skills array, missing skills array
- All jobs visible in Find Jobs page regardless of score
- High scoring jobs visually highlighted
- Low scoring jobs still accessible — user decides what to do

### Job Details Page

- Full structured job information:
  - Title, company, location, salary, job type, source, date found
  - About the role
  - Responsibilities (bullet points)
  - Requirements (bullet points)
  - Nice to have (if present)
  - Benefits (if present)
  - About the company
- Match score section:
  - Score number prominently displayed
  - Visual score indicator
  - Matched skills — green tags
  - Missing skills — red tags
  - Match reason paragraph from GPT-4o
- Resume section:
  - Current resume filename and download link
  - Tailor Resume button
  - After tailoring: original score vs tailored score comparison shown
  - Warning before tailoring: "This will replace your current resume PDF. Your profile data will not change."
  - Regenerate button after tailoring
- Cover letter section:
  - GPT-4o generated cover letter
  - Copy button
  - Regenerate button
- Apply Now button — opens external apply URL in new tab
- Previous Job button + Next Job button — navigate through jobs ordered by newest first

### Resume Tailoring Flow

- User clicks Tailor Resume on job details page
- Warning modal: "This will replace your current resume PDF. Your profile data will not change."
- User confirms
- GPT-4o rewrites resume content to match this specific job description
- Old tailored PDF for this job deleted from storage if it exists
- New PDF generated and saved to InsForge Storage
- Match score recalculated using tailored resume content
- Score comparison shown: "Original: 72% → Tailored: 91%"

### Dashboard

- Stats bar — 4 cards: Total Jobs Found, Avg. Match Rate, Resumes Tailored, Cover Letters Generated
- Recent activity — list of last 5-10 user actions pulled from DB
- Analytics section (PostHog powered):
  - Jobs found over time — line chart
  - Match score distribution — bar chart
  - Resume tailoring activity — bar chart

### Find Jobs Page

- Search controls at top:
  - Job title input
  - Location input
  - Find Jobs button
  - URL input with Import Job button
  - Success message after search: "Found 8 jobs and saved 4 strong matches"
- Full paginated job list below:
  - Filter: All Matches / High Match / Low Match dropdown
  - Sort dropdown: Match Score / Newest / Oldest
  - Each job row: company, title, match score badge, salary, source badge, date found, tailored badge
  - Click job row → opens job details page
  - Pagination — 20 jobs per page

---

## Data Architecture — Key Separation

### Main Profile Data

- Lives in `profiles` table
- Only changes when user explicitly edits profile page or uploads resume and selects "Update Profile"
- Used for initial job matching
- Never modified by resume tailoring

### Tailored Resume Data

- Tailored PDF stored separately per job in InsForge Storage
- Old tailored PDF deleted before new one is uploaded
- jobs.tailored_resume_url updated after each tailoring
- jobs.tailored_match_score updated after score recalculation
- Main profile data never changes

---

## Features In Scope

- Homepage with hero, how it works, features, footer
- Top navbar — Dashboard, Find Jobs, Profile
- InsForge authentication (Google + GitHub OAuth)
- Smart redirect based on profile completion
- Profile form with all standard resume fields
- Resume PDF upload with optional profile auto-fill
- Resume PDF generation from profile data (generic clean format)
- LinkedIn account connection via Browserbase Context (opens in new tab)
- LinkedIn job discovery via Browserbase + Stagehand (requires connected account)
- Manual job URL input — any job URL from any platform
- GPT-4o job description extraction and structuring
- GPT-4o job matching with score, reason, matched skills, missing skills
- Job details page with full structured description
- Per-job AI cover letter generation
- Resume tailoring per job with score comparison
- Match score recalculation after tailoring
- Warning before resume overwrite
- Old tailored PDF deleted before new one uploaded
- Previous Job + Next Job navigation on job details page
- Find Jobs page with search controls, filter, sort dropdown, pagination
- Dashboard with stats bar, recent activity, analytics charts
- PostHog event tracking throughout
- PostHog analytics charts on dashboard
- Incomplete profile banner on dashboard

---

## Features Out of Scope

- Auto apply — agent does not fill or submit application forms
- LinkedIn Easy Apply — never touched
- Easy Apply detection or apply button interaction
- Sidebar navigation — top navbar only
- Separate analytics page — charts live on dashboard
- Live browser embed on dashboard
- Live agent feed / realtime log
- Job-specific profile form on job details page
- Dismiss job feature
- Email or push notifications
- Mobile app
- Team or multi-user accounts
- Scheduled agent runs — manually triggered only
- Multiple saved resume versions — one active resume per user at a time
- Payment or subscription system
- Browser extension
- Job board integrations beyond LinkedIn and URL input

---

## PostHog Events

```typescript
job_search_started; // { jobTitle, location }
job_found; // { source, matchScore }
job_url_submitted; // { url }
cover_letter_generated; // { jobId }
resume_tailored; // { jobId, scoreBefore, scoreAfter }
profile_completed; // { userId }
linkedin_connected; // { userId }
```

---

## Target User

A developer or technical job seeker who:

- Is actively applying to jobs
- Has an existing resume they want to use
- Wants to eliminate the repetitive preparation work of job applications
- Wants intelligent job matching based on their actual skills
- Is comfortable with a modern web application

---

## Success Criteria

- User can sign up, fill profile, upload resume, and start finding jobs in under 5 minutes
- LinkedIn job discovery works correctly when account is connected
- URL input correctly extracts and scores any valid job posting URL
- GPT-4o match scores feel accurate and the reasoning makes sense
- Tailored resume is visibly different from base resume and relevant to the specific job
- Score comparison after tailoring shows meaningful improvement
- Job details page displays clean structured job information regardless of source
- Dashboard analytics charts show meaningful data after several searches
- All job data stored correctly in InsForge with full structured fields
- PostHog events fire correctly for all key user actions
- UI is visually consistent across all pages
