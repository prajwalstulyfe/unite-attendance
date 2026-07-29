import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateMemberDto, UpdateMemberDto } from './dto/member.dto.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  async create(orgId: string, dto: CreateMemberDto) {
    // 1. Find or create user
    let user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      // Default initial password for invited user
      const passwordHash = await bcrypt.hash('Welcome123!', 10);
      user = await this.prisma.user.create({
        data: {
          email: dto.email.toLowerCase(),
          name: dto.name,
          passwordHash,
        },
      });
    }

    // 2. Check existing membership
    const existingMembership = await this.prisma.orgMember.findUnique({
      where: {
        userId_orgId: {
          userId: user.id,
          orgId,
        },
      },
    });

    if (existingMembership) {
      throw new ConflictException('User is already a member of this organization');
    }

    // 3. Create org member
    const member = await this.prisma.orgMember.create({
      data: {
        userId: user.id,
        orgId,
        role: dto.role || 'MEMBER',
        departmentId: dto.departmentId || null,
        branchId: dto.branchId || null,
        employeeId: dto.employeeId || null,
        designation: dto.designation || null,
        phone: dto.phone || null,
      },
      include: {
        user: { select: { id: true, email: true, name: true, avatarUrl: true } },
        department: true,
        branch: true,
      },
    });

    // 4. Auto-generate active QR token
    await this.prisma.qRCode.create({
      data: {
        memberId: member.id,
        orgId,
        qrToken: `QR_${member.id}_${Date.now()}`,
        type: 'MOBILE',
        isActive: true,
      },
    });

    return member;
  }

  async findAll(orgId: string, page = 1, pageSize = 20, search?: string) {
    const skip = (page - 1) * pageSize;

    const where = {
      orgId,
      ...(search && {
        OR: [
          { user: { name: { contains: search, mode: 'insensitive' as const } } },
          { user: { email: { contains: search, mode: 'insensitive' as const } } },
          { employeeId: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [items, total] = await Promise.all([
      this.prisma.orgMember.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          user: { select: { id: true, email: true, name: true, avatarUrl: true } },
          department: true,
          branch: true,
        },
        orderBy: { joinedAt: 'desc' },
      }),
      this.prisma.orgMember.count({ where }),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return {
      items,
      pagination: {
        total,
        page,
        pageSize,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async findOne(orgId: string, id: string) {
    const member = await this.prisma.orgMember.findFirst({
      where: { id, orgId },
      include: {
        user: { select: { id: true, email: true, name: true, avatarUrl: true } },
        department: true,
        branch: true,
        qrCodes: { where: { isActive: true } },
      },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    return member;
  }

  async update(orgId: string, id: string, dto: UpdateMemberDto) {
    await this.findOne(orgId, id);

    return this.prisma.orgMember.update({
      where: { id },
      data: {
        ...(dto.role && { role: dto.role }),
        ...(dto.departmentId !== undefined && { departmentId: dto.departmentId }),
        ...(dto.branchId !== undefined && { branchId: dto.branchId }),
        ...(dto.employeeId && { employeeId: dto.employeeId }),
        ...(dto.designation && { designation: dto.designation }),
        ...(dto.phone && { phone: dto.phone }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
      include: {
        user: { select: { id: true, email: true, name: true, avatarUrl: true } },
        department: true,
        branch: true,
      },
    });
  }

  async remove(orgId: string, id: string) {
    await this.findOne(orgId, id);
    return this.prisma.orgMember.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
