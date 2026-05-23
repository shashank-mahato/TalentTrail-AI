"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { RoleCard } from "@/components/RoleCard";
import { SkillGapCard } from "@/components/SkillGapCard";
import { demoProfile, mockCareerResult } from "@/lib/mockData";
import { saveCareerResult, saveProfile } from "@/lib/storage";
import type { CareerResult, StudentProfile } from "@/lib/types";

const confidenceOptions = ["Low", "Medium", "High"];
const learningStyles = [
  "Project-based learning",
  "Video-first learning",
  "Reading and notes",
  "Mentor-guided practice"
];

export default function OnboardingPage() {
  const [profile, setProfile] = useState<StudentProfile>(demoProfile);
  const [result, setResult] = useState<CareerResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);

  function updateField(field: keyof StudentProfile, value: string) {
    setProfile((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setUsedFallback(false);

    try {
      const response = await fetch("/api/career-fit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
      });

      if (!response.ok) {
        throw new Error("Career fit API failed");
      }

      const generated = (await response.json()) as CareerResult;
      saveProfile(profile);
      saveCareerResult(generated);
      setResult(generated);
    } catch {
      saveProfile(profile);
      saveCareerResult(mockCareerResult);
      setResult(mockCareerResult);
      setUsedFallback(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <PageHeader
        eyebrow="Onboarding"
        title="Generate your personalized career trail"
        description="Tell TalentTrail AI where you are starting from. The mentor agents will analyze readiness, skill gaps, first mission, and next steps."
      />

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8">
        <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Full name</span>
              <input
                value={profile.name}
                onChange={(event) => updateField("name", event.target.value)}
                className="focus-ring mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Degree</span>
              <input
                value={profile.degree}
                onChange={(event) => updateField("degree", event.target.value)}
                className="focus-ring mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Year</span>
              <input
                value={profile.year}
                onChange={(event) => updateField("year", event.target.value)}
                className="focus-ring mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Branch / Department</span>
              <input
                value={profile.branch}
                onChange={(event) => updateField("branch", event.target.value)}
                className="focus-ring mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                required
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-semibold text-slate-700">Current skills</span>
              <textarea
                value={profile.currentSkills}
                onChange={(event) => updateField("currentSkills", event.target.value)}
                className="focus-ring mt-2 min-h-24 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Target role</span>
              <input
                value={profile.targetRole}
                onChange={(event) => updateField("targetRole", event.target.value)}
                className="focus-ring mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Time available per day</span>
              <input
                value={profile.timePerDay}
                onChange={(event) => updateField("timePerDay", event.target.value)}
                className="focus-ring mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Career confidence level</span>
              <select
                value={profile.confidenceLevel}
                onChange={(event) => updateField("confidenceLevel", event.target.value)}
                className="focus-ring mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
              >
                {confidenceOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Preferred learning style</span>
              <select
                value={profile.learningStyle}
                onChange={(event) => updateField("learningStyle", event.target.value)}
                className="focus-ring mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
              >
                {learningStyles.map((style) => (
                  <option key={style}>{style}</option>
                ))}
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-semibold text-slate-700">Resume text</span>
              <textarea
                value={profile.resumeText ?? ""}
                onChange={(event) => updateField("resumeText", event.target.value)}
                className="focus-ring mt-2 min-h-24 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-semibold text-slate-700">Career interests</span>
              <textarea
                value={profile.interests}
                onChange={(event) => updateField("interests", event.target.value)}
                className="focus-ring mt-2 min-h-24 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                required
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:bg-trail-indigo disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Generate My Career Trail
          </button>
        </form>

        <aside className="space-y-5">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-trail-indigo">
              Result preview
            </p>
            {result ? (
              <>
                <h2 className="mt-3 text-3xl font-bold text-slate-950">{result.readinessScore}%</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{result.careerSummary}</p>
                {usedFallback ? (
                  <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm font-medium text-amber-800">
                    API fallback used. Demo mode is still ready.
                  </p>
                ) : null}
                <Link
                  href="/dashboard"
                  className="focus-ring mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-trail-indigo px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-950"
                >
                  Go to dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            ) : (
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Your generated readiness score, role matches, gaps, and first mission will appear here.
              </p>
            )}
          </div>

          {result ? (
            <>
              <RoleCard role={result.recommendedRoles[0]} />
              <SkillGapCard gap={result.skillGaps[0]} />
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white/70 p-6 text-sm leading-6 text-slate-500">
              Demo profile is pre-filled for a fast hackathon walkthrough. You can edit every field before
              generating.
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}
