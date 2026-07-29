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

    // Super admin bypasses all role checks
    if (user.globalRole === GlobalRole.SUPER_ADMIN) {
      return true;
    }

    // Check global role requirement
    if (requiredRoles.includes(user.globalRole)) {
      return true;
    }

    // Check organization role requirement if orgId param exists
    const orgId = params.orgId || params.id;
    if (orgId && user.orgMemberships) {
      const membership = user.orgMemberships.find((m: { orgId: string; role: OrgRole }) => m.orgId === orgId);
      if (membership && requiredRoles.includes(membership.role)) {
        return true;
      }
    }

    return false;
  }
}
