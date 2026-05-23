import { requireApiUser } from "@/lib/apiAuth";
import type { StudentProfile } from "@/lib/types";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { NextResponse } from "next/server";

type ApiUserContext = {
  user: User;
  supabase: SupabaseClient;
};

type LatestProfileContext = ApiUserContext & {
  analysisId: string;
  profile: StudentProfile;
};

export async function getLatestProfileForRequest(
  request: Request
): Promise<LatestProfileContext | { error: NextResponse }> {
  const auth = await requireApiUser(request);
  if ("error" in auth) return { error: auth.error };

  const { data, error } = await auth.supabase
    .from("resume_analyses")
    .select("id, editable_profile, resume_text")
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Upload and parse a resume before running this agent.");
  }

  const profile = {
    ...(data.editable_profile as Record<string, unknown>),
    resumeText: data.resume_text
  } as StudentProfile;

  return { user: auth.user, supabase: auth.supabase, analysisId: data.id as string, profile };
}

export async function recordAgentRun(input: {
  supabase: SupabaseClient;
  userId: string;
  agentName: string;
  status?: "pending" | "running" | "completed" | "failed";
  output?: unknown;
  errorMessage?: string;
}) {
  const { data } = await input.supabase
    .from("agent_runs")
    .insert({
      user_id: input.userId,
      agent_name: input.agentName,
      status: input.status ?? "running",
      output: input.output ?? null,
      error_message: input.errorMessage ?? null
    })
    .select("id")
    .single();

  return data?.id as string | undefined;
}

export async function finishAgentRun(input: {
  supabase: SupabaseClient;
  runId?: string;
  status: "completed" | "failed";
  output?: unknown;
  errorMessage?: string;
}) {
  if (!input.runId) return;

  await input.supabase
    .from("agent_runs")
    .update({
      status: input.status,
      output: input.output ?? null,
      error_message: input.errorMessage ?? null
    })
    .eq("id", input.runId);
}
