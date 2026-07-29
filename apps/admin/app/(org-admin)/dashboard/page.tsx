"use client";

import { StatsCard, PageHeader, StatusBadge } from "@repo/ui";
import { Users, CheckCircle2, AlertTriangle, Clock, ArrowUpRight, UserPlus, QrCode, Inbox } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useUIStore } from "@/lib/use-ui-store";
import { useTodayStats, useAttendanceRecords, useMembers } from "@repo/api-client";

export default function DashboardPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { activeOrgName, activeOrgSlug } = useUIStore();

  const { data: stats } = useTodayStats(activeOrgSlug);
  const { data: attendanceData } = useAttendanceRecords(activeOrgSlug, { pageSize: 10 });
  const { data: membersData } = useMembers(activeOrgSlug, { pageSize: 1 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = !mounted || theme === "dark";

  const totalMembers = membersData?.pagination?.total ?? stats?.totalMembers ?? 0;
  const presentToday = stats?.present ?? 0;
  const lateArrivals = stats?.late ?? 0;
  const absentMembers = stats?.absent ?? (totalMembers > presentToday ? totalMembers - presentToday : 0);
  const attendanceRate = stats?.attendancePercentage ?? (totalMembers > 0 ? Math.round((presentToday / totalMembers) * 100) : 0);

  const liveRecords = attendanceData?.items || [];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard Overview"
        description={`Real-time attendance telemetry and daily stats for ${activeOrgName}`}
        action={
          <div className="flex gap-3">
            <Link
              href="/members/new"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
            >
              <UserPlus className="h-3.5 w-3.5" /> Add Member
            </Link>
            <Link
              href="/qr-management"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition-all shadow-sm"
            >
              <QrCode className="h-3.5 w-3.5" /> Bulk QR
            </Link>
          </div>
        }
      />

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Members"
          value={String(totalMembers)}
          description="Active org memberships"
          icon={<Users className="h-4 w-4" />}
        />
        <StatsCard
          title="Present Today"
          value={String(presentToday)}
          trend={{ value: `${attendanceRate}%`, isPositive: true }}
          description="Check-ins recorded"
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
        />
        <StatsCard
          title="Late Arrivals"
          value={String(lateArrivals)}
          trend={{ value: `${totalMembers > 0 ? Math.round((lateArrivals / totalMembers) * 100) : 0}%`, isPositive: false }}
          description="After threshold time"
          icon={<Clock className="h-4 w-4 text-amber-500" />}
        />
        <StatsCard
          title="Absent"
          value={String(absentMembers)}
          description="No check-in record"
          icon={<AlertTriangle className="h-4 w-4 text-rose-500" />}
        />
      </div>

      {/* Chart & Live Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Trend Chart */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/60 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">Attendance Trend</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">Weekly breakdown of check-ins for {activeOrgName}</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 font-medium">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" /> Present
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { day: "Mon", present: presentToday },
                { day: "Tue", present: presentToday },
                { day: "Wed", present: presentToday },
                { day: "Thu", present: presentToday },
                { day: "Fri", present: presentToday },
                { day: "Sat", present: 0 },
                { day: "Sun", present: 0 },
              ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#27272a" : "#f4f4f5"} />
                <XAxis dataKey="day" stroke={isDark ? "#71717a" : "#64748b"} fontSize={12} tickLine={{ stroke: isDark ? "#3f3f46" : "#cbd5e1" }} axisLine={{ stroke: isDark ? "#3f3f46" : "#cbd5e1", strokeWidth: 1 }} dy={6} />
                <YAxis stroke={isDark ? "#71717a" : "#64748b"} fontSize={12} tickLine={{ stroke: isDark ? "#3f3f46" : "#cbd5e1" }} axisLine={{ stroke: isDark ? "#3f3f46" : "#cbd5e1", strokeWidth: 1 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#18181b" : "#ffffff",
                    borderColor: isDark ? "#27272a" : "#e4e4e7",
                    color: isDark ? "#ffffff" : "#09090b",
                    borderRadius: "10px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                  itemStyle={{ color: isDark ? "#e4e4e7" : "#18181b" }}
                  labelStyle={{ color: isDark ? "#a1a1aa" : "#71717a" }}
                />
                <Area type="monotone" dataKey="present" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#presentGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Feed Panel */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/60 p-6 flex flex-col shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              Live Feed
            </h3>
            <span className="text-xs text-zinc-500">Real-time</span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-[300px]">
            {liveRecords.length === 0 ? (
              <div className="py-12 text-center space-y-2 text-zinc-500">
                <Inbox className="h-8 w-8 text-zinc-400 mx-auto" />
                <p className="text-xs font-semibold">No check-in activity today</p>
                <p className="text-[11px] text-zinc-400">Live kiosk scans for {activeOrgName} will display here.</p>
              </div>
            ) : (
              liveRecords.map((item) => {
                const memberName = item.member?.user?.name || "Member";
                const dept = item.member?.department?.name || "General";
                const checkInTime = new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                return (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-semibold text-xs text-zinc-700 dark:text-zinc-300">
                        {memberName[0]}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-zinc-900 dark:text-white">{memberName}</p>
                        <p className="text-[10px] text-zinc-500">{dept} • {checkInTime}</p>
                      </div>
                    </div>
                    <StatusBadge status={item.status.toLowerCase()} />
                  </div>
                );
              })
            )}
          </div>

          <Link
            href="/attendance"
            className="mt-4 inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-800 dark:text-zinc-300 transition-colors"
          >
            View Full Feed <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
