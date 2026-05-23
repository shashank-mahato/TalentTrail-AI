import { NextResponse } from "next/server";
import { generateJson, toApiError } from "@/lib/ai/gemini";
import { requireApiUser } from "@/lib/apiAuth";
import { proofReviewPrompt } from "@/lib/prompts";
import { assertUsableResumeText, extractTextFromFile, normalizeText } from "@/lib/resumeParser";
import { PROOF_BUCKET } from "@/lib/supabase";
import type { ProofReview } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

async function extractProofText(file: File | null, notes: string, proofUrl: string) {
  if (!file) {
    return normalizeText(`${notes}\n${proofUrl ? `Proof link: ${proofUrl}` : ""}`);
  }

  try {
    return assertUsableResumeText(await extractTextFromFile(file));
  } catch {
    return normalizeText(
      `${notes}\n${proofUrl ? `Proof link: ${proofUrl}\n` : ""}Uploaded proof file: ${file.name}\nFile type: ${file.type || "unknown"}\nFile size: ${file.size} bytes`
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireApiUser(request);
  if ("error" in auth) return auth.error;

  let runId: string | undefined;
  try {
    const formData = await request.formData();
    const fileField = formData.get("proof");
    const file = fileField instanceof File ? fileField : null;
    const proofUrl = String(formData.get("proofUrl") ?? "").trim();
    const notes = String(formData.get("notes") ?? "").trim();
    const missionId = String(formData.get("missionId") ?? "").trim();
    const missionTitle = String(formData.get("missionTitle") ?? "").trim();
    const missionDescription = String(formData.get("missionDescription") ?? "").trim();
    const targetRole = String(formData.get("targetRole") ?? "").trim();

    if (!missionTitle || !targetRole || (!file && !proofUrl && !notes)) {
      return NextResponse.json(
        {
          error: "PROOF_REQUIRED",
          message: "Provide mission details plus a proof file, link, or description."
        },
        { status: 400 }
      );
    }

    const { data: run } = await auth.supabase
      .from("agent_runs")
      .insert({
        user_id: auth.user.id,
        agent_name: "ProofReview Agent",
        status: "running"
      })
      .select("id")
      .single();
    runId = run?.id as string | undefined;

    let filePath: string | null = null;
    if (file) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      filePath = `${auth.user.id}/${missionId || "general"}/${Date.now()}-${safeName}`;
      const upload = await auth.supabase.storage.from(PROOF_BUCKET).upload(filePath, file, {
        contentType: file.type || "application/octet-stream"
      });
      if (upload.error) throw new Error(upload.error.message);
    }

    const proofText = await extractProofText(file, notes, proofUrl);
    const review = await generateJson<ProofReview>(
      proofReviewPrompt({
        missionTitle,
        missionDescription,
        targetRole,
        proofText
      })
    );

    await auth.supabase.from("proof_items").insert({
      user_id: auth.user.id,
      mission_id: missionId || null,
      title: missionTitle,
      proof_type: file ? "file" : proofUrl ? "link" : "text",
      proof_url: proofUrl || null,
      file_path: filePath,
      notes,
      review_status: "reviewed",
      review
    });

    if (missionId) {
      await auth.supabase.from("missions").update({ status: "reviewed" }).eq("id", missionId);
    }

    await auth.supabase.from("notifications").insert({
      user_id: auth.user.id,
      title: "Proof review is complete",
      body: "ProofVault reviewed your submitted work and suggested resume-ready evidence.",
      type: "proof_review"
    });

    if (runId) {
      await auth.supabase
        .from("agent_runs")
        .update({ status: "completed", output: review })
        .eq("id", runId);
    }

    return NextResponse.json(review);
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
    const message = error instanceof Error && apiError.status === 500 ? error.message : apiError.body.message;
    return NextResponse.json({ ...apiError.body, message }, { status: apiError.status });
  }
}
