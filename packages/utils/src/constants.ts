// ═══════════════════════════════════════════════════════════════
// Unite Attendance — Constants
// ═══════════════════════════════════════════════════════════════

import { Plan } from '@repo/types';
import type { PlanLimits } from '@repo/types';

/** Plan limits for feature gating */
export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  [Plan.FREE]: {
    maxMembers: 25,
    maxBranches: 1,
    maxAdmins: 1,
    qrRegenPerMonth: 5,
    csvExport: false,
    pdfExport: false,
    customBranding: false,
    apiAccess: false,
    prioritySupport: false,
  },
  [Plan.STARTER]: {
    maxMembers: 100,
    maxBranches: 3,
    maxAdmins: 3,
    qrRegenPerMonth: 50,
    csvExport: true,
    pdfExport: false,
    customBranding: false,
    apiAccess: false,
    prioritySupport: false,
  },
  [Plan.PRO]: {
    maxMembers: 500,
    maxBranches: 10,
    maxAdmins: 10,
    qrRegenPerMonth: -1, // unlimited
    csvExport: true,
    pdfExport: true,
    customBranding: true,
    apiAccess: false,
    prioritySupport: true,
  },
  [Plan.ENTERPRISE]: {
    maxMembers: -1, // unlimited
    maxBranches: -1,
    maxAdmins: -1,
    qrRegenPerMonth: -1,
    csvExport: true,
    pdfExport: true,
    customBranding: true,
    apiAccess: true,
    prioritySupport: true,
  },
};

/**
 * Check if a plan limit allows more of a resource
 * Returns true if the current count is below the limit (or limit is unlimited)
 */
export function isWithinPlanLimit(plan: Plan, resource: keyof PlanLimits, currentCount: number): boolean {
  const limit = PLAN_LIMITS[plan][resource];
  if (typeof limit === 'boolean') return limit;
  if (limit === -1) return true; // unlimited
  return currentCount < limit;
}

/**
 * Get the plan limit value for a resource
 */
export function getPlanLimit(plan: Plan, resource: keyof PlanLimits): number | boolean {
  return PLAN_LIMITS[plan][resource];
}

/** Default pagination values */
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

/** QR code defaults */
export const QR_DEFAULT_EXPIRY_DAYS = 365;
export const QR_IMAGE_SIZE = 400; // pixels

/** Attendance defaults */
export const DEFAULT_LATE_THRESHOLD_MIN = 15;
export const DEFAULT_HALF_DAY_THRESHOLD_MIN = 240;
export const DEFAULT_DUPLICATE_SCAN_MIN = 5;
export const DEFAULT_GPS_RADIUS_METERS = 200;

/** JWT defaults */
export const ACCESS_TOKEN_EXPIRY = '15m';
export const REFRESH_TOKEN_EXPIRY = '7d';

/** App name and branding */
export const APP_NAME = 'Unite Attendance';
export const APP_DESCRIPTION = 'Smart QR-based attendance management for modern organizations';
export const APP_URL = 'https://unite-attendance.com';
