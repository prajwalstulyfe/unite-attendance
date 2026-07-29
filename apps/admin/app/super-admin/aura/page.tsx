"use client";

import { PageHeader, StatsCard } from "@repo/ui";
import { Sparkles, ShieldAlert, Cpu, Activity, AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function AuraAiPage() {
  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Aura AI Anomaly & Fraud Telemetry Engine"
        description="Machine learning model metrics, proxy detection flags, and real-time risk scores"
        breadcrumbs={[
          { label: "Super Admin", href: "/super-admin/dashboard" },
          { label: "Aura AI Control" },
        ]}
        action={
          <button
            onClick={() => toast.success("Aura AI Model re-trained successfully!")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all"
          >
            <RefreshCw className="h-4 w-4" /> Trigger Model Re-Index
          </button>
        }
      />

      {/* AI Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Aura Threat Score"
          value="99.4%"
          description="Model detection accuracy"
          trend={{ value: "+0.3%", isPositive: true }}
          icon={<Sparkles className="h-5 w-5 text-indigo-500" />}
        />
        <StatsCard
          title="Flagged Scans Today"
          value="14"
          description="GPS / TOTP anomalies"
          trend={{ value: "-4.2%", isPositive: true }}
          icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
        />
        <StatsCard
          title="Prevented Proxy Scans"
          value="142"
          description="Screenshot anti-spoof blocks"
          trend={{ value: "+12.1%", isPositive: true }}
          icon={<ShieldAlert className="h-5 w-5 text-rose-500" />}
        />
        <StatsCard
          title="Inference Latency"
          value="18ms"
          description="Average response speed"
          trend={{ value: "-2ms", isPositive: true }}
          icon={<Cpu className="h-5 w-5 text-emerald-500" />}
        />
      </div>

      {/* AI Risk Logs Table */}
      <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <Activity className="h-5 w-5 text-indigo-500" /> Real-time Anomaly Signals
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-600 dark:text-zinc-400">
            <thead className="bg-zinc-100 dark:bg-zinc-800/60 uppercase tracking-wider text-[10px] text-zinc-500 font-semibold border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Organization</th>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Anomaly Type</th>
                <th className="px-4 py-3">Risk Level</th>
                <th className="px-4 py-3 text-right">Action Taken</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                <td className="px-4 py-3.5 font-mono text-[11px]">10:24:12 AM</td>
                <td className="px-4 py-3.5 font-semibold text-zinc-900 dark:text-white">Acme Corporation</td>
                <td className="px-4 py-3.5 font-medium">Bob Williams</td>
                <td className="px-4 py-3.5">TOTP Expiration Mismatch</td>
                <td className="px-4 py-3.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">MEDIUM</span>
                </td>
                <td className="px-4 py-3.5 text-right font-semibold text-emerald-600">FLAGGED & LOGGED</td>
              </tr>
              <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                <td className="px-4 py-3.5 font-mono text-[11px]">10:18:45 AM</td>
                <td className="px-4 py-3.5 font-semibold text-zinc-900 dark:text-white">Stulyfe Education</td>
                <td className="px-4 py-3.5 font-medium">Unknown Device</td>
                <td className="px-4 py-3.5">Geofence Out of Bounds (4.2km away)</td>
                <td className="px-4 py-3.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">HIGH</span>
                </td>
                <td className="px-4 py-3.5 text-right font-semibold text-rose-600">BLOCKED AUTOMATICALLY</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
