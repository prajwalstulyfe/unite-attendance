import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AttendanceRule, AttendanceType, AttendanceStatus, OrgMember } from '@prisma/client';
import { GeoLocationDto } from './dto/attendance.dto.js';

export interface ScanValidationResult {
  isValid: boolean;
  status: AttendanceStatus;
  errors: string[];
  type: AttendanceType;
  message: string;
}

@Injectable()
export class RulesEngineService {
  constructor(private prisma: PrismaService) {}

  async validateScan(params: {
    member: OrgMember;
    orgId: string;
    rule: AttendanceRule | null;
    scanTime: Date;
    gpsLocation?: GeoLocationDto;
  }): Promise<ScanValidationResult> {
    const { member, orgId, rule, scanTime, gpsLocation } = params;
    const errors: string[] = [];

    // 1. Check if member is active
    if (!member.isActive) {
      errors.push('MEMBER_INACTIVE');
    }

    // 2. Check duplicate scan (prevent rapid re-scans within e.g. 5 mins)
    const preventDuplicateMin = rule?.preventDuplicateMin ?? 5;
    const bufferTime = new Date(scanTime.getTime() - preventDuplicateMin * 60 * 1000);

    const recentScan = await this.prisma.attendanceRecord.findFirst({
      where: {
        memberId: member.id,
        orgId,
        timestamp: { gte: bufferTime },
      },
      orderBy: { timestamp: 'desc' },
    });

    if (recentScan) {
      errors.push('DUPLICATE_SCAN');
    }

    // 3. Determine check-in vs check-out
    const lastScanToday = await this.prisma.attendanceRecord.findFirst({
      where: {
        memberId: member.id,
        orgId,
        timestamp: {
          gte: new Date(scanTime.getFullYear(), scanTime.getMonth(), scanTime.getDate()),
        },
      },
      orderBy: { timestamp: 'desc' },
    });

    const type: AttendanceType =
      lastScanToday?.type === 'CHECK_IN' ? 'CHECK_OUT' : 'CHECK_IN';

    // 4. GPS validation (if rule requires it)
    if (rule?.requireGps) {
      if (!gpsLocation) {
        errors.push('GPS_REQUIRED');
      } else if (rule.allowedLocations && Array.isArray(rule.allowedLocations)) {
        const locations = rule.allowedLocations as Array<{ lat: number; lng: number; radiusMeters?: number }>;
        const inRange = locations.some((loc) => {
          const dist = this.haversineDistance(gpsLocation.lat, gpsLocation.lng, loc.lat, loc.lng);
          return dist <= (loc.radiusMeters || rule.gpsRadiusMeters || 200);
        });

        if (!inRange) {
          errors.push('OUT_OF_GPS_RANGE');
        }
      }
    }

    // 5. Working days check
    if (rule?.workingDays && rule.workingDays.length > 0) {
      const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
      const currentDay = days[scanTime.getDay()] || 'mon';
      if (!rule.workingDays.includes(currentDay)) {
        errors.push('NON_WORKING_DAY');
      }
    }

    // 6. Late check-in detection (for check-ins only)
    let isLate = false;
    if (type === 'CHECK_IN' && rule?.workStart) {
      const [startHour, startMin] = rule.workStart.split(':').map(Number);
      const workStartTime = new Date(scanTime);
      workStartTime.setHours(startHour || 9, startMin || 0, 0, 0);

      const lateThreshold = (rule.lateThresholdMin || 15) * 60 * 1000;
      if (scanTime.getTime() > workStartTime.getTime() + lateThreshold) {
        isLate = true;
        errors.push('LATE_CHECKIN');
      }
    }

    // Determine status
    let status: AttendanceStatus = 'VALID';
    let message = type === 'CHECK_IN' ? 'Check-in successful' : 'Check-out successful';

    if (errors.length > 0) {
      if (errors.includes('MEMBER_INACTIVE') || errors.includes('DUPLICATE_SCAN') || errors.includes('OUT_OF_GPS_RANGE')) {
        status = 'INVALID';
        message = errors.includes('DUPLICATE_SCAN') ? 'Already scanned recently' : 'Scan failed validation';
      } else if (isLate) {
        status = 'FLAGGED';
        message = 'Late check-in recorded';
      }
    }

    const isValid = status !== 'INVALID';

    return {
      isValid,
      status,
      errors,
      type,
      message,
    };
  }

  /**
   * Calculate distance between two lat/lng points in meters (Haversine formula)
   */
  private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in metres
  }
}
