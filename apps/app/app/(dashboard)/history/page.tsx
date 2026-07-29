"use client";

import { useState } from "react";
import { Calendar, Clock, MapPin, Filter, ShieldCheck, Inbox } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSession, useMemberAttendance } from "@repo/api-client";

export default function HistoryPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const primaryOrg = session?.organizations?.[0];

  const orgId = primaryOrg?.orgId || "";
  const memberId = primaryOrg?.memberId || user?.id || "";

  const { data: attendanceSummary, isLoading } = useMemberAttendance(orgId, memberId);

  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const records = attendanceSummary?.records || [];

  const filteredHistory = records.filter((item) => {
    if (statusFilter === "ALL") return true;
    if (statusFilter === "VALID") return item.status === "present";
    if (statusFilter === "LATE") return item.status === "late";
    return true;
  });

  return (
    <div className="space-y-5 max-w-sm mx-auto">
      {/* Top Mobile Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-extrabold text-zinc-900 dark:text-white tracking-tight">Scan History</h1>
          <p className="text-[11px] text-zinc-500">Your verified attendance check-ins</p>
        </div>
        <ThemeToggle />
      </div>

      {/* Verified Status Tag */}
      <div className="flex items-center justify-center gap-1.5 py-1 px-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold w-fit mx-auto shadow-sm">
        <ShieldCheck className="h-4 w-4 text-emerald-500" /> Audit Verified Log
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 justify-center">
        <Filter className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
        {["ALL", "VALID", "LATE"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
              statusFilter === status
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
            }`}
          >
            {status === "ALL" ? "All Logs" : status === "VALID" ? "On Time" : "Late"}
          </button>
        ))}
      </div>

      {/* History Cards */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-zinc-400">Loading attendance history...</div>
        ) : filteredHistory.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 text-center space-y-2 shadow-sm">
            <Inbox className="h-8 w-8 text-zinc-400 mx-auto" />
            <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">No attendance records found</p>
            <p className="text-[11px] text-zinc-500">Your future kiosk scan check-ins will appear here.</p>
          </div>
        ) : (
          filteredHistory.map((item, idx) => {
            const dateStr = item.date
              ? new Date(item.date).toLocaleDateString([], {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })
              : "Date N/A";
            const checkInFormatted = item.checkInTime
              ? new Date(item.checkInTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "--:--";
            const checkOutFormatted = item.checkOutTime
              ? new Date(item.checkOutTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "--:--";

            return (
              <div
                key={item.date || idx}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 shadow-2xl shadow-indigo-500/5 dark:shadow-indigo-500/10 space-y-2.5 transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-indigo-500" /> {dateStr}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      item.status === "present"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                    }`}
                  >
                    {item.status === "present" ? "ON TIME" : item.status.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400 pt-1.5 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-1.5 font-mono font-medium">
                    <Clock className="h-3.5 w-3.5 text-zinc-400" />
                    <span>In: <strong className="text-zinc-900 dark:text-white">{checkInFormatted}</strong></span>
                    <span className="text-zinc-400">|</span>
                    <span>Out: {checkOutFormatted}</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-semibold">{item.method || "Dynamic QR"}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                  <MapPin className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                  <span className="truncate">Main Gate Terminal</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
