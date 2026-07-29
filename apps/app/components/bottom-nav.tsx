"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, QrCode, Calendar, User } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "My QR Pass", href: "/qr", icon: QrCode },
    { name: "History", href: "/attendance", icon: Calendar },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 h-16 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-800 flex items-center justify-around z-50 px-2 max-w-md mx-auto">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
              isActive ? "text-indigo-400 font-bold" : "text-zinc-500 hover:text-zinc-300 font-medium"
            }`}
          >
            <Icon className={`h-5 w-5 ${isActive ? "text-indigo-400" : "text-zinc-500"}`} />
            <span className="text-[10px]">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
