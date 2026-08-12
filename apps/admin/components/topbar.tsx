"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  Bell,
  Search,
  Sparkles,
  Sun,
  Moon,
  Download,
  Building2,
  ChevronDown,
  Check,
  Command,
  Clock,
  X,
  Layers,
  Globe,
  Loader2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useUIStore } from "@/lib/use-ui-store";
import { useSession, useOrganizations } from "@repo/api-client";
import { toast } from "sonner";

export function TopBar() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { activeOrgName, activeOrgSlug, setActiveOrg, portalMode } = useUIStore();

  // Fetch live paginated & searched organizations for Super Admin or multi-tenant user
  const { data: orgsData, isLoading: isOrgsLoading } = useOrganizations({
    search: searchQuery,
    page: 1,
    pageSize: 50,
  });

  const sessionOrgs =
    session?.organizations?.map((o) => ({
      name: o.orgName,
      slug: o.orgSlug || o.orgId,
      plan: "PRO",
      members: 50,
    })) || [];

  const rawList = (Array.isArray(orgsData) ? orgsData : orgsData?.items) || [];
  const apiOrgs = useMemo(() => {
    return rawList.map((o) => ({
      name: o.name,
      slug: o.slug,
      plan: o.plan || "PRO",
      members: (o as any).totalMembers ?? (o as any).membersCount ?? 0,
    }));
  }, [orgsData]);

  const activeOrgObj = useMemo(() => {
    return apiOrgs.find((o) => o.slug === activeOrgSlug);
  }, [apiOrgs, activeOrgSlug]);

  const activePlanName = useMemo(() => {
    const p = String(activeOrgObj?.plan || "PRO").toUpperCase();
    if (p.includes("CUSTOM")) return "Custom Enterprise";
    if (p.includes("ENTERPRISE_1000") || (p === "ENTERPRISE" && (activeOrgObj?.members || 0) > 500)) return "Enterprise 1000 Pack";
    if (p.includes("CORPORATE_500")) return "Corporate 500 Pack";
    if (p.includes("SCALE_200")) return "Scale 200 Pack";
    if (p.includes("PRO_100") || p === "PRO") return "Pro Growth 100 Pack";
    if (p.includes("BUSINESS_50") || p === "BUSINESS") return "Business 50 Pack";
    if (p.includes("STARTER_25")) return "Starter 25 Pack";
    if (p.includes("STARTER_10") || p === "STARTER") return "Starter 10 Pack";
    return "Pro Growth 100 Pack";
  }, [activeOrgObj]);

  // Combine live API results and session memberships
  const combinedOrgs = apiOrgs.length > 0 ? apiOrgs : sessionOrgs;

  // Filter combined list by search query if client-side fallback is active
  const filteredOrgs = combinedOrgs.filter((org) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return org.name.toLowerCase().includes(q) || org.slug.toLowerCase().includes(q);
  });

  // Recent Organization history (stored in localStorage)
  const [recentOrgs, setRecentOrgs] = useState<Array<{ name: string; slug: string }>>([]);

  useEffect(() => {
    setMounted(true);

    // Hydrate recent orgs
    try {
      const saved = localStorage.getItem("ua_recent_orgs");
      if (saved) setRecentOrgs(JSON.parse(saved));
    } catch {
      // ignore
    }

    // Capture PWA install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // Global Cmd+K / Ctrl+K keyboard shortcut listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setShowOrgModal((prev) => !prev);
      }
      if (e.key === "Escape") {
        setShowOrgModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Auto-select first active org if activeOrgSlug is empty
  useEffect(() => {
    if (!activeOrgSlug && apiOrgs.length > 0 && apiOrgs[0]) {
      setActiveOrg(apiOrgs[0].name, apiOrgs[0].slug);
    }
  }, [activeOrgSlug, apiOrgs, setActiveOrg]);

  // Click outside listener for org modal
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowOrgModal(false);
      }
    };
    if (showOrgModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOrgModal]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        toast.success("PWA Application installed successfully!");
      }
      setDeferredPrompt(null);
    } else {
      toast.info("PWA is ready! Use your browser menu or address bar icon to install Unite Attendance.");
    }
  };

  const handleSelectOrg = (name: string, slug: string) => {
    setActiveOrg(name, slug);
    setShowOrgModal(false);
    setSearchQuery("");

    // Save to recent orgs
    const updated = [{ name, slug }, ...recentOrgs.filter((r) => r.slug !== slug)].slice(0, 4);
    setRecentOrgs(updated);
    try {
      localStorage.setItem("ua_recent_orgs", JSON.stringify(updated));
    } catch {
      // ignore
    }

    toast.success(`Switched active workspace context to ${name}`);
  };

  return (
    <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/40 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40 transition-colors duration-200">
      {/* Active Organization Switcher & Search Input */}
      <div className="flex items-center gap-4">
        {/* Organization Switcher Badge Button or Super Admin Indicator */}
        {portalMode === "SUPER" ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80 text-zinc-700 dark:text-zinc-300 text-xs font-medium">
            <Globe className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
            <span>Super Admin Context</span>
          </div>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowOrgModal(!showOrgModal)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/15 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition-all shadow-sm group"
              title="Switch active organization workspace (Cmd+K)"
            >
              <Building2 className="h-4 w-4 text-indigo-500 shrink-0" />
              <span className="max-w-37.5 sm:max-w-50 truncate">{mounted ? activeOrgName : "My Organization"}</span>
              <span className="hidden md:inline-flex items-center gap-0.5 text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-500 border border-indigo-500/20">
                <Command className="h-2.5 w-2.5" />K
              </span>
              <ChevronDown className={`h-3.5 w-3.5 text-indigo-400 shrink-0 transition-transform ${showOrgModal ? "rotate-180" : ""}`} />
            </button>

          {/* 100+ Organization Searchable Combobox Modal */}
          {showOrgModal && (
            <div className="absolute left-0 mt-2 w-80 sm:w-96 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Search Header */}
              <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center gap-2">
                <Search className="h-4 w-4 text-zinc-400 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 100+ organizations by name or slug..."
                  className="w-full bg-transparent text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Modal Body / Organization List */}
              <div className="max-h-80 overflow-y-auto p-2 space-y-3 divide-y divide-zinc-100 dark:divide-zinc-800/50">
                {/* Recent Organizations Section (if available & no active query) */}
                {!searchQuery && recentOrgs.length > 0 && (
                  <div className="space-y-1 pb-2">
                    <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-indigo-400" /> Recently Visited
                    </div>
                    {recentOrgs.map((org) => (
                      <button
                        key={`recent-${org.slug}`}
                        onClick={() => handleSelectOrg(org.name, org.slug)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                          activeOrgSlug === org.slug
                            ? "bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-500/20"
                            : "hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 font-medium"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="h-6 w-6 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-[10px] shrink-0">
                            {org.name[0]}
                          </div>
                          <span className="truncate">{org.name}</span>
                        </div>
                        {activeOrgSlug === org.slug && <Check className="h-3.5 w-3.5 text-indigo-500 shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}

                {/* All Filtered Organizations Section */}
                <div className="pt-2 space-y-1">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Globe className="h-3 w-3 text-indigo-400" /> All Tenant Workspaces
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500">
                      {filteredOrgs.length} {filteredOrgs.length === 1 ? "org" : "orgs"}
                    </span>
                  </div>

                  {isOrgsLoading ? (
                    <div className="py-6 flex items-center justify-center text-xs text-zinc-400 gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-indigo-500" /> Searching multi-tenant index...
                    </div>
                  ) : filteredOrgs.length === 0 ? (
                    <div className="py-8 text-center text-xs text-zinc-400">
                      No organizations matching "<span className="font-semibold text-zinc-200">{searchQuery}</span>"
                    </div>
                  ) : (
                    filteredOrgs.map((org) => (
                      <button
                        key={org.slug}
                        onClick={() => handleSelectOrg(org.name, org.slug)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs transition-colors group ${
                          activeOrgSlug === org.slug
                            ? "bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-500/20"
                            : "hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-700 dark:text-zinc-200 font-medium"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-8 w-8 rounded-xl bg-linear-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-extrabold text-xs shrink-0 group-hover:scale-105 transition-transform">
                            {org.name[0]}
                          </div>
                          <div className="truncate min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="truncate font-semibold text-zinc-900 dark:text-white">{org.name}</span>
                              <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shrink-0">
                                {org.plan}
                              </span>
                            </div>
                            <p className="text-[10px] text-zinc-400 font-mono truncate">{org.slug}.unite-attendance.com</p>
                          </div>
                        </div>

                        {activeOrgSlug === org.slug ? (
                          <Check className="h-4 w-4 text-indigo-500 shrink-0" />
                        ) : (
                          <span className="text-[10px] text-zinc-400 group-hover:text-indigo-400 transition-colors font-mono shrink-0">
                            Select →
                          </span>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-2.5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 flex items-center justify-between text-[10px] text-zinc-400 font-medium">
                <span>Showing top matches (100+ organizations)</span>
                <span className="font-mono bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-500">ESC to close</span>
              </div>
            </div>
          )}
        </div>
      )}

        {/* Global Search Input */}
        <div className="relative w-64 hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search members, departments..."
            className="w-full bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* PWA Install Button */}
        <button
          onClick={handleInstallPWA}
          title="Install Unite Attendance PWA App"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all shadow-sm"
        >
          <Download className="h-3.5 w-3.5" />
          Install PWA
        </button>

        {/* Dark / Light Mode Toggle */}
        {mounted && (
          <button
            onClick={toggleTheme}
            title="Toggle Light / Dark Mode"
            className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-600" />
            )}
          </button>
        )}

        {portalMode === "ORG" && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-[11px] font-bold">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            {activePlanName} Active
          </div>
        )}

        <button className="relative p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500" />
        </button>
      </div>
    </header>
  );
}
