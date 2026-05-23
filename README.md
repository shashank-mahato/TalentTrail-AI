# TalentTrail AI

**TalentTrail AI: Agentic Career Mentor for Job-Ready Students**

Tagline: **Your personalized trail from skills to career.**

## Project overview

TalentTrail AI is a resume-powered career operating system for students. A user signs up, uploads a real resume, reviews the extracted profile, and then uses AI agents to generate career diagnosis, role recommendations, skill gaps, a 30-day proof-based roadmap, missions, proof reviews, resume improvements, interview practice, CareerTwin path comparisons, and real job searches.

The application is designed for Vercel, Supabase Auth, Supabase Postgres, Supabase Storage, Supabase Realtime, Gemini, and Adzuna.

## Problem statement

Many college students want internships or entry-level roles but do not know which role fits them, what they are missing, what to learn first, how to prove skills, how to improve their resume, or how to prepare for interviews. TalentTrail AI turns the student's real resume into a personalized career trail.

## Solution

TalentTrail AI uses the uploaded resume as the source of truth. It extracts structured profile data, lets the user correct it, and then generates recommendations and missions from that reviewed profile. The app does not display fabricated career profiles, fabricated roadmaps, or fabricated job listings.

## Agentic AI workflow

- **TrailScan Agent** parses resumes and extracts profile details.
- **RoleMatch Agent** recommends suitable career roles.
- **GapMap Agent** identifies skill gaps and proof tasks.
- **MissionTrail Agent** creates a 30-day roadmap and missions.
- **ProofReview Agent** reviews uploaded proof-of-work.
- **ResumeForge Agent** improves resume bullets without inventing metrics.
- **InterviewArena Agent** prepares questions and evaluates answers from the resume.
- **CareerTwin Agent** compares realistic paths from the current profile.
- **JobMatch Agent** searches real roles through Adzuna.
- **Notification Agent** stores career trail updates.

## Features

- Supabase Auth signup, login, logout, and protected pages.
- Resume upload at `/resume-upload` for PDF, DOCX, TXT, or pasted text.
- Server-side resume text extraction and Gemini strict JSON parsing.
- Resume profile review and correction at `/resume-profile`.
- Career readiness score, recommended roles, skill gaps, first mission, and next steps.
- 30-day roadmap and mission tracking.
- ProofVault file/link submission with Supabase Storage and AI review.
- ResumeForge improvements from uploaded resume evidence.
- InterviewArena questions and evaluation based on resume and target role.
- CareerTwin path comparison based on resume evidence.
- Real Adzuna job/internship search and saved jobs.
- Supabase Realtime dashboard updates.
- Agent Center and Notifications pages.
- Settings page with safe integration status checks.

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- lucide-react
- Supabase Auth
- Supabase Postgres
- Supabase Storage
- Supabase Realtime
- Gemini API via `@google/generative-ai`
- Adzuna Jobs API
- PDF/DOCX/TXT parsing via `pdf-parse` and `mammoth`
- Vercel deployment
- GitHub Actions CI

## Pages

- `/` landing page
- `/auth` signup and login
- `/onboarding` resume-first onboarding overview
- `/dashboard` realtime user dashboard
- `/resume-upload` resume upload and parsing
- `/resume-profile` extracted profile review and edit
- `/roadmap` 30-day roadmap and mission status
- `/proof-vault` proof upload and proof review
- `/resume` ResumeForge
- `/interview` InterviewArena
- `/career-twin` CareerTwin
- `/jobs` Adzuna job search and saved jobs
- `/agent-center` agent runs
- `/notifications` realtime notifications
- `/settings` integration status
- `/about` project overview

## API routes

- `POST /api/resume/parse`
- `POST /api/resume/analyze`
- `POST /api/ai/career-diagnosis`
- `POST /api/ai/generate-roadmap`
- `POST /api/ai/review-proof`
- `POST /api/ai/resume-forge`
- `POST /api/ai/interview/questions`
- `POST /api/ai/interview/evaluate`
- `POST /api/ai/career-twin`
- `GET /api/jobs/search`
- `POST /api/jobs/save`
- `GET /api/settings/status`

All protected API routes verify the Supabase authenticated user through a bearer token.

## Environment variables

The repo includes a placeholder `.env` file. Replace the placeholder values in Vercel with real values.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

GEMINI_API_KEY=your_gemini_api_key

ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Server-only secrets:

- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`
- `ADZUNA_APP_KEY`

Only `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `NEXT_PUBLIC_APP_URL` are browser-visible.

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` or `supabase/migrations/0001_real_resume_intelligence.sql`.
3. Confirm tables are created:
   - `profiles`
   - `resume_documents`
   - `resume_analyses`
   - `career_trails`
   - `career_results`
   - `roadmaps`
   - `missions`
   - `proof_items`
   - `resume_feedback`
   - `interview_sessions`
   - `saved_jobs`
   - `agent_runs`
   - `notifications`
4. Confirm storage buckets exist:
   - `resumes`
   - `proof-files`
5. Enable Realtime for dashboard tables if needed from Supabase Database Replication settings.

The SQL enables RLS and owner-only policies for all user-owned rows and storage paths.

## Gemini setup

Create a Gemini API key and add it to Vercel as `GEMINI_API_KEY`. Gemini is used only from server-side API routes and is never exposed to the browser.

## Adzuna setup

Create Adzuna credentials and add:

- `ADZUNA_APP_ID`
- `ADZUNA_APP_KEY`

If these values are missing, `/jobs` shows a setup error instead of fallback job cards.

## Vercel deployment

1. Import `https://github.com/shashank-mahato/TalentTrail-AI.git` into Vercel.
2. Add all environment variables.
3. Deploy.
4. Sign up, upload a real resume, review the extracted profile, and run the career workflow.

## GitHub Actions testing

`.github/workflows/ci.yml` runs on push and pull request. It installs dependencies, runs lint if configured, runs TypeScript checks, and builds the app.

## Real workflow

1. User signs up or logs in.
2. User uploads a real resume or pastes resume text.
3. TalentTrail AI parses the resume and extracts structured profile data.
4. User reviews and edits the extracted profile.
5. AI generates career readiness score, roles, gaps, roadmap, missions, ResumeForge suggestions, interview questions, CareerTwin paths, and real job search links.
6. User uploads proof-of-work to ProofVault.
7. ProofReview evaluates submitted proof.
8. Dashboard updates through Supabase Realtime.

## Known limitations

- Resume parsing quality depends on text-readable PDF/DOCX content.
- Link-only proof review depends on the user providing enough description if the link content is not accessible.
- Adzuna availability depends on country code, query, and API credentials.
- The app uses a JSON editor for advanced profile correction in this upgrade; a structured field editor can be added next.
