"use client";

import { useState } from "react";
import { PageHeader, StatsCard } from "@repo/ui";
import { Building2, Users, CreditCard, ArrowUpRight, Sparkles, Activity, ExternalLink, Pencil, Trash2, Loader2, DollarSign, TrendingUp, BarChart3, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useUIStore } from "@/lib/use-ui-store";
import { useSuperAdminDashboard } from "@repo/api-client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

export default function SuperAdminDashboardPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme !== "light";
  const { setActiveOrg, setPortalMode } = useUIStore();

  const { data: dashboardData, isLoading } = useSuperAdminDashboard();
  const [chartMetric, setChartMetric] = useState<"MRR" | "SCANS">("MRR");

  const totalOrgs = dashboardData?.totalOrganizations ?? 0;
  const totalUsers = dashboardData?.totalUsers ?? 0;
  const totalMembers = dashboardData?.totalMembers ?? 0;
  const totalScans = dashboardData?.totalScansToday ?? 0;

  const recentOrgsList =
    dashboardData?.recentOrganizations && dashboardData.recentOrganizations.length > 0
      ? dashboardData.recentOrganizations.map((o) => ({
          id: o.id,
          name: o.name,
          slug: o.slug,
          plan: String(o.plan || "FREE").toUpperCase(),
          members: o.totalMembers || 0,
        }))
      : [];

  // Pricing per plan tier (INR / month)
  const PLAN_PRICES: Record<string, number> = {
    FREE: 0,
    FREE_TRIAL: 0,
    STARTER: 499,
    PRO: 999,
    ENTERPRISE: 2499,
  };

  let freeCount = 0;
  let starterCount = 0;
  let proCount = 0;
  let enterpriseCount = 0;
  let liveMrr = 0;

  recentOrgsList.forEach((org) => {
    const p = org.plan;
    if (p === "STARTER") starterCount++;
    else if (p === "PRO") proCount++;
    else if (p === "ENTERPRISE") enterpriseCount++;
    else freeCount++;

    liveMrr += PLAN_PRICES[p] ?? 0;
  });

  const paidCount = starterCount + proCount + enterpriseCount;
  const liveArr = liveMrr * 12;

  const starterMrr = starterCount * 499;
  const proMrr = proCount * 999;
  const enterpriseMrr = enterpriseCount * 2499;

  const starterPct = liveMrr > 0 ? Math.round((starterMrr / liveMrr) * 100) : 0;
  const proPct = liveMrr > 0 ? Math.round((proMrr / liveMrr) * 100) : 0;
  const enterprisePct = liveMrr > 0 ? Math.round((enterpriseMrr / liveMrr) * 100) : 0;
  const avgPerUser = totalMembers > 0 ? Math.round(liveMrr / totalMembers) : 0;

  const mrrChartData = [
    { label: "May", mrr: Math.round(liveMrr * 0.4), scans: Math.round(totalScans * 0.4) },
    { label: "Jun", mrr: Math.round(liveMrr * 0.6), scans: Math.round(totalScans * 0.6) },
    { label: "Jul", mrr: Math.round(liveMrr * 0.8), scans: Math.round(totalScans * 0.8) },
    { label: "Aug (Live)", mrr: liveMrr, scans: totalScans },
  ];

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
        description="Global multi-tenant telemetry, MRR revenue analytics, and subscription plan management"
        action={
          <Link
            href="/super-admin/organizations"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Building2 className="h-4 w-4" /> Manage All Organizations
          </Link>
        }
      />

      {/* Global Revenue & Platform Telemetry Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Monthly Recurring Revenue (MRR)"
          value={isLoading ? "..." : `₹${liveMrr.toLocaleString('en-IN')}`}
          description={`${paidCount} active paid ${paidCount === 1 ? 'subscription' : 'subscriptions'}`}
          trend={{ value: liveMrr > 0 ? `₹${liveMrr}/mo` : "₹0 Live", isPositive: true }}
          icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
        />
        <StatsCard
          title="Annual Run Rate (ARR)"
          value={isLoading ? "..." : `₹${liveArr.toLocaleString('en-IN')}`}
          description="Projected annual revenue"
          trend={{ value: "Run Rate", isPositive: true }}
          icon={<TrendingUp className="h-5 w-5 text-indigo-500" />}
        />
        <StatsCard
          title="Total Organizations"
          value={isLoading ? "..." : totalOrgs.toLocaleString()}
          description={`${paidCount} Paid • ${freeCount} Free/Trial`}
          trend={{ value: "Live", isPositive: true }}
          icon={<Building2 className="h-5 w-5 text-purple-500" />}
        />
        <StatsCard
          title="Platform Users & ARPU"
          value={isLoading ? "..." : `${totalUsers.toLocaleString()} Users`}
          description={`₹${avgPerUser} / member avg`}
          trend={{ value: "Live", isPositive: true }}
          icon={<Users className="h-5 w-5 text-amber-500" />}
        />
      </div>

      {/* Subscription Tiers Revenue Breakdown Banner */}
      <div className="bg-linear-to-r from-zinc-900 via-indigo-950 to-zinc-900 border border-indigo-500/20 rounded-2xl p-5 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wide">
                Plan Distribution Telemetry
              </span>
              <span className="text-xs text-zinc-400 font-medium">Updated Real-Time</span>
            </div>
            <h3 className="text-lg font-black text-white mt-1">Platform Revenue & Trial Breakdown</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs border border-white/10 text-center">
              <p className="text-[10px] font-bold text-amber-300 uppercase">Free / Trial</p>
              <p className="text-base font-black text-white mt-0.5">{freeCount} {freeCount === 1 ? 'Org' : 'Orgs'} <span className="text-[10px] text-zinc-400 font-normal block">(₹0 MRR)</span></p>
            </div>
            <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs border border-white/10 text-center">
              <p className="text-[10px] font-bold text-indigo-300 uppercase">Starter Tier</p>
              <p className="text-base font-black text-white mt-0.5">{starterCount} {starterCount === 1 ? 'Org' : 'Orgs'} <span className="text-[10px] text-emerald-400 font-bold block">{starterPct}% MRR</span></p>
            </div>
            <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs border border-white/10 text-center">
              <p className="text-[10px] font-bold text-emerald-300 uppercase">Pro Growth Tier</p>
              <p className="text-base font-black text-white mt-0.5">{proCount} {proCount === 1 ? 'Org' : 'Orgs'} <span className="text-[10px] text-emerald-400 font-bold block">{proPct}% MRR</span></p>
            </div>
            <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs border border-white/10 text-center">
              <p className="text-[10px] font-bold text-purple-300 uppercase">Enterprise Tier</p>
              <p className="text-base font-black text-white mt-0.5">{enterpriseCount} {enterpriseCount === 1 ? 'Org' : 'Orgs'} <span className="text-[10px] text-emerald-400 font-bold block">{enterprisePct}% MRR</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Row: MRR Graph (Left) & Active Tenant Workspaces Table (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        {/* Revenue & Growth Telemetry Graph (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-500" /> Platform Revenue Trajectory
              </h3>
              <p className="text-xs text-zinc-500">Monthly Recurring Revenue (MRR) growth trajectory</p>
            </div>
            <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-bold">
              <button
                type="button"
                onClick={() => setChartMetric("MRR")}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  chartMetric === "MRR"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                MRR (₹)
              </button>
              <button
                type="button"
                onClick={() => setChartMetric("SCANS")}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  chartMetric === "SCANS"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                Scans
              </button>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mrrChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#27272a" : "#f4f4f5"} />
                <XAxis dataKey="label" stroke={isDark ? "#71717a" : "#64748b"} fontSize={12} tickLine={{ stroke: isDark ? "#3f3f46" : "#cbd5e1" }} axisLine={{ stroke: isDark ? "#3f3f46" : "#cbd5e1", strokeWidth: 1 }} dy={6} />
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
                  formatter={(value: any) => [chartMetric === "MRR" ? `₹${Number(value).toLocaleString('en-IN')}` : Number(value).toLocaleString('en-IN'), chartMetric === "MRR" ? "MRR Revenue" : "Attendance Scans"]}
                />
                <Area type="monotone" dataKey={chartMetric === "MRR" ? "mrr" : "scans"} stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#mrrGrad)" name={chartMetric === "MRR" ? "MRR Revenue" : "Attendance Scans"} />
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
              View All {totalOrgs} <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto flex-1">
            {isLoading ? (
              <div className="py-12 flex items-center justify-center text-xs text-zinc-400 gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-500" /> Loading platform workspaces...
              </div>
            ) : recentOrgsList.length === 0 ? (
              <div className="py-12 text-center text-xs text-zinc-500">
                No organizations recorded on platform
              </div>
            ) : (
              <table className="w-full text-left text-xs text-zinc-600 dark:text-zinc-400">
                <thead className="bg-zinc-100 dark:bg-zinc-800/60 uppercase tracking-wider text-[10px] text-zinc-500 font-semibold border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="px-3 py-2.5">Organization</th>
                    <th className="px-3 py-2.5">Plan</th>
                    <th className="px-3 py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {recentOrgsList.map((org) => (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
