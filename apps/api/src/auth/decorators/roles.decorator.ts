import { SetMetadata } from '@nestjs/common';
import { OrgRole, GlobalRole } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: (OrgRole | GlobalRole)[]) => SetMetadata(ROLES_KEY, roles);
