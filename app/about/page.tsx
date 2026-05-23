import { Bot, GraduationCap, Lightbulb, Rocket, ShieldCheck, Target } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

const sections = [
  {
    title: "Project overview",
    text:
      "TalentTrail AI is an agentic career mentor for college students who want internships or entry-level roles but need a realistic plan from skills to career proof.",
    icon: <Rocket className="h-6 w-6" />
  },
  {
    title: "Problem statement",
    text:
      "Many students from tier-2 and tier-3 colleges have access to content but do not know which role fits them, what to learn first, or how to prove readiness.",
    icon: <Target className="h-6 w-6" />
  },
  {
    title: "Why it matters",
    text:
      "The app helps students convert scattered effort into direction, portfolio proof, resume clarity, and interview confidence.",
    icon: <Lightbulb className="h-6 w-6" />
  },
  {
    title: "Target users",
    text:
      "College students, engineering students, data science students, internship seekers, and students with basic skills but no roadmap.",
    icon: <GraduationCap className="h-6 w-6" />
  },
  {
    title: "Social impact",
    text:
      "TalentTrail AI can make structured mentorship more accessible for students who cannot rely on expensive coaching or strong campus placement support.",
    icon: <ShieldCheck className="h-6 w-6" />
  },
  {
    title: "Agentic AI explanation",
    text:
      "Specialized agents handle profile analysis, role matching, gap mapping, daily missions, resume feedback, interview practice, and career path comparison.",
    icon: <Bot className="h-6 w-6" />
  }
];

const roadmap = [
  "Student accounts and saved long-term progress",
  "Supabase persistence with row-level security policies",
  "CareerTwin powered by live AI comparison",
  "Project proof uploads and recruiter-facing portfolio pages",
  "Job description matching and application tracker",
  "Mentor dashboard for colleges and placement cells"
];

export default function AboutPage() {
  return (
    <main>
      <PageHeader
        eyebrow="About"
        title="TalentTrail AI: Agentic Career Mentor for Job-Ready Students"
        description="A hackathon MVP designed to help students move from confusion to a personalized, proof-based career trail."
      />

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <article key={section.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-950 text-white">
                {section.icon}
              </div>
              <h2 className="text-xl font-bold text-slate-950">{section.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{section.text}</p>
            </article>
          ))}
        </div>

        <section className="mt-10 rounded-lg bg-slate-950 p-8 text-white shadow-glow">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-200">
            Future roadmap
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">Where the product can go next</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {roadmap.map((item) => (
              <div key={item} className="rounded-lg bg-white/10 p-4 text-sm font-medium text-slate-100">
                {item}
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
