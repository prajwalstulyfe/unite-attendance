"use client";

import { useState } from "react";
import { PageHeader } from "@repo/ui";
import { Building2, Plus, Users, Pencil, Trash2, X, Save, ExternalLink, Loader2, Inbox, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { useUIStore } from "@/lib/use-ui-store";
import { useDepartments, useCreateDepartment, useUpdateDepartment, useDeleteDepartment, useMembers } from "@repo/api-client";
import { DeleteConfirmModal } from "@/components/delete-confirm-modal";
import { NoOrgSelected } from "@/components/no-org-selected";

interface DeptItem {
  id: string;
  name: string;
  code: string;
  head: string;
  headId: string | null;
  count: number;
}

const getKioskUrl = (deptId: string, deptName?: string, orgName?: string, orgSlug?: string) => {
  const dName = encodeURIComponent(deptName || "");
  const oName = encodeURIComponent(orgName || "");
  const oSlug = encodeURIComponent(orgSlug || "");
  if (typeof window !== "undefined") {
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const kioskBase = isLocal
      ? "http://localhost:3003"
      : (process.env.NEXT_PUBLIC_KIOSK_URL || "https://kiosk.unite-attendance.com");
    return `${kioskBase}/?deptId=${deptId}&deptName=${dName}&orgName=${oName}&orgSlug=${oSlug}`;
  }
  return `https://kiosk.unite-attendance.com/?deptId=${deptId}&deptName=${dName}&orgName=${oName}&orgSlug=${oSlug}`;
};

export default function DepartmentsPage() {
  const { activeOrgSlug, activeOrgName } = useUIStore();
  const currentOrgSlug = activeOrgSlug;
  const currentOrgName = activeOrgName || activeOrgSlug;

  const { data: apiDepts, isLoading } = useDepartments(currentOrgSlug);
  const { data: membersData } = useMembers(currentOrgSlug);

  if (!activeOrgSlug) {
    return <NoOrgSelected description="Please select an organization from the Organization Selector at the top to view its departments." />;
  }

  const createDeptMutation = useCreateDepartment(currentOrgSlug);
  const updateDeptMutation = useUpdateDepartment(currentOrgSlug);
  const deleteDeptMutation = useDeleteDepartment(currentOrgSlug);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDept, setEditingDept] = useState<DeptItem | null>(null);
  const [deletingDept, setDeletingDept] = useState<DeptItem | null>(null);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [headId, setHeadId] = useState("");

  const departments: DeptItem[] =
    apiDepts && apiDepts.length > 0
      ? apiDepts.map((d: any) => ({
          id: d.id,
          name: d.name,
          code: d.name.substring(0, 3).toUpperCase(),
          head: d.head?.user?.name || "Unassigned",
          headId: d.headId || d.head?.id || null,
          count: d._count?.members ?? 0,
        }))
      : [];

  const handleAddDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await createDeptMutation.mutateAsync({
        name: name.trim(),
        headId: headId || undefined,
      } as any);
      toast.success(`Created department "${name.trim()}"`);
      setName("");
      setCode("");
      setHeadId("");
      setShowAddModal(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create department");
    }
  };

  const handleOpenEdit = (dept: DeptItem) => {
    setEditingDept(dept);
    setName(dept.name);
    setCode(dept.code);
    setHeadId(dept.headId || "");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept || !name.trim()) return;

    try {
      await updateDeptMutation.mutateAsync({
        id: editingDept.id,
        name: name.trim(),
        headId: headId || null,
      });
      toast.success(`Updated department "${name.trim()}"`);
      setEditingDept(null);
      setName("");
      setCode("");
      setHeadId("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update department");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingDept) return;
    try {
      await deleteDeptMutation.mutateAsync(deletingDept.id);
      toast.success(`Deleted department "${deletingDept.name}"`);
      setDeletingDept(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete department");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Departments Management"
        description={`Structure your organization into departments, assign department heads, and launch locked department scanners for ${currentOrgName}`}
        action={
          <button
            onClick={() => {
              setName("");
              setCode("");
              setHeadId("");
              setShowAddModal(true);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Plus className="h-3.5 w-3.5" /> Add Department
          </button>
        }
      />

      {/* Grid of Department Cards */}
      {isLoading ? (
        <div className="py-16 flex items-center justify-center text-xs text-zinc-400 gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-500" /> Querying organization departments...
        </div>
      ) : departments.length === 0 ? (
        <div className="py-16 text-center space-y-2 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950/60">
          <Inbox className="h-8 w-8 text-zinc-400 mx-auto" />
          <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">No departments configured for {currentOrgName}</p>
          <p className="text-[11px] text-zinc-400">Click &quot;Add Department&quot; to create your first team structure.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/60 p-6 space-y-4 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 text-xs">
                      {dept.code}
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-900 dark:text-white text-base tracking-tight">{dept.name}</h3>
                      <span className="text-[10px] text-zinc-500 font-mono">CODE: {dept.code}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(dept)}
                      className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors border border-zinc-200 dark:border-zinc-800"
                      title="Edit Department / Assign Head"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingDept(dept)}
                      className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 hover:bg-rose-50 dark:hover:bg-rose-500/20 text-zinc-600 dark:text-zinc-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors border border-zinc-200 dark:border-zinc-800"
                      title="Delete Department"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80">
                    <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Department Head</span>
                    <span className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5 mt-0.5 truncate">
                      <UserCheck className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                      <span className="truncate">{dept.head}</span>
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80">
                    <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Active Members</span>
                    <span className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                      <Users className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      {dept.count} Members
                    </span>
                  </div>
                </div>
              </div>

              {/* Launch Kiosk Scanner */}
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                <a
                  href={getKioskUrl(dept.id, dept.name, currentOrgName, currentOrgSlug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 group"
                >
                  Launch Department Scanner
                  <ExternalLink className="h-3.5 w-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Department Modal */}
      {(showAddModal || editingDept) && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Building2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                {editingDept ? "Edit Department" : "Add Department"}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingDept(null);
                }}
                className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={editingDept ? handleSaveEdit : handleAddDept} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-700 dark:text-zinc-400 font-medium block mb-1">Department Name</label>
                <input
                  type="text"
                  placeholder="e.g. Software Engineering"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-zinc-700 dark:text-zinc-400 font-medium block mb-1">Assign Department Head (Any Member)</label>
                <select
                  value={headId}
                  onChange={(e) => setHeadId(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Unassigned</option>
                  {membersData?.items?.map((m: any) => (
                    <option key={m.id} value={m.id}>
                      {m.user?.name || m.name} ({m.user?.email || m.email || "Member"})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-zinc-500 mt-1">Select an organization member to manage this department.</p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingDept(null);
                  }}
                  className="px-3.5 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all"
                >
                  <Save className="h-3.5 w-3.5" />
                  {editingDept ? "Save Changes" : "Save Department"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingDept && (
        <DeleteConfirmModal
          isOpen={!!deletingDept}
          title={`Delete ${deletingDept.name} Department?`}
          description={`Are you sure you want to delete ${deletingDept.name} (${deletingDept.code})? Members assigned to this department will need to be reassigned.`}
          onConfirm={handleConfirmDelete}
          onClose={() => setDeletingDept(null)}
        />
      )}
    </div>
  );
}
