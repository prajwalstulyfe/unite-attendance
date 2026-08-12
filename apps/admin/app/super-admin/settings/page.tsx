"use client";

import { useState } from "react";
import { PageHeader } from "@repo/ui";
import { Settings, Shield, Server, Database, Key, Bell, Save, CheckCircle2, Lock, Globe, Mail, AlertTriangle, RefreshCw, Cpu } from "lucide-react";
import { toast } from "sonner";

export default function GlobalSettingsPage() {
  const [saving, setSaving] = useState(false);

  // Infrastructure & Scaling
  const [maxTenants, setMaxTenants] = useState("500");
  const [defaultPlan, setDefaultPlan] = useState("PRO");
  const [dbPoolSize, setDbPoolSize] = useState("50");
  const [rateLimitReq, setRateLimitReq] = useState("120");

  // Global Security Enforcement
  const [enableGpsVerification, setEnableGpsVerification] = useState(true);
  const [enableTotpRotation, setEnableTotpRotation] = useState(true);
  const [totpInterval, setTotpInterval] = useState("30");
  const [jwtSessionTtl, setJwtSessionTtl] = useState("15");
  const [forceAdminSso, setForceAdminSso] = useState(false);

  // OAuth & SSO Integration
  const [googleClientId, setGoogleClientId] = useState("248240689301-he1vgu35mah4aa57aos92dco6tl08gjh.apps.googleusercontent.com");
  const [allowedDomains, setAllowedDomains] = useState("stulyfe.com, unite-india.com");
  const [autoProvisionSso, setAutoProvisionSso] = useState(true);

  // Notification Telemetry
  const [smtpHost, setSmtpHost] = useState("smtp-relay.brevo.com");
  const [smtpSender, setSmtpSender] = useState("noreply@unite-attendance.com");
  const [enableDailyDigest, setEnableDailyDigest] = useState(true);

  // System Maintenance
  const [auditLogRetentionDays, setAuditLogRetentionDays] = useState("90");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSaveSettings = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Global Platform Settings updated successfully across all tenant clusters!");
    }, 600);
  };

  return (
    <div className="space-y-6 w-full max-w-7xl">
      <PageHeader
        title="Global Platform Settings"
        description="Multi-tenant architecture configuration, global security controls, OAuth SSO, and database maintenance policies"
        breadcrumbs={[
          { label: "Super Admin", href: "/super-admin/dashboard" },
          { label: "Global Settings" },
        ]}
        action={
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 rounded-xl text-xs font-bold text-white shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? <CheckCircle2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Global Policies
          </button>
        }
      />

      {/* Grid Layout spanning full container width */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Infrastructure & Scaling */}
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
            <Server className="h-4 w-4 text-indigo-500 shrink-0" /> Infrastructure & Cluster Scaling
          </h3>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">Max Provisioned Tenants</label>
              <input
                type="number"
                value={maxTenants}
                onChange={(e) => setMaxTenants(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">Default Onboarding Tier</label>
              <select
                value={defaultPlan}
                onChange={(e) => setDefaultPlan(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-indigo-500 font-semibold"
              >
                <option value="FREE">FREE TIER</option>
                <option value="STARTER">STARTER PACK</option>
                <option value="PRO">PRO ENTERPRISE</option>
                <option value="ENTERPRISE">UNLIMITED CUSTOM</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">Database Connection Pool Max</label>
              <input
                type="number"
                value={dbPoolSize}
                onChange={(e) => setDbPoolSize(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">Global Rate Limit (Req/Min per IP)</label>
              <input
                type="number"
                value={rateLimitReq}
                onChange={(e) => setRateLimitReq(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* 2. Global Security Enforcement */}
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
            <Shield className="h-4 w-4 text-purple-500 shrink-0" /> Global Security Enforcement
          </h3>

          <div className="space-y-3.5 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80 cursor-pointer">
              <div>
                <p className="font-semibold text-zinc-900 dark:text-white">Enforce GPS Geofence Verification</p>
                <p className="text-[10px] text-zinc-500">Require GPS coordinates on kiosk scans across all orgs</p>
              </div>
              <input
                type="checkbox"
                checked={enableGpsVerification}
                onChange={(e) => setEnableGpsVerification(e.target.checked)}
                className="h-4 w-4 accent-indigo-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80 cursor-pointer">
              <div>
                <p className="font-semibold text-zinc-900 dark:text-white">Aura Anti-Spoof TOTP Rotation</p>
                <p className="text-[10px] text-zinc-500">Cryptographic token rotation per scan window</p>
              </div>
              <input
                type="checkbox"
                checked={enableTotpRotation}
                onChange={(e) => setEnableTotpRotation(e.target.checked)}
                className="h-4 w-4 accent-indigo-600 rounded cursor-pointer"
              />
            </label>

            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">TOTP Refresh Interval (Seconds)</label>
              <input
                type="number"
                value={totpInterval}
                onChange={(e) => setTotpInterval(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">JWT Access Token TTL (Minutes)</label>
              <input
                type="number"
                value={jwtSessionTtl}
                onChange={(e) => setJwtSessionTtl(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* 3. OAuth & Single Sign-On (SSO) */}
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
            <Globe className="h-4 w-4 text-emerald-500 shrink-0" /> OAuth & Identity Providers (SSO)
          </h3>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">Google OAuth Client ID</label>
              <input
                type="text"
                value={googleClientId}
                onChange={(e) => setGoogleClientId(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">Restricted SSO Workspace Domains</label>
              <input
                type="text"
                value={allowedDomains}
                onChange={(e) => setAllowedDomains(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
              />
            </div>

            <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80 cursor-pointer">
              <div>
                <p className="font-semibold text-zinc-900 dark:text-white">Auto-Provision Members on SSO</p>
                <p className="text-[10px] text-zinc-500">Automatically register user on first Google login</p>
              </div>
              <input
                type="checkbox"
                checked={autoProvisionSso}
                onChange={(e) => setAutoProvisionSso(e.target.checked)}
                className="h-4 w-4 accent-indigo-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80 cursor-pointer">
              <div>
                <p className="font-semibold text-zinc-900 dark:text-white">Force Google SSO for Admins</p>
                <p className="text-[10px] text-zinc-500">Disable password login for org administrators</p>
              </div>
              <input
                type="checkbox"
                checked={forceAdminSso}
                onChange={(e) => setForceAdminSso(e.target.checked)}
                className="h-4 w-4 accent-indigo-600 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* 4. Notification & SMTP Telemetry */}
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
            <Mail className="h-4 w-4 text-amber-500 shrink-0" /> SMTP & Notification Telemetry
          </h3>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">Brevo SMTP Host Relay</label>
              <input
                type="text"
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">System Sender Email Address</label>
              <input
                type="email"
                value={smtpSender}
                onChange={(e) => setSmtpSender(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
              />
            </div>

            <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80 cursor-pointer">
              <div>
                <p className="font-semibold text-zinc-900 dark:text-white">Daily Exception Digest Emails</p>
                <p className="text-[10px] text-zinc-500">Send daily late/out-of-bound scan summary to admins</p>
              </div>
              <input
                type="checkbox"
                checked={enableDailyDigest}
                onChange={(e) => setEnableDailyDigest(e.target.checked)}
                className="h-4 w-4 accent-indigo-600 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* 5. System Maintenance & Retention */}
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4 md:col-span-2 lg:col-span-2">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
            <Database className="h-4 w-4 text-rose-500 shrink-0" /> Maintenance & Audit Retention Policy
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">Audit Log Retention Policy (Days)</label>
              <input
                type="number"
                value={auditLogRetentionDays}
                onChange={(e) => setAuditLogRetentionDays(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">Supabase Automated Backup Schedule</label>
              <input
                type="text"
                disabled
                value="Daily @ 02:00 UTC (Supabase Pooler Managed)"
                className="w-full bg-zinc-100 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80 rounded-xl px-3 py-2 text-zinc-500 font-mono text-[11px] cursor-not-allowed"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 cursor-pointer">
                <div>
                  <p className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" /> Global System Emergency Maintenance Mode
                  </p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Suspend kiosk scans and member logins temporarily for scheduled database maintenance</p>
                </div>
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="h-4 w-4 accent-rose-600 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
