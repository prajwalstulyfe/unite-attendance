"use client";

import { useState } from "react";
import { PageHeader } from "@repo/ui";
import { GitBranch, Plus, MapPin, Radio, Monitor, Pencil, Trash2, X, Save, Loader2, Inbox, UserCheck, Star, ShieldCheck, Building2 } from "lucide-react";
import { toast } from "sonner";
import { useUIStore } from "@/lib/use-ui-store";
import { useBranches, useCreateBranch, useUpdateBranch, useDeleteBranch, useMembers } from "@repo/api-client";
import { DeleteConfirmModal } from "@/components/delete-confirm-modal";
import { NoOrgSelected } from "@/components/no-org-selected";

interface BranchItem {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  activeKiosks: number;
  memberCount: number;
  managers: string;
  isPrimary: boolean;
}

export default function BranchesPage() {
  const { activeOrgSlug, activeOrgName } = useUIStore();
  const currentOrgSlug = activeOrgSlug;
  const currentOrgName = activeOrgName || activeOrgSlug;

  const { data: apiBranches, isLoading } = useBranches(currentOrgSlug);
  const { data: membersData } = useMembers(currentOrgSlug);

  if (!activeOrgSlug) {
    return <NoOrgSelected description="Please select an organization from the Organization Selector at the top to view its branches." />;
  }

  const createBranchMutation = useCreateBranch(currentOrgSlug);
  const updateBranchMutation = useUpdateBranch(currentOrgSlug);
  const deleteBranchMutation = useDeleteBranch(currentOrgSlug);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchItem | null>(null);
  const [deletingBranch, setDeletingBranch] = useState<BranchItem | null>(null);
  const [primaryBranchId, setPrimaryBranchId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [radiusMeters, setRadiusMeters] = useState(300);
  const [managerName, setManagerName] = useState("");
  const [isPrimaryForm, setIsPrimaryForm] = useState(false);

  const branches: BranchItem[] =
    apiBranches && apiBranches.length > 0
      ? apiBranches.map((b: any, i: number) => {
          const isHq = primaryBranchId ? primaryBranchId === b.id : i === 0;
          return {
            id: b.id,
            name: b.name,
            address: b.address || "Main Office Location",
            lat: b.location?.lat || 19.9975,
            lng: b.location?.lng || 73.7898,
            radiusMeters: b.location?.radiusMeters || 300,
            activeKiosks: b._count?.departments ?? 1,
            memberCount: b._count?.members ?? 0,
            managers: b.members?.map((m: any) => m.user?.name).filter(Boolean).join(", ") || "Aarav Verma (Branch Manager)",
            isPrimary: isHq,
          };
        })
      : [];

  const handleSetHeadquarters = (branchId: string, branchName: string) => {
    setPrimaryBranchId(branchId);
    toast.success(`Set ${branchName} as Organization Headquarters!`);
  };

  const handleAddBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address) return;

    try {
      const res = await createBranchMutation.mutateAsync({
        name: name.trim(),
        address: address.trim(),
        location: { lat: 19.9975, lng: 73.7898, radiusMeters },
      });
      if (isPrimaryForm && res?.id) {
        setPrimaryBranchId(res.id);
      }
      toast.success(`Created branch ${name.trim()} for ${currentOrgName}`);
      setName("");
      setAddress("");
      setRadiusMeters(300);
      setManagerName("");
      setIsPrimaryForm(false);
      setShowAddModal(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create branch");
    }
  };

  const handleOpenEdit = (br: BranchItem) => {
    setEditingBranch(br);
    setName(br.name);
    setAddress(br.address);
    setRadiusMeters(br.radiusMeters);
    setManagerName(br.managers);
    setIsPrimaryForm(br.isPrimary);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBranch) return;

    try {
      await updateBranchMutation.mutateAsync({
        id: editingBranch.id,
        name: name.trim(),
        address: address.trim(),
        location: { lat: editingBranch.lat, lng: editingBranch.lng, radiusMeters },
      });
      if (isPrimaryForm) {
        setPrimaryBranchId(editingBranch.id);
      }
      toast.success(`Updated branch "${name.trim()}"`);
      setEditingBranch(null);
      setName("");
      setAddress("");
      setManagerName("");
      setIsPrimaryForm(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update branch");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingBranch) return;
    try {
      await deleteBranchMutation.mutateAsync(deletingBranch.id);
      toast.success(`Deleted branch "${deletingBranch.name}"`);
      setDeletingBranch(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete branch");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Branch Locations & Geofences"
        description={`Manage physical office locations, GPS geofences, branch managers, and attendance kiosks for ${currentOrgName}`}
        action={
          <button
            onClick={() => {
              setName("");
              setAddress("");
              setRadiusMeters(300);
              setManagerName("");
              setIsPrimaryForm(false);
              setShowAddModal(true);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Plus className="h-3.5 w-3.5" /> Add Branch
          </button>
        }
      />

      {/* Grid of Branch Cards */}
      {isLoading ? (
        <div className="py-16 flex items-center justify-center text-xs text-zinc-400 gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-500" /> Querying organization branch locations...
        </div>
      ) : branches.length === 0 ? (
        <div className="py-16 text-center space-y-2 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950/60">
          <Inbox className="h-8 w-8 text-zinc-400 mx-auto" />
          <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">No branch locations registered for {currentOrgName}</p>
          <p className="text-[11px] text-zinc-400">Click &quot;Add Branch&quot; to configure your first geofence boundary.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {branches.map((br) => (
            <div
              key={br.id}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/60 p-6 space-y-4 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 font-bold">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-zinc-900 dark:text-white text-base tracking-tight">{br.name}</h3>
                        {br.isPrimary ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current" /> Headquarters
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSetHeadquarters(br.id, br.name)}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-900 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 border border-zinc-200 dark:border-zinc-800 transition-colors"
                          >
                            Set HQ
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                        {br.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(br)}
                      className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors border border-zinc-200 dark:border-zinc-800"
                      title="Edit Branch Office"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingBranch(br)}
                      className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 hover:bg-rose-50 dark:hover:bg-rose-500/20 text-zinc-600 dark:text-zinc-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors border border-zinc-200 dark:border-zinc-800"
                      title="Delete Branch"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Branch Manager Sub-Card */}
                <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <UserCheck className="h-4 w-4 text-indigo-500 shrink-0" />
                    <div>
                      <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Branch Manager</span>
                      <span className="text-xs font-bold text-zinc-900 dark:text-white block mt-0.5">{br.managers}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    Active Manager
                  </span>
                </div>

                {/* Geofence & Active Kiosks Details */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 space-y-0.5">
                    <span className="text-[10px] text-zinc-500 font-medium flex items-center gap-1">
                      <Radio className="h-3 w-3 text-indigo-500" /> GPS Geofence
                    </span>
                    <span className="text-zinc-900 dark:text-white font-bold block">{br.radiusMeters} m Radius</span>
                    <span className="text-[10px] text-zinc-500 font-mono block">{br.lat}, {br.lng}</span>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 space-y-0.5">
                    <span className="text-[10px] text-zinc-500 font-medium flex items-center gap-1">
                      <Monitor className="h-3 w-3 text-emerald-500" /> Kiosks & Depts
                    </span>
                    <span className="text-zinc-900 dark:text-white font-bold block">{br.activeKiosks} Departments</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">{br.memberCount} Members Assigned</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Branch Modal */}
      {(showAddModal || editingBranch) && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                {editingBranch ? "Edit Branch Office" : "Add Office Branch"}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingBranch(null);
                }}
                className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={editingBranch ? handleSaveEdit : handleAddBranch} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-700 dark:text-zinc-400 font-medium block mb-1">Branch Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dwarka, Nashik"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-zinc-700 dark:text-zinc-400 font-medium block mb-1">Full Office Address</label>
                <textarea
                  placeholder="e.g. Dwarka Circle, Nashik, Maharashtra 422011"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-700 dark:text-zinc-400 font-medium block mb-1">GPS Geofence (Meters)</label>
                  <input
                    type="number"
                    value={radiusMeters}
                    onChange={(e) => setRadiusMeters(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-zinc-700 dark:text-zinc-400 font-medium block mb-1">Branch Manager</label>
                  <select
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">Aarav Verma (Branch Manager)</option>
                    {membersData?.items?.map((m: any) => (
                      <option key={m.id} value={m.user?.name || m.name}>
                        {m.user?.name || m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="primaryBranchCheck"
                  checked={isPrimaryForm}
                  onChange={(e) => setIsPrimaryForm(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 rounded border-zinc-300 dark:border-zinc-700 focus:ring-indigo-500"
                />
                <label htmlFor="primaryBranchCheck" className="text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer select-none">
                  Designate as Organization Headquarters (Primary Branch)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingBranch(null);
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
                  {editingBranch ? "Save Changes" : "Save Branch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingBranch}
        title="Delete Branch Location"
        description={`Are you sure you want to delete branch "${deletingBranch?.name}"? Assigned kiosks and telemetry rules will need to be reallocated.`}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeletingBranch(null)}
      />
    </div>
  );
}
