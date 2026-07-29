import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import { LoginDto, RegisterDto, RefreshTokenDto } from './dto/auth.dto.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        name: dto.name,
        passwordHash,
      },
    });

    return this.generateTokens(user.id, user.email, user.globalRole);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: {
        orgMemberships: {
          include: {
            organization: true,
            department: true,
            branch: true,
          },
        },
      },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Your account has been deactivated');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.globalRole);
    return {
      tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        globalRole: user.globalRole,
        orgMemberships: user.orgMemberships,
      },
    };
  }

  async refreshTokens(dto: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(dto.refreshToken, {
        secret: process.env['JWT_REFRESH_SECRET'] || 'your-refresh-secret-min-32-chars-long',
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const isMatch = await bcrypt.compare(dto.refreshToken, user.refreshToken);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokens(user.id, user.email, user.globalRole);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        orgMemberships: {
          include: {
            organization: true,
            department: true,
            branch: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        globalRole: user.globalRole,
        isActive: user.isActive,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      organizations: user.orgMemberships.map((m) => ({
        orgId: m.organization.id,
        orgName: m.organization.name,
        orgSlug: m.organization.slug,
        orgLogo: m.organization.logo,
        role: m.role,
        memberId: m.id,
        departmentName: m.department?.name || null,
        branchName: m.branch?.name || null,
      })),
    };
  }

  async validateGoogleUser(googleUser: { email: string; firstName: string; lastName: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: googleUser.email.toLowerCase() },
      include: {
        orgMemberships: {
          include: {
            organization: true,
            department: true,
            branch: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        `No account found for ${googleUser.email}. Please register your organization first.`
      );
    }

    if ((user.globalRole as string) !== 'SUPER_ADMIN' && user.orgMemberships.length === 0) {
      throw new UnauthorizedException(
        `Account ${googleUser.email} is not linked to any active organization.`
      );
    }

    return this.generateTokens(user.id, user.email, user.globalRole);
  }

  private async generateTokens(userId: string, email: string, globalRole: string) {
    const payload = { sub: userId, email, globalRole };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env['JWT_SECRET'] || 'your-jwt-secret-min-32-chars-long',
      expiresIn: (process.env['JWT_ACCESS_EXPIRATION'] || '15m') as any,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env['JWT_REFRESH_SECRET'] || 'your-refresh-secret-min-32-chars-long',
      expiresIn: (process.env['JWT_REFRESH_EXPIRATION'] || '7d') as any,
    });

    // Hash & store refresh token
    const hashedRefresh = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefresh },
    });

    return { accessToken, refreshToken };
  }
}
