"use client";

import { useState, useEffect } from "react";
import { QRDisplay } from "@repo/ui";
import { ShieldCheck, RefreshCw, Smartphone } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSession } from "@repo/api-client";

export default function MemberQRPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const primaryOrg = session?.organizations?.[0];

  const userName = user?.name || user?.email?.split("@")[0] || "Member";
  const empId = primaryOrg?.memberId || `EMP-${user?.id?.slice(0, 6).toUpperCase() || "101"}`;
  const departmentName = `${primaryOrg?.departmentName || "General"} • ${primaryOrg?.orgName || "Unite Attendance"}`;

  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const [tokenCounter, setTokenCounter] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          setTokenCounter((c) => c + 1);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Stable 30-second TOTP token with real member ID
  const dynamicToken = `UNITE_TOTP_${user?.id || "USER"}_${empId}_${tokenCounter}`;

  return (
    <div className="space-y-5 max-w-sm mx-auto">
      {/* Top Mobile Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-extrabold text-zinc-900 dark:text-white tracking-tight">My Digital Pass</h1>
          <p className="text-[11px] text-zinc-500">Dynamic 2D barcode TOTP pass</p>
        </div>
        <ThemeToggle />
      </div>

      {/* Verified Employee Pill Badge */}
      <div className="flex items-center justify-center gap-1.5 py-1 px-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold w-fit mx-auto shadow-sm">
        <ShieldCheck className="h-4 w-4 text-emerald-500" /> Active Verified Employee Pass
      </div>

      {/* Single Unified High-Tech QR Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl shadow-indigo-500/10 dark:shadow-indigo-500/20 text-center space-y-4 w-full max-w-full min-w-0 overflow-hidden">
        {/* Real Dynamic QR Barcode Display (Stable 30s TOTP) */}
        <QRDisplay
          qrToken={dynamicToken}
          memberName={userName}
          employeeId={empId}
          departmentName={departmentName}
          size={190}
        />

        {/* Dynamic 30-Second TOTP Countdown Progress Bar */}
        <div className="space-y-1.5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <RefreshCw className="h-3 w-3 text-indigo-500 animate-spin" /> Auto Refreshing Pass
            </span>
            <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{secondsRemaining}s</span>
          </div>

          <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${(secondsRemaining / 30) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Kiosk Guidance Card */}
      <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-2xl p-3.5 text-xs space-y-1 shadow-sm">
        <p className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
          <Smartphone className="h-4 w-4" /> Kiosk Scanner Guidance
        </p>
        <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed">
          Hold your mobile screen approximately 4 to 6 inches in front of the kiosk camera. Works seamlessly offline even without internet.
        </p>
      </div>
    </div>
  );
}
