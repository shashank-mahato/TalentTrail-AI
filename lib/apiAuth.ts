import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import type { SupabaseClient, User } from "@supabase/supabase-js";

export function getBearerToken(request: Request) {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length);
}

export async function requireApiUser(
  request: Request
): Promise<{ user: User; supabase: SupabaseClient } | { error: NextResponse }> {
  const token = getBearerToken(request);
  if (!token) {
    return {
      error: NextResponse.json(
        {
          error: "UNAUTHENTICATED",
          message: "Log in before using TalentTrail AI."
        },
        { status: 401 }
      )
    };
  }

  const supabase = getSupabaseServerClient(token);
  if (!supabase) {
    return {
      error: NextResponse.json(
        {
          error: "SUPABASE_NOT_CONFIGURED",
          message:
            "Supabase environment variables are required for authenticated resume intelligence."
        },
        { status: 503 }
      )
    };
  }

  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      error: NextResponse.json(
        {
          error: "UNAUTHENTICATED",
          message: "Your session is invalid or expired. Log in again."
        },
        { status: 401 }
      )
    };
  }

  return { user, supabase };
}
