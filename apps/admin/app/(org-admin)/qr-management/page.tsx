"use client";

import { useState } from "react";
import { QrCode, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const sampleQRCodes = [
  {
    id: "qr_01",
    memberName: "John Doe",
    employeeId: "EMP-101",
    department: "Engineering",
    qrToken: "TOKEN_MEMBER_101_ACTIVE",
    type: "DYNAMIC_MOBILE",
    status: "ACTIVE",
    generatedAt: "29 Jul 2026",
    expiresAt: "Never",
  },
  {
    id: "qr_02",
    memberName: "Jane Smith",
    employeeId: "EMP-102",
    department: "Engineering",
    qrToken: "TOKEN_MEMBER_102_ACTIVE",
    type: "DYNAMIC_MOBILE",
    status: "ACTIVE",
    generatedAt: "29 Jul 2026",
    expiresAt: "Never",
  },
  {
    id: "qr_03",
    memberName: "Alice Johnson",
    employeeId: "EMP-103",
    department: "Human Resources",
    qrToken: "TOKEN_MEMBER_103_ACTIVE",
    type: "DYNAMIC_MOBILE",
    status: "ACTIVE",
    generatedAt: "28 Jul 2026",
    expiresAt: "Never",
  },
  {
    id: "qr_04",
    memberName: "Bob Williams",
    employeeId: "EMP-104",
    department: "Engineering",
    qrToken: "TOKEN_MEMBER_104_EXPIRED",
    type: "PRINTED_BADGE",
    status: "REVOKED",
    generatedAt: "15 Jan 2026",
    expiresAt: "Revoked by Admin",
  },
];

export default function QRManagementPage() {
  const [qrCodes, setQrCodes] = useState(sampleQRCodes);
  const [isBulkGenerating, setIsBulkGenerating] = useState(false);

  const handleRegenerate = (id: string, name: string) => {
    const newToken = `TOKEN_${Math.random().toString(36).substring(7).toUpperCase()}`;
    setQrCodes(
      qrCodes.map((q) =>
        q.id === id
          ? {
              ...q,
              status: "ACTIVE",
              qrToken: newToken,
              generatedAt: "Just now",
            }
          : q
      )
    );
    toast.success(`Regenerated QR code for ${name} (${newToken})`);
  };

  const handleBulkGenerate = () => {
    setIsBulkGenerating(true);
    setTimeout(() => {
      setQrCodes((prev) =>
        prev.map((q) => ({
          ...q,
          status: "ACTIVE",
          qrToken: `TOKEN_BULK_${Math.random().toString(36).substring(7).toUpperCase()}`,
          generatedAt: "Just now",
        }))
      );
      setIsBulkGenerating(false);
      toast.success("Bulk QR Code regeneration complete! All active members received updated dynamic QR tokens.");
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            <QrCode className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            QR Code Management
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Generate, regenerate, and manage secure dynamic & printed QR tokens for member check-in
          </p>
        </div>

        <button
          onClick={handleBulkGenerate}
          disabled={isBulkGenerating}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium text-white shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isBulkGenerating ? "animate-spin" : ""}`} />
          {isBulkGenerating ? "Regenerating All..." : "Bulk Regenerate All QRs"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-zinc-500 block font-medium">Active Member QRs</span>
            <span className="text-xl font-bold text-zinc-900 dark:text-white">{qrCodes.filter(q => q.status === "ACTIVE").length} Active</span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-zinc-500 block font-medium">Monthly Regeneration Limit</span>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">42 / 50 Remaining</span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-zinc-500 block font-medium">Revoked / Expired QRs</span>
            <span className="text-xl font-bold text-amber-600 dark:text-amber-400">{qrCodes.filter(q => q.status === "REVOKED").length} Revoked</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-100 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-400 uppercase text-[11px] font-semibold border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-3">Member</th>
                <th className="px-6 py-3">QR Token</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Generated Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
              {qrCodes.map((qr) => (
                <tr key={qr.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-zinc-900 dark:text-white">{qr.memberName}</div>
                    <div className="text-xs text-zinc-500">{qr.employeeId} • {qr.department}</div>
                  </td>

                  <td className="px-6 py-4 font-mono text-xs text-indigo-600 dark:text-indigo-300">
                    {qr.qrToken}
                  </td>

                  <td className="px-6 py-4 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    {qr.type.replace("_", " ")}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        qr.status === "ACTIVE"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      {qr.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-xs text-zinc-500">
                    {qr.generatedAt}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleRegenerate(qr.id, qr.memberName)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-medium text-zinc-800 dark:text-white rounded-lg transition-colors border border-zinc-200 dark:border-zinc-700"
                    >
                      <RefreshCw className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                      Regenerate
                    </button>
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
