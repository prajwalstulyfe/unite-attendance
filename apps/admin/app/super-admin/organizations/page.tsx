"use client";

import { useState } from "react";
import { PageHeader } from "@repo/ui";
import { Building2, Plus, Search, Filter, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/lib/use-ui-store";
import { toast } from "sonner";

interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: "FREE" | "STARTER" | "PRO" | "ENTERPRISE";
  membersCount: number;
  branchesCount: number;
  status: "ACTIVE" | "SUSPENDED";
  createdAt: string;
}

const mockOrganizations: Organization[] = [
  { id: "org-1", name: "Acme Corporation", slug: "acme-corp", plan: "PRO", membersCount: 168, branchesCount: 4, status: "ACTIVE", createdAt: "2026-01-15" },
  { id: "org-2", name: "Stulyfe Education", slug: "stulyfe-edu", plan: "ENTERPRISE", membersCount: 4200, branchesCount: 12, status: "ACTIVE", createdAt: "2025-11-20" },
  { id: "org-3", name: "CyberTech Innovations", slug: "cybertech", plan: "STARTER", membersCount: 45, branchesCount: 2, status: "ACTIVE", createdAt: "2026-03-02" },
  { id: "org-4", name: "Global Logistics Ltd", slug: "global-logistics", plan: "PRO", membersCount: 890, branchesCount: 8, status: "ACTIVE", createdAt: "2026-02-10" },
  { id: "org-5", name: "Apex Health System", slug: "apex-health", plan: "ENTERPRISE", membersCount: 2100, branchesCount: 6, status: "ACTIVE", createdAt: "2025-12-05" },
  { id: "org-6", name: "Metro Retail Stores", slug: "metro-retail", plan: "FREE", membersCount: 12, branchesCount: 1, status: "ACTIVE", createdAt: "2026-04-18" },
];

export default function OrganizationsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string>("ALL");
  const { setActiveOrg, setPortalMode } = useUIStore();

  const filteredOrgs = mockOrganizations.filter((org) => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) || org.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = selectedPlan === "ALL" || org.plan === selectedPlan;
    return matchesSearch && matchesPlan;
  });

  const handleOpenWorkspace = (name: string, slug: string) => {
    setActiveOrg(name, slug);
    setPortalMode("ORG");
    toast.success(`Switched active workspace context to ${name}`);
    router.push("/dashboard");
  };

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Organizations Directory"
        description="View, manage, and provision all tenant organizations across the platform"
        breadcrumbs={[
          { label: "Super Admin", href: "/super-admin/dashboard" },
          { label: "Organizations" },
        ]}
        action={
          <button
            onClick={() => toast.info("Provision Organization Modal Opened")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Plus className="h-4 w-4" /> Provision New Organization
          </button>
        }
      />

      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search organization by name or slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="h-4 w-4 text-zinc-400 shrink-0" />
          {["ALL", "FREE", "STARTER", "PRO", "ENTERPRISE"].map((plan) => (
            <button
              key={plan}
              onClick={() => setSelectedPlan(plan)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                selectedPlan === plan
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              {plan}
            </button>
          ))}
        </div>
      </div>

      {/* Organizations Table */}
      <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs text-zinc-600 dark:text-zinc-400">
          <thead className="bg-zinc-100 dark:bg-zinc-800/60 uppercase tracking-wider text-[10px] text-zinc-500 font-semibold border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              <th className="px-5 py-3.5">Organization</th>
              <th className="px-5 py-3.5">Subscription Plan</th>
              <th className="px-5 py-3.5">Members</th>
              <th className="px-5 py-3.5">Branches</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {filteredOrgs.map((org) => (
              <tr key={org.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                <td className="px-5 py-4 font-semibold text-zinc-900 dark:text-white flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold shadow-sm shrink-0">
                    {org.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900 dark:text-white">{org.name}</p>
                    <p className="text-[10px] text-zinc-400 font-mono">slug: {org.slug}</p>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      org.plan === "ENTERPRISE"
                        ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                        : org.plan === "PRO"
                        ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
                        : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20"
                    }`}
                  >
                    {org.plan}
                  </span>
                </td>
                <td className="px-5 py-4 font-mono font-medium">{org.membersCount.toLocaleString()}</td>
                <td className="px-5 py-4 font-mono">{org.branchesCount} locations</td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> ACTIVE
                  </span>
                </td>
                <td className="px-5 py-4 text-right space-x-2">
                  <button
                    onClick={() => handleOpenWorkspace(org.name, org.slug)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-[11px] font-semibold text-white rounded-lg transition-colors shadow-sm"
                  >
                    <ExternalLink className="h-3 w-3" /> Open Workspace
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
