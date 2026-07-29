"use client";

import { Bell, Search, Sparkles, Sun, Moon, Download, Building2, ChevronDown, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useUIStore } from "@/lib/use-ui-store";
import { toast } from "sonner";

const mockOrganizationsList = [
  { name: "Acme Corporation", slug: "acme-corp" },
  { name: "Stulyfe Education", slug: "stulyfe-edu" },
  { name: "CyberTech Innovations", slug: "cybertech" },
  { name: "Global Logistics Ltd", slug: "global-logistics" },
];

export function TopBar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const { activeOrgName, activeOrgSlug, setActiveOrg, portalMode } = useUIStore();

  useEffect(() => {
    setMounted(true);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

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
    setShowOrgDropdown(false);
    toast.success(`Switched active workspace to ${name}`);
  };

  return (
    <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/40 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40 transition-colors duration-200">
      {/* Active Organization Switcher & Search Input */}
      <div className="flex items-center gap-4">
        {/* Organization Name Badge Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowOrgDropdown(!showOrgDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/15 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition-all shadow-sm"
          >
            <Building2 className="h-4 w-4 text-indigo-500" />
            <span className="max-w-[150px] sm:max-w-[200px] truncate">{mounted ? activeOrgName : "Acme Corporation"}</span>
            <ChevronDown className="h-3.5 w-3.5 text-indigo-400" />
          </button>

          {showOrgDropdown && (
            <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl p-1.5 space-y-1 z-50 text-xs">
              <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                Switch Organization Workspace
              </div>
              {mockOrganizationsList.map((org) => (
                <button
                  key={org.slug}
                  onClick={() => handleSelectOrg(org.name, org.slug)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium transition-colors text-left"
                >
                  <span className="truncate">{org.name}</span>
                  {activeOrgSlug === org.slug && <Check className="h-3.5 w-3.5 text-indigo-500 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Input */}
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

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-medium hidden sm:flex">
          <Sparkles className="h-3.5 w-3.5" />
          Pro Plan Active
        </div>

        <button className="relative p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500" />
        </button>
      </div>
    </header>
  );
}
