import * as React from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 p-8 text-center ${className}`}
    >
      {icon && <div className="mb-4 rounded-full bg-zinc-900 border border-zinc-800 p-3 text-zinc-400">{icon}</div>}
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm text-zinc-400 max-w-sm">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
