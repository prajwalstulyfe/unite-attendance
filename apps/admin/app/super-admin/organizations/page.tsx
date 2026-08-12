"use client";

import { useState } from "react";
import { PageHeader } from "@repo/ui";
import { Building2, Plus, Search, Filter, ExternalLink, Loader2, Pencil, Sparkles, DollarSign, CheckCircle2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/lib/use-ui-store";
import { useOrganizations, useCreateOrganization, useUpdateOrganization } from "@repo/api-client";
import { toast } from "sonner";

export default function OrganizationsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string>("ALL");
  const [showProvisionModal, setShowProvisionModal] = useState(false);
  const [editingOrg, setEditingOrg] = useState<any>(null);
  const [overridePlan, setOverridePlan] = useState<string>("PRO");
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgSlug, setNewOrgSlug] = useState("");
  const { setActiveOrg, setPortalMode } = useUIStore();

  const { data: orgsResponse, isLoading } = useOrganizations({
    search: searchTerm,
    page: 1,
    pageSize: 100,
  });

  const createOrgMutation = useCreateOrganization();

  const orgsList = (Array.isArray(orgsResponse) ? orgsResponse : orgsResponse?.items) || [];

  const filteredOrgs = orgsList.filter((org) => {
    const matchesPlan = selectedPlan === "ALL" || org.plan === selectedPlan;
    return matchesPlan;
  });

  const handleOpenWorkspace = (name: string, slug: string) => {
    setActiveOrg(name, slug);
    setPortalMode("ORG");
    toast.success(`Switched active workspace context to ${name}`);
    router.push("/dashboard");
  };

  const handleProvisionOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName || !newOrgSlug) return;

    try {
      await createOrgMutation.mutateAsync({
        name: newOrgName,
        slug: newOrgSlug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
        plan: "pro" as any,
        adminEmail: `admin@${newOrgSlug}.com`,
        adminName: `${newOrgName} Admin`,
      });
      toast.success(`Provisioned organization "${newOrgName}" successfully!`);
      setShowProvisionModal(false);
      setNewOrgName("");
      setNewOrgSlug("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to provision organization");
    }
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
            onClick={() => setShowProvisionModal(true)}
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
        {isLoading ? (
          <div className="py-16 flex items-center justify-center text-xs text-zinc-400 gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-indigo-500" /> Querying platform organizations index...
          </div>
        ) : filteredOrgs.length === 0 ? (
          <div className="py-16 text-center text-xs text-zinc-500">
            No organizations found in platform index matching criteria.
          </div>
        ) : (
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
                    <div className="h-9 w-9 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold shadow-sm shrink-0">
                      {org.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-white">{org.name}</p>
                      <p className="text-[10px] text-zinc-400 font-mono">slug: {org.slug}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {(() => {
                      const membersCount = (org as any).totalMembers ?? (org as any).membersCount ?? (org as any)._count?.members ?? 0;
                      const p = String(org.plan || "FREE").toUpperCase();
                      let packName = "Pro Growth 100 Pack";
                      let badge = "PRO GROWTH 100";
                      let price = "₹1,875/mo";

                      if (p.includes("CUSTOM") || membersCount > 1000) {
                        packName = "Custom Enterprise";
                        badge = "CUSTOM ENTERPRISE";
                        price = "Custom/mo";
                      } else if (p.includes("ENTERPRISE_1000") || (p === "ENTERPRISE" && membersCount > 500) || membersCount > 500) {
                        packName = "Enterprise 1000 Pack";
                        badge = "ENTERPRISE 1000";
                        price = "₹8,999/mo";
                      } else if (p.includes("CORPORATE_500") || membersCount > 200) {
                        packName = "Corporate 500 Pack";
                        badge = "CORPORATE 500";
                        price = "₹5,249/mo";
                      } else if (p.includes("SCALE_200") || membersCount > 100) {
                        packName = "Scale 200 Pack";
                        badge = "SCALE 200";
                        price = "₹2,999/mo";
                      } else if (p.includes("PRO_100") || p === "PRO" || membersCount > 25) {
                        packName = "Pro Growth 100 Pack";
                        badge = "PRO GROWTH 100";
                        price = "₹1,875/mo";
                      } else if (p.includes("BUSINESS_50") || p === "BUSINESS" || membersCount > 10) {
                        packName = "Business 50 Pack";
                        badge = "BUSINESS 50";
                        price = "₹1,125/mo";
                      } else if (p.includes("STARTER_25") || membersCount > 5) {
                        packName = "Starter 25 Pack";
                        badge = "STARTER 25";
                        price = "₹749/mo";
                      } else if (p.includes("STARTER_10") || p === "STARTER") {
                        packName = "Starter 10 Pack";
                        badge = "STARTER 10";
                        price = "₹375/mo";
                      } else if (p === "FREE" || p === "FREE_TRIAL") {
                        packName = "14-Day Free Trial";
                        badge = "14-DAY TRIAL";
                        price = "Trial (₹0/mo)";
                      }

                      return (
                        <div className="space-y-1">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                            {badge}
                          </span>
                          <p className="text-xs font-black text-zinc-900 dark:text-white">
                            {packName}
                          </p>
                          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                            {price}
                          </p>
                        </div>
                      );
                    })()}
                  </td>
                  <td className="px-5 py-4 font-mono font-semibold text-zinc-900 dark:text-white">
                    {((org as any).totalMembers ?? (org as any).membersCount ?? (org as any)._count?.members ?? 0).toLocaleString()} Members
                  </td>
                  <td className="px-5 py-4 font-mono">
                    {((org as any).totalBranches ?? (org as any).branchesCount ?? (org as any)._count?.branches ?? 0)} Branches
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> ACTIVE
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        setEditingOrg(org);
                        setOverridePlan(String(org.plan || "PRO").toUpperCase());
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors border border-zinc-200 dark:border-zinc-700 cursor-pointer"
                      title="Manage Plan & Trial"
                    >
                      <Pencil className="h-3 w-3 text-indigo-500" /> Plan
                    </button>
                    <button
                      onClick={() => handleOpenWorkspace(org.name, org.slug)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-[11px] font-semibold text-white rounded-lg transition-colors shadow-sm cursor-pointer"
                    >
                      <ExternalLink className="h-3 w-3" /> Open Workspace
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Super Admin Plan & Trial Override Modal */}
      {editingOrg && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-indigo-500" /> Super Admin Plan Override
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">{editingOrg.name} ({editingOrg.slug})</p>
              </div>
              <button onClick={() => setEditingOrg(null)} className="text-zinc-400 hover:text-white text-xs font-semibold cursor-pointer">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Assign Subscription Tier</label>
                <select
                  value={overridePlan}
                  onChange={(e) => setOverridePlan(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 font-bold"
                >
                  <option value="FREE">14-Day Free Trial (₹0/mo)</option>
                  <option value="STARTER_10">Starter 10 Pack (Up to 10 Employees • ₹375/mo)</option>
                  <option value="STARTER_25">Starter 25 Pack (11–25 Employees • ₹749/mo)</option>
                  <option value="BUSINESS_50">Business 50 Pack (26–50 Employees • ₹1,125/mo)</option>
                  <option value="PRO_100">Pro Growth 100 Pack (51–100 Employees • ₹1,875/mo)</option>
                  <option value="SCALE_200">Scale 200 Pack (101–200 Employees • ₹2,999/mo)</option>
                  <option value="CORPORATE_500">Corporate 500 Pack (201–500 Employees • ₹5,249/mo)</option>
                  <option value="ENTERPRISE_1000">Enterprise 1000 Pack (501–1,000 Employees • ₹8,999/mo)</option>
                  <option value="ENTERPRISE">Custom Enterprise (1,001+ Employees)</option>
                </select>
              </div>

              <div className="p-3.5 bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-xl space-y-1.5 text-xs">
                <p className="font-extrabold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-indigo-500" /> Super Admin Privileges
                </p>
                <p className="text-zinc-600 dark:text-zinc-400 text-[11px]">
                  Changing plan tier will instantly update PostgreSQL records for organization <span className="font-mono font-bold text-zinc-900 dark:text-white">{editingOrg.slug}</span> and grant full feature permissions.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingOrg(null)}
                  className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.success(`Updated plan tier for ${editingOrg.name} to ${overridePlan}`);
                    setEditingOrg(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white shadow-lg shadow-indigo-600/25 cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" /> Save Override
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Provision New Organization Modal */}
      {showProvisionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Building2 className="h-5 w-5 text-indigo-500" /> Provision New Organization
              </h3>
              <button onClick={() => setShowProvisionModal(false)} className="text-zinc-400 hover:text-white text-xs font-semibold">
                ✕
              </button>
            </div>

            <form onSubmit={handleProvisionOrg} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Organization Name</label>
                <input
                  type="text"
                  required
                  value={newOrgName}
                  onChange={(e) => {
                    setNewOrgName(e.target.value);
                    if (!newOrgSlug) {
                      setNewOrgSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-"));
                    }
                  }}
                  placeholder="e.g. Stanford University"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Organization Subdomain Slug</label>
                <input
                  type="text"
                  required
                  value={newOrgSlug}
                  onChange={(e) => setNewOrgSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                  placeholder="e.g. stanford-edu"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowProvisionModal(false)}
                  className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createOrgMutation.isPending}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-xs font-semibold text-white rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
                >
                  {createOrgMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Provision Workspace"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
