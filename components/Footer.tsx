import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <p className="font-bold text-slate-950">TalentTrail AI</p>
            <p className="text-sm text-slate-500">Your personalized trail from skills to career.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-500">
          <Link href="/about" className="hover:text-trail-indigo">
            About
          </Link>
          <Link href="/dashboard" className="hover:text-trail-indigo">
            Dashboard
          </Link>
          <Link href="/career-twin" className="hover:text-trail-indigo">
            CareerTwin
          </Link>
        </div>
      </div>
    </footer>
  );
}
