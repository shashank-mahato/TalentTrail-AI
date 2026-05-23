"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  CheckCircle2,
  Map,
  Play,
  Sparkles,
  Target
} from "lucide-react";
import { loadDemoData } from "@/lib/storage";
import { ProgressBar } from "@/components/ProgressBar";

export function Hero() {
  const router = useRouter();

  function launchDemo() {
    loadDemoData();
    router.push("/dashboard");
  }

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-trail-grid soft-grid opacity-80" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.92fr] lg:px-8 lg:py-20">
        <div className="flex flex-col justify-center">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-trail-indigo shadow-sm">
            <Sparkles className="h-4 w-4" />
            Agentic career mentor for job-ready students
          </div>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            TalentTrail AI
          </h1>
          <p className="mt-5 text-xl font-semibold text-slate-800 sm:text-2xl">
            Your personalized trail from skills to career.
          </p>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Turn confusion into a proof-based career plan. TalentTrail AI analyzes a student profile,
            recommends realistic roles, maps skill gaps, creates a 30-day roadmap, upgrades resume
            bullets, and runs interview practice.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/onboarding"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-trail-indigo"
            >
              Start Your Trail
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={launchDemo}
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-trail-indigo/30 hover:text-trail-indigo"
            >
              <Play className="h-4 w-4" />
              Launch Demo
            </button>
            <Link
              href="/dashboard"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white/70 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-white hover:text-trail-indigo"
            >
              View Demo Dashboard
            </Link>
          </div>
        </div>

        <div className="glass-panel rounded-lg p-4 sm:p-5">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-trail-indigo">Career operating system</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-950">Riti&apos;s trail</h2>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">
                62% ready
              </span>
            </div>
            <div className="mt-5">
              <ProgressBar value={62} />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                {
                  icon: <Target className="h-4 w-4" />,
                  title: "Target role",
                  value: "Data Analyst Intern"
                },
                {
                  icon: <Map className="h-4 w-4" />,
                  title: "Roadmap",
                  value: "30 proof missions"
                },
                {
                  icon: <BrainCircuit className="h-4 w-4" />,
                  title: "Top gap",
                  value: "SQL joins"
                },
                {
                  icon: <BadgeCheck className="h-4 w-4" />,
                  title: "Next proof",
                  value: "Dashboard project"
                }
              ].map((item) => (
                <div key={item.title} className="rounded-lg bg-slate-50 p-4">
                  <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white text-trail-indigo shadow-sm">
                    {item.icon}
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-lg bg-slate-950 p-5 text-white">
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-100">
                <CheckCircle2 className="h-4 w-4" />
                Today&apos;s mission
              </div>
              <p className="mt-3 text-lg font-bold">Build your first hiring proof dashboard</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Pick a dataset, ask 4 business questions, and publish a one-page dashboard with a
                short insight summary.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
