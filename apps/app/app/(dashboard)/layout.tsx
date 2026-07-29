"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, QrCode, History, User, Loader2 } from "lucide-react";
import { tokenStorage } from "@repo/api-client";

export default function AppDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = tokenStorage.getAccessToken();
    if (!token) {
      router.replace("/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 font-medium text-xs gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-emerald-500" /> Verifying member session...
      </div>
    );
  }

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "My QR Pass", href: "/qr", icon: QrCode },
    { name: "History", href: "/history", icon: History },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-zinc-200 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex justify-center transition-colors duration-200">
      {/* 1px Side Bordered Mobile Container Shell */}
      <div className="w-full max-w-md min-h-screen bg-white dark:bg-zinc-900 border-x border-zinc-300 dark:border-zinc-800 flex flex-col justify-between relative shadow-xl">
        {/* Native Mobile Viewport Content */}
        <main className="flex-1 p-4">{children}</main>

        {/* Bottom Navigation Bar */}
        <nav className="sticky bottom-0 inset-x-0 h-16 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-around px-4 z-50">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center gap-1 transition-all ${
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400 font-bold scale-105"
                    : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 font-medium"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] tracking-tight">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
