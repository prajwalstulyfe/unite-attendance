import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '@prisma/client';

@Injectable()
export class AttendanceRulesService {
  constructor(private prisma: PrismaService) {}

  async create(orgId: string, data: {
    name: string;
    workStart: string;
    workEnd: string;
    lateThresholdMin?: number;
    requireGps?: boolean;
    allowedLocations?: Record<string, unknown>[];
    workingDays?: string[];
    isDefault?: boolean;
  }) {
    if (data.isDefault) {
      // Clear previous default
      await this.prisma.attendanceRule.updateMany({
        where: { orgId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.attendanceRule.create({
      data: {
        orgId,
        name: data.name,
        workStart: data.workStart,
        workEnd: data.workEnd,
        lateThresholdMin: data.lateThresholdMin ?? 15,
        requireGps: data.requireGps ?? false,
        allowedLocations: data.allowedLocations ? (data.allowedLocations as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
        workingDays: data.workingDays ?? ['mon', 'tue', 'wed', 'thu', 'fri'],
        isDefault: data.isDefault ?? false,
      },
    });
  }

  async findAll(orgId: string) {
    return this.prisma.attendanceRule.findMany({
      where: { orgId, isActive: true },
      orderBy: { isDefault: 'desc' },
    });
  }

  async remove(orgId: string, id: string) {
    const rule = await this.prisma.attendanceRule.findFirst({ where: { id, orgId } });
    if (!rule) throw new NotFoundException('Rule not found');
    return this.prisma.attendanceRule.update({ where: { id }, data: { isActive: false } });
  }
}
