"use client";

import { FormEvent, useState } from "react";
import { Copy, FileText, Loader2, Sparkles } from "lucide-react";
import { AuthGate } from "@/components/AuthGate";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { ProgressBar } from "@/components/ProgressBar";
import { useAuth } from "@/lib/useAuth";
import { useTalentTrailData } from "@/lib/useTalentTrailData";
import type { ResumeFeedback } from "@/lib/types";

export default function ResumePage() {
  return (
    <AuthGate>
      <ResumeForgeContent />
    </AuthGate>
  );
}

function ResumeForgeContent() {
  const { accessToken } = useAuth();
  const { analysis, resumeFeedback, loading, refresh } = useTalentTrailData();
  const [bullet, setBullet] = useState("");
  const [feedback, setFeedback] = useState<ResumeFeedback | null>(null);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken) return;
    setWorking(true);
    setMessage("");
    const response = await fetch("/api/ai/resume-forge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({ bullet })
    });
    const payload = await response.json().catch(() => null);
    setWorking(false);
    if (!response.ok) {
      setMessage(payload?.message ?? "ResumeForge failed.");
      return;
    }
    setFeedback(payload as ResumeFeedback);
    await refresh();
  }

  if (loading) return <main className="mx-auto max-w-7xl px-4 py-10 text-sm text-slate-600">Loading ResumeForge...</main>;

  if (!analysis) {
    return (
      <main>
        <PageHeader
          eyebrow="ResumeForge"
          title="Improve resume bullets with real evidence"
          description="Upload and parse your resume first so ResumeForge can avoid invented achievements."
        />
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <EmptyState
            title="No uploaded resume found"
            description="ResumeForge requires your real resume and proof data before it can improve bullets."
            actionHref="/resume-upload"
            actionLabel="Upload resume"
          />
        </section>
      </main>
    );
  }

  const latest = feedback ?? resumeFeedback[0] ?? analysis.resume_feedback?.[0] ?? null;

  return (
    <main>
      <PageHeader
        eyebrow="ResumeForge"
        title="Improve bullets without inventing fake metrics"
        description="Paste a real bullet from your uploaded resume. ResumeForge uses your resume and proof data, and uses bracketed placeholders when exact numbers are missing."
      />

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <form onSubmit={submit} className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-950">Resume bullet</h2>
              <p className="text-sm text-slate-500">Use a real bullet from your uploaded resume.</p>
            </div>
          </div>
          <textarea
            value={bullet}
            onChange={(event) => setBullet(event.target.value)}
            className="focus-ring min-h-40 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm"
            required
          />
          {message ? <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm font-medium text-rose-800">{message}</p> : null}
          <button
            type="submit"
            disabled={working}
            className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-trail-indigo disabled:opacity-70"
          >
            {working ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Upgrade Bullet
          </button>
        </form>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          {latest ? (
            <>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-trail-indigo">
                    Improved output
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-950">Role-ready bullet</h2>
                </div>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(latest.improvedBullet)}
                  className="focus-ring inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:text-trail-indigo"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </button>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-slate-500">Original bullet</p>
                  <p className="mt-3 text-base font-semibold text-slate-950">{latest.originalBullet}</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-5">
                  <p className="text-sm font-semibold text-blue-700">Improved bullet</p>
                  <p className="mt-3 text-base font-semibold leading-7 text-slate-950">
                    {latest.improvedBullet}
                  </p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-slate-200 p-5">
                  <div className="mb-2 flex items-center justify-between text-sm font-semibold">
                    <span>Before</span>
                    <span>{latest.scoreBefore}/10</span>
                  </div>
                  <ProgressBar value={latest.scoreBefore * 10} />
                </div>
                <div className="rounded-lg border border-slate-200 p-5">
                  <div className="mb-2 flex items-center justify-between text-sm font-semibold">
                    <span>After</span>
                    <span>{latest.scoreAfter}/10</span>
                  </div>
                  <ProgressBar value={latest.scoreAfter * 10} />
                </div>
              </div>
              <div className="mt-6 rounded-lg bg-slate-950 p-5 text-white">
                <h3 className="font-bold">Why it is stronger</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{latest.explanation}</p>
              </div>
              <div className="mt-6 grid gap-3">
                {latest.tips.map((tip) => (
                  <div key={tip} className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                    {tip}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              title="No resume improvements yet"
              description="Paste a bullet from your uploaded resume to generate the first ResumeForge improvement."
            />
          )}
        </section>
      </section>
    </main>
  );
}
