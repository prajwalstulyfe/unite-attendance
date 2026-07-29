"use client";

import Link from "next/link";
import { CheckCircle2, QrCode, Clock, ArrowRight, Calendar, Sparkles, ShieldCheck, Award, Zap, Briefcase } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const weeklySummary = [
  { day: "Mon", status: "present" },
  { day: "Tue", status: "present" },
  { day: "Wed", status: "late" },
  { day: "Thu", status: "present" },
  { day: "Fri", status: "today" },
  { day: "Sat", status: "weekend" },
  { day: "Sun", status: "weekend" },
];

export default function MemberHomePage() {
  return (
    <div className="space-y-4 max-w-sm mx-auto">
      {/* Top Mobile Header — Glassmorphic Card */}
      <div className="flex items-center justify-between p-3.5 rounded-3xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-base shadow-lg shadow-indigo-500/20">
            JS
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-zinc-900 dark:text-white tracking-tight flex items-center gap-1.5">
              Good Morning, Jane! <Sparkles className="h-4 w-4 text-amber-400" />
            </h1>
            <p className="text-[11px] text-zinc-500">EMP-102 • Engineering (Acme Corp)</p>
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
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Today's Attendance</span>
            <h2 className="text-lg font-extrabold text-zinc-900 dark:text-white mt-0.5 flex items-center gap-1.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Checked In Verified
            </h2>
            <p className="text-xs text-zinc-500 mt-1 font-medium">09:02 AM • Main HQ North Gate</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500 text-white shadow-md shadow-emerald-500/30">
            PRESENT
          </span>
        </div>

        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
          <span className="flex items-center gap-1.5 font-mono font-medium">
            <Clock className="h-4 w-4 text-emerald-500" /> Active: <strong className="text-zinc-900 dark:text-white">3h 45m</strong>
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Shift: 09:00 - 18:00</span>
        </div>
      </div>

      {/* Show Digital QR Pass Banner — Outlined Glassmorphic */}
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
          <p className="text-xl font-extrabold text-zinc-900 dark:text-white">98.4%</p>
          <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mt-1">
            <div className="h-full bg-emerald-500 rounded-full w-[98%]" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Hours Worked</span>
            <Zap className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-xl font-extrabold text-zinc-900 dark:text-white">148.5h</p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">+12.4h vs target</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Leaves Left</span>
            <Briefcase className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-xl font-extrabold text-zinc-900 dark:text-white">12 Days</p>
          <span className="text-[10px] text-zinc-500 block">Earned Leave Balance</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Late Scans</span>
            <Clock className="h-4 w-4 text-rose-500" />
          </div>
          <p className="text-xl font-extrabold text-zinc-900 dark:text-white">1 Day</p>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold block">+18m grace used</span>
        </div>
      </div>

      {/* Weekly Pass Summary Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-indigo-500" /> Weekly Pass Summary
          </h3>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">5 / 5 Verified</span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 text-center">
          {weeklySummary.map((item) => (
            <div
              key={item.day}
              className={`p-2 rounded-2xl border flex flex-col items-center gap-1 transition-all ${
                item.status === "present"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                  : item.status === "late"
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
                  : item.status === "today"
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30"
                  : "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-400"
              }`}
            >
              <span className="text-[10px] font-extrabold">{item.day}</span>
              <span className="text-xs font-bold">{item.status === "weekend" ? "-" : "✓"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
