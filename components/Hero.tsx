import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  FileUp,
  GitCompareArrows,
  Map,
  ShieldCheck,
  Sparkles,
  Target
} from "lucide-react";
import { ProgressBar } from "@/components/ProgressBar";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-trail-grid soft-grid opacity-80" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.92fr] lg:px-8 lg:py-20">
        <div className="flex flex-col justify-center">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-trail-indigo shadow-sm">
            <Sparkles className="h-4 w-4" />
            Resume-powered agentic career mentor
          </div>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            TalentTrail AI
          </h1>
          <p className="mt-5 text-xl font-semibold text-slate-800 sm:text-2xl">
            Your personalized trail from skills to career.
          </p>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Upload your real resume to start a private career trail. TalentTrail AI extracts your
            profile, diagnoses readiness, recommends roles, maps gaps, creates missions, reviews
            proof, improves resume bullets, prepares interviews, and finds real internships.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/auth"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-trail-indigo"
            >
              Sign Up / Log In
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/resume-upload"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-trail-indigo/30 hover:text-trail-indigo"
            >
              <FileUp className="h-4 w-4" />
              Upload Resume
            </Link>
          </div>
        </div>

        <div className="glass-panel rounded-lg p-4 sm:p-5">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-trail-indigo">Live workflow</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-950">Resume to career trail</h2>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
                Real data
              </span>
            </div>
            <div className="mt-5">
              <ProgressBar value={18} />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                {
                  icon: <FileUp className="h-4 w-4" />,
                  title: "Step 1",
                  value: "Upload resume"
                },
                {
                  icon: <BrainCircuit className="h-4 w-4" />,
                  title: "Step 2",
                  value: "AI diagnosis"
                },
                {
                  icon: <Map className="h-4 w-4" />,
                  title: "Step 3",
                  value: "Mission roadmap"
                },
                {
                  icon: <BadgeCheck className="h-4 w-4" />,
                  title: "Step 4",
                  value: "Proof review"
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
                <ShieldCheck className="h-4 w-4" />
                No fabricated results
              </div>
              <p className="mt-3 text-lg font-bold">Your trail starts only after real resume analysis</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Empty states guide you to upload, review, generate, and prove. The app does not invent
                scores, missions, jobs, or career profiles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
