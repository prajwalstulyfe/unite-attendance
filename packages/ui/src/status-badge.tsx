import * as React from "react";

export type StatusType =
  | "valid"
  | "invalid"
  | "flagged"
  | "present"
  | "absent"
  | "late"
  | "leave"
  | "active"
  | "inactive";

interface StatusBadgeProps {
  status: StatusType | string;
  label?: string;
  className?: string;
}

const statusStyles: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  valid: { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/20", dot: "bg-emerald-500" },
  present: { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/20", dot: "bg-emerald-500" },
  active: { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/20", dot: "bg-emerald-500" },

  late: { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20", dot: "bg-amber-500" },
  flagged: { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20", dot: "bg-amber-500" },

  invalid: { bg: "bg-rose-500/10", text: "text-rose-500", border: "border-rose-500/20", dot: "bg-rose-500" },
  absent: { bg: "bg-rose-500/10", text: "text-rose-500", border: "border-rose-500/20", dot: "bg-rose-500" },
  inactive: { bg: "bg-zinc-500/10", text: "text-zinc-400", border: "border-zinc-500/20", dot: "bg-zinc-400" },

  leave: { bg: "bg-sky-500/10", text: "text-sky-500", border: "border-sky-500/20", dot: "bg-sky-500" },
};

export function StatusBadge({ status, label, className = "" }: StatusBadgeProps) {
  const normalized = status.toLowerCase();
  const style = statusStyles[normalized] || {
    bg: "bg-zinc-500/10",
    text: "text-zinc-400",
    border: "border-zinc-500/20",
    dot: "bg-zinc-400",
  };

  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${style.bg} ${style.text} ${style.border} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {displayLabel}
    </span>
  );
}
