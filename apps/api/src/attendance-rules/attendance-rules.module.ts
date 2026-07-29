import { Module } from '@nestjs/common';
import { AttendanceRulesService } from './attendance-rules.service.js';
import { AttendanceRulesController } from './attendance-rules.controller.js';

@Module({
  controllers: [AttendanceRulesController],
  providers: [AttendanceRulesService],
  exports: [AttendanceRulesService],
})
export class AttendanceRulesModule {}
