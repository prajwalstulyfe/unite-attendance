"use client";

import { PageHeader } from "@repo/ui";
import { Shield, Search, Filter, Lock, FileText, Download } from "lucide-react";
import { toast } from "sonner";

export default function AuditLogsPage() {
  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Global Platform Audit Logs"
        description="Immutable system activity trails, admin actions, and authorization events"
        breadcrumbs={[
          { label: "Super Admin", href: "/super-admin/dashboard" },
          { label: "Audit Logs" },
        ]}
        action={
          <button
            onClick={() => toast.success("Exported Audit Log CSV!")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors border border-zinc-200 dark:border-zinc-700"
          >
            <Download className="h-4 w-4" /> Export CSV Log
          </button>
        }
      />

      <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-500" /> Platform Security Event Log
          </h3>
          <span className="text-xs font-mono text-zinc-400">Total Events: 1,842</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-600 dark:text-zinc-400">
            <thead className="bg-zinc-100 dark:bg-zinc-800/60 uppercase tracking-wider text-[10px] text-zinc-500 font-semibold border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Actor / Admin</th>
                <th className="px-4 py-3">Action Performed</th>
                <th className="px-4 py-3">Target Resource</th>
                <th className="px-4 py-3 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                <td className="px-4 py-3.5 font-mono text-[11px]">2026-07-29 10:28:14</td>
                <td className="px-4 py-3.5 font-semibold text-zinc-900 dark:text-white">admin@unite-attendance.com</td>
                <td className="px-4 py-3.5">Provisioned New Organization</td>
                <td className="px-4 py-3.5 font-mono text-indigo-600 dark:text-indigo-400">org_acme_corp</td>
                <td className="px-4 py-3.5 text-right font-mono text-[11px]">192.168.1.100</td>
              </tr>
              <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                <td className="px-4 py-3.5 font-mono text-[11px]">2026-07-29 09:45:02</td>
                <td className="px-4 py-3.5 font-semibold text-zinc-900 dark:text-white">john@acme.com</td>
                <td className="px-4 py-3.5">Updated Geofence Radius</td>
                <td className="px-4 py-3.5 font-mono text-indigo-600 dark:text-indigo-400">rule_hq_geofence</td>
                <td className="px-4 py-3.5 text-right font-mono text-[11px]">182.74.12.4</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
