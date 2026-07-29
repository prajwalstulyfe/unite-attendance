"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  GitBranch,
  CalendarCheck,
  QrCode,
  FileBarChart,
  Settings,
  ShieldAlert,
  LogOut,
  Sparkles,
  Shield,
  Layers,
} from "lucide-react";
import { useSession, useLogout, tokenStorage } from "@repo/api-client";
import { useUIStore } from "@/lib/use-ui-store";
import { toast } from "sonner";

interface SidebarProps {
  orgId?: string;
  isSuperAdmin?: boolean;
}

export function Sidebar({ orgId = "acme-corp", isSuperAdmin = false }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const logoutMutation = useLogout();
  const { portalMode, togglePortalMode, isSuperAdminUser: isSuperStore, setIsSuperAdminUser } = useUIStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentUser = session?.user;
  const isSuperUser =
    isSuperAdmin ||
    isSuperStore ||
    (currentUser?.globalRole as string) === "super_admin" ||
    (currentUser?.globalRole as string) === "SUPER_ADMIN" ||
    currentUser?.email === "admin@unite-attendance.com";

  const userName = isSuperUser ? "Super Admin" : (currentUser?.name ?? "Admin User");
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const userEmail = isSuperUser ? "admin@unite-attendance.com" : (currentUser?.email ?? "admin@organization.com");

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      // Ignore API logout error if already expired
    }
    tokenStorage.clear();
    setIsSuperAdminUser(false);
    toast.success("Logged out successfully");
    window.location.href = "/login";
  };

  const handleToggleMode = () => {
    togglePortalMode();
    const nextMode = portalMode === "ORG" ? "SUPER" : "ORG";
    if (nextMode === "SUPER") {
      toast.success("Switched to Super Admin Portal View");
      router.push("/super-admin/dashboard");
    } else {
      toast.success("Switched to Organization Workspace View");
      router.push("/dashboard");
    }
  };

  const orgAdminNav = [
    { name: "Dashboard", href: `/dashboard`, icon: LayoutDashboard },
    { name: "Attendance Feed", href: `/attendance`, icon: CalendarCheck },
    { name: "Attendance Rules", href: `/attendance/rules`, icon: ShieldAlert },
    { name: "Branches", href: `/branches`, icon: GitBranch },
    { name: "Departments", href: `/departments`, icon: Building2 },
    { name: "Members", href: `/members`, icon: Users },
    { name: "QR Management", href: `/qr-management`, icon: QrCode },
    { name: "Reports", href: `/reports`, icon: FileBarChart },
    { name: "Settings", href: `/settings`, icon: Settings },
  ];

  const superAdminNav = [
    { name: "Platform Overview", href: `/super-admin/dashboard`, icon: LayoutDashboard },
    { name: "Organizations", href: `/super-admin/organizations`, icon: Building2 },
    { name: "Aura AI Control", href: `/super-admin/aura`, icon: Sparkles },
    { name: "Global Audit Logs", href: `/super-admin/audit-logs`, icon: Shield },
    { name: "Global Members", href: `/members`, icon: Users },
    { name: "Global Settings", href: `/settings`, icon: Settings },
  ];

  const activePortalMode = mounted ? portalMode : "ORG";
  const isSuperActive = isSuperUser && activePortalMode === "SUPER";
  const navItems = isSuperActive ? superAdminNav : orgAdminNav;

  return (
    <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/80 backdrop-blur-xl flex flex-col fixed inset-y-0 z-50 transition-colors duration-200">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <img
            src="/uniteIcon.png"
            alt="Unite Logo"
            className="h-9 w-9 rounded-xl object-cover shadow-lg shadow-purple-500/20 border border-purple-500/20"
          />
          <div>
            <span className="font-bold text-zinc-900 dark:text-white tracking-tight">Unite</span>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold block">Attendance</span>
          </div>
        </div>

        {/* ALWAYS-VISIBLE Mode Switcher Badge for Super Admins */}
        {isSuperUser && (
          <button
            onClick={handleToggleMode}
            title="Click to toggle between Super Admin Portal & Organization Workspace View"
            className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold transition-all flex items-center gap-1 shadow-sm"
          >
            <Layers className="h-3.5 w-3.5 text-indigo-500" />
            <span className="text-[10px] font-bold">{activePortalMode}</span>
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center justify-between">
          <span>{isSuperActive ? "Super Admin Portal" : "Organization Menu"}</span>
          {isSuperUser && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500 font-mono font-semibold">
              {isSuperActive ? "SUPER" : "ORG"}
            </span>
          )}
        </div>
        {navItems.map((item) => {
          const isActive =
            item.href === "/attendance" || item.href === "/dashboard"
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900/60"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400 dark:text-zinc-500"}`} />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Footer / User Badge & Logout */}
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="h-9 w-9 rounded-full bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
            {userInitials}
          </div>
          <div className="flex-1 truncate">
            <p className="text-xs font-semibold text-zinc-900 dark:text-white truncate">{userName}</p>
            <p className="text-[10px] text-zinc-500 truncate">{userEmail}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Log Out"
          className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-rose-500/10 hover:text-rose-600 text-zinc-500 transition-colors border border-zinc-200 dark:border-zinc-700 shrink-0"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
