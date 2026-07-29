"use client";

import { useState } from "react";
import { Calendar, Clock, MapPin, Filter, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface HistoryRecord {
  id: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  location: string;
  status: "VALID" | "LATE" | "FLAGGED";
  method: string;
}

const mockHistory: HistoryRecord[] = [
  { id: "h-1", date: "Today, July 29", checkInTime: "09:02 AM", checkOutTime: "--:--", location: "Main HQ — North Gate", status: "VALID", method: "Dynamic QR" },
  { id: "h-2", date: "Yesterday, July 28", checkInTime: "09:18 AM", checkOutTime: "06:05 PM", location: "Main HQ — East Terminal", status: "LATE", method: "Dynamic QR" },
  { id: "h-3", date: "Friday, July 25", checkInTime: "08:55 AM", checkOutTime: "05:58 PM", location: "Main HQ — North Gate", status: "VALID", method: "Dynamic QR" },
  { id: "h-4", date: "Thursday, July 24", checkInTime: "09:01 AM", checkOutTime: "06:12 PM", location: "Tech Park Branch", status: "VALID", method: "Kiosk Scanner" },
  { id: "h-5", date: "Wednesday, July 23", checkInTime: "09:25 AM", checkOutTime: "06:00 PM", location: "Main HQ — North Gate", status: "LATE", method: "Dynamic QR" },
];

export default function HistoryPage() {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredHistory = mockHistory.filter(
    (item) => statusFilter === "ALL" || item.status === statusFilter
  );

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
        {filteredHistory.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 shadow-2xl shadow-indigo-500/5 dark:shadow-indigo-500/10 space-y-2.5 transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-indigo-500" /> {item.date}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  item.status === "VALID"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                }`}
              >
                {item.status === "VALID" ? "ON TIME" : "LATE (+18m)"}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400 pt-1.5 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-1.5 font-mono font-medium">
                <Clock className="h-3.5 w-3.5 text-zinc-400" />
                <span>In: <strong className="text-zinc-900 dark:text-white">{item.checkInTime}</strong></span>
                <span className="text-zinc-400">|</span>
                <span>Out: {item.checkOutTime}</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-semibold">{item.method}</span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
              <MapPin className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
              <span className="truncate">{item.location}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
