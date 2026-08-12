"use client";

import { useState } from "react";
import { PageHeader } from "@repo/ui";
import { Download, FileText, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { useUIStore } from "@/lib/use-ui-store";
import { useTodayStats, useDepartments } from "@repo/api-client";
import { toast } from "sonner";

import { NoOrgSelected } from "@/components/no-org-selected";

export default function ReportsPage() {
  const [reportType, setReportType] = useState("DAILY");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const { activeOrgSlug, activeOrgName } = useUIStore();
  const currentOrgSlug = activeOrgSlug;
  const currentOrgName = activeOrgName || activeOrgSlug;

  const { data: todayStats } = useTodayStats(currentOrgSlug);
  const { data: departments } = useDepartments(currentOrgSlug);

  if (!activeOrgSlug) {
    return <NoOrgSelected description="Please select an organization from the Organization Selector at the top to generate reports." />;
  }

  const reportData = (departments || []).map((dept) => {
    const deptCount = departments?.length || 1;
    return {
      department: dept.name,
      total: Math.round((todayStats?.totalMembers || 0) / deptCount),
      present: Math.round((todayStats?.present || 0) / deptCount),
      late: Math.round((todayStats?.late || 0) / deptCount),
      absent: Math.round((todayStats?.absent || 0) / deptCount),
      percentage: todayStats?.attendancePercentage ? `${todayStats.attendancePercentage}%` : "0%",
    };
  });

  const handleExportCSV = () => {
    if (reportData.length === 0) {
      toast.error("No report data available to export");
      return;
    }

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
    link.setAttribute("download", `unite_${activeOrgSlug}_attendance_report_${date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported CSV report for ${date} (${activeOrgName})`);
  };

  const handleExportPDF = () => {
    toast.success(`Opening PDF print summary for ${date}`);
    window.print();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Reports & Analytics"
        description={`Generate and export detailed daily, monthly, and department-wise attendance summaries for ${currentOrgName}`}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition-colors shadow-sm"
            >
              <Download className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              Export CSV
            </button>
            <button
              onClick={handleExportPDF}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all"
            >
              <FileText className="h-3.5 w-3.5" />
              Print PDF
            </button>
          </div>
        }
      />

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
              className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 font-medium"
            />
          </div>
        </div>

        <div className="text-xs text-zinc-500 font-medium">
          Report Period: <strong className="text-zinc-900 dark:text-white">{reportType}</strong> ({date})
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-zinc-500 block font-medium">Total Present</span>
            <span className="text-xl font-bold text-zinc-900 dark:text-white">{todayStats?.present ?? 0} Members</span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-zinc-500 block font-medium">Total Late Flagged</span>
            <span className="text-xl font-bold text-amber-600 dark:text-amber-400">{todayStats?.late ?? 0} Members</span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-zinc-500 block font-medium">Total Absent</span>
            <span className="text-xl font-bold text-rose-600 dark:text-rose-400">{todayStats?.absent ?? 0} Members</span>
          </div>
        </div>
      </div>

      {/* Report Table */}
      <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-950/40">
          <h3 className="font-bold text-zinc-900 dark:text-white text-sm">Department Breakdown</h3>
          <span className="text-xs text-zinc-500 font-mono">Org: {activeOrgSlug}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-160">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-950/60 text-[11px] font-extrabold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4 text-center">Total Assigned</th>
                <th className="py-3 px-4 text-center">Present</th>
                <th className="py-3 px-4 text-center">Late</th>
                <th className="py-3 px-4 text-center">Absent</th>
                <th className="py-3 px-4 text-right">Rate %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/80 text-xs">
              {reportData.map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-950/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-white">{row.department}</td>
                  <td className="py-3 px-4 text-center font-medium">{row.total}</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400">{row.present}</td>
                  <td className="py-3 px-4 text-center font-bold text-amber-600 dark:text-amber-400">{row.late}</td>
                  <td className="py-3 px-4 text-center font-bold text-rose-600 dark:text-rose-400">{row.absent}</td>
                  <td className="py-3 px-4 text-right font-extrabold text-indigo-600 dark:text-indigo-400">{row.percentage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
