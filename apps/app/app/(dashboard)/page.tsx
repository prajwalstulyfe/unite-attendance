"use client";

import Link from "next/link";
import { CheckCircle2, QrCode, Clock, ArrowRight, Calendar, Sparkles, ShieldCheck, Award, Zap, Briefcase, AlertCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSession, useMemberAttendance } from "@repo/api-client";

export default function MemberHomePage() {
  const { data: session } = useSession();
  const user = session?.user;
  const primaryOrg = session?.organizations?.[0];

  const orgId = primaryOrg?.orgId || "";
  const memberId = primaryOrg?.memberId || user?.id || "";

  const { data: attendanceSummary } = useMemberAttendance(orgId, memberId);

  const userName = user?.name || user?.email?.split("@")[0] || "Member";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const orgName = primaryOrg?.orgName || "Organization";
  const departmentName = primaryOrg?.departmentName || "General";
  const empId = primaryOrg?.memberId || `EMP-${user?.id?.slice(0, 6).toUpperCase() || "101"}`;

  // Process today's attendance record if present in summary
  const records = attendanceSummary?.records || [];
  const todayStr: string = new Date().toISOString().split("T")[0] || "";
  const todayRecord = records.find((r) => r.date === todayStr || (typeof r.checkInTime === "string" && r.checkInTime.startsWith(todayStr))) || (records.length > 0 ? records[0] : null);

  const isCheckedIn = !!(todayRecord && todayRecord.checkInTime);
  const checkInTime = todayRecord?.checkInTime
    ? new Date(todayRecord.checkInTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : null;

  const totalPresent = attendanceSummary?.daysPresent ?? (records.filter((r) => r.status === "present").length);
  const totalLate = attendanceSummary?.daysLate ?? (records.filter((r) => r.status === "late").length);
  const punctualityRate = records.length > 0 ? Math.round(((records.length - totalLate) / records.length) * 100) : 100;

  return (
    <div className="space-y-4 max-w-sm mx-auto">
      {/* Top Mobile Header — Glassmorphic Card */}
      <div className="flex items-center justify-between p-3.5 rounded-3xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-base shadow-lg shadow-indigo-500/20">
            {userInitials}
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-zinc-900 dark:text-white tracking-tight flex items-center gap-1.5">
              Welcome, {userName}! <Sparkles className="h-4 w-4 text-amber-400" />
            </h1>
            <p className="text-[11px] text-zinc-500">{empId} • {departmentName} ({orgName})</p>
          </div>
        </div>
        <ThemeToggle />
      </div>

      {/* Verified Status Tag */}
      <div className="flex items-center justify-center gap-1.5 py-1 px-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold w-fit mx-auto shadow-sm">
        <ShieldCheck className="h-4 w-4 text-emerald-500" /> Active Attendance Session
      </div>

      {/* Main Unified Today Status Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-2xl shadow-indigo-500/10 dark:shadow-indigo-500/20 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
              Today's Attendance
            </span>
            <h2 className="text-lg font-extrabold text-zinc-900 dark:text-white mt-0.5 flex items-center gap-1.5">
              {isCheckedIn ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Checked In Verified
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-amber-500" /> Not Checked In Yet
                </>
              )}
            </h2>
            <p className="text-xs text-zinc-500 mt-1 font-medium">
              {isCheckedIn ? `${checkInTime} • Verified Gate Entry` : "Scan your QR pass at terminal to check in"}
            </p>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold shadow-md ${
              isCheckedIn
                ? "bg-emerald-500 text-white shadow-emerald-500/30"
                : "bg-amber-500 text-white shadow-amber-500/30"
            }`}
          >
            {isCheckedIn ? "PRESENT" : "PENDING"}
          </span>
        </div>

        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
          <span className="flex items-center gap-1.5 font-mono font-medium">
            <Clock className="h-4 w-4 text-emerald-500" /> Status:{" "}
            <strong className="text-zinc-900 dark:text-white">
              {isCheckedIn ? "Active Session" : "Awaiting Scan"}
            </strong>
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Standard Shift</span>
        </div>
      </div>

      {/* Show Digital QR Pass Banner */}
      <Link
        href="/qr"
        className="flex items-center justify-between p-4 rounded-3xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm border border-indigo-200 dark:border-indigo-500/30 hover:border-indigo-400 dark:hover:border-indigo-400/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5 shadow-sm transition-all group"
      >
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-indigo-100 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
            <QrCode className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold tracking-tight text-zinc-900 dark:text-white">Show My Digital QR Pass</h3>
            <p className="text-[11px] text-zinc-500">Dynamic Anti-Spoof QR code for kiosk</p>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-indigo-500 group-hover:translate-x-1 transition-transform" />
      </Link>

      {/* Monthly Attendance KPIs Grid (2x2) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Punctuality</span>
            <Award className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="text-xl font-extrabold text-zinc-900 dark:text-white">{punctualityRate}%</p>
          <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mt-1">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${punctualityRate}%` }} />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Days Present</span>
            <Zap className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-xl font-extrabold text-zinc-900 dark:text-white">{totalPresent} Days</p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">Monthly total</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Leaves Left</span>
            <Briefcase className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-xl font-extrabold text-zinc-900 dark:text-white">12 Days</p>
          <span className="text-[10px] text-zinc-500 block">Earned Balance</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Late Scans</span>
            <Clock className="h-4 w-4 text-rose-500" />
          </div>
          <p className="text-xl font-extrabold text-zinc-900 dark:text-white">{totalLate} {totalLate === 1 ? "Day" : "Days"}</p>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold block">Total recorded</span>
        </div>
      </div>
    </div>
  );
}
