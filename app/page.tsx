import Link from "next/link";
import {
  BarChart3,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  FileText,
  FileUp,
  GitCompareArrows,
  GraduationCap,
  Map,
  MessageSquareText,
  ShieldCheck,
  Target,
  UploadCloud
} from "lucide-react";
import { Hero } from "@/components/Hero";
import { FeatureCard } from "@/components/FeatureCard";

const features = [
  {
    title: "TrailScan",
    description:
      "Parses the uploaded resume and extracts profile details, skills, education, projects, experience, certifications, and achievements.",
    icon: <BarChart3 className="h-6 w-6" />
  },
  {
    title: "RoleMatch",
    description:
      "Recommends realistic roles using the resume-derived profile and explains fit, missing skills, and next role strategy.",
    icon: <Target className="h-6 w-6" />
  },
  {
    title: "GapMap",
    description:
      "Compares the current profile against the target role and creates prioritized skill gaps with proof tasks.",
    icon: <BrainCircuit className="h-6 w-6" />
  },
  {
    title: "MissionTrail",
    description:
      "Builds a personalized 30-day roadmap where every mission produces recruiter-inspectable proof.",
    icon: <Map className="h-6 w-6" />
  },
  {
    title: "ProofVault",
    description:
      "Stores files, links, screenshots, GitHub, portfolio, Kaggle, Drive, and LinkedIn proof for mission review.",
    icon: <UploadCloud className="h-6 w-6" />
  },
  {
    title: "ResumeForge",
    description:
      "Improves actual resume bullets using uploaded resume and proof data without inventing fake metrics.",
    icon: <FileText className="h-6 w-6" />
  },
  {
    title: "InterviewArena",
    description:
      "Generates interview questions and evaluates answers from the user's actual resume, projects, gaps, and target role.",
    icon: <MessageSquareText className="h-6 w-6" />
  },
  {
    title: "CareerTwin",
    description:
      "Compares possible career paths based on resume evidence, readiness, difficulty, missing skills, and time needed.",
    icon: <GitCompareArrows className="h-6 w-6" />
  },
  {
    title: "JobMatch",
    description:
      "Searches real internships and jobs through Adzuna using target role and extracted resume skills.",
    icon: <BriefcaseBusiness className="h-6 w-6" />
  }
];

export default function HomePage() {
  return (
    <main>
      <Hero />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-trail-indigo">
              Resume-first workflow
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              TalentTrail AI now starts with the user's real resume.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "User signs up or logs in with Supabase Auth.",
              "User uploads a PDF, DOCX, TXT resume or pastes resume text.",
              "AI extracts a structured profile for review and correction.",
              "Every score, roadmap, mission, interview, and job match is generated from real user data."
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
              Agentic workflow
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              One resume becomes a living career operating system.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              TalentTrail AI connects resume intelligence, career diagnosis, missions, proof review,
              resume improvement, interview preparation, and job matching into a single workflow.
            </p>
            <Link
              href="/resume-upload"
              className="focus-ring mt-7 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-trail-indigo"
            >
              Upload your resume
              <FileUp className="h-4 w-4" />
            </Link>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-950 p-6 text-white shadow-glow">
            <div className="mb-6 flex items-center gap-3">
              <Bot className="h-7 w-7 text-blue-200" />
              <div>
                <h3 className="text-xl font-bold">Realtime mentor agents</h3>
                <p className="text-sm text-slate-300">Stored in Supabase agent runs</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                "TrailScan parses and structures resume evidence",
                "RoleMatch and GapMap diagnose role readiness",
                "MissionTrail creates proof-based missions",
                "ProofReview validates submitted work",
                "JobMatch searches live Adzuna opportunities"
              ].map((step, index) => (
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
            Built for a real resume-powered career trail.
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
              Career direction powered by evidence, not guesswork.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:col-span-2">
            {[
              ["Private profile", "Each student sees only their own resume, missions, proof, and jobs."],
              ["Proof of skill", "Missions focus on outputs that can be shown to recruiters."],
              ["Real opportunities", "JobMatch uses Adzuna instead of fabricated job cards."]
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
        <div className="rounded-lg bg-gradient-to-r from-trail-blue via-trail-indigo to-trail-violet p-8 text-white shadow-glow sm:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-blue-100">
                <ShieldCheck className="h-4 w-4" />
                Requires real resume data
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Start with signup and resume upload.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-50">
                The dashboard stays empty until TalentTrail AI has authenticated user data and an
                uploaded resume to analyze.
              </p>
            </div>
            <Link
              href="/auth"
              className="focus-ring inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5"
            >
              Create account
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
