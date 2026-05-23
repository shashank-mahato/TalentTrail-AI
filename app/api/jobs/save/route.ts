import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/apiAuth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const auth = await requireApiUser(request);
  if ("error" in auth) return auth.error;

  const body = (await request.json().catch(() => ({}))) as {
    externalId?: string;
    jobTitle?: string;
    company?: string | null;
    location?: string | null;
    url?: string;
    source?: string;
    matchScore?: number;
    raw?: unknown;
  };

  if (!body.jobTitle || !body.url) {
    return NextResponse.json(
      {
        error: "JOB_REQUIRED",
        message: "A job title and URL are required before saving a job."
      },
      { status: 400 }
    );
  }

  const { data, error } = await auth.supabase
    .from("saved_jobs")
    .insert({
      user_id: auth.user.id,
      external_id: body.externalId ?? null,
      job_title: body.jobTitle,
      company: body.company ?? null,
      location: body.location ?? null,
      url: body.url,
      source: body.source ?? "Adzuna",
      match_score: body.matchScore ?? null,
      raw: body.raw ?? body
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: "SAVE_JOB_FAILED", message: error.message }, { status: 500 });
  }

  await auth.supabase.from("notifications").insert({
    user_id: auth.user.id,
    title: "Job saved",
    body: `${body.jobTitle} was saved to your TalentTrail AI job tracker.`,
    type: "saved_job"
  });

  return NextResponse.json(data);
}
