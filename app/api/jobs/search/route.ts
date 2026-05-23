import { NextResponse } from "next/server";
import { toApiError } from "@/lib/ai/gemini";
import { getLatestProfileForRequest } from "@/lib/serverData";

export const runtime = "nodejs";
export const maxDuration = 30;

interface AdzunaJob {
  id: string;
  title: string;
  company?: { display_name?: string };
  location?: { display_name?: string };
  redirect_url: string;
  created?: string;
  salary_min?: number;
  salary_max?: number;
  description?: string;
}

function scoreJob(description: string, skills: string[]) {
  if (!skills.length) return 0;
  const lower = description.toLowerCase();
  const hits = skills.filter((skill) => lower.includes(skill.toLowerCase()));
  return Math.min(100, Math.round((hits.length / Math.min(skills.length, 8)) * 100));
}

export async function GET(request: Request) {
  const context = await getLatestProfileForRequest(request).catch((error) => ({ thrown: error }));
  if ("error" in context) return context.error;
  if ("thrown" in context) {
    const apiError = toApiError(context.thrown);
    return NextResponse.json(
      { ...apiError.body, message: context.thrown instanceof Error ? context.thrown.message : apiError.body.message },
      { status: apiError.status }
    );
  }

  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  if (!appId || !appKey) {
    return NextResponse.json(
      {
        error: "ADZUNA_NOT_CONFIGURED",
        message: "Add ADZUNA_APP_ID and ADZUNA_APP_KEY to search real jobs and internships."
      },
      { status: 503 }
    );
  }

  const url = new URL(request.url);
  const country = (url.searchParams.get("country") || "in").toLowerCase();
  const location = url.searchParams.get("location") || "";
  const query = url.searchParams.get("q") || context.profile.targetRole;
  const skills: string[] =
    context.profile.extractedResume?.skills ?? context.profile.currentSkills.split(",");
  const endpoint = new URL(`https://api.adzuna.com/v1/api/jobs/${country}/search/1`);
  endpoint.searchParams.set("app_id", appId);
  endpoint.searchParams.set("app_key", appKey);
  endpoint.searchParams.set("what", `${query} internship ${skills.slice(0, 4).join(" ")}`);
  endpoint.searchParams.set("results_per_page", "12");
  if (location) endpoint.searchParams.set("where", location);

  const response = await fetch(endpoint.toString(), {
    next: { revalidate: 900 }
  });

  if (!response.ok) {
    return NextResponse.json(
      {
        error: "JOB_SEARCH_FAILED",
        message: "Adzuna could not return jobs for this search. Check country, credentials, and query."
      },
      { status: response.status }
    );
  }

  const payload = (await response.json()) as { results?: AdzunaJob[] };
  const jobs = (payload.results ?? []).map((job) => {
    const description = job.description ?? "";
    const missingSkills = skills
      .filter((skill: string) => skill.trim() && !description.toLowerCase().includes(skill.trim().toLowerCase()))
      .slice(0, 5);

    return {
      externalId: job.id,
      jobTitle: job.title,
      company: job.company?.display_name ?? null,
      location: job.location?.display_name ?? null,
      salary:
        job.salary_min || job.salary_max
          ? `${job.salary_min ?? ""}${job.salary_min && job.salary_max ? " - " : ""}${job.salary_max ?? ""}`
          : null,
      url: job.redirect_url,
      source: "Adzuna",
      created: job.created ?? null,
      matchScore: scoreJob(description, skills),
      whyItMatches: "Matched using your target role and extracted resume skills.",
      missingSkills,
      applyRecommendation:
        missingSkills.length > 3
          ? "Improve the missing skills or tailor proof before applying."
          : "Good candidate for a targeted application after resume tailoring."
    };
  });

  await context.supabase.from("agent_runs").insert({
    user_id: context.user.id,
    agent_name: "JobMatch Agent",
    status: "completed",
    output: { query, country, location, count: jobs.length }
  });

  if (jobs.length) {
    await context.supabase.from("notifications").insert({
      user_id: context.user.id,
      title: "Job matches are ready",
      body: `JobMatch found ${jobs.length} real opportunities from Adzuna.`,
      type: "jobs"
    });
  }

  return NextResponse.json({ jobs });
}
