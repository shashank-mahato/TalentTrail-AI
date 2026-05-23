import { Bot, CheckCircle2 } from "lucide-react";

const defaultEvents = [
  "TrailScan analyzed your profile",
  "RoleMatch found 3 suitable roles",
  "GapMap detected priority skill gaps",
  "MissionTrail created your first mission",
  "ResumeForge is ready to improve your resume",
  "InterviewArena generated role-specific practice"
];

interface AgentTimelineProps {
  events?: string[];
}

export function AgentTimeline({ events = defaultEvents }: AgentTimelineProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-950">Agent Activity</h2>
          <p className="text-sm text-slate-500">Your mentor agents working in sequence</p>
        </div>
      </div>
      <div className="space-y-4">
        {events.map((event, index) => (
          <div key={event} className="flex gap-3">
            <div className="flex flex-col items-center">
              <CheckCircle2 className="h-5 w-5 text-trail-mint" />
              {index < events.length - 1 ? <div className="mt-2 h-8 w-px bg-slate-200" /> : null}
            </div>
            <p className="pt-0.5 text-sm font-medium text-slate-700">{event}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
