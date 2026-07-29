"use client";

import { useState } from "react";
import { Settings, Building2, Globe, Shield, Save, Check } from "lucide-react";

export default function SettingsPage() {
  const [orgName, setOrgName] = useState("Acme Corporation");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [currency, setCurrency] = useState("INR");
  const [allowSelfCheckIn, setAllowSelfCheckIn] = useState(true);
  const [requireGps, setRequireGps] = useState(false);
  const [notifyLate, setNotifyLate] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            <Settings className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Organization Settings
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Configure organization profile, regional preferences, and security enforcement policies
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all"
        >
          {isSaved ? (
            <>
              <Check className="h-4 w-4 text-emerald-300" />
              Settings Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Settings
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Organization Profile
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-400 block mb-1">Organization Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-400 block mb-1">Organization Slug</label>
              <input
                type="text"
                value="acme-corp"
                disabled
                className="w-full px-3.5 py-2.5 bg-zinc-100 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800/80 rounded-lg text-sm text-zinc-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Localization & Region */}
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Globe className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Regional & Localization
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-400 block mb-1">Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST +05:30)</option>
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="America/New_York">America/New_York (EST)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-400 block mb-1">Billing Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="INR">INR (₹ Indian Rupee)</option>
                <option value="USD">USD ($ United States Dollar)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security & Verification Enforcement */}
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Attendance & Security Enforcement
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80 rounded-lg">
              <div>
                <span className="text-sm font-semibold text-zinc-900 dark:text-white block">Allow Member Self Check-in</span>
                <span className="text-xs text-zinc-600 dark:text-zinc-400">Members can scan QR or check in using their mobile devices</span>
              </div>
              <input
                type="checkbox"
                checked={allowSelfCheckIn}
                onChange={(e) => setAllowSelfCheckIn(e.target.checked)}
                className="h-5 w-5 rounded border-zinc-300 dark:border-zinc-700 text-indigo-600 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80 rounded-lg">
              <div>
                <span className="text-sm font-semibold text-zinc-900 dark:text-white block">Enforce Mandatory GPS Geofencing</span>
                <span className="text-xs text-zinc-600 dark:text-zinc-400">Require members to be within branch radius for check-in</span>
              </div>
              <input
                type="checkbox"
                checked={requireGps}
                onChange={(e) => setRequireGps(e.target.checked)}
                className="h-5 w-5 rounded border-zinc-300 dark:border-zinc-700 text-indigo-600 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80 rounded-lg">
              <div>
                <span className="text-sm font-semibold text-zinc-900 dark:text-white block">Email Notifications for Late Arrivals</span>
                <span className="text-xs text-zinc-600 dark:text-zinc-400">Notify managers when members check in past late threshold</span>
              </div>
              <input
                type="checkbox"
                checked={notifyLate}
                onChange={(e) => setNotifyLate(e.target.checked)}
                className="h-5 w-5 rounded border-zinc-300 dark:border-zinc-700 text-indigo-600 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
