"use client";

import { Sidebar } from "../../components/sidebar";
import { TopBar } from "../../components/topbar";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex transition-colors duration-200">
      {/* Super Admin Sidebar */}
      <Sidebar isSuperAdmin={true} />

      {/* Main Content Area */}
      <div className="flex-1 pl-64 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 p-6 sm:p-8 w-full space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
