"use client";

import { useState } from "react";
import { Building2, Plus, Users, Shield, Pencil, Trash2, X, Save, QrCode, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { DeleteConfirmModal } from "@/components/delete-confirm-modal";

interface DeptItem {
  id: string;
  name: string;
  code: string;
  head: string;
  count: number;
}

const initialDepartments: DeptItem[] = [
  { id: "dept_01", name: "Engineering", code: "ENG", head: "John Doe", count: 84 },
  { id: "dept_02", name: "Human Resources", code: "HR", head: "Alice Johnson", count: 22 },
  { id: "dept_03", name: "Sales & Marketing", code: "SLS", head: "Bob Williams", count: 42 },
  { id: "dept_04", name: "Operations", code: "OPS", head: "Unassigned", count: 20 },
];

const getKioskUrl = (deptId: string) => {
  if (typeof window !== "undefined") {
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const kioskBase = isLocal
      ? "http://localhost:3003"
      : (process.env.NEXT_PUBLIC_KIOSK_URL || "https://kiosk.unite-attendance.com");
    return `${kioskBase}/?deptId=${deptId}`;
  }
  return `https://kiosk.unite-attendance.com/?deptId=${deptId}`;
};

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<DeptItem[]>(initialDepartments);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDept, setEditingDept] = useState<DeptItem | null>(null);
  const [deletingDept, setDeletingDept] = useState<DeptItem | null>(null);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [head, setHead] = useState("Unassigned");

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    const newDept: DeptItem = {
      id: `dept_${Date.now()}`,
      name: name.trim(),
      code: code.toUpperCase().trim(),
      head: head.trim() || "Unassigned",
      count: 0,
    };

    setDepartments([...departments, newDept]);
    toast.success(`Created department ${name.trim()}`);
    setName("");
    setCode("");
    setHead("Unassigned");
    setShowAddModal(false);
  };

  const handleOpenEdit = (dept: DeptItem) => {
    setEditingDept(dept);
    setName(dept.name);
    setCode(dept.code);
    setHead(dept.head);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept) return;

    setDepartments(
      departments.map((d) =>
        d.id === editingDept.id
          ? { ...d, name: name.trim(), code: code.toUpperCase().trim(), head: head.trim() || "Unassigned" }
          : d
      )
    );

    toast.success(`Updated department ${name.trim()}`);
    setEditingDept(null);
    setName("");
    setCode("");
  };

  const handleConfirmDelete = () => {
    if (!deletingDept) return;
    setDepartments(departments.filter((d) => d.id !== deletingDept.id));
    toast.success(`Deleted department ${deletingDept.name}`);
    setDeletingDept(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            <Building2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Departments Management
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Structure your organization into departments, assign department leads, and launch locked department scanners
          </p>
        </div>

        <button
          onClick={() => {
            setName("");
            setCode("");
            setHead("Unassigned");
            setShowAddModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium text-white shadow-lg shadow-indigo-600/20 transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Department
        </button>
      </div>

      {/* Grid of Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                    {dept.code}
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-900 dark:text-white text-base">{dept.name}</h3>
                    <span className="text-xs text-zinc-500">ID: {dept.id}</span>
                  </div>
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(dept)}
                    className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors border border-zinc-200 dark:border-zinc-700"
                    title="Edit Department"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingDept(dept)}
                    className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-rose-50 dark:hover:bg-rose-500/20 text-zinc-600 dark:text-zinc-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors border border-zinc-200 dark:border-zinc-700"
                    title="Delete Department"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                  <span>{dept.count} Members</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="truncate max-w-[120px]">{dept.head}</span>
                </div>
              </div>
            </div>

            {/* Launch Locked Department Scanner Button */}
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
              <a
                href={getKioskUrl(dept.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 group"
              >
                <QrCode className="h-4 w-4 text-indigo-500" />
                Launch Locked Kiosk Scanner
                <ExternalLink className="h-3.5 w-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>
        ))}
      </div>

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

      {/* Add / Edit Department Modal */}
      {(showAddModal || editingDept) && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                {editingDept ? "Edit Department" : "Create New Department"}
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

            <form onSubmit={editingDept ? handleSaveEdit : handleAddDept} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-400 block mb-1">Department Name</label>
                <input
                  type="text"
                  placeholder="e.g. Finance & Accounting"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-zinc-700 dark:text-zinc-400 block mb-1">Department Code</label>
                  <input
                    type="text"
                    placeholder="e.g. FIN"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 uppercase"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-700 dark:text-zinc-400 block mb-1">Department Lead</label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={head}
                    onChange={(e) => setHead(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingDept(null);
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
                  {editingDept ? "Save Changes" : "Save Department"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
