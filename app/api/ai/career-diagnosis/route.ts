import { NextResponse } from "next/server";
import { generateJson, toApiError } from "@/lib/ai/gemini";
import { careerFitAgentPrompt } from "@/lib/prompts";
import { finishAgentRun, getLatestProfileForRequest, recordAgentRun } from "@/lib/serverData";
import type { CareerResult } from "@/lib/types";

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
    agentName: "RoleMatch Agent"
  });

  try {
    const result = await generateJson<CareerResult>(careerFitAgentPrompt(context.profile));
    await context.supabase.from("career_results").insert({
      user_id: context.user.id,
      resume_analysis_id: context.analysisId,
      readiness_score: result.readinessScore,
      best_fit_role: result.recommendedRoles[0]?.role ?? context.profile.targetRole,
      result
    });
    await context.supabase
      .from("resume_analyses")
      .update({ career_result: result, updated_at: new Date().toISOString() })
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
