import { NextResponse } from "next/server";
import { generateJson, toApiError } from "@/lib/ai/gemini";
import { careerFitAgentPrompt, roadmapAgentPrompt } from "@/lib/prompts";
import { finishAgentRun, getLatestProfileForRequest, recordAgentRun } from "@/lib/serverData";
import type { CareerResult, RoadmapResult, StudentProfile } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const context = await getLatestProfileForRequest(request).catch((error) => ({ thrown: error }));
  if ("error" in context) return context.error;
  if ("thrown" in context) {
    const apiError = toApiError(context.thrown);
    return NextResponse.json(
      {
        ...apiError.body,
        message: context.thrown instanceof Error ? context.thrown.message : apiError.body.message
      },
      { status: apiError.status }
    );
  }

  const runId = await recordAgentRun({
    supabase: context.supabase,
    userId: context.user.id,
    agentName: "TrailScan Agent"
  });

  try {
    const body = (await request.json().catch(() => ({}))) as Partial<StudentProfile>;
    const profile = { ...context.profile, ...body };
    const careerResult = await generateJson<CareerResult>(careerFitAgentPrompt(profile));
    const roadmap = await generateJson<RoadmapResult>(roadmapAgentPrompt(profile));

    await context.supabase
      .from("resume_analyses")
      .update({
        editable_profile: profile,
        career_result: careerResult,
        roadmap,
        updated_at: new Date().toISOString()
      })
      .eq("id", context.analysisId);

    await context.supabase.from("career_results").insert({
      user_id: context.user.id,
      resume_analysis_id: context.analysisId,
      readiness_score: careerResult.readinessScore,
      best_fit_role: careerResult.recommendedRoles[0]?.role ?? profile.targetRole,
      result: careerResult
    });

    await context.supabase.from("notifications").insert({
      user_id: context.user.id,
      title: "Career diagnosis updated",
      body: "TalentTrail AI re-ran your resume-derived career analysis.",
      type: "career_diagnosis"
    });

    await finishAgentRun({
      supabase: context.supabase,
      runId,
      status: "completed",
      output: { readinessScore: careerResult.readinessScore }
    });

    return NextResponse.json({ careerResult, roadmap });
  } catch (error) {
    await finishAgentRun({
      supabase: context.supabase,
      runId,
      status: "failed",
      errorMessage: error instanceof Error ? error.message : "Unknown error"
    });
    const apiError = toApiError(error);
    const message =
      error instanceof Error && apiError.status === 500 ? error.message : apiError.body.message;
    return NextResponse.json({ ...apiError.body, message }, { status: apiError.status });
  }
}
