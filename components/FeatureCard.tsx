import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:border-trail-indigo/30 hover:shadow-glow">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/10">
        {icon}
      </div>
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
        <ArrowUpRight className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:text-trail-indigo" />
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  );
}
