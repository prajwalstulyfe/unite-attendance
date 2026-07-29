"use client";

import { useState } from "react";
import { GitBranch, Plus, MapPin, Radio, Monitor, Pencil, Trash2, X, Save } from "lucide-react";
import { toast } from "sonner";
import { DeleteConfirmModal } from "@/components/delete-confirm-modal";

interface BranchItem {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  activeKiosks: number;
  memberCount: number;
  isPrimary: boolean;
}

const initialBranches: BranchItem[] = [
  {
    id: "br_01",
    name: "HQ — Bengaluru",
    address: "Indiranagar 100ft Road, Bengaluru, KA 560038",
    lat: 12.9716,
    lng: 77.5946,
    radiusMeters: 300,
    activeKiosks: 2,
    memberCount: 148,
    isPrimary: true,
  },
  {
    id: "br_02",
    name: "Tech Park — Hyderabad",
    address: "HITEC City, Phase 2, Hyderabad, TS 500081",
    lat: 17.4483,
    lng: 78.3808,
    radiusMeters: 250,
    activeKiosks: 1,
    memberCount: 20,
    isPrimary: false,
  },
];

export default function BranchesPage() {
  const [branches, setBranches] = useState<BranchItem[]>(initialBranches);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchItem | null>(null);
  const [deletingBranch, setDeletingBranch] = useState<BranchItem | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [radiusMeters, setRadiusMeters] = useState(300);

  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address) return;

    const newBranch: BranchItem = {
      id: `br_${Date.now()}`,
      name: name.trim(),
      address: address.trim(),
      lat: 12.9716,
      lng: 77.5946,
      radiusMeters: radiusMeters,
      activeKiosks: 1,
      memberCount: 0,
      isPrimary: false,
    };

    setBranches([...branches, newBranch]);
    toast.success(`Created branch ${name.trim()}`);
    setName("");
    setAddress("");
    setRadiusMeters(300);
    setShowAddModal(false);
  };

  const handleOpenEdit = (br: BranchItem) => {
    setEditingBranch(br);
    setName(br.name);
    setAddress(br.address);
    setRadiusMeters(br.radiusMeters);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBranch) return;

    setBranches(
      branches.map((b) =>
        b.id === editingBranch.id
          ? { ...b, name: name.trim(), address: address.trim(), radiusMeters }
          : b
      )
    );

    toast.success(`Updated branch ${name.trim()}`);
    setEditingBranch(null);
    setName("");
    setAddress("");
  };

  const handleConfirmDelete = () => {
    if (!deletingBranch) return;
    setBranches(branches.filter((b) => b.id !== deletingBranch.id));
    toast.success(`Deleted branch ${deletingBranch.name}`);
    setDeletingBranch(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            <GitBranch className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Branch Locations & Geofences
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Manage office physical locations, GPS geofencing radiuses, and attendance kiosks
          </p>
        </div>

        <button
          onClick={() => {
            setName("");
            setAddress("");
            setRadiusMeters(300);
            setShowAddModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium text-white shadow-lg shadow-indigo-600/20 transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Office Branch
        </button>
      </div>

      {/* Branch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {branches.map((br) => (
          <div
            key={br.id}
            className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-zinc-900 dark:text-white text-lg">{br.name}</h3>
                  {br.isPrimary && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                      Headquarters
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
                  {br.address}
                </p>
              </div>

              {/* Edit & Delete Action Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(br)}
                  className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors border border-zinc-200 dark:border-zinc-700"
                  title="Edit Branch"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setDeletingBranch(br)}
                  className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-rose-50 dark:hover:bg-rose-500/20 text-zinc-600 dark:text-zinc-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors border border-zinc-200 dark:border-zinc-700"
                  title="Delete Branch"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Geofence & Device Details */}
            <div className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80 rounded-lg p-4 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-zinc-500 block mb-1 flex items-center gap-1">
                  <Radio className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                  GPS Geofence Radius
                </span>
                <span className="text-zinc-900 dark:text-white font-bold text-sm">{br.radiusMeters} meters</span>
                <span className="text-[10px] text-zinc-500 block mt-0.5">
                  {br.lat}, {br.lng}
                </span>
              </div>

              <div>
                <span className="text-zinc-500 block mb-1 flex items-center gap-1">
                  <Monitor className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  Active Devices / Kiosks
                </span>
                <span className="text-zinc-900 dark:text-white font-bold text-sm">{br.activeKiosks} Kiosks Online</span>
                <span className="text-[10px] text-zinc-500 block mt-0.5">
                  {br.memberCount} Members Assigned
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Branch Modal */}
      {(showAddModal || editingBranch) && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                {editingBranch ? "Edit Branch Office" : "Add Branch Office"}
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

            <form onSubmit={editingBranch ? handleSaveEdit : handleAddBranch} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-400 block mb-1">Branch Name</label>
                <input
                  type="text"
                  placeholder="e.g. Regional Office — Mumbai"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-400 block mb-1">Full Address</label>
                <textarea
                  placeholder="e.g. Bandra Kurla Complex, Mumbai, MH 400051"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-400 block mb-1">GPS Geofence Radius (Meters)</label>
                <input
                  type="number"
                  value={radiusMeters}
                  onChange={(e) => setRadiusMeters(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingBranch(null);
                  }}
                  className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors"
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
