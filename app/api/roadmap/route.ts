import { NextResponse } from "next/server";
import { generateJson } from "@/lib/ai";
import { mockRoadmap } from "@/lib/mockData";
import { roadmapAgentPrompt } from "@/lib/prompts";
import type { RoadmapResult } from "@/lib/types";

export const runtime = "nodejs";

interface RoadmapInput {
  targetRole?: string;
  currentSkills?: string;
  timePerDay?: string;
}

function fallbackForTarget(targetRole?: string): RoadmapResult {
  return {
    ...mockRoadmap,
    targetRole: targetRole?.trim() || mockRoadmap.targetRole
  };
}

function isRoadmap(value: RoadmapResult) {
  return typeof value?.targetRole === "string" && Array.isArray(value.roadmap);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as RoadmapInput;
  const fallback = fallbackForTarget(body.targetRole);
  const input = {
    targetRole: body.targetRole?.trim() || fallback.targetRole,
    currentSkills: body.currentSkills?.trim() || "Python basics, SQL beginner, Excel beginner",
    timePerDay: body.timePerDay?.trim() || "1 hour/day"
  };

  const generated = await generateJson<RoadmapResult>(roadmapAgentPrompt(input), fallback);
  return NextResponse.json(isRoadmap(generated) ? generated : fallback);
}
