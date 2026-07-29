import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service.js';
import { RulesEngineService } from './rules-engine.service.js';
import { AttendanceController } from './attendance.controller.js';

@Module({
  controllers: [AttendanceController],
  providers: [AttendanceService, RulesEngineService],
  exports: [AttendanceService, RulesEngineService],
})
export class AttendanceModule {}
