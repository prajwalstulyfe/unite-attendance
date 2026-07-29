"use client";

import { QrCode, ShieldCheck, BarChart3, Lock, Clock, FileSpreadsheet } from "lucide-react";

export function FeatureGrid() {
  return (
    <section id="features" className="py-20 px-6 md:px-12 bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Enterprise Features</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Everything Needed for Total Attendance Control</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto font-medium">Built for high-density institutions, enterprises, and schools.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 w-fit">
              <QrCode className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white">Dynamic Anti-Spoof QR</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              Rotating TOTP-encrypted QR codes prevent screenshot sharing and proxy attendance across all branches.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-fit">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white">Geofencing & Wifi Check</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              Verify check-in location using GPS boundaries and corporate Wi-Fi BSSID matching automatically.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 w-fit">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white">Real-Time Telemetry</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              Live attendance streaming feeds, automated late penalties, and instant 1-click PDF and CSV exports.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 w-fit">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white">Department Gate Locking</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              Kiosks lock to specific department IDs. Unapproved department members are denied entry automatically.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 w-fit">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white">Automated Grace Rules</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              Configure custom shift times, grace periods (e.g. 15 mins), and automatic late status flags.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 w-fit">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white">Instant Export Engine</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              Export comprehensive daily, weekly, or monthly attendance summary PDFs and raw CSV spreadsheets.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
