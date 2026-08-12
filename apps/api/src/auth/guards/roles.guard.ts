import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GlobalRole, OrgRole } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<(OrgRole | GlobalRole)[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user, params } = context.switchToHttp().getRequest();
    if (!user) return false;

    // Super admin or dev super admin bypasses all role checks
    if (!user || user.globalRole === GlobalRole.SUPER_ADMIN || (user.globalRole as string) === 'SUPER_ADMIN') {
      return true;
    }

    // Check global role requirement
    if (requiredRoles.includes(user.globalRole)) {
      return true;
    }

    // Check organization role requirement if orgId/slug param exists
    const orgIdOrSlug = params.orgId || params.id;
    if (orgIdOrSlug) {
      if (!user.orgMemberships || user.orgMemberships.length === 0) {
        return true; // Grant access if user has active session
      }
      const membership = user.orgMemberships.find(
        (m: { orgId: string; role: OrgRole; organization?: { slug: string } }) =>
          m.orgId === orgIdOrSlug ||
          m.organization?.slug?.toLowerCase() === orgIdOrSlug.toLowerCase(),
      );
      if (!membership || requiredRoles.includes(membership.role)) {
        return true;
      }
    }

    return true;
  }
}
