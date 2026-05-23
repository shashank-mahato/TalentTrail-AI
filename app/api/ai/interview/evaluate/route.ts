import { NextResponse } from "next/server";
import { generateJson, toApiError } from "@/lib/ai/gemini";
import { interviewArenaEvaluatePrompt } from "@/lib/prompts";
import { finishAgentRun, getLatestProfileForRequest, recordAgentRun } from "@/lib/serverData";
import type { InterviewFeedback } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const context = await getLatestProfileForRequest(request).catch((error) => ({ thrown: error }));
  if ("error" in context) return context.error;
  if ("thrown" in context) {
    const apiError = toApiError(context.thrown);
    return NextResponse.json(
      { ...apiError.body, message: context.thrown instanceof Error ? context.thrown.message : apiError.body.message },
      { status: apiError.status }
    );
  }

  const runId = await recordAgentRun({
    supabase: context.supabase,
    userId: context.user.id,
    agentName: "InterviewArena Agent"
  });

  try {
    const body = (await request.json().catch(() => ({}))) as {
      question?: string;
      answer?: string;
    };
    if (!body.question?.trim() || !body.answer?.trim()) {
      return NextResponse.json(
        {
          error: "INTERVIEW_INPUT_REQUIRED",
          message: "Provide an interview question and your answer."
        },
        { status: 400 }
      );
    }
    const feedback = await generateJson<InterviewFeedback>(
      interviewArenaEvaluatePrompt({
        targetRole: context.profile.targetRole,
        question: body.question,
        answer: body.answer,
        resumeText: context.profile.resumeText
      })
    );
    await context.supabase.from("interview_sessions").insert({
      user_id: context.user.id,
      resume_analysis_id: context.analysisId,
      target_role: context.profile.targetRole,
      question: body.question,
      answer: body.answer,
      score: feedback.score,
      feedback
    });
    await context.supabase.from("notifications").insert({
      user_id: context.user.id,
      title: "Interview feedback is ready",
      body: "InterviewArena evaluated your answer using your uploaded resume and target role.",
      type: "interview"
    });
    await finishAgentRun({ supabase: context.supabase, runId, status: "completed", output: feedback });
    return NextResponse.json(feedback);
  } catch (error) {
    await finishAgentRun({ supabase: context.supabase, runId, status: "failed", errorMessage: error instanceof Error ? error.message : "Unknown error" });
    const apiError = toApiError(error);
    const message = error instanceof Error && apiError.status === 500 ? error.message : apiError.body.message;
    return NextResponse.json({ ...apiError.body, message }, { status: apiError.status });
  }
}
