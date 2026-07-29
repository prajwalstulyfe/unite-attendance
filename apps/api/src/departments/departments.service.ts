import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  async create(orgId: string, name: string, branchId?: string) {
    return this.prisma.department.create({
      data: {
        orgId,
        name,
        branchId,
      },
    });
  }

  async findAll(orgId: string) {
    return this.prisma.department.findMany({
      where: { orgId },
      include: {
        branch: { select: { id: true, name: true } },
        _count: { select: { members: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async remove(orgId: string, id: string) {
    const dept = await this.prisma.department.findFirst({ where: { id, orgId } });
    if (!dept) throw new NotFoundException('Department not found');
    return this.prisma.department.delete({ where: { id } });
  }
}
