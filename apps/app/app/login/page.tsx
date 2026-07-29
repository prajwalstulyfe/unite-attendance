"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, ShieldCheck, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AppLoginPage() {
  const router = useRouter();
  const [emailOrEmpId, setEmailOrEmpId] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrEmpId) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Welcome back! Digital Pass Activated.");
      router.push("/");
    }, 600);
  };

  const handleQuickDemo = (demoId: string, name: string) => {
    setEmailOrEmpId(demoId);
    setPassword("changeme123!");
    toast.success(`Demo credentials loaded for ${name}`);
  };

  return (
    <div className="min-h-screen bg-zinc-200 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex justify-center transition-colors duration-200">
      {/* 1px Side Bordered Mobile Container Shell */}
      <div className="w-full max-w-md min-h-screen bg-white dark:bg-zinc-900 border-x border-zinc-300 dark:border-zinc-800 flex flex-col justify-between relative shadow-xl p-4 overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Bar */}
        <div className="flex items-center justify-between z-10 w-full pt-2">
          <div className="flex items-center gap-2">
            <img
              src="/uniteIcon.png"
              alt="Unite Logo"
              className="h-8 w-8 rounded-xl object-cover shadow-md shadow-purple-500/20 border border-purple-500/20"
            />
            <div>
              <span className="font-extrabold text-sm tracking-tight text-zinc-900 dark:text-white">Unite Member</span>
              <span className="text-[9px] text-zinc-500 block leading-none">Employee & Student Portal</span>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Main Login Card */}
        <div className="w-full my-auto py-4 space-y-5 z-10">
          <div className="text-center space-y-1.5">
            <div className="h-14 w-14 rounded-2xl bg-indigo-100 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/25 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto shadow-md shadow-indigo-500/10">
              <Smartphone className="h-7 w-7" />
            </div>
            <h1 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight mt-2">Member Sign In</h1>
            <p className="text-xs text-zinc-500">Access your attendance overview, audit history & TOTP pass</p>
          </div>

          {/* Form Card */}
          <div className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-xl space-y-4">
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Employee / Student ID or Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type="text"
                    value={emailOrEmpId}
                    onChange={(e) => setEmailOrEmpId(e.target.value)}
                    placeholder="e.g. EMP-102 or jane@acme.com"
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Security Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  "Authenticating Member..."
                ) : (
                  <>
                    Sign In to Home Dashboard <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Demo Quick Fill Options */}
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2">
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider text-center">
                Quick Demo Member Logins
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleQuickDemo("EMP-102", "Jane Smith")}
                  className="p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 text-left transition-colors"
                >
                  <span className="font-semibold block text-zinc-900 dark:text-white">Jane Smith</span>
                  <span className="text-[9px] text-zinc-500">EMP-102 • Acme</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo("EMP-101", "John Doe")}
                  className="p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 text-left transition-colors"
                >
                  <span className="font-semibold block text-zinc-900 dark:text-white">John Doe</span>
                  <span className="text-[9px] text-zinc-500">EMP-101 • Acme</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center pb-2 z-10">
          <p className="text-[10px] text-zinc-400 flex items-center justify-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
            Verified Member Attendance & TOTP Pass
          </p>
        </div>
      </div>
    </div>
  );
}
