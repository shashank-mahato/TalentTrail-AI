"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp, Loader2, UploadCloud } from "lucide-react";
import { AuthGate } from "@/components/AuthGate";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/lib/useAuth";

export default function ResumeUploadPage() {
  return (
    <AuthGate>
      <ResumeUploadContent />
    </AuthGate>
  );
}

function ResumeUploadContent() {
  const router = useRouter();
  const { accessToken } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [timePerDay, setTimePerDay] = useState("");
  const [interests, setInterests] = useState("");
  const [learningStyle, setLearningStyle] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("Uploading and parsing resume...");

    if (!accessToken) {
      setError("Log in again before uploading your resume.");
      return;
    }

    if (!file && !resumeText.trim()) {
      setError("Upload a resume file or paste your resume text.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    if (file) formData.append("resume", file);
    if (resumeText.trim()) formData.append("resumeText", resumeText.trim());
    formData.append("targetRole", targetRole);
    formData.append("timePerDay", timePerDay);
    formData.append("interests", interests);
    formData.append("learningStyle", learningStyle);

    const response = await fetch("/api/resume/parse", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      body: formData
    });

    const payload = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      setStatus("");
      setError(payload?.message ?? "Resume parsing failed. Check file type and configuration.");
      return;
    }

    setStatus("Resume analysis complete. Redirecting to your extracted profile...");
    router.push("/resume-profile");
  }

  return (
    <main>
      <PageHeader
        eyebrow="Resume upload"
        title="Upload your resume to start your personalized career trail"
        description="TalentTrail AI accepts PDF, DOCX, TXT, or pasted resume text. The file is stored privately in Supabase Storage and parsed server-side."
      />

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <form onSubmit={submit} className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <FileUp className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-950">Resume source</h2>
              <p className="text-sm text-slate-500">Use a real resume. No generated profile data is shown.</p>
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Resume file</span>
            <input
              type="file"
              accept=".pdf,.docx,.txt,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="focus-ring mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm"
            />
          </label>

          <label className="mt-5 block">
            <span className="text-sm font-semibold text-slate-700">Or paste resume text</span>
            <textarea
              value={resumeText}
              onChange={(event) => setResumeText(event.target.value)}
              className="focus-ring mt-2 min-h-40 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm"
            />
          </label>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Target role</span>
              <input
                value={targetRole}
                onChange={(event) => setTargetRole(event.target.value)}
                className="focus-ring mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Time available per day</span>
              <input
                value={timePerDay}
                onChange={(event) => setTimePerDay(event.target.value)}
                className="focus-ring mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm"
                required
              />
            </label>
          </div>

          <label className="mt-5 block">
            <span className="text-sm font-semibold text-slate-700">Career interests</span>
            <textarea
              value={interests}
              onChange={(event) => setInterests(event.target.value)}
              className="focus-ring mt-2 min-h-24 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm"
            />
          </label>

          <label className="mt-5 block">
            <span className="text-sm font-semibold text-slate-700">Preferred learning style</span>
            <input
              value={learningStyle}
              onChange={(event) => setLearningStyle(event.target.value)}
              className="focus-ring mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm"
            />
          </label>

          {status ? <p className="mt-4 rounded-lg bg-blue-50 p-3 text-sm font-medium text-blue-800">{status}</p> : null}
          {error ? <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm font-medium text-rose-800">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-trail-indigo disabled:opacity-70"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
            Parse Resume and Generate Trail
          </button>
        </form>

        <aside className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold text-slate-950">What happens next</h2>
          <div className="mt-5 space-y-3">
            {[
              "Resume is uploaded to the private resumes bucket.",
              "Server extracts raw text from PDF, DOCX, TXT, or pasted text.",
              "Gemini extracts a structured profile and evidence-based career diagnosis.",
              "Supabase stores resume document metadata, analysis, roadmap, missions, and agent runs.",
              "Dashboard updates through Supabase Realtime."
            ].map((step) => (
              <div key={step} className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                {step}
              </div>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
