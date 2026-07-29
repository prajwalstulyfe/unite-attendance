import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Public()
  @Get()
  async check() {
    let dbConnected = false;
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbConnected = true;
    } catch {
      dbConnected = false;
    }

    return {
      status: dbConnected ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        database: dbConnected ? 'up' : 'down',
      },
    };
  }
}
