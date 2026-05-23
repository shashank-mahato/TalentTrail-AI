import { NextResponse } from "next/server";
import { generateJson, toApiError } from "@/lib/ai/gemini";
import { interviewQuestionsPrompt } from "@/lib/prompts";
import { finishAgentRun, getLatestProfileForRequest, recordAgentRun } from "@/lib/serverData";
import type { InterviewQuestion } from "@/lib/types";

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
    const result = await generateJson<{ questions: InterviewQuestion[] }>(
      interviewQuestionsPrompt(context.profile)
    );
    await context.supabase
      .from("resume_analyses")
      .update({ interview_questions: result.questions, updated_at: new Date().toISOString() })
      .eq("id", context.analysisId);
    await finishAgentRun({ supabase: context.supabase, runId, status: "completed", output: result });
    return NextResponse.json(result);
  } catch (error) {
    await finishAgentRun({ supabase: context.supabase, runId, status: "failed", errorMessage: error instanceof Error ? error.message : "Unknown error" });
    const apiError = toApiError(error);
    const message = error instanceof Error && apiError.status === 500 ? error.message : apiError.body.message;
    return NextResponse.json({ ...apiError.body, message }, { status: apiError.status });
  }
}
