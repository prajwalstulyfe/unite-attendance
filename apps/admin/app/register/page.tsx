"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, Mail, Lock, User, ArrowRight, Briefcase } from "lucide-react";
import { useRegister } from "@repo/api-client";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const registerMutation = useRegister();

  const [orgName, setOrgName] = useState("");
  const [industry, setIndustry] = useState("Software & IT Services");
  const [adminName, setAdminName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName || !adminName || !email || !password) return;

    try {
      await registerMutation.mutateAsync({
        email: email.trim().toLowerCase(),
        password,
        name: adminName.trim(),
      });
      toast.success(`Organization ${orgName} registered successfully!`);
      router.push("/dashboard");
    } catch (err: any) {
      const serverMsg = err?.response?.data?.message;
      const displayMsg = Array.isArray(serverMsg)
        ? serverMsg.join(", ")
        : typeof serverMsg === "string" && serverMsg.trim().length > 0
          ? serverMsg
          : "Registration failed. An account with this email may already exist.";
      toast.error(displayMsg);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4 relative overflow-hidden text-zinc-100">
      {/* Background Glow Effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 z-10">
        {/* Logo Branding */}
        <div className="text-center space-y-2">
          <img
            src="/uniteIcon.png"
            alt="Unite Logo"
            className="inline-block h-12 w-12 rounded-2xl object-cover shadow-xl shadow-purple-500/30 border border-purple-500/20 mb-1"
          />
          <h1 className="text-2xl font-bold text-white tracking-tight">Register Organization</h1>
          <p className="text-xs text-zinc-400">Essential details to setup your institution workspace</p>
        </div>

        {/* Form Card */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-7 shadow-2xl backdrop-blur-xl space-y-5">
          <form onSubmit={handleRegister} className="space-y-4">
            {/* 1. Organization Name */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Organization Name</label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="e.g. Unite India Technologies"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* 2. Industry / Category */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Industry Sector</label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                >
                  <option value="Software & IT Services">Software & IT Services</option>
                  <option value="Corporate Enterprise">Corporate Enterprise</option>
                  <option value="Education & Universities">Education & Universities</option>
                  <option value="Healthcare & Hospitals">Healthcare & Hospitals</option>
                  <option value="Manufacturing & Operations">Manufacturing & Operations</option>
                  <option value="Retail & Field Services">Retail & Field Services</option>
                </select>
              </div>
            </div>

            {/* 3. Primary Admin Full Name */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Admin Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="e.g. Rohit Sharma"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* 4. Admin Work Email */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Admin Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="email"
                  placeholder="rohit@unite-india.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* 5. Password */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Account Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 rounded-xl text-xs font-bold text-white shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer"
            >
              {registerMutation.isPending ? "Creating Workspace..." : "Create Organization Account"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="pt-3 border-t border-zinc-800/80 text-center text-xs text-zinc-400">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
