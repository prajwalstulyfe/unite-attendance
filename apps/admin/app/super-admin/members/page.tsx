"use client";

import { useState } from "react";
import { PageHeader } from "@repo/ui";
import { Users, Search, Filter, Shield, Building2, Mail, Loader2, Inbox } from "lucide-react";
import { useOrganizations } from "@repo/api-client";

export default function GlobalMembersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: orgsData, isLoading } = useOrganizations({ search: searchTerm, page: 1, pageSize: 100 });

  const organizations = (Array.isArray(orgsData) ? orgsData : orgsData?.items) || [];

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Global Platform Members Directory"
        description="Cross-tenant member index, global user role access, and organization assignments"
        breadcrumbs={[
          { label: "Super Admin", href: "/super-admin/dashboard" },
          { label: "Global Members" },
        ]}
      />

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search member name, email, or organization..."
            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-xs text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Filter className="h-4 w-4 text-zinc-400" />
          <span>Active Tenant Workspaces: <strong className="text-zinc-900 dark:text-white">{organizations.length}</strong></span>
        </div>
      </div>

      {/* Global Member Directory Table */}
      <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <Users className="h-5 w-5 text-indigo-500" /> Platform Multi-Tenant User Index
        </h3>

        {isLoading ? (
          <div className="py-16 flex items-center justify-center text-xs text-zinc-400 gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-indigo-500" /> Indexing global platform user accounts...
          </div>
        ) : organizations.length === 0 ? (
          <div className="py-16 text-center space-y-2 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/40">
            <Inbox className="h-8 w-8 text-zinc-400 mx-auto" />
            <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">No platform members found</p>
            <p className="text-[11px] text-zinc-400">Provision organizations or invite users to populate the global index.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-600 dark:text-zinc-400">
              <thead className="bg-zinc-100 dark:bg-zinc-800/60 uppercase tracking-wider text-[10px] text-zinc-500 font-semibold border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="px-4 py-3">Tenant Organization</th>
                  <th className="px-4 py-3">Domain Slug</th>
                  <th className="px-4 py-3">Plan Tier</th>
                  <th className="px-4 py-3">Total Members</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {organizations.map((org) => (
                  <tr key={org.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="px-4 py-3.5 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                        {org.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-900 dark:text-white">{org.name}</p>
                        <p className="text-[10px] text-zinc-500">ID: {org.id}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[11px] text-indigo-600 dark:text-indigo-400">{org.slug}</td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 uppercase">
                        {org.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-zinc-900 dark:text-white">
                      {(org.totalMembers ?? (org as any).membersCount ?? (org as any)._count?.members ?? 0)} Members
                    </td>
                    <td className="px-4 py-3.5 text-right font-semibold text-emerald-600">ACTIVE</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
