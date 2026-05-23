import { NextResponse } from "next/server";
import { generateJson } from "@/lib/ai";
import { mockResumeFeedback } from "@/lib/mockData";
import { resumeForgeAgentPrompt } from "@/lib/prompts";
import type { ResumeFeedback } from "@/lib/types";

export const runtime = "nodejs";

interface ResumeInput {
  bullet?: string;
  targetRole?: string;
}

function fallbackForBullet(bullet?: string): ResumeFeedback {
  const originalBullet = bullet?.trim() || mockResumeFeedback.originalBullet;
  return {
    ...mockResumeFeedback,
    originalBullet
  };
}

function isResumeFeedback(value: ResumeFeedback) {
  return (
    typeof value?.improvedBullet === "string" &&
    typeof value.scoreBefore === "number" &&
    typeof value.scoreAfter === "number" &&
    Array.isArray(value.tips)
  );
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as ResumeInput;
  const fallback = fallbackForBullet(body.bullet);
  const input = {
    bullet: fallback.originalBullet,
    targetRole: body.targetRole?.trim() || "Data Analyst Intern"
  };

  const generated = await generateJson<ResumeFeedback>(resumeForgeAgentPrompt(input), fallback);
  return NextResponse.json(isResumeFeedback(generated) ? generated : fallback);
}
