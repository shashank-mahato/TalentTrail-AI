import type { SkillGap } from "@/lib/types";
import { ProgressBar } from "@/components/ProgressBar";
import { cn } from "@/lib/utils";

interface SkillGapCardProps {
  gap: SkillGap;
}

const priorityClass = {
  High: "bg-rose-50 text-rose-700 ring-rose-100",
  Medium: "bg-amber-50 text-amber-700 ring-amber-100",
  Low: "bg-emerald-50 text-emerald-700 ring-emerald-100"
};

export function SkillGapCard({ gap }: SkillGapCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-slate-950">{gap.skill}</h3>
          <p className="mt-1 text-sm text-slate-500">Target level {gap.requiredLevel}%</p>
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold ring-1",
            priorityClass[gap.priority]
          )}
        >
          {gap.priority}
        </span>
      </div>
      <div className="mt-5">
        <div className="mb-2 flex justify-between text-xs font-semibold text-slate-500">
          <span>Current</span>
          <span>{gap.currentLevel}%</span>
        </div>
        <ProgressBar value={gap.currentLevel} />
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{gap.proofProject}</p>
    </article>
  );
}
