import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto/organization.dto.js';
import { Prisma } from '@prisma/client';

const DEFAULT_ORG_SETTINGS = {
  timezone: 'Asia/Kolkata',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '12h',
  currency: 'INR',
  allowSelfCheckIn: false,
  requireGpsForKiosk: false,
  notifyOnLateArrival: true,
  notifyOnAbsence: true,
  maxQrRegenerationsPerMonth: 10,
};

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrganizationDto) {
    const existing = await this.prisma.organization.findUnique({
      where: { slug: dto.slug.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('An organization with this slug already exists');
    }

    return this.prisma.organization.create({
      data: {
        name: dto.name,
        slug: dto.slug.toLowerCase(),
        plan: dto.plan || 'FREE',
        settings: (dto.settings || DEFAULT_ORG_SETTINGS) as Prisma.InputJsonValue,
      },
    });
  }

  async findAll() {
    const orgs = await this.prisma.organization.findMany({
      include: {
        _count: {
          select: {
            members: true,
            branches: true,
            departments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orgs.map((org) => ({
      ...org,
      totalMembers: org._count.members,
      totalBranches: org._count.branches,
      totalDepartments: org._count.departments,
    }));
  }

  async findOne(id: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        branches: true,
        departments: true,
        attendanceRules: true,
        _count: {
          select: { members: true },
        },
      },
    });

    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    // Count today's check-ins
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCheckIns = await this.prisma.attendanceRecord.count({
      where: {
        orgId: id,
        timestamp: { gte: today },
        type: 'CHECK_IN',
      },
    });

    return {
      ...org,
      totalMembers: org._count.members,
      todayCheckIns,
    };
  }

  async update(id: string, dto: UpdateOrganizationDto) {
    await this.findOne(id);

    return this.prisma.organization.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.logo && { logo: dto.logo }),
        ...(dto.plan && { plan: dto.plan }),
        ...(dto.settings && { settings: dto.settings as Prisma.InputJsonValue }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.organization.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
