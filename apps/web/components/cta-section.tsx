"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { usePortalUrls } from "@/lib/use-portal-urls";

export function CtaSection() {
  const urls = usePortalUrls();

  return (
    <section className="py-24 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white border-t border-zinc-200 dark:border-zinc-800/80 transition-colors relative overflow-hidden">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-75 bg-indigo-500/10 dark:bg-indigo-500/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-6 relative z-10 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold shadow-xs">
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" /> Instant 10-Minute Setup
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white max-w-3xl mx-auto">
          Ready to Modernize Your Attendance?
        </h2>

        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-medium max-w-xl mx-auto leading-relaxed">
          Join hundreds of institutions replacing manual registers with Unite Attendance today.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`${urls.admin}/register`}
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            Start 14-Day Free Trial <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href={`${urls.admin}/login`}
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            Admin Portal Sign In
          </a>
        </div>
      </div>
    </section>
  );
}
