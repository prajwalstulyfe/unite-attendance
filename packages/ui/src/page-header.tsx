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
    <div className={`mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800 ${className}`}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span>/</span>}
              {crumb.href ? (
                <a href={crumb.href} className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">
                  {crumb.label}
                </a>
              ) : (
                <span className="text-zinc-600 dark:text-zinc-400">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">{title}</h1>
          {description && <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>}
        </div>
        {action && <div className="flex items-center gap-3 shrink-0">{action}</div>}
      </div>
    </div>
  );
}
