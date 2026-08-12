"use client";

import { Building2 } from "lucide-react";

interface NoOrgSelectedProps {
  title?: string;
  description?: string;
}

export function NoOrgSelected({
  title = "No Organization Selected",
  description = "Please select an organization from the Organization Selector at the top to access its live workspace.",
}: NoOrgSelectedProps) {
  return (
    <div className="py-24 flex flex-col items-center justify-center text-center space-y-4 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/40 p-8 shadow-sm">
      <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner">
        <Building2 className="h-8 w-8" />
      </div>
      <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{title}</h2>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md leading-relaxed">{description}</p>
    </div>
  );
}
