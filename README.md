# TalentTrail AI

**TalentTrail AI: Agentic Career Mentor for Job-Ready Students**

Tagline: **Your personalized trail from skills to career.**

## Project overview

TalentTrail AI is a Next.js MVP that acts like a personal career operating system for college students. It analyzes a student profile, recommends realistic internship roles, maps skill gaps, generates a 30-day proof-based roadmap, improves resume bullets, evaluates interview answers, and compares career paths with CareerTwin.

The app works in demo mode even without Supabase and Gemini configured.

## Problem statement

Many college students, especially from tier-2 and tier-3 colleges, want internships or entry-level jobs but do not know which role fits them, what skills are missing, what to learn first, what projects to build, how to prove their skills, how to improve their resume, or how to prepare for interviews.

Most students do not lack content. They lack direction, personalization, accountability, and proof of skill.

## Solution

TalentTrail AI helps a student move from “I am confused and not job-ready” to “I know my target role, skill gaps, daily tasks, portfolio proof, resume improvements, and interview preparation plan.”

The base MVP uses Gemini server-side when `GEMINI_API_KEY` is available. If Gemini or Supabase are not configured, the app safely falls back to high-quality demo data.

## Agentic AI workflow

- **TrailScan** analyzes the student profile.
- **RoleMatch** recommends best-fit career roles.
- **GapMap** identifies missing skills and proof projects.
- **MissionTrail** creates daily proof-based tasks.
- **ResumeForge** improves resume bullets without inventing fake achievements.
- **InterviewArena** generates and evaluates mock interview practice.
- **CareerTwin** compares possible career paths and shows realistic readiness.

## Features

- Premium SaaS-style landing page.
- Demo mode for Riti Prabhakar, a second-year CSE Data Science student.
- Onboarding form with profile, skills, goals, resume text, interests, and learning style.
- Career readiness score and recommended roles.
- Skill gap cards with current level, required level, priority, and proof project.
- 30-day roadmap grouped by four weeks of daily missions.
- Resume bullet upgrade workflow with before/after scores.
- Interview question generation and answer evaluation.
- CareerTwin comparison for Data Analyst Intern, Frontend Developer Intern, and AI/ML Intern.
- Supabase-ready schema and optional persistence layer.
- GitHub Actions CI for build verification.
- Vercel-ready configuration.

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-inspired local components
- lucide-react icons
- Gemini API via `@google/generative-ai`
- Supabase client via `@supabase/supabase-js`
- localStorage fallback for demo and browser persistence
- Vercel deployment compatibility
- GitHub Actions

## Pages

- `/` landing page
- `/onboarding` student onboarding and career fit generation
- `/dashboard` main student dashboard
- `/roadmap` 30-day roadmap
- `/resume` ResumeForge
- `/interview` InterviewArena
- `/career-twin` CareerTwin path comparison
- `/about` project and impact overview

## API routes

- `POST /api/career-fit`
- `POST /api/roadmap`
- `POST /api/resume`
- `POST /api/interview`

All API routes are designed to return safe fallback data if Gemini is not configured, the API response is invalid, or an upstream error occurs.

## Environment variables

Create these in Vercel. Do not commit real secrets.

```env
NEXT_PUBLIC_SUPABASE_URL=PASTE_YOUR_SUPABASE_PROJECT_URL_HERE
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY_HERE
GEMINI_API_KEY=PASTE_YOUR_GEMINI_API_KEY_HERE
```

## Manual setup checklist

Manual steps after Codex pushes:

1. Open GitHub repository.
2. Confirm GitHub Actions build passes.
3. Create Supabase project.
4. Copy Supabase project URL.
5. Copy Supabase publishable key.
6. Create Gemini API key.
7. In Vercel, import the GitHub repository.
8. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `GEMINI_API_KEY`
9. Run the SQL from `supabase/schema.sql` in Supabase SQL Editor.
10. Deploy on Vercel.
11. Test the live Vercel URL.

## Supabase setup

1. Create a Supabase project.
2. Open SQL Editor.
3. Run `supabase/schema.sql`.
4. Copy the project URL and publishable key into Vercel environment variables.

The base MVP does not implement authentication. Supabase is optional and the app continues to work in demo mode without it.

## Gemini setup

1. Create a Gemini API key from Google AI Studio.
2. Add it to Vercel as `GEMINI_API_KEY`.
3. Redeploy the Vercel project.

Gemini is only called from server-side API routes. The browser never receives the Gemini key.

## Vercel deployment

1. Import the GitHub repository into Vercel.
2. Keep the framework preset as Next.js.
3. Add the environment variables listed above.
4. Deploy.

The app has no local filesystem dependency and is compatible with Vercel serverless API routes.

## GitHub Actions testing

The workflow in `.github/workflows/ci.yml` runs on push and pull request. It installs dependencies with npm, runs lint if a lint script exists, runs the TypeScript check if configured, and runs `npm run build`.

After each push, open the repository Actions tab to confirm the build passed.

## Demo flow

1. Open the deployed site.
2. Click **Launch Demo**.
3. Review Riti Prabhakar's dashboard.
4. Open Roadmap to inspect the 30-day mission plan.
5. Open ResumeForge and upgrade the sample bullet.
6. Open InterviewArena and evaluate the sample answer.
7. Open CareerTwin to compare career paths.

## Future improvements

- Full Supabase auth and user-specific saved progress.
- Row-level security policies and profile ownership.
- CareerTwin powered by live AI comparison.
- Job description upload and resume matching.
- Portfolio proof uploads and shareable recruiter pages.
- Application tracker and follow-up reminders.
- College placement cell dashboard.

## Known limitations

- Demo mode uses localStorage and mock data.
- Supabase persistence is optional and best-effort in the base MVP.
- No login or multi-user dashboard is included in this version.
- AI output is JSON-constrained and safely falls back, but production-grade validation can be expanded.
- CareerTwin uses mock comparison data in the base version.
