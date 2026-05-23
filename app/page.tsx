import Link from "next/link";
import {
  BarChart3,
  Bot,
  BrainCircuit,
  FileText,
  GitCompareArrows,
  GraduationCap,
  Map,
  MessageSquareText,
  Route,
  ShieldCheck,
  Sparkles,
  Target
} from "lucide-react";
import { Hero } from "@/components/Hero";
import { FeatureCard } from "@/components/FeatureCard";

const features = [
  {
    title: "TrailScan",
    description:
      "Analyzes the student profile, current skills, goals, confidence, interests, and available time.",
    icon: <BarChart3 className="h-6 w-6" />
  },
  {
    title: "RoleMatch",
    description:
      "Recommends best-fit internship and entry-level roles based on readiness and realistic next steps.",
    icon: <Target className="h-6 w-6" />
  },
  {
    title: "GapMap",
    description:
      "Identifies missing skills, priority levels, and proof projects that can validate progress.",
    icon: <BrainCircuit className="h-6 w-6" />
  },
  {
    title: "MissionTrail",
    description:
      "Creates daily proof-based tasks so students build visible portfolio evidence, not just notes.",
    icon: <Map className="h-6 w-6" />
  },
  {
    title: "ResumeForge",
    description:
      "Improves weak resume bullets into honest, role-specific bullets with tools, scope, and outcomes.",
    icon: <FileText className="h-6 w-6" />
  },
  {
    title: "InterviewArena",
    description:
      "Generates role-specific mock questions and evaluates student answers with direct feedback.",
    icon: <MessageSquareText className="h-6 w-6" />
  },
  {
    title: "CareerTwin",
    description:
      "Compares possible career paths and shows which one is realistic right now.",
    icon: <GitCompareArrows className="h-6 w-6" />
  }
];

const steps = [
  "Enter student profile and target role",
  "AI agents analyze readiness and gaps",
  "Get a 30-day proof-based roadmap",
  "Improve resume bullets and interview answers",
  "Compare career paths with CareerTwin"
];

export default function HomePage() {
  return (
    <main>
      <Hero />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-trail-indigo">
              The problem
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              Students do not lack content. They lack direction.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "They do not know which role fits them.",
              "They cannot prioritize missing skills.",
              "They build projects that do not prove job readiness.",
              "They struggle to turn effort into resume and interview proof."
            ].map((item) => (
              <div key={item} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
                <p className="text-sm leading-6 text-slate-600">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white/70 py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-trail-indigo">
              The solution
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              A personal career operating system for employability.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              TalentTrail AI guides students from confusion to a clear target role, skill gap map,
              daily missions, portfolio proof, resume improvements, and interview readiness.
            </p>
            <Link
              href="/onboarding"
              className="focus-ring mt-7 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-trail-indigo"
            >
              Generate your trail
              <Route className="h-4 w-4" />
            </Link>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-950 p-6 text-white shadow-glow">
            <div className="mb-6 flex items-center gap-3">
              <Bot className="h-7 w-7 text-blue-200" />
              <div>
                <h3 className="text-xl font-bold">Agentic workflow</h3>
                <p className="text-sm text-slate-300">Specialized agents, one career trail</p>
              </div>
            </div>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={step} className="flex items-center gap-4 rounded-lg bg-white/8 p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-950">
                    {index + 1}
                  </span>
                  <p className="text-sm font-medium text-slate-100">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-trail-indigo">
            Features
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            Seven mentor agents that make progress visible.
          </h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <section className="bg-slate-950 py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="lg:col-span-1">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-200">
              Social impact
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Built for students who need clarity, not noise.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:col-span-2">
            {[
              ["Tier-2/3 colleges", "More practical career guidance without expensive mentoring."],
              ["First internship seekers", "Role clarity and proof projects before applications."],
              ["Accountability", "Daily missions make progress measurable and visible."]
            ].map(([title, text]) => (
              <div key={title} className="rounded-lg bg-white p-5 text-slate-950">
                <GraduationCap className="h-6 w-6 text-trail-indigo" />
                <h3 className="mt-4 font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-trail-indigo">
              Demo preview
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              Follow Riti from confusion to an internship-ready trail.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              The built-in demo loads Riti Prabhakar, a second-year CSE Data Science student
              targeting a Data Analyst Intern role with one hour per day.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["62%", "Career readiness score"],
              ["86%", "Data Analyst Intern match"],
              ["30", "Proof missions"],
              ["3", "CareerTwin paths compared"]
            ].map(([value, label]) => (
              <div key={label} className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
                <p className="text-3xl font-bold text-slate-950">{value}</p>
                <p className="mt-2 text-sm font-medium text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-gradient-to-r from-trail-blue via-trail-indigo to-trail-violet p-8 text-white shadow-glow sm:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-blue-100">
                <ShieldCheck className="h-4 w-4" />
                Demo mode works without keys
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Ready to show the hackathon story?</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-50">
                Launch the demo dashboard, then explore roadmap, resume, interview, and CareerTwin.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5"
            >
              Open dashboard
              <Sparkles className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
