"use client";

import { FormEvent, useState } from "react";
import { BriefcaseBusiness, Loader2, Save } from "lucide-react";
import { AuthGate } from "@/components/AuthGate";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/lib/useAuth";
import { useTalentTrailData } from "@/lib/useTalentTrailData";

interface JobResult {
  externalId: string;
  jobTitle: string;
  company: string | null;
  location: string | null;
  salary: string | null;
  url: string;
  source: string;
  created: string | null;
  matchScore: number;
  whyItMatches: string;
  missingSkills: string[];
  applyRecommendation: string;
}

export default function JobsPage() {
  return (
    <AuthGate>
      <JobsContent />
    </AuthGate>
  );
}

function JobsContent() {
  const { accessToken } = useAuth();
  const { analysis, loading, savedJobs, refresh } = useTalentTrailData();
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("in");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState<JobResult[]>([]);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("");

  async function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken) return;
    setWorking(true);
    setMessage("");
    const params = new URLSearchParams({
      q: query || analysis?.roadmap.targetRole || "",
      country,
      location
    });
    const response = await fetch(`/api/jobs/search?${params.toString()}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const payload = await response.json().catch(() => null);
    setWorking(false);
    if (!response.ok) {
      setMessage(payload?.message ?? "Job search failed.");
      return;
    }
    setJobs(payload.jobs ?? []);
    await refresh();
  }

  async function saveJob(job: JobResult) {
    if (!accessToken) return;
    await fetch("/api/jobs/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({ ...job, raw: job })
    });
    await refresh();
  }

  if (loading) return <main className="mx-auto max-w-7xl px-4 py-10 text-sm text-slate-600">Loading jobs...</main>;

  if (!analysis) {
    return (
      <main>
        <PageHeader
          eyebrow="JobMatch"
          title="Find real internships from your resume"
          description="Upload your resume first so JobMatch can search Adzuna using your target role and extracted skills."
        />
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <EmptyState
            title="No resume profile found"
            description="JobMatch needs extracted resume skills before searching real opportunities."
            actionHref="/resume-upload"
            actionLabel="Upload resume"
          />
        </section>
      </main>
    );
  }

  return (
    <main>
      <PageHeader
        eyebrow="JobMatch"
        title="Search real jobs and internships"
        description="JobMatch uses Adzuna, your target role, and extracted resume skills. If Adzuna keys are missing, the app shows a setup message instead of fake jobs."
      />
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <form onSubmit={search} className="mb-8 rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <div className="grid gap-4 md:grid-cols-4">
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={analysis.roadmap.targetRole} className="focus-ring rounded-lg border border-slate-200 px-4 py-3 text-sm md:col-span-2" />
            <input value={country} onChange={(event) => setCountry(event.target.value)} placeholder="Country code" className="focus-ring rounded-lg border border-slate-200 px-4 py-3 text-sm" />
            <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Location" className="focus-ring rounded-lg border border-slate-200 px-4 py-3 text-sm" />
          </div>
          {message ? <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm font-medium text-amber-800">{message}</p> : null}
          <button type="submit" disabled={working} className="focus-ring mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-trail-indigo disabled:opacity-70">
            {working ? <Loader2 className="h-4 w-4 animate-spin" /> : <BriefcaseBusiness className="h-4 w-4" />}
            Search Adzuna
          </button>
        </form>

        <div className="grid gap-5 lg:grid-cols-2">
          {jobs.length ? jobs.map((job) => (
            <article key={job.externalId} className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-950">{job.jobTitle}</h2>
                  <p className="mt-1 text-sm text-slate-500">{job.company || "Company not listed"} · {job.location || "Location not listed"}</p>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{job.matchScore}% match</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">{job.applyRecommendation}</p>
              {job.missingSkills.length ? <p className="mt-3 text-sm text-amber-700">Missing: {job.missingSkills.join(", ")}</p> : null}
              <div className="mt-5 flex flex-wrap gap-3">
                <a href={job.url} target="_blank" rel="noreferrer" className="focus-ring rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-trail-indigo">Open job</a>
                <button type="button" onClick={() => saveJob(job)} className="focus-ring inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:text-trail-indigo">
                  <Save className="h-4 w-4" />
                  Save
                </button>
              </div>
            </article>
          )) : (
            <EmptyState
              title="No job search run yet"
              description="Search Adzuna to load real jobs and internships. Saved jobs will appear in your dashboard."
            />
          )}
        </div>

        {savedJobs.length ? (
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
            <h2 className="text-xl font-bold text-slate-950">Saved jobs</h2>
            <div className="mt-4 grid gap-3">
              {savedJobs.map((job) => (
                <a key={job.id} href={job.url} target="_blank" rel="noreferrer" className="rounded-lg bg-slate-50 p-4 text-sm font-semibold text-slate-700 hover:text-trail-indigo">
                  {job.job_title} {job.company ? `· ${job.company}` : ""}
                </a>
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}
