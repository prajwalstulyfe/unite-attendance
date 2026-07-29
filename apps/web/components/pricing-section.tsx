"use client";

import { CheckCircle2 } from "lucide-react";
import { usePortalUrls } from "@/lib/use-portal-urls";

export function PricingSection() {
  const urls = usePortalUrls();

  return (
    <section id="pricing" className="py-20 px-6 md:px-12 bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Flexible Plans</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Transparent India Enterprise Pricing</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">Choose the plan tailored for your campus or organization size.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starter */}
          <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Starter</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-zinc-900 dark:text-white">₹0</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">/ month</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Perfect for small teams and single departments.</p>
              <ul className="space-y-3 text-xs text-zinc-700 dark:text-zinc-300 font-medium pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Up to 50 Members
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> 1 Kiosk Scanner Terminal
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Dynamic TOTP QR Passes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Standard CSV Export
                </li>
              </ul>
            </div>
            <a
              href={`${urls.admin}/register`}
              className="w-full py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-xs font-bold text-center transition-colors block"
            >
              Get Started Free
            </a>
          </div>

          {/* Growth Pro */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-indigo-50/80 to-white dark:from-indigo-900/40 dark:to-zinc-900 border-2 border-indigo-500 space-y-6 flex flex-col justify-between shadow-xl relative">
            <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shadow-lg">
              Most Popular
            </div>
            <div className="space-y-4">
              <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Growth Pro</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-zinc-900 dark:text-white">₹1,499</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">/ month</span>
              </div>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">Designed for schools, campuses, and multi-dept offices.</p>
              <ul className="space-y-3 text-xs text-zinc-800 dark:text-zinc-200 font-medium pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> Up to 1,000 Members
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> Unlimited Department Kiosks
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> Department Lock Enforcement
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> 1-Click PDF & CSV Exports
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> Geofencing & Wi-Fi Check
                </li>
              </ul>
            </div>
            <a
              href={`${urls.admin}/register`}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold text-center shadow-xl shadow-indigo-600/30 transition-all block"
            >
              Start 14-Day Free Trial
            </a>
          </div>

          {/* Enterprise Unlimited */}
          <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Enterprise</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-zinc-900 dark:text-white">₹4,999</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">/ month</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">For large universities, multi-city branches, and enterprises.</p>
              <ul className="space-y-3 text-xs text-zinc-700 dark:text-zinc-300 font-medium pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-400" /> Unlimited Members & Campuses
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-400" /> Dedicated API & ERP Webhooks
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-400" /> Custom SLA & 24/7 Support
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-400" /> On-Premise / Private Cloud
                </li>
              </ul>
            </div>
            <a
              href={`${urls.admin}/register`}
              className="w-full py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-xs font-bold text-center transition-colors block"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
