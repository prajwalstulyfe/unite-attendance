import { Controller, Get, Param, Query, Header } from '@nestjs/common';
import { ReportsService } from './reports.service.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { OrgRole } from '@prisma/client';

@Controller('organizations/:orgId/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('daily')
  @Roles(OrgRole.ORG_ADMIN, OrgRole.MANAGER, OrgRole.VIEWER)
  async getDailyReport(@Param('orgId') orgId: string, @Query('date') date?: string) {
    const data = await this.reportsService.getDailyReport(orgId, date);
    return { success: true, data, timestamp: new Date().toISOString() };
  }

  @Get('export')
  @Roles(OrgRole.ORG_ADMIN, OrgRole.MANAGER)
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="attendance-report.csv"')
  async exportCsv(
    @Param('orgId') orgId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.exportCsv(orgId, startDate, endDate);
  }
}
