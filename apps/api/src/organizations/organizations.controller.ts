import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { OrganizationsService } from './organizations.service.js';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto/organization.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { GlobalRole, OrgRole } from '@prisma/client';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly orgsService: OrganizationsService) {}

  @Post()
  @Roles(GlobalRole.SUPER_ADMIN)
  async create(@Body() dto: CreateOrganizationDto) {
    const data = await this.orgsService.create(dto);
    return { success: true, data, timestamp: new Date().toISOString() };
  }

  @Get()
  async findAll() {
    const data = await this.orgsService.findAll();
    return { success: true, data, timestamp: new Date().toISOString() };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.orgsService.findOne(id);
    return { success: true, data, timestamp: new Date().toISOString() };
  }

  @Patch(':id')
  @Roles(OrgRole.ORG_ADMIN, GlobalRole.SUPER_ADMIN)
  async update(@Param('id') id: string, @Body() dto: UpdateOrganizationDto) {
    const data = await this.orgsService.update(id, dto);
    return { success: true, data, timestamp: new Date().toISOString() };
  }

  @Delete(':id')
  @Roles(GlobalRole.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    const data = await this.orgsService.remove(id);
    return { success: true, data, timestamp: new Date().toISOString() };
  }
}
