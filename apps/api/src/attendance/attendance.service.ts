import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RulesEngineService } from './rules-engine.service.js';
import { ScanAttendanceDto, ManualAttendanceDto } from './dto/attendance.dto.js';
import { AttendanceMethod, Prisma } from '@prisma/client';

@Injectable()
export class AttendanceService {
  constructor(
    private prisma: PrismaService,
    private rulesEngine: RulesEngineService,
  ) {}

  async scan(dto: ScanAttendanceDto, scannedByUserId?: string) {
    // 1. Lookup QR token
    const qrCode = await this.prisma.qRCode.findUnique({
      where: { qrToken: dto.qrToken },
      include: {
        member: {
          include: {
            user: { select: { name: true, avatarUrl: true } },
            department: { select: { name: true } },
          },
        },
      },
    });

    if (!qrCode || !qrCode.isActive) {
      throw new BadRequestException('Invalid or inactive QR code');
    }

    const { member, orgId } = qrCode;

    // 2. Fetch default attendance rule for the org
    const rule = await this.prisma.attendanceRule.findFirst({
      where: { orgId, isDefault: true, isActive: true },
    });

    // 3. Find scanner user if passed
    let scannedById: string | undefined;
    if (scannedByUserId) {
      const scannerMember = await this.prisma.orgMember.findFirst({
        where: { userId: scannedByUserId, orgId },
      });
      scannedById = scannerMember?.id;
    }

    const scanTime = new Date();

    // 4. Run rules engine validation
    const validation = await this.rulesEngine.validateScan({
      member,
      orgId,
      rule,
      scanTime,
      gpsLocation: dto.gpsLocation,
    });

    // Determine method based on QR type or device info
    let method: AttendanceMethod = 'QR_MOBILE';
    if (dto.deviceInfo?.kioskId) method = 'QR_KIOSK';
    else if (qrCode.type === 'ID_CARD') method = 'QR_IDCARD';

    // 5. Create attendance record
    const record = await this.prisma.attendanceRecord.create({
      data: {
        memberId: member.id,
        orgId,
        type: validation.type,
        timestamp: scanTime,
        method,
        scannedById,
        deviceInfo: dto.deviceInfo ? (dto.deviceInfo as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
        gpsLocation: dto.gpsLocation ? (dto.gpsLocation as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
        status: validation.status,
        validationErrors: validation.errors,
      },
    });

    return {
      success: validation.isValid,
      recordId: record.id,
      type: validation.type,
      status: validation.status,
      memberName: member.user.name,
      memberAvatar: member.user.avatarUrl,
      employeeId: member.employeeId,
      departmentName: member.department?.name || null,
      timestamp: scanTime.toISOString(),
      message: validation.message,
      errors: validation.errors,
    };
  }

  async manual(orgId: string, dto: ManualAttendanceDto, adminUserId: string) {
    const adminMember = await this.prisma.orgMember.findFirst({
      where: { userId: adminUserId, orgId },
    });

    const record = await this.prisma.attendanceRecord.create({
      data: {
        memberId: dto.memberId,
        orgId,
        type: dto.type,
        timestamp: new Date(),
        method: 'MANUAL',
        scannedById: adminMember?.id,
        status: 'VALID',
        notes: dto.notes || 'Manually marked by admin',
      },
      include: {
        member: {
          include: {
            user: { select: { name: true, avatarUrl: true } },
            department: { select: { name: true } },
          },
        },
      },
    });

    return record;
  }

  async getTodayStats(orgId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalMembers, todayRecords] = await Promise.all([
      this.prisma.orgMember.count({ where: { orgId, isActive: true } }),
      this.prisma.attendanceRecord.findMany({
        where: {
          orgId,
          timestamp: { gte: today },
        },
      }),
    ]);

    // Unique members who checked in today
    const checkedInMembers = new Set(
      todayRecords.filter((r) => r.type === 'CHECK_IN' && r.status !== 'INVALID').map((r) => r.memberId),
    );

    const lateCount = new Set(
      todayRecords.filter((r) => r.status === 'FLAGGED' && r.validationErrors.includes('LATE_CHECKIN')).map((r) => r.memberId),
    ).size;

    const checkedOutCount = new Set(
      todayRecords.filter((r) => r.type === 'CHECK_OUT').map((r) => r.memberId),
    ).size;

    const present = checkedInMembers.size;
    const absent = Math.max(0, totalMembers - present);
    const attendancePercentage = totalMembers > 0 ? Math.round((present / totalMembers) * 1000) / 10 : 0;

    return {
      date: today.toISOString().split('T')[0],
      totalMembers,
      present,
      absent,
      late: lateCount,
      onLeave: 0,
      checkedOut: checkedOutCount,
      attendancePercentage,
    };
  }

  async findAll(orgId: string, page = 1, pageSize = 20, memberId?: string, status?: string) {
    const skip = (page - 1) * pageSize;

    const where = {
      orgId,
      ...(memberId && { memberId }),
      ...(status && { status: status as 'VALID' | 'INVALID' | 'FLAGGED' }),
    };

    const [items, total] = await Promise.all([
      this.prisma.attendanceRecord.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          member: {
            include: {
              user: { select: { name: true, avatarUrl: true } },
              department: { select: { name: true } },
            },
          },
        },
        orderBy: { timestamp: 'desc' },
      }),
      this.prisma.attendanceRecord.count({ where }),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return {
      items,
      pagination: {
        total,
        page,
        pageSize,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }
}
