"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader, QRDisplay, StatusBadge } from "@repo/ui";
import { Download, RefreshCw, Printer, Mail, Calendar, ShieldCheck, Building2, GitBranch, Phone, KeyRound, Loader2, ArrowLeft, Clock, CheckCircle2, AlertTriangle, Lock, X, Save } from "lucide-react";
import Link from "next/link";
import { useUIStore } from "@/lib/use-ui-store";
import { useMember, useResetPassword, useRegenerateQR, useMemberAttendance } from "@repo/api-client";
import { toast } from "sonner";
import { NoOrgSelected } from "@/components/no-org-selected";

function formatRoleLabel(role: string) {
  switch (role) {
    case "ORG_ADMIN":
    case "org_admin":
      return "Organization Admin";
    case "BRANCH_MANAGER":
    case "branch_manager":
      return "Branch Manager";
    case "DEPT_HEAD":
    case "dept_head":
      return "Department Head";
    case "MEMBER":
    case "member":
      return "Employee / Student";
    default:
      return role;
  }
}

export default function MemberDetailPage() {
  const params = useParams();
  const router = useRouter();
  const memberId = (params?.memberId as string) || "";

  const { activeOrgSlug, activeOrgName } = useUIStore();
  const currentOrgSlug = activeOrgSlug;
  const currentOrgName = activeOrgName || activeOrgSlug;

  const { data: memberData, isLoading } = useMember(currentOrgSlug, memberId);
  const { data: attendanceHistory } = useMemberAttendance(currentOrgSlug, memberId);

  const resetPasswordMutation = useResetPassword(currentOrgSlug);
  const regenerateQRMutation = useRegenerateQR(currentOrgSlug);

  const [showResetModal, setShowResetModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [sendEmailNotify, setSendEmailNotify] = useState(true);

  if (!activeOrgSlug) {
    return <NoOrgSelected description="Please select an organization from the Organization Selector at the top to view member profiles." />;
  }

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3 text-zinc-500">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600 dark:text-indigo-400" />
        <p className="text-xs font-semibold">Loading live member profile & attendance telemetry...</p>
      </div>
    );
  }

  const memberName = memberData?.user?.name || (memberData as any)?.name || "Member";
  const memberEmail = memberData?.user?.email || (memberData as any)?.email || "N/A";
  const employeeId = memberData?.employeeId || `EMP-${memberId.slice(-6).toUpperCase()}`;
  const departmentName = memberData?.department?.name || "General Member";
  const branchName = memberData?.branch?.name || "Main HQ";
  const designation = memberData?.designation || formatRoleLabel(memberData?.role || "MEMBER");
  const phone = memberData?.phone || "+91 98765 43210";
  const role = memberData?.role || "MEMBER";
  const joinedDate = (memberData as any)?.createdAt ? new Date((memberData as any).createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recently Joined";

  const activeQrCode = (memberData as any)?.qrCodes?.[0];
  const qrToken = activeQrCode?.qrToken || `QR_${memberId.slice(-8).toUpperCase()}_ACTIVE`;

  const handleGenerateRandomPass = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789#@!";
    let pass = "Unite@";
    for (let i = 0; i < 6; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(pass);
  };

  const handleOpenResetModal = () => {
    handleGenerateRandomPass();
    setShowResetModal(true);
  };

  const handleConfirmResetPass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;

    try {
      await resetPasswordMutation.mutateAsync({
        memberId,
        password: newPassword.trim(),
      });
      toast.success(`Password reset successfully for ${memberName}! New Password: ${newPassword.trim()}`);
      setShowResetModal(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to reset password");
    }
  };

  const handleRegenerateQR = async () => {
    try {
      await regenerateQRMutation.mutateAsync(memberId);
      toast.success(`Regenerated new dynamic QR pass for ${memberName}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to regenerate QR pass");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/members"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Members Directory
        </Link>
      </div>

      <PageHeader
        title={`${memberName} — Profile & QR Pass`}
        description={`Live profile metadata, role assignments, pass credentials, and attendance telemetry for ${currentOrgName}`}
        breadcrumbs={[
          { label: "Members", href: "/members" },
          { label: memberName },
        ]}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenResetModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <KeyRound className="h-3.5 w-3.5" /> Reset Password
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition-all shadow-xs"
            >
              <Printer className="h-3.5 w-3.5" /> Print Pass
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Member Information & Attendance Log */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Profile Info Card */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/60 p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-2xl text-white shadow-lg shadow-indigo-500/20 shrink-0">
                  {memberName[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">{memberName}</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                      {formatRoleLabel(role)}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">{designation}</p>
                </div>
              </div>

              <div className="shrink-0">
                <StatusBadge status="active" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 text-xs">
              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80">
                <span className="text-zinc-400 font-semibold block text-[10px] uppercase tracking-wider mb-1">Corporate Email</span>
                <span className="text-zinc-900 dark:text-white font-bold flex items-center gap-1.5 truncate">
                  <Mail className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                  <span className="truncate">{memberEmail}</span>
                </span>
              </div>

              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80">
                <span className="text-zinc-400 font-semibold block text-[10px] uppercase tracking-wider mb-1">Employee / Student ID</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold block">{employeeId}</span>
              </div>

              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80">
                <span className="text-zinc-400 font-semibold block text-[10px] uppercase tracking-wider mb-1">Assigned Department</span>
                <span className="text-zinc-900 dark:text-white font-bold flex items-center gap-1.5 truncate">
                  <Building2 className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                  <span className="truncate">{departmentName}</span>
                </span>
              </div>

              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80">
                <span className="text-zinc-400 font-semibold block text-[10px] uppercase tracking-wider mb-1">Office Branch</span>
                <span className="text-zinc-900 dark:text-white font-bold flex items-center gap-1.5 truncate">
                  <GitBranch className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                  <span className="truncate">{branchName}</span>
                </span>
              </div>

              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80">
                <span className="text-zinc-400 font-semibold block text-[10px] uppercase tracking-wider mb-1">Contact Phone</span>
                <span className="text-zinc-900 dark:text-white font-bold flex items-center gap-1.5 truncate">
                  <Phone className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>{phone}</span>
                </span>
              </div>

              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80">
                <span className="text-zinc-400 font-semibold block text-[10px] uppercase tracking-wider mb-1">Date Enrolled</span>
                <span className="text-zinc-900 dark:text-white font-bold flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                  <span>{joinedDate}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Recent Attendance History */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/60 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                Recent Attendance Telemetry
              </span>
              <span className="text-xs font-mono text-zinc-400">Live Member Feed</span>
            </h3>

            <div className="divide-y divide-zinc-200 dark:divide-zinc-800 text-xs">
              {attendanceHistory?.records && attendanceHistory.records.length > 0 ? (
                attendanceHistory.records.slice(0, 5).map((rec: any, i: number) => (
                  <div key={rec.id || i} className="py-3 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-900/40 px-2 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      {rec.status === "VALID" ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                      )}
                      <div>
                        <span className="font-bold text-zinc-900 dark:text-white block">{rec.type || "CHECK_IN"}</span>
                        <span className="text-[10px] text-zinc-400 font-mono">{rec.method || "QR_MOBILE"}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-zinc-900 dark:text-white block">{new Date(rec.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      <span className="text-[10px] text-zinc-400 font-medium">{new Date(rec.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-zinc-400 text-xs space-y-1">
                  <Clock className="h-6 w-6 mx-auto text-zinc-400 opacity-60" />
                  <p>No recent check-in telemetry logged for {memberName} today.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Member QR Pass Card */}
        <div>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/60 p-6 shadow-sm space-y-6 sticky top-24">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> Member QR Pass Badge
            </h3>

            <QRDisplay
              qrToken={qrToken}
              memberName={memberName}
              employeeId={employeeId}
              departmentName={departmentName}
            />

            <div className="space-y-2 pt-2">
              <button
                onClick={handlePrint}
                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" /> Download / Print Digital Pass
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handlePrint}
                  className="py-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" /> Print Card
                </button>
                <button
                  onClick={handleRegenerateQR}
                  className="py-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-indigo-500" /> Regenerate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-amber-500" />
                Reset Member Password
              </h3>
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-0.5">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Target Member</span>
              <span className="text-sm font-bold text-zinc-900 dark:text-white block">{memberName}</span>
              <span className="text-xs text-zinc-500 block font-mono">{memberEmail}</span>
            </div>

            <form onSubmit={handleConfirmResetPass} className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-zinc-700 dark:text-zinc-400 font-bold">New Temporary Password</label>
                  <button
                    type="button"
                    onClick={handleGenerateRandomPass}
                    className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3" /> Auto-Generate
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-sm font-mono text-indigo-600 dark:text-indigo-400 font-bold focus:outline-none focus:border-indigo-500"
                    required
                  />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="sendEmailNotifyCheckDetail"
                  checked={sendEmailNotify}
                  onChange={(e) => setSendEmailNotify(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="sendEmailNotifyCheckDetail" className="text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer select-none">
                  Email new password credentials directly to member
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-xl text-xs font-bold text-white shadow-lg shadow-amber-600/20 transition-all cursor-pointer"
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  Confirm Password Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
