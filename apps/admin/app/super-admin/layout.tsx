"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { tokenStorage } from "@repo/api-client";
import { Sidebar } from "../../components/sidebar";
import { TopBar } from "../../components/topbar";
import { Loader2 } from "lucide-react";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <Loader2 className="h-4 w-4 animate-spin text-purple-500" /> Verifying super admin session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex transition-colors duration-200">
      <Sidebar isSuperAdmin={true} />
      <div className="flex-1 pl-64 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 p-6 sm:p-8 w-full space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
