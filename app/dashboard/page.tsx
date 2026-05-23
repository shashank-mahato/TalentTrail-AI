"use client";

import Link from "next/link";
import {
  Bell,
  BriefcaseBusiness,
  FileText,
  GitCompareArrows,
  MessageSquareText,
  Route,
  Sparkles,
  Target,
  Trophy,
  UploadCloud
} from "lucide-react";
import { AgentTimeline } from "@/components/AgentTimeline";
import { AuthGate } from "@/components/AuthGate";
import { EmptyState } from "@/components/EmptyState";
import { MissionCard } from "@/components/MissionCard";
import { ProgressBar } from "@/components/ProgressBar";
import { RoleCard } from "@/components/RoleCard";
import { SkillGapCard } from "@/components/SkillGapCard";
import { StatCard } from "@/components/StatCard";
import { useTalentTrailData } from "@/lib/useTalentTrailData";

export default function DashboardPage() {
  return (
    <AuthGate>
      <DashboardContent />
    </AuthGate>
  );
}

function DashboardContent() {
  const { analysis, missions, agentRuns, stats, loading } = useTalentTrailData();

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-sm text-slate-600 shadow-soft">
          Loading your resume-powered dashboard...
        </div>
      </main>
    );
  }

  if (!analysis) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <EmptyState
          icon={<UploadCloud className="h-6 w-6" />}
          title="Upload your resume to start your personalized career trail"
          description="Your dashboard will show readiness score, RoleMatch recommendations, GapMap gaps, missions, proof reviews, interview practice, and job matches after TalentTrail AI parses your real resume."
          actionHref="/resume-upload"
          actionLabel="Upload resume"
        />
      </main>
    );
  }

  const careerResult = analysis.career_result;
  const topRole = careerResult.recommendedRoles[0];
  const roadmapDays = analysis.roadmap.roadmap.flatMap((week) => week.days);
  const completedPercent = stats.missionCount
    ? Math.round((stats.completedMissions / stats.missionCount) * 100)
    : 0;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-lg bg-slate-950 p-6 text-white shadow-glow sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-200">
              Realtime dashboard
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
              Your resume-powered career trail
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
              TalentTrail AI is using your uploaded resume and reviewed profile to update readiness,
              missions, proof, resume feedback, interviews, and job activity in real time.
            </p>
          </div>
          <Link
            href="/resume-profile"
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5"
          >
            Review profile
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Trophy className="h-5 w-5" />}
          label="Career Readiness"
          value={`${careerResult.readinessScore}%`}
          helper="Generated from your resume-derived profile."
          tone="blue"
        />
        <StatCard
          icon={<Target className="h-5 w-5" />}
          label="Best-fit Role"
          value={topRole?.role ?? "Not selected"}
          helper={topRole ? `${topRole.match}% role match from RoleMatch.` : "Run career diagnosis."}
          tone="violet"
        />
        <StatCard
          icon={<Route className="h-5 w-5" />}
          label="Mission Progress"
          value={`${completedPercent}%`}
          helper={`${stats.completedMissions} of ${stats.missionCount} missions completed or reviewed.`}
          tone="mint"
        />
        <StatCard
          icon={<Bell className="h-5 w-5" />}
          label="Unread Updates"
          value={`${stats.unreadNotifications}`}
          helper="Realtime notifications from mentor agents."
          tone="amber"
        />
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        {careerResult.firstMission ? (
          <MissionCard mission={careerResult.firstMission} />
        ) : (
          <EmptyState
            title="No mission generated yet"
            description="Generate a roadmap to create your first proof-based mission."
            actionHref="/roadmap"
            actionLabel="Generate roadmap"
          />
        )}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Career readiness</h2>
              <p className="mt-1 text-sm text-slate-500">Latest Career Diagnosis output</p>
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
              {careerResult.readinessScore}%
            </span>
          </div>
          <div className="mt-5">
            <ProgressBar value={careerResult.readinessScore} />
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-600">{careerResult.careerSummary}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {careerResult.nextSteps.map((step) => (
              <div key={step} className="rounded-lg bg-slate-50 p-4 text-sm font-medium text-slate-700">
                {step}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-slate-950">Skill Gaps</h2>
            <Link href="/roadmap" className="text-sm font-bold text-trail-indigo hover:text-slate-950">
              Open missions
            </Link>
          </div>
          <div className="grid gap-4">
            {careerResult.skillGaps.length ? (
              careerResult.skillGaps.map((gap) => <SkillGapCard key={gap.skill} gap={gap} />)
            ) : (
              <EmptyState
                title="No skill gaps yet"
                description="Run Career Diagnosis after reviewing your extracted profile."
              />
            )}
          </div>
        </div>
        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-slate-950">Recommended Roles</h2>
            <span className="text-sm font-semibold text-slate-500">RoleMatch</span>
          </div>
          <div className="grid gap-4">
            {careerResult.recommendedRoles.length ? (
              careerResult.recommendedRoles.map((role) => <RoleCard key={role.role} role={role} />)
            ) : (
              <EmptyState title="No role recommendations yet" description="Run RoleMatch from Agent Center." />
            )}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">30-day roadmap preview</h2>
              <p className="mt-1 text-sm text-slate-500">Generated from your resume and target role</p>
            </div>
            <Link
              href="/roadmap"
              className="focus-ring inline-flex items-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:text-trail-indigo"
            >
              View all
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {roadmapDays.slice(0, 3).map((day) => (
              <div key={day.day} className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-trail-indigo">
                  Day {day.day}
                </p>
                <h3 className="mt-2 font-bold text-slate-950">{day.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{day.proofRequired}</p>
              </div>
            ))}
          </div>
        </div>

        <AgentTimeline events={agentRuns.map((run) => `${run.agent_name}: ${run.status}`)} />
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-4">
        {[
          ["/proof-vault", UploadCloud, "ProofVault", `${stats.proofCount} proof items`],
          ["/resume", FileText, "ResumeForge", `${stats.resumeImprovementCount} improvements`],
          ["/interview", MessageSquareText, "InterviewArena", `${stats.interviewCount} sessions`],
          ["/jobs", BriefcaseBusiness, "JobMatch", `${stats.savedJobsCount} saved jobs`]
        ].map(([href, Icon, title, text]) => (
          <Link
            key={String(href)}
            href={String(href)}
            className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:border-trail-indigo/30"
          >
            <Icon className="h-7 w-7 text-trail-indigo" />
            <h2 className="mt-4 text-xl font-bold text-slate-950">{String(title)}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{String(text)}</p>
          </Link>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <Sparkles className="h-7 w-7 text-trail-indigo" />
          <h2 className="mt-4 text-xl font-bold text-slate-950">Proof-of-work loop</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Complete missions, upload proof, get AI review, then convert verified work into stronger
            resume bullets.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <GitCompareArrows className="h-7 w-7 text-trail-indigo" />
          <h2 className="mt-4 text-xl font-bold text-slate-950">CareerTwin status</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {analysis.career_twin?.length
              ? `${analysis.career_twin.length} paths compared from your resume evidence.`
              : "Run CareerTwin to compare realistic paths after reviewing your profile."}
          </p>
        </div>
      </section>
    </main>
  );
}
