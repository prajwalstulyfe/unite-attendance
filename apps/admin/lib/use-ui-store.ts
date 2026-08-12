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

const dummyStorage: Storage = {
  length: 0,
  clear: () => {},
  getItem: () => null,
  key: () => null,
  removeItem: () => {},
  setItem: () => {},
};

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      portalMode: "ORG",
      activeOrgName: "",
      activeOrgSlug: "",
      isSuperAdminUser: true,
      isSidebarCollapsed: false,
      membersMap: {},

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
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : dummyStorage)),
    }
  )
);
