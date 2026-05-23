"use client";

import type { ReactNode } from "react";
import { Loader2, LockKeyhole } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/useAuth";

interface AuthGateProps {
  children: ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const { user, loading, isConfigured } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && isConfigured && !user) {
      router.replace(`/auth?next=${encodeURIComponent(pathname)}`);
    }
  }, [isConfigured, loading, pathname, router, user]);

  if (loading) {
    return (
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-20">
        <Loader2 className="h-6 w-6 animate-spin text-trail-indigo" />
      </div>
    );
  }

  if (!isConfigured) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-950 shadow-soft">
          <LockKeyhole className="h-7 w-7" />
          <h1 className="mt-4 text-2xl font-bold">Supabase is required for the real workflow</h1>
          <p className="mt-3 text-sm leading-6">
            Configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in Vercel
            to enable signup, login, resume storage, proof uploads, and realtime dashboard updates.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-20">
        <Loader2 className="h-6 w-6 animate-spin text-trail-indigo" />
      </div>
    );
  }

  return <>{children}</>;
}
