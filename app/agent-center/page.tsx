"use client";

import { Bot } from "lucide-react";
import { AuthGate } from "@/components/AuthGate";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { useTalentTrailData } from "@/lib/useTalentTrailData";

export default function AgentCenterPage() {
  return (
    <AuthGate>
      <AgentCenterContent />
    </AuthGate>
  );
}

function AgentCenterContent() {
  const { agentRuns, loading } = useTalentTrailData();

  if (loading) return <main className="mx-auto max-w-7xl px-4 py-10 text-sm text-slate-600">Loading agents...</main>;

  return (
    <main>
      <PageHeader
        eyebrow="Agent Center"
        title="Monitor TalentTrail AI agents"
        description="Track TrailScan, RoleMatch, GapMap, MissionTrail, ProofReview, ResumeForge, InterviewArena, CareerTwin, JobMatch, and Notification agent activity."
      />
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {agentRuns.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {agentRuns.map((run) => (
              <article key={run.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-950">{run.agent_name}</h2>
                      <p className="text-sm text-slate-500">{new Date(run.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                    {run.status}
                  </span>
                </div>
                {run.error_message ? (
                  <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-800">{run.error_message}</p>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No agent runs yet"
            description="Upload a resume or run an AI workflow to populate the Agent Center."
            actionHref="/resume-upload"
            actionLabel="Upload resume"
          />
        )}
      </section>
    </main>
  );
}
