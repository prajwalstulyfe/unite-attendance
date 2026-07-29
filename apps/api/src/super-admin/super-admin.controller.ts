import { Controller, Get } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { GlobalRole } from '@prisma/client';

@Controller('super-admin')
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Get('dashboard')
  @Roles(GlobalRole.SUPER_ADMIN)
  async getDashboard() {
    const data = await this.superAdminService.getPlatformDashboard();
    return { success: true, data, timestamp: new Date().toISOString() };
  }
}
