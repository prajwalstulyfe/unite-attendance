"use client";

import { useState } from "react";
import { ChevronDown, Building2, Monitor, Smartphone, ArrowRight } from "lucide-react";
import { usePortalUrls } from "@/lib/use-portal-urls";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const urls = usePortalUrls();
  const [showPortalMenu, setShowPortalMenu] = useState(false);

  return (
    <header className="h-20 border-b border-zinc-200 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl px-6 md:px-12 flex items-center justify-between fixed inset-x-0 top-0 z-50 transition-colors">
      <div className="flex items-center gap-3">
        <img
          src="/uniteIcon.png"
          alt="Unite Attendance Logo"
          className="h-10 w-10 rounded-xl object-cover shadow-lg shadow-purple-500/30 border border-purple-500/20"
        />
        <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">Unite Attendance</span>
      </div>

      <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
        <a href="#features" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Features</a>
        <a href="#ecosystem" className="hover:text-zinc-900 dark:hover:text-white transition-colors">App Ecosystem</a>
        <a href="#workflow" className="hover:text-zinc-900 dark:hover:text-white transition-colors">How it Works</a>
        <a href="#pricing" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Pricing</a>
        <a href="#faq" className="hover:text-zinc-900 dark:hover:text-white transition-colors">FAQ</a>
      </nav>

      <div className="flex items-center gap-3 relative">
        <ThemeToggle />

        <div className="relative">
          <button
            onClick={() => setShowPortalMenu(!showPortalMenu)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200 transition-all shadow-sm"
          >
            Sign In / Apps <ChevronDown className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />
          </button>

          {showPortalMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-2 space-y-1 z-50 text-xs">
              <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Unite Ecosystem Portals
              </div>
              <a
                href={`${urls.admin}/login`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-extrabold text-zinc-900 dark:text-white">Admin Dashboard</p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Organization & Super Admin</p>
                </div>
              </a>
              <a
                href={urls.kiosk}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Monitor className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-extrabold text-zinc-900 dark:text-white">Kiosk Terminal PWA</p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Hardware Terminal Scanner</p>
                </div>
              </a>
              <a
                href={urls.app}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Smartphone className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-extrabold text-zinc-900 dark:text-white">Employee / Student App</p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Digital TOTP Pass Card</p>
                </div>
              </a>
            </div>
          )}
        </div>

        <a
          href={`${urls.admin}/register`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xl shadow-indigo-600/30 transition-all"
        >
          Start Free Trial <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </header>
  );
}
