import type { RecommendedRole } from "@/lib/types";
import { ProgressBar } from "@/components/ProgressBar";
import { BadgeCheck } from "lucide-react";

interface RoleCardProps {
  role: RecommendedRole;
}

export function RoleCard({ role }: RoleCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-slate-950">{role.role}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{role.reason}</p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
          <BadgeCheck className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-5">
        <div className="mb-2 flex justify-between text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          <span>Match</span>
          <span>{role.match}%</span>
        </div>
        <ProgressBar value={role.match} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {role.missingSkills.map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
          >
            {skill}
          </span>
        ))}
      </div>
    </article>
  );
}
