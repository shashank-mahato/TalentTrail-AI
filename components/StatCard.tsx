import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon?: ReactNode;
  label: string;
  value: string;
  helper?: string;
  tone?: "blue" | "violet" | "mint" | "amber" | "slate";
}

const toneClasses = {
  blue: "bg-blue-50 text-blue-700",
  violet: "bg-violet-50 text-violet-700",
  mint: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  slate: "bg-slate-100 text-slate-700"
};

export function StatCard({ icon, label, value, helper, tone = "blue" }: StatCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{value}</p>
        </div>
        {icon ? (
          <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl", toneClasses[tone])}>
            {icon}
          </div>
        ) : null}
      </div>
      {helper ? <p className="mt-4 text-sm leading-6 text-slate-600">{helper}</p> : null}
    </article>
  );
}
