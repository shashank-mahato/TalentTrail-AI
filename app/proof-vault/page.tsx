"use client";

import { FormEvent, useMemo, useState } from "react";
import { Suspense } from "react";
import { Loader2, UploadCloud } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { AuthGate } from "@/components/AuthGate";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/lib/useAuth";
import { useTalentTrailData } from "@/lib/useTalentTrailData";

export default function ProofVaultPage() {
  return (
    <AuthGate>
      <Suspense fallback={<ProofVaultFallback />}>
        <ProofVaultContent />
      </Suspense>
    </AuthGate>
  );
}

function ProofVaultContent() {
  const params = useSearchParams();
  const { accessToken } = useAuth();
  const { analysis, missionRows, proofItems, loading, refresh } = useTalentTrailData();
  const missionParam = params.get("mission") ?? "";
  const [missionId, setMissionId] = useState(missionParam);
  const [proofUrl, setProofUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("");

  const selectedMission = useMemo(
    () => missionRows.find((mission) => mission.id === missionId),
    [missionId, missionRows]
  );

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken || !analysis) return;
    setWorking(true);
    setMessage("");
    const formData = new FormData();
    if (file) formData.append("proof", file);
    formData.append("proofUrl", proofUrl);
    formData.append("notes", notes);
    formData.append("missionId", missionId);
    formData.append("missionTitle", selectedMission?.title ?? "General proof submission");
    formData.append("missionDescription", selectedMission?.description ?? "");
    formData.append("targetRole", analysis.roadmap.targetRole);

    const response = await fetch("/api/ai/review-proof", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData
    });
    const payload = await response.json().catch(() => null);
    setWorking(false);
    if (!response.ok) {
      setMessage(payload?.message ?? "Proof review failed.");
      return;
    }
    setMessage("ProofVault reviewed your proof and saved the result.");
    setProofUrl("");
    setNotes("");
    setFile(null);
    await refresh();
  }

  if (loading) return <main className="mx-auto max-w-7xl px-4 py-10 text-sm text-slate-600">Loading ProofVault...</main>;

  if (!analysis) {
    return (
      <main>
        <PageHeader
          eyebrow="ProofVault"
          title="Prove your skills, not just list them"
          description="Upload your resume and generate missions before adding proof."
        />
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <EmptyState
            title="No missions available"
            description="ProofVault connects proof-of-work to missions generated from your resume."
            actionHref="/resume-upload"
            actionLabel="Upload resume"
          />
        </section>
      </main>
    );
  }

  return (
    <main>
      <PageHeader
        eyebrow="ProofVault"
        title="Upload proof-of-work for mission review"
        description="Store proof files, links, GitHub, LinkedIn, portfolio, Google Drive, Kaggle, screenshots, and notes. ProofReview evaluates only what you provide."
      />

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <form onSubmit={submit} className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold text-slate-950">Submit proof</h2>
          <label className="mt-5 block">
            <span className="text-sm font-semibold text-slate-700">Mission</span>
            <select
              value={missionId}
              onChange={(event) => setMissionId(event.target.value)}
              className="focus-ring mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm"
            >
              <option value="">General proof</option>
              {missionRows.map((mission) => (
                <option key={mission.id} value={mission.id}>
                  Day {mission.day_number}: {mission.title}
                </option>
              ))}
            </select>
          </label>
          <label className="mt-5 block">
            <span className="text-sm font-semibold text-slate-700">Proof file</span>
            <input
              type="file"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="focus-ring mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm"
            />
          </label>
          <label className="mt-5 block">
            <span className="text-sm font-semibold text-slate-700">Proof link</span>
            <input
              value={proofUrl}
              onChange={(event) => setProofUrl(event.target.value)}
              placeholder="GitHub, LinkedIn, portfolio, Google Drive, Kaggle, or live URL"
              className="focus-ring mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm"
            />
          </label>
          <label className="mt-5 block">
            <span className="text-sm font-semibold text-slate-700">Description for AI review</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="focus-ring mt-2 min-h-32 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm"
            />
          </label>
          {message ? <p className="mt-4 rounded-lg bg-blue-50 p-3 text-sm font-medium text-blue-800">{message}</p> : null}
          <button
            type="submit"
            disabled={working}
            className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-trail-indigo disabled:opacity-70"
          >
            {working ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
            Upload and Review Proof
          </button>
        </form>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold text-slate-950">Proof history</h2>
          <div className="mt-5 grid gap-4">
            {proofItems.length ? (
              proofItems.map((item) => (
                <article key={item.id} className="rounded-lg bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-slate-950">{item.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">{item.proof_type} · {item.review_status}</p>
                    </div>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </article>
              ))
            ) : (
              <EmptyState
                title="No proof uploaded yet"
                description="Submit proof for a mission to build a verified portfolio trail."
              />
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

function ProofVaultFallback() {
  return <main className="mx-auto max-w-7xl px-4 py-10 text-sm text-slate-600">Loading ProofVault...</main>;
}
