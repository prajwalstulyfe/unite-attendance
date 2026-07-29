"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, ShieldCheck, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { tokenStorage, useLogin } from "@repo/api-client";
import { ThemeToggle } from "@/components/theme-toggle";

const getApiBaseUrl = () => {
  if (typeof window !== "undefined") {
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    if (!isLocal) {
      const envUrl = process.env.NEXT_PUBLIC_API_URL;
      return envUrl && !envUrl.includes("localhost") ? envUrl : "https://api.unite-attendance.com";
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || "https://api.unite-attendance.com";
};

export default function AppLoginPage() {
  const router = useRouter();
  const loginMutation = useLogin();
  const [emailOrEmpId, setEmailOrEmpId] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check for Google OAuth callback tokens or errors in URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const refresh = urlParams.get("refresh");
    const errorMsg = urlParams.get("error");

    if (errorMsg) {
      toast.error(decodeURIComponent(errorMsg));
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (token && refresh) {
      tokenStorage.setTokens(token, refresh);
      toast.success("Welcome back! Digital Pass Activated.");
      router.push("/");
    } else {
      tokenStorage.clear();
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrEmpId) return;

    setIsSubmitting(true);

    try {
      const res = await loginMutation.mutateAsync({
        email: emailOrEmpId,
        password: password,
      });

      if (res?.accessToken) {
        tokenStorage.setTokens(res.accessToken, res.refreshToken);
        toast.success("Welcome back! Digital Pass Activated.");
        router.push("/");
      } else {
        toast.error("Login failed. No token returned from server.");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${getApiBaseUrl()}/auth/google?state=app`;
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
            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 w-fit mx-auto">
              <Smartphone className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">Member App</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto font-medium">
              Enter your Institution Email or Member ID to generate live TOTP attendance QR codes.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3 pt-2">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">Email or Member ID</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  required
                  value={emailOrEmpId}
                  onChange={(e) => setEmailOrEmpId(e.target.value)}
                  placeholder="jane@acme.com or EMP-102"
                  className="w-full bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700/80 rounded-2xl pl-10 pr-3 py-3 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-indigo-500 font-medium transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">Password / PIN</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700/80 rounded-2xl pl-10 pr-3 py-3 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-indigo-500 font-medium transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Verifying..." : "Activate My Digital Pass"} <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center py-1">
            <div className="border-t border-zinc-200 dark:border-zinc-800 w-full" />
            <span className="bg-white dark:bg-zinc-900 px-3 text-[10px] text-zinc-400 uppercase tracking-widest font-semibold absolute">
              Or sign in with
            </span>
          </div>

          {/* Google OAuth Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800/90 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-xs font-bold text-zinc-800 dark:text-zinc-200 transition-all flex items-center justify-center gap-2 shadow-sm"
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
            Sign in with Google
          </button>
        </div>

        {/* Bottom Security Footer */}
        <div className="pt-2 text-center text-[10px] text-zinc-400 font-medium flex items-center justify-center gap-1.5 z-10">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          End-to-End Encrypted TOTP Attendance Token
        </div>
      </div>
    </div>
  );
}
