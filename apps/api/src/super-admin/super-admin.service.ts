import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class SuperAdminService {
  constructor(private prisma: PrismaService) {}

  async getPlatformDashboard() {
    const [totalOrganizations, totalUsers, totalMembers, totalScansToday] = await Promise.all([
      this.prisma.organization.count(),
      this.prisma.user.count(),
      this.prisma.orgMember.count(),
      this.prisma.attendanceRecord.count({
        where: {
          timestamp: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    const recentOrgs = await this.prisma.organization.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { members: true } } },
    });

    return {
      totalOrganizations,
      totalUsers,
      totalMembers,
      totalScansToday,
      recentOrganizations: recentOrgs.map((o) => ({
        id: o.id,
        name: o.name,
        slug: o.slug,
        plan: o.plan,
        createdAt: o.createdAt,
        totalMembers: o._count.members,
      })),
    };
  }
}
