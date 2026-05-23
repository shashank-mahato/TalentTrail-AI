import { NextResponse } from "next/server";
import { generateJson, toApiError } from "@/lib/ai/gemini";
import { requireApiUser } from "@/lib/apiAuth";
import { createRealJobSearchLinks } from "@/lib/jobSearch";
import { resumeIntelligencePrompt } from "@/lib/prompts";
import { assertUsableResumeText, extractTextFromFile, normalizeText } from "@/lib/resumeParser";
import { RESUME_BUCKET } from "@/lib/supabase";
import type { ResumeIntelligenceResult } from "@/lib/types";
import type { SupabaseClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const maxDuration = 60;

function isResumeIntelligenceResult(value: ResumeIntelligenceResult) {
  return (
    Boolean(value?.extractedProfile) &&
    Boolean(value?.editableProfile) &&
    Boolean(value?.careerResult) &&
    Boolean(value?.roadmap) &&
    Array.isArray(value.missions) &&
    Array.isArray(value.resumeFeedback) &&
    Array.isArray(value.interviewQuestions) &&
    Array.isArray(value.careerTwin)
  );
}

async function createAgentRun(input: {
  supabase: SupabaseClient;
  userId: string;
  agentName: string;
}) {
  const { data } = await input.supabase
    .from("agent_runs")
    .insert({
      user_id: input.userId,
      agent_name: input.agentName,
      status: "running"
    })
    .select("id")
    .single();
  return data?.id as string | undefined;
}

export async function POST(request: Request) {
  const auth = await requireApiUser(request);
  if ("error" in auth) return auth.error;

  const runId = await createAgentRun({
    supabase: auth.supabase,
    userId: auth.user.id,
    agentName: "TrailScan Agent"
  });

  try {
    const formData = await request.formData();
    const file = formData.get("resume");
    const pastedText = String(formData.get("resumeText") ?? "").trim();
    const targetRole = String(formData.get("targetRole") ?? "").trim();
    const timePerDay = String(formData.get("timePerDay") ?? "").trim();
    const interests = String(formData.get("interests") ?? "").trim();
    const learningStyle = String(formData.get("learningStyle") ?? "").trim();

    if (!targetRole || !timePerDay) {
      return NextResponse.json(
        {
          error: "GOAL_REQUIRED",
          message: "Target role and time per day are required."
        },
        { status: 400 }
      );
    }

    if (!(file instanceof File) && !pastedText) {
      return NextResponse.json(
        {
          error: "RESUME_REQUIRED",
          message: "Upload a PDF, DOCX, TXT resume or paste resume text."
        },
        { status: 400 }
      );
    }

    let filePath: string | null = null;
    let originalFileName: string | null = null;
    let mimeType: string | null = null;
    let rawText = "";

    if (file instanceof File) {
      originalFileName = file.name;
      mimeType = file.type || "application/octet-stream";
      rawText = await extractTextFromFile(file);
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      filePath = `${auth.user.id}/${Date.now()}-${safeName}`;
      const upload = await auth.supabase.storage.from(RESUME_BUCKET).upload(filePath, file, {
        contentType: mimeType
      });
      if (upload.error) {
        throw new Error(`Resume upload failed: ${upload.error.message}`);
      }
    } else {
      rawText = normalizeText(pastedText);
      originalFileName = "pasted-resume-text.txt";
      mimeType = "text/plain";
    }

    const resumeText = assertUsableResumeText(rawText);

    const { data: document, error: documentError } = await auth.supabase
      .from("resume_documents")
      .insert({
        user_id: auth.user.id,
        file_name: originalFileName,
        file_path: filePath,
        mime_type: mimeType,
        source_type: file instanceof File ? "upload" : "manual_text",
        extracted_text: resumeText,
        parse_status: "parsed"
      })
      .select("id")
      .single();

    if (documentError) {
      throw new Error(documentError.message);
    }

    const generated = await generateJson<ResumeIntelligenceResult>(
      resumeIntelligencePrompt({
        resumeText,
        targetRole,
        timePerDay,
        interests,
        learningStyle
      })
    );

    if (!isResumeIntelligenceResult(generated)) {
      throw new Error("Gemini returned an incomplete resume intelligence payload.");
    }

    const result: ResumeIntelligenceResult = {
      ...generated,
      jobSearchLinks: createRealJobSearchLinks({
        targetRole,
        profile: generated.extractedProfile
      }),
      editableProfile: {
        ...generated.editableProfile,
        targetRole,
        timePerDay,
        interests,
        learningStyle,
        resumeText,
        extractedResume: generated.extractedProfile
      }
    };

    const { data: analysis, error: analysisError } = await auth.supabase
      .from("resume_analyses")
      .insert({
        user_id: auth.user.id,
        resume_document_id: document.id,
        resume_file_path: filePath,
        resume_text: resumeText,
        extracted_profile: result.extractedProfile,
        editable_profile: result.editableProfile,
        career_result: result.careerResult,
        roadmap: result.roadmap,
        missions: result.missions,
        resume_feedback: result.resumeFeedback,
        interview_questions: result.interviewQuestions,
        career_twin: result.careerTwin,
        job_search_links: result.jobSearchLinks
      })
      .select("id")
      .single();

    if (analysisError) {
      throw new Error(analysisError.message);
    }

    await auth.supabase.from("profiles").upsert({
      id: auth.user.id,
      user_id: auth.user.id,
      full_name: result.extractedProfile.name || result.editableProfile.name || null,
      target_role: targetRole,
      resume_profile: result.extractedProfile,
      preferences: { timePerDay, interests, learningStyle }
    });

    await auth.supabase.from("career_results").insert({
      user_id: auth.user.id,
      resume_analysis_id: analysis.id,
      readiness_score: result.careerResult.readinessScore,
      best_fit_role: result.careerResult.recommendedRoles[0]?.role ?? targetRole,
      result: result.careerResult
    });

    const { data: roadmap } = await auth.supabase
      .from("roadmaps")
      .insert({
        user_id: auth.user.id,
        resume_analysis_id: analysis.id,
        target_role: result.roadmap.targetRole,
        roadmap: result.roadmap
      })
      .select("id")
      .single();

    const missionRows = result.roadmap.roadmap.flatMap((week) =>
      week.days.map((day) => ({
        user_id: auth.user.id,
        roadmap_id: roadmap?.id ?? null,
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

    if (missionRows.length) {
      await auth.supabase.from("missions").insert(missionRows);
    }

    if (result.resumeFeedback.length) {
      await auth.supabase.from("resume_feedback").insert(
        result.resumeFeedback.map((feedback) => ({
          user_id: auth.user.id,
          resume_analysis_id: analysis.id,
          feedback
        }))
      );
    }

    await auth.supabase.from("notifications").insert([
      {
        user_id: auth.user.id,
        title: "Resume analysis is complete",
        body: "Your resume-powered career diagnosis, roadmap, missions, and interview prep are ready.",
        type: "resume_analysis"
      },
      {
        user_id: auth.user.id,
        title: "New missions unlocked",
        body: "MissionTrail created a proof-based 30-day roadmap from your resume.",
        type: "missions"
      }
    ]);

    if (runId) {
      await auth.supabase
        .from("agent_runs")
        .update({
          status: "completed",
          output: {
            analysisId: analysis.id,
            readinessScore: result.careerResult.readinessScore,
            targetRole
          }
        })
        .eq("id", runId);
    }

    return NextResponse.json({
      ...result,
      analysisId: analysis.id as string,
      resumeFilePath: filePath ?? undefined
    });
  } catch (error) {
    if (runId) {
      await auth.supabase
        .from("agent_runs")
        .update({
          status: "failed",
          error_message: error instanceof Error ? error.message : "Unknown error"
        })
        .eq("id", runId);
    }

    const apiError = toApiError(error);
    const message =
      error instanceof Error && apiError.status === 500 ? error.message : apiError.body.message;
    return NextResponse.json({ ...apiError.body, message }, { status: apiError.status });
  }
}
