import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;
let serverClient: SupabaseClient | null = null;
let serviceClient: SupabaseClient | null = null;

function isValidHttpUrl(value?: string) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function hasSupabaseConfig() {
  return Boolean(
    isValidHttpUrl(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!isValidHttpUrl(url) || !publishableKey) {
    return null;
  }

  if (!browserClient) {
    browserClient = createClient(url as string, publishableKey);
  }

  return browserClient;
}

export function getSupabaseServerClient(accessToken?: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!isValidHttpUrl(url) || !publishableKey) {
    return null;
  }

  if (accessToken) {
    return createClient(url as string, publishableKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    });
  }

  if (!serverClient) {
    serverClient = createClient(url as string, publishableKey);
  }

  return serverClient;
}

export function getSupabaseServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!isValidHttpUrl(url) || !serviceRoleKey) {
    return null;
  }

  if (!serviceClient) {
    serviceClient = createClient(url as string, serviceRoleKey, {
      auth: {
        persistSession: false
      }
    });
  }

  return serviceClient;
}

export const RESUME_BUCKET = "resumes";
export const PROOF_BUCKET = "proof-files";
