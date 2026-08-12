import * as React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  className?: string;
}

export function PageHeader({
  title,
  description,
  action,
  breadcrumbs,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`mb-4 pb-2 border-b border-zinc-200/80 dark:border-zinc-800/80 ${className}`}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-[11px] text-zinc-400 mb-1.5">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-zinc-300 dark:text-zinc-600">/</span>}
              {crumb.href ? (
                <a href={crumb.href} className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors font-medium">
                  {crumb.label}
                </a>
              ) : (
                <span className="text-zinc-600 dark:text-zinc-400 font-medium">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">{title}</h1>
          {description && <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{description}</p>}
        </div>
        {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
      </div>
    </div>
  );
}
