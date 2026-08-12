import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '@prisma/client';

@Injectable()
export class BranchesService {
  constructor(private prisma: PrismaService) {}

  private async resolveOrgId(idOrSlug: string): Promise<string> {
    if (!idOrSlug) return idOrSlug;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    const org = await this.prisma.organization.findFirst({
      where: isUuid
        ? { OR: [{ id: idOrSlug }, { slug: idOrSlug.toLowerCase() }] }
        : { slug: idOrSlug.toLowerCase() },
      select: { id: true },
    });
    return org ? org.id : idOrSlug;
  }

  async create(orgIdOrSlug: string, name: string, address?: string, location?: Record<string, unknown>) {
    const orgId = await this.resolveOrgId(orgIdOrSlug);
    return this.prisma.branch.create({
      data: {
        orgId,
        name,
        address,
        location: location ? (location as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
      },
    });
  }

  async findAll(orgIdOrSlug: string) {
    const orgId = await this.resolveOrgId(orgIdOrSlug);
    return this.prisma.branch.findMany({
      where: { orgId, isActive: true },
      include: {
        _count: { select: { members: true, departments: true } },
        members: {
          where: { role: { in: ['BRANCH_MANAGER', 'ORG_ADMIN'] as any } },
          select: { id: true, role: true, user: { select: { name: true, email: true } } },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async remove(orgIdOrSlug: string, id: string) {
    const orgId = await this.resolveOrgId(orgIdOrSlug);
    const branch = await this.prisma.branch.findFirst({ where: { id, orgId } });
    if (!branch) throw new NotFoundException('Branch not found');
    return this.prisma.branch.update({ where: { id }, data: { isActive: false } });
  }
}
