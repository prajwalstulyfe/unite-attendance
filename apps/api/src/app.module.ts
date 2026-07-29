import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { OrganizationsModule } from './organizations/organizations.module.js';
import { MembersModule } from './members/members.module.js';
import { AttendanceModule } from './attendance/attendance.module.js';
import { QrModule } from './qr/qr.module.js';
import { BranchesModule } from './branches/branches.module.js';
import { DepartmentsModule } from './departments/departments.module.js';
import { AttendanceRulesModule } from './attendance-rules/attendance-rules.module.js';
import { ReportsModule } from './reports/reports.module.js';
import { RealtimeModule } from './realtime/realtime.module.js';
import { SuperAdminModule } from './super-admin/super-admin.module.js';
import { HealthModule } from './health/health.module.js';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard.js';
import { RolesGuard } from './auth/guards/roles.guard.js';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    OrganizationsModule,
    MembersModule,
    AttendanceModule,
    QrModule,
    BranchesModule,
    DepartmentsModule,
    AttendanceRulesModule,
    ReportsModule,
    RealtimeModule,
    SuperAdminModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
