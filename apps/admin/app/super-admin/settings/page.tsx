"use client";

import { useState } from "react";
import { PageHeader } from "@repo/ui";
import { Settings, Shield, Server, Database, Key, Bell, Save, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function GlobalSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [maxTenants, setMaxTenants] = useState("500");
  const [defaultPlan, setDefaultPlan] = useState("PRO");
  const [enableGpsVerification, setEnableGpsVerification] = useState(true);
  const [enableTotpRotation, setEnableTotpRotation] = useState(true);

  const handleSaveSettings = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Global Platform Settings updated successfully!");
    }, 600);
  };

  return (
    <div className="space-y-6 w-full max-w-4xl">
      <PageHeader
        title="Global Platform Settings"
        description="Multi-tenant architecture configuration, global security controls, and database policies"
        breadcrumbs={[
          { label: "Super Admin", href: "/super-admin/dashboard" },
          { label: "Global Settings" },
        ]}
        action={
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
          >
            {saving ? <CheckCircle2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Global Policies
          </button>
        }
      />

      {/* Security & Infrastructure Policy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Multi-Tenant Provisions */}
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Server className="h-4 w-4 text-indigo-500" /> Platform Infrastructure Controls
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">Max Provisioned Tenants</label>
              <input
                type="number"
                value={maxTenants}
                onChange={(e) => setMaxTenants(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">Default Onboarding Tier</label>
              <select
                value={defaultPlan}
                onChange={(e) => setDefaultPlan(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="FREE">FREE TIER</option>
                <option value="PRO">PRO ENTERPRISE</option>
                <option value="ENTERPRISE">UNLIMITED CUSTOM</option>
              </select>
            </div>
          </div>
        </div>

        {/* Global Security Enforcement */}
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Shield className="h-4 w-4 text-purple-500" /> Global Security Enforcement
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 cursor-pointer">
              <div>
                <p className="font-semibold text-zinc-900 dark:text-white">Enforce GPS Geofence Verification</p>
                <p className="text-[10px] text-zinc-500">Require GPS coordinates on all kiosk scans across all organizations</p>
              </div>
              <input
                type="checkbox"
                checked={enableGpsVerification}
                onChange={(e) => setEnableGpsVerification(e.target.checked)}
                className="h-4 w-4 accent-indigo-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 cursor-pointer">
              <div>
                <p className="font-semibold text-zinc-900 dark:text-white">Aura Anti-Spoof TOTP Rotation</p>
                <p className="text-[10px] text-zinc-500">Enforce dynamic 30-second cryptographic token regeneration</p>
              </div>
              <input
                type="checkbox"
                checked={enableTotpRotation}
                onChange={(e) => setEnableTotpRotation(e.target.checked)}
                className="h-4 w-4 accent-indigo-600 rounded"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
