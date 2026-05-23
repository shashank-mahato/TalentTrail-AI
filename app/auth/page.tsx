"use client";

import { FormEvent, useState } from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, LockKeyhole, Sparkles } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function AuthPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-7xl px-4 py-14 text-sm text-slate-600">Loading auth...</main>}>
      <AuthContent />
    </Suspense>
  );
}

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const supabase = getSupabaseBrowserClient();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!supabase) {
      setMessage("Supabase env variables are required before authentication can work.");
      return;
    }

    setLoading(true);
    const authCall =
      mode === "login"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password });

    const { error } = await authCall;
    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push(next);
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
      <section className="rounded-lg bg-slate-950 p-8 text-white shadow-glow">
        <Sparkles className="h-8 w-8 text-blue-200" />
        <h1 className="mt-5 text-4xl font-bold tracking-tight">TalentTrail AI login</h1>
        <p className="mt-4 text-sm leading-6 text-slate-300">
          Sign up or log in to upload your real resume, generate a resume-powered career diagnosis,
          save missions, upload proof, and track your progress in Supabase.
        </p>
        <div className="mt-8 grid gap-3 text-sm text-slate-200">
          <div className="rounded-lg bg-white/10 p-4">Authenticated resume intelligence</div>
          <div className="rounded-lg bg-white/10 p-4">Private Supabase rows and storage paths</div>
          <div className="rounded-lg bg-white/10 p-4">Realtime dashboard updates</div>
        </div>
      </section>

      <form onSubmit={submit} className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-950">
              {mode === "login" ? "Log in" : "Create account"}
            </h2>
            <p className="text-sm text-slate-500">Use Supabase Auth email and password.</p>
          </div>
        </div>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="focus-ring mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm"
            required
          />
        </label>
        <label className="mt-5 block">
          <span className="text-sm font-semibold text-slate-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="focus-ring mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm"
            required
            minLength={6}
          />
        </label>

        {message ? (
          <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm font-medium text-amber-800">
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-trail-indigo disabled:opacity-70"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {mode === "login" ? "Log in" : "Sign up"}
        </button>
        <button
          type="button"
          onClick={() => setMode((value) => (value === "login" ? "signup" : "login"))}
          className="mt-4 text-sm font-bold text-trail-indigo hover:text-slate-950"
        >
          {mode === "login" ? "Need an account? Sign up" : "Already have an account? Log in"}
        </button>
      </form>
    </main>
  );
}
