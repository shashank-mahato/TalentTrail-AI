"use client";

import { Loader2, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { AuthGate } from "@/components/AuthGate";
import { CareerTwinCard } from "@/components/CareerTwinCard";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/lib/useAuth";
import { useTalentTrailData } from "@/lib/useTalentTrailData";

export default function CareerTwinPage() {
  return (
    <AuthGate>
      <CareerTwinContent />
    </AuthGate>
  );
}

function CareerTwinContent() {
  const { accessToken } = useAuth();
  const { analysis, loading, refresh } = useTalentTrailData();
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("");

  async function comparePaths() {
    if (!accessToken) return;
    setWorking(true);
    setMessage("");
    const response = await fetch("/api/ai/career-twin", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const payload = await response.json().catch(() => null);
    setWorking(false);
    if (!response.ok) {
      setMessage(payload?.message ?? "CareerTwin comparison failed.");
      return;
    }
    setMessage("CareerTwin compared realistic paths from your uploaded resume.");
    await refresh();
  }

  if (loading) return <main className="mx-auto max-w-7xl px-4 py-10 text-sm text-slate-600">Loading CareerTwin...</main>;

  if (!analysis) {
    return (
      <main>
        <PageHeader
          eyebrow="CareerTwin"
          title="Compare career paths from your resume"
          description="Upload your resume first so CareerTwin can compare realistic paths based on your current profile."
        />
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <EmptyState
            title="No resume analysis found"
            description="CareerTwin needs your resume-derived profile before comparing possible paths."
            actionHref="/resume-upload"
            actionLabel="Upload resume"
          />
        </section>
      </main>
    );
  }

  const paths = analysis.career_twin ?? [];

  return (
    <main>
      <PageHeader
        eyebrow="CareerTwin"
        title="Compare realistic career paths"
        description="CareerTwin evaluates readiness percentage, difficulty, missing skills, expected time, proof projects, risk, and best next step using your resume."
      />

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">Resume-based path comparison</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Re-run CareerTwin after editing your profile, completing missions, or uploading proof.
              </p>
              {message ? <p className="mt-3 rounded-lg bg-blue-50 p-3 text-sm font-medium text-blue-800">{message}</p> : null}
            </div>
            <button
              type="button"
              onClick={comparePaths}
              disabled={working}
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-trail-indigo disabled:opacity-70"
            >
              {working ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
              Compare paths
            </button>
          </div>
        </div>

        {paths.length ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {paths.map((path) => (
              <CareerTwinCard key={path.role} path={path} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No CareerTwin output yet"
            description="Run CareerTwin to compare multiple possible paths using your real resume profile."
          />
        )}
      </section>
    </main>
  );
}
