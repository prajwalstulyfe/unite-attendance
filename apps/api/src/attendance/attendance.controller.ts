import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service.js';
import { ScanAttendanceDto, ManualAttendanceDto } from './dto/attendance.dto.js';
import { Public } from '../auth/decorators/public.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { OrgRole } from '@prisma/client';

@Controller()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Public()
  @Post('attendance/scan')
  async scan(@Body() dto: ScanAttendanceDto) {
    const data = await this.attendanceService.scan(dto);
    return { success: true, data, timestamp: new Date().toISOString() };
  }

  @Post('organizations/:orgId/attendance/manual')
  @Roles(OrgRole.ORG_ADMIN, OrgRole.MANAGER)
  async manual(
    @Param('orgId') orgId: string,
    @Body() dto: ManualAttendanceDto,
    @CurrentUser('id') userId: string,
  ) {
    const data = await this.attendanceService.manual(orgId, dto, userId);
    return { success: true, data, timestamp: new Date().toISOString() };
  }

  @Get('organizations/:orgId/attendance/today')
  @Roles(OrgRole.ORG_ADMIN, OrgRole.MANAGER, OrgRole.VIEWER)
  async getTodayStats(@Param('orgId') orgId: string) {
    const data = await this.attendanceService.getTodayStats(orgId);
    return { success: true, data, timestamp: new Date().toISOString() };
  }

  @Get('organizations/:orgId/attendance')
  @Roles(OrgRole.ORG_ADMIN, OrgRole.MANAGER, OrgRole.VIEWER)
  async findAll(
    @Param('orgId') orgId: string,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 20,
    @Query('memberId') memberId?: string,
    @Query('status') status?: string,
  ) {
    const data = await this.attendanceService.findAll(orgId, Number(page), Number(pageSize), memberId, status);
    return { success: true, data, timestamp: new Date().toISOString() };
  }
}
