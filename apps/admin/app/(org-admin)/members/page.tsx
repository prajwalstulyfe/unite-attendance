"use client";

import { useState } from "react";
import { PageHeader, StatusBadge } from "@repo/ui";
import { UserPlus, QrCode, Search, Filter, Pencil, Trash2, Building2, X, Save } from "lucide-react";
import Link from "next/link";
import { useUIStore, MemberRecord } from "@/lib/use-ui-store";
import { toast } from "sonner";
import { useUpdateMember, useDeleteMember } from "@repo/api-client";
import { DeleteConfirmModal } from "@/components/delete-confirm-modal";

export default function MembersPage() {
  const { activeOrgName, activeOrgSlug, membersMap, editMember, deleteMember } = useUIStore();
  const [searchQuery, setSearchQuery] = useState("");

  // Backend API Mutations
  const updateMemberApi = useUpdateMember(activeOrgSlug);
  const deleteMemberApi = useDeleteMember(activeOrgSlug);

  // Edit Modal State
  const [editingMember, setEditingMember] = useState<MemberRecord | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editEmpId, setEditEmpId] = useState("");
  const [editDept, setEditDept] = useState("Engineering");
  const [editRole, setEditRole] = useState("Member");

  // Delete Modal State
  const [deletingMember, setDeletingMember] = useState<MemberRecord | null>(null);

  const currentOrgMembers = membersMap[activeOrgSlug] || [];

  const filteredMembers = currentOrgMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.dept.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenEdit = (m: MemberRecord) => {
    setEditingMember(m);
    setEditName(m.name);
    setEditEmail(m.email);
    setEditEmpId(m.empId);
    setEditDept(m.dept);
    setEditRole(m.role);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    try {
      await updateMemberApi.mutateAsync({
        memberId: editingMember.id,
        payload: {
          name: editName.trim(),
          employeeId: editEmpId.trim(),
        },
      });
    } catch (err) {
      console.log("Backend sync offline, updating local state");
    }

    editMember(activeOrgSlug, editingMember.id, {
      name: editName.trim(),
      email: editEmail.trim(),
      empId: editEmpId.trim(),
      dept: editDept,
      role: editRole,
    });

    toast.success(`Updated member details for ${editName.trim()}`);
    setEditingMember(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingMember) return;

    try {
      await deleteMemberApi.mutateAsync(deletingMember.id);
    } catch (err) {
      console.log("Backend sync offline, deleting from local state");
    }

    deleteMember(activeOrgSlug, deletingMember.id);
    toast.success(`Deleted ${deletingMember.name} from ${activeOrgName}`);
    setDeletingMember(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Members Directory — ${activeOrgName}`}
        description={`Manage employee and student profiles, roles, and attendance QR codes for ${activeOrgName}`}
        action={
          <Link
            href="/members/new"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
          >
            <UserPlus className="h-3.5 w-3.5" /> Add Member
          </Link>
        }
      />

      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeOrgName} members by name, email, or ID...`}
            className="w-full bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-xs text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-indigo-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 font-medium hidden sm:inline">
            Active Workspace: <strong className="text-indigo-600 dark:text-indigo-400">{activeOrgName}</strong> ({filteredMembers.length} Members)
          </span>
          <button className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shadow-sm">
            <Filter className="h-3.5 w-3.5" /> Filter Department
          </button>
        </div>
      </div>

      {/* Members Table */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/60 overflow-hidden shadow-sm">
        {filteredMembers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 mx-auto">
              <Building2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">No Members Found for {activeOrgName}</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              {searchQuery ? "No members match your search filter." : `Add your first member to ${activeOrgName} to generate their attendance QR pass.`}
            </p>
            <Link
              href="/members/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all mt-2"
            >
              <UserPlus className="h-3.5 w-3.5" /> Add Member to {activeOrgName}
            </Link>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/40 text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Employee ID</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60 text-xs text-zinc-700 dark:text-zinc-300">
              {filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400">
                      {m.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-900 dark:text-white">{m.name}</p>
                      <p className="text-[10px] text-zinc-500">{m.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-zinc-600 dark:text-zinc-400">{m.empId}</td>
                  <td className="py-3 px-4">{m.dept}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium">
                      {m.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={m.status} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/members/${m.id}`}
                        className="p-1.5 rounded bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                        title="View QR Code"
                      >
                        <QrCode className="h-3.5 w-3.5" />
                      </Link>

                      {/* Edit Button */}
                      <button
                        onClick={() => handleOpenEdit(m)}
                        className="p-1.5 rounded bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 transition-colors"
                        title="Edit Member"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => setDeletingMember(m)}
                        className="p-1.5 rounded bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 transition-colors"
                        title="Delete Member"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Pencil className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                Edit Member Details
              </h3>
              <button
                onClick={() => setEditingMember(null)}
                className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-700 dark:text-zinc-400 font-medium block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="text-zinc-700 dark:text-zinc-400 font-medium block mb-1">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-700 dark:text-zinc-400 font-medium block mb-1">Employee ID</label>
                  <input
                    type="text"
                    value={editEmpId}
                    onChange={(e) => setEditEmpId(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-zinc-700 dark:text-zinc-400 font-medium block mb-1">Department</label>
                  <select
                    value={editDept}
                    onChange={(e) => setEditDept(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Sales & Marketing">Sales & Marketing</option>
                    <option value="Supply Chain">Supply Chain</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-zinc-700 dark:text-zinc-400 font-medium block mb-1">System Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                >
                  <option value="Member">Member</option>
                  <option value="Manager">Department Manager</option>
                  <option value="Admin">Organization Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-3.5 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold text-white shadow-lg shadow-indigo-600/20"
                >
                  <Save className="h-3.5 w-3.5" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingMember}
        title="Delete Member Profile"
        description={`Are you sure you want to delete ${deletingMember?.name} (${deletingMember?.empId}) from ${activeOrgName}? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeletingMember(null)}
      />
    </div>
  );
}
