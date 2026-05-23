import { NextResponse } from "next/server";
import { generateJson, toApiError } from "@/lib/ai/gemini";
import { roadmapAgentPrompt } from "@/lib/prompts";
import { finishAgentRun, getLatestProfileForRequest, recordAgentRun } from "@/lib/serverData";
import type { RoadmapResult } from "@/lib/types";

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
    agentName: "MissionTrail Agent"
  });

  try {
    const roadmap = await generateJson<RoadmapResult>(roadmapAgentPrompt(context.profile));
    const { data } = await context.supabase
      .from("roadmaps")
      .insert({
        user_id: context.user.id,
        resume_analysis_id: context.analysisId,
        target_role: roadmap.targetRole,
        roadmap
      })
      .select("id")
      .single();

    const missionRows = roadmap.roadmap.flatMap((week) =>
      week.days.map((day) => ({
        user_id: context.user.id,
        roadmap_id: data?.id ?? null,
        week_number: week.week,
        day_number: day.day,
        title: day.title,
        description: day.description,
        skill_focus: day.skill,
        estimated_time: day.estimatedTime,
        proof_required: day.proofRequired,
        expected_output: day.proofRequired,
        difficulty: day.difficulty,
        status: "pending"
      }))
    );
    if (missionRows.length) await context.supabase.from("missions").insert(missionRows);
    await context.supabase
      .from("resume_analyses")
      .update({ roadmap, updated_at: new Date().toISOString() })
      .eq("id", context.analysisId);
    await context.supabase.from("notifications").insert({
      user_id: context.user.id,
      title: "Roadmap is ready",
      body: "MissionTrail generated a fresh 30-day roadmap from your resume.",
      type: "roadmap"
    });
    await finishAgentRun({ supabase: context.supabase, runId, status: "completed", output: roadmap });
    return NextResponse.json(roadmap);
  } catch (error) {
    await finishAgentRun({ supabase: context.supabase, runId, status: "failed", errorMessage: error instanceof Error ? error.message : "Unknown error" });
    const apiError = toApiError(error);
    const message = error instanceof Error && apiError.status === 500 ? error.message : apiError.body.message;
    return NextResponse.json({ ...apiError.body, message }, { status: apiError.status });
  }
}
