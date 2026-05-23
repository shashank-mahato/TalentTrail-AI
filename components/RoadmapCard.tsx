import type { RoadmapDay } from "@/lib/types";
import { Clock, Flag, Sparkles } from "lucide-react";

interface RoadmapCardProps {
  day: RoadmapDay;
}

export function RoadmapCard({ day }: RoadmapCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-white">
          Day {day.day}
        </span>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {day.skill}
        </span>
        <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
          {day.difficulty}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-950">{day.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{day.description}</p>
      <div className="mt-5 space-y-3 text-sm text-slate-600">
        <div className="flex gap-3">
          <Flag className="mt-0.5 h-4 w-4 shrink-0 text-trail-indigo" />
          <span>{day.proofRequired}</span>
        </div>
        <div className="flex gap-3">
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-trail-mint" />
          <span>{day.estimatedTime}</span>
        </div>
      </div>
      <button className="focus-ring mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-white hover:text-trail-indigo">
        <Sparkles className="h-4 w-4" />
        Mark as planned
      </button>
    </article>
  );
}
