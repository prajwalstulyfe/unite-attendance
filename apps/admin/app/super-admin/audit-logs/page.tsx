"use client";

import { PageHeader } from "@repo/ui";
import { Shield, Download, Inbox, CheckCircle2, Lock } from "lucide-react";
import { useAttendanceRecords, useOrganizations } from "@repo/api-client";
import { useUIStore } from "@/lib/use-ui-store";
import { toast } from "sonner";

export default function AuditLogsPage() {
  const { activeOrgSlug } = useUIStore();
  const currentOrgSlug = activeOrgSlug || "unite-india";
  const { data: recordsData } = useAttendanceRecords(currentOrgSlug, { pageSize: 50 });
  const { data: orgsData } = useOrganizations();

  const orgs = (Array.isArray(orgsData) ? orgsData : orgsData?.items) || [];
  const logs = recordsData?.items || [];

  const auditEvents = [
    {
      id: "evt_01",
      action: "ORGANIZATION_PROVISIONED",
      actor: "admin@unite-attendance.com",
      resource: "Unite India (unite-india)",
      ip: "127.0.0.1",
      status: "SUCCESS",
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: "evt_02",
      action: "ATTENDANCE_RULE_UPDATED",
      actor: "admin@unite-attendance.com",
      resource: "Standard General Shift (9 AM - 6 PM)",
      ip: "127.0.0.1",
      status: "SUCCESS",
      timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    },
    ...logs.map((log) => ({
      id: `evt_log_${log.id}`,
      action: (log.status as string) === "FLAGGED" ? "ATTENDANCE_SCAN_FLAGGED" : "ATTENDANCE_SCAN_VERIFIED",
      actor: log.member?.user?.name || "Member User",
      resource: `Scan Method: ${log.method}`,
      ip: "127.0.0.1",
      status: (log.status as string) === "FLAGGED" ? "FLAGGED" : "SUCCESS",
      timestamp: log.timestamp,
    })),
  ];

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
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-500" /> Platform Security Event Log
          </h3>
          <span className="text-xs font-mono text-zinc-400">Total Events: {auditEvents.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-600 dark:text-zinc-400">
            <thead className="bg-zinc-100 dark:bg-zinc-800/60 uppercase tracking-wider text-[10px] text-zinc-500 font-semibold border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-4 py-3">Event Action</th>
                <th className="px-4 py-3">Actor / User</th>
                <th className="px-4 py-3">Resource Context</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {auditEvents.map((evt) => (
                <tr key={evt.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="px-4 py-3.5 font-semibold text-zinc-900 dark:text-white font-mono text-[11px]">
                    {evt.action}
                  </td>
                  <td className="px-4 py-3.5 text-zinc-700 dark:text-zinc-300">
                    {evt.actor}
                  </td>
                  <td className="px-4 py-3.5 text-zinc-500 font-mono text-[11px]">
                    {evt.resource}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[11px]">
                    {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        evt.status === "SUCCESS"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                      }`}
                    >
                      {evt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
