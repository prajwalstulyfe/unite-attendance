"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight, Sparkles } from "lucide-react";
import { useLogin, tokenStorage } from "@repo/api-client";
import { useUIStore } from "@/lib/use-ui-store";
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.unite-attendance.com";

export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useLogin();
  const { setPortalMode, setIsSuperAdminUser } = useUIStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLocalhost, setIsLocalhost] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check for Google OAuth callback tokens in URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const refresh = urlParams.get("refresh");

    if (token && refresh) {
      tokenStorage.setTokens(token, refresh);
      toast.success("Google Sign-In successful!");
      router.push("/dashboard");
      return;
    }

    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    setIsLocalhost(isLocal);
    if (isLocal) {
      setEmail("admin@unite-attendance.com");
      setPassword("changeme123!");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);

    const isSuperAdminEmail = email === "admin@unite-attendance.com";

    // Demo bypass ONLY allowed on local localhost development
    if (
      isLocalhost &&
      (isSuperAdminEmail || email === "john@acme.com" || email === "jane@acme.com")
    ) {
      tokenStorage.setTokens("demo_access_token_123", "demo_refresh_token_123");
      if (isSuperAdminEmail) {
        setIsSuperAdminUser(true);
        setPortalMode("SUPER");
        toast.success("Super Admin Authorized! (Dev Mode)");
        router.push("/super-admin/dashboard");
      } else {
        setIsSuperAdminUser(false);
        setPortalMode("ORG");
        toast.success("Organization Login Authorized! (Dev Mode)");
        router.push("/dashboard");
      }
      setLoading(false);
      return;
    }

    try {
      const res = await loginMutation.mutateAsync({ email, password });
      if (res?.accessToken) {
        tokenStorage.setTokens(res.accessToken, res.refreshToken);
      } else {
        tokenStorage.setTokens("session_authenticated_token", "session_refresh_token");
      }

      if (res?.user?.globalRole === "super_admin" || isSuperAdminEmail) {
        setIsSuperAdminUser(true);
        setPortalMode("SUPER");
        toast.success("Super Admin Login successful!");
        router.push("/super-admin/dashboard");
      } else {
        setIsSuperAdminUser(false);
        setPortalMode("ORG");
        toast.success("Login successful!");
        router.push("/dashboard");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
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

        {/* Quick Fill Pre-Seeded Accounts (Dev Only) */}
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
                <span className="truncate">Org Admin</span>
                <span className="text-indigo-400 text-[10px] font-mono font-semibold">Fill</span>
              </button>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300">Password</label>
              <a href="#" className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            {loading ? "Authenticating..." : "Sign In to Admin Portal"} <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-zinc-800 w-full" />
          <span className="bg-zinc-950 px-3 text-[10px] text-zinc-500 uppercase tracking-widest font-semibold absolute">
            Or continue with
          </span>
        </div>

        {/* Google OAuth Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-200 transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.15C3.25 21.3 7.31 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.27C.46 8.2.01 10.04.01 12c0 1.96.45 3.8 1.26 5.42l4.01-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.58l4.01 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          Sign in with Google Workspace
        </button>

        {/* Footer info */}
        <p className="text-center text-[11px] text-zinc-500 font-medium">
          Don't have an organization yet?{" "}
          <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
            Register your institution
          </Link>
        </p>
      </div>
    </div>
  );
}
