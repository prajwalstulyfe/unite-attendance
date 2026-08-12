"use client";

import { ArrowRight } from "lucide-react";
import { usePortalUrls } from "@/lib/use-portal-urls";

export function CtaSection() {
  const urls = usePortalUrls();

  return (
    <section className="py-20 px-6 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="p-8 sm:p-12 md:p-16 rounded-3xl bg-linear-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 border border-indigo-500/20 text-center relative overflow-hidden space-y-6 shadow-xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Ready to Modernize Your Attendance?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium">
              Join hundreds of institutions replacing manual registers with Unite Attendance today.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`${urls.admin}/register`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 transition-all cursor-pointer"
            >
              Start 14-Day Free Trial <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={`${urls.admin}/login`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              Admin Portal Sign In
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
