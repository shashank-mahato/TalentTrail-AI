"use client";

import { FormEvent, useEffect, useState } from "react";
import { BrainCircuit, Loader2, MessageSquareText, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ProgressBar } from "@/components/ProgressBar";
import {
  demoProfile,
  mockInterviewFeedback,
  mockInterviewQuestion
} from "@/lib/mockData";
import { getProfile } from "@/lib/storage";
import type { InterviewFeedback } from "@/lib/types";

export default function InterviewPage() {
  const [targetRole, setTargetRole] = useState("Data Analyst Intern");
  const [question, setQuestion] = useState(mockInterviewQuestion);
  const [answer, setAnswer] = useState(
    "I would compare last month with previous months, check region and product performance, then identify the main reason for the drop."
  );
  const [feedback, setFeedback] = useState<InterviewFeedback>(mockInterviewFeedback);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [fallbackUsed, setFallbackUsed] = useState(false);

  useEffect(() => {
    const profile = getProfile() ?? demoProfile;
    setTargetRole(profile.targetRole);
  }, []);

  async function generateQuestion() {
    setLoadingQuestion(true);
    setFallbackUsed(false);

    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole, mode: "generate" })
      });

      if (!response.ok) {
        throw new Error("Interview question API failed");
      }

      const data = (await response.json()) as { question: string };
      setQuestion(data.question);
    } catch {
      setQuestion(mockInterviewQuestion);
      setFallbackUsed(true);
    } finally {
      setLoadingQuestion(false);
    }
  }

  async function evaluateAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoadingFeedback(true);
    setFallbackUsed(false);

    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole, question, answer, mode: "evaluate" })
      });

      if (!response.ok) {
        throw new Error("Interview feedback API failed");
      }

      setFeedback((await response.json()) as InterviewFeedback);
    } catch {
      setFeedback(mockInterviewFeedback);
      setFallbackUsed(true);
    } finally {
      setLoadingFeedback(false);
    }
  }

  return (
    <main>
      <PageHeader
        eyebrow="InterviewArena"
        title="Practice role-specific interview answers"
        description="Generate a question, write your answer, and get a score, feedback, improvement tip, sample answer, and confidence advice."
      />

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <form onSubmit={evaluateAnswer} className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
              <MessageSquareText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-950">Mock interview</h2>
              <p className="text-sm text-slate-500">Practice like a real internship screen.</p>
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Target role</span>
            <input
              value={targetRole}
              onChange={(event) => setTargetRole(event.target.value)}
              className="focus-ring mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
              required
            />
          </label>

          <div className="mt-5 rounded-lg bg-slate-50 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">Interview question</p>
                <p className="mt-2 text-base font-semibold leading-7 text-slate-950">{question}</p>
              </div>
              <button
                type="button"
                onClick={generateQuestion}
                disabled={loadingQuestion}
                className="focus-ring inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:text-trail-indigo disabled:opacity-70"
              >
                {loadingQuestion ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Generate question
              </button>
            </div>
          </div>

          <label className="mt-5 block">
            <span className="text-sm font-semibold text-slate-700">Your answer</span>
            <textarea
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              className="focus-ring mt-2 min-h-44 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loadingFeedback}
            className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-trail-indigo disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loadingFeedback ? <Loader2 className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-4 w-4" />}
            Evaluate Answer
          </button>

          {fallbackUsed ? (
            <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm font-medium text-amber-800">
              API fallback used. Demo interview practice remains available.
            </p>
          ) : null}
        </form>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
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
              <h3 className="font-bold text-emerald-900">Stronger sample answer</h3>
              <p className="mt-2 text-sm leading-6 text-emerald-900">{feedback.sampleAnswer}</p>
            </div>
            <div className="rounded-lg bg-slate-950 p-5 text-white">
              <h3 className="font-bold">Confidence advice</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {feedback.confidenceAdvice ??
                  "Pause before answering, define the metric, and explain your reasoning in a clear sequence."}
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
