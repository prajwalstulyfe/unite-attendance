import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { AttendanceRulesService } from './attendance-rules.service.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { OrgRole } from '@prisma/client';

@Controller('organizations/:orgId/attendance-rules')
export class AttendanceRulesController {
  constructor(private readonly rulesService: AttendanceRulesService) {}

  @Post()
  @Roles(OrgRole.ORG_ADMIN)
  async create(
    @Param('orgId') orgId: string,
    @Body() body: {
      name: string;
      workStart: string;
      workEnd: string;
      lateThresholdMin?: number;
      requireGps?: boolean;
      allowedLocations?: Record<string, unknown>[];
      workingDays?: string[];
      isDefault?: boolean;
    },
  ) {
    const data = await this.rulesService.create(orgId, body);
    return { success: true, data, timestamp: new Date().toISOString() };
  }

  @Get()
  @Roles(OrgRole.ORG_ADMIN, OrgRole.MANAGER)
  async findAll(@Param('orgId') orgId: string) {
    const data = await this.rulesService.findAll(orgId);
    return { success: true, data, timestamp: new Date().toISOString() };
  }

  @Delete(':id')
  @Roles(OrgRole.ORG_ADMIN)
  async remove(@Param('orgId') orgId: string, @Param('id') id: string) {
    const data = await this.rulesService.remove(orgId, id);
    return { success: true, data, timestamp: new Date().toISOString() };
  }
}
