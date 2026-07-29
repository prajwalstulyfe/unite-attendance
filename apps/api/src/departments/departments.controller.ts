import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { DepartmentsService } from './departments.service.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { OrgRole } from '@prisma/client';

@Controller('organizations/:orgId/departments')
export class DepartmentsController {
  constructor(private readonly deptsService: DepartmentsService) {}

  @Post()
  @Roles(OrgRole.ORG_ADMIN)
  async create(
    @Param('orgId') orgId: string,
    @Body() body: { name: string; branchId?: string },
  ) {
    const data = await this.deptsService.create(orgId, body.name, body.branchId);
    return { success: true, data, timestamp: new Date().toISOString() };
  }

  @Get()
  async findAll(@Param('orgId') orgId: string) {
    const data = await this.deptsService.findAll(orgId);
    return { success: true, data, timestamp: new Date().toISOString() };
  }

  @Delete(':id')
  @Roles(OrgRole.ORG_ADMIN)
  async remove(@Param('orgId') orgId: string, @Param('id') id: string) {
    const data = await this.deptsService.remove(orgId, id);
    return { success: true, data, timestamp: new Date().toISOString() };
  }
}
