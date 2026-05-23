import { NextResponse } from "next/server";
import { generateJson } from "@/lib/ai";
import { mockInterviewFeedback, mockInterviewQuestion } from "@/lib/mockData";
import {
  interviewArenaEvaluatePrompt,
  interviewArenaGeneratePrompt
} from "@/lib/prompts";
import type { InterviewFeedback } from "@/lib/types";

export const runtime = "nodejs";

interface InterviewInput {
  targetRole?: string;
  question?: string;
  answer?: string;
  mode?: "generate" | "evaluate";
}

function isGeneratedQuestion(value: { question: string }) {
  return typeof value?.question === "string" && value.question.trim().length > 0;
}

function isInterviewFeedback(value: InterviewFeedback) {
  return (
    typeof value?.score === "number" &&
    typeof value.feedback === "string" &&
    typeof value.improvementTip === "string" &&
    typeof value.sampleAnswer === "string"
  );
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as InterviewInput;
  const targetRole = body.targetRole?.trim() || "Data Analyst Intern";

  if (body.mode === "evaluate") {
    const fallback = mockInterviewFeedback;
    const generated = await generateJson<InterviewFeedback>(
      interviewArenaEvaluatePrompt({
        targetRole,
        question: body.question?.trim() || mockInterviewQuestion,
        answer: body.answer?.trim() || "I would compare the data and find the issue."
      }),
      fallback
    );
    return NextResponse.json(isInterviewFeedback(generated) ? generated : fallback);
  }

  const fallback = { question: mockInterviewQuestion };
  const generated = await generateJson<{ question: string }>(
    interviewArenaGeneratePrompt(targetRole),
    fallback
  );
  return NextResponse.json(isGeneratedQuestion(generated) ? generated : fallback);
}
