"use client";

import { Loader2, RefreshCcw, UploadCloud } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { AuthGate } from "@/components/AuthGate";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { RoadmapCard } from "@/components/RoadmapCard";
import { useAuth } from "@/lib/useAuth";
import { useTalentTrailData } from "@/lib/useTalentTrailData";

export default function RoadmapPage() {
  return (
    <AuthGate>
      <RoadmapContent />
    </AuthGate>
  );
}

function RoadmapContent() {
  const { accessToken } = useAuth();
  const { analysis, missionRows, loading, supabase, refresh } = useTalentTrailData();
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");

  async function generateRoadmap() {
    if (!accessToken) return;
    setGenerating(true);
    setMessage("");
    const response = await fetch("/api/ai/generate-roadmap", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const payload = await response.json().catch(() => null);
    setGenerating(false);
    if (!response.ok) {
      setMessage(payload?.message ?? "Roadmap generation failed.");
      return;
    }
    setMessage("MissionTrail generated a fresh roadmap from your resume profile.");
    await refresh();
  }

  async function updateStatus(id: string, status: string) {
    if (!supabase) return;
    await supabase.from("missions").update({ status }).eq("id", id);
    await refresh();
  }

  if (loading) return <main className="mx-auto max-w-7xl px-4 py-10 text-sm text-slate-600">Loading roadmap...</main>;

  if (!analysis) {
    return (
      <main>
        <PageHeader
          eyebrow="MissionTrail"
          title="30-day roadmap"
          description="Upload your resume before generating a personalized roadmap."
        />
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <EmptyState
            icon={<UploadCloud className="h-6 w-6" />}
            title="No resume analysis found"
            description="MissionTrail needs your parsed resume and reviewed profile before it can create proof-based missions."
            actionHref="/resume-upload"
            actionLabel="Upload resume"
          />
        </section>
      </main>
    );
  }

  const roadmap = analysis.roadmap;
  const missionByDay = new Map(missionRows.map((mission) => [Number(mission.day_number), mission]));

  return (
    <main>
      <PageHeader
        eyebrow="MissionTrail"
        title="30-day proof-based roadmap"
        description="Generated from your uploaded resume, target role, skills, gaps, and available time. Every day produces proof."
      />

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Target role</p>
              <h2 className="mt-1 text-3xl font-bold text-slate-950">{roadmap.targetRole}</h2>
              <p className="mt-2 text-sm text-slate-600">
                {missionRows.length || roadmap.roadmap.flatMap((week) => week.days).length} missions tracked.
              </p>
              {message ? <p className="mt-3 rounded-lg bg-blue-50 p-3 text-sm font-medium text-blue-800">{message}</p> : null}
            </div>
            <button
              type="button"
              onClick={generateRoadmap}
              disabled={generating}
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-trail-indigo disabled:opacity-70"
            >
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
              Generate Fresh Roadmap
            </button>
          </div>
        </div>

        <div className="space-y-10">
          {roadmap.roadmap.map((week) => (
            <section key={week.week}>
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-trail-indigo">
                    Week {week.week}
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-950">{week.theme}</h2>
                </div>
                <p className="text-sm font-medium text-slate-500">{week.days.length} daily missions</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {week.days.map((day) => {
                  const mission = missionByDay.get(day.day);
                  return (
                    <div key={day.day} className="space-y-3">
                      <RoadmapCard day={day} />
                      {mission ? (
                        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
                          <p className="text-sm font-semibold text-slate-700">Status: {mission.status}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {["in_progress", "completed"].map((status) => (
                              <button
                                key={status}
                                type="button"
                                onClick={() => updateStatus(mission.id, status)}
                                className="focus-ring rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:text-trail-indigo"
                              >
                                Mark {status.replace("_", " ")}
                              </button>
                            ))}
                            <Link
                              href={`/proof-vault?mission=${mission.id}`}
                              className="focus-ring rounded-lg bg-slate-950 px-3 py-2 text-xs font-bold text-white hover:bg-trail-indigo"
                            >
                              Upload proof
                            </Link>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
