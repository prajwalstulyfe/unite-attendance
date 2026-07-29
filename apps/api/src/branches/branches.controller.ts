import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { BranchesService } from './branches.service.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { OrgRole } from '@prisma/client';

@Controller('organizations/:orgId/branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @Roles(OrgRole.ORG_ADMIN)
  async create(
    @Param('orgId') orgId: string,
    @Body() body: { name: string; address?: string; location?: Record<string, unknown> },
  ) {
    const data = await this.branchesService.create(orgId, body.name, body.address, body.location);
    return { success: true, data, timestamp: new Date().toISOString() };
  }

  @Get()
  async findAll(@Param('orgId') orgId: string) {
    const data = await this.branchesService.findAll(orgId);
    return { success: true, data, timestamp: new Date().toISOString() };
  }

  @Delete(':id')
  @Roles(OrgRole.ORG_ADMIN)
  async remove(@Param('orgId') orgId: string, @Param('id') id: string) {
    const data = await this.branchesService.remove(orgId, id);
    return { success: true, data, timestamp: new Date().toISOString() };
  }
}
