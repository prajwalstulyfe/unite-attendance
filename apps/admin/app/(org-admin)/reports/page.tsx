"use client";

import { useState } from "react";
import { FileBarChart, Download, FileText, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { toast } from "sonner";

export default function ReportsPage() {
  const [reportType, setReportType] = useState("DAILY");
  const [date, setDate] = useState("2026-07-29");

  const reportData = [
    { department: "Engineering", total: 84, present: 78, late: 4, absent: 2, percentage: "92.8%" },
    { department: "Human Resources", total: 22, present: 20, late: 1, absent: 1, percentage: "90.9%" },
    { department: "Sales & Marketing", total: 42, present: 38, late: 3, absent: 1, percentage: "90.5%" },
    { department: "Operations & Logistics", total: 35, present: 33, late: 1, absent: 1, percentage: "94.2%" },
  ];

  const handleExportCSV = () => {
    const headers = ["Department", "Total Assigned", "Present", "Late", "Absent", "Attendance Percentage"];
    const csvRows = [
      headers.join(","),
      ...reportData.map((row) =>
        [row.department, row.total, row.present, row.late, row.absent, row.percentage].join(",")
      ),
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `unite_attendance_report_${date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported CSV report for ${date}`);
  };

  const handleExportPDF = () => {
    toast.success(`Opening PDF print summary for ${date}`);
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileBarChart className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Attendance Reports & Analytics
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Generate and export detailed daily, monthly, and department-wise attendance summaries
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-300 dark:border-zinc-800 rounded-lg text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition-colors shadow-sm"
          >
            <Download className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            Export CSV
          </button>

          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all"
          >
            <FileText className="h-4 w-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex bg-zinc-100 dark:bg-zinc-950 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => setReportType("DAILY")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                reportType === "DAILY" ? "bg-indigo-600 text-white shadow" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              Daily Summary
            </button>
            <button
              onClick={() => setReportType("MONTHLY")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                reportType === "MONTHLY" ? "bg-indigo-600 text-white shadow" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              Monthly Sheet
            </button>
          </div>

          <div className="relative">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
          Showing report data for <strong className="text-zinc-900 dark:text-white">{date}</strong>
        </span>
      </div>

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Overall Rate</span>
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold text-zinc-900 dark:text-white">92.5%</div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">↑ +2.1% compared to last month average</p>
        </div>

        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Average Check-in Time</span>
            <Clock className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="text-3xl font-bold text-zinc-900 dark:text-white">08:58 AM</div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Standard threshold: 09:15 AM</p>
        </div>

        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Late Arrivals Rate</span>
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          </div>
          <div className="text-3xl font-bold text-zinc-900 dark:text-white">7.5%</div>
          <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">12 members checked in past 9:15 AM</p>
        </div>
      </div>

      {/* Department Breakdown Table */}
      <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 font-bold text-zinc-900 dark:text-white text-base">
          Department Attendance Breakdown
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-100 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-400 uppercase text-[11px] font-semibold border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Total Assigned</th>
                <th className="px-6 py-3">Present</th>
                <th className="px-6 py-3">Late</th>
                <th className="px-6 py-3">Absent</th>
                <th className="px-6 py-3">Attendance %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
              {reportData.map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">{row.department}</td>
                  <td className="px-6 py-4">{row.total}</td>
                  <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400 font-medium">{row.present}</td>
                  <td className="px-6 py-4 text-amber-600 dark:text-amber-400 font-medium">{row.late}</td>
                  <td className="px-6 py-4 text-rose-600 dark:text-rose-400 font-medium">{row.absent}</td>
                  <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">{row.percentage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
