import { NextResponse } from "next/server";
import { generateJson } from "@/lib/ai";
import { mockCareerResult, demoProfile } from "@/lib/mockData";
import { careerFitAgentPrompt } from "@/lib/prompts";
import { getSupabaseClient } from "@/lib/supabase";
import type { CareerResult, StudentProfile } from "@/lib/types";

export const runtime = "nodejs";

function normalizeProfile(body: Partial<StudentProfile>): StudentProfile {
  return {
    ...demoProfile,
    ...body,
    name: body.name?.trim() || demoProfile.name,
    targetRole: body.targetRole?.trim() || demoProfile.targetRole,
    currentSkills: body.currentSkills?.trim() || demoProfile.currentSkills
  };
}

function isCareerResult(value: CareerResult) {
  return (
    typeof value?.readinessScore === "number" &&
    Array.isArray(value.recommendedRoles) &&
    Array.isArray(value.skillGaps) &&
    Boolean(value.firstMission)
  );
}

async function persistCareerResult(profile: StudentProfile, result: CareerResult) {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    const { data: createdProfile, error: profileError } = await supabase
      .from("profiles")
      .insert({
        name: profile.name,
        degree: profile.degree,
        year: profile.year,
        branch: profile.branch,
        current_skills: profile.currentSkills,
        target_role: profile.targetRole,
        time_per_day: profile.timePerDay,
        confidence_level: profile.confidenceLevel,
        resume_text: profile.resumeText ?? "",
        interests: profile.interests,
        learning_style: profile.learningStyle
      })
      .select("id")
      .single();

    if (profileError || !createdProfile) return;

    await supabase.from("career_results").insert({
      profile_id: createdProfile.id,
      readiness_score: result.readinessScore,
      career_summary: result.careerSummary,
      recommended_roles: result.recommendedRoles,
      skill_gaps: result.skillGaps,
      first_mission: result.firstMission,
      next_steps: result.nextSteps
    });
  } catch (error) {
    console.warn("Supabase career result persistence skipped.", error);
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Partial<StudentProfile>;
  const profile = normalizeProfile(body);
  const generated = await generateJson<CareerResult>(
    careerFitAgentPrompt(profile),
    mockCareerResult
  );
  const result = isCareerResult(generated) ? generated : mockCareerResult;

  await persistCareerResult(profile, result);
  return NextResponse.json(result);
}
