"use client";

import { Building2, Monitor, Smartphone, ArrowRight } from "lucide-react";
import { usePortalUrls } from "@/lib/use-portal-urls";

export function EcosystemSection() {
  const urls = usePortalUrls();

  return (
    <section id="ecosystem" className="py-20 px-6 md:px-12 bg-zinc-900/40 border-t border-zinc-800/80">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest">Complete 3-App Platform</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">The 3 Pillars of Unite Attendance</h2>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto font-medium">
            Seamlessly connected apps for Administrators, Gate Hardware Terminals, and Members.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-5 hover:border-indigo-500/50 transition-all group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 w-fit">
                <Building2 className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-extrabold text-white">1. Admin Portal</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                Manage organization branches, department rosters, attendance grace rules, automated late penalties, and PDF/CSV report generation.
              </p>
            </div>
            <a
              href={`${urls.admin}/login`}
              className="mt-4 pt-4 border-t border-zinc-900 text-xs font-bold text-indigo-400 group-hover:text-indigo-300 flex items-center justify-between"
            >
              Launch Admin Dashboard <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-5 hover:border-purple-500/50 transition-all group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 w-fit">
                <Monitor className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-extrabold text-white">2. Kiosk Terminal PWA</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                Full-screen edge-to-edge camera scanner app installed on tablets outside classrooms or gates. Strictly locked to specific department IDs.
              </p>
            </div>
            <a
              href={urls.kiosk}
              className="mt-4 pt-4 border-t border-zinc-900 text-xs font-bold text-purple-400 group-hover:text-purple-300 flex items-center justify-between"
            >
              Launch Kiosk Scanner <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-5 hover:border-emerald-500/50 transition-all group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 w-fit">
                <Smartphone className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-extrabold text-white">3. Member Mobile App</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                Personal employee and student app with digital pass card, live 30-second TOTP QR code, attendance logs, and profile overview.
              </p>
            </div>
            <a
              href={urls.app}
              className="mt-4 pt-4 border-t border-zinc-900 text-xs font-bold text-emerald-400 group-hover:text-emerald-300 flex items-center justify-between"
            >
              Launch Member App <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
