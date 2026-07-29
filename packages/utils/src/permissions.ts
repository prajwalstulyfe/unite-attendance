// ═══════════════════════════════════════════════════════════════
// Unite Attendance — Permissions & RBAC Utilities
// ═══════════════════════════════════════════════════════════════

import { OrgRole, GlobalRole } from '@repo/types';

/** Role hierarchy — higher number = more permissions */
const ROLE_HIERARCHY: Record<OrgRole, number> = {
  [OrgRole.ORG_ADMIN]: 100,
  [OrgRole.MANAGER]: 75,
  [OrgRole.VIEWER]: 50,
  [OrgRole.MEMBER]: 25,
};

/**
 * Check if a user's role has enough permission (at or above required level)
 * @example hasPermission(OrgRole.MANAGER, OrgRole.VIEWER) → true
 * @example hasPermission(OrgRole.MEMBER, OrgRole.MANAGER) → false
 */
export function hasPermission(userRole: OrgRole, requiredRole: OrgRole): boolean {
  return (ROLE_HIERARCHY[userRole] ?? 0) >= (ROLE_HIERARCHY[requiredRole] ?? 0);
}

/**
 * Check if user is a super admin
 */
export function isSuperAdmin(globalRole: GlobalRole): boolean {
  return globalRole === GlobalRole.SUPER_ADMIN;
}

/**
 * Check if user is an org admin
 */
export function isOrgAdmin(orgRole: OrgRole): boolean {
  return orgRole === OrgRole.ORG_ADMIN;
}

/**
 * Check if user can manage members (org_admin or manager)
 */
export function canManageMembers(orgRole: OrgRole): boolean {
  return hasPermission(orgRole, OrgRole.MANAGER);
}

/**
 * Check if user can view attendance data
 */
export function canViewAttendance(orgRole: OrgRole): boolean {
  return hasPermission(orgRole, OrgRole.VIEWER);
}

/**
 * Check if user can edit org settings (org_admin only)
 */
export function canEditSettings(orgRole: OrgRole): boolean {
  return hasPermission(orgRole, OrgRole.ORG_ADMIN);
}

/**
 * Get a human-readable label for a role
 */
export function getRoleLabel(role: OrgRole): string {
  const labels: Record<OrgRole, string> = {
    [OrgRole.ORG_ADMIN]: 'Admin',
    [OrgRole.MANAGER]: 'Manager',
    [OrgRole.VIEWER]: 'Viewer',
    [OrgRole.MEMBER]: 'Member',
  };
  return labels[role] ?? role;
}

/**
 * Get a human-readable label for global role
 */
export function getGlobalRoleLabel(role: GlobalRole): string {
  const labels: Record<GlobalRole, string> = {
    [GlobalRole.SUPER_ADMIN]: 'Super Admin',
    [GlobalRole.USER]: 'User',
  };
  return labels[role] ?? role;
}

/**
 * Get all roles a user can assign (can only assign roles at or below their own level)
 */
export function getAssignableRoles(userRole: OrgRole): OrgRole[] {
  const userLevel = ROLE_HIERARCHY[userRole] ?? 0;
  return Object.entries(ROLE_HIERARCHY)
    .filter(([, level]) => level <= userLevel)
    .map(([role]) => role as OrgRole);
}
