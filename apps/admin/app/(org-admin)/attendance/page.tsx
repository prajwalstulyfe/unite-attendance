"use client";

import { useState } from "react";
import { PageHeader, StatusBadge } from "@repo/ui";
import { CalendarCheck, Search, Filter, Download, CheckCircle2, Clock, XCircle, Shield } from "lucide-react";
import { toast } from "sonner";

const mockAttendanceLogs = [
  {
    id: "att_01",
    memberName: "Jane Smith",
    employeeId: "EMP-102",
    department: "Engineering",
    timestamp: "2026-07-29 09:02:14 AM",
    method: "DYNAMIC_QR",
    status: "present",
    location: "HQ — Bengaluru",
  },
  {
    id: "att_02",
    memberName: "Bob Williams",
    employeeId: "EMP-104",
    department: "Engineering",
    timestamp: "2026-07-29 09:18:40 AM",
    method: "KIOSK_PIN",
    status: "late",
    location: "HQ — Bengaluru",
  },
  {
    id: "att_03",
    memberName: "Alice Johnson",
    employeeId: "EMP-103",
    department: "Human Resources",
    timestamp: "2026-07-29 09:24:05 AM",
    method: "DYNAMIC_QR",
    status: "present",
    location: "Tech Park — Hyderabad",
  },
  {
    id: "att_04",
    memberName: "John Doe",
    employeeId: "EMP-101",
    department: "Engineering",
    timestamp: "2026-07-29 08:55:12 AM",
    method: "GPS_MOBILE",
    status: "present",
    location: "HQ — Bengaluru",
  },
];

export default function AttendanceFeedPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredLogs = mockAttendanceLogs.filter((log) => {
    const matchesSearch =
      log.memberName.toLowerCase().includes(search.toLowerCase()) ||
      log.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      log.department.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = ["Member Name", "Employee ID", "Department", "Timestamp", "Verification Method", "Status", "Location"];
    const csvRows = [
      headers.join(","),
      ...filteredLogs.map((log) =>
        [
          `"${log.memberName}"`,
          `"${log.employeeId}"`,
          `"${log.department}"`,
          `"${log.timestamp}"`,
          `"${log.method}"`,
          `"${log.status}"`,
          `"${log.location}"`,
        ].join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `unite_attendance_feed_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Downloaded Attendance Feed CSV");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            <CalendarCheck className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Live Attendance Feed
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Real-time telemetry stream of all member check-ins, scans, and verification logs
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition-colors shadow-sm"
        >
          <Download className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Export CSV
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-zinc-500 block font-medium">On-Time Check-ins</span>
            <span className="text-xl font-bold text-zinc-900 dark:text-white">152 Present</span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-zinc-500 block font-medium">Late Arrivals</span>
            <span className="text-xl font-bold text-amber-600 dark:text-amber-400">12 Flagged</span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-zinc-500 block font-medium">Verification Method</span>
            <span className="text-xl font-bold text-zinc-900 dark:text-white">89% Dynamic QR</span>
          </div>
        </div>
      </div>

      {/* Filter controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search by member name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-xs text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-indigo-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-zinc-300 focus:outline-none focus:border-indigo-500 shadow-sm"
          >
            <option value="ALL">All Statuses</option>
            <option value="present">Present</option>
            <option value="late">Late</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-100 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-400 uppercase text-[11px] font-semibold border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-3">Member</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Time</th>
                <th className="px-6 py-3">Method</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-zinc-900 dark:text-white">{log.memberName}</div>
                    <div className="text-xs text-zinc-500">{log.employeeId}</div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-zinc-600 dark:text-zinc-400">{log.department}</td>
                  <td className="px-6 py-4 text-xs font-mono text-zinc-600 dark:text-zinc-400">{log.timestamp}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                      {log.method.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-zinc-500">{log.location}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={log.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
