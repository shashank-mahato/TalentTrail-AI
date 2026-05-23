import type { CareerTwinPath } from "@/lib/types";
import { AlertTriangle, ArrowRight, BriefcaseBusiness } from "lucide-react";
import { ProgressBar } from "@/components/ProgressBar";

interface CareerTwinCardProps {
  path: CareerTwinPath;
}

export function CareerTwinCard({ path }: CareerTwinCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-950">{path.role}</h3>
          <p className="mt-1 text-sm font-semibold text-trail-indigo">{path.difficulty}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
          <BriefcaseBusiness className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-5">
        <div className="mb-2 flex justify-between text-sm font-semibold text-slate-600">
          <span>Readiness</span>
          <span>{path.readiness}%</span>
        </div>
        <ProgressBar value={path.readiness} />
      </div>
      <p className="mt-5 text-sm leading-6 text-slate-600">{path.fitReason}</p>
      <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
        <div className="mb-2 flex items-center gap-2 font-semibold">
          <AlertTriangle className="h-4 w-4" />
          Risk warning
        </div>
        <p className="leading-6">{path.riskWarning}</p>
      </div>
      <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <p className="font-semibold text-slate-950">Missing skills</p>
          <ul className="mt-2 space-y-1 text-slate-600">
            {path.missingSkills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-slate-950">Required projects</p>
          <ul className="mt-2 space-y-1 text-slate-600">
            {path.requiredProjects.map((project) => (
              <li key={project}>{project}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
        <p className="font-semibold text-slate-950">Estimated readiness time</p>
        <p className="mt-1">{path.estimatedTime}</p>
      </div>
      <div className="mt-5 flex items-start gap-3 text-sm font-semibold text-trail-indigo">
        <ArrowRight className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{path.bestNextStep}</span>
      </div>
    </article>
  );
}
