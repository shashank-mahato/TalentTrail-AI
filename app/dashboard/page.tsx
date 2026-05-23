"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  FileText,
  GitCompareArrows,
  MessageSquareText,
  Route,
  Sparkles,
  Target,
  Trophy
} from "lucide-react";
import { AgentTimeline } from "@/components/AgentTimeline";
import { MissionCard } from "@/components/MissionCard";
import { ProgressBar } from "@/components/ProgressBar";
import { RoleCard } from "@/components/RoleCard";
import { SkillGapCard } from "@/components/SkillGapCard";
import { StatCard } from "@/components/StatCard";
import { CareerTwinCard } from "@/components/CareerTwinCard";
import { careerTwinPaths, demoProfile, mockCareerResult, mockRoadmap } from "@/lib/mockData";
import { getCareerResult, getProfile, loadDemoData } from "@/lib/storage";
import type { CareerResult, StudentProfile } from "@/lib/types";

export default function DashboardPage() {
  const [profile, setProfile] = useState<StudentProfile>(demoProfile);
  const [careerResult, setCareerResult] = useState<CareerResult>(mockCareerResult);

  useEffect(() => {
    const storedProfile = getProfile();
    const storedResult = getCareerResult();
    if (storedProfile && storedResult) {
      setProfile(storedProfile);
      setCareerResult(storedResult);
      return;
    }

    loadDemoData();
    setProfile(demoProfile);
    setCareerResult(mockCareerResult);
  }, []);

  const topRole = careerResult.recommendedRoles[0];
  const averageGapProgress = useMemo(() => {
    if (!careerResult.skillGaps.length) return 0;
    const total = careerResult.skillGaps.reduce((sum, gap) => sum + gap.currentLevel, 0);
    return Math.round(total / careerResult.skillGaps.length);
  }, [careerResult.skillGaps]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-lg bg-slate-950 p-6 text-white shadow-glow sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-200">
              Student dashboard
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
              Welcome back, {profile.name}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
              Targeting {profile.targetRole} with {profile.timePerDay}. Your agents have turned your
              current skills into a clear trail of proof, practice, and portfolio work.
            </p>
          </div>
          <Link
            href="/roadmap"
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5"
          >
            Open roadmap
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Trophy className="h-5 w-5" />}
          label="Career Readiness"
          value={`${careerResult.readinessScore}%`}
          helper="Balanced score across skills, proof, resume, and confidence."
          tone="blue"
        />
        <StatCard
          icon={<Target className="h-5 w-5" />}
          label="Top Recommended Role"
          value={topRole?.role ?? profile.targetRole}
          helper={`${topRole?.match ?? 86}% role match from RoleMatch.`}
          tone="violet"
        />
        <StatCard
          icon={<Route className="h-5 w-5" />}
          label="Skill Gap Progress"
          value={`${averageGapProgress}%`}
          helper="Average current level across priority gaps."
          tone="mint"
        />
        <StatCard
          icon={<CalendarDays className="h-5 w-5" />}
          label="Weekly Trail"
          value="Week 1"
          helper="Foundation, SQL, Excel, Python, and portfolio packaging."
          tone="amber"
        />
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <MissionCard mission={careerResult.firstMission} />
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Career readiness</h2>
              <p className="mt-1 text-sm text-slate-500">What the agents see right now</p>
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
            {careerResult.nextSteps.slice(0, 4).map((step) => (
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
              Turn gaps into missions
            </Link>
          </div>
          <div className="grid gap-4">
            {careerResult.skillGaps.slice(0, 3).map((gap) => (
              <SkillGapCard key={gap.skill} gap={gap} />
            ))}
          </div>
        </div>
        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-slate-950">Recommended Roles</h2>
            <span className="text-sm font-semibold text-slate-500">RoleMatch</span>
          </div>
          <div className="grid gap-4">
            {careerResult.recommendedRoles.map((role) => (
              <RoleCard key={role.role} role={role} />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">30-day roadmap preview</h2>
              <p className="mt-1 text-sm text-slate-500">First week missions from MissionTrail</p>
            </div>
            <Link
              href="/roadmap"
              className="focus-ring inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:text-trail-indigo"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {mockRoadmap.roadmap[0].days.slice(0, 3).map((day) => (
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

        <AgentTimeline />
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        <Link
          href="/resume"
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:border-trail-indigo/30"
        >
          <FileText className="h-7 w-7 text-trail-indigo" />
          <h2 className="mt-4 text-xl font-bold text-slate-950">ResumeForge</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Upgrade weak bullets into honest proof-first resume statements.
          </p>
        </Link>
        <Link
          href="/interview"
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:border-trail-indigo/30"
        >
          <MessageSquareText className="h-7 w-7 text-trail-indigo" />
          <h2 className="mt-4 text-xl font-bold text-slate-950">InterviewArena</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Practice role-specific questions and improve answer structure.
          </p>
        </Link>
        <Link
          href="/career-twin"
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:border-trail-indigo/30"
        >
          <GitCompareArrows className="h-7 w-7 text-trail-indigo" />
          <h2 className="mt-4 text-xl font-bold text-slate-950">CareerTwin Preview</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Compare analytics, frontend, and AI/ML internship paths.
          </p>
        </Link>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <Sparkles className="h-7 w-7 text-trail-indigo" />
          <h2 className="mt-4 text-xl font-bold text-slate-950">Proof-of-skill preview</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Your first portfolio proof should be a dashboard project with a public screenshot, dataset
            link, and concise insight summary.
          </p>
          <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <BadgeCheck className="h-4 w-4" />
            Recruiter-inspectable proof
          </div>
        </div>
        <CareerTwinCard path={careerTwinPaths[0]} />
      </section>
    </main>
  );
}
