import { Controller, Get, Post, Param } from '@nestjs/common';
import { QrService } from './qr.service.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { OrgRole } from '@prisma/client';

@Controller('organizations/:orgId/qr')
export class QrController {
  constructor(private readonly qrService: QrService) {}

  @Get(':memberId')
  @Roles(OrgRole.ORG_ADMIN, (OrgRole as any).BRANCH_MANAGER, (OrgRole as any).DEPT_HEAD, OrgRole.MEMBER)
  async getMemberQR(@Param('orgId') orgId: string, @Param('memberId') memberId: string) {
    const data = await this.qrService.getMemberQR(orgId, memberId);
    return { success: true, data, timestamp: new Date().toISOString() };
  }

  @Post('generate/:memberId')
  @Roles(OrgRole.ORG_ADMIN, (OrgRole as any).BRANCH_MANAGER, (OrgRole as any).DEPT_HEAD)
  async generate(@Param('orgId') orgId: string, @Param('memberId') memberId: string) {
    const data = await this.qrService.generate(orgId, memberId);
    return { success: true, data, timestamp: new Date().toISOString() };
  }

  @Post('regenerate/:memberId')
  @Roles(OrgRole.ORG_ADMIN, (OrgRole as any).BRANCH_MANAGER, (OrgRole as any).DEPT_HEAD)
  async regenerate(@Param('orgId') orgId: string, @Param('memberId') memberId: string) {
    const data = await this.qrService.regenerate(orgId, memberId);
    return { success: true, data, timestamp: new Date().toISOString() };
  }
}
