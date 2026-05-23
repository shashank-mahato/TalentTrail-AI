import type { Mission } from "@/lib/types";
import { CheckCircle2, Clock, Target } from "lucide-react";

interface MissionCardProps {
  mission: Mission;
}

export function MissionCard({ mission }: MissionCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-trail-blue to-trail-violet text-white">
          <Target className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-trail-indigo">
            Today&apos;s Mission
          </p>
          <h3 className="text-xl font-bold text-slate-950">{mission.title}</h3>
        </div>
      </div>
      <p className="mt-5 text-sm leading-6 text-slate-600">{mission.description}</p>
      <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-2xl bg-blue-50 p-4 text-blue-900">
          <div className="mb-2 flex items-center gap-2 font-semibold">
            <CheckCircle2 className="h-4 w-4" />
            Proof
          </div>
          <p className="leading-6">{mission.proofRequired}</p>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-900">
          <div className="mb-2 flex items-center gap-2 font-semibold">
            <Clock className="h-4 w-4" />
            Time
          </div>
          <p>{mission.estimatedTime}</p>
        </div>
      </div>
    </article>
  );
}
