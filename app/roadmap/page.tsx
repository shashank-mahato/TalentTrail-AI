"use client";

import { useEffect, useState } from "react";
import { Loader2, RefreshCcw } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { RoadmapCard } from "@/components/RoadmapCard";
import { demoProfile, mockRoadmap } from "@/lib/mockData";
import { getProfile, getRoadmap, saveRoadmap } from "@/lib/storage";
import type { RoadmapResult, StudentProfile } from "@/lib/types";

export default function RoadmapPage() {
  const [profile, setProfile] = useState<StudentProfile>(demoProfile);
  const [roadmap, setRoadmap] = useState<RoadmapResult>(mockRoadmap);
  const [loading, setLoading] = useState(false);
  const [fallbackUsed, setFallbackUsed] = useState(false);

  useEffect(() => {
    setProfile(getProfile() ?? demoProfile);
    setRoadmap(getRoadmap() ?? mockRoadmap);
  }, []);

  async function generateFreshRoadmap() {
    setLoading(true);
    setFallbackUsed(false);

    try {
      const response = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole: profile.targetRole,
          currentSkills: profile.currentSkills,
          timePerDay: profile.timePerDay
        })
      });

      if (!response.ok) {
        throw new Error("Roadmap API failed");
      }

      const generated = (await response.json()) as RoadmapResult;
      setRoadmap(generated);
      saveRoadmap(generated);
    } catch {
      setRoadmap(mockRoadmap);
      saveRoadmap(mockRoadmap);
      setFallbackUsed(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <PageHeader
        eyebrow="MissionTrail"
        title="30-day proof-based roadmap"
        description="A focused roadmap that turns daily learning into visible project evidence for your target internship role."
      />

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Target role</p>
              <h2 className="mt-1 text-3xl font-bold text-slate-950">{roadmap.targetRole}</h2>
              <p className="mt-2 text-sm text-slate-600">
                Built for {profile.timePerDay} using skills: {profile.currentSkills}
              </p>
              {fallbackUsed ? (
                <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm font-medium text-amber-800">
                  API fallback used. Demo roadmap remains available.
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={generateFreshRoadmap}
              disabled={loading}
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-trail-indigo disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
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
                {week.days.map((day) => (
                  <RoadmapCard key={day.day} day={day} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
