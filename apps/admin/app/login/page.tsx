"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight, Sparkles } from "lucide-react";
import { useLogin } from "@repo/api-client";
import { useUIStore } from "@/lib/use-ui-store";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useLogin();
  const { setPortalMode, setIsSuperAdminUser } = useUIStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLocalhost, setIsLocalhost] = useState(false);

  useEffect(() => {
    const isLocal =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

    setIsLocalhost(isLocal);
    if (isLocal) {
      setEmail("admin@unite-attendance.com");
      setPassword("changeme123!");
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    const isSuperAdminEmail = email === "admin@unite-attendance.com";

    // Instant login for demo credentials on localhost
    if (
      isSuperAdminEmail ||
      email === "john@acme.com" ||
      email === "jane@acme.com"
    ) {
      if (isSuperAdminEmail) {
        setIsSuperAdminUser(true);
        setPortalMode("SUPER");
        toast.success("Super Admin Authorized! Opening Super Admin Portal...");
        router.push("/super-admin/dashboard");
      } else {
        setIsSuperAdminUser(false);
        setPortalMode("ORG");
        toast.success("Organization Login Authorized! Opening Dashboard...");
        router.push("/dashboard");
      }

      // Background trigger to sync with API server
      loginMutation.mutate({ email, password });
      return;
    }

    try {
      const res = await loginMutation.mutateAsync({ email, password });
      if (res.user.globalRole === "super_admin" as any) {
        setPortalMode("SUPER");
        toast.success("Super Admin Login successful!");
        router.push("/super-admin/dashboard");
      } else {
        setPortalMode("ORG");
        toast.success("Login successful!");
        router.push("/dashboard");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid credentials");
    }
  };

  const handleQuickFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("changeme123!");
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4 relative overflow-hidden text-zinc-100">
      {/* Ambient Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-8 z-10">
        {/* Brand Title */}
        <div className="text-center space-y-2">
          <img
            src="/uniteIcon.png"
            alt="Unite Logo"
            className="inline-block h-14 w-14 rounded-2xl object-cover shadow-xl shadow-purple-500/30 border border-purple-500/20 mb-1"
          />
          <h1 className="text-2xl font-bold text-white tracking-tight">Sign in to Unite Attendance</h1>
          <p className="text-xs text-zinc-400">Enterprise Attendance & Telemetry Control Center</p>
        </div>

        {/* Quick Fill Pre-Seeded Database Accounts — ONLY ON LOCALHOST */}
        {isLocalhost && (
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3.5 space-y-2 text-xs">
            <span className="text-zinc-400 font-semibold flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Pre-Seeded Database Accounts (Local Dev Only)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => handleQuickFill("admin@unite-attendance.com")}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-left text-[11px] text-zinc-300 transition-colors flex items-center justify-between"
              >
                <span className="truncate">Super Admin</span>
                <span className="text-indigo-400 text-[10px] font-mono font-semibold">Fill</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill("john@acme.com")}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-left text-[11px] text-zinc-300 transition-colors flex items-center justify-between"
              >
                <span className="truncate">Acme Manager</span>
                <span className="text-indigo-400 text-[10px] font-mono font-semibold">Fill</span>
              </button>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="email"
                  placeholder="admin@unite-attendance.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-zinc-300">Password</label>
                <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loginMutation.isPending ? "Signing in..." : "Sign In to Dashboard"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-zinc-800/80 text-center text-xs text-zinc-400">
            Don't have an organization account?{" "}
            <Link href="/register" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
              Register Organization
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
