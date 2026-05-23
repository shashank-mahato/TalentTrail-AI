"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { AuthGate } from "@/components/AuthGate";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/lib/useAuth";

interface StatusPayload {
  supabaseConnected: boolean;
  geminiConfigured: boolean;
  adzunaConfigured: boolean;
  serviceRoleConfigured: boolean;
  resumeBucketAvailable: boolean;
  proofBucketAvailable: boolean;
}

export default function SettingsPage() {
  return (
    <AuthGate>
      <SettingsContent />
    </AuthGate>
  );
}

function SettingsContent() {
  const { user, isConfigured, accessToken } = useAuth();
  const [status, setStatus] = useState<StatusPayload | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    fetch("/api/settings/status", {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then((response) => response.json())
      .then((payload) => setStatus(payload as StatusPayload))
      .catch(() => setStatus(null));
  }, [accessToken]);

  return (
    <main>
      <PageHeader
        eyebrow="Settings"
        title="TalentTrail AI configuration"
        description="Check user profile and integration status without revealing secret values."
      />
      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold text-slate-950">User profile</h2>
          <p className="mt-3 text-sm text-slate-600">{user?.email}</p>
          <p className="mt-2 text-xs font-semibold text-slate-400">User ID: {user?.id}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold text-slate-950">Integration status</h2>
          <div className="mt-5 grid gap-3">
            <StatusRow label="Supabase connected" ok={status?.supabaseConnected ?? isConfigured} />
            <StatusRow label="Gemini configured" ok={Boolean(status?.geminiConfigured)} />
            <StatusRow label="Adzuna configured" ok={Boolean(status?.adzunaConfigured)} />
            <StatusRow label="Service role configured" ok={Boolean(status?.serviceRoleConfigured)} />
            <StatusRow label="Resume storage bucket available" ok={Boolean(status?.resumeBucketAvailable)} />
            <StatusRow label="Proof storage bucket available" ok={Boolean(status?.proofBucketAvailable)} />
          </div>
        </div>
      </section>
    </main>
  );
}

function StatusRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      {ok ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <XCircle className="h-5 w-5 text-rose-600" />}
    </div>
  );
}
