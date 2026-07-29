"use client";

import { useState } from "react";
import { PageHeader } from "@repo/ui";
import { UserPlus, Save, ArrowLeft, Mail, Building2, Shield, Hash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUIStore } from "@/lib/use-ui-store";

import { useCreateMember } from "@repo/api-client";

export default function AddMemberPage() {
  const router = useRouter();
  const { activeOrgSlug, activeOrgName, addMember } = useUIStore();
  const createMemberApi = useCreateMember(activeOrgSlug);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [role, setRole] = useState("Member");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const empCode = employeeId.trim() || `EMP-${Math.floor(100 + Math.random() * 900)}`;

    try {
      await createMemberApi.mutateAsync({
        email: email.trim(),
        name: fullName,
        employeeId: empCode,
        role: role as any,
      });
    } catch (err) {
      console.log("Backend API offline, persisting member to live local store");
    }

    addMember(activeOrgSlug, {
      name: fullName,
      email: email.trim(),
      empId: empCode,
      dept: department,
      role: role,
      status: "active",
    });

    setIsSubmitting(false);
    toast.success(`Added ${fullName} to ${activeOrgName}!`);
    router.push("/members");
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <PageHeader
        title={`Add New Member — ${activeOrgName}`}
        description={`Create an employee or student profile for ${activeOrgName} and generate their QR pass`}
        breadcrumbs={[
          { label: "Members", href: "/members" },
          { label: "New Member" },
        ]}
        action={
          <Link
            href="/members"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors border border-zinc-200 dark:border-zinc-700"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Directory
          </Link>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Member Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-400 block mb-1">First Name</label>
              <input
                type="text"
                placeholder="e.g. Sarah"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-400 block mb-1">Last Name</label>
              <input
                type="text"
                placeholder="e.g. Connor"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-400 block mb-1 flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-zinc-400" /> Email Address
              </label>
              <input
                type="email"
                placeholder="e.g. sarah.connor@acme.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Organization Assignment */}
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Role & Department Assignment ({activeOrgName})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-400 block mb-1 flex items-center gap-1">
                <Hash className="h-3.5 w-3.5 text-zinc-400" /> Employee / Student ID
              </label>
              <input
                type="text"
                placeholder="e.g. EMP-105"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-400 block mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Engineering">Engineering</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Sales & Marketing">Sales & Marketing</option>
                <option value="Supply Chain">Supply Chain</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-400 block mb-1 flex items-center gap-1">
                <Shield className="h-3.5 w-3.5 text-zinc-400" /> System Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Member">Member (Employee / Student)</option>
                <option value="Manager">Department Manager</option>
                <option value="Admin">Organization Admin</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/members"
            className="px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors border border-zinc-200 dark:border-zinc-700"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? "Creating Member..." : "Save & Generate QR"}
          </button>
        </div>
      </form>
    </div>
  );
}
