import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '@prisma/client';

@Injectable()
export class BranchesService {
  constructor(private prisma: PrismaService) {}

  async create(orgId: string, name: string, address?: string, location?: Record<string, unknown>) {
    return this.prisma.branch.create({
      data: {
        orgId,
        name,
        address,
        location: location ? (location as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
      },
    });
  }

  async findAll(orgId: string) {
    return this.prisma.branch.findMany({
      where: { orgId, isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async remove(orgId: string, id: string) {
    const branch = await this.prisma.branch.findFirst({ where: { id, orgId } });
    if (!branch) throw new NotFoundException('Branch not found');
    return this.prisma.branch.update({ where: { id }, data: { isActive: false } });
  }
}
