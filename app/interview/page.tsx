"use client";

import { FormEvent, useState } from "react";
import { BrainCircuit, Loader2, MessageSquareText, Sparkles } from "lucide-react";
import { AuthGate } from "@/components/AuthGate";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { ProgressBar } from "@/components/ProgressBar";
import { useAuth } from "@/lib/useAuth";
import { useTalentTrailData } from "@/lib/useTalentTrailData";
import type { InterviewFeedback, InterviewQuestion } from "@/lib/types";

export default function InterviewPage() {
  return (
    <AuthGate>
      <InterviewContent />
    </AuthGate>
  );
}

function InterviewContent() {
  const { accessToken } = useAuth();
  const { analysis, loading, refresh } = useTalentTrailData();
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("");

  async function generateQuestions() {
    if (!accessToken) return;
    setWorking(true);
    setMessage("");
    const response = await fetch("/api/ai/interview/questions", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const payload = await response.json().catch(() => null);
    setWorking(false);
    if (!response.ok) {
      setMessage(payload?.message ?? "Could not generate interview questions.");
      return;
    }
    setQuestions(payload.questions ?? []);
    setSelectedQuestion(payload.questions?.[0]?.question ?? "");
    await refresh();
  }

  async function evaluate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken) return;
    setWorking(true);
    setMessage("");
    const response = await fetch("/api/ai/interview/evaluate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({ question: selectedQuestion, answer })
    });
    const payload = await response.json().catch(() => null);
    setWorking(false);
    if (!response.ok) {
      setMessage(payload?.message ?? "Interview evaluation failed.");
      return;
    }
    setFeedback(payload as InterviewFeedback);
    await refresh();
  }

  if (loading) return <main className="mx-auto max-w-7xl px-4 py-10 text-sm text-slate-600">Loading InterviewArena...</main>;

  if (!analysis) {
    return (
      <main>
        <PageHeader
          eyebrow="InterviewArena"
          title="Practice from your actual resume"
          description="Upload a resume first so InterviewArena can generate questions from your projects, skills, gaps, and target role."
        />
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <EmptyState
            title="No resume profile found"
            description="InterviewArena needs your uploaded resume before generating personalized questions."
            actionHref="/resume-upload"
            actionLabel="Upload resume"
          />
        </section>
      </main>
    );
  }

  const allQuestions = questions.length ? questions : analysis.interview_questions ?? [];

  return (
    <main>
      <PageHeader
        eyebrow="InterviewArena"
        title="Mock interviews based on your resume"
        description="Generate resume-based, technical, project, HR, scenario, and role-specific questions, then evaluate your answer with AI."
      />

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <form onSubmit={evaluate} className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
              <MessageSquareText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-950">Interview practice</h2>
              <p className="text-sm text-slate-500">Questions are generated from your uploaded resume.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={generateQuestions}
            disabled={working}
            className="focus-ring mb-5 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:text-trail-indigo disabled:opacity-70"
          >
            {working ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Generate questions
          </button>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Question</span>
            <select
              value={selectedQuestion}
              onChange={(event) => setSelectedQuestion(event.target.value)}
              className="focus-ring mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm"
              required
            >
              <option value="">Select a question</option>
              {allQuestions.map((question) => (
                <option key={question.question} value={question.question}>
                  {question.question}
                </option>
              ))}
            </select>
          </label>

          <label className="mt-5 block">
            <span className="text-sm font-semibold text-slate-700">Your answer</span>
            <textarea
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              className="focus-ring mt-2 min-h-44 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm"
              required
            />
          </label>

          {message ? <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm font-medium text-rose-800">{message}</p> : null}

          <button
            type="submit"
            disabled={working}
            className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-trail-indigo disabled:opacity-70"
          >
            {working ? <Loader2 className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-4 w-4" />}
            Evaluate Answer
          </button>
        </form>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          {feedback ? (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-trail-indigo">
                    Evaluation
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-950">Answer score</h2>
                </div>
                <span className="rounded-lg bg-blue-50 px-4 py-3 text-lg font-bold text-blue-700">
                  {feedback.score}/10
                </span>
              </div>
              <div className="mt-5">
                <ProgressBar value={feedback.score * 10} />
              </div>
              <div className="mt-6 grid gap-4">
                <div className="rounded-lg bg-slate-50 p-5">
                  <h3 className="font-bold text-slate-950">Feedback</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{feedback.feedback}</p>
                </div>
                <div className="rounded-lg bg-violet-50 p-5">
                  <h3 className="font-bold text-violet-900">Improvement tip</h3>
                  <p className="mt-2 text-sm leading-6 text-violet-900">{feedback.improvementTip}</p>
                </div>
                <div className="rounded-lg bg-emerald-50 p-5">
                  <h3 className="font-bold text-emerald-900">Stronger answer</h3>
                  <p className="mt-2 text-sm leading-6 text-emerald-900">{feedback.sampleAnswer}</p>
                </div>
              </div>
            </>
          ) : (
            <EmptyState
              title="No interview feedback yet"
              description="Generate questions from your resume, choose one, answer it, and InterviewArena will evaluate your response."
            />
          )}
        </section>
      </section>
    </main>
  );
}
