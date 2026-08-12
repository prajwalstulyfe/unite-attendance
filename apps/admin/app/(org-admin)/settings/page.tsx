"use client";

import { useState } from "react";
import { PageHeader } from "@repo/ui";
import { Building2, Globe, ShieldCheck, Save, Check, Clock, Radio, Calendar, UserCheck, Key, Plus, Trash2, Lock, Unlock, Pencil, X, Mail, Phone, ExternalLink, Briefcase, Users, FileText, MapPin, CreditCard, Sparkles, CheckCircle2, Zap, Download, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { useUIStore } from "@/lib/use-ui-store";
import { useMembers } from "@repo/api-client";
import { NoOrgSelected } from "@/components/no-org-selected";

interface OrgAdminRecord {
  id: string;
  name: string;
  email: string;
  assignedAt: string;
}

interface PermissionRule {
  key: string;
  name: string;
  description: string;
  isCustom?: boolean;
  roles: {
    ORG_ADMIN: boolean;
    BRANCH_MANAGER: boolean;
    DEPT_HEAD: boolean;
    MEMBER: boolean;
  };
}

const PACK_TIERS = [
  { name: "Starter 10 Pack", range: "Up to 10", limit: "10", price: "₹375", monthlyPrice: 375, perEmp: "₹37.50" },
  { name: "Starter 25 Pack", range: "11 – 25", limit: "25", price: "₹749", monthlyPrice: 749, perEmp: "₹30.00" },
  { name: "Business 50 Pack", range: "26 – 50", limit: "50", price: "₹1,125", monthlyPrice: 1125, perEmp: "₹22.50" },
  { name: "Pro Growth 100 Pack", range: "51 – 100", limit: "100", price: "₹1,875", monthlyPrice: 1875, perEmp: "₹18.75", popular: true },
  { name: "Scale 200 Pack", range: "101 – 200", limit: "200", price: "₹2,999", monthlyPrice: 2999, perEmp: "₹15.00" },
  { name: "Corporate 500 Pack", range: "201 – 500", limit: "500", price: "₹5,249", monthlyPrice: 5249, perEmp: "₹10.50" },
  { name: "Enterprise 1000 Pack", range: "501 – 1,000", limit: "1,000", price: "₹8,999", monthlyPrice: 8999, perEmp: "₹9.00" },
  { name: "Custom Enterprise", range: "1,001+", limit: "Unlimited", price: "Custom", monthlyPrice: 0, perEmp: "Volume" },
];

const DEFAULT_PERMISSIONS: PermissionRule[] = [
  {
    key: "view_dashboard",
    name: "View Dashboard & Live Analytics",
    description: "Access real-time attendance overview, presence metrics, and department charts",
    roles: { ORG_ADMIN: true, BRANCH_MANAGER: true, DEPT_HEAD: true, MEMBER: false },
  },
  {
    key: "view_attendance",
    name: "View Attendance Stream & Logs",
    description: "Access member check-in history, verification method telemetry, and time logs",
    roles: { ORG_ADMIN: true, BRANCH_MANAGER: true, DEPT_HEAD: true, MEMBER: false },
  },
  {
    key: "manage_members",
    name: "Manage Members & Profiles",
    description: "Create new members, update employee IDs, edit profiles, and issue QR passes",
    roles: { ORG_ADMIN: true, BRANCH_MANAGER: false, DEPT_HEAD: false, MEMBER: false },
  },
  {
    key: "manage_branches",
    name: "Manage Office Branches & Geofences",
    description: "Add office locations, configure GPS geofence radiuses, and assign Branch Managers",
    roles: { ORG_ADMIN: true, BRANCH_MANAGER: true, DEPT_HEAD: false, MEMBER: false },
  },
  {
    key: "manage_departments",
    name: "Manage Departments & Heads",
    description: "Create departments, assign Department Heads, and monitor member allocations",
    roles: { ORG_ADMIN: true, BRANCH_MANAGER: false, DEPT_HEAD: true, MEMBER: false },
  },
  {
    key: "manage_qr_kiosk",
    name: "Manage Kiosks & QR Devices",
    description: "Authorize kiosk scanner hardware, generate kiosk URLs, and reset active passes",
    roles: { ORG_ADMIN: true, BRANCH_MANAGER: true, DEPT_HEAD: false, MEMBER: false },
  },
  {
    key: "view_reports",
    name: "View Analytics & Export Reports",
    description: "Generate attendance reports, analyze monthly trends, and export CSV data",
    roles: { ORG_ADMIN: true, BRANCH_MANAGER: true, DEPT_HEAD: true, MEMBER: false },
  },
  {
    key: "manage_settings",
    name: "Access Settings & Role Permissions",
    description: "Assign Organization Administrators and configure Role-Based Access Control matrix",
    roles: { ORG_ADMIN: true, BRANCH_MANAGER: false, DEPT_HEAD: false, MEMBER: false },
  },
];

export default function SettingsPage() {
  const { activeOrgSlug, activeOrgName } = useUIStore();
  const { data: membersData } = useMembers(activeOrgSlug);

  const [activeTab, setActiveTab] = useState<"PROFILE" | "RULES" | "ADMINS" | "PERMISSIONS" | "SUBSCRIPTION" | "BILLING">("PROFILE");

  // Plan & Billing State
  const [currentPlan, setCurrentPlan] = useState<"FREE_TRIAL" | "STARTER" | "PRO" | "ENTERPRISE">("FREE_TRIAL");
  const [subscriptionStatus, setSubscriptionStatus] = useState<"TRIALING" | "ACTIVE" | "PAST_DUE">("TRIALING");
  const [trialDaysLeft, setTrialDaysLeft] = useState<number>(12);
  const [currentPlanIdx, setCurrentPlanIdx] = useState<number>(2); // Current active plan (Business 50 @ ₹1,125/mo)
  const [selectedPlanIdx, setSelectedPlanIdx] = useState<number>(3); // Selected tier for upgrade (Pro Growth 100 @ ₹1,875/mo)
  const [daysUsed, setDaysUsed] = useState<number>(20); // 20 days used in 30-day cycle
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [isUpdatingPlan, setIsUpdatingPlan] = useState<boolean>(false);

  const currentPack = PACK_TIERS[currentPlanIdx] ?? PACK_TIERS[2]!;
  const selectedPack = PACK_TIERS[selectedPlanIdx] ?? PACK_TIERS[3]!;

  // Prorated upgrade math calculation
  const totalDays = 30;
  const unusedDays = Math.max(0, totalDays - daysUsed);
  const dailyRate = currentPack.monthlyPrice / totalDays;
  const unusedCredit = Math.round(dailyRate * unusedDays); // e.g. ₹375 credit for 10 unused days

  const isUpgrade = selectedPack.monthlyPrice > currentPack.monthlyPrice;
  const isCurrentPlan = selectedPlanIdx === currentPlanIdx;
  const payableToday = Math.max(0, selectedPack.monthlyPrice - unusedCredit);

  // Professional Organization Profile State
  const [orgName, setOrgName] = useState(activeOrgName || "Unite India");
  const [legalName, setLegalName] = useState("Unite Attendance Technologies Pvt. Ltd.");
  const [industry, setIndustry] = useState("Software Engineering & IT Services");
  const [companySize, setCompanySize] = useState("51-200 Employees");
  const [contactEmail, setContactEmail] = useState("contact@unite-india.com");
  const [contactPhone, setContactPhone] = useState("+91 98765 43210");
  const [websiteUrl, setWebsiteUrl] = useState("https://unite-attendance.com");
  const [taxId, setTaxId] = useState("27AAACU1234M1Z5");
  const [hqAddress, setHqAddress] = useState("Dwarka Circle, Nashik, Maharashtra 422011");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [currency, setCurrency] = useState("INR");

  // Attendance Rules State
  const [workStart, setWorkStart] = useState("09:00");
  const [workEnd, setWorkEnd] = useState("18:00");
  const [lateThreshold, setLateThreshold] = useState(15);
  const [allowSelfCheckIn, setAllowSelfCheckIn] = useState(true);
  const [requireGps, setRequireGps] = useState(true);
  const [gpsRadius, setGpsRadius] = useState(300);
  const [selectedDays, setSelectedDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri"]);

  // Org Admins state
  const [admins, setAdmins] = useState<OrgAdminRecord[]>([
    {
      id: "org-admin-1",
      name: "Rohit Sharma",
      email: "rohit.sharma@unite-india.com",
      assignedAt: "Primary Admin",
    },
  ]);
  const [selectedMemberId, setSelectedMemberId] = useState("");

  // Permissions & Edit Mode state
  const [permissions, setPermissions] = useState<PermissionRule[]>(DEFAULT_PERMISSIONS);
  const [isEditingMatrix, setIsEditingMatrix] = useState(false);
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);
  const [newRuleName, setNewRuleName] = useState("");
  const [newRuleDesc, setNewRuleDesc] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  if (!activeOrgSlug) {
    return <NoOrgSelected description="Please select an organization from the Organization Selector at the top to view settings and rules." />;
  }

  const existingMembers = membersData?.items || [];

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    toast.success(`Saved Organization Profile & Settings for ${orgName}!`);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId) return;

    const targetMember = existingMembers.find((m: any) => m.id === selectedMemberId) as any;
    if (!targetMember) return;

    const memberName = targetMember.user?.name || targetMember.name || "Member";
    const memberEmail = targetMember.user?.email || targetMember.email || "";

    if (admins.some((a) => a.email === memberEmail)) {
      toast.error(`${memberName} is already an Organization Administrator.`);
      return;
    }

    const newAdmin: OrgAdminRecord = {
      id: targetMember.id,
      name: memberName,
      email: memberEmail,
      assignedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    setAdmins([...admins, newAdmin]);
    setSelectedMemberId("");
    toast.success(`Assigned ${memberName} as Organization Administrator for ${activeOrgName}!`);
  };

  const handleRemoveAdmin = (adminId: string, name: string) => {
    if (admins.length <= 1) {
      toast.error("Organization must have at least one active Organization Administrator.");
      return;
    }
    setAdmins(admins.filter((a) => a.id !== adminId));
    toast.success(`Revoked Organization Admin privileges from ${name}`);
  };

  const togglePermission = (permKey: string, roleKey: "ORG_ADMIN" | "BRANCH_MANAGER" | "DEPT_HEAD" | "MEMBER") => {
    setPermissions(
      permissions.map((p) => {
        if (p.key === permKey) {
          return {
            ...p,
            roles: {
              ...p.roles,
              [roleKey]: !p.roles[roleKey],
            },
          };
        }
        return p;
      })
    );
  };

  const handleCreateCustomRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName) return;

    const newRuleKey = `custom_${Date.now()}`;
    const newRule: PermissionRule = {
      key: newRuleKey,
      name: newRuleName.trim(),
      description: newRuleDesc.trim() || "Custom organization permission rule",
      isCustom: true,
      roles: { ORG_ADMIN: true, BRANCH_MANAGER: false, DEPT_HEAD: false, MEMBER: false },
    };

    setPermissions([...permissions, newRule]);
    setNewRuleName("");
    setNewRuleDesc("");
    setShowAddRuleModal(false);
    toast.success(`Added custom permission rule "${newRule.name}"`);
  };

  const handleDeleteRule = (permKey: string, name: string) => {
    setPermissions(permissions.filter((p) => p.key !== permKey));
    toast.success(`Removed permission rule "${name}"`);
  };

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Organization Settings & Profile"
        description={`Manage corporate profile, contact details, attendance shift rules, Org Admins, and role permissions for ${activeOrgName}`}
        action={
          <button
            onClick={handleSaveAll}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
          >
            {isSaved ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-300" />
                Settings Saved!
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                Save Profile & Rules
              </>
            )}
          </button>
        }
      />

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-1">
        <button
          onClick={() => setActiveTab("PROFILE")}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "PROFILE"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
          }`}
        >
          <Building2 className="h-3.5 w-3.5" />
          Organization Profile
        </button>

        <button
          onClick={() => setActiveTab("RULES")}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "RULES"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          Attendance Rules
        </button>

        <button
          onClick={() => setActiveTab("ADMINS")}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "ADMINS"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
          }`}
        >
          <UserCheck className="h-3.5 w-3.5" />
          Assign Org Admins ({admins.length})
        </button>

        <button
          onClick={() => setActiveTab("PERMISSIONS")}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "PERMISSIONS"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
          }`}
        >
          <Key className="h-3.5 w-3.5" />
          Role Access Matrix
        </button>

        <button
          onClick={() => setActiveTab("SUBSCRIPTION")}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "SUBSCRIPTION"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
          }`}
        >
          <Zap className="h-3.5 w-3.5" />
          Subscriptions
          {subscriptionStatus === "TRIALING" && (
            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 uppercase tracking-wide">
              Free Trial
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("BILLING")}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "BILLING"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
          }`}
        >
          <CreditCard className="h-3.5 w-3.5" />
          Billing & Invoices
        </button>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* Tab 1: Organization Profile (Professional Fields) */}
        {activeTab === "PROFILE" && (
          <div className="space-y-6">
            {/* Corporate Identity Header Banner */}
            <div className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white text-2xl shadow-lg shadow-indigo-500/20 shrink-0">
                  {orgName[0] || "U"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">{orgName}</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                      Verified Enterprise
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">{legalName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs bg-zinc-50 dark:bg-zinc-950 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <span className="text-zinc-400 font-sans">Workspace Slug:</span>
                <strong className="text-indigo-600 dark:text-indigo-400">{activeOrgSlug}</strong>
              </div>
            </div>

            {/* Corporate Identity Information */}
            <div className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xs">
              <h3 className="text-base font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                <Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Corporate Identity & Registration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-400 block mb-1">Organization Display Name</label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. Unite India"
                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-400 block mb-1">Legal Registered Entity Name</label>
                  <input
                    type="text"
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    placeholder="e.g. Unite Attendance Technologies Pvt. Ltd."
                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-400 mb-1 flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5 text-zinc-400" /> Industry Sector
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 font-medium"
                  >
                    <option value="Software Engineering & IT Services">Software Engineering & IT Services</option>
                    <option value="Higher Education & Universities">Higher Education & Universities</option>
                    <option value="Healthcare & Hospitals">Healthcare & Hospitals</option>
                    <option value="Manufacturing & Industrial">Manufacturing & Industrial</option>
                    <option value="Financial Services & Banking">Financial Services & Banking</option>
                    <option value="Retail & E-commerce">Retail & E-commerce</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-400 mb-1 flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-zinc-400" /> Company Size / Workforce Scale
                  </label>
                  <select
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 font-medium"
                  >
                    <option value="1-50 Employees">1-50 Employees</option>
                    <option value="51-200 Employees">51-200 Employees</option>
                    <option value="201-500 Employees">201-500 Employees</option>
                    <option value="500+ Enterprise Scale">500+ Enterprise Scale</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Official Contact & HQ Location */}
            <div className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xs">
              <h3 className="text-base font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                <Mail className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Official Corporate Contact & Headquarters
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-400 mb-1 flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-zinc-400" /> Corporate Email
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="e.g. contact@unite-india.com"
                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-400 mb-1 flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-zinc-400" /> Corporate Phone / Helpline
                  </label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-400 mb-1 flex items-center gap-1">
                    <ExternalLink className="h-3.5 w-3.5 text-zinc-400" /> Corporate Website URL
                  </label>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="e.g. https://unite-attendance.com"
                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-400 mb-1 flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5 text-zinc-400" /> GSTIN / Corporate Tax ID
                  </label>
                  <input
                    type="text"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    placeholder="e.g. 27AAACU1234M1Z5"
                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-400 mb-1 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-zinc-400" /> Headquarters Address
                  </label>
                  <input
                    type="text"
                    value={hqAddress}
                    onChange={(e) => setHqAddress(e.target.value)}
                    placeholder="e.g. Dwarka Circle, Nashik, Maharashtra 422011"
                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Regional & Currency */}
            <div className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xs">
              <h3 className="text-base font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                <Globe className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Regional & Localization Defaults
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-400 block mb-1">Timezone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 font-medium"
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST +05:30)</option>
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-400 block mb-1">Operating Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 font-medium"
                  >
                    <option value="INR">INR (₹ Indian Rupee)</option>
                    <option value="USD">USD ($ United States Dollar)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Attendance Rules */}
        {activeTab === "RULES" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xs">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Working Hours & Shift Policy
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-zinc-700 dark:text-zinc-400 block mb-1">Shift Start Time</label>
                  <input
                    type="time"
                    value={workStart}
                    onChange={(e) => setWorkStart(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-700 dark:text-zinc-400 block mb-1">Shift End Time</label>
                  <input
                    type="time"
                    value={workEnd}
                    onChange={(e) => setWorkEnd(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-700 dark:text-zinc-400 block mb-1">Late Grace Period (Minutes)</label>
                  <input
                    type="number"
                    value={lateThreshold}
                    onChange={(e) => setLateThreshold(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 font-medium"
                  />
                  <p className="text-[11px] text-zinc-500 mt-1">Check-ins after {workStart} + {lateThreshold} mins will be flagged Late.</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xs">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Working Days Schedule
              </h3>

              <div className="flex flex-wrap gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                  const isSelected = selectedDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        isSelected
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20"
                          : "bg-zinc-100 dark:bg-zinc-950 text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-white"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xs">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Radio className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Geofencing & Security Enforcement
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80 rounded-xl">
                  <div>
                    <span className="text-sm font-bold text-zinc-900 dark:text-white block">Enforce Mandatory GPS Geofencing</span>
                    <span className="text-xs text-zinc-500">Require members to be within branch radius for attendance check-in</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={requireGps}
                    onChange={(e) => setRequireGps(e.target.checked)}
                    className="h-5 w-5 rounded border-zinc-300 dark:border-zinc-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </div>

                {requireGps && (
                  <div>
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-400 block mb-1">Geofence Allowed Radius (Meters)</label>
                    <input
                      type="number"
                      value={gpsRadius}
                      onChange={(e) => setGpsRadius(Number(e.target.value))}
                      className="w-full max-w-xs px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 font-medium"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80 rounded-xl">
                  <div>
                    <span className="text-sm font-bold text-zinc-900 dark:text-white block">Allow Member Mobile Self Check-in</span>
                    <span className="text-xs text-zinc-500">Members can scan QR or check in using personal mobile devices</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowSelfCheckIn}
                    onChange={(e) => setAllowSelfCheckIn(e.target.checked)}
                    className="h-5 w-5 rounded border-zinc-300 dark:border-zinc-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Assign Org Admins */}
        {activeTab === "ADMINS" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-sm">
              <h3 className="text-base font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                <Plus className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Assign New Organization Admin from Members
              </h3>
              <p className="text-xs text-zinc-500">
                Select any existing member from {activeOrgName} to grant them full Organization Administrator rights.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="flex-1 w-full">
                  <select
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 font-medium"
                  >
                    <option value="">-- Choose Member to Assign as Org Admin --</option>
                    {existingMembers.map((m: any) => (
                      <option key={m.id} value={m.id}>
                        {m.user?.name || m.name} ({m.user?.email || m.email || "Member"}) - {m.department?.name || "Member"}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  disabled={!selectedMemberId}
                  onClick={handleAddAdmin}
                  className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <UserCheck className="h-4 w-4" />
                  Assign as Org Admin
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-indigo-500" />
                  Current Organization Administrators
                </h3>
                <span className="text-xs text-zinc-500 font-medium">
                  {admins.length} Active Admins
                </span>
              </div>

              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {admins.map((adm) => (
                  <div key={adm.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-950/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-linear-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center font-extrabold text-indigo-600 dark:text-indigo-400 text-sm">
                        {adm.name[0]}
                      </div>
                      <div>
                        <p className="font-extrabold text-zinc-900 dark:text-white text-sm flex items-center gap-2">
                          {adm.name}
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                            Org Admin
                          </span>
                        </p>
                        <p className="text-xs text-zinc-500">{adm.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-[11px] text-zinc-400 font-medium hidden sm:inline">
                        {adm.assignedAt}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAdmin(adm.id, adm.name)}
                        className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-rose-50 dark:hover:bg-rose-500/20 text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors border border-zinc-200 dark:border-zinc-700 cursor-pointer"
                        title="Revoke Org Admin Rights"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Role Access Management Matrix */}
        {activeTab === "PERMISSIONS" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Key className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  Role-Based Access Control (RBAC) Matrix
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Configure and edit module permissions for each of the 4 organization roles: <strong className="text-indigo-600 dark:text-indigo-400">Org Admin</strong>, <strong className="text-indigo-600 dark:text-indigo-400">Branch Manager</strong>, <strong className="text-indigo-600 dark:text-indigo-400">Department Head</strong>, and <strong className="text-indigo-600 dark:text-indigo-400">Member</strong>.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditingMatrix(!isEditingMatrix)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    isEditingMatrix
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                      : "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20"
                  }`}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  {isEditingMatrix ? "Lock Editing Mode" : "Edit Role Matrix"}
                </button>

                {isEditingMatrix && (
                  <button
                    type="button"
                    onClick={() => setShowAddRuleModal(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Rule
                  </button>
                )}
              </div>
            </div>

            {/* Matrix Table */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 overflow-hidden shadow-sm">
              {isEditingMatrix && (
                <div className="p-3 bg-amber-500/10 border-b border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Pencil className="h-4 w-4 text-amber-500" />
                    Interactive Edit Mode Active: Click any lock/unlock icon below to toggle permissions for roles.
                  </span>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-175">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950/60 text-[11px] font-extrabold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                      <th className="py-4 px-6 w-2/5">Module Permission Rule</th>
                      <th className="py-4 px-4 text-center">Org Admin</th>
                      <th className="py-4 px-4 text-center">Branch Manager</th>
                      <th className="py-4 px-4 text-center">Dept Head</th>
                      <th className="py-4 px-4 text-center">Member</th>
                      {isEditingMatrix && <th className="py-4 px-4 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/80 text-xs">
                    {permissions.map((perm) => (
                      <tr key={perm.key} className="hover:bg-zinc-50 dark:hover:bg-zinc-950/40 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <p className="font-extrabold text-zinc-900 dark:text-white text-sm">{perm.name}</p>
                            {perm.isCustom && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                                Custom
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-500 mt-0.5">{perm.description}</p>
                        </td>

                        {(["ORG_ADMIN", "BRANCH_MANAGER", "DEPT_HEAD", "MEMBER"] as const).map((roleKey) => {
                          const isGranted = perm.roles[roleKey];
                          const isOrgAdmin = roleKey === "ORG_ADMIN";

                          return (
                            <td key={roleKey} className="py-4 px-4 text-center">
                              <button
                                type="button"
                                disabled={isOrgAdmin || !isEditingMatrix}
                                onClick={() => togglePermission(perm.key, roleKey)}
                                className={`inline-flex items-center justify-center p-2.5 rounded-xl border transition-all ${
                                  isGranted
                                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-xs"
                                    : "bg-zinc-100 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-400"
                                } ${
                                  !isEditingMatrix || isOrgAdmin
                                    ? "opacity-90 cursor-not-allowed"
                                    : "cursor-pointer hover:scale-110 active:scale-95 hover:border-indigo-500/50"
                                }`}
                                title={
                                  !isEditingMatrix
                                    ? "Enable Edit Mode to change permissions"
                                    : isGranted
                                    ? `Click to Revoke ${perm.name} for ${roleKey}`
                                    : `Click to Grant ${perm.name} for ${roleKey}`
                                }
                              >
                                {isGranted ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                              </button>
                            </td>
                          );
                        })}

                        {isEditingMatrix && (
                          <td className="py-4 px-4 text-right">
                            {perm.isCustom && (
                              <button
                                type="button"
                                onClick={() => handleDeleteRule(perm.key, perm.name)}
                                className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors border border-rose-200 dark:border-rose-500/30 cursor-pointer"
                                title="Delete Custom Rule"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Subscriptions & Prorated Upgrade Hub */}
        {activeTab === "SUBSCRIPTION" && (
          <div className="space-y-6 w-full">
            {/* 1. CURRENT ACTIVE PLAN SUMMARY & PRORATED CREDIT CALLOUT CARD */}
            <div className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wide">
                      Active Subscription
                    </span>
                    <span className="text-xs text-zinc-500 font-medium">{unusedDays} Days Remaining in Billing Cycle</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                    {currentPack.name} ({currentPack.range} Employees)
                  </h3>
                  <p className="text-xs text-zinc-500 font-medium">
                    Current Monthly Rate: <strong className="text-zinc-900 dark:text-white font-extrabold">{currentPack.price} / month</strong> • Billed monthly
                  </p>
                </div>

                <div className="shrink-0 bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/80 rounded-xl p-3.5 text-right space-y-0.5">
                  <div className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    Unused Balance Credit
                  </div>
                  <div className="text-xl font-black text-indigo-600 dark:text-indigo-300">
                    -₹{unusedCredit} Credit
                  </div>
                  <div className="text-[10px] text-zinc-500 font-medium">
                    {unusedDays} days @ ₹{Math.round(dailyRate)}/day remaining
                  </div>
                </div>
              </div>

              {/* Cycle progress bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">Billing Cycle Progress ({daysUsed} of 30 Days Used)</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">✨ ₹{unusedCredit} Prorated Credit Discount Applied to Upgrades</span>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(daysUsed / totalDays) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 2. SELECT EMPLOYEE STRENGTH BAR (Matching Pricing Component UI) */}
            <div className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-6 shadow-xs">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">Upgrade or Change Plan Tier</h3>
                <p className="text-xs text-zinc-500">
                  Select your required employee count. Upgrades deduct your <strong className="text-indigo-600 dark:text-indigo-400">₹{unusedCredit} unused credit</strong> from today's charge automatically.
                </p>
              </div>

              {/* Employee strength pills grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
                {PACK_TIERS.map((tier, idx) => {
                  const isSelected = selectedPlanIdx === idx;
                  const isCurrent = currentPlanIdx === idx;
                  return (
                    <button
                      key={tier.name}
                      type="button"
                      onClick={() => setSelectedPlanIdx(idx)}
                      className={`w-full px-2 py-2.5 rounded-xl border text-xs font-extrabold transition-all flex flex-col items-center gap-0.5 cursor-pointer relative ${
                        isSelected
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20"
                          : isCurrent
                          ? "bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 border-indigo-400 dark:border-indigo-700"
                          : "bg-zinc-50 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700"
                      }`}
                    >
                      <span className={`text-[9px] font-black uppercase tracking-tight ${isSelected ? "text-indigo-200" : isCurrent ? "text-indigo-600 dark:text-indigo-400" : "text-indigo-500"}`}>
                        {tier.name.replace(" Pack", "")}
                      </span>
                      <span className="text-[11px] font-bold">{tier.range}</span>
                      <span className={`text-[10px] font-medium ${isSelected ? "text-indigo-100" : "text-zinc-500"}`}>
                        {tier.price}/mo
                      </span>

                      {isCurrent && (
                        <span className="absolute -top-2 px-1.5 py-0.2 rounded-full text-[8px] font-black bg-emerald-600 text-white uppercase">
                          ACTIVE
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* 3. SELECTED TIER DETAILED PRORATED UPGRADE BREAKDOWN CARD */}
              <div className="bg-zinc-50/60 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">
                        {selectedPack.name} ({selectedPack.range} Employees)
                      </h4>
                      {isCurrentPlan && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-600 text-white uppercase tracking-wider">
                          ACTIVE PLAN
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 font-medium">
                      Effective Rate: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{selectedPack.perEmp} / emp</strong>
                    </p>
                  </div>

                  {/* Prorated Price Display */}
                  <div className="text-left sm:text-right space-y-1">
                    {isUpgrade && selectedPack.monthlyPrice > 0 && (
                      <div className="text-xs text-zinc-400 line-through font-bold">
                        Regular Price: {selectedPack.price} / month
                      </div>
                    )}
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-zinc-900 dark:text-white">
                        {selectedPack.monthlyPrice === 0 ? "Custom Quote" : `₹${payableToday.toLocaleString("en-IN")}`}
                      </span>
                      {selectedPack.monthlyPrice > 0 && (
                        <span className="text-xs font-bold text-zinc-500">
                          {isUpgrade ? "payable today" : " / month"}
                        </span>
                      )}
                    </div>

                    {isUpgrade && selectedPack.monthlyPrice > 0 && (
                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
                        <Sparkles className="h-3.5 w-3.5" /> Launch Offer + ₹{unusedCredit} Prorated Credit Applied
                      </div>
                    )}
                  </div>
                </div>

                {/* Prorated Credit Summary Box */}
                {isUpgrade && selectedPack.monthlyPrice > 0 && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5 text-emerald-900 dark:text-emerald-200">
                      <div className="font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        Prorated Unused Credit Applied Automatically
                      </div>
                      <p className="text-emerald-700 dark:text-emerald-400">
                        {unusedDays} unused days from {currentPack.name} (₹{unusedCredit} credit) subtracted from {selectedPack.price} tier price.
                      </p>
                    </div>

                    <div className="shrink-0 bg-white dark:bg-zinc-900 px-3.5 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-800 font-extrabold text-emerald-600 dark:text-emerald-300">
                      You Save ₹{unusedCredit} Today!
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <div className="text-xs text-zinc-500 font-medium">
                    No hidden setup fees • 14-Day Money Back Guarantee • Cancel anytime
                  </div>

                  {selectedPack.monthlyPrice === 0 ? (
                    <button
                      type="button"
                      onClick={() => {
                        toast.success("Enterprise sales inquiry submitted! Our team will contact you within 2 hours.");
                      }}
                      className="px-6 py-3 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Mail className="h-4 w-4" /> Contact Sales
                    </button>
                  ) : isCurrentPlan ? (
                    <button
                      type="button"
                      disabled
                      className="px-6 py-3 bg-zinc-200 dark:bg-zinc-800 text-zinc-500 font-bold text-xs rounded-xl cursor-not-allowed"
                    >
                      Currently Active Plan
                    </button>
                  ) : isUpgrade ? (
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentPlanIdx(selectedPlanIdx);
                        setDaysUsed(0);
                        toast.success(`Successfully upgraded to ${selectedPack.name}! Billed ₹${payableToday} today.`);
                      }}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Zap className="h-4 w-4" />
                      Upgrade to {selectedPack.name} (Pay ₹{payableToday.toLocaleString("en-IN")} Today)
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        toast.info(`Plan change scheduled to ${selectedPack.name} at the end of current cycle.`);
                      }}
                      className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer"
                    >
                      Downgrade to {selectedPack.name} (Effective in {unusedDays} days)
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Billing & Invoices */}
        {activeTab === "BILLING" && (
          <div className="space-y-6 w-full">

            {/* Invoices History */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white">Billing Receipts & Tax Invoices</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Download GST compliant tax invoices for your organization.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[11px] font-extrabold text-zinc-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Invoice #</th>
                      <th className="py-3 px-4">Billing Date</th>
                      <th className="py-3 px-4">Active Pack</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    <tr>
                      <td className="py-3.5 px-4 font-extrabold text-zinc-900 dark:text-white">INV-2026-0801</td>
                      <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-400 font-medium">01 Aug 2026</td>
                      <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-400 font-medium">14-Day Free Trial</td>
                      <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-black">₹0.00</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Active Trial
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => toast.info("Invoice receipt PDF download triggered.")}
                          className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5" /> PDF
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      {/* Jio / Hotstar Style Pack Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-2xl p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wide">
                    Flat 25% OFF Applied
                  </span>
                  <span className="text-xs text-zinc-500 font-medium">Instant Activation</span>
                </div>
                <h3 className="text-lg font-black text-zinc-900 dark:text-white mt-1 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  Select Your Employee Subscription Pack
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* All Tiers List (Jio / Hotstar Pack Style) */}
            <div className="space-y-3">
              {[
                { range: "Up to 10", price: "₹375", perEmp: "₹37.50", badge: "Starter" },
                { range: "11 – 25", price: "₹749", perEmp: "₹30.00", badge: "Growth" },
                { range: "26 – 50", price: "₹1,125", perEmp: "₹22.50", badge: "Business" },
                { range: "51 – 100", price: "₹1,875", perEmp: "₹18.75", badge: "POPULAR", popular: true },
                { range: "101 – 200", price: "₹2,999", perEmp: "₹15.00", badge: "Scale" },
                { range: "201 – 500", price: "₹5,249", perEmp: "₹10.50", badge: "Corporate" },
                { range: "501 – 1,000", price: "₹8,999", perEmp: "₹9.00", badge: "Enterprise" },
                { range: "1,001+", price: "Custom", perEmp: "Volume", badge: "Unlimited" },
              ].map((tier, idx) => {
                const isSelected = selectedPlanIdx === idx;
                return (
                  <div
                    key={tier.range}
                    onClick={() => setSelectedPlanIdx(idx)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? "bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-600 shadow-sm"
                        : "bg-zinc-50/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? "border-indigo-600 bg-indigo-600" : "border-zinc-400"}`}>
                        {isSelected && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider">{tier.range} Employees</span>
                          {tier.popular && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-indigo-600 text-white uppercase tracking-wider">
                              POPULAR
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                          {tier.perEmp} per emp / month
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-black text-zinc-900 dark:text-white">{tier.price}</span>
                      <span className="text-xs text-zinc-500 font-medium"> / mo</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.success(`Subscription pack updated to ${selectedPack.name} (${selectedPack.range} Employees)!`);
                  setCurrentPlan("PRO");
                  setSubscriptionStatus("ACTIVE");
                  setShowUpgradeModal(false);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" /> Activate Selected Pack
              </button>
            </div>
          </div>
        </div>
      )}
      </form>

      {/* Add Custom Permission Modal */}
      {showAddRuleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h3 className="text-base font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                <Plus className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Add Custom Module Permission
              </h3>
              <button
                type="button"
                onClick={() => setShowAddRuleModal(false)}
                className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomRule} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-400 block mb-1">Permission Name</label>
                <input
                  type="text"
                  placeholder="e.g. Access Payroll Data"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-400 block mb-1">Description</label>
                <textarea
                  placeholder="e.g. View salary slips, wage calculations, and monthly payout summaries"
                  value={newRuleDesc}
                  onChange={(e) => setNewRuleDesc(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddRuleModal(false)}
                  className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
                >
                  <Save className="h-3.5 w-3.5" />
                  Add Permission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
