"use client";

import { ArrowRight } from "lucide-react";
import { usePortalUrls } from "@/lib/use-portal-urls";

export function CtaSection() {
  const urls = usePortalUrls();

  return (
    <section className="py-20 px-6 md:px-12 bg-gradient-to-r from-indigo-900/30 via-zinc-950 to-purple-900/30 border-t border-zinc-800 text-center">
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Ready to Modernize Your Attendance?
        </h2>
        <p className="text-sm text-zinc-400 max-w-xl mx-auto font-medium">
          Join hundreds of institutions replacing manual registers with Unite Attendance today.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={`${urls.admin}/register`}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-2xl shadow-indigo-600/40 transition-all"
          >
            Start Free Trial Now <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href={`${urls.admin}/login`}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-extrabold text-sm transition-all"
          >
            Admin Portal Sign In
          </a>
        </div>
      </div>
    </section>
  );
}
