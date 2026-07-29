"use client";

import { PageHeader, StatsCard } from "@repo/ui";
import { Building2, Users, CreditCard, ArrowUpRight, Sparkles, Activity, ExternalLink, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useUIStore } from "@/lib/use-ui-store";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

const platformChartData = [
  { month: "Jan", mrr: 12400 },
  { month: "Feb", mrr: 15200 },
  { month: "Mar", mrr: 18100 },
  { month: "Apr", mrr: 21500 },
  { month: "May", mrr: 24850 },
];

const mockOrgs = [
  { id: "org-1", name: "Acme Corporation", slug: "acme-corp", plan: "PRO", members: 168, mrr: "$499/mo" },
  { id: "org-2", name: "Stulyfe Education", slug: "stulyfe-edu", plan: "ENTERPRISE", members: 4200, mrr: "$2,499/mo" },
  { id: "org-3", name: "CyberTech Innovations", slug: "cybertech", plan: "STARTER", members: 45, mrr: "$149/mo" },
  { id: "org-4", name: "Global Logistics Ltd", slug: "global-logistics", plan: "PRO", members: 890, mrr: "$799/mo" },
];

export default function SuperAdminDashboardPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme !== "light";
  const { setActiveOrg, setPortalMode } = useUIStore();

  const handleOpenWorkspace = (name: string, slug: string) => {
    setActiveOrg(name, slug);
    setPortalMode("ORG");
    toast.success(`Switched active workspace context to ${name}`);
    router.push("/dashboard");
  };

  return (
    <div className="space-y-6 w-full">
      {/* Page Header */}
      <PageHeader
        title="Super Admin Platform Control Center"
        description="Global multi-tenant telemetry, subscription metrics, and organization management"
        action={
          <Link
            href="/super-admin/organizations"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Building2 className="h-4 w-4" /> Manage All Organizations
          </Link>
        }
      />

      {/* Global Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Organizations"
          value="24"
          description="Active tenant workspaces"
          trend={{ value: "18.5%", isPositive: true }}
          icon={<Building2 className="h-5 w-5 text-indigo-500" />}
        />
        <StatsCard
          title="Platform Members"
          value="14,250"
          description="Across all organizations"
          trend={{ value: "24.2%", isPositive: true }}
          icon={<Users className="h-5 w-5 text-emerald-500" />}
        />
        <StatsCard
          title="Today Check-ins"
          value="11,890"
          description="Live verified telemetry"
          trend={{ value: "92.4%", isPositive: true }}
          icon={<Activity className="h-5 w-5 text-purple-500" />}
        />
        <StatsCard
          title="Monthly Revenue (MRR)"
          value="$24,850"
          description="Active SaaS subscriptions"
          trend={{ value: "15.4%", isPositive: true }}
          icon={<CreditCard className="h-5 w-5 text-amber-500" />}
        />
      </div>

      {/* Side-by-Side Row: MRR Graph (Left) & Active Tenant Workspaces Table (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        {/* Revenue & Growth Telemetry Graph (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-500" /> Platform MRR & Growth Trajectory
              </h3>
              <p className="text-xs text-zinc-500">Monthly recurring revenue trends across enterprise tenants</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              +15.4% YoY
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={platformChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#27272a" : "#f4f4f5"} />
                <XAxis dataKey="month" stroke={isDark ? "#71717a" : "#64748b"} fontSize={12} tickLine={{ stroke: isDark ? "#3f3f46" : "#cbd5e1" }} axisLine={{ stroke: isDark ? "#3f3f46" : "#cbd5e1", strokeWidth: 1 }} dy={6} />
                <YAxis stroke={isDark ? "#71717a" : "#64748b"} fontSize={12} tickLine={{ stroke: isDark ? "#3f3f46" : "#cbd5e1" }} axisLine={{ stroke: isDark ? "#3f3f46" : "#cbd5e1", strokeWidth: 1 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#18181b" : "#ffffff",
                    borderColor: isDark ? "#27272a" : "#e4e4e7",
                    color: isDark ? "#ffffff" : "#09090b",
                    borderRadius: "10px",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                />
                <Area type="monotone" dataKey="mrr" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#mrrGrad)" name="MRR ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Organizations Directory Table (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Building2 className="h-5 w-5 text-indigo-500" /> Active Workspaces
            </h3>
            <Link href="/super-admin/organizations" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
              View All 24 <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs text-zinc-600 dark:text-zinc-400">
              <thead className="bg-zinc-100 dark:bg-zinc-800/60 uppercase tracking-wider text-[10px] text-zinc-500 font-semibold border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="px-3 py-2.5">Organization</th>
                  <th className="px-3 py-2.5">Plan</th>
                  <th className="px-3 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {mockOrgs.map((org) => (
                  <tr key={org.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="px-3 py-3 font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-indigo-600/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                        {org.name[0]}
                      </div>
                      <div className="truncate">
                        <p className="truncate font-semibold">{org.name}</p>
                        <p className="text-[10px] text-zinc-400 font-mono">{org.members} members</p>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        {org.plan}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenWorkspace(org.name, org.slug)}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-[10px] font-semibold text-white rounded-lg transition-colors shadow-sm"
                          title="Open Workspace"
                        >
                          <ExternalLink className="h-3 w-3" /> Open
                        </button>
                        <button
                          onClick={() => toast.info(`Edit ${org.name} modal opened`)}
                          className="p-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 transition-colors"
                          title="Edit Organization"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete organization ${org.name}?`)) {
                              toast.success(`Deleted organization ${org.name}`);
                            }
                          }}
                          className="p-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-rose-50 dark:hover:bg-rose-500/20 text-zinc-600 dark:text-zinc-300 hover:text-rose-600 transition-colors"
                          title="Delete Organization"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
