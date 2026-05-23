"use client";

import { FormEvent, useEffect, useState } from "react";
import { FileText, Loader2, Sparkles, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ProgressBar } from "@/components/ProgressBar";
import { demoProfile, mockResumeFeedback } from "@/lib/mockData";
import { getProfile } from "@/lib/storage";
import type { ResumeFeedback } from "@/lib/types";

export default function ResumePage() {
  const [bullet, setBullet] = useState(mockResumeFeedback.originalBullet);
  const [targetRole, setTargetRole] = useState("Data Analyst Intern");
  const [feedback, setFeedback] = useState<ResumeFeedback>(mockResumeFeedback);
  const [loading, setLoading] = useState(false);
  const [fallbackUsed, setFallbackUsed] = useState(false);

  useEffect(() => {
    const profile = getProfile() ?? demoProfile;
    setTargetRole(profile.targetRole);
    if (profile.resumeText) {
      setBullet(profile.resumeText);
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setFallbackUsed(false);

    try {
      const response = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bullet, targetRole })
      });

      if (!response.ok) {
        throw new Error("Resume API failed");
      }

      setFeedback((await response.json()) as ResumeFeedback);
    } catch {
      setFeedback({ ...mockResumeFeedback, originalBullet: bullet });
      setFallbackUsed(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <PageHeader
        eyebrow="ResumeForge"
        title="Upgrade weak resume bullets into proof"
        description="Improve resume bullets honestly for the target role. If metrics are missing, TalentTrail AI suggests placeholders instead of inventing achievements."
      />

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-950">Resume input</h2>
              <p className="text-sm text-slate-500">Default sample is ready for the demo flow.</p>
            </div>
          </div>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Weak resume bullet</span>
            <textarea
              value={bullet}
              onChange={(event) => setBullet(event.target.value)}
              className="focus-ring mt-2 min-h-36 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
              required
            />
          </label>
          <label className="mt-5 block">
            <span className="text-sm font-semibold text-slate-700">Target role</span>
            <input
              value={targetRole}
              onChange={(event) => setTargetRole(event.target.value)}
              className="focus-ring mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
              required
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-trail-indigo disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Upgrade Bullet
          </button>
          <p className="mt-4 text-sm leading-6 text-slate-500">
            ResumeForge will not create fake achievements. Replace bracketed placeholders with real,
            verifiable numbers only.
          </p>
        </form>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-trail-indigo">
                Improved output
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">Role-ready bullet</h2>
            </div>
            <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
              +{feedback.scoreAfter - feedback.scoreBefore} score lift
            </div>
          </div>

          {fallbackUsed ? (
            <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm font-medium text-amber-800">
              API fallback used. Demo feedback is still available.
            </p>
          ) : null}

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-500">Original bullet</p>
              <p className="mt-3 text-base font-semibold text-slate-950">{feedback.originalBullet}</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-5">
              <p className="text-sm font-semibold text-blue-700">Improved bullet</p>
              <p className="mt-3 text-base font-semibold leading-7 text-slate-950">
                {feedback.improvedBullet}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 p-5">
              <div className="mb-2 flex items-center justify-between text-sm font-semibold">
                <span>Before</span>
                <span>{feedback.scoreBefore}/10</span>
              </div>
              <ProgressBar value={feedback.scoreBefore * 10} />
            </div>
            <div className="rounded-lg border border-slate-200 p-5">
              <div className="mb-2 flex items-center justify-between text-sm font-semibold">
                <span>After</span>
                <span>{feedback.scoreAfter}/10</span>
              </div>
              <ProgressBar value={feedback.scoreAfter * 10} />
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-slate-950 p-5 text-white">
            <div className="mb-2 flex items-center gap-2 font-bold">
              <TrendingUp className="h-5 w-5 text-blue-200" />
              Why it is stronger
            </div>
            <p className="text-sm leading-6 text-slate-300">{feedback.explanation}</p>
          </div>

          <div className="mt-6">
            <h3 className="font-bold text-slate-950">Tips to make it stronger</h3>
            <div className="mt-3 grid gap-3">
              {feedback.tips.map((tip) => (
                <div key={tip} className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
