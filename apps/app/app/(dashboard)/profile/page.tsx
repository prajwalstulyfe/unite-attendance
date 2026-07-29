"use client";

import { ShieldCheck, Building2, Download, LogOut, QrCode, CheckCircle2, ChevronRight, Sparkles, Award, KeyRound, Smartphone, Lock } from "lucide-react";
import Link from "next/link";
import { PwaInstallButton } from "@/components/pwa-install-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "sonner";

import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const handleLogout = () => {
    toast.info("Logged out of Employee Pass");
    router.push("/login");
  };

  return (
    <div className="space-y-4 max-w-sm mx-auto">
      {/* Top Mobile Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-extrabold text-zinc-900 dark:text-white tracking-tight">Member Identity</h1>
          <p className="text-[11px] text-zinc-500">Verified digital employee pass & settings</p>
        </div>
        <ThemeToggle />
      </div>

      {/* Member ID Pass Card — Glassmorphic */}
      <div className="relative overflow-hidden bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white rounded-3xl p-5 shadow-sm space-y-4">
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-28 h-28 bg-indigo-400/10 dark:bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-28 h-28 bg-purple-400/10 dark:bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header inside ID Card */}
        <div className="flex items-center justify-between relative z-10 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <img
              src="/uniteIcon.png"
              alt="Unite Access Pass"
              className="h-7 w-7 rounded-xl object-cover border border-purple-500/20"
            />
            <div>
              <p className="text-xs font-extrabold tracking-wide uppercase text-zinc-900 dark:text-white">Acme Corporation</p>
              <p className="text-[9px] text-zinc-500">Official Digital Access Pass</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> VERIFIED
          </span>
        </div>

        {/* Member Details */}
        <div className="flex items-center gap-4 relative z-10">
          <div className="relative">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-indigo-400/30 flex items-center justify-center font-black text-white text-2xl shadow-lg shadow-indigo-500/20">
              JS
            </div>
            <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-emerald-400 border-2 border-white dark:border-zinc-900 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-3.5 w-3.5 text-white" />
            </div>
          </div>

          <div className="space-y-0.5">
            <h2 className="text-lg font-black tracking-tight text-zinc-900 dark:text-white">Jane Smith</h2>
            <p className="text-xs text-zinc-500 font-medium">EMP-102 • Engineering Wing A</p>
            <p className="text-[10px] text-zinc-400 font-mono">ID: ACME-2024-8902-X</p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-1 font-mono text-[9px] text-zinc-500">
            <Lock className="h-3 w-3 text-emerald-500" /> Security Tier-1 Granted
          </div>
          <span className="text-[9px] font-mono text-zinc-400 tracking-wider">
            AES-256 TOTP
          </span>
        </div>
      </div>

      {/* Quick Security & Pass Stats */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Pass Metrics & Security</h3>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 flex items-center gap-2.5">
            <Award className="h-4 w-4 text-indigo-500 shrink-0" />
            <div>
              <span className="text-[10px] text-zinc-400 block font-medium">Security Status</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-bold">Active & Clear</strong>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 flex items-center gap-2.5">
            <KeyRound className="h-4 w-4 text-purple-500 shrink-0" />
            <div>
              <span className="text-[10px] text-zinc-400 block font-medium">Encryption</span>
              <strong className="text-zinc-900 dark:text-white font-bold">Dynamic TOTP</strong>
            </div>
          </div>
        </div>
      </div>

      {/* App Preferences & PWA Download */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">App Controls & PWA</h3>

        {/* PWA Download Banner */}
        <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-zinc-800/40 backdrop-blur-sm border border-zinc-200 dark:border-zinc-700/60 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <Smartphone className="h-4 w-4 text-indigo-500" /> Install Mobile App
            </p>
            <p className="text-[11px] text-zinc-500">1-tap offline QR pass on home screen</p>
          </div>
          <PwaInstallButton />
        </div>

        {/* Quick Navigation Links */}
        <div className="space-y-1 pt-1">
          <Link
            href="/qr"
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-xs font-semibold text-zinc-800 dark:text-zinc-200"
          >
            <span className="flex items-center gap-2.5">
              <QrCode className="h-4 w-4 text-indigo-500" /> My Digital QR Pass
            </span>
            <ChevronRight className="h-4 w-4 text-zinc-400" />
          </Link>

          <Link
            href="/history"
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-xs font-semibold text-zinc-800 dark:text-zinc-200"
          >
            <span className="flex items-center gap-2.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" /> Attendance Audit History
            </span>
            <ChevronRight className="h-4 w-4 text-zinc-400" />
          </Link>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full py-3 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/15 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-bold transition-all border border-rose-200 dark:border-rose-500/20 flex items-center justify-center gap-2 shadow-sm"
      >
        <LogOut className="h-4 w-4" /> Sign Out from Device
      </button>
    </div>
  );
}
