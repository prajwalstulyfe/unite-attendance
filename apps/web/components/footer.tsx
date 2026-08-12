"use client";

import Image from "next/image";
import { ShieldCheck, Lock, ExternalLink, Globe } from "lucide-react";
import { usePortalUrls } from "@/lib/use-portal-urls";

export function Footer() {
  const urls = usePortalUrls();

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 text-xs transition-colors relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-160 h-40 bg-indigo-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 pt-16 pb-12 space-y-12 relative z-10">
        {/* Main Grid — 5 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Column 1: Brand Info & Status (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <Image
                src="/uniteIcon.png"
                alt="Unite Attendance Logo"
                width={32}
                height={32}
                className="h-8 w-8 rounded-xl object-cover shadow-md shadow-indigo-600/20"
              />
              <span className="text-base font-black text-zinc-900 dark:text-white tracking-tight">
                Unite Attendance
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                Enterprise
              </span>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm font-medium">
              Next-generation multi-tenant QR kiosk & member attendance platform. Built for instant verification, geofenced tracking, and automated MRR telemetry.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              All Platform Systems Operational
            </div>
          </div>

          {/* Column 2: Ecosystem Portals (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white">
              Portals
            </h4>
            <ul className="space-y-2.5 font-medium">
              <li>
                <a
                  href={urls.admin}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                >
                  Admin Portal <ExternalLink className="h-3 w-3 text-zinc-400" />
                </a>
              </li>
              <li>
                <a
                  href={urls.app}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                >
                  Member App <ExternalLink className="h-3 w-3 text-zinc-400" />
                </a>
              </li>
              <li>
                <a
                  href={urls.kiosk}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                >
                  Kiosk Terminal <ExternalLink className="h-3 w-3 text-zinc-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://api.unite-attendance.com"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                >
                  API Telemetry <ExternalLink className="h-3 w-3 text-zinc-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Features & Capabilities (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white">
              Features
            </h4>
            <ul className="space-y-2.5 font-medium">
              <li>
                <a href="#features" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Geofenced Check-In
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Dynamic QR Pass
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Multi-Branch Rules
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Role Permissions
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Employee Packs (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white">
              Employee Packs
            </h4>
            <ul className="space-y-2.5 font-medium">
              <li>
                <a href="#pricing" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Starter 10 Pack
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Business 50 Pack
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Pro Growth 100 Pack
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Enterprise 1000 Pack
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5: Trust & Security (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white">
              Trust & Governance
            </h4>
            <ul className="space-y-2.5 font-medium">
              <li className="flex items-center gap-1.5 text-zinc-500">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> SOC2 Compliant
              </li>
              <li className="flex items-center gap-1.5 text-zinc-500">
                <Lock className="h-3.5 w-3.5 text-indigo-500" /> 256-Bit SSL Encryption
              </li>
              <li className="flex items-center gap-1.5 text-zinc-500">
                <Globe className="h-3.5 w-3.5 text-purple-500" /> Multi-Tenant Isolation
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200 dark:border-zinc-800/80" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-zinc-500">
          <p>© 2026 Unite Attendance Technologies. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-6 font-medium">
            <a href="#pricing" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#faq" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#ecosystem" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              Security Overview
            </a>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <span className="text-zinc-400 font-mono">v1.0.0 (Production)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
