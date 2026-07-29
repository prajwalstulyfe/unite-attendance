"use client";

import { PageHeader } from "@repo/ui";
import { ShieldCheck, MapPin, Clock, Calendar, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AttendanceRulesPage() {
  const [workStart, setWorkStart] = useState("09:00");
  const [workEnd, setWorkEnd] = useState("18:00");
  const [lateThreshold, setLateThreshold] = useState(15);
  const [requireGps, setRequireGps] = useState(false);
  const [gpsRadius, setGpsRadius] = useState(200);

  const handleSave = () => {
    toast.success("Attendance rules saved successfully!");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Rules Engine"
        description="Configure work hours, late grace period, GPS geofencing radius, and working days"
        action={
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Save className="h-3.5 w-3.5" /> Save Rules
          </button>
        }
      />

      <div className="max-w-3xl space-y-6">
        {/* Shift & Work Hours */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/60 p-6 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> Working Hours & Shift
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-400 block mb-1.5">Shift Start Time</label>
              <input
                type="time"
                value={workStart}
                onChange={(e) => setWorkStart(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-400 block mb-1.5">Shift End Time</label>
              <input
                type="time"
                value={workEnd}
                onChange={(e) => setWorkEnd(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-400 block mb-1.5">
              Late Grace Period (Minutes)
            </label>
            <input
              type="number"
              value={lateThreshold}
              onChange={(e) => setLateThreshold(Number(e.target.value))}
              className="w-full max-w-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-white"
            />
            <p className="text-[11px] text-zinc-500 mt-1">
              Check-ins after {workStart} + {lateThreshold} mins will be automatically flagged as "Late"
            </p>
          </div>
        </div>

        {/* GPS Geofencing */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/60 p-6 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> GPS Geofencing & Location Rules
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-900 dark:text-white">Enforce GPS Location Check</p>
              <p className="text-[11px] text-zinc-500">Require members/kiosk to be within approved coordinates</p>
            </div>
            <input
              type="checkbox"
              checked={requireGps}
              onChange={(e) => setRequireGps(e.target.checked)}
              className="h-4 w-4 rounded accent-indigo-600"
            />
          </div>

          {requireGps && (
            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-400 block mb-1.5">Allowed Radius (Meters)</label>
              <input
                type="number"
                value={gpsRadius}
                onChange={(e) => setGpsRadius(Number(e.target.value))}
                className="w-full max-w-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-white"
              />
            </div>
          )}
        </div>

        {/* Working Days */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/60 p-6 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" /> Working Days
          </h3>

          <div className="flex gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <button
                key={day}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${["Mon", "Tue", "Wed", "Thu", "Fri"].includes(day)
                  ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/40"
                  : "bg-zinc-100 dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-zinc-800"
                  }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
