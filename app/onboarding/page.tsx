import Link from "next/link";
import { FileUp, ShieldCheck, UserRoundCheck } from "lucide-react";
import { AuthGate } from "@/components/AuthGate";
import { PageHeader } from "@/components/PageHeader";

export default function OnboardingPage() {
  return (
    <AuthGate>
      <main>
        <PageHeader
          eyebrow="Onboarding"
          title="Start with your real resume"
          description="TalentTrail AI no longer creates a trail from manually invented profile data. Upload your resume, review the extracted profile, then let the agents generate your career trail."
        />
        <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-16 sm:px-6 lg:grid-cols-3 lg:px-8">
          {[
            {
              title: "Upload",
              text: "Add a PDF, DOCX, TXT resume or paste resume text manually.",
              icon: <FileUp className="h-6 w-6" />
            },
            {
              title: "Review",
              text: "Correct extracted skills, education, projects, achievements, and target role.",
              icon: <UserRoundCheck className="h-6 w-6" />
            },
            {
              title: "Generate",
              text: "Run career diagnosis, missions, proof review, ResumeForge, interviews, and jobs.",
              icon: <ShieldCheck className="h-6 w-6" />
            }
          ].map((item) => (
            <article key={item.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-950 text-white">
                {item.icon}
              </div>
              <h2 className="text-xl font-bold text-slate-950">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
            </article>
          ))}
          <div className="lg:col-span-3">
            <Link
              href="/resume-upload"
              className="focus-ring inline-flex rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-trail-indigo"
            >
              Upload resume
            </Link>
          </div>
        </section>
      </main>
    </AuthGate>
  );
}
