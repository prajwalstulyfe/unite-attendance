import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { MembersService } from './members.service.js';
import { CreateMemberDto, UpdateMemberDto } from './dto/member.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { OrgRole } from '@prisma/client';

@Controller('organizations/:orgId/members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  @Roles(OrgRole.ORG_ADMIN, OrgRole.MANAGER)
  async create(@Param('orgId') orgId: string, @Body() dto: CreateMemberDto) {
    const data = await this.membersService.create(orgId, dto);
    return { success: true, data, timestamp: new Date().toISOString() };
  }

  @Get()
  @Roles(OrgRole.ORG_ADMIN, OrgRole.MANAGER, OrgRole.VIEWER)
  async findAll(
    @Param('orgId') orgId: string,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 20,
    @Query('search') search?: string,
  ) {
    const data = await this.membersService.findAll(orgId, Number(page), Number(pageSize), search);
    return { success: true, data, timestamp: new Date().toISOString() };
  }

  @Get(':id')
  @Roles(OrgRole.ORG_ADMIN, OrgRole.MANAGER, OrgRole.VIEWER, OrgRole.MEMBER)
  async findOne(@Param('orgId') orgId: string, @Param('id') id: string) {
    const data = await this.membersService.findOne(orgId, id);
    return { success: true, data, timestamp: new Date().toISOString() };
  }

  @Patch(':id')
  @Roles(OrgRole.ORG_ADMIN, OrgRole.MANAGER)
  async update(
    @Param('orgId') orgId: string,
    @Param('id') id: string,
    @Body() dto: UpdateMemberDto,
  ) {
    const data = await this.membersService.update(orgId, id, dto);
    return { success: true, data, timestamp: new Date().toISOString() };
  }

  @Delete(':id')
  @Roles(OrgRole.ORG_ADMIN)
  async remove(@Param('orgId') orgId: string, @Param('id') id: string) {
    const data = await this.membersService.remove(orgId, id);
    return { success: true, data, timestamp: new Date().toISOString() };
  }
}
