"use client";

import { Bell } from "lucide-react";
import { AuthGate } from "@/components/AuthGate";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { useTalentTrailData } from "@/lib/useTalentTrailData";

export default function NotificationsPage() {
  return (
    <AuthGate>
      <NotificationsContent />
    </AuthGate>
  );
}

function NotificationsContent() {
  const { notifications, loading, supabase, refresh } = useTalentTrailData();

  async function markRead(id: string) {
    if (!supabase) return;
    await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", id);
    await refresh();
  }

  if (loading) return <main className="mx-auto max-w-7xl px-4 py-10 text-sm text-slate-600">Loading notifications...</main>;

  return (
    <main>
      <PageHeader
        eyebrow="Notifications"
        title="Realtime career trail updates"
        description="Notifications appear when resume analysis completes, roadmap is ready, proof review finishes, interview feedback arrives, resume suggestions are ready, and job matches are found."
      />
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {notifications.length ? (
          <div className="grid gap-4">
            {notifications.map((item) => (
              <article key={item.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                      <Bell className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-950">{item.title}</h2>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{item.body}</p>
                      <p className="mt-2 text-xs font-semibold text-slate-400">{new Date(item.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  {!item.read_at ? (
                    <button onClick={() => markRead(item.id)} className="focus-ring rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:text-trail-indigo">
                      Mark read
                    </button>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">Read</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No notifications yet"
            description="TalentTrail AI will notify you as agents complete resume analysis, missions, proof reviews, interviews, and job searches."
          />
        )}
      </section>
    </main>
  );
}
