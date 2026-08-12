import * as React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  trend,
  icon,
  className = "",
}: StatsCardProps) {
  return (
    <div className={`rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 p-3.5 shadow-xs transition-all hover:border-zinc-300 dark:hover:border-zinc-700 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 truncate">{title}</span>
        {icon && <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/60 text-zinc-500 dark:text-zinc-400 shrink-0">{icon}</div>}
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">{value}</span>
        {trend && (
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
              trend.isPositive
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
            }`}
          >
            {trend.isPositive ? "+" : ""}{trend.value}
          </span>
        )}
      </div>
      {description && <p className="mt-1 text-[10px] text-zinc-400 dark:text-zinc-500 truncate">{description}</p>}
    </div>
  );
}
