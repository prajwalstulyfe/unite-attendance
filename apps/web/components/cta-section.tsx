"use client";

import { ArrowRight } from "lucide-react";
import { usePortalUrls } from "@/lib/use-portal-urls";

export function CtaSection() {
  const urls = usePortalUrls();

  return (
    <section className="py-20 px-6 md:px-12 bg-linear-to-r from-indigo-50 via-zinc-50 to-purple-50 dark:from-indigo-900/30 dark:via-zinc-950 dark:to-purple-900/30 border-t border-zinc-200 dark:border-zinc-800 text-center transition-colors">
      <div className="max-w-7xl mx-auto space-y-5">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Ready to Modernize Your Attendance?
        </h2>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto font-medium">
          Join hundreds of institutions replacing manual registers with Unite Attendance today.
        </p>
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
    </section>
  );
}
