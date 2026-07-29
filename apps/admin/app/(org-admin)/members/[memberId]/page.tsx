"use client";

import { PageHeader, QRDisplay, StatusBadge } from "@repo/ui";
import { Download, RefreshCw, Printer, Mail, Calendar, ShieldCheck } from "lucide-react";

export default function MemberDetailPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Member Profile & QR Code"
        breadcrumbs={[
          { label: "Members", href: "/members" },
          { label: "Jane Smith" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Member Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 flex items-start gap-4 shadow-sm">
            <div className="h-16 w-16 rounded-2xl bg-indigo-600 flex items-center justify-center font-bold text-2xl text-white shadow-xl shadow-indigo-600/20">
              JS
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Jane Smith</h2>
                <StatusBadge status="active" />
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">Senior Software Engineer</p>

              <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 text-xs">
                <div>
                  <span className="text-zinc-500 block">Email Address</span>
                  <span className="text-zinc-800 dark:text-zinc-200 font-medium flex items-center gap-1.5 mt-0.5">
                    <Mail className="h-3.5 w-3.5 text-zinc-400" /> jane@acme.com
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Employee ID</span>
                  <span className="text-zinc-800 dark:text-zinc-200 font-mono font-medium mt-0.5 block">EMP-102</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Department</span>
                  <span className="text-zinc-800 dark:text-zinc-200 font-medium mt-0.5 block">Engineering</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Joined Date</span>
                  <span className="text-zinc-800 dark:text-zinc-200 font-medium flex items-center gap-1.5 mt-0.5">
                    <Calendar className="h-3.5 w-3.5 text-zinc-400" /> 15 Jan 2026
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: QR Card */}
        <div>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> Member QR Pass
            </h3>

            <QRDisplay
              qrToken="QR_MEMBER_102_SECURE_TOKEN"
              memberName="Jane Smith"
              employeeId="EMP-102"
              departmentName="Engineering"
            />

            <div className="mt-6 flex flex-col gap-2">
              <button className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all">
                <Download className="h-3.5 w-3.5" /> Download Pass
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button className="py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-300 text-xs font-medium flex items-center justify-center gap-1.5">
                  <Printer className="h-3.5 w-3.5" /> Print
                </button>
                <button className="py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-300 text-xs font-medium flex items-center justify-center gap-1.5">
                  <RefreshCw className="h-3.5 w-3.5" /> Regenerate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
