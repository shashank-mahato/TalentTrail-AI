import { GoogleGenerativeAI } from "@google/generative-ai";

export class AiConfigurationError extends Error {
  constructor() {
    super("GEMINI_API_KEY is not configured. Add it in Vercel environment variables.");
    this.name = "AiConfigurationError";
  }
}

function extractJson(text: string) {
  const trimmed = text.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return trimmed;
  }

  const firstObject = trimmed.indexOf("{");
  const lastObject = trimmed.lastIndexOf("}");
  if (firstObject >= 0 && lastObject > firstObject) {
    return trimmed.slice(firstObject, lastObject + 1);
  }

  const firstArray = trimmed.indexOf("[");
  const lastArray = trimmed.lastIndexOf("]");
  if (firstArray >= 0 && lastArray > firstArray) {
    return trimmed.slice(firstArray, lastArray + 1);
  }

  return trimmed;
}

export async function generateJson<T>(prompt: string): Promise<T> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new AiConfigurationError();
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.25,
      responseMimeType: "application/json"
    }
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return JSON.parse(extractJson(text)) as T;
}

export function toApiError(error: unknown) {
  if (error instanceof AiConfigurationError) {
    return {
      status: 503,
      body: {
        error: "AI_NOT_CONFIGURED",
        message: error.message
      }
    };
  }

  console.error("AI route failed", error);
  return {
    status: 500,
    body: {
      error: "AI_GENERATION_FAILED",
      message:
        "TalentTrail AI could not complete the requested analysis. Check the input and server configuration."
    }
  };
}
