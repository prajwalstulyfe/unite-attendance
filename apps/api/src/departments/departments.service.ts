import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class DepartmentsService {
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

  async create(orgIdOrSlug: string, name: string, branchId?: string, headId?: string) {
    const orgId = await this.resolveOrgId(orgIdOrSlug);
    return (this.prisma.department as any).create({
      data: {
        orgId,
        name,
        branchId,
        headId: headId || undefined,
      },
      include: {
        branch: { select: { id: true, name: true } },
        head: { select: { id: true, user: { select: { name: true, email: true } } } },
        _count: { select: { members: true } },
      },
    });
  }

  async findAll(orgIdOrSlug: string) {
    const orgId = await this.resolveOrgId(orgIdOrSlug);
    return (this.prisma.department as any).findMany({
      where: { orgId },
      include: {
        branch: { select: { id: true, name: true } },
        head: { select: { id: true, user: { select: { name: true, email: true } } } },
        _count: { select: { members: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async update(orgIdOrSlug: string, id: string, body: { name?: string; branchId?: string; headId?: string | null }) {
    const orgId = await this.resolveOrgId(orgIdOrSlug);
    const dept = await this.prisma.department.findFirst({ where: { id, orgId } });
    if (!dept) throw new NotFoundException('Department not found');
    return (this.prisma.department as any).update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.branchId !== undefined && { branchId: body.branchId }),
        ...(body.headId !== undefined && { headId: body.headId }),
      },
      include: {
        branch: { select: { id: true, name: true } },
        head: { select: { id: true, user: { select: { name: true, email: true } } } },
        _count: { select: { members: true } },
      },
    });
  }

  async remove(orgIdOrSlug: string, id: string) {
    const orgId = await this.resolveOrgId(orgIdOrSlug);
    const dept = await this.prisma.department.findFirst({ where: { id, orgId } });
    if (!dept) throw new NotFoundException('Department not found');
    return this.prisma.department.delete({ where: { id } });
  }
}
