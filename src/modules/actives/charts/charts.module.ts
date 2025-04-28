import { Module } from '@nestjs/common';
import { ActivesChartsController } from './charts.controller';
import { ActivesChartsService } from './charts.service';
import { MachinesModule } from '../../machines/machines.module';

@Module({
  imports: [MachinesModule],
  controllers: [ActivesChartsController],
  providers: [ActivesChartsService],
})
export class ActivesChartsModule {}
