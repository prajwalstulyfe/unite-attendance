import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import * as Papa from 'papaparse';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getDailyReport(orgId: string, dateStr?: string) {
    const targetDate = dateStr ? new Date(dateStr) : new Date();
    const start = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const end = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 23, 59, 59, 999);

    const [totalMembers, records] = await Promise.all([
      this.prisma.orgMember.count({ where: { orgId, isActive: true } }),
      this.prisma.attendanceRecord.findMany({
        where: {
          orgId,
          timestamp: { gte: start, lte: end },
        },
        include: {
          member: {
            include: {
              user: { select: { name: true, email: true } },
              department: { select: { name: true } },
            },
          },
        },
        orderBy: { timestamp: 'desc' },
      }),
    ]);

    const checkedIn = new Set(records.filter((r) => r.type === 'CHECK_IN').map((r) => r.memberId)).size;
    const late = new Set(records.filter((r) => r.status === 'FLAGGED').map((r) => r.memberId)).size;

    return {
      date: start.toISOString().split('T')[0],
      totalMembers,
      present: checkedIn,
      absent: Math.max(0, totalMembers - checkedIn),
      late,
      records,
    };
  }

  async exportCsv(orgId: string, startDate?: string, endDate?: string) {
    const where = {
      orgId,
      ...(startDate && endDate && {
        timestamp: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      }),
    };

    const records = await this.prisma.attendanceRecord.findMany({
      where,
      include: {
        member: {
          include: {
            user: { select: { name: true, email: true } },
            department: { select: { name: true } },
            branch: { select: { name: true } },
          },
        },
      },
      orderBy: { timestamp: 'desc' },
    });

    const rows = records.map((r) => ({
      'Record ID': r.id,
      'Member Name': r.member.user.name,
      'Email': r.member.user.email,
      'Employee ID': r.member.employeeId || 'N/A',
      'Department': r.member.department?.name || 'N/A',
      'Branch': r.member.branch?.name || 'N/A',
      'Type': r.type,
      'Method': r.method,
      'Status': r.status,
      'Date & Time': r.timestamp.toISOString(),
    }));

    return Papa.unparse(rows);
  }
}
