"use client";

import { StatsCard, PageHeader, StatusBadge } from "@repo/ui";
import { Users, CheckCircle2, AlertTriangle, Clock, ArrowUpRight, UserPlus, QrCode } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const chartData = [
  { day: "Mon", present: 145, late: 12 },
  { day: "Tue", present: 152, late: 8 },
  { day: "Wed", present: 148, late: 15 },
  { day: "Thu", present: 156, late: 6 },
  { day: "Fri", present: 140, late: 18 },
  { day: "Sat", present: 45, late: 2 },
  { day: "Sun", present: 0, late: 0 },
];

const mockLiveFeed = [
  { id: "1", name: "Jane Smith", dept: "Engineering", time: "9:02 AM", status: "present" },
  { id: "2", name: "Bob Williams", dept: "Engineering", time: "9:18 AM", status: "late" },
  { id: "3", name: "Alice Johnson", dept: "HR", time: "9:24 AM", status: "present" },
  { id: "4", name: "John Doe", dept: "Management", time: "8:55 AM", status: "present" },
];

export default function DashboardPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = !mounted || theme === "dark";

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard Overview"
        description="Real-time attendance telemetry and daily stats for Acme Corporation"
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
          value="168"
          description="Active org memberships"
          icon={<Users className="h-4 w-4" />}
        />
        <StatsCard
          title="Present Today"
          value="148"
          trend={{ value: "92.5%", isPositive: true }}
          description="Check-ins recorded"
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
        />
        <StatsCard
          title="Late Arrivals"
          value="12"
          trend={{ value: "7.5%", isPositive: false }}
          description="After 9:15 AM threshold"
          icon={<Clock className="h-4 w-4 text-amber-500" />}
        />
        <StatsCard
          title="Absent"
          value="8"
          description="No check-in record"
          icon={<AlertTriangle className="h-4 w-4 text-rose-500" />}
        />
      </div>

      {/* Chart & Live Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 7-Day Trend Chart (2 cols) */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/60 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">Attendance Trend</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">Weekly breakdown of present vs late check-ins</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 font-medium">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" /> Present
              </span>
              <span className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 font-medium">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Late
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
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

        {/* Live Feed Panel (1 col) */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/60 p-6 flex flex-col shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              Live Feed
            </h3>
            <span className="text-xs text-zinc-500">Real-time</span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-[300px]">
            {mockLiveFeed.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-semibold text-xs text-zinc-700 dark:text-zinc-300">
                    {item.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-900 dark:text-white">{item.name}</p>
                    <p className="text-[10px] text-zinc-500">{item.dept} • {item.time}</p>
                  </div>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
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
