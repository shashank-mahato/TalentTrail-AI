import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/apiAuth";
import { PROOF_BUCKET, RESUME_BUCKET } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await requireApiUser(request);
  if ("error" in auth) return auth.error;

  const [resumeBucket, proofBucket] = await Promise.all([
    auth.supabase.storage.getBucket(RESUME_BUCKET),
    auth.supabase.storage.getBucket(PROOF_BUCKET)
  ]);

  return NextResponse.json({
    supabaseConnected: true,
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    adzunaConfigured: Boolean(process.env.ADZUNA_APP_ID && process.env.ADZUNA_APP_KEY),
    serviceRoleConfigured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    resumeBucketAvailable: !resumeBucket.error,
    proofBucketAvailable: !proofBucket.error
  });
}
