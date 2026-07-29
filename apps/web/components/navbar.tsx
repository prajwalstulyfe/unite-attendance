"use client";

import { useState } from "react";
import { ChevronDown, Building2, Monitor, Smartphone, ArrowRight, Menu, X } from "lucide-react";
import { usePortalUrls } from "@/lib/use-portal-urls";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const urls = usePortalUrls();
  const [showPortalMenu, setShowPortalMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="h-16 md:h-20 border-b border-zinc-200 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl px-4 sm:px-6 md:px-12 flex items-center justify-between fixed inset-x-0 top-0 z-50 transition-colors">
      {/* Brand Logo & Title */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <img
          src="/uniteIcon.png"
          alt="Unite Attendance Logo"
          className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-xl object-cover shadow-lg shadow-purple-500/30 border border-purple-500/20 flex-shrink-0"
        />
        <span className="text-sm sm:text-base md:text-xl font-black tracking-tight text-zinc-900 dark:text-white truncate">
          Unite Attendance
        </span>
      </div>

      {/* Desktop Navigation Links */}
      <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
        <a href="#features" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Features</a>
        <a href="#ecosystem" className="hover:text-zinc-900 dark:hover:text-white transition-colors">App Ecosystem</a>
        <a href="#workflow" className="hover:text-zinc-900 dark:hover:text-white transition-colors">How it Works</a>
        <a href="#pricing" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Pricing</a>
        <a href="#faq" className="hover:text-zinc-900 dark:hover:text-white transition-colors">FAQ</a>
      </nav>

      {/* Action Buttons & Theme Toggle */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 relative flex-shrink-0">
        <ThemeToggle />

        {/* Portal Menu Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowPortalMenu(!showPortalMenu)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-[11px] sm:text-xs font-bold text-zinc-800 dark:text-zinc-200 transition-all shadow-sm whitespace-nowrap"
          >
            <span>Sign In / Apps</span>
            <ChevronDown className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-zinc-500 dark:text-zinc-400" />
          </button>

          {showPortalMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-2 space-y-1 z-50 text-xs">
              <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Unite Ecosystem Portals
              </div>
              <a
                href={`${urls.admin}/login`}
                onClick={() => setShowPortalMenu(false)}
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
                onClick={() => setShowPortalMenu(false)}
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
                onClick={() => setShowPortalMenu(false)}
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

        {/* Start Free Trial Button */}
        <a
          href={`${urls.admin}/register`}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] sm:text-xs font-bold shadow-xl shadow-indigo-600/30 transition-all whitespace-nowrap"
        >
          Start Free Trial <ArrowRight className="h-3.5 w-3.5" />
        </a>

        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
          className="lg:hidden p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 transition-colors"
        >
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile Slide-Down Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 p-4 space-y-4 shadow-2xl z-40 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              Features
            </a>
            <a
              href="#ecosystem"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              App Ecosystem
            </a>
            <a
              href="#workflow"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              How it Works
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              FAQ
            </a>
          </nav>

          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
            <a
              href={`${urls.admin}/register`}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all"
            >
              Start Free Trial <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
