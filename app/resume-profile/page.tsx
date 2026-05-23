"use client";

import { FormEvent, useEffect, useState } from "react";
import { Loader2, RefreshCcw, Save } from "lucide-react";
import { AuthGate } from "@/components/AuthGate";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/lib/useAuth";
import { useTalentTrailData } from "@/lib/useTalentTrailData";

export default function ResumeProfilePage() {
  return (
    <AuthGate>
      <ResumeProfileContent />
    </AuthGate>
  );
}

function ResumeProfileContent() {
  const { accessToken } = useAuth();
  const { analysis, loading, supabase, refresh } = useTalentTrailData();
  const [profileJson, setProfileJson] = useState("");
  const [saving, setSaving] = useState(false);
  const [rerunning, setRerunning] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (analysis?.editable_profile) {
      setProfileJson(JSON.stringify(analysis.editable_profile, null, 2));
    }
  }, [analysis?.editable_profile]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!analysis || !supabase) return;
    setMessage("");
    setSaving(true);
    try {
      const parsed = JSON.parse(profileJson) as Record<string, unknown>;
      const { error } = await supabase
        .from("resume_analyses")
        .update({ editable_profile: parsed, updated_at: new Date().toISOString() })
        .eq("id", analysis.id);
      if (error) throw error;
      setMessage("Corrected profile saved. Future agents will use this reviewed profile.");
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save profile.");
    } finally {
      setSaving(false);
    }
  }

  async function rerunAnalysis() {
    if (!accessToken) return;
    setRerunning(true);
    setMessage("Re-running career diagnosis from corrected profile...");
    const response = await fetch("/api/resume/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: profileJson
    });
    const payload = await response.json().catch(() => null);
    setRerunning(false);
    if (!response.ok) {
      setMessage(payload?.message ?? "Analysis failed.");
      return;
    }
    setMessage("Career diagnosis refreshed from your corrected profile.");
    await refresh();
  }

  if (loading) {
    return <main className="mx-auto max-w-7xl px-4 py-10 text-sm text-slate-600">Loading profile...</main>;
  }

  if (!analysis) {
    return (
      <main>
        <PageHeader
          eyebrow="Resume profile"
          title="Review your extracted resume profile"
          description="Upload a resume first so TalentTrail AI can extract profile data for review."
        />
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <EmptyState
            title="No extracted profile yet"
            description="Upload your resume to generate a structured profile with skills, education, projects, experience, certifications, achievements, and concerns."
            actionHref="/resume-upload"
            actionLabel="Upload resume"
          />
        </section>
      </main>
    );
  }

  const extracted = analysis.extracted_profile;

  return (
    <main>
      <PageHeader
        eyebrow="Resume profile"
        title="Review and correct extracted information"
        description="TalentTrail AI uses this corrected profile for career diagnosis, roadmap, missions, ResumeForge, InterviewArena, CareerTwin, and JobMatch."
      />

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <aside className="space-y-5">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
            <h2 className="text-xl font-bold text-slate-950">Extracted profile</h2>
            <div className="mt-4 space-y-4 text-sm text-slate-600">
              <p><span className="font-semibold text-slate-950">Name:</span> {extracted.name || "Not found"}</p>
              <p><span className="font-semibold text-slate-950">Email:</span> {extracted.email || "Not found"}</p>
              <p><span className="font-semibold text-slate-950">Headline:</span> {extracted.headline || "Not found"}</p>
              <div>
                <p className="font-semibold text-slate-950">Skills</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {extracted.skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              {extracted.resumeConcerns.length ? (
                <div className="rounded-lg bg-amber-50 p-4 text-amber-900">
                  <p className="font-semibold">Resume concerns</p>
                  <ul className="mt-2 list-disc space-y-1 pl-4">
                    {extracted.resumeConcerns.map((concern) => (
                      <li key={concern}>{concern}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </aside>

        <form onSubmit={save} className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Editable profile JSON</h2>
              <p className="mt-1 text-sm text-slate-500">
                Edit any extracted field before re-running analysis.
              </p>
            </div>
            <button
              type="button"
              onClick={rerunAnalysis}
              disabled={rerunning}
              className="focus-ring inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:text-trail-indigo disabled:opacity-70"
            >
              {rerunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
              Re-run analysis
            </button>
          </div>
          <textarea
            value={profileJson}
            onChange={(event) => setProfileJson(event.target.value)}
            className="focus-ring mt-5 min-h-[520px] w-full rounded-lg border border-slate-200 bg-slate-950 px-4 py-3 font-mono text-xs leading-6 text-slate-100"
          />
          {message ? <p className="mt-4 rounded-lg bg-blue-50 p-3 text-sm font-medium text-blue-800">{message}</p> : null}
          <button
            type="submit"
            disabled={saving}
            className="focus-ring mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-trail-indigo disabled:opacity-70"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save corrected profile
          </button>
        </form>
      </section>
    </main>
  );
}
