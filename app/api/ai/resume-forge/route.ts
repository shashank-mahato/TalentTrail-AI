import { NextResponse } from "next/server";
import { generateJson, toApiError } from "@/lib/ai/gemini";
import { resumeForgeAgentPrompt } from "@/lib/prompts";
import { finishAgentRun, getLatestProfileForRequest, recordAgentRun } from "@/lib/serverData";
import type { ResumeFeedback } from "@/lib/types";

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
    agentName: "ResumeForge Agent"
  });

  try {
    const body = (await request.json().catch(() => ({}))) as { bullet?: string };
    const bullet = body.bullet?.trim();
    if (!bullet) {
      return NextResponse.json(
        {
          error: "BULLET_REQUIRED",
          message: "Provide a real resume bullet from your uploaded resume."
        },
        { status: 400 }
      );
    }

    const feedback = await generateJson<ResumeFeedback>(
      resumeForgeAgentPrompt({
        bullet,
        targetRole: context.profile.targetRole,
        resumeText: context.profile.resumeText
      })
    );

    await context.supabase.from("resume_feedback").insert({
      user_id: context.user.id,
      resume_analysis_id: context.analysisId,
      feedback
    });
    await context.supabase.from("notifications").insert({
      user_id: context.user.id,
      title: "Resume suggestions are ready",
      body: "ResumeForge improved a resume bullet using your uploaded resume evidence.",
      type: "resume_feedback"
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
