import { Module } from '@nestjs/common';
import { MachineMarksService } from './machine-marks.service';
import { MachineMarksController } from './machine-marks.controller';

@Module({
  controllers: [MachineMarksController],
  providers: [MachineMarksService],
})
export class MachineMarksModule {}
