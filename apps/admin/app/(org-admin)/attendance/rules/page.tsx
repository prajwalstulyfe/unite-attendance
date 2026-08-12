"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AttendanceRulesRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/settings");
  }, [router]);

  return (
    <div className="py-24 flex flex-col items-center justify-center space-y-3 text-zinc-400">
      <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
      <p className="text-xs font-semibold">Redirecting to Organization Settings & Attendance Rules...</p>
    </div>
  );
}
