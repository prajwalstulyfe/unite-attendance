// ═══════════════════════════════════════════════════════════════
// Unite Attendance — Organization Types
// ═══════════════════════════════════════════════════════════════

import type { Plan, DayOfWeek } from './enums';

/** Organization entity */
export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  plan: Plan;
  settings: OrgSettings;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Organization settings stored as JSON */
export interface OrgSettings {
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  currency: string;
  allowSelfCheckIn: boolean;
  requireGpsForKiosk: boolean;
  notifyOnLateArrival: boolean;
  notifyOnAbsence: boolean;
  maxQrRegenerationsPerMonth: number;
}

/** Default organization settings */
export const DEFAULT_ORG_SETTINGS: OrgSettings = {
  timezone: 'Asia/Kolkata',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '12h',
  currency: 'INR',
  allowSelfCheckIn: false,
  requireGpsForKiosk: false,
  notifyOnLateArrival: true,
  notifyOnAbsence: true,
  maxQrRegenerationsPerMonth: 10,
};

/** Branch entity */
export interface Branch {
  id: string;
  orgId: string;
  name: string;
  address: string | null;
  location: GeoLocation | null;
  isActive: boolean;
  createdAt: string;
}

/** Department entity */
export interface Department {
  id: string;
  orgId: string;
  branchId: string | null;
  name: string;
  createdAt: string;
}

/** GPS location */
export interface GeoLocation {
  lat: number;
  lng: number;
  accuracy?: number;
  radiusMeters?: number;
}

/** Holiday entry */
export interface Holiday {
  date: string; // YYYY-MM-DD
  name: string;
  isOptional: boolean;
}

/** Create organization request */
export interface CreateOrganizationRequest {
  name: string;
  slug: string;
  plan: Plan;
  settings?: Partial<OrgSettings>;
  adminEmail: string;
  adminName: string;
}

/** Update organization request */
export interface UpdateOrganizationRequest {
  name?: string;
  logo?: string;
  plan?: Plan;
  settings?: Partial<OrgSettings>;
  isActive?: boolean;
}

/** Create branch request */
export interface CreateBranchRequest {
  name: string;
  address?: string;
  location?: GeoLocation;
}

/** Create department request */
export interface CreateDepartmentRequest {
  name: string;
  branchId?: string;
}

/** Organization with computed stats */
export interface OrganizationWithStats extends Organization {
  totalMembers: number;
  activeMembers: number;
  totalBranches: number;
  totalDepartments: number;
  todayCheckIns: number;
}
