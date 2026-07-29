"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { QrCode, Sparkles, ArrowRight, Zap, Smartphone, Monitor, CheckCircle2, Shield, Clock, Fingerprint, Wifi, ScanLine } from "lucide-react";
import { usePortalUrls } from "@/lib/use-portal-urls";

export function HeroSection() {
  const urls = usePortalUrls();
  const [simulatedScan, setSimulatedScan] = useState(false);
  const [totpTimer, setTotpTimer] = useState(18);

  // TOTP countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTotpTimer((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const triggerScanSimulation = () => {
    if (simulatedScan) return;
    setSimulatedScan(true);
    setTimeout(() => {
      setSimulatedScan(false);
    }, 3200);
  };

  return (
    <section className="pt-36 pb-20 px-6 md:px-12 max-w-6xl mx-auto text-center flex flex-col items-center relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 dark:bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-72 h-72 bg-purple-600/10 dark:bg-purple-600/8 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold mb-6 shadow-lg shadow-indigo-500/5"
      >
        <Sparkles className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" /> Next-Gen Attendance Ecosystem v1.0
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-zinc-900 dark:text-white max-w-4xl leading-[1.1]"
      >
        Smart QR Attendance for Modern Teams & Campuses
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-6 text-base sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed font-medium"
      >
        Replace manual registers with dynamic TOTP pass scanning, real-time live telemetry, department-locked hardware kiosks, and automated reports.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
      >
        <a
          href={`${urls.admin}/register`}
          className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-extrabold text-sm shadow-2xl shadow-indigo-600/35 transition-all"
        >
          Create Free Admin Account <ArrowRight className="h-4 w-4" />
        </a>
        <a
          href={`${urls.kiosk}`}
          className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 active:scale-95 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 font-extrabold text-sm transition-all shadow-xl"
        >
          <QrCode className="h-4 w-4 text-purple-600 dark:text-purple-400" /> Launch Kiosk Terminal PWA
        </a>
      </motion.div>

      {/* ═══════ INTERACTIVE DEMO SANDBOX ═══════ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.45 }}
        className="mt-16 w-full max-w-5xl relative"
      >
        {/* Outer glow ring */}
        <div className="absolute -inset-px rounded-[28px] bg-gradient-to-b from-indigo-500/30 via-purple-500/10 to-transparent pointer-events-none" />

        <div className="bg-white/95 dark:bg-zinc-900/95 border border-zinc-200 dark:border-zinc-800/80 rounded-[28px] p-1 shadow-2xl shadow-indigo-500/10 dark:shadow-black/50 backdrop-blur-2xl relative overflow-hidden transition-colors">
          {/* Browser Chrome Top Bar */}
          <div className="flex items-center justify-between px-5 py-3 bg-zinc-100/90 dark:bg-zinc-950/80 rounded-t-[24px] border-b border-zinc-200 dark:border-zinc-800/60 transition-colors">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
                <div className="h-3 w-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
                <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/60 text-[11px] font-mono text-zinc-600 dark:text-zinc-500">
                <Shield className="h-3 w-3 text-emerald-500" />
                unite-attendance.com/live-telemetry
              </div>
            </div>
            <button
              onClick={triggerScanSimulation}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                simulatedScan
                  ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 cursor-not-allowed"
                  : "bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 cursor-pointer active:scale-95"
              }`}
            >
              {simulatedScan ? (
                <><CheckCircle2 className="h-3.5 w-3.5 animate-pulse" /> Scan Verified!</>
              ) : (
                <><Zap className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" /> Simulate Live Scan</>
              )}
            </button>
          </div>

          {/* Demo Content Area */}
          <div className="p-6 md:p-8">
            {/* Status Bar */}
            <div className="flex items-center justify-between mb-6 text-[11px]">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                  System Online
                </span>
                <span className="text-zinc-300 dark:text-zinc-600">|</span>
                <span className="text-zinc-600 dark:text-zinc-500 font-medium">2 Active Terminals</span>
                <span className="text-zinc-300 dark:text-zinc-600">|</span>
                <span className="text-zinc-600 dark:text-zinc-500 font-medium">148 Scans Today</span>
              </div>
              <span className="hidden sm:inline text-zinc-500 font-mono">
                {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {/* ── Left Panel: Member Mobile Pass Mockup ── */}
              <div className="rounded-2xl bg-gradient-to-b from-zinc-50 to-zinc-100/80 dark:from-zinc-950 dark:to-zinc-950/80 border border-zinc-200 dark:border-zinc-800/60 overflow-hidden transition-colors">
                {/* Panel Header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-200 dark:border-zinc-800/40 bg-zinc-100/60 dark:bg-zinc-950">
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-300 flex items-center gap-2">
                    <div className="p-1 rounded-md bg-emerald-500/10">
                      <Smartphone className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    Member Mobile Pass
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-[9px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                    Live TOTP
                  </span>
                </div>

                {/* QR Code Body */}
                <div className="p-6 flex flex-col items-center text-center space-y-4">
                  {/* QR with animated border */}
                  <div className="relative">
                    <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-indigo-500/20 to-purple-500/20 blur-md animate-pulse" />
                    <div className="relative h-32 w-32 bg-white p-3 rounded-2xl flex items-center justify-center shadow-xl shadow-black/10 dark:shadow-black/30 border border-zinc-100">
                      <QrCode className="h-full w-full text-zinc-900" />
                    </div>
                  </div>

                  {/* Member Info */}
                  <div className="space-y-1">
                    <p className="text-sm font-extrabold text-zinc-900 dark:text-white tracking-tight">Jane Smith</p>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-semibold">EMP-102 • Engineering Dept</p>
                  </div>

                  {/* TOTP Timer Ring */}
                  <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/60 shadow-sm">
                    <div className="relative h-8 w-8">
                      <svg className="h-8 w-8 -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          className="text-zinc-200 dark:text-zinc-800"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="rgb(99 102 241)"
                          strokeWidth="3"
                          strokeDasharray={`${(totpTimer / 30) * 100}, 100`}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-linear"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-indigo-600 dark:text-indigo-400">{totpTimer}</span>
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-bold text-zinc-800 dark:text-zinc-300">TOTP Refreshing</p>
                      <p className="text-[9px] text-zinc-500">Encrypted • Auto-Rotate</p>
                    </div>
                  </div>

                  {/* Security Badges */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/60 text-[9px] font-bold text-zinc-600 dark:text-zinc-400">
                      <Fingerprint className="h-3 w-3 text-indigo-600 dark:text-indigo-400" /> Encrypted
                    </span>
                    <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/60 text-[9px] font-bold text-zinc-600 dark:text-zinc-400">
                      <Clock className="h-3 w-3 text-amber-500 dark:text-amber-400" /> 30s Rotate
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Right Panel: Hardware Kiosk Terminal Mockup ── */}
              <div className="rounded-2xl bg-gradient-to-b from-zinc-50 to-zinc-100/80 dark:from-zinc-950 dark:to-zinc-950/80 border border-zinc-200 dark:border-zinc-800/60 overflow-hidden flex flex-col transition-colors">
                {/* Panel Header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-200 dark:border-zinc-800/40 bg-zinc-100/60 dark:bg-zinc-950">
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-300 flex items-center gap-2">
                    <div className="p-1 rounded-md bg-purple-500/10">
                      <Monitor className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                    </div>
                    Kiosk Terminal #01
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-[9px] font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                    🔒 Dept Locked
                  </span>
                </div>

                {/* Kiosk Body */}
                <div className="p-6 flex-1 flex flex-col items-center justify-center text-center relative">
                  {/* Scanner Result Overlay */}
                  {simulatedScan ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", bounce: 0.4, duration: 0.5 }}
                      className="space-y-4"
                    >
                      {/* Success Ring */}
                      <div className="relative mx-auto w-fit">
                        <div className="absolute -inset-3 rounded-full bg-emerald-500/15 animate-ping" />
                        <div className="relative h-16 w-16 rounded-full bg-emerald-500/15 border-2 border-emerald-500/40 flex items-center justify-center mx-auto">
                          <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-black text-zinc-900 dark:text-white">Check-In Verified ✓</p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Jane Smith • Engineering</p>
                      </div>
                      <div className="flex items-center justify-center gap-3 text-[10px] text-zinc-600 dark:text-zinc-400 font-medium">
                        <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/60 shadow-sm">
                          {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                          ON TIME
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="space-y-5">
                      {/* Scanner Target */}
                      <div className="relative h-28 w-28 mx-auto">
                        {/* Corner brackets */}
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-indigo-500/60 rounded-tl-lg" />
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-indigo-500/60 rounded-tr-lg" />
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-indigo-500/60 rounded-bl-lg" />
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-indigo-500/60 rounded-br-lg" />

                        {/* Laser line */}
                        <motion.div
                          className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_10px_#6366f1]"
                          animate={{ top: ["10%", "85%", "10%"] }}
                          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        />

                        {/* Center icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ScanLine className="h-7 w-7 text-indigo-500/40 dark:text-indigo-400/40" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <p className="text-sm font-extrabold text-zinc-900 dark:text-white">Awaiting QR Pass Scan</p>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-500 font-medium max-w-[200px] mx-auto">
                          Position your mobile TOTP pass in front of the camera
                        </p>
                      </div>

                      {/* Terminal Info */}
                      <div className="flex items-center justify-center gap-2 pt-2">
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/60 text-[9px] font-bold text-zinc-600 dark:text-zinc-400 shadow-sm">
                          <Wifi className="h-3 w-3 text-emerald-600 dark:text-emerald-400" /> Connected
                        </span>
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/60 text-[9px] font-bold text-zinc-600 dark:text-zinc-400 shadow-sm">
                          <Shield className="h-3 w-3 text-amber-500 dark:text-amber-400" /> Engineering Only
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Terminal Footer Status */}
                <div className="px-5 py-3 border-t border-zinc-200 dark:border-zinc-800/40 bg-zinc-100/60 dark:bg-zinc-950/60 flex items-center justify-between text-[10px] text-zinc-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Camera Active
                  </span>
                  <span className="font-mono">TERM-ENG-01</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
