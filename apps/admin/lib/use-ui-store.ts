import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type PortalMode = "ORG" | "SUPER";

export interface MemberRecord {
  id: string;
  name: string;
  email: string;
  empId: string;
  dept: string;
  role: string;
  status: "active" | "inactive";
}

const defaultMembersMap: Record<string, MemberRecord[]> = {
  "acme-corp": [
    { id: "acme-1", name: "Jane Smith", email: "jane@acme.com", empId: "EMP-102", dept: "Engineering", role: "Member", status: "active" },
    { id: "acme-2", name: "John Doe", email: "john@acme.com", empId: "EMP-101", dept: "Engineering", role: "Manager", status: "active" },
    { id: "acme-3", name: "Alice Johnson", email: "alice@acme.com", empId: "EMP-103", dept: "Human Resources", role: "Member", status: "active" },
    { id: "acme-4", name: "Bob Williams", email: "bob@acme.com", empId: "EMP-104", dept: "Engineering", role: "Member", status: "active" },
  ],
  "stulyfe-edu": [
    { id: "stu-1", name: "Prof. Rajesh Kumar", email: "rajesh@stulyfe.edu", empId: "FAC-201", dept: "Computer Science", role: "Manager", status: "active" },
    { id: "stu-2", name: "Dr. Ananya Sharma", email: "ananya@stulyfe.edu", empId: "FAC-202", dept: "Electronics", role: "Member", status: "active" },
    { id: "stu-3", name: "Rahul Verma", email: "rahul@stulyfe.edu", empId: "STU-501", dept: "Computer Science", role: "Member", status: "active" },
  ],
  "cybertech": [
    { id: "cyb-1", name: "Alex Vance", email: "alex@cybertech.io", empId: "DEV-301", dept: "AI & Cloud", role: "Manager", status: "active" },
    { id: "cyb-2", name: "Elena Rostova", email: "elena@cybertech.io", empId: "DEV-302", dept: "Cybersecurity", role: "Member", status: "active" },
  ],
  "global-logistics": [
    { id: "log-1", name: "David Miller", email: "david@globallogistics.com", empId: "LOG-401", dept: "Supply Chain", role: "Manager", status: "active" },
    { id: "log-2", name: "Samira Patel", email: "samira@globallogistics.com", empId: "LOG-402", dept: "Fleet Operations", role: "Member", status: "active" },
  ],
};

interface UIState {
  portalMode: PortalMode;
  activeOrgName: string;
  activeOrgSlug: string;
  isSuperAdminUser: boolean;
  isSidebarCollapsed: boolean;
  membersMap: Record<string, MemberRecord[]>;
  
  // Actions
  setPortalMode: (mode: PortalMode) => void;
  togglePortalMode: () => void;
  setActiveOrg: (name: string, slug: string) => void;
  setIsSuperAdminUser: (isSuper: boolean) => void;
  toggleSidebar: () => void;
  addMember: (orgSlug: string, member: Omit<MemberRecord, "id">) => void;
  editMember: (orgSlug: string, memberId: string, updated: Partial<MemberRecord>) => void;
  deleteMember: (orgSlug: string, memberId: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      portalMode: "ORG",
      activeOrgName: "Acme Corporation",
      activeOrgSlug: "acme-corp",
      isSuperAdminUser: true,
      isSidebarCollapsed: false,
      membersMap: defaultMembersMap,

      setPortalMode: (portalMode) => set({ portalMode }),
      togglePortalMode: () =>
        set((state) => ({
          portalMode: state.portalMode === "ORG" ? "SUPER" : "ORG",
        })),
      setActiveOrg: (activeOrgName, activeOrgSlug) =>
        set({ activeOrgName, activeOrgSlug }),
      setIsSuperAdminUser: (isSuperAdminUser) => set({ isSuperAdminUser }),
      toggleSidebar: () =>
        set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

      addMember: (orgSlug, newMember) =>
        set((state) => {
          const currentList = state.membersMap[orgSlug] || [];
          const created: MemberRecord = {
            ...newMember,
            id: `mem-${Date.now()}`,
          };
          return {
            membersMap: {
              ...state.membersMap,
              [orgSlug]: [created, ...currentList],
            },
          };
        }),

      editMember: (orgSlug, memberId, updated) =>
        set((state) => {
          const currentList = state.membersMap[orgSlug] || [];
          const updatedList = currentList.map((m) => (m.id === memberId ? { ...m, ...updated } : m));
          return {
            membersMap: {
              ...state.membersMap,
              [orgSlug]: updatedList,
            },
          };
        }),

      deleteMember: (orgSlug, memberId) =>
        set((state) => {
          const currentList = state.membersMap[orgSlug] || [];
          const filtered = currentList.filter((m) => m.id !== memberId);
          return {
            membersMap: {
              ...state.membersMap,
              [orgSlug]: filtered,
            },
          };
        }),
    }),
    {
      name: "unite-ui-store-v6",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
